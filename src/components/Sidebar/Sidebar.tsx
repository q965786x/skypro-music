'use client';

import styles from './sidebar.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useRouter } from 'next/navigation';
import { clearUser } from '@/store/features/authSlice';
import { showToast } from '@/utils/toastUtils';

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const username = useAppSelector((state) => state.auth.username);

  const handleLogout = () => {
    dispatch(clearUser());
    showToast.success('До свидания!');

    const currentPath = window.location.pathname;
    if (currentPath.includes('/music/playlist')) {
      router.push('/music/main');
    } else {
      router.push('/auth/signin');
    }
  };

  return (
    <div className={styles.main__sidebar}>
      <div className={styles.sidebar__personal}>
        <p className={styles.sidebar__personalName}>
          {username || 'Инкогнито'}
        </p>
        <div
          className={styles.sidebar__icon}
          onClick={handleLogout}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleLogout();
            }
          }}
        >
          <svg>
            <use xlinkHref="/img/icon/sprite.svg#logout"></use>
          </svg>
        </div>
      </div>
      <div className={styles.sidebar__block}>
        <div className={styles.sidebar__list}>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="/music/category/2">
              <Image
                className="sidebar__img"
                src="/img/playlist01.png"
                alt="day's playlist"
                width={250}
                height={170}
              />
            </Link>
          </div>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="/music/category/3">
              <Image
                className="sidebar__img"
                src="/img/playlist02.png"
                alt="day's playlist"
                width={250}
                height={170}
              />
            </Link>
          </div>
          <div className={styles.sidebar__item}>
            <Link className={styles.sidebar__link} href="/music/category/4">
              <Image
                className="sidebar__img"
                src="/img/playlist03.png"
                alt="day's playlist"
                width={250}
                height={170}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
