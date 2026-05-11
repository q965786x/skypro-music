import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import classNames from 'classnames';
import styles from './skeletontracklist.module.css';

const TRACKS_COUNT = 8;
export default function SkeletonTracklist() {
  return (
    <div className={styles.skeletonPlaylist}>
      {Array(TRACKS_COUNT)
        .fill(null)
        .map((__, index) => (
          <div key={index} className={styles.skeletonPlaylist__item}>
            <div className={styles.skeletonPlaylist__track}>
              <div className={styles.skeletonPlaylist__titleImage}>
                <Skeleton circle width={51} height={51} />
              </div>
              <div className={styles.skeletonPlaylist__titleText}>
                <Skeleton width={200} />
              </div>
              <div className={styles.skeletonPlaylist__author}>
                <Skeleton width={120} />
              </div>
              <div className={styles.skeletonPlaylist__album}>
                <Skeleton width={150} />
              </div>
              <div className={styles.skeletonPlaylist__time}>
                <Skeleton width={50} />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
