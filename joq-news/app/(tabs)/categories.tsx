/**
 * Categories screen — modern design with featured Live TV card,
 * horizontal scrollable category sections, and clean cards.
 */

import React, { useCallback, useEffect } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import {
  CATEGORY_GROUPS,
  type CategoryEntry,
} from '../../src/constants/categories';
import { useTheme } from '../../src/theme';
import { hurme4 } from '../../src/theme/typography';

const CARD_COLORS: Record<string, string[]> = {
  'Kryesore': ['#E31E24', '#FF6B6B'],
  'Rajoni & Bota': ['#2563EB', '#60A5FA'],
  'Lifestyle & Interes': ['#8B5CF6', '#C084FC'],
  'Te tjera': ['#525252', '#737373'],
};

export default function CategoriesScreen() {
  const { colors, spacing, radius, typography, dark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(0.3, { duration: 700, easing: Easing.inOut(Easing.ease) }), -1, true,
    );
  }, []);
  const dotStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  const handlePress = useCallback(
    (entry: CategoryEntry) => {
      if (entry.externalUrl) {
        Linking.openURL(entry.externalUrl);
        return;
      }
      if (entry.slug === 'live') {
        router.push('/live');
        return;
      }
      if (entry.slug === 'rreth-nesh') {
        return;
      }
      if (entry.id != null) {
        router.push(
          `/category/${entry.id}?name=${encodeURIComponent(entry.name)}`,
        );
      }
    },
    [router],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ── Header ─────────────────────────────── */}
        <View style={{ paddingTop: insets.top + spacing.lg, paddingHorizontal: spacing.lg }}>
          <Text style={[typography.h1, { color: colors.text, fontSize: 28, letterSpacing: -0.5 }]}>
            Tema
          </Text>
          <Text style={[typography.bodySm, { color: colors.textSecondary, marginTop: spacing.xxs }]}>
            Shfleto sipas kategorise
          </Text>
        </View>

        {/* ── Live TV featured card ──────────────── */}
        <TouchableOpacity
          onPress={() => router.push('/live')}
          activeOpacity={0.8}
          style={[styles.liveCard, { marginHorizontal: spacing.lg, marginTop: spacing.lg }]}
        >
          <LinearGradient
            colors={['#E31E24', '#B91C1C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.liveGradient, { borderRadius: radius.xl }]}
          >
            <View style={styles.liveContent}>
              <View style={styles.liveLeft}>
                <View style={styles.liveBadgeRow}>
                  <Animated.View style={[styles.liveDot, dotStyle]} />
                  <Text style={styles.liveText}>LIVE TV</Text>
                </View>
                <Text style={styles.liveTitle}>TVA News</Text>
                <Text style={styles.liveSub}>Drejtperdrejt 24/7</Text>
              </View>
              <View style={styles.livePlayBtn}>
                <Ionicons name="play" size={28} color="#E31E24" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── Category sections ──────────────────── */}
        {CATEGORY_GROUPS.map((group) => {
          const gradientColors = CARD_COLORS[group.title] ?? ['#525252', '#737373'];

          return (
            <View key={group.title} style={{ marginTop: spacing.xxl }}>
              {/* Section header */}
              <View style={[styles.sectionHeader, { paddingHorizontal: spacing.lg }]}>
                <View
                  style={[
                    styles.sectionDot,
                    { backgroundColor: gradientColors[0] },
                  ]}
                />
                <Text
                  style={[
                    typography.h3,
                    { color: colors.text, fontSize: 16, marginLeft: spacing.sm },
                  ]}
                >
                  {group.title}
                </Text>
              </View>

              {/* Horizontal scroll of cards */}
              <ScrollView
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: spacing.lg,
                  paddingTop: spacing.md,
                  gap: spacing.sm,
                }}
              >
                {group.entries.map((entry) => (
                  <TouchableOpacity
                    key={entry.slug}
                    onPress={() => handlePress(entry)}
                    activeOpacity={0.7}
                    style={[
                      styles.catCard,
                      {
                        backgroundColor: dark ? 'rgba(255,255,255,0.04)' : colors.card,
                        borderRadius: radius.lg,
                        borderWidth: dark ? 1 : StyleSheet.hairlineWidth,
                        borderColor: dark ? 'rgba(255,255,255,0.06)' : colors.borderLight,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.catIconBox,
                        {
                          backgroundColor: gradientColors[0] + '15',
                          borderRadius: radius.md,
                        },
                      ]}
                    >
                      {entry.flag ? (
                        <Text style={{ fontSize: 20 }}>{entry.flag}</Text>
                      ) : (
                        <Ionicons name={entry.icon} size={20} color={gradientColors[0]} />
                      )}
                    </View>
                    <Text
                      style={[
                        typography.captionMedium,
                        { color: colors.text, marginTop: spacing.sm, textAlign: 'center' },
                      ]}
                      numberOfLines={2}
                    >
                      {entry.name}
                    </Text>
                    {entry.externalUrl && (
                      <View style={[styles.webBadge, { marginTop: spacing.xxs }]}>
                        <Ionicons name="open-outline" size={8} color={colors.textTertiary} />
                        <Text style={{ fontSize: 8, color: colors.textTertiary, marginLeft: 2, fontFamily: hurme4.regular }}>
                          Web
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  // Live card
  liveCard: { height: 110, overflow: 'hidden' },
  liveGradient: { flex: 1, padding: 20 },
  liveContent: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  liveLeft: { flex: 1 },
  liveBadgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF', marginRight: 5 },
  liveText: { color: '#FFF', fontFamily: hurme4.bold, fontSize: 10, letterSpacing: 1.2 },
  liveTitle: { color: '#FFF', fontFamily: hurme4.bold, fontSize: 22 },
  liveSub: { color: 'rgba(255,255,255,0.7)', fontFamily: hurme4.regular, fontSize: 12, marginTop: 2 },
  livePlayBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#FFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
    paddingLeft: 3,
  },

  // Section
  sectionHeader: { flexDirection: 'row', alignItems: 'center' },
  sectionDot: { width: 6, height: 6, borderRadius: 3 },

  // Category card
  catCard: {
    width: 90,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  catIconBox: {
    width: 40, height: 40,
    alignItems: 'center', justifyContent: 'center',
  },
  webBadge: { flexDirection: 'row', alignItems: 'center' },
});
