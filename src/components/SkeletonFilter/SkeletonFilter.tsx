import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styles from './skeletonfilter.module.css';

export default function SkeletonFilter() {
  return (
    <div className={styles.skeletonFilter}>
      <span className={styles.skeletonFilter__title}>
        <Skeleton width={80} />
      </span>
      <div className={styles.skeletonFilter__buttons}>
        <Skeleton width={120} height={36} borderRadius={60} />
        <Skeleton width={140} height={36} borderRadius={60} />
        <Skeleton width={100} height={36} borderRadius={60} />
      </div>
    </div>
  );
}
