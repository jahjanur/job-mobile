import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
        <Text
          onPress={onAction}
          style={[typography.captionMedium, { color: colors.accent }]}
        >
          {action}
        </Text>
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
