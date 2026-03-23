import { withReAuth } from './withReAuth';
import { refreshToken } from '@/services/auth/authApi';
import { setAccessToken } from '@/store/features/authSlice';

// Мокаем зависимости
jest.mock('@/services/auth/authApi');
jest.mock('@/store/features/authSlice');

describe('withReAuth', () => {
  let mockDispatch: jest.Mock;
  let mockApiFunction: jest.Mock;

  beforeEach(() => {
    mockDispatch = jest.fn();
    mockApiFunction = jest.fn();

    // Очищаем localStorage перед каждым тестом
    localStorage.clear();

    // Сбрасываем моки перед каждым тестом
    jest.clearAllMocks();
  });

  it('должен успешно выполнить запрос с существующим токеном', async () => {
    const mockAccessToken = 'test-access-token';
    const mockResponse = { data: 'success' };

    localStorage.setItem('access', mockAccessToken);
    mockApiFunction.mockResolvedValue(mockResponse);

    const result = await withReAuth(
      mockApiFunction,
      'test-refresh-token',
      mockDispatch,
    );

    expect(mockApiFunction).toHaveBeenCalledWith(mockAccessToken);
    expect(result).toEqual(mockResponse);
    expect(refreshToken).not.toHaveBeenCalled();
  });

  it('должен обновить токен при 401 ошибке и повторить запрос', async () => {
    const mockRefreshToken = 'test-refresh-token';
    const newAccessToken = 'new-access-token';
    const mockResponse = { data: 'success' };

    localStorage.setItem('access', 'old-token');

    // Первый вызов возвращает ошибку 401, второй - успех
    mockApiFunction
      .mockRejectedValueOnce({ response: { status: 401 } })
      .mockResolvedValueOnce(mockResponse);

    (refreshToken as jest.Mock).mockResolvedValue({ access: newAccessToken });

    const result = await withReAuth(
      mockApiFunction,
      mockRefreshToken,
      mockDispatch,
    );

    expect(refreshToken).toHaveBeenCalledWith(mockRefreshToken);
    expect(setAccessToken).toHaveBeenCalledWith(newAccessToken);
    expect(mockApiFunction).toHaveBeenCalledTimes(2);
    expect(mockApiFunction).toHaveBeenLastCalledWith(newAccessToken);
    expect(result).toEqual(mockResponse);
    expect(localStorage.getItem('access')).toBe(newAccessToken);
  });

  it('должен выбросить ошибку, если нет refresh токена', async () => {
    localStorage.setItem('access', 'old-token');

    // Создаем ошибку 401
    const error401 = { response: { status: 401 } };
    mockApiFunction.mockRejectedValue(error401);

    // Ожидаем, что будет выброшена ошибка
    await expect(withReAuth(mockApiFunction, '', mockDispatch)).rejects.toThrow(
      'Нет refresh токена',
    );

    // Проверяем, что refreshToken НЕ был вызван
    expect(refreshToken).not.toHaveBeenCalled();

    // Проверяем, что apiFunction был вызван один раз (и получил ошибку)
    expect(mockApiFunction).toHaveBeenCalledTimes(1);
  });

  it('должен очистить токены при ошибке обновления', async () => {
    localStorage.setItem('access', 'old-token');
    localStorage.setItem('refresh', 'old-refresh');
    localStorage.setItem('username', 'test-user');

    // Создаем ошибку 401
    const error401 = { response: { status: 401 } };
    mockApiFunction.mockRejectedValue(error401);

    // Мокаем refreshToken с ошибкой
    (refreshToken as jest.Mock).mockRejectedValue(new Error('Refresh failed'));

    await expect(
      withReAuth(mockApiFunction, 'old-refresh', mockDispatch),
    ).rejects.toThrow('Refresh failed');

    // Проверяем, что refreshToken был вызван
    expect(refreshToken).toHaveBeenCalledWith('old-refresh');

    // Проверяем, что токены были очищены
    expect(localStorage.getItem('access')).toBeNull();
    expect(localStorage.getItem('refresh')).toBeNull();
    expect(localStorage.getItem('username')).toBeNull();
  });

  it('должен пробросить ошибку, если статус не 401', async () => {
    const error = {
      response: { status: 500, data: { message: 'Server error' } },
    };
    mockApiFunction.mockRejectedValue(error);

    await expect(
      withReAuth(mockApiFunction, 'refresh-token', mockDispatch),
    ).rejects.toEqual(error);

    // Проверяем, что refreshToken НЕ был вызван
    expect(refreshToken).not.toHaveBeenCalled();

    // Проверяем, что apiFunction был вызван один раз
    expect(mockApiFunction).toHaveBeenCalledTimes(1);
  });

  it('должен пробросить ошибку, если ошибка не имеет response', async () => {
    const error = new Error('Network error');
    mockApiFunction.mockRejectedValue(error);

    await expect(
      withReAuth(mockApiFunction, 'refresh-token', mockDispatch),
    ).rejects.toEqual(error);

    // Проверяем, что refreshToken НЕ был вызван
    expect(refreshToken).not.toHaveBeenCalled();

    // Проверяем, что apiFunction был вызван один раз
    expect(mockApiFunction).toHaveBeenCalledTimes(1);
  });

  it('должен корректно обработать ситуацию, когда токен обновлен, но повторный запрос снова возвращает 401', async () => {
    const mockRefreshToken = 'test-refresh-token';
    const newAccessToken = 'new-access-token';

    localStorage.setItem('access', 'old-token');

    // Первый вызов - 401
    // Второй вызов (с новым токеном) - снова 401
    mockApiFunction
      .mockRejectedValueOnce({ response: { status: 401 } })
      .mockRejectedValueOnce({ response: { status: 401 } });

    (refreshToken as jest.Mock).mockResolvedValue({ access: newAccessToken });

    await expect(
      withReAuth(mockApiFunction, mockRefreshToken, mockDispatch),
    ).rejects.toEqual({ response: { status: 401 } });

    expect(refreshToken).toHaveBeenCalledWith(mockRefreshToken);
    expect(mockApiFunction).toHaveBeenCalledTimes(2);
    expect(mockApiFunction).toHaveBeenNthCalledWith(1, 'old-token');
    expect(mockApiFunction).toHaveBeenNthCalledWith(2, newAccessToken);
  });
});
