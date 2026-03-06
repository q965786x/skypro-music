'use client';

import { Centerblock } from '@/app/components/Centerblock/Centerblock';
import { useAppSelector } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PlaylistPage() {
  const router = useRouter();
  const { favoriteTracks, fetchIsLoading } = useAppSelector(
    (state) => state.tracks,
  );
  const { access } = useAppSelector((state) => state.auth);

  // Проверка авторизации
  useEffect(() => {
    if (!access) {
      router.push('/auth/signin');
    }
  }, [access, router]);

  // Если не авторизован, не рендерим контент
  if (!access) {
    return null;
  }

  return (
    <Centerblock
      tracks={favoriteTracks}
      isLoading={fetchIsLoading}
      errorRes={null}
      title={'Мой плейлист'}
    />
  );
}
