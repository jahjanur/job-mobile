/**
 * Search screen — premium design with Ionicons,
 * animated search bar, and recent search chips.
 */

import React, { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PostFeed } from '../../src/components/feed/PostFeed';
import { EmptyState } from '../../src/components/states/EmptyState';
import { WP_CATEGORIES } from '../../src/constants/categories';
import { useSearchPosts } from '../../src/hooks/useSearchPosts';
import { useRefreshByUser } from '../../src/hooks/useRefreshByUser';
import { usePreferencesStore } from '../../src/store/preferencesStore';
import { useTheme } from '../../src/theme';

export default function SearchScreen() {
  const { colors, spacing, radius, typography, dark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const recentSearches = usePreferencesStore((s) => s.recentSearches);
  const addRecentSearch = usePreferencesStore((s) => s.addRecentSearch);
  const removeRecentSearch = usePreferencesStore((s) => s.removeRecentSearch);
  const clearRecentSearches = usePreferencesStore((s) => s.clearRecentSearches);

  const {
    searchInput,
    setSearchInput,
    debouncedQuery,
    isSearching: isDebouncing,
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useSearchPosts();

  const { isRefreshing, onRefresh } = useRefreshByUser(refetch);

  const allPosts = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  const handleSearch = (query: string) => {
    setSearchInput(query);
  };

  const handleSubmit = () => {
    if (searchInput.trim().length >= 2) {
      addRecentSearch(searchInput.trim());
    }
  };

  const handleRecentPress = (query: string) => {
    setSearchInput(query);
    addRecentSearch(query);
  };

  const showResults = debouncedQuery.length >= 2;
  const showRecent = !showResults && recentSearches.length > 0;
  const showEmpty =
    !showResults && !showRecent && searchInput.length === 0;

  const SearchHeader = (
      <View
        style={{
          paddingTop: insets.top + spacing.lg,
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.md,
          backgroundColor: colors.background,
        }}
      >
        <Text
          style={[
            typography.h1,
            {
              color: colors.text,
              marginBottom: spacing.lg,
              fontSize: 26,
              letterSpacing: -0.5,
              fontWeight: '800',
            },
          ]}
        >
          Kërko
        </Text>

        {/* Search input */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.searchBackground,
              borderRadius: radius.lg,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md + 2,
              borderWidth: dark ? 0 : StyleSheet.hairlineWidth,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={18}
            color={colors.textTertiary}
            style={{ marginRight: spacing.md }}
          />
          <TextInput
            value={searchInput}
            onChangeText={handleSearch}
            onSubmitEditing={handleSubmit}
            placeholder="Kërko artikuj..."
            placeholderTextColor={colors.textTertiary}
            style={[
              typography.body,
              {
                flex: 1,
                color: colors.text,
                padding: 0,
              },
            ]}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchInput.length > 0 && (
            <Pressable onPress={() => setSearchInput('')} hitSlop={12}>
              <Ionicons name="close" size={18} color={colors.textTertiary} />
            </Pressable>
          )}
        </View>

        {/* Recent searches */}
        {showRecent && (
          <View style={{ marginTop: spacing.xxl }}>
            <View style={styles.recentHeader}>
              <Text
                style={[
                  typography.captionMedium,
                  { color: colors.textSecondary, letterSpacing: 0.5 },
                ]}
              >
                KËRKIMET E FUNDIT
              </Text>
              <Pressable onPress={clearRecentSearches} hitSlop={8}>
                <Text
                  style={[typography.caption, { color: colors.accent }]}
                >
                  Pastro
                </Text>
              </Pressable>
            </View>
            {recentSearches.map((query) => (
              <View key={query} style={styles.recentRow}>
                <Pressable
                  onPress={() => handleRecentPress(query)}
                  style={[
                    styles.recentItem,
                    { paddingVertical: spacing.md },
                  ]}
                >
                  <Ionicons
                    name="time-outline"
                    size={15}
                    color={colors.textTertiary}
                    style={{ marginRight: spacing.md }}
                  />
                  <Text
                    style={[typography.body, { color: colors.text, flex: 1 }]}
                  >
                    {query}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => removeRecentSearch(query)}
                  hitSlop={8}
                  style={{ padding: spacing.sm }}
                >
                  <Ionicons name="close" size={14} color={colors.textTertiary} />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>
  );

  if (showEmpty) {
    const suggestedTopics = WP_CATEGORIES.slice(0, 8);

    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        {SearchHeader}
        <View style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xl }}>
          <Text
            style={[
              typography.captionMedium,
              { color: colors.textSecondary, letterSpacing: 0.5, marginBottom: spacing.md },
            ]}
          >
            SHFLETO TEMAT
          </Text>
          <View style={styles.topicsGrid}>
            {suggestedTopics.map((cat) => (
              <TouchableOpacity
                key={cat.slug}
                activeOpacity={0.7}
                onPress={() =>
                  router.push(
                    `/category/${cat.id}?name=${encodeURIComponent(cat.name)}`,
                  )
                }
                style={[
                  styles.topicChip,
                  {
                    backgroundColor: colors.surface,
                    borderRadius: radius.md,
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.md,
                    marginRight: spacing.sm,
                    marginBottom: spacing.sm,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: colors.borderLight,
                  },
                ]}
              >
                {cat.flag ? (
                  <Text style={{ fontSize: 14, marginRight: spacing.xs }}>
                    {cat.flag}
                  </Text>
                ) : (
                  <Ionicons
                    name={cat.icon}
                    size={14}
                    color={colors.accent}
                    style={{ marginRight: spacing.xs }}
                  />
                )}
                <Text
                  style={[typography.captionMedium, { color: colors.text }]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }

  if (!showResults) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        {SearchHeader}
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <PostFeed
        posts={allPosts}
        isLoading={isLoading || isDebouncing}
        isError={isError}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        onLoadMore={() => fetchNextPage()}
        onRetry={() => refetch()}
        ListHeaderComponent={SearchHeader}
        emptyTitle="Asnjë rezultat"
        emptyMessage={`Asnjë artikull u gjet për "${debouncedQuery}".`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topicChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
