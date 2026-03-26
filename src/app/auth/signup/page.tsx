'use client';

import Link from 'next/link';
import styles from './signup.module.css';
import classNames from 'classnames';
import { ChangeEvent, useState } from 'react';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { createUser } from '@/services/auth/authApi';
import { showToast } from '@/utils/toastUtils';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
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

  const onChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setErrorMessage('');
  };

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setErrorMessage('');
  };

  const validateForm = (): string | null => {
    if (
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !username.trim()
    ) {
      return 'Заполните все поля';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Введите корректный email';
    }

    if (password.length < 6) {
      return 'Пароль должен содержать минимум 6 символов';
    }

    if (password !== confirmPassword) {
      return 'Пароли не совпадают';
    }

    if (username.length < 2) {
      return 'Имя пользователя должно содержать минимум 2 символа';
    }

    return null;
  };

  const onSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      showToast.warning(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await createUser({
        email,
        password,
        username,
      });

      if (response.data) {
        if (response.data.result) {
          localStorage.setItem('user', JSON.stringify(response.data.result));
        } else {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      }

      showToast.success('Регистрация прошла успешно! Теперь вы можете войти');
      router.push('/auth/signin?registered=true');
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.code === 'ERR_NETWORK') {
          showToast.error(
            'Ошибка соединения. Проверьте интернет и попробуйте снова.',
          );
        } else if (error.response) {
          switch (error.response.status) {
            case 400:
              if (error.response.data?.message) {
                showToast.error(error.response.data.message);
              } else if (error.response.data?.email) {
                showToast.error(`Ошибка в email: ${error.response.data.email}`);
              } else if (error.response.data?.password) {
                showToast.error(
                  `Ошибка в пароле: ${error.response.data.password}`,
                );
              } else {
                showToast.error(
                  'Некорректные данные. Проверьте введенную информацию.',
                );
              }
              break;
            case 403:
              showToast.error(
                error.response.data?.message ||
                  'Пользователь с таким email уже существует',
              );
              break;
            case 500:
              showToast.error('Ошибка сервера. Попробуйте позже.');
              break;
            default:
              showToast.error(
                error.response.data?.message ||
                  'Произошла ошибка при регистрации',
              );
          }
        } else {
          showToast.error('Не удалось выполнить запрос. Попробуйте позже.');
        }
      } else {
        showToast.error('Произошла неизвестная ошибка');
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
        className={styles.modal__input}
        type="text"
        name="username"
        placeholder="Имя пользователя"
        value={username}
        onChange={onChangeUsername}
        disabled={isLoading}
      />

      <input
        className={styles.modal__input}
        type="password"
        name="password"
        placeholder="Пароль"
        value={password}
        onChange={onChangePassword}
        disabled={isLoading}
      />
      <input
        className={styles.modal__input}
        type="password"
        name="confirmPassword"
        placeholder="Повторите пароль"
        value={confirmPassword}
        onChange={onChangeConfirmPassword}
        disabled={isLoading}
      />

      <button
        disabled={isLoading}
        onClick={onSubmit}
        className={styles.modal__btnSignupEnt}
      >
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
    </>
  );
}
