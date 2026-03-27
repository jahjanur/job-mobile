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
import { useFocusEffect, useRouter } from 'expo-router';
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

import Svg, { Path } from 'react-native-svg';

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
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false });

  }, []);

  const dotStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  // Stop video when navigating away, resume when coming back
  useFocusEffect(
    useCallback(() => {
      videoRef.current?.playAsync();
      return () => {
        videoRef.current?.pauseAsync();
      };
    }, []),
  );

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
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <View style={[s.headerSide, { justifyContent: 'flex-start' }]}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6} style={s.headerBtn}>
            <Ionicons name="arrow-back" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={s.headerCenter}>
          <Svg width={80} height={24} viewBox="0 0 200 60">
            <Path d="M40.4,9.9c10.3,0,20.7,0,31,0c6.1,0,10.4,3,13.6,7.9c1.7,2.7,2.3,5.8,2.3,8.9c0,8.2,0,16.3,0,24.5c0,1-0.4,1.4-1.3,1.3c-0.6,0-1.2,0-1.8,0c-20.6,0-41.1,0-61.7,0c-7.2,0-14.1-5.8-15.5-13.2c-0.3-1.4-0.4-2.8-0.4-4.2c0-8,0-15.9,0-23.9c0-1.5,0-1.5,1.5-1.5C18.8,9.9,29.6,9.9,40.4,9.9z M81.7,45.7c-0.4-1.4-0.9-2.8-1.1-4.1c-0.3-2.8-0.5-5.6-0.7-8.5c-0.4-6.3-4.1-10.4-10.3-11.2c-3.8-0.5-7.5,0.2-10.3,3c-4.9,4.9-4.7,13.4,0.4,18.1c3.5,3.3,9.5,3.9,13.1,1.3c0.8-0.6,1.5-1.3,2.3-2.1c0.3,0.9,0.5,1.8,0.9,2.7c0.1,0.3,0.6,0.7,0.9,0.7C78.4,45.8,80,45.7,81.7,45.7z M29.5,22.1c0.2,0.5,0.3,0.8,0.4,1.1c1.5,3.7,3.1,7.3,4.6,11c1.5,3.5,2.9,6.9,4.3,10.4c0.4,0.9,0.9,1.4,1.9,1.3c1.1-0.1,2.2-0.1,3.3,0c0.8,0,1.2-0.2,1.5-1c2.7-6.6,5.5-13.2,8.3-19.8c0.4-0.9,0.7-1.8,1.2-3c-1.6,0-3,0.1-4.4,0c-0.9-0.1-1.4,0.3-1.7,1.1c-2,5.3-4.1,10.6-6.2,15.9c-0.1,0.2-0.2,0.4-0.5,0.8c-0.4-0.9-0.7-1.6-1-2.3c-1.9-4.8-3.8-9.6-5.8-14.4c-0.2-0.4-0.6-0.9-0.9-0.9C33,22,31.3,22.1,29.5,22.1z M19.1,16.3c-1.6,0-3,0.1-4.5,0c-1-0.1-1.3,0.3-1.3,1.2c0,5.5,0,11,0.1,16.5c0,1.1,0.1,2.2,0.4,3.2c1.4,5.7,7.1,9.5,12.9,8.6c0.3,0,0.8-0.3,0.8-0.5c0.1-1.6,0-3.1,0-4.7c-0.9,0-1.6,0-2.4,0c-3.3,0-5.2-1.7-5.9-4.9c-0.1-0.7-0.2-1.5-0.2-2.3c0-1.8,0.1-3.6,0.1-5.3c1.8-0.1,3.5-0.1,5.3-0.2c0.6,0,1.2,0,1.9,0c0-1.5,0-2.9,0-4.3c0-0.8-0.3-1-1-1c-1.8,0-3.6,0-5.4,0c-0.8,0-1.1-0.2-1.1-1C19.1,20.1,19.1,18.3,19.1,16.3z" fill="#FFF" />
            <Path d="M154.7,28.4c-1,4-1.9,7.9-2.8,11.8c-0.4,1.5-0.9,2.9-1.3,4.3c-0.2,0.8-0.7,1.2-1.5,1.4c-0.1,0-0.3,0.1-0.4,0.1c-4.2,0.5-4.2-0.1-5.1-3.3c-2-7-4-14.1-6-21.1c-0.5-1.9-0.2-2.4,1.8-2.4c3.5,0,3.6,0.1,4.4,3.4c1.1,4.5,2.2,9,3.3,13.5c0.1,0.4,0.2,0.7,0.6,1.1c0.1-0.4,0.3-0.8,0.4-1.2c1-4.6,1.9-9.2,2.9-13.9c0.2-0.7,0.4-1.5,0.7-2.1c0.8-1.2,5.2-1.3,6-0.1c0.4,0.6,0.6,1.4,0.7,2.1c1.1,4.8,2.1,9.7,3.2,14.6c0,0.2,0.2,0.4,0.5,0.6c0.3-1.2,0.6-2.4,0.8-3.6c1-4.3,2-8.7,3.1-13c0.2-0.8,0.7-1.3,1.5-1.3c0.9-0.1,1.8-0.1,2.7-0.1c1.3,0,1.8,0.7,1.4,2c-0.8,3-1.7,5.9-2.5,8.9c-1.1,4.2-2.1,8.3-3.2,12.5c0,0.1,0,0.2-0.1,0.3c-0.8,3-1.5,3.5-4.6,3.2c-1.3-0.1-2.1-0.7-2.5-1.9c-1.3-4.9-2.6-9.8-3.9-14.7C154.9,29.2,154.8,28.8,154.7,28.4z" fill="#FFF" />
            <Path d="M97.7,29.1c0,2.6,0,5.1,0,7.7c0,2.5,0.1,4.9,0.1,7.4c0,1.4-0.4,1.8-1.8,1.9c-4.2,0.2-3.7-0.6-3.7-3.5c0-6.4,0-12.8-0.1-19.1c0-0.7,0-1.3,0-2c0.1-1.4,0.4-1.8,1.8-2c0.9-0.1,1.9-0.1,2.8-0.1c1.1,0,1.8,0.7,2.4,1.7c2.7,4.7,5.4,9.3,8.1,14c0.3,0.5,0.7,1,1,1.5c0.1,0,0.2-0.1,0.3-0.1c0-0.4,0.1-0.9,0.1-1.3c-0.1-4.3-0.2-8.7-0.3-13c0-0.9-0.2-2,0.9-2.5c1.3-0.6,2.8-0.6,4,0.2c0.4,0.3,0.6,1.1,0.6,1.8c0,5.8,0,11.6,0,17.3c0,1.7,0.1,3.4,0.1,5c0,1.5-0.6,2-2.1,2.2c-2.2,0.2-3.8-0.4-4.9-2.5c-2.5-4.4-5.3-8.7-8-13.1c-0.3-0.5-0.7-1-1.1-1.5C97.9,28.9,97.8,29,97.7,29.1z" fill="#FFF" />
            <Path d="M118.6,32.9c0-3.6,0-7.2,0-10.8c0-1.9,0.8-2.9,2.8-2.9c4.4,0,8.9,0,13.3,0c0.9,0,1.4,0.4,1.5,1.3c0.1,0.4,0.1,0.8,0.1,1.1c0,2.5-0.4,2.9-2.9,2.8c-2.4-0.1-4.9-0.1-7.4,0c-1.8,0-2.1,0.4-2.2,2.2c-0.1,3.5,0.1,3.8,3.7,3.8c1.8,0,3.6,0,5.5,0c1.5,0,1.9,0.5,2,2c0,0.3,0,0.6,0,0.8c-0.1,1.6-0.6,2.1-2.2,2.1c-2.1,0-4.1-0.1-6.2-0.1c-2.5,0-2.6,0.2-2.6,2.7c0,3.3,0,3.3,3.3,3.5c2.3,0.1,4.6,0,6.9,0c1.6,0,2,0.4,2,2c0,0.5,0,0.9-0.1,1.4c-0.2,1.2-0.6,1.6-1.8,1.6c-2,0-4.1-0.2-6.1-0.2c-2.3,0-4.7,0.1-7,0.1c-2.2,0-2.8-0.6-2.8-2.8C118.6,39.9,118.6,36.4,118.6,32.9z" fill="#FFF" />
            <Path d="M183,18.8c2.9-0.1,5.6,0.6,8.1,2.2c1.1,0.7,1.3,1.4,0.8,2.6c-0.9,1.9-1.8,2.2-3.8,1.4c-1.2-0.5-2.5-0.9-3.8-1.3c-0.8-0.2-1.7-0.2-2.5-0.2c-1.6,0.1-2.7,1.1-2.9,2.4c-0.2,1.3,0.5,2.3,2.1,2.8c1.3,0.4,2.6,0.6,3.8,1c1.7,0.5,3.3,1.1,4.9,1.8c2.8,1.4,3.7,3.8,3.6,6.8c-0.1,3.2-1.5,5.8-4.6,6.9c-5,1.8-9.8,1.4-14.2-1.8c-2.3-1.7-1.6-3.2,0.3-4.8c0.8-0.6,1.6-0.2,2.3,0.3c1.5,1.2,3,2.2,5,2.3c1,0.1,2,0.1,2.9-0.1c1.5-0.3,2.5-1.5,2.6-2.9c0.1-1.6-0.6-2.8-2.2-3.3c-1.8-0.6-3.7-1-5.6-1.5c-0.9-0.3-1.9-0.6-2.8-1c-4-1.9-5.2-7.1-2.4-10.6c1.7-2,3.9-2.9,6.4-3.2C181.9,18.7,182.5,18.8,183,18.8z" fill="#FFF" />
            <Path d="M67.8,40.7c-4.8,0.1-6.9-3.5-6.3-8c0.6-4.8,5.5-7.2,9.8-5c1.4,0.7,2.2,2,2.6,3.5c0.2,1,0.4,2,0.4,3C74.3,38.4,72,40.7,67.8,40.7z" fill="#FFF" />
          </Svg>
        </View>

        <View style={s.headerSide}>
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
            useNativeControls
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

        {/* ── Status bar below video ────────────── */}
        <View style={[s.statusBar, { paddingHorizontal: spacing.lg }]}>
          <View style={s.statusPill}>
            <Animated.View style={[s.statusDot, dotStyle]} />
            <Text style={s.statusText}>DREJTPERDREJT</Text>
          </View>
          <Equalizer color={colors.accent} />
          <View style={{ flex: 1 }} />
          <View style={s.tagsRow}>
            {['Lajme', 'Shqiperi', '24/7'].map((tag) => (
              <View
                key={tag}
                style={[
                  s.tag,
                  {
                    backgroundColor: dark ? 'rgba(255,255,255,0.06)' : colors.surface,
                    borderRadius: 4,
                  },
                ]}
              >
                <Text style={{ fontSize: 9, color: dark ? 'rgba(255,255,255,0.4)' : colors.textTertiary, fontFamily: hurme4.semiBold }}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </View>

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
  headerSide: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: 80,
  },
  headerCenter: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  headerBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
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

  // Status bar
  statusBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, gap: 8,
  },
  statusPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E31E24', borderRadius: 3,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  statusDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFF', marginRight: 3 },
  statusText: { color: '#FFF', fontFamily: hurme4.bold, fontSize: 7, letterSpacing: 0.5 },

  // Tags
  tagsRow: { flexDirection: 'row', gap: 4 },
  tag: { paddingHorizontal: 6, paddingVertical: 2 },

  // Section
  sectionHeader: { flexDirection: 'row', alignItems: 'center' },
});
