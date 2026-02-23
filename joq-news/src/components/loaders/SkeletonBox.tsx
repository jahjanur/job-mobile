/**
 * Animated skeleton placeholder.
 * Uses Reanimated to pulse the opacity for a premium loading feel.
 */

import React, { useEffect } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../../theme';

interface SkeletonBoxProps {
  width: ViewStyle['width'];
  height: ViewStyle['height'];
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonBox({
  width,
  height,
  borderRadius,
  style,
}: SkeletonBoxProps) {
  const { colors, radius } = useTheme();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 800 }),
        withTiming(1, { duration: 800 }),
      ),
      -1,
      false,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: borderRadius ?? radius.md,
          backgroundColor: colors.skeleton,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function PostCardSkeleton() {
  const { spacing, radius, colors } = useTheme();

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          padding: spacing.md,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.md,
        },
      ]}
    >
      <SkeletonBox width="100%" height={180} borderRadius={radius.md} />
      <SkeletonBox
        width={80}
        height={12}
        style={{ marginTop: spacing.md }}
      />
      <SkeletonBox
        width="90%"
        height={18}
        style={{ marginTop: spacing.sm }}
      />
      <SkeletonBox
        width="70%"
        height={18}
        style={{ marginTop: spacing.xs }}
      />
      <SkeletonBox
        width="50%"
        height={12}
        style={{ marginTop: spacing.md }}
      />
    </Animated.View>
  );
}

export function HeroSkeleton() {
  const { spacing, radius, colors } = useTheme();

  return (
    <Animated.View
      style={{
        marginHorizontal: spacing.lg,
        marginBottom: spacing.xl,
      }}
    >
      <SkeletonBox width="100%" height={240} borderRadius={radius.lg} />
      <SkeletonBox
        width={60}
        height={12}
        style={{ marginTop: spacing.md }}
      />
      <SkeletonBox
        width="95%"
        height={22}
        style={{ marginTop: spacing.sm }}
      />
      <SkeletonBox
        width="80%"
        height={22}
        style={{ marginTop: spacing.xs }}
      />
    </Animated.View>
  );
}

export function ArticleDetailSkeleton() {
  const { spacing, colors } = useTheme();

  return (
    <Animated.View style={{ padding: spacing.lg }}>
      <SkeletonBox width="100%" height={260} borderRadius={12} />
      <SkeletonBox width={80} height={14} style={{ marginTop: spacing.xl }} />
      <SkeletonBox width="100%" height={28} style={{ marginTop: spacing.md }} />
      <SkeletonBox width="85%" height={28} style={{ marginTop: spacing.xs }} />
      <SkeletonBox width={160} height={14} style={{ marginTop: spacing.lg }} />
      <SkeletonBox width="100%" height={16} style={{ marginTop: spacing.xxl }} />
      <SkeletonBox width="100%" height={16} style={{ marginTop: spacing.sm }} />
      <SkeletonBox width="100%" height={16} style={{ marginTop: spacing.sm }} />
      <SkeletonBox width="70%" height={16} style={{ marginTop: spacing.sm }} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});
