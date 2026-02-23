/**
 * Infinite-scroll hook for paginated post feeds.
 * Currently returns mock data for UI development.
 * TODO: Switch to real API calls when WordPress is connected.
 */

import { useInfiniteQuery } from '@tanstack/react-query';

import { MOCK_POSTS } from '../api/mockData';
import type { AppPost, PaginatedResponse } from '../api/types';
import { Config } from '../constants/config';

interface UsePostsOptions {
  categoryId?: number;
  search?: string;
  enabled?: boolean;
}

async function fetchMockPosts(params: {
  page: number;
  perPage: number;
  search?: string;
}): Promise<PaginatedResponse<AppPost>> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600));

  let posts = [...MOCK_POSTS];

  if (params.search) {
    const q = params.search.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q),
    );
  }

  const start = (params.page - 1) * params.perPage;
  const end = start + params.perPage;
  const paged = posts.slice(start, end);

  return {
    data: paged,
    totalItems: posts.length,
    totalPages: Math.ceil(posts.length / params.perPage),
  };
}

export function usePosts(options: UsePostsOptions = {}) {
  const { categoryId, search, enabled = true } = options;

  return useInfiniteQuery({
    queryKey: ['posts', { categoryId, search }],
    queryFn: ({ pageParam = 1 }) =>
      fetchMockPosts({
        page: pageParam,
        perPage: Config.POSTS_PER_PAGE,
        search,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPageParam >= lastPage.totalPages) return undefined;
      return lastPageParam + 1;
    },
    enabled,
    staleTime: Config.QUERY_STALE_TIME,
  });
}
