import styles from './centerblock.module.css';
import classnames from 'classnames';
import Search from '../Search/Search';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { data } from '@/data';
import TrackList from '../Tracklist/Tracklist';
import Filter from '../Filter/Filter';

type centerBlockProps = {
  tracks: TrackType[];
  isLoading: boolean;
  errorRes: string | null;
  title: string;
};

export function Centerblock({
  errorRes,
  isLoading,
  tracks,
  title,
}: centerBlockProps) {
  return (
    <div className={styles.centerblock}>
      <Search />
      <Filter tracks={isLoading ? data : tracks} />
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
          ) : (
            tracks.map((track) => (
              <TrackList key={track._id} track={track} tracks={tracks} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
