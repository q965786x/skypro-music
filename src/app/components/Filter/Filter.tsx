import styles from './filter.module.css';
import classnames from 'classnames';

export default function Filter() {
  return (
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
  );
}
