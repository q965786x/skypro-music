import { useAppDispatch } from '@/store/store';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { resetFilters } from '@/store/features/trackSlice';

export const useResetFilters = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(resetFilters());
  }, [dispatch, pathname]);
};
