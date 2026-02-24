export interface TrackType {
  _id: number;
  name: string;
  author: string;
  release_date: string;
  genre: string[];
  duration_in_seconds: number;
  album: string;
  logo: string | null;
  track_file: string;
  stared_user: string[] | number[];
}

export type CenterblockProps = {
  track: TrackType[];
  onTrackSelect?: (track: TrackType) => void; // Добавляем проп для выбора трека
  title?: string; // Добавляем опциональный заголовок
  subtitle?: string; // Добавляем опциональный подзаголовок
};

export type FilterType = 'artist' | 'year' | 'genre';

export type FilterItem = {
  value: string;
  count: number;
};

export type FilterProps = {};

export type BarProps = {
  currentTrack?: TrackType | null; // Добавляем проп для Bar
};

export type TrackListProp = {
  track: TrackType[];
};
