'use client';

import { useEffect, useState } from 'react';
import styles from './search.module.css';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setSearchTerm } from '@/store/features/trackSlice';

export default function Search() {
  const [searchInput, setSearchInput] = useState('');
  const dispatch = useAppDispatch();

  const searchTerm = useAppSelector((state) => state.tracks.searchTerm);

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const onSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

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
