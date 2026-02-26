'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './navigation.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Проверяем авторизацию при загрузке и при изменении localStorage
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      setIsAuthenticated(!!user);
    };

    checkAuth();

    // Слушаем изменения localStorage
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsMenuOpen(false);
    router.push('/auth/signin');
  };

  // Обработчик клика по "Мой плейлист"
  const handlePlaylistClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (!isAuthenticated) {
      // Если пользователь не авторизован, перенаправляем на страницу входа
      router.push('/auth/signin');
    } else {
      // Если авторизован, переходим на страницу плейлиста
      router.push('/music/playlist');
    }
  };

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        burgerRef.current &&
        !burgerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    // Закрытие меню при нажатии Escape
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen]);

  return (
    <nav className={styles.main__nav}>
      <div className={styles.nav__logo}>
        <Image
          width={250}
          height={170}
          className={styles.logo__image}
          src="/img/logo.png"
          alt={'logo'}
          priority
        />
      </div>

      {/* Бургер-меню */}
      <div
        ref={burgerRef}
        className={styles.nav__burger}
        onClick={toggleMenu}
        aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={isMenuOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
          }
        }}
      >
        <span
          className={`${styles.burger__line} ${isMenuOpen ? styles.burger__line_active1 : ''}`}
        ></span>
        <span
          className={`${styles.burger__line} ${isMenuOpen ? styles.burger__line_active2 : ''}`}
        ></span>
        <span
          className={`${styles.burger__line} ${isMenuOpen ? styles.burger__line_active3 : ''}`}
        ></span>
      </div>

      {/* Выпадающее меню  */}
      <div
        ref={menuRef}
        className={`${styles.nav__menu} ${isMenuOpen ? styles.nav__menu_open : ''}`}
        aria-hidden={!isMenuOpen}
      >
        <ul className={styles.menu__list}>
          <li className={styles.menu__item}>
            <Link
              href="/music/main"
              className={styles.menu__link}
              onClick={() => setIsMenuOpen(false)}
              tabIndex={isMenuOpen ? 0 : -1}
            >
              Главное
            </Link>
          </li>
          <li className={styles.menu__item}>
            <Link
              href="/music/playlist"
              className={styles.menu__link}
              onClick={handlePlaylistClick}
              tabIndex={isMenuOpen ? 0 : -1}
            >
              Мой плейлист
            </Link>
          </li>
          <li className={styles.menu__item}>
            {isAuthenticated ? (
              <button
                className={styles.menu__button}
                onClick={handleLogout}
                tabIndex={isMenuOpen ? 0 : -1}
              >
                Выйти
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className={styles.menu__link}
                onClick={() => setIsMenuOpen(false)}
                tabIndex={isMenuOpen ? 0 : -1}
              >
                Войти
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
