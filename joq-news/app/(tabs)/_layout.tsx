/**
 * Tab bar — filled icons with proper pill background spacing.
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
  icon: Ion;
  label: string;
}[] = [
  { name: 'index', icon: 'home', label: 'Ballina' },
  { name: 'categories', icon: 'grid', label: 'Tema' },
  { name: 'search', icon: 'search', label: 'Kerko' },
  { name: 'bookmarks', icon: 'bookmark', label: 'Ruajtur' },
  { name: 'settings', icon: 'person', label: 'Profili' },
];

function TabItem({
  icon,
  label,
  focused,
  accentColor,
  inactiveColor,
  dark,
}: {
  icon: Ion;
  label: string;
  focused: boolean;
  accentColor: string;
  inactiveColor: string;
  dark: boolean;
}) {
  const pillScale = useSharedValue(0);

  useEffect(() => {
    pillScale.value = withSpring(focused ? 1 : 0, { damping: 16, stiffness: 180 });
  }, [focused]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: pillScale.value,
    transform: [
      { scaleX: 0.5 + pillScale.value * 0.5 },
      { scaleY: 0.8 + pillScale.value * 0.2 },
    ],
  }));

  const color = focused ? accentColor : inactiveColor;

  return (
    <View style={styles.tabItem}>
      {/* Pill background — only behind icon */}
      <View style={styles.iconRow}>
        <Animated.View
          style={[
            styles.pill,
            {
              backgroundColor: dark
                ? accentColor + '25'
                : accentColor + '15',
            },
            pillStyle,
          ]}
        />
        <Ionicons name={icon} size={20} color={color} />
      </View>

      {/* Label */}
      <Text
        style={[
          styles.label,
          {
            color,
            fontFamily: focused ? hurme4.bold : hurme4.regular,
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

  const inactive = dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)';
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
          height: 60 + bottomSafe,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: borderColor,
          elevation: 0,
          shadowOpacity: 0,
          paddingBottom: bottomSafe,
        },
        tabBarItemStyle: {
          height: 60,
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
                icon={tab.icon}
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
    height: 60,
    gap: 4,
  },
  iconRow: {
    width: 56,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    position: 'absolute',
    width: 56,
    height: 28,
    borderRadius: 14,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.1,
  },
});
