/**
 * Central theme provider and hook.
 * Components consume theme tokens exclusively through useTheme()
 * so every color, spacing, and typography value is consistent.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { usePreferencesStore } from '../store/preferencesStore';
import {
  type ThemeColors,
  darkColors,
  lightColors,
} from './colors';
import { radius, spacing } from './spacing';
import {
  type FontSize,
  fontSizeMultipliers,
  fonts,
  getScaledTypography,
} from './typography';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  fonts: typeof fonts;
  typography: ReturnType<typeof getScaledTypography>;
  fontSizePreference: FontSize;
}

const ThemeContext = createContext<Theme | null>(null);

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function useThemeBuilder(): Theme {
  const systemScheme = useColorScheme();
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const fontSizePreference = usePreferencesStore((s) => s.fontSize);

  const isDark = useMemo(() => {
    if (themeMode === 'system') return systemScheme === 'dark';
    return themeMode === 'dark';
  }, [themeMode, systemScheme]);

  const theme = useMemo<Theme>(() => {
    const multiplier = fontSizeMultipliers[fontSizePreference];
    return {
      dark: isDark,
      colors: isDark ? darkColors : lightColors,
      spacing,
      radius,
      fonts,
      typography: getScaledTypography(multiplier),
      fontSizePreference,
    };
  }, [isDark, fontSizePreference]);

  return theme;
}

export const ThemeProvider = ThemeContext.Provider;

export { lightColors, darkColors, spacing, radius, fonts };
export type { ThemeColors };
