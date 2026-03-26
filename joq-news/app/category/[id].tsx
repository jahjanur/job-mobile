/**
 * Category feed screen — shows posts filtered by category.
 */

import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PostFeed } from '../../src/components/feed/PostFeed';
import { usePosts } from '../../src/hooks/usePosts';
import { useRefreshByUser } from '../../src/hooks/useRefreshByUser';
import { useTheme } from '../../src/theme';

export default function CategoryFeedScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const categoryId = Number(id);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, spacing, typography, radius, dark } = useTheme();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = usePosts({ categoryId });

  const { isRefreshing, onRefresh } = useRefreshByUser(refetch);

  const allPosts = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  const categoryName = name ? decodeURIComponent(name) : 'Category';

  const ListHeader = useMemo(
    () => (
      <View
        style={{
          paddingTop: insets.top + spacing.sm,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.lg,
        }}
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.backBtn,
              {
                backgroundColor: colors.surface,
                borderRadius: radius.full,
                marginRight: spacing.md,
                borderWidth: dark ? 0 : StyleSheet.hairlineWidth,
                borderColor: colors.borderLight,
              },
            ]}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                typography.h2,
                {
                  color: colors.text,
                  fontSize: 22,
                  letterSpacing: -0.3,
                },
              ]}
            >
              {categoryName}
            </Text>
          </View>
        </View>
      </View>
    ),
    [insets.top, spacing, colors, radius, typography, categoryName, router, dark],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <PostFeed
        posts={allPosts}
        isLoading={isLoading}
        isError={isError}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        onLoadMore={() => fetchNextPage()}
        onRetry={() => refetch()}
        ListHeaderComponent={ListHeader}
        emptyTitle="Asnjë artikull akoma"
        emptyMessage={`Asnjë artikull u gjet në ${categoryName}.`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
});
