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
import Svg, { Path } from 'react-native-svg';
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

        {/* ── KAPE banner ──────────────────────── */}
        <TouchableOpacity
          onPress={() => Linking.openURL('https://kape.net')}
          activeOpacity={0.85}
          style={{ marginHorizontal: spacing.lg, marginTop: spacing.lg }}
        >
          <LinearGradient
            colors={['#1E3A5F', '#2563EB', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[st.kapeBanner, { borderRadius: radius.xl }]}
          >
            <View style={[st.bgCircle, { width: 120, height: 120, top: -30, right: 40, backgroundColor: 'rgba(255,255,255,0.05)' }]} />
            <View style={[st.bgCircle, { width: 80, height: 80, bottom: -20, left: -10, backgroundColor: 'rgba(255,255,255,0.04)' }]} />
            <View style={st.kapeRow}>
              <View style={{ flex: 1 }}>
                <Svg width={120} height={36} viewBox="0 0 200 60">
                  <Path d="M58.2,10.8c-0.7,0.7-1.3,1.5-2.1,2.1c-5,4.1-10,8.2-15.1,12.2c-1,0.8-1.1,1.3-0.3,2.4c5.7,6.8,11.3,13.6,16.9,20.4c0.3,0.3,0.5,0.7,1,1.3c-3.2,0-6,0-8.9,0c-0.4,0-0.8-0.5-1.1-0.8c-4.5-5.4-8.9-10.8-13.3-16.3c-0.8-1-1.3-1-2.3-0.2c-3.9,3.1-3.9,3-3.9,7.9c0,2.6,0,5.2,0,7.8c0,0.5,0,1,0,1.6c-2.6,0-5,0-7.6,0c0-12.8,0-25.5,0-38.3c2.5,0,5,0,7.4,0c0.1,0.6,0.2,1.1,0.2,1.7c0,4.3,0,8.6,0,12.9c0,0.4,0,0.9,0,1.7c0.7-0.5,1.1-0.7,1.4-1c4.6-3.8,9.2-7.6,13.8-11.5c1.5-1.2,2.9-2.6,4.4-3.8C52,10.8,55.1,10.8,58.2,10.8z" fill="#FFF" />
                  <Path d="M182.3,49.2c-10.6,0-21.1,0-31.8,0c0-0.6-0.1-1-0.1-1.5c0-11.8,0-23.7,0-35.5c0-0.5,0.1-0.9,0.2-1.4c10.6,0,21.2,0,31.7,0c0,1.6,0,3.2,0,4.8c-7.3,0-14.7,0-22,0c-2,0-2,0-2,2.1c0,2.6,0,5.2,0,7.8c0,2,0,2,1.9,2c5.8,0,11.5,0,17.3,0c3.5,0,2.9-0.4,3,2.9c0,1.8,0,1.8-1.9,1.8c-6.2,0-12.5,0-18.7,0c-1.2,0-1.6,0.3-1.6,1.5c0.1,3,0.1,6,0,8.9c0,1.4,0.4,1.8,1.8,1.8c7-0.1,14,0,21,0c0.4,0,0.8,0.1,1.3,0.1C182.3,46.1,182.3,47.7,182.3,49.2z" fill="#FFF" />
                  <Path d="M131.2,10.8c0.6,0.2,1.3,0.4,1.9,0.5c3.3,0.5,6.4,1.6,8.9,3.8c4.2,3.7,4.3,10.4,0.2,14.3c-3.5,3.4-7.9,4.2-12.5,4.4c-3.5,0.1-7,0.1-10.4,0c-1.2,0-1.6,0.4-1.6,1.6c0.1,4.1,0,8.2,0,12.4c0,1.1-0.3,1.5-1.5,1.5c-2-0.1-4,0-6.1,0c0-0.5-0.1-0.9-0.1-1.3c0-11.9,0-23.9,0-35.8c0-0.4,0.1-0.8,0.1-1.3C117.2,10.8,124.2,10.8,131.2,10.8z M117.8,22.3c0,1.8-0.1,3.6,0,5.4c0,0.4,0.6,1.2,1,1.2c4.3,0,8.7-0.1,13-0.4c2-0.1,3.6-1.2,4.7-2.8c2.5-3.8,0.3-8.9-4.5-9.5c-4.4-0.6-8.8-0.4-13.3-0.4c-0.3,0-0.9,0.7-1,1.2C117.7,18.7,117.8,20.5,117.8,22.3z" fill="#FFF" />
                  <Path d="M90,10.8c-0.5,1.3-1,2.6-1.6,3.8c-4.3,8.9-8.7,17.9-13.1,26.8c-1.1,2.3-2.2,4.5-3.3,6.8c-0.2,0.4-0.7,0.9-1,1c-2.9,0.1-5.8,0-9,0c0.8-1.7,1.4-3.1,2.1-4.6C67.1,38.4,70,32.2,73,26c2.2-4.5,4.5-9,6.7-13.5c0.3-0.5,0.4-1.1,0.6-1.7C83.5,10.8,86.7,10.8,90,10.8z" fill="#FFF" />
                  <Path d="M108.3,47.6c-1.8,0.5-3.6,1-5.5,1.3c-7.6,1.3-14-2.2-17.2-9.2c-1.1-2.4-2.1-4.9-4.4-6.5c-0.9-0.6-0.5-1.2,0.4-1.5c1.9-0.6,3.6,0.1,5,1.3c0.9,0.8,1.6,1.9,2.4,2.8c0.7,0.9,1.4,1.9,2.8,1.6c1.3-0.3,1.9-1.4,2.2-2.6c0.9-4.1,0.5-8-1.6-11.6c-0.8-1.3-1.7-2.6-2.4-4c-0.3-0.6-0.4-1.6-0.1-2c0.7-0.8,1.5-0.2,2.1,0.4c3.4,3,6,6.5,7.4,10.8c0.4,1.1,0.4,2.4,0.5,3.6c0.1,1.5,0.2,2.9,0.2,4.4c0.1,4.9,3,7.8,7,9.9c0.4,0.2,0.9,0.4,1.4,0.7C108.3,47.2,108.3,47.4,108.3,47.6z" fill="#FFF" />
                  <Path d="M93,32.8c-1.3-1-2.5-1.7-3.5-2.7c-1.1-1.1-0.9-1.6,0.6-2.1c-0.7-0.7-1.4-1.4-2-2.1c-0.2-0.3-0.2-0.8-0.2-1.1c0.4-0.1,0.9-0.3,1.3-0.2c0.8,0.3,1.6,0.8,2.6,0.9c-0.6-0.4-1.2-0.8-1.7-1.2c-1-0.8-1.9-1.6-2.8-2.4c-0.2-0.2-0.1-0.8-0.2-1.3c0.4,0,0.9-0.2,1.3-0.1c2.1,0.8,3.4,2.4,3.8,4.4c0.5,2.1,0.7,4.3,1,6.5C93.2,31.7,93.1,32.1,93,32.8z" fill="#FFF" />
                </Svg>
                <Text style={st.kapeSub}>Emisioni i mengjesit</Text>
              </View>
              <View style={st.kapeArrow}>
                <Ionicons name="open-outline" size={18} color="rgba(255,255,255,0.6)" />
              </View>
            </View>
          </LinearGradient>
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
                {group.entries.filter((e) => e.slug !== 'kape').map((entry, i, arr) => {
                  const isLast = i === arr.length - 1;
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

  // KAPE
  kapeBanner: { height: 90, padding: 18, overflow: 'hidden' },
  kapeRow: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  kapeSub: { color: 'rgba(255,255,255,0.55)', fontFamily: hurme4.regular, fontSize: 11, marginTop: 6 },
  kapeArrow: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
});
