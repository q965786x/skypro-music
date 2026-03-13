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

export type ResCategoryApiType = {
  categoryId: string;
};

export type FilterType = 'author' | 'year' | 'genre';

export type BarProps = {
  currentTrack?: TrackType | null; // Добавляем проп для Bar
};
