/**
 * Trending posts hook — returns the most recent posts.
 * WordPress doesn't have a built-in "trending" metric, so we
 * fetch the latest posts as a proxy for trending content.
 */

import { useQuery } from '@tanstack/react-query';

import type { AppPost } from '../api/types';
import { fetchPosts } from '../api/wordpress';
import { Config } from '../constants/config';

interface UseTrendingOptions {
  limit?: number;
  enabled?: boolean;
}

export function useTrendingPosts(options: UseTrendingOptions = {}) {
  const { limit = 6, enabled = true } = options;

  return useQuery({
    queryKey: ['trending', { limit }],
    queryFn: async (): Promise<AppPost[]> => {
      const response = await fetchPosts({
        page: 1,
        perPage: limit,
      });
      return response.data;
    },
    enabled,
    staleTime: Config.QUERY_STALE_TIME,
  });
}
