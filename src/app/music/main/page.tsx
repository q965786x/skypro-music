'use client';

import { Centerblock } from '@/app/components/Centerblock/Centerblock';
import { useAppSelector } from '@/store/store';

export default function MainPage() {
  const { fetchError, fetchIsLoading, allTracks } = useAppSelector(
    (state) => state.tracks,
  );

  return (
    <>
      <Centerblock
        tracks={allTracks}
        isLoading={fetchIsLoading}
        errorRes={fetchError}
        title={'Треки'}
      />
    </>
  );
}
