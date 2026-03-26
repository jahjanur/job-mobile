/**
 * Live TV — immersive streaming experience for JOQ Albania.
 * Fullscreen toggle, animated controls, waveform visualizer,
 * and elegant channel info.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Audio, ResizeMode, Video, type AVPlaybackStatus } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { hurme4 } from '../src/theme/typography';

const LIVE_STREAM_URL = 'https://live.tvanews.com/live/tvanews/play.m3u8';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const VIDEO_HEIGHT = (SCREEN_WIDTH * 9) / 16;

const LOGO_PATHS = [
  'M258,16.1c21,9.5,30.9,33.7,23.8,55.6c-0.8,2.5-1.7,5-2.8,7.5c-3.9,9.2-1.4,15.4,8.2,17.2c4,0.8,6.5,2.8,5.8,6.8c-0.7,4.1-3.9,5.1-7.8,4.8c-15.4-1.2-24.6-17.9-17.4-32.1c3.9-7.7,6.2-15.4,4.7-24c-3.4-18.7-20.8-30.9-39.3-27.6c-18.4,3.3-30.5,20.8-27.3,39.6c3.1,17.9,20.7,30,39.3,27c2.1-0.3,4.8-0.8,6.5,0.2c1.6,0.9,3.5,4.2,2.9,5.3c-1.2,2.3-3.7,5.1-6,5.6c-15.5,3.2-29.4-0.7-41-11.6c-15-14.1-18.4-36.8-8.4-54.7c10.2-18.3,31.3-27.3,51.5-21.9C253.3,14.2,255.7,15,258,16.1z',
  'M142.1,12c25.2,0.1,45.6,20.6,45.5,45.7c-0.1,25-21,45.5-46,45.2c-25.2-0.3-45.4-20.8-45.2-46C96.6,32.2,117.2,11.9,142.1,12z M141.7,91.1c19,0.1,34.2-14.8,34.2-33.6c0-18.5-15-33.6-33.6-33.8c-18.8-0.2-34.1,14.9-34.1,33.7C108.1,76,123,91,141.7,91.1z',
  'M78.9,23.7c-4.3,0-8.1,0-11.8,0c-4,0-6.9-1.6-7-5.8c-0.1-4.1,2.8-5.9,6.8-6c5.7-0.1,11.4-0.1,17.1,0c4.3,0.1,6.7,2.4,6.6,6.8c0,14,0.4,28.1-0.2,42C89.6,79.2,76.1,95.5,58.3,101c-17.6,5.4-37.3-0.7-48.7-15c-2.6-3.3-4.5-6.6-0.5-9.9c3.9-3.2,6.8-0.8,9.6,2.5c10,11.6,24.4,15.6,38,10.6c13.6-5,22.1-17.3,22.2-32.5C79,45.9,78.9,35.1,78.9,23.7z',
];

/** Animated equalizer bars for the "ON AIR" section */
function EqualizerBars({ color }: { color: string }) {
  const bar1 = useSharedValue(0.4);
  const bar2 = useSharedValue(0.7);
  const bar3 = useSharedValue(0.5);
  const bar4 = useSharedValue(0.8);
  const bar5 = useSharedValue(0.3);

  useEffect(() => {
    const animate = (sv: { value: number }, min: number, max: number, dur: number) => {
      sv.value = withRepeat(
        withSequence(
          withTiming(max, { duration: dur }),
          withTiming(min, { duration: dur }),
        ),
        -1,
      );
    };
    animate(bar1, 0.2, 0.9, 400);
    animate(bar2, 0.3, 1.0, 350);
    animate(bar3, 0.15, 0.85, 450);
    animate(bar4, 0.25, 0.95, 380);
    animate(bar5, 0.2, 0.8, 420);
  }, []);

  const bars = [bar1, bar2, bar3, bar4, bar5];

  return (
    <View style={eqStyles.container}>
      {bars.map((b, i) => {
        const style = useAnimatedStyle(() => ({
          height: b.value * 18,
        }));
        return (
          <Animated.View
            key={i}
            style={[eqStyles.bar, { backgroundColor: color }, style]}
          />
        );
      })}
    </View>
  );
}

const eqStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', height: 18, gap: 2 },
  bar: { width: 3, borderRadius: 1.5 },
});

