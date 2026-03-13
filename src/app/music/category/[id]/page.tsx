'use client';

import { TrackType } from '@/sharedTypes/sharedTypes';
import { useAppSelector } from '@/store/store';
import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Centerblock from '@/app/components/Centerblock/Centerblock';
import { AxiosError } from 'axios';
import { getSelectionById } from '@/services/tracks/tracksApi';
import { useResetFilters } from '@/hooks/useResetFilters';

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
  useResetFilters(); // Сбрасываем фильтры при заходе на страницу

  const params = useParams<{ id: string }>();
  const { allTracks, fetchIsLoading, filteredTracks, filters } = useAppSelector(
    (state) => state.tracks,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorRes, setErrorRes] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [categoryTracks, setCategoryTracks] = useState<TrackType[]>([]); // Треки из категории
  const [displayTracks, setDisplayTracks] = useState<TrackType[]>([]); // Треки для отображения (с учетом фильтров)
  const id = params.id;

  // Получаем треки категории
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
          const filtered = allTracks.filter((track) =>
            selectionData.items.includes(track._id),
          );
          setCategoryTracks(filtered);
          setDisplayTracks(filtered); // Изначально показываем все треки категории
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

  // Применяем фильтры к трекам категории
  useEffect(() => {
    if (categoryTracks.length === 0) return;

    let filtered = [...categoryTracks];

    // Фильтр по авторам
    if (filters.authors.length > 0) {
      filtered = filtered.filter((track) =>
        filters.authors.includes(track.author),
      );
    }

    // Фильтр по жанрам
    if (filters.genres.length > 0) {
      filtered = filtered.filter((track) =>
        filters.genres.some((genre) => track.genre.includes(genre)),
      );
    }

    // Сортировка по годам
    if (filters.years && filters.years !== 'По умолчанию') {
      filtered = [...filtered].sort((a, b) => {
        if (filters.years === 'Сначала новые') {
          return (
            new Date(b.release_date).getTime() -
            new Date(a.release_date).getTime()
          );
        } else if (filters.years === 'Сначала старые') {
          return (
            new Date(a.release_date).getTime() -
            new Date(b.release_date).getTime()
          );
        }
        return 0;
      });
    }

    setDisplayTracks(filtered);
  }, [categoryTracks, filters]);

  // Мемоизируем отображение для оптимизации
  const content = useMemo(
    () => ({
      tracks: displayTracks,
      isLoading,
      errorRes,
      title: title || 'Загрузка...',
    }),
    [displayTracks, isLoading, errorRes, title],
  );

  return (
    <>
      <Centerblock
        pagePlaylist={categoryTracks}
        errorRes={errorRes}
        tracks={displayTracks} // Отображаем треки с учетом фильтров
        isLoading={isLoading}
        title={title}
      />
    </>
  );
}
