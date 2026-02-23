/**
 * Related articles section shown at the bottom of the article detail.
 * Fetches posts from the same primary category.
 */

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { usePosts } from '../../hooks/usePosts';
import { useTheme } from '../../theme';
import { CompactCard } from '../cards/CompactCard';
import { SectionHeader } from '../ui/SectionHeader';

interface RelatedArticlesProps {
  categoryId?: number;
  excludePostId: number;
}

export function RelatedArticles({
  categoryId,
  excludePostId,
}: RelatedArticlesProps) {
  const { spacing } = useTheme();
  const { data } = usePosts({
    categoryId,
    enabled: !!categoryId,
  });

  const posts =
    data?.pages
      .flatMap((p) => p.data)
      .filter((p) => p.id !== excludePostId)
      .slice(0, 6) ?? [];

  if (posts.length === 0) return null;

  return (
    <View style={{ marginTop: spacing.xxl }}>
      <SectionHeader title="Lexo më tepër" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.md,
        }}
      >
        {posts.map((post) => (
          <CompactCard key={post.id} post={post} />
        ))}
      </ScrollView>
    </View>
  );
}
