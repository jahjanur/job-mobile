/**
 * Tab navigation — floating pill tab bar with animated icons.
 * Active tab gets a colored background pill + filled icon.
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

import { hurme4 } from '../../src/theme/typography';
import { useTheme } from '../../src/theme';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  name,
  nameOutline,
  label,
  focused,
  color,
  accentColor,
}: {
  name: IoniconsName;
  nameOutline: IoniconsName;
  label: string;
  focused: boolean;
  color: string;
  accentColor: string;
}) {
  const scale = useSharedValue(1);
  const pillWidth = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1, { damping: 12, stiffness: 200 });
    pillWidth.value = withSpring(focused ? 1 : 0, { damping: 14, stiffness: 180 });
  }, [focused]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pillStyle = useAnimatedStyle(() => ({
    opacity: pillWidth.value,
    transform: [{ scaleX: pillWidth.value }],
  }));

  return (
    <View style={styles.tabItem}>
      {/* Background pill */}
      <Animated.View
        style={[
          styles.pill,
          { backgroundColor: accentColor + '18' },
          pillStyle,
        ]}
      />
      <Animated.View style={iconStyle}>
        <Ionicons
          name={focused ? name : nameOutline}
          size={21}
          color={focused ? accentColor : color}
        />
      </Animated.View>
      <Text
        style={[
          styles.label,
          {
            color: focused ? accentColor : color,
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
  const { colors, spacing, dark } = useTheme();

  const barBg = dark ? 'rgba(12,12,14,0.97)' : 'rgba(255,255,255,0.97)';

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
          backgroundColor: barBg,
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : spacing.sm,
          paddingTop: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: dark ? 0.4 : 0.08,
          shadowRadius: 16,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="home"
              nameOutline="home-outline"
              label="Ballina"
              focused={focused}
              color={colors.textTertiary}
              accentColor={colors.accent}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="grid"
              nameOutline="grid-outline"
              label="Tema"
              focused={focused}
              color={colors.textTertiary}
              accentColor={colors.accent}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="search"
              nameOutline="search-outline"
              label="Kerko"
              focused={focused}
              color={colors.textTertiary}
              accentColor={colors.accent}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="bookmark"
              nameOutline="bookmark-outline"
              label="Ruajtur"
              focused={focused}
              color={colors.textTertiary}
              accentColor={colors.accent}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="settings"
              nameOutline="settings-outline"
              label="Me shume"
              focused={focused}
              color={colors.textTertiary}
              accentColor={colors.accent}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 56,
  },
  pill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  label: {
    fontSize: 9,
    letterSpacing: 0.2,
    marginTop: 3,
  },
});
