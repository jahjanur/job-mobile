/**
 * Premium hero card for the featured top story.
 * Full-bleed image with cinematic gradient overlay,
 * reading time badge, and elegant typography.
 */

import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
  const { spacing, radius, typography } = useTheme();
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
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.88)']}
        locations={[0, 0.4, 1]}
        style={[styles.gradient, { borderRadius: radius.xl }]}
      />

      {/* Top badges row */}
      <View style={[styles.topRow, { padding: spacing.lg }]}>
        {post.categoryNames[0] && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: 'rgba(255,255,255,0.18)',
                borderRadius: radius.full,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
              },
            ]}
          >
            <Text
              style={[
                typography.label,
                { color: '#FFFFFF', letterSpacing: 0.8 },
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
              backgroundColor: 'rgba(255,255,255,0.18)',
              borderRadius: radius.full,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}
        >
          <Feather name="clock" size={10} color="rgba(255,255,255,0.8)" />
          <Text
            style={[
              typography.label,
              {
                color: 'rgba(255,255,255,0.8)',
                marginLeft: spacing.xxs + 1,
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
            { color: '#FFFFFF', letterSpacing: -0.3 },
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
                { backgroundColor: '#FFFFFF', marginRight: spacing.sm },
              ]}
            />
            <Text
              style={[
                typography.caption,
                { color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
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
    height: 380,
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
