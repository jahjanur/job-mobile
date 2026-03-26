/**
 * Home Feed — Premium magazine-style editorial layout.
 * Features: branded header with date, hero story, trending ticker,
 * editor's pick spotlight, category quick-links, 2-column visual grid,
 * and paginated latest feed — each section visually distinct.
 */

import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { AppPost } from '../../src/api/types';
import { AdBanner } from '../../src/components/ads/AdBanner';
import { CompactCard } from '../../src/components/cards/CompactCard';
import { HeroCard } from '../../src/components/cards/HeroCard';
import { CategorySpotlight } from '../../src/components/feed/CategorySpotlight';
import { PostFeed } from '../../src/components/feed/PostFeed';
import { HeroSkeleton, PostCardSkeleton } from '../../src/components/loaders/SkeletonBox';
import { AppLogo } from '../../src/components/ui/AppLogo';
import { BreakingNewsBanner } from '../../src/components/ui/BreakingNewsBanner';
import { CategoryBar } from '../../src/components/ui/CategoryBar';
import { PressableScale } from '../../src/components/ui/PressableScale';
import { TrendingTicker } from '../../src/components/ui/TrendingTicker';
import { WP_CATEGORIES, getCategoryIcon } from '../../src/constants/categories';
import { usePosts } from '../../src/hooks/usePosts';
import { useRefreshByUser } from '../../src/hooks/useRefreshByUser';
import { useTrendingPosts } from '../../src/hooks/useTrendingPosts';
import { useTheme } from '../../src/theme';
import { formatPostDateWithTime, formatTodayAlbanian } from '../../src/utils/date';
import { getImageSource } from '../../src/utils/image';
import { estimateReadingTime } from '../../src/utils/reading';

type IonIcon = ComponentProps<typeof Ionicons>['name'];

const PILL_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F97316',
  '#10B981', '#06B6D4', '#EF4444', '#6366F1',
  '#14B8A6', '#F59E0B',
];

