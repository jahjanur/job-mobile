/**
 * Color tokens for light and dark themes.
 * Dark mode uses a true-dark palette with carefully tuned contrast
 * to match a premium editorial aesthetic.
 */

export const palette = {
  black: '#0A0A0A',
  white: '#FFFFFF',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#E5E5E5',
  gray300: '#D4D4D4',
  gray400: '#A3A3A3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',
  red500: '#EF4444',
  red600: '#DC2626',
  blue500: '#3B82F6',
  blue600: '#2563EB',
  amber500: '#F59E0B',
} as const;

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  border: string;
  borderLight: string;
  accent: string;
  accentLight: string;
  error: string;
  skeleton: string;
  skeletonHighlight: string;
  card: string;
  cardPressed: string;
  tabBar: string;
  tabBarBorder: string;
  headerBackground: string;
  overlay: string;
  breaking: string;
  icon: string;
  iconSecondary: string;
  searchBackground: string;
}

export const lightColors: ThemeColors = {
  background: palette.white,
  surface: palette.gray50,
  surfaceElevated: palette.white,
  text: palette.gray900,
  textSecondary: palette.gray600,
  textTertiary: palette.gray400,
  textInverse: palette.white,
  border: palette.gray200,
  borderLight: palette.gray100,
  accent: palette.blue600,
  accentLight: '#EFF6FF',
  error: palette.red600,
  skeleton: palette.gray200,
  skeletonHighlight: palette.gray100,
  card: palette.white,
  cardPressed: palette.gray50,
  tabBar: palette.white,
  tabBarBorder: palette.gray200,
  headerBackground: palette.white,
  overlay: 'rgba(0,0,0,0.4)',
  breaking: palette.red600,
  icon: palette.gray700,
  iconSecondary: palette.gray400,
  searchBackground: palette.gray100,
};

export const darkColors: ThemeColors = {
  background: palette.black,
  surface: '#111111',
  surfaceElevated: '#1A1A1A',
  text: palette.gray100,
  textSecondary: palette.gray400,
  textTertiary: palette.gray600,
  textInverse: palette.black,
  border: '#1F1F1F',
  borderLight: '#161616',
  accent: palette.blue500,
  accentLight: '#172554',
  error: palette.red500,
  skeleton: '#1F1F1F',
  skeletonHighlight: '#2A2A2A',
  card: '#111111',
  cardPressed: '#1A1A1A',
  tabBar: '#0F0F0F',
  tabBarBorder: '#1F1F1F',
  headerBackground: '#0F0F0F',
  overlay: 'rgba(0,0,0,0.7)',
  breaking: palette.red500,
  icon: palette.gray300,
  iconSecondary: palette.gray600,
  searchBackground: '#1A1A1A',
};
