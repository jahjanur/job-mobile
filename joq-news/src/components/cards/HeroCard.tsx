/**
 * Premium hero card for the featured top story.
 * Full-bleed image with cinematic gradient, animated category badge,
 * reading time indicator, and elegant Hurme4 typography.
 */

import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import type { AppPost } from '../../api/types';
import { useTheme } from '../../theme';
import { formatPostDateWithTime } from '../../utils/date';
import { getImageSource } from '../../utils/image';
import { estimateReadingTime, formatReadingTime } from '../../utils/reading';
import { PressableScale } from '../ui/PressableScale';

interface HeroCardProps {
  post: AppPost;
}

export const HeroCard = memo(function HeroCard({ post }: HeroCardProps) {
  const { spacing, radius, typography, colors } = useTheme();
  const router = useRouter();
  const readTime = estimateReadingTime(post.content);

  return (
    <PressableScale
      onPress={() => router.push(`/article/${post.id}`)}
      style={[
        styles.container,
        {
          marginHorizontal: spacing.lg,
          marginBottom: spacing.xl,
          borderRadius: radius.xl,
        },
      ]}
    >
      <Image
        source={getImageSource(post.featuredImageLarge ?? post.featuredImage)}
        style={[styles.image, { borderRadius: radius.xl }]}
        contentFit="cover"
        transition={400}
        recyclingKey={`hero-${post.id}`}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.92)']}
        locations={[0, 0.35, 1]}
        style={[styles.gradient, { borderRadius: radius.xl }]}
      />

      {/* Top badges row */}
      <View style={[styles.topRow, { padding: spacing.lg }]}>
        {post.categoryNames[0] && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.accent,
                borderRadius: radius.sm,
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xxs + 1,
              },
            ]}
          >
            <Text
              style={[
                typography.label,
                { color: '#FFFFFF', letterSpacing: 0.8, fontSize: 9 },
              ]}
            >
              {post.categoryNames[0].toUpperCase()}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.badge,
            {
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: radius.full,
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xxs + 1,
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}
        >
          <Ionicons name="time-outline" size={10} color="rgba(255,255,255,0.8)" />
          <Text
            style={[
              typography.label,
              {
                color: 'rgba(255,255,255,0.8)',
                marginLeft: spacing.xxs + 1,
                fontSize: 9,
              },
            ]}
          >
            {formatReadingTime(readTime)}
          </Text>
        </View>
      </View>

      {/* Bottom content */}
      <View style={[styles.content, { padding: spacing.xl }]}>
        <Text
          style={[
            typography.heroTitle,
            {
              color: '#FFFFFF',
              letterSpacing: -0.3,
              textShadowColor: 'rgba(0,0,0,0.3)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 3,
            },
          ]}
          numberOfLines={3}
        >
          {post.title}
        </Text>
        <View style={[styles.metaRow, { marginTop: spacing.md }]}>
          <View style={styles.authorRow}>
            <View
              style={[
                styles.authorDot,
                { backgroundColor: colors.accent, marginRight: spacing.sm },
              ]}
            />
            <Text
              style={[
                typography.caption,
                { color: 'rgba(255,255,255,0.85)' },
              ]}
            >
              {post.authorName}
            </Text>
          </View>
          <Text
            style={[
              typography.caption,
              { color: 'rgba(255,255,255,0.5)' },
            ]}
          >
            {formatPostDateWithTime(post.date)}
          </Text>
        </View>
      </View>
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 400,
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  topRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  badge: {
    alignSelf: 'flex-start',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
