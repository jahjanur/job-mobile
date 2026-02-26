/**
 * Trending posts hook — returns posts sorted by viewCount (most read).
 * Mock phase: sorts existing mock data by viewCount desc.
 * Future: will query a dedicated trending/analytics endpoint.
 */

import { useQuery } from '@tanstack/react-query';

import { MOCK_POSTS } from '../api/mockData';
import type { AppPost } from '../api/types';
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
      await new Promise((r) => setTimeout(r, 300));
      return [...MOCK_POSTS]
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, limit);
    },
    enabled,
    staleTime: Config.QUERY_STALE_TIME,
  });
}
