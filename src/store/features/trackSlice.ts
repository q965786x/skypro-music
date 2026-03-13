import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { applyFilters } from '@/utils/applyFilters';

export type initialStateType = {
  currentTrack: TrackType | null;
  isPlay: boolean;
  currentPlaylist: TrackType[];
  shuffledPlaylist: TrackType[];
  isShuffle: boolean;
  allTracks: TrackType[];
  favoriteTracks: TrackType[];
  originalIndex: number | null;
  fetchError: null | string;
  fetchIsLoading: boolean;
  pagePlaylist: TrackType[];
  filteredTracks: TrackType[];
  filters: {
    authors: string[];
    genres: string[];
    years: string;
  };
  searchTerm: string; // Добавляем поле для поискового запроса
  searchedTracks: TrackType[]; // Добавляем поле для отфильтрованных по поиску треков
};

const initialState: initialStateType = {
  currentTrack: null,
  isPlay: false,
  currentPlaylist: [],
  shuffledPlaylist: [],
  isShuffle: false,
  allTracks: [],
  favoriteTracks: [],
  originalIndex: null,
  fetchError: null,
  fetchIsLoading: true,
  pagePlaylist: [],
  filteredTracks: [],
  filters: {
    authors: [],
    genres: [],
    years: '',
  },
  searchTerm: '',
  searchedTracks: [],
};

//Вспомогательная функция для получения следующего или предыдущего трека
const getNextOrPrevTrack = (
  playlist: TrackType[],
  currentTrack: TrackType | null,
  direction: 'next' | 'prev',
): TrackType | null => {
  if (!currentTrack) return null;

  const currIdx = playlist.findIndex((el) => el._id === currentTrack._id);
  if (currIdx === -1) return null;

  const newIdx = direction === 'next' ? currIdx + 1 : currIdx - 1;
  if (newIdx < 0 || newIdx >= playlist.length) return null;

  return playlist[newIdx];
};

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
      state.currentTrack = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },
    setIsShuffled: (state, action: PayloadAction<boolean>) => {
      state.isShuffle = action.payload;
    },
    setCurrentPlaylist: (state, action: PayloadAction<TrackType[]>) => {
      state.currentPlaylist = action.payload;
      state.shuffledPlaylist = [...action.payload].sort(
        () => Math.random() - 0.5,
      );
    },
    setNextTrack: (state) => {
      const playlist = state.isShuffle
        ? state.shuffledPlaylist
        : state.currentPlaylist;
      const nextTrack = getNextOrPrevTrack(
        playlist,
        state.currentTrack,
        'next',
      );
      if (nextTrack) {
        state.currentTrack = nextTrack;
      }
    },
    setPrevTrack: (state) => {
      const playlist = state.isShuffle
        ? state.shuffledPlaylist
        : state.currentPlaylist;
      const prevTrack = getNextOrPrevTrack(
        playlist,
        state.currentTrack,
        'prev',
      );
      if (prevTrack) {
        state.currentTrack = prevTrack;
      }
    },
    setAllTracks: (state, action: PayloadAction<TrackType[]>) => {
      state.allTracks = action.payload;
    },
    setFavoriteTracks: (state, action: PayloadAction<TrackType[]>) => {
      state.favoriteTracks = action.payload;
    },
    addLikedTracks: (state, action: PayloadAction<TrackType>) => {
      state.favoriteTracks = [...state.favoriteTracks, action.payload];
    },
    removeLikedTracks: (state, action: PayloadAction<number>) => {
      state.favoriteTracks = state.favoriteTracks.filter(
        (track) => track._id !== action.payload,
      );
    },
    setFetchError: (state, action: PayloadAction<string>) => {
      state.fetchError = action.payload;
    },
    setFetchIsLoading: (state, action: PayloadAction<boolean>) => {
      state.fetchIsLoading = action.payload;
    },
    setPagePlaylist: (state, action) => {
      state.pagePlaylist = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.filteredTracks = applyFilters(state); // Применяем все фильтры вместе с поиском
    },
    setFilterAuthors: (state, action: PayloadAction<string>) => {
      const author = action.payload;
      if (state.filters.authors.includes(author)) {
        state.filters.authors = state.filters.authors.filter((el) => {
          return el !== author;
        });
      } else {
        state.filters.authors = [...state.filters.authors, author];
      }

      state.filteredTracks = applyFilters(state);
    },
    setFilterGenres: (state, action: PayloadAction<string>) => {
      const genres = action.payload;
      if (state.filters.genres.includes(genres)) {
        state.filters.genres = state.filters.genres.filter((el) => {
          return el !== genres;
        });
      } else {
        state.filters.genres = [...state.filters.genres, genres];
      }

      state.filteredTracks = applyFilters(state);
    },
    setFilterYear: (state, action: PayloadAction<string>) => {
      state.filters.years = action.payload;
      state.filteredTracks = applyFilters(state);
    },
    resetFilters: (state) => {
      state.filters = {
        authors: [],
        genres: [],
        years: 'По умолчанию',
      };
      state.filteredTracks = state.pagePlaylist; // Сбрасываем отфильтрованные треки
      state.searchTerm = ''; // Сбрасываем поисковый запрос
    },
  },
});

export const {
  setCurrentTrack,
  setIsPlaying,
  setCurrentPlaylist,
  setNextTrack,
  setPrevTrack,
  setIsShuffled,
  setAllTracks,
  setFetchError,
  setFetchIsLoading,
  setFavoriteTracks,
  addLikedTracks,
  removeLikedTracks,
  setPagePlaylist,
  setFilterAuthors,
  setFilterGenres,
  setFilterYear,
  setSearchTerm,
  resetFilters,
} = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;
