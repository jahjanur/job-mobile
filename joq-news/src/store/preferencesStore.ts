/**
 * User preferences store with AsyncStorage persistence.
 * Manages theme, font size, notifications, accessibility, etc.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ThemeMode } from '../theme';
import type { FontSize } from '../theme/typography';

/** Notification category keys */
export type NotificationCategory =
  | 'breakingNews'
  | 'politike'
  | 'sport'
  | 'argetim'
  | 'importantOnly';

interface PreferencesState {
  // Appearance
  themeMode: ThemeMode;
  fontSize: FontSize;
  reduceMotion: boolean;
  hapticFeedback: boolean;

  // Notifications
  notificationsEnabled: boolean;
  notificationCategories: Record<NotificationCategory, boolean>;
  pushToken: string | null;

  // Search
  recentSearches: string[];

  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  setFontSize: (size: FontSize) => void;
  setReduceMotion: (enabled: boolean) => void;
  setHapticFeedback: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  toggleNotificationCategory: (category: NotificationCategory) => void;
  setPushToken: (token: string | null) => void;
  addRecentSearch: (query: string) => void;
  removeRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

const MAX_RECENT_SEARCHES = 10;

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      themeMode: 'system',
      fontSize: 'medium',
      reduceMotion: false,
      hapticFeedback: true,
      notificationsEnabled: false,
      notificationCategories: {
        breakingNews: true,
        politike: false,
        sport: false,
        argetim: false,
        importantOnly: false,
      },
      pushToken: null,
      recentSearches: [],

      setThemeMode: (mode) => set({ themeMode: mode }),
      setFontSize: (size) => set({ fontSize: size }),
      setReduceMotion: (enabled) => set({ reduceMotion: enabled }),
      setHapticFeedback: (enabled) => set({ hapticFeedback: enabled }),

      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),

      setPushToken: (token) => set({ pushToken: token }),

      toggleNotificationCategory: (category) =>
        set((state) => ({
          notificationCategories: {
            ...state.notificationCategories,
            [category]: !state.notificationCategories[category],
          },
        })),

      addRecentSearch: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        const existing = get().recentSearches.filter((s) => s !== trimmed);
        set({
          recentSearches: [trimmed, ...existing].slice(0, MAX_RECENT_SEARCHES),
        });
      },

      removeRecentSearch: (query) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((s) => s !== query),
        })),

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'joq-preferences',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
