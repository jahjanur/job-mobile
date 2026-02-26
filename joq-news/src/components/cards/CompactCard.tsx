/**
 * Compact horizontal card for trending / breaking sections.
 * Wider aspect ratio with frosted badge overlay.
 */

import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import type { AppPost } from '../../api/types';
import { useTheme } from '../../theme';
import { formatPostDateWithTime } from '../../utils/date';
import { getImageSource } from '../../utils/image';
import { PressableScale } from '../ui/PressableScale';

interface CompactCardProps {
  post: AppPost;
  index?: number;
}

export const CompactCard = memo(function CompactCard({
  post,
  index,
}: CompactCardProps) {
  const { spacing, radius, typography } = useTheme();
  const router = useRouter();

  return (
    <PressableScale
      onPress={() => router.push(`/article/${post.id}`)}
      style={[
        styles.container,
        {
          borderRadius: radius.lg,
          marginRight: spacing.md,
        },
      ]}
    >
      <Image
        source={getImageSource(post.featuredImage)}
        style={[styles.image, { borderRadius: radius.lg }]}
        contentFit="cover"
        transition={250}
        recyclingKey={`compact-${post.id}`}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.75)']}
        style={[styles.gradient, { borderRadius: radius.lg }]}
      />

      {/* Index number badge */}
      {index !== undefined && (
        <View
          style={[
            styles.indexBadge,
            {
              top: spacing.md,
              left: spacing.md,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: radius.full,
              width: 26,
              height: 26,
            },
          ]}
        >
          <Text
            style={[
              typography.label,
              { color: '#FFFFFF', fontSize: 11 },
            ]}
          >
            {index + 1}
          </Text>
        </View>
      )}

      <View style={[styles.content, { padding: spacing.md }]}>
        <Text
          style={[
            typography.captionMedium,
            { color: '#FFFFFF', lineHeight: 16 },
          ]}
          numberOfLines={2}
        >
          {post.title}
        </Text>
        <Text
          style={[
            typography.caption,
            { color: 'rgba(255,255,255,0.55)', marginTop: spacing.xxs, fontSize: 10 },
          ]}
          numberOfLines={1}
        >
          {formatPostDateWithTime(post.date)}
        </Text>
      </View>
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 150,
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  indexBadge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
