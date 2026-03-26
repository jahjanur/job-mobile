/**
 * Curated category configuration matching JOQ Albania website structure.
 * Categories are grouped into sections for the Categories screen.
 * Each entry maps to a WordPress category by slug/ID.
 * Uses Ionicons for a modern, consistent look.
 */

import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IonIcon = ComponentProps<typeof Ionicons>['name'];

export interface CategoryEntry {
  /** WordPress category ID (null for special items like external links) */
  id: number | null;
  slug: string;
  name: string;
  icon: IonIcon;
  /** Emoji flag to render instead of an icon (e.g. country flags) */
  flag?: string;
  /** If set, tapping navigates to this URL instead of category screen */
  externalUrl?: string;
}

export interface CategoryGroup {
  title: string;
  entries: CategoryEntry[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    title: 'Kryesore',
    entries: [
      { id: 3, slug: 'home', name: 'Kreu', icon: 'home-outline' },
      { id: 6, slug: 'vec-e-jona', name: 'Veç e jona', icon: 'diamond-outline' },
      { id: 82, slug: 'lajme', name: 'Shqipëri', icon: 'flag-outline', flag: '\u{1F1E6}\u{1F1F1}' },
      { id: 62245, slug: 'kck', name: 'Dora Sekrete', icon: 'eye-outline' },
      { id: 85, slug: 'si-te', name: 'Si sot', icon: 'today-outline' },
      {
        id: null,
        slug: 'kape',
        name: 'KAPE',
        icon: 'cafe-outline',
        externalUrl: 'https://kape.net',
      },
      { id: null, slug: 'live', name: 'Live', icon: 'radio-outline' },
    ],
  },
  {
    title: 'Rajoni & Bota',
    entries: [
      { id: 37958, slug: 'kosova', name: 'Kosovë', icon: 'location-outline', flag: '\u{1F1FD}\u{1F1F0}' },
      { id: 47302, slug: 'maqedoni', name: 'Maqedoni', icon: 'navigate-outline', flag: '\u{1F1F2}\u{1F1F0}' },
      { id: 37, slug: 'bota', name: 'Përtej', icon: 'globe-outline' },
    ],
  },
  {
    title: 'Lifestyle & Interes',
    entries: [
      { id: 65, slug: 'kuriozitete', name: 'Kuriozitete', icon: 'sparkles-outline' },
      { id: 39, slug: 'thashetheme', name: 'Thashetheme', icon: 'chatbubbles-outline' },
      { id: 33, slug: 'udhetime', name: 'Udhëtime', icon: 'airplane-outline' },
      { id: 66, slug: 'shendeti', name: 'Shëndeti', icon: 'fitness-outline' },
      { id: null, slug: 'libra', name: 'Libra', icon: 'book-outline' },
      { id: null, slug: 'animals', name: 'Animals', icon: 'paw-outline' },
      { id: 45, slug: 'sport', name: 'Sport', icon: 'football-outline' },
      { id: 32, slug: 'teknologji', name: 'Teknologji', icon: 'hardware-chip-outline' },
    ],
  },
  {
    title: 'Të tjera',
    entries: [
      { id: 89194, slug: 'persekutimi-ndaj-joq', name: 'Persekutimi ndaj JOQ', icon: 'shield-outline' },
      { id: null, slug: 'rreth-nesh', name: 'Rreth nesh', icon: 'information-circle-outline' },
    ],
  },
];

/** Flat list of all category entries */
export const ALL_CATEGORIES = CATEGORY_GROUPS.flatMap((g) => g.entries);

/** Only categories with a WordPress ID (navigable to category screen) */
export const WP_CATEGORIES = ALL_CATEGORIES.filter(
  (c): c is CategoryEntry & { id: number } => c.id !== null && !c.externalUrl,
);

/** Icon lookup by slug */
export const CATEGORY_ICONS: Record<string, IonIcon> = Object.fromEntries(
  ALL_CATEGORIES.map((c) => [c.slug, c.icon]),
);

/** Get icon for a slug (with fuzzy fallback) */
export function getCategoryIcon(slug: string): IonIcon {
  if (CATEGORY_ICONS[slug]) return CATEGORY_ICONS[slug];
  const key = Object.keys(CATEGORY_ICONS).find((k) =>
    slug.toLowerCase().includes(k),
  );
  return key ? CATEGORY_ICONS[key] : 'document-text-outline';
}
