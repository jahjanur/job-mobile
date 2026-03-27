/**
 * Categories screen — immersive design with gradient hero cards,
 * animated Live TV banner, and rich category tiles.
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
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {
  CATEGORY_GROUPS,
  type CategoryEntry,
} from '../../src/constants/categories';
import { useTheme } from '../../src/theme';
import { hurme4 } from '../../src/theme/typography';

const GROUP_STYLES: Record<string, { gradient: string[]; emoji: string }> = {
  'Kryesore': { gradient: ['#E31E24', '#FF4757'], emoji: '🔥' },
  'Rajoni & Bota': { gradient: ['#2563EB', '#3B82F6'], emoji: '🌍' },
  'Lifestyle & Interes': { gradient: ['#8B5CF6', '#A78BFA'], emoji: '✨' },
  'Te tjera': { gradient: ['#6B7280', '#9CA3AF'], emoji: '📌' },
};

export default function CategoriesScreen() {
  const { colors, spacing, radius, typography, dark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Live pulse
  const pulse = useSharedValue(1);
  const breathe = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(0.3, { duration: 700, easing: Easing.inOut(Easing.ease) }), -1, true,
    );
    breathe.value = withRepeat(withSequence(
      withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
    ), -1);
  }, []);

  const dotStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));
  const breatheStyle = useAnimatedStyle(() => ({ transform: [{ scale: breathe.value }] }));

  const handlePress = useCallback(
    (entry: CategoryEntry) => {
      if (entry.externalUrl) { Linking.openURL(entry.externalUrl); return; }
      if (entry.slug === 'live') { router.push('/live'); return; }
      if (entry.slug === 'rreth-nesh') { return; }
      if (entry.id != null) {
        router.push(`/category/${entry.id}?name=${encodeURIComponent(entry.name)}`);
      }
    },
    [router],
  );

  const cardBg = dark ? 'rgba(255,255,255,0.04)' : colors.card;
  const cardBorder = dark ? 'rgba(255,255,255,0.06)' : colors.borderLight;

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
            Zgjidh cfare te intereson
          </Text>
        </View>

        {/* ── Live TV banner ─────────────────────── */}
        <TouchableOpacity
          onPress={() => router.push('/live')}
          activeOpacity={0.85}
          style={{ marginHorizontal: spacing.lg, marginTop: spacing.lg }}
        >
          <Animated.View style={breatheStyle}>
            <LinearGradient
              colors={['#E31E24', '#B91C1C', '#7F1D1D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.liveBanner, { borderRadius: radius.xl }]}
            >
              {/* Background pattern circles */}
              <View style={[styles.bgCircle, styles.bgCircle1]} />
              <View style={[styles.bgCircle, styles.bgCircle2]} />

              <View style={styles.liveRow}>
                <View style={{ flex: 1 }}>
                  <View style={styles.liveBadgeRow}>
                    <Animated.View style={[styles.liveDot, dotStyle]} />
                    <Text style={styles.liveBadgeText}>LIVE TV</Text>
                  </View>
                  <Text style={styles.liveTitle}>TVA News</Text>
                  <Text style={styles.liveSub}>Shiko transmetimin drejtperdrejt</Text>
                </View>
                <View style={styles.playBtn}>
                  <Ionicons name="play" size={26} color="#E31E24" style={{ marginLeft: 2 }} />
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        {/* ── Category sections ──────────────────── */}
        {CATEGORY_GROUPS.map((group) => {
          const style = GROUP_STYLES[group.title] ?? GROUP_STYLES['Te tjera'];

          return (
            <View key={group.title} style={{ marginTop: spacing.xxl }}>
              {/* Section header */}
              <View style={[styles.sectionHeader, { paddingHorizontal: spacing.lg }]}>
                <Text style={{ fontSize: 16, marginRight: spacing.xs }}>{style.emoji}</Text>
                <Text style={[typography.h3, { color: colors.text, fontSize: 17 }]}>
                  {group.title}
                </Text>
              </View>

              {/* Cards */}
              <ScrollView
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: spacing.lg,
                  paddingTop: spacing.md,
                  paddingBottom: spacing.xs,
                }}
              >
                {group.entries.map((entry, i) => {
                  const isLive = entry.slug === 'live';
                  const isExternal = !!entry.externalUrl;

                  return (
                    <TouchableOpacity
                      key={entry.slug}
                      onPress={() => handlePress(entry)}
                      activeOpacity={0.7}
                      style={[
                        styles.card,
                        {
                          backgroundColor: cardBg,
                          borderRadius: radius.lg,
                          borderWidth: 1,
                          borderColor: cardBorder,
                          marginRight: spacing.sm,
                        },
                      ]}
                    >
                      {/* Icon */}
                      <View
                        style={[
                          styles.iconBox,
                          {
                            backgroundColor: style.gradient[0] + '12',
                            borderRadius: radius.md,
                          },
                        ]}
                      >
                        {entry.flag ? (
                          <Text style={{ fontSize: 22 }}>{entry.flag}</Text>
                        ) : isLive ? (
                          <View style={styles.liveIconWrap}>
                            <Ionicons name={entry.icon} size={20} color={style.gradient[0]} />
                            <Animated.View
                              style={[
                                styles.liveIconDot,
                                { backgroundColor: '#E31E24' },
                                dotStyle,
                              ]}
                            />
                          </View>
                        ) : (
                          <Ionicons name={entry.icon} size={20} color={style.gradient[0]} />
                        )}
                      </View>

                      {/* Name */}
                      <Text
                        style={[
                          styles.cardName,
                          { color: colors.text, fontFamily: hurme4.semiBold },
                        ]}
                        numberOfLines={2}
                      >
                        {entry.name}
                      </Text>

                      {/* Badges */}
                      {isExternal && (
                        <View style={[styles.badge, { backgroundColor: style.gradient[0] + '15', borderRadius: 4 }]}>
                          <Ionicons name="open-outline" size={8} color={style.gradient[0]} />
                          <Text style={[styles.badgeText, { color: style.gradient[0] }]}>Web</Text>
                        </View>
                      )}
                      {isLive && (
                        <View style={[styles.badge, { backgroundColor: '#E31E24' + '15', borderRadius: 4 }]}>
                          <Animated.View style={[{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#E31E24', marginRight: 3 }, dotStyle]} />
                          <Text style={[styles.badgeText, { color: '#E31E24' }]}>Live</Text>
                        </View>
                      )}

                      {/* Arrow */}
                      <View style={styles.arrowRow}>
                        <Ionicons name="chevron-forward" size={12} color={colors.textTertiary} />
                      </View>
                    </TouchableOpacity>
                  );
                })}
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

  // Live banner
  liveBanner: { height: 120, padding: 20, overflow: 'hidden' },
  bgCircle: {
    position: 'absolute', borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  bgCircle1: { width: 160, height: 160, top: -40, right: -20 },
  bgCircle2: { width: 100, height: 100, bottom: -30, left: 20 },
  liveRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  liveBadgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF', marginRight: 5 },
  liveBadgeText: { color: '#FFF', fontFamily: hurme4.bold, fontSize: 10, letterSpacing: 1.2 },
  liveTitle: { color: '#FFF', fontFamily: hurme4.bold, fontSize: 24 },
  liveSub: { color: 'rgba(255,255,255,0.65)', fontFamily: hurme4.regular, fontSize: 12, marginTop: 2 },
  playBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
  },

  // Section
  sectionHeader: { flexDirection: 'row', alignItems: 'center' },

  // Category card
  card: {
    width: 100,
    paddingTop: 14,
    paddingBottom: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  iconBox: {
    width: 42, height: 42,
    alignItems: 'center', justifyContent: 'center',
  },
  liveIconWrap: { position: 'relative' },
  liveIconDot: {
    position: 'absolute', top: -1, right: -1,
    width: 6, height: 6, borderRadius: 3,
  },
  cardName: { fontSize: 11, marginTop: 8, textAlign: 'center', lineHeight: 14 },
  badge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 5, paddingVertical: 2, marginTop: 6,
  },
  badgeText: { fontSize: 8, fontFamily: hurme4.semiBold, marginLeft: 2, letterSpacing: 0.3 },
  arrowRow: { marginTop: 6, opacity: 0.4 },
});
