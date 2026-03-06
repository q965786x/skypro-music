import { refreshToken } from '@/services/auth/authApi';
import {
  setAccessToken,
  setRefreshToken,
  setUsername,
  clearUser,
} from '@/store/features/authSlice';
import { useAppDispatch } from '@/store/store';
import { useEffect } from 'react';

export const useInitAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      const access = localStorage.getItem('access') || '';
      const refresh = localStorage.getItem('refresh') || '';
      const username = localStorage.getItem('username') || '';

      // Если есть refresh токен, пробуем обновить access токен
      if (refresh && !access) {
        try {
          const newTokens = await refreshToken(refresh);
          dispatch(setAccessToken(newTokens.access));
          dispatch(setRefreshToken(refresh)); // сохраняем тот же refresh
          dispatch(setUsername(username));
        } catch (error) {
          console.log('Не удалось обновить токен, очищаем данные');
          dispatch(clearUser());
        }
      } else if (access && refresh) {
        // Если есть оба токена, просто устанавливаем их
        dispatch(setAccessToken(access));
        dispatch(setRefreshToken(refresh));
        dispatch(setUsername(username));
      } else {
        // Если нет токенов, очищаем всё
        dispatch(clearUser());
      }
    };

    initAuth();
  }, [dispatch]);
};
