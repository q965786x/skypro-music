'use client';

import styles from '@/app/music/category/[id]/page.module.css';
import Bar from '@/app/components/Bar/Bar';
import Navigation from '@/app/components/Navigation/Navigation';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import { getTracks } from '@/services/tracks/tracksApi';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { setCurrentPlaylist } from '@/store/features/trackSlice';
import { useAppDispatch } from '@/store/store';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Centerblock } from '@/app/components/Centerblock/Centerblock';
import axios from 'axios';
import { BASE_URL } from '@/services/constants';

// Данные для отображения названий подборок
const selectionTitles: Record<string, string> = {
  '2': 'Плейлист дня',
  '3': 'Танцевальные хиты',
  '4': 'Инди заряд',
};

export default function CategoryPage() {
  const params = useParams<{ id: string }>();
  const selectionId = params.id;

  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  // Получаем название подборки по ID из URL (теперь URL ID совпадает с API ID)
  const selectionTitle =
    selectionTitles[selectionId] || `Подборка ${selectionId}`;

  useEffect(() => {
    if (!selectionId) return;

    const fetchSelectionTracks = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Загружаем подборку с ID:', selectionId);

        // 1. Получаем данные подборки по ID из URL
        // Используем эндпоинт: GET - /catalog/selection/<id>/
        const selectionResponse = await axios.get(
          BASE_URL + `/catalog/selection/${selectionId}/`,
        );
        console.log('Ответ от API подборки:', selectionResponse.data);

        // 2. Проверяем структуру ответа
        if (!selectionResponse.data?.success) {
          throw new Error('API вернул ошибку');
        }

        // 3. Проверяем наличие данных
        if (!selectionResponse.data?.data) {
          console.log(`Подборка с ID ${selectionId} не содержит данных`);
          setTracks([]);
          dispatch(setCurrentPlaylist([]));
          setLoading(false);
          return;
        }

        const selectionData = selectionResponse.data.data;

        // 4. Проверяем наличие items с ID треков
        if (!selectionData.items || !Array.isArray(selectionData.items)) {
          console.log(`Подборка с ID ${selectionId} не содержит треков`);
          setTracks([]);
          dispatch(setCurrentPlaylist([]));
          setLoading(false);
          return;
        }
        const trackIds: number[] = selectionData.items;

        console.log(
          `Получены ID треков для подборки ${selectionId}:`,
          trackIds,
        );

        if (trackIds.length === 0) {
          setTracks([]);
          dispatch(setCurrentPlaylist([]));
          setLoading(false);
          return;
        }

        // 5. Получаем все треки
        // Используем эндпоинт: GET - /catalog/track/all/
        const allTracks = await getTracks();
        console.log('✅ Все треки загружены:', allTracks.length);

        // 6. Фильтруем треки по ID из подборки
        const selectionTracks = allTracks.filter((track) =>
          trackIds.includes(track._id),
        );

        console.log(
          `Отфильтровано ${selectionTracks.length} треков для подборки ${selectionId}`,
        );

        setTracks(selectionTracks);
        dispatch(setCurrentPlaylist(selectionTracks));
      } catch (error) {
        console.error(`❌ Ошибка при загрузке подборки ${selectionId}:`, error);

        let errorMessage = 'Не удалось загрузить подборку';

        if (axios.isAxiosError(error)) {
          if (error.response) {
            switch (error.response.status) {
              case 404:
                errorMessage = 'Подборка не найдена';
                break;
              case 500:
                errorMessage = 'Ошибка сервера. Попробуйте позже';
                break;
              default:
                errorMessage = `Ошибка ${error.response.status}: ${error.response.statusText}`;
            }
          } else if (error.request) {
            errorMessage = 'Ошибка соединения. Проверьте интернет';
          }
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectionTracks();
  }, [selectionId, dispatch]);

  if (loading) {
    return (
      <>
        <main className={styles.main}>
          <Navigation />
          <div className={styles.centerblock}>
            <div className={styles.centerblock__loading}>
              Загрузка треков подборки...
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
        <Centerblock
          track={tracks}
          title={selectionTitle}
          subtitle="Подборка"
        />
        <Sidebar />
      </main>
      <Bar />
    </>
  );
}
