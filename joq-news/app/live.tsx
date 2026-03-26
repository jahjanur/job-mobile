/**
 * Live TV — TVA News live stream via HLS.
 * Always-visible controls, fullscreen support, channel info.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
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

import { hurme4 } from '../src/theme/typography';

const LIVE_URL = 'https://live.tvanews.com/live/tvanews/play.m3u8';
const SCREEN_W = Dimensions.get('window').width;
const VIDEO_H = (SCREEN_W * 9) / 16;

/* ── Equalizer bars ────────────────────────────── */
function EqBar({ min, max, dur, color }: { min: number; max: number; dur: number; color: string }) {
  const h = useSharedValue(min);
  useEffect(() => {
    h.value = withRepeat(withSequence(
      withTiming(max, { duration: dur }),
      withTiming(min, { duration: dur }),
    ), -1);
  }, []);
  const style = useAnimatedStyle(() => ({ height: h.value * 16 }));
  return <Animated.View style={[{ width: 3, borderRadius: 1.5, backgroundColor: color }, style]} />;
}

function Equalizer({ color }: { color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 16, gap: 2 }}>
      <EqBar min={0.2} max={0.9} dur={380} color={color} />
      <EqBar min={0.3} max={1.0} dur={320} color={color} />
      <EqBar min={0.15} max={0.85} dur={420} color={color} />
      <EqBar min={0.25} max={0.95} dur={360} color={color} />
      <EqBar min={0.2} max={0.8} dur={400} color={color} />
    </View>
  );
}

