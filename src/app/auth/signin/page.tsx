'use client';

import Link from 'next/link';
import styles from './signin.module.css';
import classNames from 'classnames';
import { ChangeEvent, useState } from 'react';
import { authUser } from '@/services/auth/authApi';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessage('');
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorMessage('');
  };

  const onSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      return setErrorMessage('Заполните все поля');
    }

    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Введите корректный email');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authUser({ email, password });

      // Успешная авторизация
      console.log('Успешный вход:', response.data);

      // Сохраняем данные пользователя (например, в localStorage или в контексте)
      // Это зависит от вашей архитектуры приложения
      if (response.data) {
        // Пример сохранения данных пользователя
        localStorage.setItem('user', JSON.stringify(response.data));

        // Если API возвращает токены, сохраняем их тоже
        // localStorage.setItem('accessToken', response.data.access);
        // localStorage.setItem('refreshToken', response.data.refresh);
      }

      // Перенаправляем на главную страницу
      router.push('/music/main'); // или '/main', в зависимости от вашего роутинга
    } catch (error) {
      if (error instanceof AxiosError) {
        // Обработка разных типов ошибок Axios
        if (error.code === 'ERR_NETWORK') {
          // Ошибка сети (нет интернета, сервер не доступен)
          setErrorMessage(
            'Ошибка соединения. Проверьте интернет и попробуйте снова.',
          );
        } else if (error.response) {
          // Сервер ответил с ошибкой
          switch (error.response.status) {
            case 400:
              setErrorMessage(
                'Некорректный запрос. Проверьте введенные данные.',
              );
              break;
            case 401:
              // Обрабатываем конкретное сообщение от сервера
              if (error.response.data?.message) {
                setErrorMessage(error.response.data.message);
              } else {
                setErrorMessage('Неверный email или пароль');
              }
              break;
            case 500:
              setErrorMessage('Ошибка сервера. Попробуйте позже.');
              break;
            default:
              // Общее сообщение для других ошибок
              setErrorMessage(
                error.response.data?.message || 'Произошла ошибка при входе',
              );
          }
        } else {
          // Ошибка при настройке запроса
          setErrorMessage('Не удалось выполнить запрос. Попробуйте позже.');
        }
      } else {
        // Неизвестная ошибка (не от axios)
        setErrorMessage('Произошла неизвестная ошибка');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Link href="/music/main">
        <div className={styles.modal__logo}>
          <img src="/img/logo_modal.png" alt="logo" />
        </div>
      </Link>

      <input
        className={classNames(styles.modal__input, styles.login)}
        type="email"
        name="email"
        placeholder="Почта"
        value={email}
        onChange={onChangeEmail}
        disabled={isLoading}
      />

      <input
        className={classNames(styles.modal__input)}
        type="password"
        name="password"
        placeholder="Пароль"
        value={password}
        onChange={onChangePassword}
        disabled={isLoading}
      />

      <div className={styles.errorContainer}>{errorMessage}</div>
      <button
        disabled={isLoading}
        onClick={onSubmit}
        className={styles.modal__btnEnter}
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </button>
      <Link href={'/auth/signup'} className={styles.modal__btnSignup}>
        Зарегистрироваться
      </Link>
    </>
  );
}
