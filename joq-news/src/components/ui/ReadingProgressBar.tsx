/**
 * Thin reading progress bar that sticks to the top of the article screen.
 * Shows how far the user has scrolled through the article.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../theme';

interface ReadingProgressBarProps {
  progress: SharedValue<number>;
}

export function ReadingProgressBar({ progress }: ReadingProgressBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const barStyle = useAnimatedStyle(() => ({
    width: `${Math.min(progress.value * 100, 100)}%`,
  }));

  return (
    <View
      style={[
        styles.track,
        {
          top: insets.top,
          backgroundColor: colors.progressTrack,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.bar,
          { backgroundColor: colors.progressBar },
          barStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    zIndex: 30,
  },
  bar: {
    height: '100%',
    borderRadius: 1.5,
  },
});
