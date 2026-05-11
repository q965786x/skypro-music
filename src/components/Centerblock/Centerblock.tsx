'use client';

import styles from './centerblock.module.css';
import classnames from 'classnames';
import Search from '../Search/Search';
import { TrackType } from '@/sharedTypes/sharedTypes';
import TrackList from '../Tracklist/Tracklist';
import Filter from '../Filter/Filter';
import { useEffect, useMemo } from 'react';
import { setPagePlaylist } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import SkeletonTracklist from '@/components/SkeletonTracklist/SkeletonTracklist';
import SkeletonFilter from '@/components/SkeletonFilter/SkeletonFilter';

type centerBlockProps = {
  tracks: TrackType[];
  isLoading: boolean;
  errorRes: string | null;
  title: string;
  pagePlaylist: TrackType[];
};

export default function Centerblock({
  errorRes,
  isLoading,
  tracks,
  title,
  pagePlaylist,
}: centerBlockProps) {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector((state) => state.tracks.searchTerm);

  useEffect(() => {
    if (!isLoading && !errorRes && pagePlaylist.length > 0) {
      dispatch(setPagePlaylist(pagePlaylist));
    }
  }, [isLoading, errorRes, pagePlaylist, dispatch]);

  const searchedTracks = useMemo(() => {
    if (searchTerm.length >= 2 && pagePlaylist.length > 0) {
      const searchLower = searchTerm.toLowerCase();
      return pagePlaylist.filter(
        (track) =>
          track.name.toLowerCase().startsWith(searchLower) ||
          track.author.toLowerCase().startsWith(searchLower),
      );
    }
    return pagePlaylist;
  }, [searchTerm, pagePlaylist]);

  const displayedTracks = useMemo(() => {
    if (searchTerm.length >= 2) {
      return searchedTracks;
    }
    return tracks;
  }, [searchTerm, searchedTracks, tracks]);

  return (
    <div className={styles.centerblock}>
      <Search />
      {isLoading ? <SkeletonFilter /> : <Filter tracks={pagePlaylist} />}
      <h2 className={styles.centerblock__h2}>{title}</h2>
      <div className={styles.centerblock__content}>
        <div className={styles.content__title}>
          <div className={classnames(styles.playlistTitle__col, styles.col01)}>
            Трек
          </div>
          <div className={classnames(styles.playlistTitle__col, styles.col02)}>
            Исполнитель
          </div>
          <div className={classnames(styles.playlistTitle__col, styles.col03)}>
            Альбом
          </div>
          <div className={classnames(styles.playlistTitle__col, styles.col04)}>
            <svg className={styles.playlistTitle__svg}>
              <use xlinkHref="/img/icon/sprite.svg#icon-watch"></use>
            </svg>
          </div>
        </div>

        <div className={styles.content__playlist}>
          {errorRes ? (
            <span style={{ color: '#ff6b6b' }}>{errorRes}</span>
          ) : isLoading ? (
            <SkeletonTracklist />
          ) : displayedTracks.length === 0 ? (
            <span style={{ color: '#ffffff' }}>Ничего не найдено</span>
          ) : (
            displayedTracks.map((track) => (
              <TrackList
                key={track._id}
                track={track}
                tracks={displayedTracks}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
