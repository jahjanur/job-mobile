import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../theme';

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  const { colors, spacing, typography } = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          marginHorizontal: spacing.lg,
          marginTop: spacing.xxl,
          marginBottom: spacing.md,
        },
      ]}
    >
      <Text style={[typography.h3, { color: colors.text, flex: 1 }]}>
        {title}
      </Text>
      {action && onAction && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.6} hitSlop={8}>
          <Text
            style={[typography.captionMedium, { color: colors.accent }]}
          >
            {action}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
