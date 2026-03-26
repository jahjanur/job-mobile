/**
 * Category feed screen — premium design with branded header,
 * hero post, article count, and infinite scroll feed.
 */

import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AdBanner } from '../../src/components/ads/AdBanner';
import { PostCard } from '../../src/components/cards/PostCard';
import { BrandedLoader } from '../../src/components/loaders/BrandedLoader';
import { PressableScale } from '../../src/components/ui/PressableScale';
import { ALL_CATEGORIES, getCategoryIcon } from '../../src/constants/categories';
import { usePosts } from '../../src/hooks/usePosts';
import { useRefreshByUser } from '../../src/hooks/useRefreshByUser';
import { useTheme } from '../../src/theme';
import { formatPostDateWithTime } from '../../src/utils/date';
import { getImageSource } from '../../src/utils/image';
import { estimateReadingTime, formatReadingTime } from '../../src/utils/reading';

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

  const totalItems = data?.pages[0]?.totalItems ?? 0;
  const categoryName = name ? decodeURIComponent(name) : 'Category';
  const categoryEntry = ALL_CATEGORIES.find((c) => c.id === categoryId);
  const categoryIcon = getCategoryIcon(categoryEntry?.slug ?? '');
  const categoryFlag = categoryEntry?.flag;

  const heroPost = allPosts[0];
  const feedPosts = allPosts.slice(1);

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        {/* Fixed header on loading */}
        <View
          style={[
            styles.fixedHeader,
            {
              paddingTop: insets.top + spacing.sm,
              paddingHorizontal: spacing.lg,
              paddingBottom: spacing.md,
              backgroundColor: colors.background,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.6}
            style={[
              styles.backBtn,
              {
                backgroundColor: colors.surface,
                borderRadius: radius.full,
                borderWidth: dark ? 0 : StyleSheet.hairlineWidth,
                borderColor: colors.borderLight,
              },
            ]}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text
            style={[
              typography.h2,
              { color: colors.text, fontSize: 20, marginLeft: spacing.md, flex: 1 },
            ]}
            numberOfLines={1}
          >
            {categoryName}
          </Text>
        </View>
        <BrandedLoader message="Duke ngarkuar..." />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          if (contentSize.height - layoutMeasurement.height - contentOffset.y < 500) {
            handleEndReached();
          }
        }}
        scrollEventThrottle={400}
        contentContainerStyle={{ paddingBottom: spacing.massive + 40 }}
      >
        {/* ── Header ──────────────────────────────── */}
        <View style={{ paddingTop: insets.top + spacing.sm }}>
          {/* Nav row */}
          <View
            style={[
              styles.navRow,
              { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
            ]}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.6}
              style={[
                styles.backBtn,
                {
                  backgroundColor: colors.surface,
                  borderRadius: radius.full,
                  borderWidth: dark ? 0 : StyleSheet.hairlineWidth,
                  borderColor: colors.borderLight,
                },
              ]}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Category info */}
          <View style={[styles.categoryInfo, { paddingHorizontal: spacing.lg }]}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: colors.accent + '15',
                  borderRadius: radius.lg,
                },
              ]}
            >
              {categoryFlag ? (
                <Text style={{ fontSize: 28 }}>{categoryFlag}</Text>
              ) : (
                <Ionicons name={categoryIcon} size={26} color={colors.accent} />
              )}
            </View>
            <View style={{ marginLeft: spacing.lg, flex: 1 }}>
              <Text
                style={[
                  typography.h1,
                  { color: colors.text, fontSize: 24, letterSpacing: -0.3 },
                ]}
              >
                {categoryName}
              </Text>
              {totalItems > 0 && (
                <Text
                  style={[
                    typography.bodySm,
                    { color: colors.textTertiary, marginTop: spacing.xxs },
                  ]}
                >
                  {totalItems.toLocaleString()} artikuj
                </Text>
              )}
            </View>
          </View>

          {/* Divider */}
          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.borderLight,
                marginHorizontal: spacing.lg,
                marginTop: spacing.lg,
              },
            ]}
          />
        </View>

        {/* ── Hero post ───────────────────────────── */}
        {heroPost && (
          <PressableScale
            onPress={() => router.push(`/article/${heroPost.id}`)}
            style={[
              styles.heroCard,
              {
                marginHorizontal: spacing.lg,
                marginTop: spacing.lg,
                borderRadius: radius.xl,
              },
            ]}
          >
            <Image
              source={getImageSource(heroPost.featuredImageLarge ?? heroPost.featuredImage)}
              style={[styles.heroImage, { borderRadius: radius.xl }]}
              contentFit="cover"
              transition={300}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.85)']}
              style={[styles.heroGradient, { borderRadius: radius.xl }]}
            />
            <View style={[styles.heroContent, { padding: spacing.lg }]}>
              <View style={styles.heroMeta}>
                <Ionicons name="time-outline" size={11} color="rgba(255,255,255,0.7)" />
                <Text
                  style={[
                    typography.caption,
                    { color: 'rgba(255,255,255,0.7)', marginLeft: 4 },
                  ]}
                >
                  {formatReadingTime(estimateReadingTime(heroPost.content))}
                </Text>
                <View style={[styles.metaDot, { backgroundColor: 'rgba(255,255,255,0.4)' }]} />
                <Text
                  style={[typography.caption, { color: 'rgba(255,255,255,0.5)' }]}
                >
                  {formatPostDateWithTime(heroPost.date)}
                </Text>
              </View>
              <Text
                style={[
                  typography.h2,
                  {
                    color: '#FFF',
                    marginTop: spacing.sm,
                    lineHeight: 24,
                    textShadowColor: 'rgba(0,0,0,0.3)',
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 2,
                  },
                ]}
                numberOfLines={3}
              >
                {heroPost.title}
              </Text>
            </View>
          </PressableScale>
        )}

        {/* ── Section label ───────────────────────── */}
        <View
          style={[
            styles.sectionRow,
            {
              marginHorizontal: spacing.lg,
              marginTop: spacing.xl,
              marginBottom: spacing.md,
            },
          ]}
        >
          <Ionicons name="time-outline" size={15} color={colors.accent} />
          <Text
            style={[
              typography.h3,
              { color: colors.text, marginLeft: spacing.sm, fontSize: 15 },
            ]}
          >
            Të fundit
          </Text>
        </View>

        {/* ── Feed posts ──────────────────────────── */}
        {feedPosts.map((post, i) => (
          <React.Fragment key={post.id}>
            <PostCard post={post} />
            {(i + 1) % 5 === 0 && <AdBanner />}
          </React.Fragment>
        ))}

        {/* Loading more */}
        {isFetchingNextPage && (
          <View style={{ paddingVertical: spacing.xl, alignItems: 'center' }}>
            <ActivityIndicator color={colors.accent} />
          </View>
        )}

        {/* Empty state */}
        {!isLoading && allPosts.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={40} color={colors.textTertiary} />
            <Text
              style={[
                typography.h3,
                { color: colors.text, marginTop: spacing.lg, textAlign: 'center' },
              ]}
            >
              Asnjë artikull akoma
            </Text>
            <Text
              style={[
                typography.bodySm,
                { color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' },
              ]}
            >
              {`Asnjë artikull u gjet në ${categoryName}.`}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  fixedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navRow: {
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
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  heroCard: {
    height: 220,
    overflow: 'hidden',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 8,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
});
