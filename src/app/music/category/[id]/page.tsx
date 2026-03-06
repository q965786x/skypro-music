'use client';

import { TrackType } from '@/sharedTypes/sharedTypes';
import { useAppSelector } from '@/store/store';
import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Centerblock } from '@/app/components/Centerblock/Centerblock';
import { AxiosError } from 'axios';
import { getSelectionById } from '@/services/tracks/tracksApi';

// Данные для отображения названий подборок
const selectionTitles: Record<string, string> = {
  '1': 'Плейлист дня',
  '2': '100 Танцевальных хитов',
  '3': 'Инди заряд',
};

type SelectionResponse = {
  data: {
    _id: number;
    name: string;
    items: number[]; // Массив ID треков
  };
};

export default function CategoryPage() {
  const params = useParams<{ id: string }>();
  const { allTracks, fetchIsLoading } = useAppSelector((state) => state.tracks);
  const [isLoading, setIsLoading] = useState(false);
  const [errorRes, setErrorRes] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const id = params.id;

  useEffect(() => {
    const fetchCategoryTracks = async () => {
      if (!id) return;

      setIsLoading(true);
      setErrorRes(null);

      try {
        // Получаем подборку по ID
        const response = await getSelectionById(id);
        const selectionData = response.data;

        // Устанавливаем название из ответа API или из маппинга
        setTitle(selectionData.name || selectionTitles[id] || 'Подборка');

        // Фильтруем треки по ID из подборки
        if (allTracks.length > 0 && selectionData.items) {
          const filteredTracks = allTracks.filter((track) =>
            selectionData.items.includes(track._id),
          );
          setTracks(filteredTracks);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            setErrorRes('Подборка не найдена');
          } else if (error.response) {
            setErrorRes(
              error.response.data?.message || 'Ошибка загрузки подборки',
            );
          } else if (error.request) {
            setErrorRes('Ошибка сети. Проверьте подключение');
          } else {
            setErrorRes('Неизвестная ошибка');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Ждем загрузки всех треков
    if (!fetchIsLoading && allTracks.length > 0) {
      fetchCategoryTracks();
    }
  }, [id, allTracks, fetchIsLoading]);

  // Мемоизируем отображение для оптимизации
  const content = useMemo(
    () => ({
      tracks,
      isLoading,
      errorRes,
      title: title || 'Загрузка...',
    }),
    [tracks, isLoading, errorRes, title],
  );

  return (
    <>
      <Centerblock
        errorRes={errorRes}
        tracks={tracks}
        isLoading={isLoading}
        title={title}
      />
    </>
  );
}
