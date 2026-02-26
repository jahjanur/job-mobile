/**
 * Dynamic "Latest in [Category]" section.
 * Auto-fetches posts for a given category and renders
 * a horizontal scroll of CompactCards.
 */

import React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import type { AppPost } from '../../api/types';
import { usePosts } from '../../hooks/usePosts';
import { useTheme } from '../../theme';
import { CompactCard } from '../cards/CompactCard';
import { SectionHeader } from '../ui/SectionHeader';

interface CategorySpotlightProps {
  categoryId: number;
  categoryName: string;
  maxPosts?: number;
}

export function CategorySpotlight({
  categoryId,
  categoryName,
  maxPosts = 6,
}: CategorySpotlightProps) {
  const { spacing, colors } = useTheme();
  const router = useRouter();
  const { data, isLoading } = usePosts({ categoryId });

  const posts =
    data?.pages.flatMap((p) => p.data).slice(0, maxPosts) ?? [];

  if (isLoading) {
    return (
      <View style={{ paddingVertical: spacing.xl, alignItems: 'center' }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (posts.length === 0) return null;

  return (
    <View>
      <SectionHeader
        title={`Të fundit në ${categoryName}`}
        action="Shiko të gjitha"
        onAction={() =>
          router.push(
            `/category/${categoryId}?name=${encodeURIComponent(categoryName)}`,
          )
        }
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: spacing.sm,
        }}
      >
        {posts.map((post: AppPost) => (
          <CompactCard key={post.id} post={post} />
        ))}
      </ScrollView>
    </View>
  );
}
