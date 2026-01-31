'use client';

import { FilterItem, FilterType } from '@/sharedTypes/sharedTypes';
import { useEffect, useRef } from 'react';
import styles from './filterDropdown.module.css';

interface FilterDropdownProps {
  type: FilterType;
  data: FilterItem[];
  onClose: () => void;
  position?: { top: number; left: number };
  selectedValue?: string;
}

export default function FilterDropdown({
  type,
  data,
  onClose,
  position = { top: 0, left: 0 },
  selectedValue,
}: FilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Для окна с годами показываем статичный список
  const isYearFilter = type === 'year';

  const yearOptions = [
    { value: 'default', label: 'По умолчанию' },
    { value: 'newest', label: 'Сначала новые' },
    { value: 'oldest', label: 'Сначала старые' },
  ];

  const handleItemClick = (value: string) => {
    console.log(`Выбран фильтр: ${type} = ${value}`);
    // Здесь будет логика применения фильтра
  };

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
      <div className={styles.filterDropdown__list}>
        {isYearFilter
          ? // Для фильтра по годам - статичный список
            yearOptions.map((option) => (
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
            ))
          : // Для фильтров по исполнителям и жанрам - динамический список
            data.map((item) => (
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
                <span className={styles.filterDropdown__itemValue}>
                  {item.value}
                </span>
                {item.count !== undefined && (
                  <span className={styles.filterDropdown__itemCount}>
                    {item.count}
                  </span>
                )}
              </div>
            ))}
      </div>
    </div>
  );
}
