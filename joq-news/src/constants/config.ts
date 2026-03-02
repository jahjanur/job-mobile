/**
 * App-wide configuration constants.
 * WordPress base URL is read from environment variables so it can be
 * swapped per-environment without touching code.
 */

const WP_BASE_URL =
  process.env.EXPO_PUBLIC_WP_BASE_URL ?? 'https://admin.joq-albania.com';

export const Config = {
  /** WordPress REST API root */
  WP_API_URL: `${WP_BASE_URL}/wp-json/wp/v2`,
  /** Number of posts fetched per page */
  POSTS_PER_PAGE: Number(process.env.EXPO_PUBLIC_POSTS_PER_PAGE) || 10,
  /** Stale time for React Query caches (5 minutes) */
  QUERY_STALE_TIME: 5 * 60 * 1000,
  /** Search debounce delay (ms) */
  SEARCH_DEBOUNCE_MS: 400,
  /** App display name */
  APP_NAME: 'JOQ News',
  /** Current app version */
  APP_VERSION: '1.0.0',
} as const;
