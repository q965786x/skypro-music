import { data } from '@/data';
import { initialStateType } from '@/store/features/trackSlice';
import { applyFilters } from './applyFilters';

describe('applyFilters', () => {
  const mockState: initialStateType = {
    currentTrack: null,
    isPlay: false,
    currentPlaylist: [],
    shuffledPlaylist: [],
    isShuffle: false,
    allTracks: data,
    favoriteTracks: [],
    originalIndex: null,
    fetchError: null,
    fetchIsLoading: false,
    pagePlaylist: data,
    filteredTracks: [],
    filters: {
      authors: [],
      genres: [],
      years: 'По умолчанию',
    },
    searchTerm: '',
    searchedTracks: [],
  };

  it('возвращает все треки когда нет фильтров', () => {
    const result = applyFilters(mockState);
    expect(result).toEqual(data);
    expect(result).toHaveLength(data.length);
  });

  it('фильтрует по автору', () => {
    const state = {
      ...mockState,
      filters: { ...mockState.filters, authors: ['Kevin Macleod'] },
    };
    const result = applyFilters(state);
    expect(result).toHaveLength(1);
    expect(result[0].author).toBe('Kevin Macleod');
  });

  it('фильтрует по нескольким авторам', () => {
    const state = {
      ...mockState,
      filters: { ...mockState.filters, authors: ['Kevin Macleod', 'Mixkit'] },
    };
    const result = applyFilters(state);
    expect(result).toHaveLength(2);
    expect(result.map((t) => t.author)).toContain('Kevin Macleod');
    expect(result.map((t) => t.author)).toContain('Mixkit');
  });

  it('фильтрует по жанру', () => {
    const state = {
      ...mockState,
      filters: { ...mockState.filters, genres: ['Классическая музыка'] },
    };
    const result = applyFilters(state);
    expect(result.length).toBeGreaterThan(0);
    expect(
      result.every((track) => track.genre.includes('Классическая музыка')),
    ).toBe(true);
  });

  it('сортирует по году "Сначала новые"', () => {
    const state = {
      ...mockState,
      filters: { ...mockState.filters, years: 'Сначала новые' },
    };
    const result = applyFilters(state);
    const dates = result.map((t) => new Date(t.release_date).getTime());
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  it('сортирует по году "Сначала старые"', () => {
    const state = {
      ...mockState,
      filters: { ...mockState.filters, years: 'Сначала старые' },
    };
    const result = applyFilters(state);
    const dates = result.map((t) => new Date(t.release_date).getTime());
    expect(dates).toEqual([...dates].sort((a, b) => a - b));
  });

  it('фильтрует по поисковому запросу', () => {
    const state = {
      ...mockState,
      searchTerm: 'ch',
    };
    const result = applyFilters(state);
    expect(result.length).toBeGreaterThan(0);
    expect(
      result.every(
        (t) =>
          t.name.toLowerCase().startsWith('ch') ||
          t.author.toLowerCase().startsWith('ch'),
      ),
    ).toBe(true);
  });

  it('не применяет поиск при запросе меньше 2 символов', () => {
    const state = {
      ...mockState,
      searchTerm: 'c',
    };
    const result = applyFilters(state);
    expect(result).toEqual(data);
  });

  it('комбинирует фильтры и поиск', () => {
    const state = {
      ...mockState,
      filters: { ...mockState.filters, authors: ['Kevin Macleod'] },
      searchTerm: 'sne',
    };
    const result = applyFilters(state);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Sneaky Snitch');
  });
});
