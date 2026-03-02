/**
 * Single post hook.
 * Fetches a post by ID from the WordPress REST API.
 */

import { useQuery } from '@tanstack/react-query';

import { fetchPost } from '../api/wordpress';
import { Config } from '../constants/config';

export function usePost(id: number) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
    enabled: id > 0,
    staleTime: Config.QUERY_STALE_TIME,
  });
}
