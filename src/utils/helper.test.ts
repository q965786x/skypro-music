import { formatTime, getTimePanel, getUniqueValuesByKey } from './helper';

describe('formatTime', () => {
  it('Добавляет ноль если секунд < 10', () => {
    expect(formatTime(61)).toBe('1:01');
  });
  it('Форматирует время < 1 минуты', () => {
    expect(formatTime(35)).toBe('0:35');
  });
  it('Обрабатывает 0 секунд', () => {
    expect(formatTime(0)).toBe('0:00');
  });
  it('обрабатывает большие значения времени', () => {
    expect(formatTime(3665)).toBe('61:05'); // 61 минута 5 секунд
  });
  it('округляет секунды вниз', () => {
    expect(formatTime(125.7)).toBe('2:05');
  });
});

describe('getTimePanel', () => {
  it('форматирует текущее и общее время', () => {
    expect(getTimePanel(65, 180)).toBe('1:05 / 3:00');
  });

  it('возвращает undefined если нет общего времени', () => {
    expect(getTimePanel(65, undefined)).toBeUndefined();
  });

  it('обрабатывает нулевые значения', () => {
    expect(getTimePanel(0, 0)).toBe('0:00 / 0:00');
  });
});

describe('getUniqueValuesByKey', () => {
  const testTracks = [
    {
      _id: 1,
      author: 'Artist1',
      genre: ['rock', 'pop'],
      name: 'Song1',
      release_date: '2020',
      duration_in_seconds: 180,
      album: 'Album1',
      logo: null,
      track_file: '',
      stared_user: [],
    },
    {
      _id: 2,
      author: 'Artist2',
      genre: ['jazz', 'rock'],
      name: 'Song2',
      release_date: '2021',
      duration_in_seconds: 200,
      album: 'Album2',
      logo: null,
      track_file: '',
      stared_user: [],
    },
    {
      _id: 3,
      author: 'Artist1',
      genre: ['classical'],
      name: 'Song3',
      release_date: '2019',
      duration_in_seconds: 240,
      album: 'Album3',
      logo: null,
      track_file: '',
      stared_user: [],
    },
  ];

  it('возвращает уникальные значения для строкового поля', () => {
    const result = getUniqueValuesByKey(testTracks, 'author');
    expect(result).toEqual(['Artist1', 'Artist2']);
    expect(result).toHaveLength(2);
  });

  it('возвращает уникальные значения для массива строк', () => {
    const result = getUniqueValuesByKey(testTracks, 'genre');
    expect(result).toEqual(['rock', 'pop', 'jazz', 'classical']);
    expect(result).toHaveLength(4);
  });

  it('возвращает пустой массив для пустого входного массива', () => {
    const result = getUniqueValuesByKey([], 'author');
    expect(result).toEqual([]);
  });

  it('обрабатывает null и undefined значения', () => {
    const tracksWithNull = [
      {
        _id: 1,
        author: 'Artist1',
        genre: null,
        name: 'Song1',
        release_date: '2020',
        duration_in_seconds: 180,
        album: 'Album1',
        logo: null,
        track_file: '',
        stared_user: [],
      },
    ];
    // @ts-ignore - для теста игнорируем тип
    const result = getUniqueValuesByKey(tracksWithNull, 'genre');
    expect(result).toEqual([]);
  });
});
