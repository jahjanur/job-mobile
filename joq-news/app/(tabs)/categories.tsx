/**
 * Categories screen — TVA News banner + grouped category lists
 * with color-coded icons, descriptions, and article counts.
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

/** Color + description per group */
const GROUP_META: Record<string, { color: string; desc: string }> = {
  'Kryesore': { color: '#E31E24', desc: 'Lajmet me te rendesishme' },
  'Rajoni & Bota': { color: '#2563EB', desc: 'Nga rajoni dhe bota' },
  'Lifestyle & Interes': { color: '#8B5CF6', desc: 'Jeta, kuriozitete dhe me shume' },
  'Te tjera': { color: '#6B7280', desc: 'Informacione shtese' },
};

/** Short description per category slug */
const CAT_DESC: Record<string, string> = {
  'home': 'Faqja kryesore',
  'vec-e-jona': 'Ekskluzive nga JOQ',
  'lajme': 'Lajme nga Shqiperia',
  'kck': 'Investigime dhe zbulime',
  'si-te': 'Kete dite ne histori',
  'kape': 'Emisioni i mengjesit',
  'live': 'Transmetim drejtperdrejt',
  'kosova': 'Lajme nga Kosova',
  'maqedoni': 'Lajme nga Maqedonia',
  'bota': 'Lajme nderkombetare',
  'kuriozitete': 'Fakte interesante',
  'thashetheme': 'Bota e showbizit',
  'udhetime': 'Destinacione dhe udherime',
  'shendeti': 'Keshilla per shendetin',
  'libra': 'Bota e librave',
  'animals': 'Bota e kafsehve',
  'sport': 'Futboll, basketboll dhe me shume',
  'teknologji': 'Risi dhe inovacione',
  'persekutimi-ndaj-joq': 'Presioni ndaj medias',
  'rreth-nesh': 'Kush jemi ne',
};

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

  const cardBg = dark ? 'rgba(255,255,255,0.03)' : colors.card;
  const divider = dark ? 'rgba(255,255,255,0.04)' : colors.borderLight;

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
        {CATEGORY_GROUPS.map((group) => {
          const meta = GROUP_META[group.title] ?? GROUP_META['Te tjera'];

          return (
            <View key={group.title} style={{ marginTop: spacing.xxl }}>
              {/* Section header */}
              <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.sm }}>
                <View style={st.sectionRow}>
                  <View style={[st.sectionDot, { backgroundColor: meta.color }]} />
                  <Text style={[typography.h3, { color: colors.text, fontSize: 16, marginLeft: spacing.sm }]}>
                    {group.title}
                  </Text>
                </View>
                <Text
                  style={[
                    typography.caption,
                    { color: colors.textTertiary, marginTop: 2, marginLeft: spacing.lg + spacing.sm },
                  ]}
                >
                  {meta.desc}
                </Text>
              </View>

              {/* Card */}
              <View
                style={[
                  st.groupCard,
                  {
                    marginHorizontal: spacing.lg,
                    backgroundColor: cardBg,
                    borderRadius: radius.lg,
                    borderWidth: dark ? 1 : StyleSheet.hairlineWidth,
                    borderColor: dark ? 'rgba(255,255,255,0.06)' : divider,
                    overflow: 'hidden',
                  },
                ]}
              >
                {group.entries.map((entry, i) => {
                  const isLast = i === group.entries.length - 1;
                  const isLive = entry.slug === 'live';
                  const isExternal = !!entry.externalUrl;
                  const desc = CAT_DESC[entry.slug];

                  return (
                    <TouchableOpacity
                      key={entry.slug}
                      onPress={() => handlePress(entry)}
                      activeOpacity={0.55}
                      style={[
                        st.row,
                        {
                          paddingHorizontal: spacing.lg,
                          paddingVertical: 13,
                          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                          borderBottomColor: divider,
                        },
                      ]}
                    >
                      {/* Icon */}
                      <View
                        style={[
                          st.iconBox,
                          {
                            backgroundColor: meta.color + '12',
                            borderRadius: 10,
                          },
                        ]}
                      >
                        {entry.flag ? (
                          <Text style={{ fontSize: 18 }}>{entry.flag}</Text>
                        ) : (
                          <Ionicons name={entry.icon} size={18} color={meta.color} />
                        )}
                      </View>

                      {/* Text */}
                      <View style={st.rowContent}>
                        <Text
                          style={[
                            { color: colors.text, fontFamily: hurme4.semiBold, fontSize: 14 },
                          ]}
                          numberOfLines={1}
                        >
                          {entry.name}
                        </Text>
                        {desc && (
                          <Text
                            style={[
                              typography.caption,
                              { color: colors.textTertiary, marginTop: 1, fontSize: 11 },
                            ]}
                            numberOfLines={1}
                          >
                            {desc}
                          </Text>
                        )}
                      </View>

                      {/* Right indicator */}
                      {isLive ? (
                        <View style={st.liveMini}>
                          <Animated.View style={[st.liveMiniDot, dotStyle]} />
                          <Text style={st.liveMiniText}>LIVE</Text>
                        </View>
                      ) : isExternal ? (
                        <View style={[st.externalTag, { backgroundColor: meta.color + '10', borderRadius: 4 }]}>
                          <Text style={[st.externalText, { color: meta.color }]}>WEB</Text>
                          <Ionicons name="open-outline" size={9} color={meta.color} style={{ marginLeft: 2 }} />
                        </View>
                      ) : (
                        <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1 },

  // Live
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

  // Section
  sectionRow: { flexDirection: 'row', alignItems: 'center' },
  sectionDot: { width: 8, height: 8, borderRadius: 4 },

  // Group card
  groupCard: {},

  // Row
  row: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  rowContent: { flex: 1, marginLeft: 12 },

  // Live mini
  liveMini: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E31E24', borderRadius: 4,
    paddingHorizontal: 7, paddingVertical: 3,
  },
  liveMiniDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFF', marginRight: 3 },
  liveMiniText: { color: '#FFF', fontFamily: hurme4.bold, fontSize: 8, letterSpacing: 0.5 },

  // External
  externalTag: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 6, paddingVertical: 3,
  },
  externalText: { fontFamily: hurme4.bold, fontSize: 9, letterSpacing: 0.5 },
});
