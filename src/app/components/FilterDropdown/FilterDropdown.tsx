'use client';

import { FilterType, TrackType } from '@/sharedTypes/sharedTypes';
import { useEffect, useRef, useState } from 'react';
import styles from './filterDropdown.module.css';
import {
  getUniqueArtists,
  getUniqueGenres,
  getUniqueYears,
} from '@/utils/filterUtils';

type FilterDropdownProps = {
  type: FilterType;
  tracks: TrackType[];
  onClose: () => void;
  position?: { top: number; left: number };
};

// Тип для элементов фильтра (исполнители, жанры, годы)
type FilterItem = {
  value: string;
  count: number;
};

// Тип для опций фильтра по годам (статичные опции)
type YearOption = {
  value: string;
  label: string;
};

// Для фильтра по годам - статичные опции
const yearOptions: YearOption[] = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
];

export default function FilterDropdown({
  type,
  tracks,
  onClose,
  position = { top: 0, left: 0 },
}: FilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedValue, setSelectedValue] = useState<string>('default');

  // Получаем уникальные значения в зависимости от типа фильтра
  const getFilterData = () => {
    switch (type) {
      case 'artist':
        return getUniqueArtists(tracks).map((artist) => ({
          value: artist,
          count: tracks.filter((t) => t.author === artist).length,
        }));
      case 'year':
        return getUniqueYears(tracks).map((year) => ({
          value: year,
          count: tracks.filter((t) => t.release_date === year).length,
        }));
      case 'genre':
        // Для жанров нужно собрать все жанры из всех треков
        const allGenres = tracks.flatMap((track) => track.genre);
        const uniqueGenres = [...new Set(allGenres)];
        return uniqueGenres.map((genre) => ({
          value: genre,
          count: tracks.filter((t) => t.genre.includes(genre)).length,
        }));
      default:
        return [];
    }
  };

  const filterData = getFilterData();
  const isYearFilter = type === 'year';

  // Определяем размеры окна по типу фильтра
  const getDropdownSize = () => {
    switch (type) {
      case 'artist':
      case 'genre':
        return { width: 248, height: 305 };
      case 'year':
        return { width: 221, height: 196 };
      default:
        return { width: 248, height: 305 };
    }
  };

  const { width, height } = getDropdownSize();

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  const handleItemClick = (value: string) => {
    console.log(`Выбран фильтр: ${type} = ${value}`);
    setSelectedValue(value);
    // Здесь будет логика применения фильтра
    // Можно закрыть dropdown после выбора, если нужно
    // onClose();
  };

  // Для отображения в зависимости от типа фильтра
  const renderContent = () => {
    if (isYearFilter) {
      return yearOptions.map((option) => (
        <div
          key={option.value}
          className={`${styles.filterDropdown__item} ${
            selectedValue === option.value
              ? styles.filterDropdown__item_active
              : ''
          }`}
          onClick={() => handleItemClick(option.value)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleItemClick(option.value);
            }
          }}
        >
          <span className={styles.filterDropdown__itemValue}>
            {option.label}
          </span>
        </div>
      ));
    } else {
      return filterData.map((item) => (
        <div
          key={item.value}
          className={`${styles.filterDropdown__item} ${
            selectedValue === item.value
              ? styles.filterDropdown__item_active
              : ''
          }`}
          onClick={() => handleItemClick(item.value)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleItemClick(item.value);
            }
          }}
        >
          <span className={styles.filterDropdown__itemValue}>{item.value}</span>
          <span className={styles.filterDropdown__itemCount}>{item.count}</span>
        </div>
      ));
    }
  };

  return (
    <div
      className={styles.filterDropdown}
      ref={dropdownRef}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div className={styles.filterDropdown__list}>{renderContent()}</div>
    </div>
  );
}
