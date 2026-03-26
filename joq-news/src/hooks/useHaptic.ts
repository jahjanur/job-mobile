/**
 * Haptic feedback hook that respects the user's preference.
 * Returns a trigger function that only fires if haptics are enabled.
 */

import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';

import { usePreferencesStore } from '../store/preferencesStore';

type HapticStyle = 'light' | 'medium' | 'heavy';

const STYLE_MAP: Record<HapticStyle, Haptics.ImpactFeedbackStyle> = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
};

export function useHaptic() {
  const enabled = usePreferencesStore((s) => s.hapticFeedback);

  const trigger = useCallback(
    (style: HapticStyle = 'light') => {
      if (enabled) {
        Haptics.impactAsync(STYLE_MAP[style]);
      }
    },
    [enabled],
  );

  return trigger;
}

/**
 * Non-hook version for use outside components (e.g. in callbacks).
 * Reads the store directly.
 */
export function triggerHaptic(style: HapticStyle = 'light') {
  const enabled = usePreferencesStore.getState().hapticFeedback;
  if (enabled) {
    Haptics.impactAsync(STYLE_MAP[style]);
  }
}
