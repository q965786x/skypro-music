import { withReAuth } from './withReAuth';
import { refreshToken } from '@/services/auth/authApi';
import { setAccessToken } from '@/store/features/authSlice';
import { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Мокаем модули
jest.mock('@/services/auth/authApi');
jest.mock('@/store/features/authSlice');

// Типы для моков
type MockRefreshToken = jest.MockedFunction<typeof refreshToken>;
type MockSetAccessToken = jest.MockedFunction<typeof setAccessToken>;

describe('withReAuth', () => {
  const mockDispatch = jest.fn();
  const mockRefresh = 'test-refresh-token';
  const mockApiFunction = jest.fn();

  // Создаем базовый конфиг для Axios с правильными типами
  const createMockConfig = (): InternalAxiosRequestConfig => {
    const config: InternalAxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      } as unknown as InternalAxiosRequestConfig['headers'],
      method: 'get',
      url: '/test',
      data: undefined,
      params: undefined,
      timeout: 0,
      withCredentials: false,
      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',
      maxContentLength: -1,
      maxBodyLength: -1,
      transitional: {
        silentJSONParsing: true,
        forcedJSONParsing: true,
        clarifyTimeoutError: false,
      },
    };
    return config;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('успешно выполняет API функцию', async () => {
    const expectedResult = { data: 'success' };
    mockApiFunction.mockResolvedValue(expectedResult);

    const result = await withReAuth(mockApiFunction, mockRefresh, mockDispatch);

    expect(result).toBe(expectedResult);
    expect(mockApiFunction).toHaveBeenCalledWith('');
    expect(refreshToken).not.toHaveBeenCalled();
  });

  it('обновляет токен при ошибке 401 и повторяет запрос', async () => {
    const axiosError = new AxiosError();
    Object.defineProperty(axiosError, 'response', {
      value: {
        status: 401,
        data: {},
        statusText: 'Unauthorized',
        headers: {},
        config: createMockConfig(),
      },
    });

    mockApiFunction
      .mockRejectedValueOnce(axiosError)
      .mockResolvedValueOnce({ data: 'success' });

    const newAccessToken = { access: 'new-token' };
    (refreshToken as MockRefreshToken).mockResolvedValue(newAccessToken);

    const result = await withReAuth(mockApiFunction, mockRefresh, mockDispatch);

    expect(result).toEqual({ data: 'success' });
    expect(refreshToken).toHaveBeenCalledWith(mockRefresh);
    expect(setAccessToken).toHaveBeenCalledWith('new-token');
    expect(mockApiFunction).toHaveBeenCalledTimes(2);
    expect(mockApiFunction).toHaveBeenLastCalledWith('new-token');
  });

  it('пробрасывает ошибку если нет refresh токена при 401', async () => {
    const axiosError = new AxiosError();
    Object.defineProperty(axiosError, 'response', {
      value: {
        status: 401,
        data: {},
        statusText: 'Unauthorized',
        headers: {},
        config: createMockConfig(),
      },
    });

    mockApiFunction.mockRejectedValue(axiosError);

    await expect(withReAuth(mockApiFunction, '', mockDispatch)).rejects.toThrow(
      'Нет refresh токена',
    );
  });

  it('пробрасывает ошибку если обновление токена не удалось', async () => {
    const axiosError = new AxiosError();
    Object.defineProperty(axiosError, 'response', {
      value: {
        status: 401,
        data: {},
        statusText: 'Unauthorized',
        headers: {},
        config: createMockConfig(),
      },
    });

    mockApiFunction.mockRejectedValue(axiosError);
    (refreshToken as MockRefreshToken).mockRejectedValue(
      new Error('Refresh failed'),
    );

    await expect(
      withReAuth(mockApiFunction, mockRefresh, mockDispatch),
    ).rejects.toThrow('Refresh failed');
  });

  it('пробрасывает ошибку не 401', async () => {
    const axiosError = new AxiosError();
    Object.defineProperty(axiosError, 'response', {
      value: {
        status: 400,
        data: {},
        statusText: 'Bad Request',
        headers: {},
        config: createMockConfig(),
      },
    });

    mockApiFunction.mockRejectedValue(axiosError);

    await expect(
      withReAuth(mockApiFunction, mockRefresh, mockDispatch),
    ).rejects.toBe(axiosError);
  });
});
