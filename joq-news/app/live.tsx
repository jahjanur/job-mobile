/**
 * Live TV screen — streams JOQ Albania live via HLS.
 * Full-screen video with controls, live badge, and back navigation.
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
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../src/theme';
import { hurme4 } from '../src/theme/typography';

const LIVE_STREAM_URL = 'https://live.tvanews.com/live/tvanews/play.m3u8';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_HEIGHT = (SCREEN_WIDTH * 9) / 16;

export default function LiveScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, spacing, radius, typography } = useTheme();
  const videoRef = useRef<Video>(null);

  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Live dot pulse
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(0.3, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  // Auto-hide controls after 4 seconds
  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 4000);
    return () => clearTimeout(timer);
  }, [showControls]);

  const handlePlaybackStatus = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        setHasError(true);
        setIsBuffering(false);
      }
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
      await videoRef.current?.loadAsync(
        { uri: LIVE_STREAM_URL },
        { shouldPlay: true },
      );
    } catch {
      setHasError(true);
    }
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: '#000' }]}>
      <StatusBar barStyle="light-content" />

      {/* Video player */}
      <View style={styles.videoContainer}>
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

        {/* Buffering indicator */}
        {isBuffering && !hasError && (
          <View style={styles.bufferOverlay}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={[typography.caption, { color: 'rgba(255,255,255,0.6)', marginTop: spacing.md }]}>
              Duke lidhur...
            </Text>
          </View>
        )}

        {/* Error state */}
        {hasError && (
          <View style={styles.bufferOverlay}>
            <Ionicons name="cloud-offline-outline" size={40} color="#FFF" />
            <Text style={[typography.bodySm, { color: '#FFF', marginTop: spacing.md }]}>
              Transmetimi nuk është i disponueshëm
            </Text>
            <TouchableOpacity
              onPress={handleRetry}
              activeOpacity={0.7}
              style={[
                styles.retryBtn,
                { backgroundColor: colors.accent, borderRadius: radius.md, marginTop: spacing.lg },
              ]}
            >
              <Ionicons name="refresh-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={[typography.captionMedium, { color: '#FFF' }]}>
                Provo përsëri
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tap to toggle controls */}
        <TouchableOpacity
          onPress={() => setShowControls(!showControls)}
          activeOpacity={1}
          style={StyleSheet.absoluteFill}
        />

        {/* Controls overlay */}
        {showControls && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={[styles.controlsOverlay, { paddingTop: insets.top }]}
            pointerEvents="box-none"
          >
            {/* Top bar */}
            <View style={[styles.topBar, { paddingHorizontal: spacing.lg }]}>
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.6}
                style={styles.controlBtn}
              >
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>

              {/* Live badge */}
              <View style={[styles.liveBadge, { borderRadius: radius.sm }]}>
                <Animated.View style={[styles.liveDot, dotStyle]} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>

              {/* Mute toggle */}
              <TouchableOpacity
                onPress={() => setIsMuted(!isMuted)}
                activeOpacity={0.6}
                style={styles.controlBtn}
              >
                <Ionicons
                  name={isMuted ? 'volume-mute-outline' : 'volume-high-outline'}
                  size={22}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </View>

      {/* Info section below video */}
      <View style={[styles.infoSection, { padding: spacing.lg }]}>
        <View style={styles.channelRow}>
          <View
            style={[
              styles.channelIcon,
              { backgroundColor: colors.accent + '20', borderRadius: radius.md },
            ]}
          >
            <Ionicons name="tv-outline" size={22} color={colors.accent} />
          </View>
          <View style={{ marginLeft: spacing.md, flex: 1 }}>
            <Text style={[typography.h3, { color: '#FFF' }]}>
              JOQ Albania
            </Text>
            <Text style={[typography.caption, { color: 'rgba(255,255,255,0.5)', marginTop: 2 }]}>
              Transmetim i drejtpërdrejtë 24/7
            </Text>
          </View>
          <View style={[styles.statusBadge, { borderRadius: radius.full }]}>
            <Animated.View style={[styles.statusDot, dotStyle]} />
            <Text style={[typography.label, { color: '#FFF', marginLeft: 4 }]}>
              ON AIR
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { marginVertical: spacing.xl }]} />

        {/* Quick nav */}
        <Text style={[typography.captionMedium, { color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5, marginBottom: spacing.lg }]}>
          SHFLETO GJITHASHTU
        </Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => { router.back(); router.navigate('/'); }}
            activeOpacity={0.7}
            style={styles.actionItem}
          >
            <View
              style={[styles.actionCircle, { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: radius.full }]}
            >
              <Ionicons name="home-outline" size={20} color="#FFF" />
            </View>
            <Text style={[typography.caption, { color: 'rgba(255,255,255,0.5)', marginTop: spacing.xs }]}>
              Ballina
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { router.back(); router.navigate('/categories'); }}
            activeOpacity={0.7}
            style={styles.actionItem}
          >
            <View
              style={[styles.actionCircle, { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: radius.full }]}
            >
              <Ionicons name="grid-outline" size={20} color="#FFF" />
            </View>
            <Text style={[typography.caption, { color: 'rgba(255,255,255,0.5)', marginTop: spacing.xs }]}>
              Tema
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { router.back(); router.navigate('/bookmarks'); }}
            activeOpacity={0.7}
            style={styles.actionItem}
          >
            <View
              style={[styles.actionCircle, { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: radius.full }]}
            >
              <Ionicons name="bookmark-outline" size={20} color="#FFF" />
            </View>
            <Text style={[typography.caption, { color: 'rgba(255,255,255,0.5)', marginTop: spacing.xs }]}>
              Ruajtur
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { router.back(); router.navigate('/search'); }}
            activeOpacity={0.7}
            style={styles.actionItem}
          >
            <View
              style={[styles.actionCircle, { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: radius.full }]}
            >
              <Ionicons name="search-outline" size={20} color="#FFF" />
            </View>
            <Text style={[typography.caption, { color: 'rgba(255,255,255,0.5)', marginTop: spacing.xs }]}>
              Kërko
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: VIDEO_HEIGHT,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  bufferOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  controlBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E31E24',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FFF',
    marginRight: 5,
  },
  liveText: {
    color: '#FFF',
    fontFamily: hurme4.bold,
    fontSize: 11,
    letterSpacing: 1,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  infoSection: {
    flex: 1,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E31E24',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFF',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionItem: {
    alignItems: 'center',
  },
  actionCircle: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
