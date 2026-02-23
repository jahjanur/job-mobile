import { useState, useCallback } from 'react';

/**
 * Utility hook for pull-to-refresh. Wraps a refetch function
 * and exposes a clean isRefreshing flag for RefreshControl.
 */
export function useRefreshByUser(refetch: () => Promise<unknown>) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  return { isRefreshing, onRefresh };
}
