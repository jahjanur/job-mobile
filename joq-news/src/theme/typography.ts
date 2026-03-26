/**
 * Typography scale.
 * Uses Hurme4 font family matching the JOQ Albania website branding.
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

/**
 * Hurme4 font family map.
 * React Native on Android requires separate fontFamily names per weight,
 * while iOS can use the PostScript name with fontWeight.
 */
export const hurme4 = {
  thin: 'Hurme4-Thin',
  light: 'Hurme4-Light',
  regular: 'Hurme4-Regular',
  semiBold: 'Hurme4-SemiBold',
  bold: 'Hurme4-Bold',
  black: 'Hurme4-Black',
} as const;

/** Map a fontWeight string to the correct Hurme4 variant */
function hurmeFamily(weight: string) {
  switch (weight) {
    case '100':
      return hurme4.thin;
    case '300':
      return hurme4.light;
    case '400':
      return hurme4.regular;
    case '500':
      return hurme4.semiBold;
    case '600':
      return hurme4.semiBold;
    case '700':
      return hurme4.bold;
    case '800':
    case '900':
      return hurme4.black;
    default:
      return hurme4.regular;
  }
}

const serifFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});

export const fonts = {
  sans: hurme4.regular,
  serif: serifFont!,
  hurme4,
} as const;

/** Base sizes before multiplier is applied */
export const typographyBase = {
  heroTitle: { fontSize: 28, lineHeight: 34, fontWeight: '800' as const, fontFamily: hurmeFamily('800') },
  h1: { fontSize: 24, lineHeight: 30, fontWeight: '700' as const, fontFamily: hurmeFamily('700') },
  h2: { fontSize: 20, lineHeight: 26, fontWeight: '700' as const, fontFamily: hurmeFamily('700') },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const, fontFamily: hurmeFamily('600') },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const, fontFamily: hurmeFamily('400') },
  bodyMedium: { fontSize: 16, lineHeight: 24, fontWeight: '500' as const, fontFamily: hurmeFamily('500') },
  bodySm: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const, fontFamily: hurmeFamily('400') },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const, fontFamily: hurmeFamily('400') },
  captionMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const, fontFamily: hurmeFamily('500') },
  label: { fontSize: 11, lineHeight: 14, fontWeight: '600' as const, fontFamily: hurmeFamily('600') },
  tabLabel: { fontSize: 10, lineHeight: 12, fontWeight: '500' as const, fontFamily: hurmeFamily('500') },
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
