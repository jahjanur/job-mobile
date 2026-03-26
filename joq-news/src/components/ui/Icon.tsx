/**
 * Centralized icon component using Ionicons.
 */

import React from 'react';
import type { ComponentProps } from 'react';

import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../theme';

export type IconName = ComponentProps<typeof Ionicons>['name'];

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 22, color }: IconProps) {
  const { colors } = useTheme();
  return <Ionicons name={name} size={size} color={color ?? colors.icon} />;
}
