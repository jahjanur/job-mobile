/**
 * Tab navigation layout — modern floating tab bar with Hurme4 font
 * and Ionicons for a clean, contemporary feel.
 */

import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Tabs } from 'expo-router';

import { hurme4 } from '../../src/theme/typography';
import { useTheme } from '../../src/theme';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  name,
  nameOutline,
  focused,
  color,
}: {
  name: IoniconsName;
  nameOutline: IoniconsName;
  focused: boolean;
  color: string;
}) {
  return (
    <View style={styles.iconWrap}>
      <Ionicons
        name={focused ? name : nameOutline}
        size={22}
        color={color}
      />
      {focused && (
        <View style={[styles.dot, { backgroundColor: color }]} />
      )}
    </View>
  );
}

export default function TabsLayout() {
  const { colors, typography, spacing, dark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: dark
            ? 'rgba(10,10,10,0.95)'
            : 'rgba(255,255,255,0.95)',
          borderTopWidth: 0,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: dark ? 0.3 : 0.06,
          shadowRadius: 12,
          paddingBottom: Platform.OS === 'ios' ? 0 : spacing.sm,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontFamily: hurme4.semiBold,
          fontSize: 10,
          letterSpacing: 0.3,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ballina',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name="home"
              nameOutline="home-outline"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Tema',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name="grid"
              nameOutline="grid-outline"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Kërko',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name="search"
              nameOutline="search-outline"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Ruajtur',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name="bookmark"
              nameOutline="bookmark-outline"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Cilësimet',
          tabBarIcon: ({ focused, color }) => (
            <TabIcon
              name="settings"
              nameOutline="settings-outline"
              focused={focused}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
