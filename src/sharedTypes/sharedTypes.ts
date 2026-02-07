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

export interface CenterblockProps {
  tracks: TrackType[];
}

export interface FilterProps {}

export interface TrackListProps {
  tracks: TrackType[];
}

export type FilterType = 'artist' | 'year' | 'genre';

export interface FilterItem {
  value: string;
  count: number;
}
