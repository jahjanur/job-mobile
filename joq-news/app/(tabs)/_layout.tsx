/**
 * Tab navigation layout with premium vector icons.
 * Clean Feather icons, subtle blur tab bar on iOS.
 */

import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useTheme } from '../../src/theme';

export default function TabsLayout() {
  const { colors, typography, spacing, dark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: dark
            ? 'rgba(10,10,10,0.92)'
            : 'rgba(255,255,255,0.92)',
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingBottom: Platform.OS === 'ios' ? 0 : spacing.sm,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: typography.tabLabel.fontSize,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ballina',
          tabBarIcon: ({ focused, color }) => (
            <Feather
              name="home"
              size={focused ? 22 : 20}
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
            <Feather
              name="grid"
              size={focused ? 22 : 20}
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
            <Feather
              name="search"
              size={focused ? 22 : 20}
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
            <Feather
              name="bookmark"
              size={focused ? 22 : 20}
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
            <Feather
              name="sliders"
              size={focused ? 22 : 20}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
