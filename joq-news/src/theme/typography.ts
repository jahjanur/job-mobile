/**
 * Typography scale.
 * Uses system fonts for optimal rendering speed.
 * The fontSizeMultiplier is driven by user preference
 * (small=0.9, medium=1, large=1.15) and applied at the theme level.
 */

import { Platform } from 'react-native';

export type FontSize = 'small' | 'medium' | 'large';

export const fontSizeMultipliers: Record<FontSize, number> = {
  small: 0.9,
  medium: 1.0,
  large: 1.15,
};

const sansSerif = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

export const fonts = {
  sans: sansSerif!,
  serif: serifFont!,
} as const;

/** Base sizes before multiplier is applied */
export const typographyBase = {
  heroTitle: { fontSize: 28, lineHeight: 34, fontWeight: '800' as const },
  h1: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const },
  h2: { fontSize: 20, lineHeight: 26, fontWeight: '700' as const },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  bodyMedium: { fontSize: 16, lineHeight: 24, fontWeight: '500' as const },
  bodySm: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  captionMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
  label: { fontSize: 11, lineHeight: 14, fontWeight: '600' as const },
  tabLabel: { fontSize: 10, lineHeight: 12, fontWeight: '500' as const },
} as const;

/**
 * Returns a scaled typography set given a multiplier.
 */
export function getScaledTypography(multiplier: number) {
  const scale = (
    base: (typeof typographyBase)[keyof typeof typographyBase],
  ) => ({
    ...base,
    fontSize: Math.round(base.fontSize * multiplier),
    lineHeight: Math.round(base.lineHeight * multiplier),
  });

  return {
    heroTitle: scale(typographyBase.heroTitle),
    h1: scale(typographyBase.h1),
    h2: scale(typographyBase.h2),
    h3: scale(typographyBase.h3),
    body: scale(typographyBase.body),
    bodyMedium: scale(typographyBase.bodyMedium),
    bodySm: scale(typographyBase.bodySm),
    caption: scale(typographyBase.caption),
    captionMedium: scale(typographyBase.captionMedium),
    label: scale(typographyBase.label),
    tabLabel: scale(typographyBase.tabLabel),
  };
}
