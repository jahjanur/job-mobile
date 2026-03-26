/**
 * Tab bar — glassmorphism floating bar with blur effect.
 */

import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../../src/theme';

type Ion = ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  filled,
  outline,
  focused,
  tint,
  muted,
}: {
  filled: Ion;
  outline: Ion;
  focused: boolean;
  tint: string;
  muted: string;
}) {
  const translateY = useSharedValue(0);
  const dotScale = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(focused ? -2 : 0, { damping: 14, stiffness: 200 });
    dotScale.value = withTiming(focused ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [focused]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
    opacity: dotScale.value,
  }));

  return (
    <View style={styles.iconWrap}>
      <Animated.View style={iconStyle}>
        <Ionicons
          name={focused ? filled : outline}
          size={22}
          color={focused ? tint : muted}
        />
      </Animated.View>
      <Animated.View
        style={[styles.dot, { backgroundColor: tint }, dotStyle]}
      />
    </View>
  );
}

export default function TabsLayout() {
  const { colors, dark } = useTheme();

  const muted = dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarBackground: () => (
          <View style={styles.barBg}>
            <BlurView
              intensity={dark ? 40 : 80}
              tint={dark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: dark
                    ? 'rgba(18,18,20,0.75)'
                    : 'rgba(255,255,255,0.7)',
                },
              ]}
            />
          </View>
        ),
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 24 : 12,
          left: 16,
          right: 16,
          height: 58,
          borderRadius: 20,
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          shadowColor: dark ? '#E31E24' : '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: dark ? 0.2 : 0.08,
          shadowRadius: 24,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: dark
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(0,0,0,0.06)',
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="home" outline="home-outline" focused={focused} tint={colors.accent} muted={muted} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="grid" outline="grid-outline" focused={focused} tint={colors.accent} muted={muted} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="search" outline="search-outline" focused={focused} tint={colors.accent} muted={muted} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="bookmark" outline="bookmark-outline" focused={focused} tint={colors.accent} muted={muted} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="ellipsis-horizontal" outline="ellipsis-horizontal" focused={focused} tint={colors.accent} muted={muted} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  barBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    overflow: 'hidden',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 4,
  },
});
