/**
 * Pressable wrapper that applies a subtle scale animation on press.
 * Provides the premium "press-in" micro-interaction used across all cards.
 */

import React, { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

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

  const gesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(scaleTo, SPRING_CONFIG);
    })
    .onFinalize((_, success) => {
      scale.value = withSpring(1, SPRING_CONFIG);
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
