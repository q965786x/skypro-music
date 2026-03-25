'use client';

import { TrackType } from '@/sharedTypes/sharedTypes';
import styles from './filter.module.css';
import { useMemo, useState } from 'react';
import { getUniqueValuesByKey } from '@/utils/helper';
import {
  setFilterAuthors,
  setFilterGenres,
  setFilterYear,
} from '@/store/features/trackSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import FilterItem from '../FilterItem/FilterItem';

type filterProps = {
  tracks: TrackType[];
};

// Опции для фильтра по годам
const yearOptions = [
  { value: 'По умолчанию', label: 'По умолчанию' },
  { value: 'Сначала новые', label: 'Сначала новые' },
  { value: 'Сначала старые', label: 'Сначала старые' },
];

export default function Filter({ tracks }: filterProps) {
  const [activeFilter, setActiveFilter] = useState<null | string>(null);
  const dispatch = useAppDispatch();

  // Получаем текущие выбранные фильтры из Redux store
  const selectedAuthors = useAppSelector(
    (state) => state.tracks.filters.authors,
  );
  const selectedGenres = useAppSelector((state) => state.tracks.filters.genres);
  const selectedYear = useAppSelector((state) => state.tracks.filters.years);

  const changeActiveFilter = (nameFilter: string) => {
    if (activeFilter === nameFilter) {
      return setActiveFilter(null);
    }
    setActiveFilter(nameFilter);
  };

  // Получаем уникальные значения из ВСЕХ треков
  const uniqAuthors = useMemo(
    () => getUniqueValuesByKey(tracks, 'author'),
    [tracks],
  );

  const uniqGenres = useMemo(
    () => getUniqueValuesByKey(tracks, 'genre'),
    [tracks],
  );

  const onSelectAuthor = (author: string) => {
    dispatch(setFilterAuthors(author));
  };

  const onSelectGenres = (genre: string) => {
    dispatch(setFilterGenres(genre));
  };

  const onSelectYear = (year: string) => {
    const selectedOption = yearOptions.find((opt) => opt.label === year);
    if (selectedOption) {
      dispatch(setFilterYear(selectedOption.value));
      setActiveFilter(null);
    }
  };

  // Формируем список годов для отображения
  const yearLabels = yearOptions.map((opt) => opt.label);

  return (
    <div className={styles.centerblock__filter}>
      <div className={styles.filter__title}>Искать по:</div>
      <FilterItem
        activeFilter={activeFilter}
        changeActiveFilter={changeActiveFilter}
        nameFilter={'author'}
        list={uniqAuthors}
        titleFilter={'исполнителю'}
        onSelect={onSelectAuthor}
        selectedItems={selectedAuthors}
        multiple={true}
      />
      <FilterItem
        activeFilter={activeFilter}
        changeActiveFilter={changeActiveFilter}
        nameFilter={'year'}
        list={yearLabels}
        titleFilter={'году выпуска'}
        onSelect={onSelectYear}
        selectedItems={selectedYear ? [selectedYear] : []}
        multiple={false}
      />
      <FilterItem
        activeFilter={activeFilter}
        changeActiveFilter={changeActiveFilter}
        nameFilter={'genre'}
        list={uniqGenres}
        titleFilter={'жанру'}
        onSelect={onSelectGenres}
        selectedItems={selectedGenres}
        multiple={true}
      />
    </div>
  );
}
