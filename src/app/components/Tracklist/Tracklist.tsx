'use client';

import styles from './tracklist.module.css';
import Link from 'next/link';
import { formatTime } from '@/utils/helper';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setCurrentTrack } from '@/store/features/trackSlice';

type TrackListProp = {
  tracks: TrackType[];
};

export default function TrackList({ tracks }: TrackListProp) {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);

  const onClickTrack = (track: TrackType) => {
    dispatch(setCurrentTrack(track));
  };

  return (
    <div className={styles.content__playlist}>
      {tracks.map((track) => {
        const isCurrentTrack = currentTrack?._id === track._id;
        const isBlinking = isCurrentTrack && isPlay;
        return (
          <div
            key={track._id}
            className={styles.playlist__item}
            onClick={() => onClickTrack(track)}
          >
            <div className={styles.playlist__track}>
              <div className={styles.track__title}>
                <div className={styles.track__titleImage}>
                  {isCurrentTrack ? (
                    <div
                      className={`${styles.track__dot} ${isBlinking ? styles.track__dotBlinking : ''}`}
                    />
                  ) : (
                    <svg className={styles.track__titleSvg}>
                      <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                    </svg>
                  )}
                </div>
                <div className="track__title-text">
                  <Link className={styles.track__titleLink} href="">
                    {track.name}{' '}
                    <span className={styles.track__titleSpan}></span>
                  </Link>
                </div>
              </div>
              <div className={styles.track__author}>
                <Link className={styles.track__authorLink} href="">
                  {track.author}
                </Link>
              </div>
              <div className={styles.track__album}>
                <Link className={styles.track__albumLink} href="">
                  {track.album}
                </Link>
              </div>
              <div className="track__time">
                <svg className={styles.track__timeSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                </svg>
                <span className={styles.track__timeText}>
                  {formatTime(track.duration_in_seconds)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
