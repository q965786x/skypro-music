'use client';

import { TrackType } from '@/sharedTypes/sharedTypes';
import { useAppSelector } from '@/store/store';
import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Centerblock from '@/components/Centerblock/Centerblock';
import { AxiosError } from 'axios';
import { getSelectionById } from '@/services/tracks/tracksApi';
import { useResetFilters } from '@/hooks/useResetFilters';

const selectionTitles: Record<string, string> = {
  '1': 'Плейлист дня',
  '2': '100 Танцевальных хитов',
  '3': 'Инди заряд',
};

type SelectionResponse = {
  data: {
    _id: number;
    name: string;
    items: number[];
  };
};

export default function CategoryPage() {
  useResetFilters();

  const params = useParams<{ id: string }>();
  const { allTracks, fetchIsLoading, filteredTracks, filters } = useAppSelector(
    (state) => state.tracks,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorRes, setErrorRes] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [categoryTracks, setCategoryTracks] = useState<TrackType[]>([]);
  const [displayTracks, setDisplayTracks] = useState<TrackType[]>([]);
  const id = params.id;

  useEffect(() => {
    const fetchCategoryTracks = async () => {
      if (!id) return;

      setIsLoading(true);
      setErrorRes(null);

      try {
        const response = await getSelectionById(id);
        const selectionData = response.data;

        setTitle(selectionData.name || selectionTitles[id] || 'Подборка');

        if (allTracks.length > 0 && selectionData.items) {
          const filtered = allTracks.filter((track) =>
            selectionData.items.includes(track._id),
          );
          setCategoryTracks(filtered);
          setDisplayTracks(filtered);
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

    if (!fetchIsLoading && allTracks.length > 0) {
      fetchCategoryTracks();
    }
  }, [id, allTracks, fetchIsLoading]);

  useEffect(() => {
    if (categoryTracks.length === 0) return;

    let filtered = [...categoryTracks];

    if (filters.authors.length > 0) {
      filtered = filtered.filter((track) =>
        filters.authors.includes(track.author),
      );
    }

    if (filters.genres.length > 0) {
      filtered = filtered.filter((track) =>
        filters.genres.some((genre) => track.genre.includes(genre)),
      );
    }

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
        tracks={displayTracks}
        isLoading={isLoading}
        title={title}
      />
    </>
  );
}
