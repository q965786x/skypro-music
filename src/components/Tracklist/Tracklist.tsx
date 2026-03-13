'use client';

import styles from './tracklist.module.css';
import classNames from 'classnames';
import Link from 'next/link';
import { formatTime } from '@/utils/helper';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  setCurrentPlaylist,
  setCurrentTrack,
  setIsPlaying,
} from '@/store/features/trackSlice';
import { useLikeTrack } from '@/hooks/useLikeTracks';
import { useCallback, useState } from 'react';

type TrackListProps = {
  track: TrackType;
  tracks: TrackType[];
};

export default function TrackList({ track, tracks }: TrackListProps) {
  const dispatch = useAppDispatch();
  const { isPlay, currentTrack } = useAppSelector((state) => state.tracks);
  const { toggleLike, isLike, isLoading, errorMessage } = useLikeTrack(track);

  const [isAnimating, setIsAnimating] = useState(false);
  const [showError, setShowError] = useState(false);

  const onClickCurrentTrack = useCallback(
    (e: React.MouseEvent, track: TrackType) => {
      e.stopPropagation();

      // Если это тот же трек, просто переключаем воспроизведение
      if (currentTrack?._id === track._id) {
        dispatch(setIsPlaying(!isPlay));
      } else {
        // Если новый трек, устанавливаем его и начинаем воспроизведение
        dispatch(setCurrentTrack(track));
        dispatch(setCurrentPlaylist(tracks));
        dispatch(setIsPlaying(true));
      }
    },
    [currentTrack, isPlay, dispatch, tracks],
  );

  const handleLikeClick = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      if (isLoading) return;

      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);

      await toggleLike();

      // Показываем ошибку если есть
      if (errorMessage) {
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    },
    [toggleLike, isLoading, errorMessage],
  );

  return (
    <div
      className={styles.playlist__item}
      onClick={(e) => onClickCurrentTrack(e, track)}
    >
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          <div className={styles.track__titleImage}>
            {currentTrack?._id === track._id ? (
              <div
                className={classNames(styles.track__dot, {
                  [styles.track__dotBlinking]: isPlay,
                })}
              ></div>
            ) : (
              <svg className={styles.track__titleSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
              </svg>
            )}
          </div>
          <div className="track__titleText">
            <Link className={styles.track__titleLink} href="">
              {track.name}
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

        <div className={styles.track__time}>
          <div className={styles.track__likeContainer}>
            {isLoading && <span className={styles.track__likeLoader}>...</span>}
            <svg
              className={classNames(styles.track__timeSvg, {
                [styles.liked]: isLike,
                [styles.disliked]: !isLike,
                [styles.animating]: isAnimating,
                [styles.loading]: isLoading,
              })}
              onClick={handleLikeClick}
            >
              <use
                xlinkHref={`/img/icon/sprite.svg#${isLike ? 'icon-like' : 'icon-dislike'}`}
              ></use>
            </svg>
            {showError && (
              <div className={styles.track__errorTooltip}>{errorMessage}</div>
            )}
          </div>
          <span className={styles.track__timeText}>
            {formatTime(track.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
