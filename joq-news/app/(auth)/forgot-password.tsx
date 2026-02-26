/**
 * Forgot password screen — sends a reset link via Firebase Auth.
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

import { useTheme } from '../../src/theme';
import { resetPassword } from '../../src/services/authService';

export default function ForgotPasswordScreen() {
  const { colors, spacing, radius, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert('Gabim', 'Ju lutem shkruani email-in tuaj.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch {
      Alert.alert('Gabim', 'Ndodhi një gabim. Kontrolloni email-in dhe provoni përsëri.');
    } finally {
      setLoading(false);
    }
  };

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

        {sent ? (
          /* Success state */
          <View style={{ alignItems: 'center', marginTop: spacing.xxxl }}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: colors.accent + '15',
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  marginBottom: spacing.xl,
                },
              ]}
            >
              <Feather name="check" size={28} color={colors.accent} />
            </View>
            <Text
              style={[
                typography.h2,
                { color: colors.text, textAlign: 'center' },
              ]}
            >
              Email u dërgua!
            </Text>
            <Text
              style={[
                typography.bodySm,
                {
                  color: colors.textSecondary,
                  textAlign: 'center',
                  marginTop: spacing.md,
                  maxWidth: 280,
                },
              ]}
            >
              Kontrolloni kutinë tuaj postare për lidhjen e rivendosjes së fjalëkalimit.
            </Text>
            <Pressable
              onPress={() => router.back()}
              style={[
                styles.primaryBtn,
                {
                  backgroundColor: colors.accent,
                  borderRadius: radius.md,
                  paddingVertical: spacing.md + 4,
                  paddingHorizontal: spacing.xxxl,
                  marginTop: spacing.xxl,
                },
              ]}
            >
              <Text
                style={[
                  typography.bodyMedium,
                  { color: '#FFFFFF' },
                ]}
              >
                Kthehu te hyrja
              </Text>
            </Pressable>
          </View>
        ) : (
          /* Input state */
          <>
            <Text
              style={[
                typography.h1,
                { color: colors.text, marginBottom: spacing.sm },
              ]}
            >
              Harrove fjalëkalimin?
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
              Shkruani email-in dhe do t'ju dërgojmë një lidhje për rivendosjen e fjalëkalimit.
            </Text>

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
              style={[
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
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="email@shembull.com"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
            />

            <Pressable
              onPress={handleSend}
              disabled={loading}
              style={[
                styles.primaryBtn,
                {
                  backgroundColor: colors.accent,
                  borderRadius: radius.md,
                  paddingVertical: spacing.md + 4,
                  marginTop: spacing.xxl,
                  opacity: loading ? 0.6 : 1,
                },
              ]}
            >
              <Text
                style={[
                  typography.bodyMedium,
                  { color: '#FFFFFF', textAlign: 'center' },
                ]}
              >
                {loading ? 'Duke dërguar...' : 'Dërgo lidhjen'}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1 },
  backBtn: { alignSelf: 'flex-start' },
  input: { fontSize: 16 },
  iconCircle: { alignItems: 'center', justifyContent: 'center' },
  primaryBtn: { alignItems: 'center', justifyContent: 'center' },
});
