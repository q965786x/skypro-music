'use client';

import styles from './page.module.css';
import Navigation from '@/app/components/Navigation/Navigation';
import { Centerblock } from '@/app/components/Centerblock/Centerblock';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import Bar from '@/app/components/Bar/Bar';
import { useEffect, useState } from 'react';
import { getTracks } from '@/services/tracks/tracksApi';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { useAppDispatch } from '@/store/store';
import { setCurrentPlaylist } from '@/store/features/trackSlice';
import { data as mockData } from '@/data';

export default function Home() {
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    const user = localStorage.getItem('user');
    const isAuthenticated = !!user;

    if (!isAuthenticated) {
      // Для незарегистрированного пользователя используем моковые данные
      console.log(
        '✅ Используем моковые данные для незарегистрированного пользователя',
      );
      setTracks(mockData);
      dispatch(setCurrentPlaylist(mockData));
      setLoading(false);
      return;
    }

    // Для зарегистрированного пользователя загружаем данные с API
    getTracks()
      .then((data) => {
        console.log('✅ Получены треки из API:', data);
        console.log('Количество треков:', data.length);

        setTracks(data);
        dispatch(setCurrentPlaylist(data));
        setLoading(false);
      })
      .catch((error) => {
        console.error('❌ Ошибка при загрузке треков:', error);
        setError('Не удалось загрузить треки');
        setLoading(false);
      });
  }, [dispatch]);

  if (loading) {
    return (
      <>
        <main className={styles.main}>
          <Navigation />
          <div className={styles.centerblock}>
            <div className={styles.centerblock__loading}>
              Загрузка треков...
            </div>
          </div>
          <Sidebar />
        </main>
        <Bar />
      </>
    );
  }

  if (error) {
    return (
      <>
        <main className={styles.main}>
          <Navigation />
          <div className={styles.centerblock}>
            <div className={styles.centerblock__error}>
              <h2>Ошибка</h2>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className={styles.centerblock__button}
              >
                Попробовать снова
              </button>
            </div>
          </div>
          <Sidebar />
        </main>
        <Bar />
      </>
    );
  }

  return (
    <>
      <main className={styles.main}>
        <Navigation />
        <Centerblock track={tracks} />
        <Sidebar />
      </main>
      <Bar />
    </>
  );
}
