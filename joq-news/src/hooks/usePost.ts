/**
 * Single post hook.
 * Currently returns mock data for UI development.
 * TODO: Switch to fetchPost() when WordPress is connected.
 */

import { useQuery } from '@tanstack/react-query';

import { MOCK_POSTS } from '../api/mockData';
import { Config } from '../constants/config';

export function usePost(id: number) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 400));
      const post = MOCK_POSTS.find((p) => p.id === id);
      if (!post) throw new Error('Post not found');
      return post;
    },
    enabled: id > 0,
    staleTime: Config.QUERY_STALE_TIME,
  });
}
