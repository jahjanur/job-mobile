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
      // Kreu = Home/main page
      { id: 3, slug: 'home', name: 'Kreu', icon: 'home-outline' },
      // Veç e jona = "Only ours" — JOQ exclusive stories
      { id: 6, slug: 'vec-e-jona', name: 'Veç e jona', icon: 'flame-outline' },
      // Shqipëri = Albania news
      { id: 82, slug: 'lajme', name: 'Shqipëri', icon: 'flag-outline', flag: '\u{1F1E6}\u{1F1F1}' },
      // Dora Sekrete = "Secret Hand" — investigative journalism
      { id: 62245, slug: 'kck', name: 'Dora Sekrete', icon: 'hand-left-outline' },
      // Si sot = "Like today" — on this day in history
      { id: 85, slug: 'si-te', name: 'Si sot', icon: 'calendar-outline' },
      // KAPE = Coffee talk show (external link)
      {
        id: null,
        slug: 'kape',
        name: 'KAPE',
        icon: 'cafe-outline',
        externalUrl: 'https://kape.net',
      },
      // Live = Live streaming
      { id: null, slug: 'live', name: 'Live', icon: 'videocam-outline' },
    ],
  },
  {
    title: 'Rajoni & Bota',
    entries: [
      // Kosovo news
      { id: 37958, slug: 'kosova', name: 'Kosovë', icon: 'location-outline', flag: '\u{1F1FD}\u{1F1F0}' },
      // North Macedonia news
      { id: 47302, slug: 'maqedoni', name: 'Maqedoni', icon: 'navigate-outline', flag: '\u{1F1F2}\u{1F1F0}' },
      // Përtej = "Beyond" — international/world news
      { id: 37, slug: 'bota', name: 'Përtej', icon: 'earth-outline' },
    ],
  },
  {
    title: 'Lifestyle & Interes',
    entries: [
      // Kuriozitete = Curiosities / fun facts
      { id: 65, slug: 'kuriozitete', name: 'Kuriozitete', icon: 'bulb-outline' },
      // Thashetheme = Gossip / celebrity talk
      { id: 39, slug: 'thashetheme', name: 'Thashetheme', icon: 'chatbubbles-outline' },
      // Udhëtime = Travel
      { id: 33, slug: 'udhetime', name: 'Udhëtime', icon: 'airplane-outline' },
      // Shëndeti = Health & wellness
      { id: 66, slug: 'shendeti', name: 'Shëndeti', icon: 'heart-outline' },
      // Libra = Books & reading
      { id: null, slug: 'libra', name: 'Libra', icon: 'book-outline' },
      // Animals
      { id: null, slug: 'animals', name: 'Animals', icon: 'paw-outline' },
      // Sport
      { id: 45, slug: 'sport', name: 'Sport', icon: 'trophy-outline' },
      // Teknologji = Technology
      { id: 32, slug: 'teknologji', name: 'Teknologji', icon: 'laptop-outline' },
    ],
  },
  {
    title: 'Të tjera',
    entries: [
      // Persekutimi ndaj JOQ = Persecution/pressure against JOQ
      { id: 89194, slug: 'persekutimi-ndaj-joq', name: 'Persekutimi ndaj JOQ', icon: 'megaphone-outline' },
      // Rreth nesh = About us
      { id: null, slug: 'rreth-nesh', name: 'Rreth nesh', icon: 'people-outline' },
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
