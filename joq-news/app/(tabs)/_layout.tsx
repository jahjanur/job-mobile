/**
 * Tab bar — filled icons + label inside a single pill background.
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

const TABS: { name: string; icon: Ion; label: string }[] = [
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
  const pillOpacity = useSharedValue(0);

  useEffect(() => {
    pillOpacity.value = withSpring(focused ? 1 : 0, { damping: 16, stiffness: 180 });
  }, [focused]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: pillOpacity.value,
  }));

  const color = focused ? accentColor : inactiveColor;

  return (
    <View style={styles.tabItem}>
      {/* Pill wraps both icon and label */}
      <Animated.View
        style={[
          styles.pill,
          {
            backgroundColor: dark
              ? accentColor + '20'
              : accentColor + '12',
          },
          pillStyle,
        ]}
      />
      <Ionicons name={icon} size={18} color={color} />
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
  const bottomSafe = Platform.OS === 'ios' ? insets.bottom : 6;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: bg,
          height: 54 + bottomSafe,
          paddingBottom: bottomSafe,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: borderColor,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          height: 54,
          justifyContent: 'center',
          alignItems: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
    width: 62,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  label: {
    fontSize: 9,
    marginTop: 2,
    letterSpacing: 0.2,
  },
});
