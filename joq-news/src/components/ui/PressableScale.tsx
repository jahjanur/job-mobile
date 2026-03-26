/**
 * Pressable wrapper that applies a subtle scale animation on press.
 * Respects the "reduce motion" user preference — skips animation if enabled.
 */

import React, { type ReactNode, useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { usePreferencesStore } from '../../store/preferencesStore';

interface PressableScaleProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  scaleTo?: number;
}

const SPRING_CONFIG = { damping: 15, stiffness: 200 };

export function PressableScale({
  onPress,
  style,
  children,
  scaleTo = 0.97,
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const noAnimation = useSharedValue(false);
  const reduceMotion = usePreferencesStore((s) => s.reduceMotion);

  // Sync JS state to shared value so worklets can read it
  useEffect(() => {
    noAnimation.value = reduceMotion;
  }, [reduceMotion]);

  const gesture = Gesture.Tap()
    .onBegin(() => {
      'worklet';
      if (!noAnimation.value) {
        scale.value = withSpring(scaleTo, SPRING_CONFIG);
      }
    })
    .onFinalize((_, success) => {
      'worklet';
      if (!noAnimation.value) {
        scale.value = withSpring(1, SPRING_CONFIG);
      }
      if (success) {
        runOnJS(onPress)();
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
}
