import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from '@/components/Centerblock/centerblock.module.css';
import classNames from 'classnames';

export default function Loading() {
  // Вы можете создать более детальный скелетон для всей страницы
  // или использовать уже существующий SkeletonTrackList
  return (
    <div className={styles.centerblock}>
      <div className={styles.centerblock__search}>
        <Skeleton width="100%" height={50} />
      </div>
      <div className={styles.centerblock__filter}>
        <Skeleton width={80} />
        <Skeleton width={120} height={36} borderRadius={60} />
        <Skeleton width={140} height={36} borderRadius={60} />
        <Skeleton width={100} height={36} borderRadius={60} />
      </div>
      <h2 className={styles.centerblock__h2}>
        <Skeleton width={300} />
      </h2>
      <div className={styles.content__title}>
        {/* ... заголовки колонок (можно тоже сделать скелетоны) */}
      </div>
      <div className={styles.content__playlist}>
        {Array(6)
          .fill(null)
          .map((_, i) => (
            <div key={i} className={styles.playlist__item}>
              <Skeleton height={51} />
            </div>
          ))}
      </div>
    </div>
  );
}