export default function LiveScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const videoRef = useRef<Video>(null);

  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Animations
  const pulse = useSharedValue(1);
  const glowScale = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(0.3, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
  }, []);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  const dotStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));
  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: 0.15,
  }));

  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 4000);
    return () => clearTimeout(timer);
  }, [showControls]);

  const handlePlaybackStatus = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) { setHasError(true); setIsBuffering(false); }
      return;
    }
    setIsBuffering(status.isBuffering);
    setHasError(false);
  }, []);

  const handleRetry = useCallback(async () => {
    setHasError(false);
    setIsBuffering(true);
    try {
      await videoRef.current?.unloadAsync();
      await videoRef.current?.loadAsync({ uri: LIVE_STREAM_URL }, { shouldPlay: true });
    } catch { setHasError(true); }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const videoContainerStyle = isFullscreen
    ? { width: SCREEN_HEIGHT, height: SCREEN_WIDTH, backgroundColor: '#000' }
    : styles.videoContainer;

  return (
    <View style={styles.screen}>
      <StatusBar hidden={isFullscreen} barStyle="light-content" />

      {/* ── Video ─────────────────────────────────── */}
      <View style={videoContainerStyle}>
        <Video
          ref={videoRef}
          source={{ uri: LIVE_STREAM_URL }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isMuted={isMuted}
          isLooping={false}
          onPlaybackStatusUpdate={handlePlaybackStatus}
          onError={() => setHasError(true)}
        />

        {/* Buffering */}
        {isBuffering && !hasError && (
          <Animated.View entering={FadeIn} style={styles.bufferOverlay}>
            <Svg width={60} height={24} viewBox="0 0 300 120" style={{ marginBottom: 16 }}>
              {LOGO_PATHS.map((d, i) => (
                <Path key={i} d={d} fill="rgba(255,255,255,0.8)" />
              ))}
            </Svg>
            <ActivityIndicator size="small" color="#FFF" />
            <Text style={styles.bufferText}>Duke lidhur transmetimin...</Text>
          </Animated.View>
        )}

        {/* Error */}
        {hasError && (
          <Animated.View entering={FadeIn} style={styles.bufferOverlay}>
            <Ionicons name="cloud-offline-outline" size={44} color="rgba(255,255,255,0.8)" />
            <Text style={styles.errorTitle}>Transmetimi nuk u gjet</Text>
            <Text style={styles.errorSub}>Kontrolloni lidhjen tuaj të internetit</Text>
            <TouchableOpacity onPress={handleRetry} activeOpacity={0.7} style={styles.retryBtn}>
              <Ionicons name="refresh-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.retryText}>Provo përsëri</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Tap zone */}
        <TouchableOpacity
          onPress={() => setShowControls(!showControls)}
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
        />

        {/* Controls */}
        {showControls && (
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
            style={[styles.controlsOverlay, { paddingTop: insets.top + 4 }]}
            pointerEvents="box-none"
          >
            <View style={styles.topControls}>
              <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6} style={styles.glassBtn}>
                <Ionicons name="chevron-down" size={22} color="#FFF" />
              </TouchableOpacity>

              <View style={styles.liveBadge}>
                <Animated.View style={[styles.liveDot, dotStyle]} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>

              <View style={styles.rightControls}>
                <TouchableOpacity onPress={() => setIsMuted(!isMuted)} activeOpacity={0.6} style={styles.glassBtn}>
                  <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={20} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleFullscreen} activeOpacity={0.6} style={[styles.glassBtn, { marginLeft: 8 }]}>
                  <Ionicons name={isFullscreen ? 'contract-outline' : 'expand-outline'} size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
      </View>

      {/* ── Info panel (hidden in fullscreen) ─────── */}
      {!isFullscreen && (
        <Animated.View entering={SlideInDown.duration(400)} style={styles.infoPanel}>
          {/* Glow background */}
          <Animated.View style={[styles.glow, glowStyle]} />

          {/* Channel card */}
          <View style={styles.channelCard}>
            <View style={styles.logoBox}>
              <Svg width={50} height={20} viewBox="0 0 300 120">
                {LOGO_PATHS.map((d, i) => (
                  <Path key={i} d={d} fill="#FFF" />
                ))}
              </Svg>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.channelName}>JOQ Albania</Text>
              <View style={styles.statusRow}>
                <View style={styles.onAirBadge}>
                  <Animated.View style={[styles.onAirDot, dotStyle]} />
                  <Text style={styles.onAirText}>ON AIR</Text>
                </View>
                <Text style={styles.channelSub}>24/7 Live</Text>
              </View>
            </View>
            <EqualizerBars color="#E31E24" />
          </View>

          {/* Divider */}
          <View style={styles.infoDivider} />

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={18} color="rgba(255,255,255,0.5)" />
              <Text style={styles.statLabel}>Drejtpërdrejtë</Text>
            </View>
            <View style={styles.statDot} />
            <View style={styles.statItem}>
              <Ionicons name="globe-outline" size={18} color="rgba(255,255,255,0.5)" />
              <Text style={styles.statLabel}>Shqipëri</Text>
            </View>
            <View style={styles.statDot} />
            <View style={styles.statItem}>
              <Ionicons name="language-outline" size={18} color="rgba(255,255,255,0.5)" />
              <Text style={styles.statLabel}>Shqip</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.infoDivider} />

          {/* Quick actions */}
          <View style={styles.actionsRow}>
            {[
              { icon: 'home-outline' as const, label: 'Ballina', tab: '/' },
              { icon: 'flame-outline' as const, label: 'Ekskluzive', tab: '/categories' },
              { icon: 'search-outline' as const, label: 'Kërko', tab: '/search' },
              { icon: 'bookmark-outline' as const, label: 'Ruajtur', tab: '/bookmarks' },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={() => { router.back(); router.navigate(item.tab); }}
                activeOpacity={0.7}
                style={styles.actionItem}
              >
                <View style={styles.actionCircle}>
                  <Ionicons name={item.icon} size={20} color="#FFF" />
                </View>
                <Text style={styles.actionLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0A0A0A' },

  // Video
  videoContainer: { width: SCREEN_WIDTH, height: VIDEO_HEIGHT, backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },

  // Buffering / Error
  bufferOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  bufferText: {
    color: 'rgba(255,255,255,0.5)', fontFamily: hurme4.regular,
    fontSize: 12, marginTop: 10,
  },
  errorTitle: {
    color: '#FFF', fontFamily: hurme4.semiBold, fontSize: 16, marginTop: 14,
  },
  errorSub: {
    color: 'rgba(255,255,255,0.5)', fontFamily: hurme4.regular,
    fontSize: 13, marginTop: 4,
  },
  retryBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E31E24', borderRadius: 10,
    paddingHorizontal: 18, paddingVertical: 10, marginTop: 18,
  },
  retryText: { color: '#FFF', fontFamily: hurme4.semiBold, fontSize: 13 },

  // Controls
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topControls: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 6,
  },
  rightControls: { flexDirection: 'row', alignItems: 'center' },
  glassBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E31E24', borderRadius: 6,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  liveDot: {
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: '#FFF', marginRight: 6,
  },
  liveText: {
    color: '#FFF', fontFamily: hurme4.bold,
    fontSize: 11, letterSpacing: 1.2,
  },

  // Info panel
  infoPanel: {
    flex: 1, paddingHorizontal: 20, paddingTop: 24,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute', top: -60, left: '30%',
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: '#E31E24',
  },

  // Channel
  channelCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  logoBox: {
    width: 56, height: 56, borderRadius: 14,
    backgroundColor: 'rgba(227,30,36,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  channelName: {
    color: '#FFF', fontFamily: hurme4.bold, fontSize: 17,
  },
  statusRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 4,
  },
  onAirBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E31E24', borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  onAirDot: {
    width: 5, height: 5, borderRadius: 2.5,
    backgroundColor: '#FFF', marginRight: 4,
  },
  onAirText: {
    color: '#FFF', fontFamily: hurme4.bold, fontSize: 8, letterSpacing: 0.8,
  },
  channelSub: {
    color: 'rgba(255,255,255,0.4)', fontFamily: hurme4.regular,
    fontSize: 11, marginLeft: 8,
  },

  // Stats
  infoDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 20,
  },
  statsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  statItem: {
    flexDirection: 'row', alignItems: 'center',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)', fontFamily: hurme4.regular,
    fontSize: 12, marginLeft: 6,
  },
  statDot: {
    width: 3, height: 3, borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 14,
  },

  // Actions
  actionsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
  },
  actionItem: { alignItems: 'center' },
  actionCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: {
    color: 'rgba(255,255,255,0.45)', fontFamily: hurme4.regular,
    fontSize: 11, marginTop: 8,
  },
});
