/**
 * Pulsing "LIVE" badge used on cards and headers.
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../../theme';

interface LiveBadgeProps {
  size?: 'small' | 'medium';
}

export function LiveBadge({ size = 'small' }: LiveBadgeProps) {
  const { colors, spacing, typography } = useTheme();
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(0.3, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.live,
          borderRadius: isSmall ? 4 : 6,
          paddingHorizontal: isSmall ? spacing.xs + 2 : spacing.sm,
          paddingVertical: isSmall ? 2 : spacing.xxs,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.dot,
          {
            width: isSmall ? 5 : 7,
            height: isSmall ? 5 : 7,
            borderRadius: isSmall ? 2.5 : 3.5,
            backgroundColor: '#FFF',
            marginRight: isSmall ? 3 : spacing.xxs,
          },
          dotStyle,
        ]}
      />
      <Text
        style={[
          isSmall ? typography.tabLabel : typography.label,
          { color: '#FFF', letterSpacing: 0.8 },
        ]}
      >
        LIVE
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  dot: {},
});
