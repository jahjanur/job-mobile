/**
 * Premium post card used in feed lists.
 * Clean layout with rounded thumbnail, category accent, reading metadata.
 */

import React, { memo, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import type { AppPost } from '../../api/types';
import { useTheme } from '../../theme';
import { formatPostDateWithTime } from '../../utils/date';
import { getImageSource } from '../../utils/image';
import { estimateReadingTime } from '../../utils/reading';
import { PressableScale } from '../ui/PressableScale';

interface PostCardProps {
  post: AppPost;
}

export const PostCard = memo(function PostCard({ post }: PostCardProps) {
  const { colors, spacing, radius, typography, dark } = useTheme();
  const router = useRouter();
  const readTime = useMemo(() => estimateReadingTime(post.content), [post.id]);

  return (
    <PressableScale
      onPress={() => router.push(`/article/${post.id}`)}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.md,
          padding: spacing.lg,
          borderWidth: dark ? 0 : StyleSheet.hairlineWidth,
          borderColor: colors.borderLight,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.textContent, { marginRight: spacing.lg }]}>
          {post.categoryNames[0] && (
            <View style={styles.categoryRow}>
              <View
                style={[
                  styles.categoryDot,
                  { backgroundColor: colors.accent, marginRight: spacing.xs },
                ]}
              />
              <Text
                style={[
                  typography.label,
                  {
                    color: colors.accent,
                    letterSpacing: 0.5,
                    fontSize: 10,
                  },
                ]}
                numberOfLines={1}
              >
                {post.categoryNames[0].toUpperCase()}
              </Text>
            </View>
          )}
          <Text
            style={[
              typography.h3,
              {
                color: colors.text,
                letterSpacing: -0.2,
                lineHeight: 22,
                marginTop: spacing.xs,
              },
            ]}
            numberOfLines={3}
          >
            {post.title}
          </Text>
          <View style={[styles.metaRow, { marginTop: spacing.md }]}>
            <Text style={[typography.caption, { color: colors.textTertiary }]}>
              {post.authorName}
            </Text>
            <View style={[styles.dot, { backgroundColor: colors.textTertiary }]} />
            <Text style={[typography.caption, { color: colors.textTertiary }]}>
              {formatPostDateWithTime(post.date)}
            </Text>
            <View style={[styles.dot, { backgroundColor: colors.textTertiary }]} />
            <Ionicons name="time-outline" size={10} color={colors.textTertiary} />
            <Text
              style={[
                typography.caption,
                { color: colors.textTertiary, marginLeft: 3 },
              ]}
            >
              {readTime} min
            </Text>
          </View>
        </View>
        <Image
          source={getImageSource(post.featuredImage)}
          style={[styles.thumbnail, { borderRadius: radius.md }]}
          contentFit="cover"
          transition={200}
          recyclingKey={`card-${post.id}`}
        />
      </View>
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  thumbnail: {
    width: 96,
    height: 96,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 6,
  },
});
