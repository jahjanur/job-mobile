/**
 * Infinite-scroll hook for paginated post feeds.
 * Prefetches images for the next page for smoother scrolling.
 */

import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';

import { fetchPosts } from '../api/wordpress';
import { Config } from '../constants/config';
import { prefetchImages } from '../utils/image';

interface UsePostsOptions {
  categoryId?: number;
  search?: string;
  enabled?: boolean;
}

export function usePosts(options: UsePostsOptions = {}) {
  const { categoryId, search, enabled = true } = options;

  return useInfiniteQuery({
    queryKey: ['posts', { categoryId, search }],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fetchPosts({
        page: pageParam,
        perPage: Config.POSTS_PER_PAGE,
        search,
        categoryId,
      });

      // Prefetch images for this page so they're cached before scroll
      prefetchImages(result.data.map((p) => p.featuredImage));

      return result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPageParam >= lastPage.totalPages) return undefined;
      return lastPageParam + 1;
    },
    enabled,
    placeholderData: keepPreviousData,
  });
}
