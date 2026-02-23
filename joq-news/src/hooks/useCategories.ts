/**
 * Categories hook.
 * Currently returns mock data for UI development.
 * TODO: Switch to fetchCategories() when WordPress is connected.
 */

import { useQuery } from '@tanstack/react-query';

import { MOCK_CATEGORIES } from '../api/mockData';
import { Config } from '../constants/config';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_CATEGORIES;
    },
    staleTime: Config.QUERY_STALE_TIME * 2,
  });
}
