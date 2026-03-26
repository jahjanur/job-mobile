/**
 * Card for the bookmarks screen.
 * Premium design with reading time and refined styling.
 */

import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { triggerHaptic } from '../../hooks/useHaptic';
import { useRouter } from 'expo-router';

import { type BookmarkEntry, useBookmarksStore } from '../../store/bookmarksStore';
import { useTheme } from '../../theme';
import { formatPostDateWithTime } from '../../utils/date';
import { getImageSource } from '../../utils/image';
import { PressableScale } from '../ui/PressableScale';

interface BookmarkCardProps {
  bookmark: BookmarkEntry;
}

export const BookmarkCard = memo(function BookmarkCard({
  bookmark,
}: BookmarkCardProps) {
  const { colors, spacing, radius, typography, dark } = useTheme();
  const router = useRouter();
  const removeBookmark = useBookmarksStore((s) => s.removeBookmark);

  const handleRemove = () => {
    triggerHaptic('light');
    removeBookmark(bookmark.id);
  };

  return (
    <PressableScale
      onPress={() => router.push(`/article/${bookmark.id}`)}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.md,
          padding: spacing.md,
          borderWidth: dark ? 0 : StyleSheet.hairlineWidth,
          borderColor: colors.borderLight,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.textContent, { marginRight: spacing.md }]}>
          {bookmark.categoryNames[0] && (
            <Text
              style={[
                typography.label,
                {
                  color: colors.accent,
                  marginBottom: spacing.xs,
                  letterSpacing: 0.5,
                },
              ]}
              numberOfLines={1}
            >
              {bookmark.categoryNames[0].toUpperCase()}
            </Text>
          )}
          <Text
            style={[
              typography.h3,
              { color: colors.text, fontSize: 15, lineHeight: 20 },
            ]}
            numberOfLines={3}
          >
            {bookmark.title}
          </Text>
          <View style={[styles.metaRow, { marginTop: spacing.sm }]}>
            <Ionicons
              name="time-outline"
              size={13}
              color={colors.textTertiary}
              style={{ marginRight: 4 }}
            />
            <Text style={[typography.caption, { color: colors.textTertiary }]}>
              {formatPostDateWithTime(bookmark.bookmarkedAt)}
            </Text>
          </View>
        </View>
        <View>
          <Image
            source={getImageSource(bookmark.featuredImage)}
            style={[styles.thumbnail, { borderRadius: radius.md }]}
            contentFit="cover"
            transition={200}
            recyclingKey={`bookmark-${bookmark.id}`}
          />
          <Pressable
            onPress={handleRemove}
            hitSlop={8}
            style={[
              styles.removeBtn,
              {
                backgroundColor: colors.surface,
                borderRadius: radius.full,
              },
            ]}
          >
            <Ionicons name="close" size={13} color={colors.textTertiary} />
          </Pressable>
        </View>
      </View>
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textContent: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 96,
    height: 96,
  },
  removeBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
