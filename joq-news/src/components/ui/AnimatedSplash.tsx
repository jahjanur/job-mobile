/**
 * JS-level animated splash screen overlay.
 * Shows the JOQ logo on a dark background with a fade-out animation.
 * Works in both Expo Go and native builds.
 */

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const LOGO_PATHS = [
  'M258,16.1c21,9.5,30.9,33.7,23.8,55.6c-0.8,2.5-1.7,5-2.8,7.5c-3.9,9.2-1.4,15.4,8.2,17.2c4,0.8,6.5,2.8,5.8,6.8c-0.7,4.1-3.9,5.1-7.8,4.8c-15.4-1.2-24.6-17.9-17.4-32.1c3.9-7.7,6.2-15.4,4.7-24c-3.4-18.7-20.8-30.9-39.3-27.6c-18.4,3.3-30.5,20.8-27.3,39.6c3.1,17.9,20.7,30,39.3,27c2.1-0.3,4.8-0.8,6.5,0.2c1.6,0.9,3.5,4.2,2.9,5.3c-1.2,2.3-3.7,5.1-6,5.6c-15.5,3.2-29.4-0.7-41-11.6c-15-14.1-18.4-36.8-8.4-54.7c10.2-18.3,31.3-27.3,51.5-21.9C253.3,14.2,255.7,15,258,16.1z',
  'M142.1,12c25.2,0.1,45.6,20.6,45.5,45.7c-0.1,25-21,45.5-46,45.2c-25.2-0.3-45.4-20.8-45.2-46C96.6,32.2,117.2,11.9,142.1,12z M141.7,91.1c19,0.1,34.2-14.8,34.2-33.6c0-18.5-15-33.6-33.6-33.8c-18.8-0.2-34.1,14.9-34.1,33.7C108.1,76,123,91,141.7,91.1z',
  'M78.9,23.7c-4.3,0-8.1,0-11.8,0c-4,0-6.9-1.6-7-5.8c-0.1-4.1,2.8-5.9,6.8-6c5.7-0.1,11.4-0.1,17.1,0c4.3,0.1,6.7,2.4,6.6,6.8c0,14,0.4,28.1-0.2,42C89.6,79.2,76.1,95.5,58.3,101c-17.6,5.4-37.3-0.7-48.7-15c-2.6-3.3-4.5-6.6-0.5-9.9c3.9-3.2,6.8-0.8,9.6,2.5c10,11.6,24.4,15.6,38,10.6c13.6-5,22.1-17.3,22.2-32.5C79,45.9,78.9,35.1,78.9,23.7z',
];

interface AnimatedSplashProps {
  onFinish: () => void;
}

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const opacity = useSharedValue(1);
  const logoScale = useSharedValue(0.9);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo fade-in + scale up
    logoOpacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
    logoScale.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });

    // Fade out the entire splash after a brief pause
    opacity.value = withDelay(
      700,
      withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) }, () => {
        runOnJS(onFinish)();
      }),
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={logoStyle}>
        <Svg width={160} height={64} viewBox="0 0 300 120">
          {LOGO_PATHS.map((d, i) => (
            <Path key={i} d={d} fill="#FFFFFF" />
          ))}
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
});
