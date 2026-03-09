import {
  addFavoriteTrack,
  addLike,
  removeFavoriteTrack,
  removeLike,
} from '@/services/tracks/tracksApi';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { addLikedTracks, removeLikedTracks } from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { withReAuth } from '@/utils/withReAuth';
import { AxiosError } from 'axios';
import { useState, useCallback } from 'react';

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

  const isLike = favoriteTracks.some((t) => t._id === track?._id);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Используем useCallback для оптимизации
  const toggleLike = useCallback(() => {
    if (!access) {
      setErrorMessage('Нет авторизации');
      return;
    }

    if (!track) {
      setErrorMessage('Трек не найден');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const action = isLike ? 'remove' : 'add';

    withReAuth(
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
    )
      .then(() => {
        if (action === 'add') {
          dispatch(addLikedTracks(track));
        } else {
          dispatch(removeLikedTracks(track._id));
        }
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            setErrorMessage('Сессия истекла. Пожалуйста, войдите снова');
          } else if (error.response) {
            setErrorMessage(
              error.response.data?.message || 'Ошибка при обновлении лайка',
            );
          } else if (error.request) {
            setErrorMessage('Ошибка сети. Проверьте подключение');
          } else {
            setErrorMessage('Произошла неизвестная ошибка');
          }
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [access, refresh, track, isLike, dispatch]);

  return {
    isLoading,
    errorMessage,
    toggleLike,
    isLike,
  };
};