export default function HomeScreen() {
  const { colors, spacing, typography, dark, radius, fonts } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = usePosts(selectedCategoryId ? { categoryId: selectedCategoryId } : {});

  const { isRefreshing, onRefresh } = useRefreshByUser(refetch);
  const { data: trendingData } = useTrendingPosts({ limit: 6 });
  const categories = WP_CATEGORIES;

  const allPosts = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  // Split posts into visual sections (only when not filtering)
  const isFiltering = selectedCategoryId !== null;
  const heroPost = isFiltering ? null : allPosts[0];
  const trendingPosts = isFiltering ? [] : (trendingData ?? allPosts.slice(1, 7));
  const spotlightPost = isFiltering ? null : allPosts[7];
  const gridPosts = isFiltering ? [] : allPosts.slice(3, 7);
  const feedPosts = isFiltering ? allPosts : allPosts.slice(8);

  const todayFormatted = formatTodayAlbanian();

  const ListHeader = useMemo(() => {
    if (isLoading) {
      return (
        <View style={{ paddingTop: insets.top + spacing.md }}>
          <View
            style={{
              marginHorizontal: spacing.lg,
              marginBottom: spacing.xxl,
            }}
          >
            <AppLogo width={120} />
          </View>
          <HeroSkeleton />
          <View style={{ marginTop: spacing.lg }}>
            <PostCardSkeleton />
            <PostCardSkeleton />
          </View>
        </View>
      );
    }

    return (
      <View style={{ paddingTop: insets.top + spacing.md }}>
        {/* ── Header ──────────────────────────────────── */}
        <View
          style={[
            styles.headerRow,
            {
              marginHorizontal: spacing.lg,
              marginBottom: spacing.md,
            },
          ]}
        >
          <AppLogo width={110} />
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => router.push('/(tabs)/search')}
              style={[
                styles.headerBtn,
                {
                  backgroundColor: colors.surface,
                  borderRadius: radius.full,
                  borderWidth: dark ? 0 : StyleSheet.hairlineWidth,
                  borderColor: colors.borderLight,
                },
              ]}
              hitSlop={6}
            >
              <Ionicons name="search-outline" size={18} color={colors.icon} />
            </Pressable>
            <Pressable
              onPress={() => router.push('/(tabs)/settings')}
              style={[
                styles.headerBtn,
                {
                  backgroundColor: colors.surface,
                  borderRadius: radius.full,
                  marginLeft: spacing.sm,
                  borderWidth: dark ? 0 : StyleSheet.hairlineWidth,
                  borderColor: colors.borderLight,
                },
              ]}
              hitSlop={6}
            >
              <Ionicons name="person-outline" size={18} color={colors.icon} />
            </Pressable>
          </View>
        </View>

        {/* Date line */}
        <Text
          style={[
            typography.caption,
            {
              color: colors.textTertiary,
              marginHorizontal: spacing.lg,
              marginBottom: spacing.md,
              textTransform: 'capitalize',
            },
          ]}
        >
          {todayFormatted}
        </Text>

        {/* ── Category filter bar ─────────────────────── */}
        <CategoryBar
          categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: 0, parentId: 0 }))}
          selectedId={selectedCategoryId}
          onSelect={(catId) => setSelectedCategoryId(catId)}
        />

        {/* ── Trending ticker ────────────────────────── */}
        {!selectedCategoryId && trendingPosts.length > 0 && (
          <TrendingTicker posts={trendingPosts} />
        )}

        {/* ── When filtering by category, skip the rich sections ── */}
        {selectedCategoryId ? null : (
          <>
        {/* ── Breaking news ────────────────────────── */}
        {allPosts[1] && (
          <BreakingNewsBanner post={allPosts[1]} label="LAJM I FUNDIT" />
        )}

        {/* ── Hero story ─────────────────────────────── */}
        {heroPost && <HeroCard post={heroPost} />}

        {/* ── Trending section ───────────────────────── */}
        {trendingPosts.length > 0 && (
          <>
            <View
              style={[
                styles.sectionRow,
                { marginHorizontal: spacing.lg, marginTop: spacing.lg },
              ]}
            >
              <View style={styles.sectionTitleRow}>
                <Ionicons
                  name="trending-up-outline"
                  size={16}
                  color={colors.accent}
                />
                <Text
                  style={[
                    typography.h3,
                    {
                      color: colors.text,
                      marginLeft: spacing.sm,
                      fontSize: 16,
                    },
                  ]}
                >
                  Në trend
                </Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: spacing.lg,
                paddingTop: spacing.md,
                paddingBottom: spacing.sm,
              }}
            >
              {trendingPosts.map((post: AppPost, i: number) => (
                <CompactCard key={post.id} post={post} index={i} />
              ))}
            </ScrollView>
          </>
        )}

        {/* ── Home top banner ad ───────────────────── */}
        <AdBanner />

        {/* ── Editor's Pick / Spotlight ──────────────── */}
        {spotlightPost && (
          <>
            <View
              style={[
                styles.sectionRow,
                {
                  marginHorizontal: spacing.lg,
                  marginTop: spacing.xxl,
                },
              ]}
            >
              <View style={styles.sectionTitleRow}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text
                  style={[
                    typography.h3,
                    {
                      color: colors.text,
                      marginLeft: spacing.sm,
                      fontSize: 16,
                    },
                  ]}
                >
                  Zgjedhja e redaktorit
                </Text>
              </View>
            </View>

            <PressableScale
              onPress={() => router.push(`/article/${spotlightPost.id}`)}
              style={[
                styles.spotlightCard,
                {
                  marginHorizontal: spacing.lg,
                  marginTop: spacing.md,
                  backgroundColor: colors.card,
                  borderRadius: radius.xl,
                  borderWidth: dark ? 0 : StyleSheet.hairlineWidth,
                  borderColor: colors.borderLight,
                  overflow: 'hidden',
                },
              ]}
            >
              {/* Full-width image top */}
              <Image
                source={getImageSource(spotlightPost.featuredImage)}
                style={{ width: '100%', height: 180 }}
                contentFit="cover"
                transition={300}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                style={styles.spotlightGradient}
              />
              {/* Category badge on image */}
              {spotlightPost.categoryNames[0] && (
                <View
                  style={[
                    styles.spotlightBadge,
                    {
                      top: spacing.md,
                      left: spacing.md,
                      backgroundColor: '#F59E0B',
                      borderRadius: radius.full,
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.xxs + 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.label,
                      { color: '#FFFFFF', letterSpacing: 0.5, fontSize: 9 },
                    ]}
                  >
                    {spotlightPost.categoryNames[0].toUpperCase()}
                  </Text>
                </View>
              )}
              {/* Text content below */}
              <View style={{ padding: spacing.lg }}>
                <Text
                  style={[
                    typography.h2,
                    {
                      color: colors.text,
                      fontSize: 18,
                      lineHeight: 24,
                      letterSpacing: -0.3,
                      fontWeight: '700',
                    },
                  ]}
                  numberOfLines={2}
                >
                  {spotlightPost.title}
                </Text>
                <Text
                  style={[
                    typography.bodySm,
                    {
                      color: colors.textSecondary,
                      marginTop: spacing.sm,
                      lineHeight: 20,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {spotlightPost.excerpt}
                </Text>
                <View style={[styles.spotlightMeta, { marginTop: spacing.md }]}>
                  <View style={styles.sectionTitleRow}>
                    <Ionicons
                      name="person-outline"
                      size={12}
                      color={colors.textTertiary}
                    />
                    <Text
                      style={[
                        typography.caption,
                        {
                          color: colors.textTertiary,
                          marginLeft: spacing.xxs + 1,
                        },
                      ]}
                    >
                      {spotlightPost.authorName}
                    </Text>
                  </View>
                  <View style={styles.sectionTitleRow}>
                    <Ionicons
                      name="time-outline"
                      size={12}
                      color={colors.textTertiary}
                    />
                    <Text
                      style={[
                        typography.caption,
                        {
                          color: colors.textTertiary,
                          marginLeft: spacing.xxs + 1,
                        },
                      ]}
                    >
                      {estimateReadingTime(spotlightPost.content)} min lexim
                    </Text>
                  </View>
                </View>
              </View>
            </PressableScale>
          </>
        )}

        {/* ── Category Quick Links ───────────────────── */}
        <View
          style={[
            styles.sectionRow,
            {
              marginHorizontal: spacing.lg,
              marginTop: spacing.xxl,
            },
          ]}
        >
          <View style={styles.sectionTitleRow}>
            <Ionicons name="compass-outline" size={16} color={colors.accent} />
            <Text
              style={[
                typography.h3,
                {
                  color: colors.text,
                  marginLeft: spacing.sm,
                  fontSize: 16,
                },
              ]}
            >
              Shfleto temat
            </Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.xs,
          }}
        >
          {categories.map((cat, i) => {
            const color = PILL_COLORS[i % PILL_COLORS.length];
            const iconName = getCategoryIcon(cat.slug);
            return (
              <Pressable
                key={cat.id}
                onPress={() =>
                  router.push(
                    `/category/${cat.id}?name=${encodeURIComponent(cat.name)}`,
                  )
                }
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: color + '12',
                    borderRadius: radius.full,
                    paddingHorizontal: spacing.lg,
                    paddingVertical: spacing.sm + 2,
                    marginRight: spacing.sm,
                    borderWidth: 1,
                    borderColor: color + '25',
                  },
                ]}
              >
                {cat.flag ? (
                  <Text style={{ fontSize: 14, marginRight: spacing.xs + 1 }}>{cat.flag}</Text>
                ) : (
                  <Ionicons
                    name={iconName}
                    size={15}
                    color={color}
                    style={{ marginRight: spacing.xs + 1 }}
                  />
                )}
                <Text
                  style={[
                    typography.captionMedium,
                    { color: color, fontSize: 13 },
                  ]}
                >
                  {cat.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ── Visual Grid "Për ty" ───────────────────── */}
        {gridPosts.length >= 4 && (
          <>
            <View
              style={[
                styles.sectionRow,
                {
                  marginHorizontal: spacing.lg,
                  marginTop: spacing.xxl,
                },
              ]}
            >
              <View style={styles.sectionTitleRow}>
                <Ionicons name="flash-outline" size={16} color={colors.accent} />
                <Text
                  style={[
                    typography.h3,
                    {
                      color: colors.text,
                      marginLeft: spacing.sm,
                      fontSize: 16,
                    },
                  ]}
                >
                  Për ty
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.gridContainer,
                {
                  marginHorizontal: spacing.lg,
                  marginTop: spacing.md,
                },
              ]}
            >
              {/* Top row: 1 large + 1 small stacked */}
              <View style={styles.gridTopRow}>
                <PressableScale
                  onPress={() =>
                    router.push(`/article/${gridPosts[0].id}`)
                  }
                  style={[
                    styles.gridLarge,
                    {
                      borderRadius: radius.lg,
                      marginRight: spacing.sm,
                    },
                  ]}
                >
                  <Image
                    source={getImageSource(gridPosts[0].featuredImage)}
                    style={[StyleSheet.absoluteFillObject, { borderRadius: radius.lg }]}
                    contentFit="cover"
                    transition={250}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={[StyleSheet.absoluteFillObject, { borderRadius: radius.lg }]}
                  />
                  <View
                    style={[
                      styles.gridOverlay,
                      { padding: spacing.md },
                    ]}
                  >
                    <View
                      style={[
                        styles.gridCatBadge,
                        {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: radius.full,
                          paddingHorizontal: spacing.sm,
                          paddingVertical: 2,
                          marginBottom: spacing.xs,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          typography.label,
                          { color: '#FFF', fontSize: 8 },
                        ]}
                      >
                        {gridPosts[0].categoryNames[0]?.toUpperCase()}
                      </Text>
                    </View>
                    <Text
                      style={[
                        typography.captionMedium,
                        { color: '#FFF', lineHeight: 18, fontSize: 14 },
                      ]}
                      numberOfLines={3}
                    >
                      {gridPosts[0].title}
                    </Text>
                  </View>
                </PressableScale>

                <View style={styles.gridSmallCol}>
                  {gridPosts.slice(1, 3).map((post) => (
                    <PressableScale
                      key={post.id}
                      onPress={() => router.push(`/article/${post.id}`)}
                      style={[
                        styles.gridSmall,
                        {
                          borderRadius: radius.lg,
                          marginBottom: spacing.sm,
                        },
                      ]}
                    >
                      <Image
                        source={getImageSource(post.featuredImage)}
                        style={[StyleSheet.absoluteFillObject, { borderRadius: radius.lg }]}
                        contentFit="cover"
                        transition={250}
                      />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={[StyleSheet.absoluteFillObject, { borderRadius: radius.lg }]}
                      />
                      <View
                        style={[
                          styles.gridOverlay,
                          { padding: spacing.sm },
                        ]}
                      >
                        <Text
                          style={[
                            typography.caption,
                            {
                              color: 'rgba(255,255,255,0.6)',
                              fontSize: 9,
                              marginBottom: 2,
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {post.categoryNames[0]?.toUpperCase()}
                        </Text>
                        <Text
                          style={[
                            typography.captionMedium,
                            { color: '#FFF', fontSize: 12, lineHeight: 16 },
                          ]}
                          numberOfLines={2}
                        >
                          {post.title}
                        </Text>
                      </View>
                    </PressableScale>
                  ))}
                </View>
              </View>

              {/* Bottom wide card */}
              <PressableScale
                onPress={() =>
                  router.push(`/article/${gridPosts[3].id}`)
                }
                style={[
                  styles.gridWide,
                  {
                    borderRadius: radius.lg,
                    backgroundColor: colors.card,
                    borderWidth: dark ? 0 : StyleSheet.hairlineWidth,
                    borderColor: colors.borderLight,
                    marginTop: spacing.sm,
                  },
                ]}
              >
                <Image
                  source={getImageSource(gridPosts[3].featuredImage)}
                  style={[
                    styles.gridWideImage,
                    { borderRadius: radius.md },
                  ]}
                  contentFit="cover"
                  transition={250}
                />
                <View style={[styles.gridWideText, { padding: spacing.md }]}>
                  <Text
                    style={[
                      typography.label,
                      { color: colors.accent, letterSpacing: 0.5, marginBottom: 4 },
                    ]}
                  >
                    {gridPosts[3].categoryNames[0]?.toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      typography.bodyMedium,
                      {
                        color: colors.text,
                        fontSize: 14,
                        lineHeight: 20,
                      },
                    ]}
                    numberOfLines={2}
                  >
                    {gridPosts[3].title}
                  </Text>
                  <View
                    style={[styles.sectionTitleRow, { marginTop: spacing.sm }]}
                  >
                    <Ionicons
                      name="time-outline"
                      size={10}
                      color={colors.textTertiary}
                    />
                    <Text
                      style={[
                        typography.caption,
                        {
                          color: colors.textTertiary,
                          marginLeft: 4,
                        },
                      ]}
                    >
                      {formatPostDateWithTime(gridPosts[3].date)}
                    </Text>
                  </View>
                </View>
              </PressableScale>
            </View>
          </>
        )}

        {/* ── Dynamic category spotlights ────────────── */}
        <CategorySpotlight categoryId={6} categoryName="Veç e jona" />
        <CategorySpotlight categoryId={82} categoryName="Shqipëri" />
        <CategorySpotlight categoryId={37958} categoryName="Kosovë" />
        <CategorySpotlight categoryId={45} categoryName="Sport" />

        {/* ── Divider + Latest section ───────────────── */}
        <View
          style={[
            styles.divider,
            {
              backgroundColor: colors.border,
              marginHorizontal: spacing.lg,
              marginTop: spacing.xxl,
            },
          ]}
        />

        <View
          style={[
            styles.sectionRow,
            {
              marginHorizontal: spacing.lg,
              marginTop: spacing.xxl,
              marginBottom: spacing.md,
            },
          ]}
        >
          <View style={styles.sectionTitleRow}>
            <Ionicons name="time-outline" size={16} color={colors.accent} />
            <Text
              style={[
                typography.h3,
                {
                  color: colors.text,
                  marginLeft: spacing.sm,
                  fontSize: 16,
                },
              ]}
            >
              Të fundit
            </Text>
          </View>
        </View>
          </>
        )}
      </View>
    );
  }, [
    isLoading,
    selectedCategoryId,
    heroPost,
    trendingPosts,
    spotlightPost,
    gridPosts,
    categories,
    insets.top,
    spacing,
    typography,
    colors,
    dark,
    radius,
    fonts,
    todayFormatted,
    router,
  ]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <PostFeed
        posts={feedPosts}
        isLoading={isLoading}
        isError={isError}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        onLoadMore={() => fetchNextPage()}
        onRetry={() => refetch()}
        ListHeaderComponent={ListHeader}
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },

  /* ── Spotlight card ───────────── */
  spotlightCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  spotlightGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  spotlightBadge: {
    position: 'absolute',
  },
  spotlightMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  /* ── Category pills ───────────── */
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* ── Visual grid ──────────────── */
  gridContainer: {},
  gridTopRow: {
    flexDirection: 'row',
    height: 220,
  },
  gridLarge: {
    flex: 1,
    overflow: 'hidden',
  },
  gridSmallCol: {
    flex: 1,
  },
  gridSmall: {
    flex: 1,
    overflow: 'hidden',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  gridCatBadge: {
    alignSelf: 'flex-start',
  },
  gridWide: {
    flexDirection: 'row',
    height: 100,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  gridWideImage: {
    width: 100,
    height: '100%',
  },
  gridWideText: {
    flex: 1,
    justifyContent: 'center',
  },
});
