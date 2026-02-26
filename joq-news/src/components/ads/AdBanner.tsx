/**
 * Reusable ad banner component using Google AdMob.
 * Uses test ad unit IDs in development.
 * Gracefully handles missing native module (e.g., in Expo Go).
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../theme';

let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

try {
  const admob = require('react-native-google-mobile-ads');
  BannerAd = admob.BannerAd;
  BannerAdSize = admob.BannerAdSize;
  TestIds = admob.TestIds;
} catch {
  // Native module not available (e.g., running in Expo Go)
}

interface AdBannerProps {
  size?: string;
}

export function AdBanner({ size }: AdBannerProps) {
  const { spacing, colors, typography, radius } = useTheme();
  const [adError, setAdError] = useState(false);

  // If native module is not available, show a placeholder
  if (!BannerAd || adError) {
    return (
      <View
        style={[
          styles.placeholder,
          {
            marginVertical: spacing.md,
            marginHorizontal: spacing.lg,
            backgroundColor: colors.surface,
            borderRadius: radius.md,
            padding: spacing.lg,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.borderLight,
          },
        ]}
      >
        <Text
          style={[
            typography.caption,
            { color: colors.textTertiary, textAlign: 'center' },
          ]}
        >
          Hapësirë për reklamë
        </Text>
      </View>
    );
  }

  const adUnitId = __DEV__
    ? TestIds.ADAPTIVE_BANNER
    : 'ca-app-pub-xxxxx/yyyyy'; // Replace with real ad unit ID

  const adSize = size ?? BannerAdSize?.ANCHORED_ADAPTIVE_BANNER;

  return (
    <View
      style={[
        styles.container,
        {
          marginVertical: spacing.md,
          backgroundColor: colors.surface,
        },
      ]}
    >
      <BannerAd
        unitId={adUnitId}
        size={adSize}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={() => setAdError(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
});
