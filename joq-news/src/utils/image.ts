/**
 * Image utility helpers.
 * In mock mode, returns the local bundled image.
 * When WordPress is connected, remote URLs will be used directly.
 */

import type { ImageSource } from 'expo-image';

import { MOCK_NEWS_IMAGE } from '../api/mockData';

/**
 * Returns an expo-image compatible source.
 * - Remote URL → { uri: string }
 * - No URL (mock mode) → local require() number
 */
export function getImageSource(url: string | null): ImageSource {
  if (url) return { uri: url };
  return MOCK_NEWS_IMAGE as ImageSource;
}
