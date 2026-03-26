/**
 * Tab bar — edge-to-edge solid bar, no floating, no blur.
 * Clean, solid, properly aligned.
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
    if (focused) {
      scale.value = withSpring(1.15, { damping: 10, stiffness: 300 });
    } else {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    }
  }, [focused]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const color = focused ? accent : inactive;

  return (
    <View style={styles.tab}>
      {focused && (
        <View style={[styles.activeBar, { backgroundColor: accent }]} />
      )}
      <Animated.View style={animStyle}>
        <Ionicons
          name={focused ? filled : outline}
          size={22}
          color={color}
        />
      </Animated.View>
      <Text
        style={[
          styles.label,
          {
            color,
            fontFamily: focused ? hurme4.bold : hurme4.regular,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { colors, dark } = useTheme();
  const insets = useSafeAreaInsets();

  const inactive = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';
  const bg = dark ? '#0C0C0E' : '#FAFAFA';
  const border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: bg,
          height: 56 + (Platform.OS === 'ios' ? insets.bottom : 8),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: border,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          paddingTop: 0,
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
    justifyContent: 'center',
    flex: 1,
    paddingTop: 8,
  },
  activeBar: {
    position: 'absolute',
    top: -1,
    width: 24,
    height: 2.5,
    borderRadius: 2,
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    letterSpacing: 0.1,
  },
});
