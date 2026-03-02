/**
 * Infinite-scroll hook for paginated post feeds.
 * Fetches real posts from the WordPress REST API.
 */

import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchPosts } from '../api/wordpress';
import { Config } from '../constants/config';

interface UsePostsOptions {
  categoryId?: number;
  search?: string;
  enabled?: boolean;
}

export function usePosts(options: UsePostsOptions = {}) {
  const { categoryId, search, enabled = true } = options;

  return useInfiniteQuery({
    queryKey: ['posts', { categoryId, search }],
    queryFn: ({ pageParam = 1 }) =>
      fetchPosts({
        page: pageParam,
        perPage: Config.POSTS_PER_PAGE,
        search,
        categoryId,
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
