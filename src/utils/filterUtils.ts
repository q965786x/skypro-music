import { TrackType } from '@/sharedTypes/sharedTypes';

export const getUniqueArtists = (tracks: TrackType[]): string[] => {
  const artists = tracks.map((track) => track.author);
  return [...new Set(artists)];
};

export const getUniqueGenres = (tracks: TrackType[]): string[] => {
  const allGenres = tracks.flatMap((track) => track.genre);
  return [...new Set(allGenres)];
};

export const getUniqueYears = (tracks: TrackType[]): string[] => {
  const years = tracks.map((track) => track.release_date);
  return [...new Set(years)];
};
