/**
 * Live TV — immersive streaming experience for JOQ Albania.
 * Portrait mode with fullscreen via native presentFullscreenPlayer.
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
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { hurme4 } from '../src/theme/typography';

const LIVE_URL = 'https://live.tvanews.com/live/tvanews/play.m3u8';
const SCREEN_W = Dimensions.get('window').width;
const VIDEO_H = (SCREEN_W * 9) / 16;

const LOGO_PATHS = [
  'M258,16.1c21,9.5,30.9,33.7,23.8,55.6c-0.8,2.5-1.7,5-2.8,7.5c-3.9,9.2-1.4,15.4,8.2,17.2c4,0.8,6.5,2.8,5.8,6.8c-0.7,4.1-3.9,5.1-7.8,4.8c-15.4-1.2-24.6-17.9-17.4-32.1c3.9-7.7,6.2-15.4,4.7-24c-3.4-18.7-20.8-30.9-39.3-27.6c-18.4,3.3-30.5,20.8-27.3,39.6c3.1,17.9,20.7,30,39.3,27c2.1-0.3,4.8-0.8,6.5,0.2c1.6,0.9,3.5,4.2,2.9,5.3c-1.2,2.3-3.7,5.1-6,5.6c-15.5,3.2-29.4-0.7-41-11.6c-15-14.1-18.4-36.8-8.4-54.7c10.2-18.3,31.3-27.3,51.5-21.9C253.3,14.2,255.7,15,258,16.1z',
  'M142.1,12c25.2,0.1,45.6,20.6,45.5,45.7c-0.1,25-21,45.5-46,45.2c-25.2-0.3-45.4-20.8-45.2-46C96.6,32.2,117.2,11.9,142.1,12z M141.7,91.1c19,0.1,34.2-14.8,34.2-33.6c0-18.5-15-33.6-33.6-33.8c-18.8-0.2-34.1,14.9-34.1,33.7C108.1,76,123,91,141.7,91.1z',
  'M78.9,23.7c-4.3,0-8.1,0-11.8,0c-4,0-6.9-1.6-7-5.8c-0.1-4.1,2.8-5.9,6.8-6c5.7-0.1,11.4-0.1,17.1,0c4.3,0.1,6.7,2.4,6.6,6.8c0,14,0.4,28.1-0.2,42C89.6,79.2,76.1,95.5,58.3,101c-17.6,5.4-37.3-0.7-48.7-15c-2.6-3.3-4.5-6.6-0.5-9.9c3.9-3.2,6.8-0.8,9.6,2.5c10,11.6,24.4,15.6,38,10.6c13.6-5,22.1-17.3,22.2-32.5C79,45.9,78.9,35.1,78.9,23.7z',
];

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

  const [controls, setControls] = useState(true);
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

  // Auto-hide controls
  useEffect(() => {
    if (!controls) return;
    const t = setTimeout(() => setControls(false), 4000);
    return () => clearTimeout(t);
  }, [controls]);

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
    <View style={s.screen}>
      <StatusBar barStyle="light-content" />

      {/* ── Video ────────────────────────────────── */}
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

        {/* Buffering */}
        {buffering && !error && (
          <Animated.View entering={FadeIn} style={s.overlay}>
            <Svg width={56} height={22} viewBox="0 0 300 120" style={{ marginBottom: 12 }}>
              {LOGO_PATHS.map((d, i) => <Path key={i} d={d} fill="rgba(255,255,255,0.7)" />)}
            </Svg>
            <ActivityIndicator size="small" color="#FFF" />
            <Text style={s.bufferText}>Duke lidhur...</Text>
          </Animated.View>
        )}

        {/* Error */}
        {error && (
          <Animated.View entering={FadeIn} style={s.overlay}>
            <Ionicons name="cloud-offline-outline" size={38} color="rgba(255,255,255,0.7)" />
            <Text style={s.errorTitle}>Transmetimi nuk eshte i disponueshem</Text>
            <TouchableOpacity onPress={retry} activeOpacity={0.7} style={s.retryBtn}>
              <Ionicons name="refresh-outline" size={15} color="#FFF" style={{ marginRight: 5 }} />
              <Text style={s.retryText}>Provo perseri</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Tap zone */}
        <TouchableOpacity
          onPress={() => setControls(!controls)}
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
        />

        {/* Controls */}
        {controls && (
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
            style={[s.controlsWrap, { paddingTop: insets.top }]}
            pointerEvents="box-none"
          >
            {/* Top */}
            <View style={s.controlsTop}>
              <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6} style={s.glassBtn}>
                <Ionicons name="chevron-down" size={22} color="#FFF" />
              </TouchableOpacity>
              <View style={s.livePill}>
                <Animated.View style={[s.liveDot, dotStyle]} />
                <Text style={s.liveLabel}>LIVE</Text>
              </View>
              <View style={{ width: 40 }} />
            </View>

            {/* Bottom */}
            <View style={s.controlsBottom}>
              <TouchableOpacity onPress={() => setMuted(!muted)} activeOpacity={0.6} style={s.glassBtn}>
                <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={19} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={goFullscreen} activeOpacity={0.6} style={s.glassBtn}>
                <Ionicons name="expand-outline" size={19} color="#FFF" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>

      {/* ── Info panel ───────────────────────────── */}
      <View style={s.panel}>
        {/* Glow */}
        <Animated.View style={[s.glow, glowStyle]} />

        {/* Channel */}
        <View style={s.channelCard}>
          <View style={s.logoBox}>
            <Svg width={44} height={18} viewBox="0 0 300 120">
              {LOGO_PATHS.map((d, i) => <Path key={i} d={d} fill="#FFF" />)}
            </Svg>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.channelName}>JOQ Albania</Text>
            <View style={s.statusRow}>
              <View style={s.onAirPill}>
                <Animated.View style={[s.onAirDot, dotStyle]} />
                <Text style={s.onAirLabel}>ON AIR</Text>
              </View>
              <Text style={s.channelSub}>24/7</Text>
            </View>
          </View>
          <Equalizer color="#E31E24" />
        </View>

        {/* Meta */}
        <View style={s.metaRow}>
          {[
            { icon: 'videocam-outline' as const, text: 'Drejtperdrejte' },
            { icon: 'earth-outline' as const, text: 'Shqiperi' },
            { icon: 'language-outline' as const, text: 'Shqip' },
          ].map((m, i) => (
            <React.Fragment key={m.text}>
              {i > 0 && <View style={s.metaDot} />}
              <Ionicons name={m.icon} size={14} color="rgba(255,255,255,0.35)" />
              <Text style={s.metaText}>{m.text}</Text>
            </React.Fragment>
          ))}
        </View>

        {/* Divider */}
        <View style={s.divider} />

        {/* Quick nav */}
        <View style={s.navRow}>
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
              style={s.navItem}
            >
              <View style={s.navCircle}>
                <Ionicons name={item.icon} size={18} color="#FFF" />
              </View>
              <Text style={s.navLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#08080A' },

  // Video
  videoWrap: { width: SCREEN_W, height: VIDEO_H, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },

  // Overlays
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  bufferText: { color: 'rgba(255,255,255,0.45)', fontFamily: hurme4.regular, fontSize: 11, marginTop: 8 },
  errorTitle: { color: 'rgba(255,255,255,0.8)', fontFamily: hurme4.semiBold, fontSize: 14, marginTop: 12, textAlign: 'center', paddingHorizontal: 30 },
  retryBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E31E24', borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 8, marginTop: 14,
  },
  retryText: { color: '#FFF', fontFamily: hurme4.semiBold, fontSize: 12 },

  // Controls
  controlsWrap: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'space-between',
  },
  controlsTop: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 4,
  },
  controlsBottom: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'flex-end', gap: 8,
    paddingHorizontal: 14, paddingBottom: 10,
  },
  glassBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  livePill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E31E24', borderRadius: 5,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF', marginRight: 5 },
  liveLabel: { color: '#FFF', fontFamily: hurme4.bold, fontSize: 10, letterSpacing: 1 },

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
    backgroundColor: 'rgba(227,30,36,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  channelName: { color: '#FFF', fontFamily: hurme4.bold, fontSize: 15 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  onAirPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E31E24', borderRadius: 3,
    paddingHorizontal: 5, paddingVertical: 1.5,
  },
  onAirDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FFF', marginRight: 3 },
  onAirLabel: { color: '#FFF', fontFamily: hurme4.bold, fontSize: 7, letterSpacing: 0.6 },
  channelSub: { color: 'rgba(255,255,255,0.35)', fontFamily: hurme4.regular, fontSize: 10, marginLeft: 6 },

  // Meta
  metaRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 18,
  },
  metaText: { color: 'rgba(255,255,255,0.35)', fontFamily: hurme4.regular, fontSize: 11, marginLeft: 4 },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: 10 },

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
