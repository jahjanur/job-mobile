/**
 * Color tokens for light and dark themes.
 * Brand palette matches JOQ Albania's signature red with
 * a refined editorial aesthetic for both modes.
 */

export const palette = {
  black: '#0A0A0A',
  white: '#FFFFFF',
  gray50: '#FAFAFA',
  gray100: '#F4F4F5',
  gray200: '#E4E4E7',
  gray300: '#D4D4D8',
  gray400: '#A1A1AA',
  gray500: '#71717A',
  gray600: '#52525B',
  gray700: '#3F3F46',
  gray800: '#27272A',
  gray900: '#18181B',

  // JOQ brand red
  red500: '#EF4444',
  red600: '#DC2626',
  brandRed: '#E31E24',
  brandRedDark: '#C41A1F',

  // Accent blues
  blue500: '#3B82F6',
  blue600: '#2563EB',

  // Highlights
  amber500: '#F59E0B',
  emerald500: '#10B981',
  violet500: '#8B5CF6',
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
  accentSecondary: string;
  accentSecondaryLight: string;
  error: string;
  success: string;
  skeleton: string;
  skeletonHighlight: string;
  card: string;
  cardPressed: string;
  tabBar: string;
  tabBarBorder: string;
  headerBackground: string;
  overlay: string;
  breaking: string;
  breakingLight: string;
  live: string;
  icon: string;
  iconSecondary: string;
  searchBackground: string;
  progressBar: string;
  progressTrack: string;
}

export const lightColors: ThemeColors = {
  background: palette.white,
  surface: '#F8F8FA',
  surfaceElevated: palette.white,
  text: palette.gray900,
  textSecondary: palette.gray600,
  textTertiary: palette.gray400,
  textInverse: palette.white,
  border: palette.gray200,
  borderLight: '#F0F0F2',
  accent: palette.brandRed,
  accentLight: '#FEF2F2',
  accentSecondary: palette.blue600,
  accentSecondaryLight: '#EFF6FF',
  error: palette.red600,
  success: palette.emerald500,
  skeleton: palette.gray200,
  skeletonHighlight: palette.gray100,
  card: palette.white,
  cardPressed: palette.gray50,
  tabBar: palette.white,
  tabBarBorder: palette.gray200,
  headerBackground: palette.white,
  overlay: 'rgba(0,0,0,0.4)',
  breaking: palette.brandRed,
  breakingLight: '#FEF2F2',
  live: palette.red500,
  icon: palette.gray700,
  iconSecondary: palette.gray400,
  searchBackground: '#F0F0F2',
  progressBar: palette.brandRed,
  progressTrack: palette.gray200,
};

export const darkColors: ThemeColors = {
  background: palette.black,
  surface: '#111113',
  surfaceElevated: '#1C1C1E',
  text: '#F0F0F2',
  textSecondary: palette.gray400,
  textTertiary: '#555558',
  textInverse: palette.black,
  border: '#1E1E20',
  borderLight: '#161618',
  accent: '#F04248',
  accentLight: '#2A1215',
  accentSecondary: palette.blue500,
  accentSecondaryLight: '#172554',
  error: palette.red500,
  success: palette.emerald500,
  skeleton: '#1E1E20',
  skeletonHighlight: '#28282A',
  card: '#141416',
  cardPressed: '#1C1C1E',
  tabBar: '#0C0C0E',
  tabBarBorder: '#1E1E20',
  headerBackground: '#0C0C0E',
  overlay: 'rgba(0,0,0,0.7)',
  breaking: '#F04248',
  breakingLight: '#2A1215',
  live: '#F04248',
  icon: palette.gray300,
  iconSecondary: '#555558',
  searchBackground: '#1C1C1E',
  progressBar: '#F04248',
  progressTrack: '#1E1E20',
};
