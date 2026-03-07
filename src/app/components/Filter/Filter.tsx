'use client';

import { FilterType, TrackType } from '@/sharedTypes/sharedTypes';
import styles from './filter.module.css';
import { useEffect, useState } from 'react';
import FilterButtons from '../FilterButtons/FilterButtons';
import FilterDropdown from '../FilterDropdown/FilterDropdown';

type FilterProps = {
  tracks: TrackType[];
};

export default function Filter({ tracks }: FilterProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleFilterClick = (filterType: FilterType, buttonRect: DOMRect) => {
    console.log('Клик по фильтру:', filterType);

    if (activeFilter === filterType) {
      setActiveFilter(null);
      setDropdownPosition(null);
    } else {
      setActiveFilter(filterType);
      setDropdownPosition({
        top: buttonRect.bottom + window.scrollY,
        left: buttonRect.left + window.scrollX,
      });
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
        setDropdownPosition(null);
        setActiveFilter(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeFilter]);

  return (
    <>
      <FilterButtons
        activeFilter={activeFilter}
        onFilterClick={handleFilterClick}
      />

      {activeFilter && dropdownPosition && (
        <FilterDropdown
          type={activeFilter}
          tracks={tracks}
          onClose={handleCloseFilter}
          position={dropdownPosition}
        />
      )}
    </>
  );
}
