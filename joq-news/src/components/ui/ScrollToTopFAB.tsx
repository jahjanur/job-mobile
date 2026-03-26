/**
 * Floating action button that appears after scrolling down,
 * smoothly scrolls back to the top when pressed.
 */

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

import { useTheme } from '../../theme';

interface ScrollToTopFABProps {
  visible: boolean;
  onPress: () => void;
}

export function ScrollToTopFAB({ visible, onPress }: ScrollToTopFABProps) {
  const { colors, dark } = useTheme();

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
      style={styles.wrapper}
    >
      <Pressable
        onPress={onPress}
        style={[
          styles.fab,
          {
            backgroundColor: dark
              ? 'rgba(30,30,30,0.9)'
              : 'rgba(255,255,255,0.95)',
          },
        ]}
      >
        <Ionicons name="chevron-up" size={20} color={colors.text} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 50,
  },
  fab: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
});
