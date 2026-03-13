'use client';

import { useEffect, useState } from 'react';
import styles from './search.module.css';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setSearchTerm } from '@/store/features/trackSlice';

export default function Search() {
  const [searchInput, setSearchInput] = useState('');
  const dispatch = useAppDispatch();

  const searchTerm = useAppSelector((state) => state.tracks.searchTerm);

  // Синхронизируем локальный стейт с глобальным
  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const onSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    // Отправляем в store только если длина >= 2 или пустая строка
    if (value.length === 0 || value.length >= 2) {
      dispatch(setSearchTerm(value));
    }
  };

  return (
    <div className={styles.centerblock__search}>
      <svg className={styles.search__svg}>
        <use xlinkHref="/img/icon/sprite.svg#icon-search"></use>
      </svg>
      <input
        className={styles.search__text}
        type="search"
        placeholder="Поиск"
        name="search"
        value={searchInput}
        onChange={onSearchInput}
      />
    </div>
  );
}
