/**
 * Image utility helpers.
 * Returns expo-image compatible sources for remote WordPress images.
 */

import type { ImageSource } from 'expo-image';

/** Fallback placeholder when no image URL is available */
const PLACEHOLDER_IMAGE = require('../../assets/news-image.png');

/**
 * Returns an expo-image compatible source.
 * - Remote URL -> { uri: string }
 * - No URL -> local placeholder image
 */
export function getImageSource(url: string | null): ImageSource {
  if (url) return { uri: url };
  return PLACEHOLDER_IMAGE as ImageSource;
}
