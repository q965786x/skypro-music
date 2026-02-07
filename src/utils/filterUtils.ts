import { TrackType } from '@/sharedTypes/sharedTypes';

// Получение уникальных исполнителей
export function getUniqueArtists(
  tracks: TrackType[],
): Array<{ value: string; count: number }> {
  const artistMap = new Map<string, number>();

  tracks.forEach((track) => {
    const count = artistMap.get(track.author) || 0;
    artistMap.set(track.author, count + 1);
  });

  return Array.from(artistMap.entries())
    .map(([artist, count]) => ({ value: artist, count }))
    .sort((a, b) => a.value.localeCompare(b.value));
}

// Получение уникальных годов
export function getUniqueYears(
  tracks: TrackType[],
): Array<{ value: string; count: number }> {
  const yearMap = new Map<string, number>();

  tracks.forEach((track) => {
    const year = track.release_date.split('_')[0];
    const count = yearMap.get(year) || 0;
    yearMap.set(year, count + 1);
  });

  return Array.from(yearMap.entries())
    .map(([year, count]) => ({ value: year, count }))
    .sort((a, b) => b.value.localeCompare(a.value)); // Сортировка по убыванию года
}

// Получение уникальных жанров
export function getUniqueGenres(
  tracks: TrackType[],
): Array<{ value: string; count: number }> {
  const genreMap = new Map<string, number>();

  tracks.forEach((track) => {
    track.genre.forEach((genre) => {
      const count = genreMap.get(genre) || 0;
      genreMap.set(genre, count + 1);
    });
  });

  return Array.from(genreMap.entries())
    .map(([genre, count]) => ({ value: genre, count }))
    .sort((a, b) => a.value.localeCompare(b.value));
}
