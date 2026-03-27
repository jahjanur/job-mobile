/**
 * Live TV — TVA News live stream with trending news feed below.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Audio, ResizeMode, Video, type AVPlaybackStatus } from 'expo-av';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { PostCard } from '../../src/components/cards/PostCard';
import { useTrendingPosts } from '../../src/hooks/useTrendingPosts';
import { useTheme } from '../../src/theme';
import { hurme4 } from '../../src/theme/typography';

const LIVE_URL = 'https://live.tvanews.com/live/tvanews/play.m3u8';
const SCREEN_W = Dimensions.get('window').width;
const VIDEO_H = (SCREEN_W * 9) / 16;

/* ── Equalizer ─────────────────────────────────── */
function EqBar({ min, max, dur, color }: { min: number; max: number; dur: number; color: string }) {
  const h = useSharedValue(min);
  useEffect(() => {
    h.value = withRepeat(withSequence(
      withTiming(max, { duration: dur }),
      withTiming(min, { duration: dur }),
    ), -1);
  }, []);
  const style = useAnimatedStyle(() => ({ height: h.value * 14 }));
  return <Animated.View style={[{ width: 2.5, borderRadius: 1.5, backgroundColor: color }, style]} />;
}

function Equalizer({ color }: { color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 14, gap: 2 }}>
      <EqBar min={0.2} max={0.9} dur={380} color={color} />
      <EqBar min={0.3} max={1.0} dur={320} color={color} />
      <EqBar min={0.15} max={0.85} dur={420} color={color} />
      <EqBar min={0.25} max={0.95} dur={360} color={color} />
    </View>
  );
}

