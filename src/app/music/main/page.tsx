'use client';

import Centerblock from '@/components/Centerblock/Centerblock';
import { useResetFilters } from '@/hooks/useResetFilters';
import { TrackType } from '@/sharedTypes/sharedTypes';
import { useAppSelector } from '@/store/store';
import { useEffect, useState } from 'react';

export default function MainPage() {
  useResetFilters();

  const { fetchError, fetchIsLoading, allTracks, filteredTracks, filters } =
    useAppSelector((state) => state.tracks);
  const [playlist, setPlaylist] = useState<TrackType[]>([]);

  useEffect(() => {
    const currentPlaylist =
      filters.authors.length || filters.genres.length
        ? filteredTracks
        : allTracks;
    setPlaylist(currentPlaylist);
  }, [
    filteredTracks,
    allTracks,
    filters.authors.length,
    filters.genres.length,
  ]);

  return (
    <>
      <Centerblock
        pagePlaylist={allTracks}
        tracks={playlist}
        isLoading={fetchIsLoading}
        errorRes={fetchError}
        title={'Треки'}
      />
    </>
  );
}
