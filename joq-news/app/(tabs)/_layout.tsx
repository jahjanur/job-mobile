/**
 * Tab bar — solid edge-to-edge, icons and labels pinned to the top
 * of the bar with safe area padding only at the very bottom.
 */

import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Tabs } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { hurme4 } from '../../src/theme/typography';
import { useTheme } from '../../src/theme';

type Ion = ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  filled,
  outline,
  label,
  focused,
  accent,
  inactive,
}: {
  filled: Ion;
  outline: Ion;
  label: string;
  focused: boolean;
  accent: string;
  inactive: string;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1, { damping: 12, stiffness: 250 });
  }, [focused]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const color = focused ? accent : inactive;

  return (
    <View style={styles.tab}>
      {/* Active indicator line */}
      <View
        style={[
          styles.indicator,
          { backgroundColor: focused ? accent : 'transparent' },
        ]}
      />

      {/* Icon */}
      <Animated.View style={[styles.iconBox, animStyle]}>
        <Ionicons
          name={focused ? filled : outline}
          size={21}
          color={color}
        />
      </Animated.View>

      {/* Label */}
      <Text
        style={[
          styles.label,
          {
            color,
            fontFamily: focused ? hurme4.semiBold : hurme4.regular,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { colors, dark } = useTheme();
  const insets = useSafeAreaInsets();

  const inactive = dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)';
  const bg = dark ? '#0C0C0E' : '#FAFAFA';
  const border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const bottomPad = Platform.OS === 'ios' ? insets.bottom : 6;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: bg,
          // Icon area (50px) + bottom safe area
          height: 50 + bottomPad,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: border,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          // Pin content to top, let safe area be empty space below
          height: 50,
          paddingTop: 0,
          paddingBottom: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="home" outline="home-outline" label="Ballina" focused={focused} accent={colors.accent} inactive={inactive} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="grid" outline="grid-outline" label="Tema" focused={focused} accent={colors.accent} inactive={inactive} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="search" outline="search-outline" label="Kerko" focused={focused} accent={colors.accent} inactive={inactive} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="bookmark" outline="bookmark-outline" label="Ruajtur" focused={focused} accent={colors.accent} inactive={inactive} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon filled="ellipsis-horizontal" outline="ellipsis-horizontal" label="Me shume" focused={focused} accent={colors.accent} inactive={inactive} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tab: {
    alignItems: 'center',
    width: '100%',
    height: 50,
  },
  indicator: {
    width: 20,
    height: 2.5,
    borderRadius: 1.5,
    marginTop: 2,
  },
  iconBox: {
    marginTop: 6,
  },
  label: {
    fontSize: 10,
    marginTop: 3,
    letterSpacing: 0.1,
  },
});
