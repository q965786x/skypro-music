'use client';

import Centerblock from '@/app/components/Centerblock/Centerblock';
import { useInitAuth } from '@/hooks/useInitAuth';
import { useAppSelector } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PlaylistPage() {
  const router = useRouter();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useInitAuth();

  const { favoriteTracks, fetchIsLoading } = useAppSelector(
    (state) => state.tracks,
  );
  const { access } = useAppSelector((state) => state.auth);

  // Ждем, пока хук useInitAuth выполнится и обновит состояние
  useEffect(() => {
    // Небольшая задержка, чтобы дать время на выполнение initAuth
    const timer = setTimeout(() => {
      setIsAuthReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Проверка авторизации
  useEffect(() => {
    if (isAuthReady && !access) {
      router.push('/auth/signin');
    }
  }, [isAuthReady, access, router]);

  // Показываем загрузку, пока не готовы данные авторизации
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

  // Если не авторизован, не рендерим контент
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
