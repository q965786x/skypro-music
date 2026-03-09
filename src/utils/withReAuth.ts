import { refreshToken } from '@/services/auth/authApi';
import { setAccessToken } from '@/store/features/authSlice';
import { AppDispatch } from '@/store/store';
import { AxiosError } from 'axios';

export const withReAuth = async <T>(
  apiFunction: (access: string) => Promise<T>,
  refresh: string,
  dispatch: AppDispatch,
): Promise<T> => {
  try {
    //Пытаемся выполнить запрос
    return await apiFunction('');
  } catch (error) {
    const axiosError = error as AxiosError;

    // Если ошибка 401 (не авторизован), обновляем токен и повторяем запрос
    if (axiosError.response?.status === 401) {
      try {
        if (!refresh) {
          throw new Error('Нет refresh токена');
        }

        console.log('Обновляем токен...');
        const newAccessToken = await refreshToken(refresh);
        console.log('Токен обновлен успешно');

        dispatch(setAccessToken(newAccessToken.access));

        // Повторяем исходный запрос с новым токеном
        return await apiFunction(newAccessToken.access);
      } catch (refreshError) {
        // Если обновление токена не удалось, пробрасываем ошибку
        console.error('Не удалось обновить токен:', refreshError);
        throw refreshError;
      }
    }

    // Если ошибка не 401, пробрасываем её
    throw error;
  }
};
