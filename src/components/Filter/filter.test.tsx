import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Filter from './Filter';
import ReduxProvider from '@/store/ReduxProvider';
import { data } from '@/data';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { RootState } from '@/store/store';

// Определяем интерфейс для пропсов FilterItem
interface MockFilterItemProps {
  titleFilter: string;
  list: string[];
  onSelect: (item: string) => void;
  activeFilter: string | null;
  nameFilter: string;
  changeActiveFilter: (name: string) => void;
  selectedItems?: string[];
  multiple?: boolean;
}

// Мокаем FilterItem компонент с правильными типами
jest.mock('@/components/FilterItem/FilterItem', () => {
  return function MockFilterItem({
    titleFilter,
    list,
    onSelect,
    activeFilter,
    nameFilter,
    changeActiveFilter,
  }: MockFilterItemProps) {
    return (
      <div data-testid={`filter-${nameFilter}`}>
        <button onClick={() => changeActiveFilter(nameFilter)}>
          {titleFilter}
        </button>
        {activeFilter === nameFilter && (
          <ul>
            {list.map((item: string, index: number) => (
              <li key={index} onClick={() => onSelect(item)}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
});

// Создаем мок для состояния треков
const mockTrackState = {
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
    years: 'По умолчанию' as const,
  },
  searchTerm: '',
  searchedTracks: [],
};

// Создаем мок для состояния аутентификации
const mockAuthState = {
  username: '',
  access: '',
  refresh: '',
};

// Создаем полный мок RootState
const mockRootState: RootState = {
  tracks: mockTrackState,
  auth: mockAuthState,
} as RootState;

// Мокаем хуки Redux
const mockDispatch = jest.fn();
jest.mock('@/store/store', () => ({
  ...jest.requireActual('@/store/store'),
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: (state: RootState) => unknown) =>
    selector(mockRootState),
}));

describe('Filter Component', () => {
  const mockTracks: TrackType[] = data;

  beforeEach(() => {
    mockDispatch.mockClear();
    render(
      <ReduxProvider>
        <Filter tracks={mockTracks} />
      </ReduxProvider>,
    );
  });

  test('отображает заголовок фильтра', () => {
    expect(screen.getByText('Искать по:')).toBeInTheDocument();
  });

  test('отображает все кнопки фильтров', () => {
    expect(screen.getByText('исполнителю')).toBeInTheDocument();
    expect(screen.getByText('году выпуска')).toBeInTheDocument();
    expect(screen.getByText('жанру')).toBeInTheDocument();
  });

  test('открывает список исполнителей при клике', () => {
    const authorButton = screen.getByText('исполнителю');
    fireEvent.click(authorButton);

    // Проверяем, что появились уникальные исполнители
    const uniqueAuthors = [
      ...new Set(mockTracks.map((t: TrackType) => t.author)),
    ];
    uniqueAuthors.forEach((author) => {
      expect(screen.getByText(author)).toBeInTheDocument();
    });
  });

  test('открывает список жанров при клике', () => {
    const genreButton = screen.getByText('жанру');
    fireEvent.click(genreButton);

    // Проверяем, что появились уникальные жанры
    const uniqueGenres = [
      ...new Set(mockTracks.flatMap((t: TrackType) => t.genre)),
    ];
    uniqueGenres.forEach((genre) => {
      expect(screen.getByText(genre)).toBeInTheDocument();
    });
  });

  test('открывает список годов при клике', () => {
    const yearButton = screen.getByText('году выпуска');
    fireEvent.click(yearButton);

    expect(screen.getByText('По умолчанию')).toBeInTheDocument();
    expect(screen.getByText('Сначала новые')).toBeInTheDocument();
    expect(screen.getByText('Сначала старые')).toBeInTheDocument();
  });

  test('закрывает список при повторном клике', () => {
    const authorButton = screen.getByText('исполнителю');
    fireEvent.click(authorButton);

    const firstAuthor = mockTracks[0].author;
    expect(screen.getByText(firstAuthor)).toBeInTheDocument();

    fireEvent.click(authorButton);
    expect(screen.queryByText(firstAuthor)).not.toBeInTheDocument();
  });
});
