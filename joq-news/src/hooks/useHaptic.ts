/**
 * Haptic feedback that respects the user's preference.
 * Uses stronger vibration patterns for more noticeable feedback.
 */

import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';

import { usePreferencesStore } from '../store/preferencesStore';

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export function useHaptic() {
  const enabled = usePreferencesStore((s) => s.hapticFeedback);

  const trigger = useCallback(
    (style: HapticStyle = 'medium') => {
      if (enabled) {
        fireHaptic(style);
      }
    },
    [enabled],
  );

  return trigger;
}

/**
 * Non-hook version for use outside components.
 * Reads the store directly.
 */
export function triggerHaptic(style: HapticStyle = 'medium') {
  const enabled = usePreferencesStore.getState().hapticFeedback;
  if (enabled) {
    fireHaptic(style);
  }
}

function fireHaptic(style: HapticStyle) {
  switch (style) {
    case 'light':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case 'medium':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      break;
    case 'heavy':
      // Double tap for extra strong feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 100);
      break;
    case 'success':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    case 'warning':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      break;
    case 'error':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      break;
  }
}
