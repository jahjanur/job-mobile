/**
 * Reusable post feed component used on Home, Category, and Search screens.
 * Uses FlashList for optimal rendering performance.
 * Supports infinite scroll pagination and pull-to-refresh.
 */

import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';

import type { AppPost } from '../../api/types';
import { useTheme } from '../../theme';
import { PostCard } from '../cards/PostCard';
import { PostCardSkeleton } from '../loaders/SkeletonBox';
import { EmptyState } from '../states/EmptyState';
import { ErrorState } from '../states/ErrorState';

interface PostFeedProps {
  posts: AppPost[];
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onRetry: () => void;
  ListHeaderComponent?: React.ReactElement | null;
  emptyTitle?: string;
  emptyMessage?: string;
}

export function PostFeed({
  posts,
  isLoading,
  isError,
  isFetchingNextPage,
  hasNextPage,
  isRefreshing,
  onRefresh,
  onLoadMore,
  onRetry,
  ListHeaderComponent,
  emptyTitle = 'Asnjë artikull',
  emptyMessage = 'Kontrolloni përsëri më vonë për përmbajtje të re.',
}: PostFeedProps) {
  const { colors, spacing } = useTheme();

  const renderItem = useCallback(
    ({ item }: { item: AppPost }) => <PostCard post={item} />,
    [],
  );

  const keyExtractor = useCallback((item: AppPost) => String(item.id), []);

  const ListFooter = useMemo(() => {
    if (isFetchingNextPage) {
      return (
        <View style={[styles.footer, { paddingVertical: spacing.xl }]}>
          <ActivityIndicator color={colors.accent} />
        </View>
      );
    }
    return null;
  }, [isFetchingNextPage, colors.accent, spacing.xl]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {ListHeaderComponent}
        <View style={{ marginTop: spacing.md }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {ListHeaderComponent}
        <ErrorState onRetry={onRetry} />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {ListHeaderComponent}
        <EmptyState
          icon="file-text"
          title={emptyTitle}
          message={emptyMessage}
        />
      </View>
    );
  }

  return (
    <FlashList
      data={posts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooter}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      }}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent}
          colors={[colors.accent]}
        />
      }
      contentContainerStyle={{ paddingBottom: spacing.massive }}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
  },
});
