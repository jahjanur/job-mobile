/**
 * Categories hook.
 * Fetches all categories from the WordPress REST API.
 */

import { useQuery } from '@tanstack/react-query';

import { fetchCategories } from '../api/wordpress';
import { Config } from '../constants/config';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Config.QUERY_STALE_TIME * 2,
  });
}
