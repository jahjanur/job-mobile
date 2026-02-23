/**
 * Centralized icon component using Feather icons.
 * Clean, minimal stroke-based icons that match a premium editorial style.
 */

import React from 'react';
import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { useTheme } from '../../theme';

export type IconName = ComponentProps<typeof Feather>['name'];

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 22, color }: IconProps) {
  const { colors } = useTheme();
  return <Feather name={name} size={size} color={color ?? colors.icon} />;
}
