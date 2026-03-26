/**
 * Root layout — sets up providers that wrap the entire app.
 * Font loading runs in parallel with native splash screen
 * so there's no blank screen gap.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';

import { useRouter } from 'expo-router';

import { AnimatedSplash } from '../src/components/ui/AnimatedSplash';
import {
  registerForPushNotifications,
  addNotificationListeners,
} from '../src/services/notifications';
import { usePreferencesStore } from '../src/store/preferencesStore';
import { ThemeProvider, useThemeBuilder } from '../src/theme';

// Keep the native splash visible until fonts + first data are ready
SplashScreen.preventAutoHideAsync();

// Auto-refetch when app comes back to foreground
focusManager.setEventListener((setFocused) => {
  const subscription = AppState.addEventListener('change', (status) => {
    if (Platform.OS !== 'web') {
      setFocused(status === 'active');
    }
  });
  return () => subscription.remove();
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,       // 2 min — news should feel fresh
      gcTime: 10 * 60 * 1000,          // garbage collect after 10 min
      retry: 1,                         // fail fast, user can pull-to-refresh
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',     // refetch when back online
    },
  },
});

function AppContent() {
  const theme = useThemeBuilder();
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  // Stable selectors — won't cause re-renders for unrelated store changes
  const notificationsEnabled = usePreferencesStore((s) => s.notificationsEnabled);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  // Register for push notifications when enabled
  useEffect(() => {
    if (notificationsEnabled) {
      registerForPushNotifications().then((token) => {
        if (token) {
          usePreferencesStore.getState().setPushToken(token);
        }
      });
    }
  }, [notificationsEnabled]);

  // Handle notification taps → navigate to article
  useEffect(() => {
    const cleanup = addNotificationListeners(
      () => {},
      (response) => {
        const articleId =
          response.notification.request.content.data?.articleId;
        if (articleId) {
          router.push(`/article/${articleId}`);
        }
      },
    );
    return cleanup;
  }, [router]);

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
            freezeOnBlur: true,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="article/[id]"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="category/[id]"
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="live"
            options={{ animation: 'slide_from_bottom' }}
          />
        </Stack>
        {showSplash && <AnimatedSplash onFinish={handleSplashFinish} />}
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Hurme4-Thin': require('../assets/fonts/Hurme4-Thin.otf'),
    'Hurme4-Light': require('../assets/fonts/Hurme4-Light.otf'),
    'Hurme4-Regular': require('../assets/fonts/Hurme4-Regular.otf'),
    'Hurme4-SemiBold': require('../assets/fonts/Hurme4-SemiBold.otf'),
    'Hurme4-Bold': require('../assets/fonts/Hurme4-Bold.otf'),
    'Hurme4-Black': require('../assets/fonts/Hurme4-Black.otf'),
  });

  if (!fontsLoaded) return null;

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
