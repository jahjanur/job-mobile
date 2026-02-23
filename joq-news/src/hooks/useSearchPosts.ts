import { useEffect, useMemo, useRef, useState } from 'react';

import { Config } from '../constants/config';
import { usePosts } from './usePosts';

/**
 * Search hook with debouncing built in.
 * Returns the query object and the debounced search term.
 */
export function useSearchPosts() {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(searchInput.trim());
    }, Config.SEARCH_DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [searchInput]);

  const postsQuery = usePosts({
    search: debouncedQuery || undefined,
    enabled: debouncedQuery.length >= 2,
  });

  const isSearching = useMemo(
    () => searchInput.trim() !== debouncedQuery,
    [searchInput, debouncedQuery],
  );

  return {
    searchInput,
    setSearchInput,
    debouncedQuery,
    isSearching,
    ...postsQuery,
  };
}
