/**
 * Categories screen — TVA News banner on top,
 * then all categories as a clean vertical list grouped by section.
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

export default function CategoriesScreen() {
  const { colors, spacing, radius, typography, dark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const pulse = useSharedValue(1);
  const breathe = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(0.3, { duration: 700, easing: Easing.inOut(Easing.ease) }), -1, true,
    );
    breathe.value = withRepeat(withSequence(
      withTiming(1.015, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
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

  const rowBg = dark ? 'rgba(255,255,255,0.03)' : colors.card;
  const rowBorder = dark ? 'rgba(255,255,255,0.05)' : colors.borderLight;

  return (
    <View style={[st.screen, { backgroundColor: colors.background }]}>
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
              style={[st.liveBanner, { borderRadius: radius.xl }]}
            >
              <View style={[st.bgCircle, st.bgCircle1]} />
              <View style={[st.bgCircle, st.bgCircle2]} />
              <View style={st.liveRow}>
                <View style={{ flex: 1 }}>
                  <View style={st.liveBadgeRow}>
                    <Animated.View style={[st.liveDot, dotStyle]} />
                    <Text style={st.liveBadgeText}>LIVE TV</Text>
                  </View>
                  <Text style={st.liveTitle}>TVA News</Text>
                  <Text style={st.liveSub}>Shiko transmetimin drejtperdrejt</Text>
                </View>
                <View style={st.playBtn}>
                  <Ionicons name="play" size={26} color="#E31E24" style={{ marginLeft: 2 }} />
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        {/* ── Category groups ────────────────────── */}
        {CATEGORY_GROUPS.map((group) => (
          <View key={group.title} style={{ marginTop: spacing.xxl }}>
            {/* Section label */}
            <Text
              style={[
                typography.label,
                {
                  color: colors.textTertiary,
                  paddingHorizontal: spacing.lg,
                  marginBottom: spacing.sm,
                  letterSpacing: 0.8,
                },
              ]}
            >
              {group.title.toUpperCase()}
            </Text>

            {/* List of categories */}
            <View
              style={[
                st.groupCard,
                {
                  marginHorizontal: spacing.lg,
                  backgroundColor: rowBg,
                  borderRadius: radius.lg,
                  borderWidth: dark ? 1 : StyleSheet.hairlineWidth,
                  borderColor: rowBorder,
                  overflow: 'hidden',
                },
              ]}
            >
              {group.entries.map((entry, i) => {
                const isLast = i === group.entries.length - 1;
                const isLive = entry.slug === 'live';
                const isExternal = !!entry.externalUrl;

                return (
                  <TouchableOpacity
                    key={entry.slug}
                    onPress={() => handlePress(entry)}
                    activeOpacity={0.6}
                    style={[
                      st.row,
                      {
                        paddingHorizontal: spacing.lg,
                        paddingVertical: spacing.md + 2,
                        borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                        borderBottomColor: rowBorder,
                      },
                    ]}
                  >
                    {/* Icon */}
                    <View
                      style={[
                        st.iconBox,
                        {
                          backgroundColor: colors.accent + '10',
                          borderRadius: radius.md,
                        },
                      ]}
                    >
                      {entry.flag ? (
                        <Text style={{ fontSize: 18 }}>{entry.flag}</Text>
                      ) : (
                        <Ionicons name={entry.icon} size={18} color={colors.accent} />
                      )}
                    </View>

                    {/* Name + badge */}
                    <View style={st.rowContent}>
                      <Text
                        style={[
                          typography.bodyMedium,
                          { color: colors.text, fontSize: 14 },
                        ]}
                        numberOfLines={1}
                      >
                        {entry.name}
                      </Text>
                    </View>

                    {/* Right side indicators */}
                    {isLive && (
                      <View style={st.liveMini}>
                        <Animated.View style={[st.liveMiniDot, dotStyle]} />
                        <Text style={st.liveMiniText}>LIVE</Text>
                      </View>
                    )}
                    {isExternal && (
                      <View style={st.externalTag}>
                        <Text style={st.externalText}>WEB</Text>
                        <Ionicons name="open-outline" size={10} color={colors.textTertiary} style={{ marginLeft: 2 }} />
                      </View>
                    )}
                    {!isLive && !isExternal && (
                      <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1 },

  // Live banner
  liveBanner: { height: 120, padding: 20, overflow: 'hidden' },
  bgCircle: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)' },
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

  // Group
  groupCard: {},

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
  },
  rowContent: {
    flex: 1,
    marginLeft: 12,
  },

  // Live mini badge
  liveMini: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E31E24', borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  liveMiniDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFF', marginRight: 3 },
  liveMiniText: { color: '#FFF', fontFamily: hurme4.bold, fontSize: 8, letterSpacing: 0.5 },

  // External tag
  externalTag: {
    flexDirection: 'row', alignItems: 'center',
  },
  externalText: {
    fontFamily: hurme4.semiBold, fontSize: 9,
    color: '#9CA3AF', letterSpacing: 0.5,
  },
});
