import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../theme';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Diçka shkoi keq. Ju lutem provoni përsëri.',
  onRetry,
}: ErrorStateProps) {
  const { colors, spacing, typography, radius } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xxxl }]}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: '#FEF2F2',
            borderRadius: radius.full,
          },
        ]}
      >
        <Ionicons name="warning-outline" size={28} color="#EF4444" />
      </View>
      <Text
        style={[
          typography.bodyMedium,
          {
            color: colors.text,
            marginTop: spacing.lg,
            textAlign: 'center',
            maxWidth: 280,
          },
        ]}
      >
        {message}
      </Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={[
            styles.button,
            {
              backgroundColor: colors.accent,
              borderRadius: radius.md,
              marginTop: spacing.xl,
              paddingVertical: spacing.md,
              paddingHorizontal: spacing.xxl,
            },
          ]}
        >
          <Ionicons
            name="refresh-outline"
            size={15}
            color="#FFFFFF"
            style={{ marginRight: 6 }}
          />
          <Text style={[typography.bodyMedium, { color: '#FFFFFF' }]}>
            Provo përsëri
          </Text>
        </Pressable>
      )}
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
