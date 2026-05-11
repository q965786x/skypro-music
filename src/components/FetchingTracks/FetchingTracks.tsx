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
import { showToast } from '@/utils/toastUtils';

export default function FetchingTracks() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { allTracks } = useAppSelector((state) => state.tracks);
  const { access, refresh } = useAppSelector((state) => state.auth);

  const fetchData = useCallback(async () => {
    dispatch(setFetchIsLoading(true));

    try {
      const tracks = await getTracks();
      dispatch(setAllTracks(tracks));

      if (access && refresh) {
        try {
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
          showToast.error(
            error.response.data?.message || 'Ошибка загрузки треков',
          );
        } else if (error.request) {
          showToast.error('Ошибка сети. Проверьте подключение');
        } else {
          showToast.error('Неизвестная ошибка при загрузке');
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
