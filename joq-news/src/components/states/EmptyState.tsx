import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { useTheme } from '../../theme';

type IonIcon = ComponentProps<typeof Ionicons>['name'];

interface EmptyStateProps {
  icon?: IonIcon;
  title: string;
  message: string;
}

export function EmptyState({
  icon = 'file-tray-outline',
  title,
  message,
}: EmptyStateProps) {
  const { colors, spacing, radius, typography } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xxxl }]}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: colors.surface,
            borderRadius: radius.full,
          },
        ]}
      >
        <Ionicons name={icon} size={28} color={colors.textTertiary} />
      </View>
      <Text
        style={[
          typography.h3,
          { color: colors.text, marginTop: spacing.lg, textAlign: 'center' },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          typography.bodySm,
          {
            color: colors.textSecondary,
            marginTop: spacing.sm,
            textAlign: 'center',
            maxWidth: 260,
          },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
