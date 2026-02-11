'use client';

import { useAppDispatch, useAppSelector } from '@/store/store';
import styles from './bar.module.css';
import classnames from 'classnames';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  setIsPlaying,
  setNextTrack,
  setPrevTrack,
  toggleShuffle,
} from '@/store/features/trackSlice';
import { getTimePanel } from '@/utils/helper';
import ProgressBar from '../ProgressBar/ProgressBar';

export default function Bar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dispatch = useAppDispatch();

  const [isLoop, setIsLoop] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isLoadedTrack, setIsLoadedTrack] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFirstTrack, setIsFirstTrack] = useState(false);
  const [isLastTrack, setIsLastTrack] = useState(false);

  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);
  const playlist = useAppSelector((state) => state.tracks.playlist);
  const shuffledPlaylist = useAppSelector(
    (state) => state.tracks.shuffledPlaylist,
  );
  const isShuffle = useAppSelector((state) => state.tracks.isShuffle);

  useEffect(() => {
    if (!currentTrack) {
      setIsFirstTrack(true);
      setIsLastTrack(true);
      return;
    }

    const currentPlaylist = isShuffle ? shuffledPlaylist : playlist;

    if (currentPlaylist.length === 0) {
      setIsFirstTrack(true);
      setIsLastTrack(true);
      return;
    }

    const currentIndex = currentPlaylist.findIndex(
      (track) => track._id === currentTrack._id,
    );

    setIsFirstTrack(currentIndex <= 0);
    setIsLastTrack(currentIndex === currentPlaylist.length - 1);
  }, [currentTrack, playlist, shuffledPlaylist, isShuffle]);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const handleLoadedMetadata = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      };

      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener(
            'loadedmetadata',
            handleLoadedMetadata,
          );
        }
      };
    }
  }, [currentTrack]);

  useEffect(() => {
    setIsLoadedTrack(false);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, [currentTrack]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value) / 100;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  if (!currentTrack) return <></>;

  const playTrack = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      dispatch(setIsPlaying(true));
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      dispatch(setIsPlaying(false));
    }
  };

  const handlePlayButtonClick = () => {
    if (isPlay) {
      pauseTrack();
    } else {
      playTrack();
    }
  };

  const onToggleLoop = () => {
    setIsLoop(!isLoop);
    if (audioRef.current) {
      audioRef.current.loop = !isLoop;
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      const trackDuration = audioRef.current.duration;
      setDuration(trackDuration);
      setIsLoadedTrack(true);

      if (isPlay) {
        audioRef.current.play();
        dispatch(setIsPlaying(true));
      }
    }
  };

  const onCanPlay = () => {
    setIsLoadedTrack(true);
  };

  const onChangeProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const inputTime = Number(e.target.value);
      audioRef.current.currentTime = inputTime;
      setCurrentTime(inputTime);
    }
  };

  const onNextTrack = () => {
    if (isLastTrack) return;
    dispatch(setNextTrack());
  };

  const onPrevTrack = () => {
    if (isFirstTrack) return;
    dispatch(setPrevTrack());
  };

  const onToggleShuffle = () => {
    dispatch(toggleShuffle());
  };

  const handleTrackEnded = () => {
    dispatch(setIsPlaying(false));

    if (!isLoop) {
      if (!isLastTrack) {
        dispatch(setNextTrack());
      }
    }
  };

  return (
    <div className={styles.bar}>
      <audio
        className={styles.audio}
        ref={audioRef}
        src={currentTrack.track_file}
        loop={isLoop}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onCanPlay={onCanPlay}
        onEnded={handleTrackEnded}
      />
      <div className={styles.bar__content}>
        <ProgressBar
          max={audioRef.current?.duration || 0}
          step={0.1}
          readOnly={!isLoadedTrack}
          value={currentTime}
          onChange={onChangeProgress}
        />
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div
                onClick={onPrevTrack}
                className={classnames(styles.player__btnPrev, styles.btnIcon, {
                  [styles.player__btnPrev_disabled]: isFirstTrack,
                })}
              >
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>
              <div
                onClick={handlePlayButtonClick}
                className={classnames(styles.player__btnPlay, styles.btn, {
                  [styles.player__btnPlay_active]: isPlay,
                })}
              >
                <svg className={styles.player__btnPlaySvg}>
                  {isPlay ? ( // Меняем иконку в зависимости от состояния
                    <use xlinkHref="/img/icon/sprite.svg#icon-pause"></use>
                  ) : (
                    <use xlinkHref="/img/icon/sprite.svg#icon-play"></use>
                  )}
                </svg>
              </div>
              <div
                onClick={onNextTrack}
                className={classnames(styles.player__btnNext, styles.btnIcon, {
                  [styles.player__btnNext_disabled]: isLastTrack,
                })}
              >
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>
              <div
                onClick={onToggleLoop}
                className={classnames(
                  styles.player__btnRepeat,
                  styles.btnIcon,
                  {
                    [styles.player__btnRepeat_active]: isLoop,
                  },
                )}
              >
                <svg className={styles.player__btnRepeatSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>
              <div
                className={classnames(
                  styles.player__btnShuffle,
                  styles.btnIcon,
                  { [styles.player__btnShuffle_active]: isShuffle },
                )}
                onClick={onToggleShuffle}
              >
                <svg className={styles.player__btnShuffleSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            <div className={styles.player__trackPlay}>
              <div className={styles.trackPlay__contain}>
                <div className={styles.trackPlay__image}>
                  <svg className={styles.trackPlay__svg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div className={styles.trackPlay__author}>
                  <Link className={styles.trackPlay__authorLink} href="">
                    {currentTrack.author}
                  </Link>
                </div>
                <div className={styles.trackPlay__album}>
                  <Link className={styles.trackPlay__albumLink} href="">
                    {currentTrack.album}
                  </Link>
                </div>
              </div>

              <div className={styles.trackPlay__dislike}>
                <div
                  className={classnames(
                    styles.player__btnShuffle,
                    styles.btnIcon,
                  )}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                <div
                  className={classnames(
                    styles.trackPlay__dislike,
                    styles.btnIcon,
                  )}
                >
                  <svg className={styles.trackPlay__dislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div className={styles.volume__image}>
                <svg className={styles.volume__svg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={classnames(styles.volume__progress, styles.btn)}>
                <input
                  className={classnames(
                    styles.volume__progressLine,
                    styles.btn,
                  )}
                  type="range"
                  name="range"
                  min="0"
                  max="100"
                  step=""
                  value={volume * 100}
                  onChange={handleVolumeChange}
                />
              </div>
            </div>
            {/* Блок с временем трека */}
            <div className={styles.player__timeDisplay}>
              <span className={styles.timeDisplay__text}>
                {getTimePanel(currentTime, duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
