'use client';

import styles from './filterButtons.module.css';
import { FilterType } from '@/sharedTypes/sharedTypes';
import { useRef } from 'react';

type FilterButtonsProps = {
  activeFilter: FilterType | null;
  onFilterClick: (filterType: FilterType, buttonRect: DOMRect) => void;
};

export default function FilterButtons({
  activeFilter,
  onFilterClick,
}: FilterButtonsProps) {
  const artistButtonRef = useRef<HTMLButtonElement>(null);
  const yearButtonRef = useRef<HTMLButtonElement>(null);
  const genreButtonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (filterType: FilterType) => {
    let button: HTMLButtonElement | null = null;

    switch (filterType) {
      case 'artist':
        button = artistButtonRef.current;
        break;
      case 'year':
        button = yearButtonRef.current;
        break;
      case 'genre':
        button = genreButtonRef.current;
        break;
    }

    if (button) {
      const rect = button.getBoundingClientRect();
      onFilterClick(filterType, rect);
    }
  };

  return (
    <div className={styles.filter}>
      <div className={styles.filter__title}>Искать по:</div>

      <button
        ref={artistButtonRef}
        className={`${styles.filter__button} ${activeFilter === 'artist' ? styles.filter__button_active : ''}`}
        onClick={() => handleClick('artist')}
        type="button"
      >
        исполнителю
      </button>

      <button
        ref={yearButtonRef}
        className={`${styles.filter__button} ${activeFilter === 'year' ? styles.filter__button_active : ''}`}
        onClick={() => handleClick('year')}
        type="button"
      >
        году выпуска
      </button>

      <button
        ref={genreButtonRef}
        className={`${styles.filter__button} ${activeFilter === 'genre' ? styles.filter__button_active : ''}`}
        onClick={() => handleClick('genre')}
        type="button"
      >
        жанру
      </button>
    </div>
  );
}