/* ── Main ──────────────────────────────────────── */
export default function LiveScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, spacing, radius, typography, dark } = useTheme();
  const videoRef = useRef<Video>(null);

  const [buffering, setBuffering] = useState(true);
  const [error, setError] = useState(false);
  const [muted, setMuted] = useState(false);

  const { data: trendingPosts } = useTrendingPosts({ limit: 10 });

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(0.3, { duration: 700, easing: Easing.inOut(Easing.ease) }), -1, true,
    );
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true });
  }, []);

  const dotStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  const onStatus = useCallback((s: AVPlaybackStatus) => {
    if (!s.isLoaded) { if (s.error) { setError(true); setBuffering(false); } return; }
    setBuffering(s.isBuffering);
    setError(false);
  }, []);

  const retry = useCallback(async () => {
    setError(false); setBuffering(true);
    try {
      await videoRef.current?.unloadAsync();
      await videoRef.current?.loadAsync({ uri: LIVE_URL }, { shouldPlay: true });
    } catch { setError(true); }
  }, []);

  const goFullscreen = useCallback(() => {
    videoRef.current?.presentFullscreenPlayer();
  }, []);

  return (
    <View style={[s.screen, { backgroundColor: dark ? '#08080A' : colors.background }]}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ───────────────────────────────── */}
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6} style={s.headerBtn}>
          <Ionicons name="arrow-back" size={20} color="#FFF" />
        </TouchableOpacity>

        <View style={s.headerCenter}>
          <Ionicons name="tv" size={16} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={s.headerTitle}>TVA News</Text>
          <View style={s.livePill}>
            <Animated.View style={[s.liveDot, dotStyle]} />
            <Text style={s.liveLabel}>LIVE</Text>
          </View>
        </View>

        <View style={s.headerRight}>
          <TouchableOpacity onPress={() => setMuted(!muted)} activeOpacity={0.6} style={s.headerBtn}>
            <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={18} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={goFullscreen} activeOpacity={0.6} style={[s.headerBtn, { marginLeft: 6 }]}>
            <Ionicons name="expand" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.massive + 40 }}
      >
        {/* ── Video ──────────────────────────────── */}
        <View style={s.videoWrap}>
          <Video
            ref={videoRef}
            source={{ uri: LIVE_URL }}
            style={s.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isMuted={muted}
            isLooping={false}
            onPlaybackStatusUpdate={onStatus}
            onError={() => setError(true)}
          />

          {buffering && !error && (
            <Animated.View entering={FadeIn} style={s.overlay}>
              <ActivityIndicator size="large" color="#FFF" />
              <Text style={s.bufferText}>Duke lidhur transmetimin...</Text>
            </Animated.View>
          )}

          {error && (
            <Animated.View entering={FadeIn} style={s.overlay}>
              <Ionicons name="cloud-offline-outline" size={36} color="rgba(255,255,255,0.7)" />
              <Text style={s.errorTitle}>Transmetimi nuk eshte i disponueshem</Text>
              <TouchableOpacity onPress={retry} activeOpacity={0.7} style={s.retryBtn}>
                <Ionicons name="refresh-outline" size={15} color="#FFF" style={{ marginRight: 5 }} />
                <Text style={s.retryText}>Provo perseri</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {/* ── Channel info ───────────────────────── */}
        <View style={[s.channelSection, { paddingHorizontal: spacing.lg }]}>
          <View style={s.channelRow}>
            <View style={[s.channelIcon, { backgroundColor: colors.accent + '15', borderRadius: radius.md }]}>
              <Ionicons name="tv" size={20} color={colors.accent} />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={[typography.h3, { color: dark ? '#FFF' : colors.text }]}>
                TVA News
              </Text>
              <View style={s.channelMeta}>
                <View style={s.statusPill}>
                  <Animated.View style={[s.statusDot, dotStyle]} />
                  <Text style={s.statusText}>DREJTPERDREJT</Text>
                </View>
                <Equalizer color={colors.accent} />
              </View>
            </View>
          </View>

          {/* Meta tags */}
          <View style={[s.tagsRow, { marginTop: spacing.md }]}>
            {['Lajme', 'Shqiperi', 'Drejtperdrejte', '24/7'].map((tag) => (
              <View
                key={tag}
                style={[
                  s.tag,
                  {
                    backgroundColor: dark ? 'rgba(255,255,255,0.06)' : colors.surface,
                    borderRadius: radius.sm,
                  },
                ]}
              >
                <Text style={[typography.label, { color: dark ? 'rgba(255,255,255,0.5)' : colors.textSecondary }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Divider ────────────────────────────── */}
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: dark ? 'rgba(255,255,255,0.06)' : colors.borderLight,
            marginHorizontal: spacing.lg,
            marginVertical: spacing.lg,
          }}
        />

        {/* ── Trending news ──────────────────────── */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.md }}>
          <View style={s.sectionHeader}>
            <Ionicons name="flame" size={16} color={colors.accent} />
            <Text
              style={[
                typography.h3,
                { color: dark ? '#FFF' : colors.text, marginLeft: spacing.sm, fontSize: 15 },
              ]}
            >
              Lajmet e fundit
            </Text>
          </View>
        </View>

        {trendingPosts && trendingPosts.length > 0 ? (
          trendingPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <View style={{ paddingVertical: spacing.xxl, alignItems: 'center' }}>
            <ActivityIndicator color={colors.accent} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 10,
    backgroundColor: '#111',
  },
  headerBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF', fontFamily: hurme4.bold, fontSize: 15, marginRight: 8,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  livePill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E31E24', borderRadius: 4,
    paddingHorizontal: 7, paddingVertical: 3,
  },
  liveDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#FFF', marginRight: 4 },
  liveLabel: { color: '#FFF', fontFamily: hurme4.bold, fontSize: 9, letterSpacing: 0.8 },

  // Video
  videoWrap: { width: SCREEN_W, height: VIDEO_H, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },

  // Overlays
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  bufferText: { color: 'rgba(255,255,255,0.45)', fontFamily: hurme4.regular, fontSize: 11, marginTop: 10 },
  errorTitle: { color: 'rgba(255,255,255,0.8)', fontFamily: hurme4.semiBold, fontSize: 14, marginTop: 12, textAlign: 'center', paddingHorizontal: 30 },
  retryBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E31E24', borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 8, marginTop: 14,
  },
  retryText: { color: '#FFF', fontFamily: hurme4.semiBold, fontSize: 12 },

  // Channel
  channelSection: { paddingTop: 16 },
  channelRow: { flexDirection: 'row', alignItems: 'center' },
  channelIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  channelMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
  statusPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E31E24', borderRadius: 3,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  statusDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFF', marginRight: 3 },
  statusText: { color: '#FFF', fontFamily: hurme4.bold, fontSize: 7, letterSpacing: 0.5 },

  // Tags
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { paddingHorizontal: 8, paddingVertical: 4 },

  // Section
  sectionHeader: { flexDirection: 'row', alignItems: 'center' },
});
