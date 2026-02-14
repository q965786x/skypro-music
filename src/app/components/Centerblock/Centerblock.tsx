'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './centerblock.module.css';
import Search from '../Search/Search';
import Filter from '../Filter/Filter';
import { CenterblockProp, FilterType } from '@/sharedTypes/sharedTypes';
import TrackList from '../Tracklist/Tracklist';
import FilterDropdown from '../FilterDropdown/FilterDropdown';

import {
  getUniqueArtists,
  getUniqueGenres,
  getUniqueYears,
} from '@/utils/filterUtils';

export function Centerblock({ track }: CenterblockProp) {
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const artistButtonRef = useRef<HTMLButtonElement>(null);
  const yearButtonRef = useRef<HTMLButtonElement>(null);
  const genreButtonRef = useRef<HTMLButtonElement>(null);

  // Получаем данные для фильтров из треков
  const artists = getUniqueArtists(track);
  const years = getUniqueYears(track);
  const genres = getUniqueGenres(track);

  const handleFilterClick = (filterType: FilterType) => {
    console.log('Клик по фильтру:', filterType);

    if (activeFilter === filterType) {
      setActiveFilter(null);
      setDropdownPosition(null);
    } else {
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
        const position = {
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        };

        console.log('Позиция:', position);
        setActiveFilter(filterType);
        setDropdownPosition(position);
      }
    }
  };

  const handleCloseFilter = () => {
    setActiveFilter(null);
    setDropdownPosition(null);
  };

  // Обработка ресайза окна
  useEffect(() => {
    const handleResize = () => {
      if (activeFilter) {
        let button: HTMLButtonElement | null = null;
        switch (activeFilter) {
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
          setDropdownPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
          });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeFilter]);

  return (
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>Треки</h2>

      <div className={styles.centerblock__filter}>
        <div className={styles.filter__title}>Искать по:</div>

        <button
          ref={artistButtonRef}
          className={`${styles.filter__button} ${activeFilter === 'artist' ? styles.filter__button_active : ''}`}
          onClick={() => handleFilterClick('artist')}
          type="button"
        >
          исполнителю
        </button>

        <button
          ref={yearButtonRef}
          className={`${styles.filter__button} ${activeFilter === 'year' ? styles.filter__button_active : ''}`}
          onClick={() => handleFilterClick('year')}
          type="button"
        >
          году выпуска
        </button>

        <button
          ref={genreButtonRef}
          className={`${styles.filter__button} ${activeFilter === 'genre' ? styles.filter__button_active : ''}`}
          onClick={() => handleFilterClick('genre')}
          type="button"
        >
          жанру
        </button>
      </div>

      {/* Dropdown фильтров */}
      {activeFilter && dropdownPosition && (
        <FilterDropdown
          type={activeFilter}
          data={
            activeFilter === 'artist'
              ? artists
              : activeFilter === 'year'
                ? years
                : genres
          }
          onClose={handleCloseFilter}
          position={dropdownPosition}
        />
      )}

      <div className={styles.centerblock__content}>
        <Filter />
        <TrackList tracks={track} playlist={track} />
      </div>
    </div>
  );
}
