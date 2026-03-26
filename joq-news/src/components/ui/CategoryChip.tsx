import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useTheme } from '../../theme';

interface CategoryChipProps {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

export function CategoryChip({
  label,
  isActive = false,
  onPress,
}: CategoryChipProps) {
  const { colors, spacing, radius, typography } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.chip,
        {
          backgroundColor: isActive ? colors.accent : colors.surfaceElevated,
          borderRadius: radius.full,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          borderWidth: 1,
          borderColor: isActive ? colors.accent : colors.border,
        },
      ]}
    >
      <Text
        style={[
          typography.captionMedium,
          {
            color: isActive ? '#FFFFFF' : colors.textSecondary,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
  },
});
