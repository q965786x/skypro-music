import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackType } from '@/sharedTypes/sharedTypes';

type initialStateType = {
  currentTrack: TrackType | null;
  isPlay: boolean;
  playlist: TrackType[];
  shuffledPlaylist: TrackType[];
  isShuffle: boolean;
};

const initialState: initialStateType = {
  currentTrack: null,
  isPlay: false,
  playlist: [],
  shuffledPlaylist: [],
  isShuffle: false,
};

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<TrackType>) => {
      state.currentTrack = action.payload;
    },
    setCurrentPlaylist: (state, action: PayloadAction<TrackType[]>) => {
      state.playlist = action.payload;
      state.shuffledPlaylist = [...state.playlist].sort(
        () => Math.random() - 0.5,
      );
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlay = action.payload;
    },
    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
    },
    setNextTrack: (state) => {
      if (!state.currentTrack) return;

      const playlist = state.isShuffle
        ? state.shuffledPlaylist
        : state.playlist;

      if (playlist.length === 0) return;

      const curIndex = state.playlist.findIndex(
        (el) => el._id === state.currentTrack?._id,
      );

      if (curIndex === -1) return;

      const nextIndexTrack = curIndex + 1;

      if (nextIndexTrack < playlist.length) {
        state.currentTrack = playlist[nextIndexTrack];
      }
    },
    setPrevTrack: (state) => {
      if (!state.currentTrack) return;

      const playlist = state.isShuffle
        ? state.shuffledPlaylist
        : state.playlist;

      if (playlist.length === 0) return;

      const curIndex = state.playlist.findIndex(
        (el) => el._id === state.currentTrack?._id,
      );

      if (curIndex === -1) return;

      const prevIndexTrack = curIndex - 1;

      if (prevIndexTrack >= 0) {
        state.currentTrack = playlist[prevIndexTrack];
      }
    },
  },
});

export const {
  setCurrentTrack,
  setIsPlaying,
  setCurrentPlaylist,
  setNextTrack,
  setPrevTrack,
  toggleShuffle,
} = trackSlice.actions;
export const trackSliceReducer = trackSlice.reducer;
