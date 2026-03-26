/**
 * Tab bar — floating capsule with glow effect on active tab.
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
  const scale = useSharedValue(0.85);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(focused ? 1 : 0.85, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    });
    glowOpacity.value = withTiming(focused ? 1 : 0, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [focused]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value * 0.25,
    transform: [{ scale: 1 + glowOpacity.value * 0.3 }],
  }));

  return (
    <View style={styles.iconWrap}>
      {/* Glow circle behind active icon */}
      <Animated.View
        style={[
          styles.glow,
          { backgroundColor: tint },
          glowStyle,
        ]}
      />
      <Animated.View style={iconStyle}>
        <Ionicons
          name={focused ? filled : outline}
          size={24}
          color={focused ? tint : muted}
        />
      </Animated.View>
    </View>
  );
}

export default function TabsLayout() {
  const { colors, dark, spacing } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 28 : 14,
          left: 20,
          right: 20,
          height: 62,
          backgroundColor: dark ? '#1A1A1C' : '#FFFFFF',
          borderRadius: 22,
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: dark ? '#E31E24' : '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: dark ? 0.15 : 0.1,
          shadowRadius: 20,
          paddingHorizontal: 6,
          borderWidth: 1,
          borderColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="home" outline="home-outline" focused={focused} tint={colors.accent} muted={dark ? '#555' : '#B0B0B0'} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="grid" outline="grid-outline" focused={focused} tint={colors.accent} muted={dark ? '#555' : '#B0B0B0'} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="search" outline="search-outline" focused={focused} tint={colors.accent} muted={dark ? '#555' : '#B0B0B0'} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="bookmark" outline="bookmark-outline" focused={focused} tint={colors.accent} muted={dark ? '#555' : '#B0B0B0'} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="menu" outline="menu-outline" focused={focused} tint={colors.accent} muted={dark ? '#555' : '#B0B0B0'} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