/* ── Main screen ───────────────────────────────── */
export default function LiveScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const videoRef = useRef<Video>(null);

  const [buffering, setBuffering] = useState(true);
  const [error, setError] = useState(false);
  const [muted, setMuted] = useState(false);

  const pulse = useSharedValue(1);
  const glow = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(0.3, { duration: 700, easing: Easing.inOut(Easing.ease) }), -1, true,
    );
    glow.value = withRepeat(withSequence(
      withTiming(1.4, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
    ), -1);
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true });
  }, []);

  const dotStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));
  const glowStyle = useAnimatedStyle(() => ({ transform: [{ scale: glow.value }], opacity: 0.12 }));

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
    <View style={st.screen}>
      <StatusBar barStyle="light-content" />

      {/* ── Top bar (always visible) ─────────────── */}
      <View style={[st.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6} style={st.topBtn}>
          <Ionicons name="chevron-down" size={22} color="#FFF" />
        </TouchableOpacity>

        <View style={st.livePill}>
          <Animated.View style={[st.liveDot, dotStyle]} />
          <Text style={st.liveLabel}>LIVE</Text>
        </View>

        <View style={st.topRight}>
          <TouchableOpacity onPress={() => setMuted(!muted)} activeOpacity={0.6} style={st.topBtn}>
            <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={19} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={goFullscreen} activeOpacity={0.6} style={[st.topBtn, { marginLeft: 6 }]}>
            <Ionicons name="expand-outline" size={19} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Video ────────────────────────────────── */}
      <View style={st.videoWrap}>
        <Video
          ref={videoRef}
          source={{ uri: LIVE_URL }}
          style={st.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isMuted={muted}
          isLooping={false}
          onPlaybackStatusUpdate={onStatus}
          onError={() => setError(true)}
        />

        {/* Buffering */}
        {buffering && !error && (
          <Animated.View entering={FadeIn} style={st.overlay}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={st.bufferText}>Duke lidhur transmetimin...</Text>
          </Animated.View>
        )}

        {/* Error */}
        {error && (
          <Animated.View entering={FadeIn} style={st.overlay}>
            <Ionicons name="cloud-offline-outline" size={38} color="rgba(255,255,255,0.7)" />
            <Text style={st.errorTitle}>Transmetimi nuk eshte i disponueshem</Text>
            <TouchableOpacity onPress={retry} activeOpacity={0.7} style={st.retryBtn}>
              <Ionicons name="refresh-outline" size={15} color="#FFF" style={{ marginRight: 5 }} />
              <Text style={st.retryText}>Provo perseri</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* ── Info panel ───────────────────────────── */}
      <View style={st.panel}>
        {/* Glow */}
        <Animated.View style={[st.glow, glowStyle]} />

        {/* Channel card */}
        <View style={st.channelCard}>
          <View style={st.logoBox}>
            <Ionicons name="tv" size={24} color="#FFF" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={st.channelName}>TVA News</Text>
            <View style={st.statusRow}>
              <View style={st.statusPill}>
                <Animated.View style={[st.statusDot, dotStyle]} />
                <Text style={st.statusLabel}>DREJTPERDREJT</Text>
              </View>
              <Text style={st.channelSub}>24/7</Text>
            </View>
          </View>
          <Equalizer color="#E31E24" />
        </View>

        {/* Meta */}
        <View style={st.metaRow}>
          {[
            { icon: 'videocam-outline' as const, text: 'Drejtperdrejte' },
            { icon: 'earth-outline' as const, text: 'Shqiperi' },
            { icon: 'language-outline' as const, text: 'Shqip' },
          ].map((m, i) => (
            <React.Fragment key={m.text}>
              {i > 0 && <View style={st.metaDivDot} />}
              <Ionicons name={m.icon} size={14} color="rgba(255,255,255,0.35)" />
              <Text style={st.metaText}>{m.text}</Text>
            </React.Fragment>
          ))}
        </View>

        {/* Divider */}
        <View style={st.divider} />

        {/* Quick nav */}
        <View style={st.navRow}>
          {[
            { icon: 'home-outline' as const, label: 'Ballina', tab: '/' },
            { icon: 'grid-outline' as const, label: 'Tema', tab: '/categories' },
            { icon: 'search-outline' as const, label: 'Kerko', tab: '/search' },
            { icon: 'bookmark-outline' as const, label: 'Ruajtur', tab: '/bookmarks' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => { router.back(); router.navigate(item.tab); }}
              activeOpacity={0.7}
              style={st.navItem}
            >
              <View style={st.navCircle}>
                <Ionicons name={item.icon} size={18} color="#FFF" />
              </View>
              <Text style={st.navLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#08080A' },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingBottom: 10,
    backgroundColor: '#08080A',
  },
  topBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  topRight: { flexDirection: 'row', alignItems: 'center' },
  livePill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E31E24', borderRadius: 5,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF', marginRight: 5 },
  liveLabel: { color: '#FFF', fontFamily: hurme4.bold, fontSize: 10, letterSpacing: 1 },

  // Video
  videoWrap: { width: SCREEN_W, height: VIDEO_H, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },

  // Overlays
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  bufferText: { color: 'rgba(255,255,255,0.45)', fontFamily: hurme4.regular, fontSize: 11, marginTop: 10 },
  errorTitle: { color: 'rgba(255,255,255,0.8)', fontFamily: hurme4.semiBold, fontSize: 14, marginTop: 12, textAlign: 'center', paddingHorizontal: 30 },
  retryBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E31E24', borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 8, marginTop: 14,
  },
  retryText: { color: '#FFF', fontFamily: hurme4.semiBold, fontSize: 12 },

  // Panel
  panel: { flex: 1, paddingHorizontal: 20, paddingTop: 22, overflow: 'hidden' },
  glow: {
    position: 'absolute', top: -80, alignSelf: 'center',
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: '#E31E24',
  },

  // Channel card
  channelCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  logoBox: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: 'rgba(227,30,36,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  channelName: { color: '#FFF', fontFamily: hurme4.bold, fontSize: 16 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E31E24', borderRadius: 3,
    paddingHorizontal: 5, paddingVertical: 2,
  },
  statusDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFF', marginRight: 3 },
  statusLabel: { color: '#FFF', fontFamily: hurme4.bold, fontSize: 7, letterSpacing: 0.5 },
  channelSub: { color: 'rgba(255,255,255,0.35)', fontFamily: hurme4.regular, fontSize: 10, marginLeft: 8 },

  // Meta
  metaRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 18,
  },
  metaText: { color: 'rgba(255,255,255,0.35)', fontFamily: hurme4.regular, fontSize: 11, marginLeft: 4 },
  metaDivDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: 10 },

  // Divider
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 18 },

  // Nav
  navRow: { flexDirection: 'row', justifyContent: 'space-around' },
  navItem: { alignItems: 'center' },
  navCircle: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center', justifyContent: 'center',
  },
  navLabel: { color: 'rgba(255,255,255,0.35)', fontFamily: hurme4.regular, fontSize: 10, marginTop: 6 },
});
