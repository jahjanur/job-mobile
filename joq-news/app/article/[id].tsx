/**
 * Article detail screen — premium reading experience.
 * Full-bleed hero image, frosted floating buttons with Feather icons,
 * elegant typography, reading progress, and related articles.
 */

import React, { useCallback } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArticleContent } from '../../src/components/article/ArticleContent';
import { RelatedArticles } from '../../src/components/article/RelatedArticles';
import { ArticleDetailSkeleton } from '../../src/components/loaders/SkeletonBox';
import { ErrorState } from '../../src/components/states/ErrorState';
import { usePost } from '../../src/hooks/usePost';
import { useBookmarksStore } from '../../src/store/bookmarksStore';
import { useTheme } from '../../src/theme';
import { formatArticleDate } from '../../src/utils/date';
import { getImageSource } from '../../src/utils/image';
import { estimateReadingTime, formatReadingTime } from '../../src/utils/reading';
import { shareArticle } from '../../src/utils/share';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Number(id);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, spacing, radius, typography, fonts, dark } = useTheme();

  const { data: post, isLoading, isError, refetch } = usePost(postId);

  const isBookmarked = useBookmarksStore((s) => s.isBookmarked(postId));
  const toggleBookmark = useBookmarksStore((s) => s.toggleBookmark);

  const handleBookmark = useCallback(() => {
    if (post) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      toggleBookmark(post);
    }
  }, [post, toggleBookmark]);

  const handleShare = useCallback(() => {
    if (post) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      shareArticle(post);
    }
  }, [post]);

  const FloatingBackButton = (
    <Pressable
      onPress={() => router.back()}
      style={[
        styles.floatingBtn,
        {
          top: insets.top + spacing.sm,
          left: spacing.lg,
          backgroundColor: dark
            ? 'rgba(30,30,30,0.85)'
            : 'rgba(255,255,255,0.9)',
          borderRadius: radius.full,
        },
      ]}
      hitSlop={8}
    >
      <Feather name="arrow-left" size={20} color={colors.text} />
    </Pressable>
  );

  if (isLoading) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        {FloatingBackButton}
        <ScrollView>
          <View style={{ height: insets.top + 40 }} />
          <ArticleDetailSkeleton />
        </ScrollView>
      </View>
    );
  }

  if (isError || !post) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        {FloatingBackButton}
        <ErrorState
          message="Artikulli nuk mund të ngarkohej."
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  const readingTime = estimateReadingTime(post.content);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Floating back button */}
      {FloatingBackButton}

      {/* Floating action buttons */}
      <View
        style={[
          styles.actionsRow,
          {
            top: insets.top + spacing.sm,
            right: spacing.lg,
          },
        ]}
      >
        <Pressable
          onPress={handleBookmark}
          style={[
            styles.floatingBtn,
            {
              backgroundColor: isBookmarked
                ? colors.accent
                : dark
                  ? 'rgba(30,30,30,0.85)'
                  : 'rgba(255,255,255,0.9)',
              borderRadius: radius.full,
              marginRight: spacing.sm,
            },
          ]}
          hitSlop={8}
        >
          <Feather
            name="bookmark"
            size={18}
            color={isBookmarked ? '#FFFFFF' : colors.text}
          />
        </Pressable>
        <Pressable
          onPress={handleShare}
          style={[
            styles.floatingBtn,
            {
              backgroundColor: dark
                ? 'rgba(30,30,30,0.85)'
                : 'rgba(255,255,255,0.9)',
              borderRadius: radius.full,
            },
          ]}
          hitSlop={8}
        >
          <Feather name="share-2" size={18} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.massive + insets.bottom }}
      >
        {/* Hero image with gradient overlay */}
        <View style={styles.heroContainer}>
          <Image
            source={getImageSource(post.featuredImageLarge ?? post.featuredImage)}
            style={[styles.heroImage, { height: 340 }]}
            contentFit="cover"
            transition={400}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)']}
            style={styles.heroGradient}
          />
        </View>

        {/* Article header */}
        <View style={{ padding: spacing.lg }}>
          {/* Category + reading time row */}
          <View style={styles.badgeRow}>
            {post.categoryNames[0] && (
              <View
                style={[
                  styles.categoryBadge,
                  {
                    backgroundColor: colors.accentLight,
                    borderRadius: radius.sm,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: spacing.xxs,
                    marginRight: spacing.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.label,
                    { color: colors.accent, letterSpacing: 0.5 },
                  ]}
                >
                  {post.categoryNames[0].toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.readingBadge}>
              <Feather
                name="clock"
                size={12}
                color={colors.textTertiary}
                style={{ marginRight: 4 }}
              />
              <Text style={[typography.caption, { color: colors.textTertiary }]}>
                {formatReadingTime(readingTime)}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text
            style={[
              typography.heroTitle,
              {
                color: colors.text,
                fontFamily: fonts.serif,
                marginTop: spacing.md,
                marginBottom: spacing.lg,
                lineHeight: 34,
              },
            ]}
          >
            {post.title}
          </Text>

          {/* Author + date meta */}
          <View style={styles.metaRow}>
            {post.authorAvatar ? (
              <Image
                source={{ uri: post.authorAvatar }}
                style={[
                  styles.avatar,
                  { borderRadius: radius.full, marginRight: spacing.md },
                ]}
                contentFit="cover"
              />
            ) : (
              <View
                style={[
                  styles.avatarPlaceholder,
                  {
                    backgroundColor: colors.surface,
                    borderRadius: radius.full,
                    marginRight: spacing.md,
                  },
                ]}
              >
                <Feather name="user" size={18} color={colors.textTertiary} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={[typography.captionMedium, { color: colors.text }]}>
                {post.authorName}
              </Text>
              <Text
                style={[
                  typography.caption,
                  { color: colors.textTertiary, marginTop: 2 },
                ]}
              >
                {formatArticleDate(post.date)}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.borderLight,
                marginVertical: spacing.xxl,
              },
            ]}
          />

          {/* Article body (rendered HTML) */}
          <ArticleContent html={post.content} />
        </View>

        {/* Related articles */}
        <RelatedArticles
          categoryId={post.categoryIds[0]}
          excludePostId={post.id}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  heroContainer: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
  floatingBtn: {
    position: 'absolute',
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  actionsRow: {
    position: 'absolute',
    flexDirection: 'row',
    zIndex: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
  },
  readingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
