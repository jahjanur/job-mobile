/**
 * Horizontally auto-scrolling trending headline ticker.
 * Shows up to 5 trending titles separated by bullet dots.
 */

import React, { memo, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { AppPost } from '../../api/types';
import { useTheme } from '../../theme';

interface TrendingTickerProps {
  posts: AppPost[];
}

export const TrendingTicker = memo(function TrendingTicker({
  posts,
}: TrendingTickerProps) {
  const { colors, spacing, typography } = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const offset = useRef(0);
  const maxOffset = useRef(0);

  useEffect(() => {
    if (posts.length === 0) return;

    const timer = setInterval(() => {
      offset.current += 1;
      if (offset.current >= maxOffset.current) {
        offset.current = 0;
      }
      scrollRef.current?.scrollTo({ x: offset.current, animated: false });
    }, 30);

    return () => clearInterval(timer);
  }, [posts.length]);

  if (posts.length === 0) return null;

  const tickerText = posts
    .slice(0, 5)
    .map((p) => p.title)
    .join('  •  ');

  return (
    <View
      style={[
        styles.container,
        {
          paddingVertical: spacing.sm + 2,
          paddingHorizontal: spacing.lg,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.borderLight,
        },
      ]}
    >
      <View
        style={[
          styles.badge,
          {
            backgroundColor: colors.accent,
            borderRadius: 4,
            paddingHorizontal: spacing.xs + 2,
            paddingVertical: 2,
            marginRight: spacing.md,
          },
        ]}
      >
        <Ionicons name="trending-up" size={11} color="#FFF" />
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onContentSizeChange={(w) => {
          maxOffset.current = Math.max(0, w - 250);
        }}
      >
        <Text
          style={[
            typography.caption,
            { color: colors.textSecondary, lineHeight: 16 },
          ]}
          numberOfLines={1}
        >
          {tickerText}  •  {tickerText}
        </Text>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  badge: {
    flexShrink: 0,
  },
});
