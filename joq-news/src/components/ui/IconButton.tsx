import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { triggerHaptic } from '../../hooks/useHaptic';
import { useTheme } from '../../theme';

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  size?: number;
  color?: string;
  haptic?: boolean;
}

export function IconButton({
  icon,
  onPress,
  size = 22,
  color,
  haptic = true,
}: IconButtonProps) {
  const { colors, spacing } = useTheme();

  const handlePress = () => {
    if (haptic) {
      triggerHaptic('light');
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.button,
        { padding: spacing.sm },
      ]}
      hitSlop={8}
    >
      <Text style={{ fontSize: size, color: color ?? colors.icon }}>
        {icon}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
