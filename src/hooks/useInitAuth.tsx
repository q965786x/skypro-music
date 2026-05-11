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

      if (refresh && !access) {
        try {
          const newTokens = await refreshToken(refresh);
          dispatch(setAccessToken(newTokens.access));
          dispatch(setRefreshToken(refresh));
          dispatch(setUsername(username));
        } catch (error) {
          dispatch(clearUser());
        }
      } else if (access && refresh) {
        dispatch(setAccessToken(access));
        dispatch(setRefreshToken(refresh));
        dispatch(setUsername(username));
      } else {
        dispatch(clearUser());
      }
    };

    initAuth();
  }, [dispatch]);
};
