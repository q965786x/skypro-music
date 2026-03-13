'use client';

import { getTracks, getFavoriteTracks } from '@/services/tracks/tracksApi';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { AxiosError } from 'axios';
import { useEffect, useCallback } from 'react';
import {
  setAllTracks,
  setFetchError,
  setFetchIsLoading,
  setFavoriteTracks,
} from '@/store/features/trackSlice';
import { withReAuth } from '@/utils/withReAuth';
import { useRouter } from 'next/navigation';
import { clearUser } from '@/store/features/authSlice';

export default function FetchingTracks() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { allTracks } = useAppSelector((state) => state.tracks);
  const { access, refresh } = useAppSelector((state) => state.auth);

  const fetchData = useCallback(async () => {
    dispatch(setFetchIsLoading(true));

    try {
      // Загружаем все треки (не требует авторизации)
      const tracks = await getTracks();
      dispatch(setAllTracks(tracks));

      // Если пользователь авторизован, загружаем избранные треки
      if (access && refresh) {
        try {
          // Используем withReAuth для автоматического обновления токена при 401
          const favoriteTracks = await withReAuth(
            async (newToken) => {
              const token = newToken || access;
              return await getFavoriteTracks(token);
            },
            refresh,
            dispatch,
          );
          dispatch(setFavoriteTracks(favoriteTracks));
        } catch (favError) {
          console.error('Ошибка загрузки избранных треков:', favError);
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          dispatch(
            setFetchError(error.response.data?.message || 'Ошибка загрузки'),
          );
        } else if (error.request) {
          dispatch(setFetchError('Ошибка сети. Проверьте подключение'));
        } else {
          dispatch(setFetchError('Неизвестная ошибка'));
        }
      }
    } finally {
      dispatch(setFetchIsLoading(false));
    }
  }, [dispatch, access, refresh]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <></>;
}
