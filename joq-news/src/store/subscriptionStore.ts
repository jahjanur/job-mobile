/**
 * Email subscription store with category preferences.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SubscriptionState {
  email: string | null;
  isSubscribed: boolean;
  subscribedCategories: number[];
  subscribe: (email: string, categoryIds: number[]) => void;
  unsubscribe: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      email: null,
      isSubscribed: false,
      subscribedCategories: [],
      subscribe: (email, categoryIds) =>
        set({ email, isSubscribed: true, subscribedCategories: categoryIds }),
      unsubscribe: () =>
        set({ email: null, isSubscribed: false, subscribedCategories: [] }),
    }),
    {
      name: 'joq-subscription',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
