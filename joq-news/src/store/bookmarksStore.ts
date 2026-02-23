/**
 * Bookmark store with AsyncStorage persistence.
 * Stores minimal post data so bookmarks work offline
 * without fetching the full article again.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AppPost } from '../api/types';

export interface BookmarkEntry {
  id: number;
  title: string;
  excerpt: string;
  featuredImage: string | null;
  categoryNames: string[];
  date: string;
  authorName: string;
  bookmarkedAt: string;
}

interface BookmarksState {
  bookmarks: BookmarkEntry[];
  isBookmarked: (id: number) => boolean;
  toggleBookmark: (post: AppPost) => void;
  removeBookmark: (id: number) => void;
  clearAll: () => void;
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      isBookmarked: (id: number) =>
        get().bookmarks.some((b) => b.id === id),

      toggleBookmark: (post: AppPost) => {
        const exists = get().bookmarks.some((b) => b.id === post.id);
        if (exists) {
          set((state) => ({
            bookmarks: state.bookmarks.filter((b) => b.id !== post.id),
          }));
        } else {
          const entry: BookmarkEntry = {
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            featuredImage: post.featuredImage,
            categoryNames: post.categoryNames,
            date: post.date,
            authorName: post.authorName,
            bookmarkedAt: new Date().toISOString(),
          };
          set((state) => ({
            bookmarks: [entry, ...state.bookmarks],
          }));
        }
      },

      removeBookmark: (id: number) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),

      clearAll: () => set({ bookmarks: [] }),
    }),
    {
      name: 'joq-bookmarks',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
