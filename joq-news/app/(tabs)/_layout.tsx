/**
 * Tab bar — clean minimal design with animated active indicator.
 * No labels, just icons. Active tab gets a bold line underneath.
 */

import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Tabs } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
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
  const lineWidth = useSharedValue(0);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    lineWidth.value = withTiming(focused ? 20 : 0, {
      duration: 250,
      easing: Easing.out(Easing.cubic),
    });
    iconScale.value = withTiming(focused ? 1 : 0.92, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
  }, [focused]);

  const lineStyle = useAnimatedStyle(() => ({
    width: lineWidth.value,
    opacity: lineWidth.value > 0 ? 1 : 0,
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <View style={styles.iconContainer}>
      <Animated.View style={scaleStyle}>
        <Ionicons
          name={focused ? filled : outline}
          size={23}
          color={focused ? tint : muted}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.activeLine,
          { backgroundColor: tint },
          lineStyle,
        ]}
      />
    </View>
  );
}

export default function TabsLayout() {
  const { colors, dark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? 84 : 60,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          backgroundColor: dark ? '#0C0C0E' : '#FFFFFF',
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="home" outline="home-outline" focused={focused} tint={colors.accent} muted={colors.textTertiary} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="grid" outline="grid-outline" focused={focused} tint={colors.accent} muted={colors.textTertiary} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="search" outline="search-outline" focused={focused} tint={colors.accent} muted={colors.textTertiary} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="bookmark" outline="bookmark-outline" focused={focused} tint={colors.accent} muted={colors.textTertiary} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="menu" outline="menu-outline" focused={focused} tint={colors.accent} muted={colors.textTertiary} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  activeLine: {
    height: 2.5,
    borderRadius: 1.25,
    marginTop: 6,
  },
});
