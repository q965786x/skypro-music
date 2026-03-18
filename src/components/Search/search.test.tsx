import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Search from './Search';
import ReduxProvider from '@/store/ReduxProvider';
import { RootState } from '@/store/store';
import { initialStateType } from '@/store/features/trackSlice';

// Создаем полный мок для initialStateType
const mockTrackState: initialStateType = {
  currentTrack: null,
  isPlay: false,
  currentPlaylist: [],
  shuffledPlaylist: [],
  isShuffle: false,
  allTracks: [],
  favoriteTracks: [],
  originalIndex: null,
  fetchError: null,
  fetchIsLoading: false,
  pagePlaylist: [],
  filteredTracks: [],
  filters: {
    authors: [],
    genres: [],
    years: 'По умолчанию',
  },
  searchTerm: '',
  searchedTracks: [],
};

// Мокаем dispatch
const mockDispatch = jest.fn();
jest.mock('@/store/store', () => ({
  ...jest.requireActual('@/store/store'),
  useAppDispatch: () => mockDispatch,
  useAppSelector: (
    selector: (state: RootState) => RootState[keyof RootState],
  ) =>
    selector({
      tracks: mockTrackState,
      auth: {
        username: '',
        access: '',
        refresh: '',
      },
    } as RootState),
}));

describe('Search Component', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    render(
      <ReduxProvider>
        <Search />
      </ReduxProvider>,
    );
  });

  test('отображает поле поиска', () => {
    const searchInput = screen.getByPlaceholderText('Поиск');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'search');
  });

  test('отображает иконку поиска', () => {
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('search__svg');
  });

  test('обновляет значение при вводе текста', () => {
    const searchInput = screen.getByPlaceholderText('Поиск');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(searchInput).toHaveValue('test');
  });

  test('вызывает dispatch когда длина >= 2', async () => {
    const searchInput = screen.getByPlaceholderText('Поиск');
    fireEvent.change(searchInput, { target: { value: 'te' } });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  test('вызывает dispatch при очистке поля', async () => {
    const searchInput = screen.getByPlaceholderText('Поиск');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(2);
    });
  });

  test('не вызывает dispatch при длине = 1', async () => {
    const searchInput = screen.getByPlaceholderText('Поиск');
    fireEvent.change(searchInput, { target: { value: 't' } });

    // Даем время на возможный вызов dispatch
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
