/**
 * Breaking news banner with a pulsing red dot and horizontal scrolling text.
 * Displays the latest breaking/featured post at the top of the home screen.
 */

import React, { memo, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';

import type { AppPost } from '../../api/types';
import { useTheme } from '../../theme';

interface BreakingNewsBannerProps {
  post: AppPost;
  label?: string;
}

export const BreakingNewsBanner = memo(function BreakingNewsBanner({
  post,
  label = 'BREAKING',
}: BreakingNewsBannerProps) {
  const { colors, spacing, radius, typography } = useTheme();
  const router = useRouter();
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    pulseOpacity.value = withRepeat(
      withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push(`/article/${post.id}`)}
      style={[
        styles.container,
        {
          backgroundColor: colors.breakingLight,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.md,
          borderRadius: radius.lg,
          padding: spacing.md,
          paddingHorizontal: spacing.lg,
          borderWidth: 1,
          borderColor: colors.breaking + '20',
        },
      ]}
    >
      <View style={styles.labelRow}>
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: colors.breaking },
            dotStyle,
          ]}
        />
        <Text
          style={[
            typography.label,
            {
              color: colors.breaking,
              letterSpacing: 1,
              marginLeft: spacing.xs,
            },
          ]}
        >
          {label}
        </Text>
      </View>
      <Text
        style={[
          typography.captionMedium,
          {
            color: colors.text,
            marginTop: spacing.xs,
            lineHeight: 18,
          },
        ]}
        numberOfLines={2}
      >
        {post.title}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
});
