/**
 * Image utility helpers.
 * Returns expo-image compatible sources for remote WordPress images.
 * Includes prefetching for feed performance.
 */

import { Image, type ImageSource } from 'expo-image';

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

/**
 * Prefetch a batch of image URLs into the disk cache.
 * Call this when new feed pages are loaded so images
 * are ready before they scroll into view.
 */
export function prefetchImages(urls: (string | null)[]): void {
  const validUrls = urls.filter((u): u is string => !!u);
  if (validUrls.length > 0) {
    Image.prefetch(validUrls);
  }
}
