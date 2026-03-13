'use client';

import Centerblock from '@/components/Centerblock/Centerblock';
import { useInitAuth } from '@/hooks/useInitAuth';
import { useResetFilters } from '@/hooks/useResetFilters';
import { useAppSelector } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PlaylistPage() {
  useResetFilters(); // Сбрасываем фильтры при заходе на страницу

  const router = useRouter();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useInitAuth();

  const { favoriteTracks, fetchIsLoading } = useAppSelector(
    (state) => state.tracks,
  );
  const { access } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAuthReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthReady && !access) {
      router.push('/auth/signin');
    }
  }, [isAuthReady, access, router]);

  if (!isAuthReady) {
    return (
      <Centerblock
        pagePlaylist={[]}
        tracks={[]}
        isLoading={true}
        errorRes={null}
        title={'Мой плейлист'}
      />
    );
  }

  if (!access) {
    return null;
  }

  return (
    <Centerblock
      pagePlaylist={favoriteTracks}
      tracks={favoriteTracks}
      isLoading={fetchIsLoading}
      errorRes={null}
      title={'Мой плейлист'}
    />
  );
}
