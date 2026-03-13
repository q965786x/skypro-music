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

type centerBlockProps = {
  tracks: TrackType[]; // Отображаемые треки (с учетом фильтров)
  isLoading: boolean;
  errorRes: string | null;
  title: string;
  pagePlaylist: TrackType[]; // Все треки текущей страницы (для поиска)
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

  // Устанавливаем pagePlaylist при загрузке
  useEffect(() => {
    if (!isLoading && !errorRes && pagePlaylist.length > 0) {
      dispatch(setPagePlaylist(pagePlaylist));
    }
  }, [isLoading, errorRes, pagePlaylist, dispatch]);

  // Применяем поиск к трекам текущей страницы (pagePlaylist)
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

  // Определяем, какие треки показывать:
  // - Если есть поисковый запрос, показываем результаты поиска по pagePlaylist
  // - Если нет поиска, показываем отфильтрованные треки
  const displayedTracks = useMemo(() => {
    if (searchTerm.length >= 2) {
      return searchedTracks;
    }
    return tracks;
  }, [searchTerm, searchedTracks, tracks]);

  return (
    <div className={styles.centerblock}>
      <Search />
      {/* Передаем все треки страницы для фильтров */}
      <Filter tracks={pagePlaylist} />
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
            <span style={{ color: '#ffffff' }}>Загрузка</span>
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
