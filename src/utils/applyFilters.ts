import { initialStateType } from '@/store/features/trackSlice';

export const applyFilters = (state: initialStateType) => {
  let filteredPlaylist = state.pagePlaylist;

  if (state.searchTerm && state.searchTerm.length >= 2) {
    const searchLower = state.searchTerm.toLowerCase();
    filteredPlaylist = filteredPlaylist.filter(
      (track) =>
        track.name.toLowerCase().startsWith(searchLower) ||
        track.author.toLowerCase().startsWith(searchLower),
    );
  }

  if (state.filters.authors.length) {
    filteredPlaylist = filteredPlaylist.filter((track) => {
      return state.filters.authors.includes(track.author);
    });
  }

  if (state.filters.genres.length) {
    filteredPlaylist = filteredPlaylist.filter((track) => {
      return state.filters.genres.some((el) => track.genre.includes(el));
    });
  }

  if (state.filters.years && state.filters.years !== 'По умолчанию') {
    filteredPlaylist = [...filteredPlaylist].sort((a, b) => {
      if (state.filters.years === 'Сначала новые') {
        return (
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime()
        );
      } else if (state.filters.years === 'Сначала старые') {
        return (
          new Date(a.release_date).getTime() -
          new Date(b.release_date).getTime()
        );
      }
      return 0;
    });
  }

  return filteredPlaylist;
};
