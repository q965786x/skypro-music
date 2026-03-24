'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './navigation.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch } from '@/store/store';
import { clearUser } from '@/store/features/authSlice';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLDivElement>(null);

  const toggleOpenMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const logout = () => {
    dispatch(clearUser());
    router.push('/auth/signin');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        burgerRef.current &&
        !burgerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen]);

  return (
    <nav className={styles.main__nav}>
      <div className={styles.nav__logo}></div>
      <Link href={'/music/main'}>
        <Image
          width={113}
          height={17}
          className={styles.logo__image}
          src="/img/logo.png"
          alt={'logo'}
        />
      </Link>

      <div
        ref={burgerRef}
        className={styles.nav__burger}
        onClick={toggleOpenMenu}
      >
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
        <span className={styles.burger__line}></span>
      </div>

      <div
        ref={menuRef}
        className={`${styles.nav__menu} ${isMenuOpen ? styles.nav__menu_open : ''}`}
      >
        <ul className={styles.menu__list}>
          <li className={styles.menu__item}>
            <Link
              href="/music/main"
              className={styles.menu__link}
              onClick={closeMenu}
            >
              Главное
            </Link>
          </li>
          <li className={styles.menu__item}>
            <Link
              href="/music/playlist"
              className={styles.menu__link}
              onClick={closeMenu}
            >
              Мой плейлист
            </Link>
          </li>
          <li className={styles.menu__item}>
            <button onClick={logout} className={styles.menu__button}>
              Выйти
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
