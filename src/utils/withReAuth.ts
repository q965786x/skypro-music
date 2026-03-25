import { refreshToken } from '@/services/auth/authApi';
import { setAccessToken } from '@/store/features/authSlice';
import { AppDispatch } from '@/store/store';
import { AxiosError } from 'axios';

export const withReAuth = async <T>(
  apiFunction: (access: string) => Promise<T>,
  refresh: string,
  dispatch: AppDispatch,
): Promise<T> => {
  const currentAccessToken = localStorage.getItem('access') || '';

  try {
    return await apiFunction(currentAccessToken);
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === 401) {
      if (!refresh) {
        throw new Error('Нет refresh токена');
      }

      try {
        const newAccessToken = await refreshToken(refresh);
        localStorage.setItem('access', newAccessToken.access);
        dispatch(setAccessToken(newAccessToken.access));
        return await apiFunction(newAccessToken.access);
      } catch (refreshError) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('username');
        throw refreshError;
      }
    }

    throw error;
  }
};
