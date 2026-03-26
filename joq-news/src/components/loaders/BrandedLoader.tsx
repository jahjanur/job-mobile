/**
 * Branded JOQ loading animation.
 * Clean vertical layout: logo on top with a glow pulse,
 * animated progress bar below, and staggered bouncing dots.
 */

import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from '../../theme';

const LOGO_PATHS = [
  'M258,16.1c21,9.5,30.9,33.7,23.8,55.6c-0.8,2.5-1.7,5-2.8,7.5c-3.9,9.2-1.4,15.4,8.2,17.2c4,0.8,6.5,2.8,5.8,6.8c-0.7,4.1-3.9,5.1-7.8,4.8c-15.4-1.2-24.6-17.9-17.4-32.1c3.9-7.7,6.2-15.4,4.7-24c-3.4-18.7-20.8-30.9-39.3-27.6c-18.4,3.3-30.5,20.8-27.3,39.6c3.1,17.9,20.7,30,39.3,27c2.1-0.3,4.8-0.8,6.5,0.2c1.6,0.9,3.5,4.2,2.9,5.3c-1.2,2.3-3.7,5.1-6,5.6c-15.5,3.2-29.4-0.7-41-11.6c-15-14.1-18.4-36.8-8.4-54.7c10.2-18.3,31.3-27.3,51.5-21.9C253.3,14.2,255.7,15,258,16.1z',
  'M142.1,12c25.2,0.1,45.6,20.6,45.5,45.7c-0.1,25-21,45.5-46,45.2c-25.2-0.3-45.4-20.8-45.2-46C96.6,32.2,117.2,11.9,142.1,12z M141.7,91.1c19,0.1,34.2-14.8,34.2-33.6c0-18.5-15-33.6-33.6-33.8c-18.8-0.2-34.1,14.9-34.1,33.7C108.1,76,123,91,141.7,91.1z',
  'M78.9,23.7c-4.3,0-8.1,0-11.8,0c-4,0-6.9-1.6-7-5.8c-0.1-4.1,2.8-5.9,6.8-6c5.7-0.1,11.4-0.1,17.1,0c4.3,0.1,6.7,2.4,6.6,6.8c0,14,0.4,28.1-0.2,42C89.6,79.2,76.1,95.5,58.3,101c-17.6,5.4-37.3-0.7-48.7-15c-2.6-3.3-4.5-6.6-0.5-9.9c3.9-3.2,6.8-0.8,9.6,2.5c10,11.6,24.4,15.6,38,10.6c13.6-5,22.1-17.3,22.2-32.5C79,45.9,78.9,35.1,78.9,23.7z',
];

const BAR_WIDTH = 120;

interface BrandedLoaderProps {
  message?: string;
}

function BounceDot({ delay, color }: { delay: number; color: string }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 300, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 300, easing: Easing.in(Easing.quad) }),
        ),
        -1,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 7,
          height: 7,
          borderRadius: 3.5,
          backgroundColor: color,
          marginHorizontal: 4,
        },
        style,
      ]}
    />
  );
}

export function BrandedLoader({ message }: BrandedLoaderProps) {
  const { colors, spacing, typography } = useTheme();

  // Logo breathe
  const breathe = useSharedValue(0);
  // Progress bar sweep
  const sweep = useSharedValue(0);

  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );

    sweep.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.cubic) }),
        withTiming(0, { duration: 0 }),
      ),
      -1,
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => {
    const scale = interpolate(breathe.value, [0, 1], [1, 1.06]);
    const opacity = interpolate(breathe.value, [0, 1], [0.7, 1]);
    return { transform: [{ scale }], opacity };
  });

  const barStyle = useAnimatedStyle(() => {
    const width = interpolate(sweep.value, [0, 0.5, 1], [0, BAR_WIDTH, 0]);
    const left = interpolate(sweep.value, [0, 0.5, 1], [0, 0, BAR_WIDTH]);
    return { width, marginLeft: left };
  });

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Animated.View style={logoStyle}>
        <Svg width={100} height={40} viewBox="0 0 300 120">
          {LOGO_PATHS.map((d, i) => (
            <Path key={i} d={d} fill={colors.text} />
          ))}
        </Svg>
      </Animated.View>

      {/* Progress bar */}
      <View
        style={[
          styles.barTrack,
          {
            width: BAR_WIDTH,
            backgroundColor: colors.border,
            marginTop: spacing.xl,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.barFill,
            { backgroundColor: colors.accent },
            barStyle,
          ]}
        />
      </View>

      {/* Bouncing dots */}
      <View style={[styles.dotsRow, { marginTop: spacing.xl }]}>
        <BounceDot delay={0} color={colors.accent} />
        <BounceDot delay={150} color={colors.accent} />
        <BounceDot delay={300} color={colors.accent} />
      </View>

      {/* Message */}
      {message && (
        <Text
          style={[
            typography.caption,
            { color: colors.textTertiary, marginTop: spacing.lg },
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  barTrack: {
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
});
