'use client';

import { useState, useEffect } from 'react';
import styles from './centerblock.module.css';
import Search from '../Search/Search';
import PlaylistHeader from '../PlaylistHeader/PlaylistHeader';
import { CenterblockProps, FilterType } from '@/sharedTypes/sharedTypes';
import TrackList from '../Tracklist/Tracklist';
import FilterDropdown from '../FilterDropdown/FilterDropdown';
import FilterButtons from '../FilterButtons/FilterButtons';

export function Centerblock({
  track,
  onTrackSelect,
  title = 'Треки',
}: CenterblockProps) {
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
    <div className={styles.centerblock}>
      <Search />
      <h2 className={styles.centerblock__h2}>{title}</h2>

      <FilterButtons
        activeFilter={activeFilter}
        onFilterClick={handleFilterClick}
      />

      {/* Dropdown фильтров */}
      {activeFilter && dropdownPosition && (
        <FilterDropdown
          type={activeFilter}
          tracks={track}
          onClose={handleCloseFilter}
          position={dropdownPosition}
        />
      )}

      <div className={styles.centerblock__content}>
        <PlaylistHeader />
        <TrackList tracks={track} playlist={track} />
      </div>
    </div>
  );
}
