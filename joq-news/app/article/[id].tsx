/**
 * Article detail screen — premium reading experience.
 * Full-bleed hero image, floating header bar with back/bookmark/share,
 * Hurme4 typography, and related articles.
 */

import React, { useCallback, useState } from 'react';
import {
  Linking,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { useSharedValue } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AdBanner } from '../../src/components/ads/AdBanner';
import { ArticleContent } from '../../src/components/article/ArticleContent';
import { RelatedArticles } from '../../src/components/article/RelatedArticles';
import { ArticleDetailSkeleton } from '../../src/components/loaders/SkeletonBox';
import { ErrorState } from '../../src/components/states/ErrorState';
import { ReadingProgressBar } from '../../src/components/ui/ReadingProgressBar';
import { triggerHaptic } from '../../src/hooks/useHaptic';
import { usePost } from '../../src/hooks/usePost';
import { useBookmarksStore } from '../../src/store/bookmarksStore';
import { useTheme } from '../../src/theme';
import { formatArticleDate } from '../../src/utils/date';
import { getImageSource } from '../../src/utils/image';
import { estimateReadingTime, formatReadingTime } from '../../src/utils/reading';
import { getArticleWebUrl, shareArticle } from '../../src/utils/share';

function FloatingButton({
  onPress,
  icon,
  color,
  bgColor,
}: {
  onPress: () => void;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  bgColor: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.actionBtn, { backgroundColor: bgColor }]}
      hitSlop={8}
    >
      <Ionicons name={icon} size={19} color={color} />
    </Pressable>
  );
}

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const postId = Number(id);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, spacing, radius, typography, dark } = useTheme();

  const { data: post, isLoading, isError, refetch } = usePost(postId);

  const isBookmarked = useBookmarksStore((s) => s.isBookmarked(postId));
  const toggleBookmark = useBookmarksStore((s) => s.toggleBookmark);

  const glassBg = dark ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.9)';
  const readingProgress = useSharedValue(0);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
      const totalScrollable = contentSize.height - layoutMeasurement.height;
      if (totalScrollable > 0) {
        readingProgress.value = contentOffset.y / totalScrollable;
      }
    },
    [],
  );

  const handleBookmark = useCallback(() => {
    if (post) {
      triggerHaptic('success');
      toggleBookmark(post);
    }
  }, [post, toggleBookmark]);

  const handleShare = useCallback(() => {
    if (post) {
      triggerHaptic('medium');
      shareArticle(post);
    }
  }, [post]);

  const handleOpenInBrowser = useCallback(() => {
    if (post) {
      Linking.openURL(getArticleWebUrl(post));
    }
  }, [post]);

  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleTextToSpeech = useCallback(() => {
    if (!post) return;
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }
    const plainText = post.content
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/\s+/g, ' ')
      .trim();
    setIsSpeaking(true);
    Speech.speak(plainText, {
      language: 'sq',
      rate: 0.9,
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  }, [post, isSpeaking]);

  /* ── Floating top bar ─────────────────────────── */
  const TopBar = (
    <View
      style={[
        styles.topBar,
        { top: insets.top + spacing.sm, paddingHorizontal: spacing.lg },
      ]}
    >
      {/* Left: back */}
      <FloatingButton
        onPress={() => router.back()}
        icon="arrow-back"
        color={colors.text}
        bgColor={glassBg}
      />

      {/* Right: actions */}
      <View style={styles.topBarRight}>
        <FloatingButton
          onPress={handleBookmark}
          icon={isBookmarked ? 'bookmark' : 'bookmark-outline'}
          color={isBookmarked ? '#FFFFFF' : colors.text}
          bgColor={isBookmarked ? colors.accent : glassBg}
        />
        <FloatingButton
          onPress={handleShare}
          icon="share-outline"
          color={colors.text}
          bgColor={glassBg}
        />
      </View>
    </View>
  );

  /* ── Loading ──────────────────────────────────── */
  if (isLoading) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={{ height: insets.top }} />
        {TopBar}
        <ScrollView>
          <View style={{ height: 50 }} />
          <ArticleDetailSkeleton />
        </ScrollView>
      </View>
    );
  }

  /* ── Error ────────────────────────────────────── */
  if (isError || !post) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={{ height: insets.top }} />
        {TopBar}
        <ErrorState
          message="Artikulli nuk mund te ngarkohej."
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  const readingTime = estimateReadingTime(post.content);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Status bar background */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor: dark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
          zIndex: 25,
        }}
      />
      <ReadingProgressBar progress={readingProgress} />
      {TopBar}

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: spacing.massive + insets.bottom }}
      >
        {/* ── Hero image ───────────────────────────── */}
        <View style={styles.heroContainer}>
          <Image
            source={getImageSource(post.featuredImageLarge ?? post.featuredImage)}
            style={[styles.heroImage, { height: 340 + insets.top }]}
            contentFit="cover"
            transition={400}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.5)']}
            style={styles.heroGradient}
          />
        </View>

        {/* ── Article header ───────────────────────── */}
        <View style={{ padding: spacing.lg }}>
          {/* Category + reading time */}
          <View style={styles.badgeRow}>
            {post.categoryNames[0] && (
              <Pressable
                onPress={() =>
                  post.categoryIds[0] &&
                  router.push(
                    `/category/${post.categoryIds[0]}?name=${encodeURIComponent(post.categoryNames[0])}`,
                  )
                }
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
              </Pressable>
            )}
            <View style={styles.metaItem}>
              <Ionicons
                name="time-outline"
                size={13}
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
                marginTop: spacing.md,
                marginBottom: spacing.lg,
                lineHeight: 34,
              },
            ]}
          >
            {post.title}
          </Text>

          {/* Author + date */}
          <View style={styles.authorRow}>
            {post.authorAvatar ? (
              <Image
                source={{ uri: post.authorAvatar }}
                style={[styles.avatar, { borderRadius: radius.full, marginRight: spacing.md }]}
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
                <Ionicons name="person-outline" size={18} color={colors.textTertiary} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text style={[typography.captionMedium, { color: colors.text }]}>
                {post.authorName}
              </Text>
              <Text
                style={[typography.caption, { color: colors.textTertiary, marginTop: 2 }]}
              >
                {formatArticleDate(post.date)}
              </Text>
            </View>
          </View>

          {/* ── Action bar ────────────────────────── */}
          <View
            style={[
              styles.inlineActions,
              {
                marginTop: spacing.xl,
                paddingVertical: spacing.md,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderColor: colors.borderLight,
              },
            ]}
          >
            <Pressable
              onPress={handleBookmark}
              style={styles.inlineActionBtn}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={isBookmarked ? colors.accent : colors.textSecondary}
              />
              <Text
                style={[
                  typography.caption,
                  {
                    color: isBookmarked ? colors.accent : colors.textSecondary,
                    marginLeft: spacing.xs,
                  },
                ]}
              >
                {isBookmarked ? 'Ruajtur' : 'Ruaj'}
              </Text>
            </Pressable>

            <Pressable onPress={handleShare} style={styles.inlineActionBtn}>
              <Ionicons name="share-social-outline" size={20} color={colors.textSecondary} />
              <Text
                style={[
                  typography.caption,
                  { color: colors.textSecondary, marginLeft: spacing.xs },
                ]}
              >
                Ndaj
              </Text>
            </Pressable>

            <Pressable onPress={handleOpenInBrowser} style={styles.inlineActionBtn}>
                <Ionicons name="open-outline" size={20} color={colors.textSecondary} />
                <Text
                  style={[
                    typography.caption,
                    { color: colors.textSecondary, marginLeft: spacing.xs },
                  ]}
                >
                  Hap në web
                </Text>
              </Pressable>

            <Pressable onPress={handleTextToSpeech} style={styles.inlineActionBtn}>
              <Ionicons
                name={isSpeaking ? 'stop-circle-outline' : 'volume-high-outline'}
                size={20}
                color={isSpeaking ? colors.accent : colors.textSecondary}
              />
              <Text
                style={[
                  typography.caption,
                  {
                    color: isSpeaking ? colors.accent : colors.textSecondary,
                    marginLeft: spacing.xs,
                  },
                ]}
              >
                {isSpeaking ? 'Ndalo' : 'Dëgjo'}
              </Text>
            </Pressable>
          </View>

          {/* ── Article body ──────────────────────── */}
          <View style={{ marginTop: spacing.xl }}>
            <ArticleContent html={post.content} />
          </View>
        </View>

        {/* Ad banner */}
        <AdBanner />

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
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 20,
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 42,
    height: 42,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorRow: {
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
  inlineActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  inlineActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
