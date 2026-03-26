/**
 * Tab bar — clean bottom navigation with active pill highlight.
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

const TABS: {
  name: string;
  filled: Ion;
  outline: Ion;
  label: string;
}[] = [
  { name: 'index', filled: 'home', outline: 'home-outline', label: 'Ballina' },
  { name: 'categories', filled: 'grid', outline: 'grid-outline', label: 'Tema' },
  { name: 'search', filled: 'search', outline: 'search-outline', label: 'Kerko' },
  { name: 'bookmarks', filled: 'bookmark', outline: 'bookmark-outline', label: 'Ruajtur' },
  { name: 'settings', filled: 'person', outline: 'person-outline', label: 'Profili' },
];

function TabItem({
  filled,
  outline,
  label,
  focused,
  accentColor,
  inactiveColor,
  dark,
}: {
  filled: Ion;
  outline: Ion;
  label: string;
  focused: boolean;
  accentColor: string;
  inactiveColor: string;
  dark: boolean;
}) {
  const pillOpacity = useSharedValue(0);
  const iconY = useSharedValue(0);

  useEffect(() => {
    pillOpacity.value = withSpring(focused ? 1 : 0, { damping: 15, stiffness: 200 });
    iconY.value = withSpring(focused ? -1 : 0, { damping: 15, stiffness: 200 });
  }, [focused]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: pillOpacity.value,
    transform: [{ scaleX: 0.6 + pillOpacity.value * 0.4 }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: iconY.value }],
  }));

  const color = focused ? accentColor : inactiveColor;
  const pillBg = dark ? accentColor + '20' : accentColor + '12';

  return (
    <View style={styles.tabItem}>
      {/* Background pill */}
      <Animated.View
        style={[styles.pill, { backgroundColor: pillBg }, pillStyle]}
      />

      {/* Icon + label */}
      <Animated.View style={[styles.content, iconStyle]}>
        <Ionicons
          name={focused ? filled : outline}
          size={20}
          color={color}
        />
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
      </Animated.View>
    </View>
  );
}

export default function TabsLayout() {
  const { colors, dark } = useTheme();
  const insets = useSafeAreaInsets();

  const inactive = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)';
  const bg = dark ? '#101012' : '#FFFFFF';
  const borderColor = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const bottomSafe = Platform.OS === 'ios' ? Math.max(insets.bottom - 6, 0) : 4;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: bg,
          height: 56 + bottomSafe,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: borderColor,
          elevation: 0,
          shadowOpacity: 0,
          paddingBottom: bottomSafe,
        },
        tabBarItemStyle: {
          height: 56,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabItem
                filled={tab.filled}
                outline={tab.outline}
                label={tab.label}
                focused={focused}
                accentColor={colors.accent}
                inactiveColor={inactive}
                dark={dark}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
  },
  pill: {
    position: 'absolute',
    width: 52,
    height: 32,
    borderRadius: 16,
  },
  content: {
    alignItems: 'center',
  },
  label: {
    fontSize: 9.5,
    marginTop: 2,
    letterSpacing: 0.2,
  },
});
