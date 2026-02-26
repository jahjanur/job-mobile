/**
 * Horizontal scrollable category bar for quick navigation.
 * "Të gjitha" is always first, followed by all categories.
 */

import React, { memo } from 'react';
import { ScrollView, View } from 'react-native';

import type { AppCategory } from '../../api/types';
import { useTheme } from '../../theme';
import { CategoryChip } from './CategoryChip';

interface CategoryBarProps {
  categories: AppCategory[];
  selectedId: number | null;
  onSelect: (categoryId: number | null) => void;
}

export const CategoryBar = memo(function CategoryBar({
  categories,
  selectedId,
  onSelect,
}: CategoryBarProps) {
  const { spacing } = useTheme();

  return (
    <View style={{ marginBottom: spacing.md }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm,
          gap: spacing.sm,
        }}
      >
        <CategoryChip
          label="Të gjitha"
          isActive={selectedId === null}
          onPress={() => onSelect(null)}
        />
        {categories.map((cat) => (
          <CategoryChip
            key={cat.id}
            label={cat.name}
            isActive={selectedId === cat.id}
            onPress={() => onSelect(cat.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
});
