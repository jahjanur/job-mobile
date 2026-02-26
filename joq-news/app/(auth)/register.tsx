/**
 * Registration screen with email/password.
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
import { signUpWithEmail } from '../../src/services/authService';

export default function RegisterScreen() {
  const { colors, spacing, radius, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isLoading = useAuthStore((s) => s.isLoading);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Gabim', 'Ju lutem plotësoni email dhe fjalëkalimin.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Gabim', 'Fjalëkalimi duhet të ketë së paku 6 karaktere.');
      return;
    }
    try {
      await signUpWithEmail(email.trim(), password, name.trim() || undefined);
      router.back();
      router.back();
    } catch (error: any) {
      const msg =
        error?.code === 'auth/email-already-in-use'
          ? 'Ky email është tashmë i regjistruar.'
          : error?.code === 'auth/weak-password'
            ? 'Fjalëkalimi është shumë i dobët.'
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

        {/* Title */}
        <Text
          style={[
            typography.h1,
            { color: colors.text, marginBottom: spacing.sm },
          ]}
        >
          Krijo llogari
        </Text>
        <Text
          style={[
            typography.bodySm,
            {
              color: colors.textSecondary,
              marginBottom: spacing.xxxl,
            },
          ]}
        >
          Regjistrohu për të ruajtur artikujt dhe personalizuar përvojën
        </Text>

        {/* Name */}
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
          EMRI (OPSIONAL)
        </Text>
        <TextInput
          style={inputStyle}
          value={name}
          onChangeText={setName}
          placeholder="Emri juaj"
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="words"
          textContentType="name"
          autoComplete="name"
        />

        {/* Email */}
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

        {/* Password */}
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
            placeholder="Së paku 6 karaktere"
            placeholderTextColor={colors.textTertiary}
            secureTextEntry={!showPassword}
            textContentType="newPassword"
            autoComplete="new-password"
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

        {/* Register button */}
        <Pressable
          onPress={handleRegister}
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
            {isLoading ? 'Duke u regjistruar...' : 'Regjistrohu'}
          </Text>
        </Pressable>

        {/* Login link */}
        <View style={[styles.switchRow, { marginTop: spacing.xxl }]}>
          <Text
            style={[typography.bodySm, { color: colors.textSecondary }]}
          >
            Ke tashmë një llogari?{' '}
          </Text>
          <Pressable onPress={() => router.replace('/(auth)/login')}>
            <Text
              style={[
                typography.bodyMedium,
                { color: colors.accent, fontSize: 14 },
              ]}
            >
              Hyr
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
  input: { fontSize: 16 },
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
