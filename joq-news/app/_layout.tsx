/**
 * Root layout — sets up providers that wrap the entire app:
 * - React Query for data fetching
 * - Theme provider for consistent styling
 * - Gesture handler for animations
 * - Safe area context for notches/islands
 * - Animated splash screen with JOQ logo
 */

import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AnimatedSplash } from '../src/components/ui/AnimatedSplash';
import { ThemeProvider, useThemeBuilder } from '../src/theme';
import { Config } from '../src/constants/config';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Config.QUERY_STALE_TIME,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const theme = useThemeBuilder();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Hide the native splash once our JS splash is visible
    SplashScreen.hideAsync();
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <ThemeProvider value={theme}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <View style={styles.root}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="article/[id]"
            options={{
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="category/[id]"
            options={{
              animation: 'slide_from_right',
            }}
          />
        </Stack>
        {showSplash && <AnimatedSplash onFinish={handleSplashFinish} />}
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.root}>
          <AppContent />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
