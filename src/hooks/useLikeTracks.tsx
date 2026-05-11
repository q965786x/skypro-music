import {
  addFavoriteTrack,
  removeFavoriteTrack,
} from '@/services/tracks/tracksApi';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { addLikedTracks, removeLikedTracks } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { withReAuth } from '@/utils/withReAuth';
import { AxiosError } from 'axios';
import { useState, useCallback } from 'react';
import { showToast } from '@/utils/toastUtils';

type returnTypeHook = {
  isLoading: boolean;
  errorMessage: string | null;
  toggleLike: () => void;
  isLike: boolean;
};

export const useLikeTrack = (track: TrackType | null): returnTypeHook => {
  const { favoriteTracks } = useAppSelector((state) => state.tracks);
  const { access, refresh } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const isLike = track
    ? favoriteTracks.some((t) => t._id === track._id)
    : false;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleLike = useCallback(async () => {
    if (!track) {
      const errorMsg = 'Трек не найден';
      setErrorMessage(errorMsg);
      showToast.error(errorMsg);
      return;
    }

    if (!access && !refresh) {
      const errorMsg = 'Нет авторизации. Пожалуйста, войдите в систему';
      setErrorMessage(errorMsg);
      showToast.warning(errorMsg);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const action = isLike ? 'remove' : 'add';

    try {
      await withReAuth(
        async (newToken) => {
          const token = newToken || access;
          if (action === 'add') {
            return await addFavoriteTrack(token, track._id);
          } else {
            return await removeFavoriteTrack(token, track._id);
          }
        },
        refresh,
        dispatch,
      );

      if (action === 'add') {
        dispatch(addLikedTracks(track));
        showToast.success(`"${track.name}" добавлен в избранное`);
      } else {
        dispatch(removeLikedTracks(track._id));
        showToast.info(`"${track.name}" удален из избранного`);
      }
    } catch (error) {
      let errorMsg = 'Произошла неизвестная ошибка';

      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          errorMsg = 'Сессия истекла. Пожалуйста, войдите снова';
          showToast.error(errorMsg);
          window.location.href = '/auth/signin';
        } else if (error.response) {
          errorMsg =
            error.response.data?.message || 'Ошибка при обновлении лайка';
          showToast.error(errorMsg);
        } else if (error.request) {
          errorMsg = 'Ошибка сети. Проверьте подключение';
          showToast.error(errorMsg);
        } else {
          errorMsg = 'Произошла неизвестная ошибка';
          showToast.error(errorMsg);
        }
      } else if (error instanceof Error) {
        if (error.message === 'Нет refresh токена') {
          errorMsg = 'Сессия истекла. Пожалуйста, войдите снова';
          showToast.error(errorMsg);
          window.location.href = '/auth/signin';
        } else {
          errorMsg = error.message;
          showToast.error(errorMsg);
        }
      } else {
        showToast.error(errorMsg);
      }
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [access, refresh, track, isLike, dispatch]);

  return {
    isLoading,
    errorMessage,
    toggleLike,
    isLike,
  };
};
