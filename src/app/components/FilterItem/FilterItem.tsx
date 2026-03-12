import classNames from 'classnames';
import styles from '@/app/components/Filter/filter.module.css';
import { useEffect, useRef } from 'react';

type filterItemProps = {
  activeFilter: null | string;
  changeActiveFilter: (n: string) => void;
  nameFilter: string;
  list: string[];
  titleFilter: string;
  onSelect: (value: string) => void;
  selectedItems?: string[]; // Массив выбранных элементов
  multiple?: boolean; // Разрешен ли множественный выбор
};

export default function FilterItem({
  activeFilter,
  changeActiveFilter,
  nameFilter,
  list,
  titleFilter,
  onSelect,
  selectedItems = [],
  multiple = false,
}: filterItemProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (activeFilter === nameFilter) {
          changeActiveFilter(nameFilter);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeFilter, nameFilter, changeActiveFilter]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && activeFilter === nameFilter) {
        changeActiveFilter(nameFilter);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeFilter, nameFilter, changeActiveFilter]);

  const handleItemClick = (item: string) => {
    onSelect(item);
    // Для одиночного выбора (годы) закрываем фильтр
    if (!multiple) {
      changeActiveFilter(nameFilter);
    }
    // Для множественного выбора (авторы, жанры) НЕ закрываем
  };

  // Проверяем, выбран ли элемент
  const isItemSelected = (item: string) => {
    if (nameFilter === 'year') {
      // Для годов сравниваем с лейблами
      const yearMap: Record<string, string> = {
        default: 'По умолчанию',
        newest: 'Сначала новые',
        oldest: 'Сначала старые',
      };
      return selectedItems.includes(yearMap[item] || item);
    }
    return selectedItems.includes(item);
  };

  // Определяем, есть ли выбранные элементы в этом фильтре
  const hasSelectedItems = selectedItems.length > 0;

  return (
    <div
      ref={wrapperRef}
      className={classNames(styles.filter__button, {
        [styles.filter__button_active]: activeFilter === nameFilter,
        [styles.filter__button_hasSelected]:
          hasSelectedItems && activeFilter !== nameFilter,
      })} // Добавляем класс если есть выбранные
      onClick={() => changeActiveFilter(nameFilter)}
      data-filter={nameFilter}
    >
      {titleFilter}

      {activeFilter === nameFilter && (
        <div className={styles.filter__wrapper}>
          <ul className={styles.filter__list}>
            {list.map((el, index) => {
              const selected = isItemSelected(el);
              return (
                <li
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick(el);
                  }}
                  className={classNames({
                    [styles.filter__listItem_selected]: selected,
                  })}
                >
                  {el}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
