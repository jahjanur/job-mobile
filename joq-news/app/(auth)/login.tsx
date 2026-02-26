/**
 * Login screen with social login (Google, Facebook) + email/password.
 */

import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthStore } from '../../src/store/authStore';
import { useTheme } from '../../src/theme';
import { signInWithEmail } from '../../src/services/authService';
import { AppLogo } from '../../src/components/ui/AppLogo';

export default function LoginScreen() {
  const { colors, spacing, radius, typography, dark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isLoading = useAuthStore((s) => s.isLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Gabim', 'Ju lutem plotësoni të gjitha fushat.');
      return;
    }
    try {
      await signInWithEmail(email.trim(), password);
      router.back();
    } catch (error: any) {
      const msg =
        error?.code === 'auth/invalid-credential'
          ? 'Email ose fjalëkalimi i gabuar.'
          : error?.code === 'auth/user-not-found'
            ? 'Nuk u gjet asnjë llogari me këtë email.'
            : 'Ndodhi një gabim. Provoni përsëri.';
      Alert.alert('Gabim', msg);
    }
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md + 2,
      ...typography.body,
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + spacing.xxxl,
            paddingHorizontal: spacing.xl,
            paddingBottom: insets.bottom + spacing.xxxl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back button */}
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { marginBottom: spacing.xxl }]}
          hitSlop={12}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </Pressable>

        {/* Logo + title */}
        <View style={{ alignItems: 'center', marginBottom: spacing.xxxl }}>
          <AppLogo width={100} />
          <Text
            style={[
              typography.h1,
              {
                color: colors.text,
                marginTop: spacing.xl,
                textAlign: 'center',
              },
            ]}
          >
            Mirë se vini
          </Text>
          <Text
            style={[
              typography.bodySm,
              {
                color: colors.textSecondary,
                marginTop: spacing.sm,
                textAlign: 'center',
              },
            ]}
          >
            Hyni në llogarinë tuaj ose krijoni një të re
          </Text>
        </View>

        {/* Social login buttons */}
        <Pressable
          style={[
            styles.socialBtn,
            {
              backgroundColor: '#FFFFFF',
              borderRadius: radius.md,
              paddingVertical: spacing.md + 2,
              marginBottom: spacing.md,
              borderWidth: 1,
              borderColor: '#E0E0E0',
            },
          ]}
        >
          <Feather
            name="chrome"
            size={20}
            color="#4285F4"
            style={{ marginRight: spacing.md }}
          />
          <Text style={[typography.bodyMedium, { color: '#333' }]}>
            Vazhdo me Google
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.socialBtn,
            {
              backgroundColor: '#1877F2',
              borderRadius: radius.md,
              paddingVertical: spacing.md + 2,
              marginBottom: spacing.xxl,
            },
          ]}
        >
          <Feather
            name="facebook"
            size={20}
            color="#FFFFFF"
            style={{ marginRight: spacing.md }}
          />
          <Text style={[typography.bodyMedium, { color: '#FFFFFF' }]}>
            Vazhdo me Facebook
          </Text>
        </Pressable>

        {/* Divider */}
        <View style={[styles.dividerRow, { marginBottom: spacing.xxl }]}>
          <View
            style={[styles.dividerLine, { backgroundColor: colors.border }]}
          />
          <Text
            style={[
              typography.caption,
              {
                color: colors.textTertiary,
                marginHorizontal: spacing.lg,
              },
            ]}
          >
            ose
          </Text>
          <View
            style={[styles.dividerLine, { backgroundColor: colors.border }]}
          />
        </View>

        {/* Email / Password form */}
        <Text
          style={[
            typography.label,
            {
              color: colors.textSecondary,
              marginBottom: spacing.sm,
              letterSpacing: 0.5,
            },
          ]}
        >
          EMAIL
        </Text>
        <TextInput
          style={inputStyle}
          value={email}
          onChangeText={setEmail}
          placeholder="email@shembull.com"
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
        />

        <Text
          style={[
            typography.label,
            {
              color: colors.textSecondary,
              marginBottom: spacing.sm,
              marginTop: spacing.lg,
              letterSpacing: 0.5,
            },
          ]}
        >
          FJALËKALIMI
        </Text>
        <View>
          <TextInput
            style={inputStyle}
            value={password}
            onChangeText={setPassword}
            placeholder="Shkruani fjalëkalimin"
            placeholderTextColor={colors.textTertiary}
            secureTextEntry={!showPassword}
            textContentType="password"
            autoComplete="password"
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={[styles.eyeBtn, { right: spacing.lg }]}
            hitSlop={8}
          >
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={18}
              color={colors.textTertiary}
            />
          </Pressable>
        </View>

        {/* Forgot password */}
        <Pressable
          onPress={() => router.push('/(auth)/forgot-password')}
          style={{ alignSelf: 'flex-end', marginTop: spacing.md }}
        >
          <Text
            style={[typography.captionMedium, { color: colors.accent }]}
          >
            Harrove fjalëkalimin?
          </Text>
        </Pressable>

        {/* Login button */}
        <Pressable
          onPress={handleEmailLogin}
          disabled={isLoading}
          style={[
            styles.primaryBtn,
            {
              backgroundColor: colors.accent,
              borderRadius: radius.md,
              paddingVertical: spacing.md + 4,
              marginTop: spacing.xxl,
              opacity: isLoading ? 0.6 : 1,
            },
          ]}
        >
          <Text
            style={[
              typography.bodyMedium,
              { color: '#FFFFFF', textAlign: 'center' },
            ]}
          >
            {isLoading ? 'Duke hyrë...' : 'Hyr'}
          </Text>
        </Pressable>

        {/* Register link */}
        <View
          style={[
            styles.switchRow,
            { marginTop: spacing.xxl },
          ]}
        >
          <Text
            style={[typography.bodySm, { color: colors.textSecondary }]}
          >
            Nuk ke llogari?{' '}
          </Text>
          <Pressable onPress={() => router.replace('/(auth)/register')}>
            <Text
              style={[
                typography.bodyMedium,
                { color: colors.accent, fontSize: 14 },
              ]}
            >
              Regjistrohu
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1 },
  backBtn: { alignSelf: 'flex-start' },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  input: {
    fontSize: 16,
  },
  eyeBtn: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  primaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
