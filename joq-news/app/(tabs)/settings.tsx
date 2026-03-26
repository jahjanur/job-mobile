/**
 * Settings screen — full-featured premium design.
 * Sections: Appearance, Notifications, Privacy, Help, Share, About.
 * All text in Albanian. Development company: Zulbera.
 */

import React from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';

import { AppLogo } from '../../src/components/ui/AppLogo';
import { Config } from '../../src/constants/config';
import { useBookmarksStore } from '../../src/store/bookmarksStore';
import { useSubscriptionStore } from '../../src/store/subscriptionStore';
import {
  type NotificationCategory,
  usePreferencesStore,
} from '../../src/store/preferencesStore';
import { type ThemeMode, useTheme } from '../../src/theme';
import type { FontSize } from '../../src/theme/typography';

type IonIcon = ComponentProps<typeof Ionicons>['name'];

/* ────────────────────────────────────────────── */
/*  Options                                        */
/* ────────────────────────────────────────────── */

const THEME_OPTIONS: { label: string; value: ThemeMode; icon: IonIcon }[] = [
  { label: 'Dritë', value: 'light', icon: 'sunny-outline' },
  { label: 'Errët', value: 'dark', icon: 'moon-outline' },
  { label: 'Sistem', value: 'system', icon: 'phone-portrait-outline' },
];

const FONT_OPTIONS: { label: string; value: FontSize }[] = [
  { label: 'Vogël', value: 'small' },
  { label: 'Mesatar', value: 'medium' },
  { label: 'Madh', value: 'large' },
];

const NOTIF_CATEGORIES: {
  key: NotificationCategory;
  label: string;
  icon: IonIcon;
}[] = [
  { key: 'breakingNews', label: 'Lajme urgjente', icon: 'alert-circle-outline' },
  { key: 'politike', label: 'Politikë', icon: 'flag-outline' },
  { key: 'sport', label: 'Sport', icon: 'football-outline' },
  { key: 'argetim', label: 'Argëtim & Showbiz', icon: 'film-outline' },
  { key: 'importantOnly', label: 'Vetëm alarme të rëndësishme', icon: 'notifications-outline' },
];

const SOCIAL_LINKS: { label: string; icon: IonIcon; url: string }[] = [
  { label: 'Instagram', icon: 'logo-instagram', url: 'https://instagram.com/joqalbania' },
  { label: 'Facebook', icon: 'logo-facebook', url: 'https://facebook.com/joqalbania' },
  { label: 'Faqja e internetit', icon: 'globe-outline', url: 'https://joq-albania.com' },
];

/* ────────────────────────────────────────────── */
/*  Reusable Components                            */
/* ────────────────────────────────────────────── */

function SegmentedControl<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: { label: string; value: T; icon?: IonIcon }[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  const { colors, spacing, radius, typography } = useTheme();
  return (
    <View
      style={[
        styles.segment,
        { backgroundColor: colors.surface, borderRadius: radius.md, padding: 3 },
      ]}
    >
      {options.map((opt) => {
        const active = opt.value === selected;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            style={[
              styles.segmentItem,
              {
                backgroundColor: active ? colors.surfaceElevated : 'transparent',
                borderRadius: radius.sm,
                paddingVertical: spacing.sm,
              },
            ]}
          >
            {opt.icon && (
              <Ionicons
                name={opt.icon}
                size={14}
                color={active ? colors.text : colors.textTertiary}
                style={{ marginBottom: 2 }}
              />
            )}
            <Text
              style={[
                typography.captionMedium,
                {
                  color: active ? colors.text : colors.textTertiary,
                  marginTop: opt.icon ? 2 : 0,
                },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SectionLabel({ text }: { text: string }) {
  const { colors, spacing, typography } = useTheme();
  return (
    <Text
      style={[
        typography.label,
        {
          color: colors.textTertiary,
          marginTop: spacing.xxxl,
          marginBottom: spacing.sm,
          letterSpacing: 0.5,
        },
      ]}
    >
      {text}
    </Text>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  const { colors, spacing, radius, dark } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: radius.lg,
          paddingHorizontal: spacing.lg,
          borderWidth: dark ? 0 : StyleSheet.hairlineWidth,
          borderColor: colors.borderLight,
        },
      ]}
    >
      {children}
    </View>
  );
}

function SettingRow({
  label,
  icon,
  children,
  isLast,
}: {
  label: string;
  icon: IonIcon;
  children: React.ReactNode;
  isLast?: boolean;
}) {
  const { colors, spacing, typography } = useTheme();
  return (
    <View
      style={[
        styles.row,
        {
          paddingVertical: spacing.lg,
          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
          borderBottomColor: colors.borderLight,
        },
      ]}
    >
      <View style={styles.rowLabel}>
        <Ionicons
          name={icon}
          size={18}
          color={colors.textSecondary}
          style={{ marginRight: spacing.md }}
        />
        <Text style={[typography.bodyMedium, { color: colors.text, flex: 1 }]}>
          {label}
        </Text>
      </View>
      {children}
    </View>
  );
}

function LinkRow({
  label,
  icon,
  onPress,
  isLast,
}: {
  label: string;
  icon: IonIcon;
  onPress: () => void;
  isLast?: boolean;
}) {
  const { colors, spacing, typography } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.row,
        {
          paddingVertical: spacing.lg,
          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
          borderBottomColor: colors.borderLight,
        },
      ]}
    >
      <View style={styles.rowLabel}>
        <Ionicons
          name={icon}
          size={18}
          color={colors.textSecondary}
          style={{ marginRight: spacing.md }}
        />
        <Text style={[typography.bodyMedium, { color: colors.text, flex: 1 }]}>
          {label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </Pressable>
  );
}

function InfoRow({
  label,
  value,
  icon,
  isLast,
}: {
  label: string;
  value: string;
  icon: IonIcon;
  isLast?: boolean;
}) {
  const { colors, spacing, typography } = useTheme();
  return (
    <View
      style={[
        styles.row,
        {
          paddingVertical: spacing.lg,
          borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
          borderBottomColor: colors.borderLight,
        },
      ]}
    >
      <View style={styles.rowLabel}>
        <Ionicons
          name={icon}
          size={18}
          color={colors.textSecondary}
          style={{ marginRight: spacing.md }}
        />
        <Text style={[typography.bodyMedium, { color: colors.text, flex: 1 }]}>
          {label}
        </Text>
      </View>
      <Text style={[typography.bodySm, { color: colors.textTertiary }]}>
        {value}
      </Text>
    </View>
  );
}

/* ────────────────────────────────────────────── */
/*  Main Screen                                    */
/* ────────────────────────────────────────────── */

export default function SettingsScreen() {
  const { colors, spacing, typography, radius, dark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const subscriptionEmail = useSubscriptionStore((s) => s.email);
  const isSubscribed = useSubscriptionStore((s) => s.isSubscribed);
  const unsubscribe = useSubscriptionStore((s) => s.unsubscribe);

  const themeMode = usePreferencesStore((s) => s.themeMode);
  const fontSize = usePreferencesStore((s) => s.fontSize);
  const reduceMotion = usePreferencesStore((s) => s.reduceMotion);
  const hapticFeedback = usePreferencesStore((s) => s.hapticFeedback);
  const notificationsEnabled = usePreferencesStore((s) => s.notificationsEnabled);
  const notifCategories = usePreferencesStore((s) => s.notificationCategories);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);
  const setFontSize = usePreferencesStore((s) => s.setFontSize);
  const setReduceMotion = usePreferencesStore((s) => s.setReduceMotion);
  const setHapticFeedback = usePreferencesStore((s) => s.setHapticFeedback);
  const setNotificationsEnabled = usePreferencesStore((s) => s.setNotificationsEnabled);
  const toggleNotifCategory = usePreferencesStore((s) => s.toggleNotificationCategory);
  const bookmarkCount = useBookmarksStore((s) => s.bookmarks.length);

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: Platform.select({
          ios: 'Shiko JOQ News — lajmet më të fundit në shqip! https://joq-albania.com/app',
          default: 'Shiko JOQ News — lajmet më të fundit në shqip! https://joq-albania.com/app',
        }),
      });
    } catch {
      // user cancelled
    }
  };

  const handleContact = () => {
    Linking.openURL('mailto:info@joq-albania.com?subject=Kontakt nga JOQ News App');
  };

  const handleReportProblem = () => {
    Linking.openURL('mailto:support@joq-albania.com?subject=Raport problemi - JOQ News App');
  };

  const handleReportNews = () => {
    Alert.alert(
      'Raporto lajm të pasaktë',
      'Nëse keni vërejtur një lajm të pasaktë ose të rremë, ju lutem na kontaktoni në info@joq-albania.com me detajet e artikullit.',
      [
        { text: 'Anulo', style: 'cancel' },
        {
          text: 'Dërgo email',
          onPress: () =>
            Linking.openURL('mailto:info@joq-albania.com?subject=Raport lajmi - JOQ News'),
        },
      ],
    );
  };

  const openLink = (url: string) => Linking.openURL(url);

  const switchColors = {
    false: colors.border,
    true: colors.accent,
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.massive + 40,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ────────────────────────────── */}
      <Text
        style={[
          typography.h1,
          {
            color: colors.text,
            fontSize: 26,
            letterSpacing: -0.5,
            fontWeight: '800',
          },
        ]}
      >
        Cilësimet
      </Text>
      <Text
        style={[
          typography.bodySm,
          { color: colors.textSecondary, marginTop: spacing.xs },
        ]}
      >
        Personalizo përvojën tënde të leximit
      </Text>

      {/* ═══════════════════════════════════════ */}
      {/*  1. PAMJA (Appearance)                  */}
      {/* ═══════════════════════════════════════ */}
      <SectionLabel text="PAMJA" />
      <Card>
        <SettingRow label="Tema" icon="eye-outline">
          <SegmentedControl
            options={THEME_OPTIONS}
            selected={themeMode}
            onSelect={setThemeMode}
          />
        </SettingRow>
        <SettingRow label="Madhësia e shkronjave" icon="text-outline">
          <SegmentedControl
            options={FONT_OPTIONS}
            selected={fontSize}
            onSelect={setFontSize}
          />
        </SettingRow>
        {/* Live font preview */}
        <View
          style={{
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.sm,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: colors.borderLight,
          }}
        >
          <Text
            style={[
              typography.bodySm,
              { color: colors.textTertiary, marginBottom: spacing.xs },
            ]}
          >
            Parashikim:
          </Text>
          <Text
            style={[
              typography.body,
              { color: colors.text, lineHeight: typography.body.lineHeight * 1.3 },
            ]}
          >
            Kjo është madhësia aktuale e shkronjave për tekstin e artikujve.
          </Text>
        </View>
        <SettingRow label="Redukto animacionet" icon="contract-outline">
          <Switch
            value={reduceMotion}
            onValueChange={setReduceMotion}
            trackColor={switchColors}
            thumbColor="#FFFFFF"
          />
        </SettingRow>
        {reduceMotion && (
          <View
            style={{
              paddingHorizontal: spacing.sm,
              paddingBottom: spacing.md,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: colors.borderLight,
            }}
          >
            <Text style={[typography.caption, { color: colors.textTertiary }]}>
              Caktivizon efektet e shkallezimit kur shtypni kartat e artikujve.
            </Text>
          </View>
        )}
        <SettingRow label="Dridhje kur shtypni" icon="phone-portrait-outline" isLast>
          <Switch
            value={hapticFeedback}
            onValueChange={(val) => {
              setHapticFeedback(val);
              if (val) {
                // Fire a strong test vibration so user feels it works
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
            }}
            trackColor={switchColors}
            thumbColor="#FFFFFF"
          />
        </SettingRow>
        {!hapticFeedback && (
          <View style={{ paddingHorizontal: spacing.sm, paddingBottom: spacing.md }}>
            <Text style={[typography.caption, { color: colors.textTertiary }]}>
              Telefoni nuk do te dridhej kur ruani ose ndani artikuj.
            </Text>
          </View>
        )}
      </Card>

      {/* ═══════════════════════════════════════ */}
      {/*  2. NJOFTIMET (Notifications)           */}
      {/* ═══════════════════════════════════════ */}
      <SectionLabel text="NJOFTIMET" />
      <Card>
        <SettingRow label="Njoftimet Push" icon="notifications-outline">
          <Switch
            value={notificationsEnabled}
            onValueChange={async (enabled) => {
              if (enabled) {
                const { registerForPushNotifications } = await import(
                  '../../src/services/notifications'
                );
                const token = await registerForPushNotifications();
                if (!token) {
                  Alert.alert(
                    'Lejet',
                    'Ju duhet të lejoni njoftimet në cilësimet e pajisjes.',
                  );
                  return;
                }
              }
              setNotificationsEnabled(enabled);
            }}
            trackColor={switchColors}
            thumbColor="#FFFFFF"
          />
        </SettingRow>
        {notificationsEnabled &&
          NOTIF_CATEGORIES.map((cat, i) => (
            <SettingRow
              key={cat.key}
              label={cat.label}
              icon={cat.icon}
              isLast={i === NOTIF_CATEGORIES.length - 1}
            >
              <Switch
                value={notifCategories[cat.key]}
                onValueChange={() => toggleNotifCategory(cat.key)}
                trackColor={switchColors}
                thumbColor="#FFFFFF"
              />
            </SettingRow>
          ))}
      </Card>

      {/* ═══════════════════════════════════════ */}
      {/*  2b. ABONIMI ME EMAIL                    */}
      {/* ═══════════════════════════════════════ */}
      <SectionLabel text="ABONIMI ME EMAIL" />
      <Card>
        {isSubscribed && subscriptionEmail ? (
          <>
            <InfoRow label="Email" value={subscriptionEmail} icon="mail-outline" />
            <LinkRow
              label="Anullo abonimin"
              icon="close-circle-outline"
              onPress={() => {
                Alert.alert(
                  'Anullo abonimin',
                  'Jeni i sigurt që dëshironi të anuloni abonimin me email?',
                  [
                    { text: 'Jo', style: 'cancel' },
                    { text: 'Po', onPress: unsubscribe },
                  ],
                );
              }}
              isLast
            />
          </>
        ) : (
          <LinkRow
            label="Abonohu për lajme me email"
            icon="mail-outline"
            onPress={() => {
              Alert.prompt?.(
                'Abonohu me email',
                'Shkruani email-in tuaj për të marrë lajmet më të fundit.',
                [
                  { text: 'Anulo', style: 'cancel' },
                  {
                    text: 'Abonohu',
                    onPress: (emailInput: string | undefined) => {
                      if (emailInput?.trim()) {
                        const { subscribe } = useSubscriptionStore.getState();
                        subscribe(emailInput.trim(), []);
                        Alert.alert('Sukses', 'U abonuat me sukses!');
                      }
                    },
                  },
                ],
                'plain-text',
                '',
                'email-address',
              ) ??
                Alert.alert(
                  'Abonohu',
                  'Funksioni i abonimit do të jetë i disponueshëm së shpejti.',
                );
            }}
            isLast
          />
        )}
      </Card>

      {/* ═══════════════════════════════════════ */}
      {/*  3. PRIVATËSIA DHE LIGJI               */}
      {/* ═══════════════════════════════════════ */}
      <SectionLabel text="PRIVATËSIA DHE LIGJI" />
      <Card>
        <LinkRow
          label="Politika e privatësisë"
          icon="shield-outline"
          onPress={() => openLink('https://joq-albania.com/privacy')}
        />
        <LinkRow
          label="Kushtet e përdorimit"
          icon="document-text-outline"
          onPress={() => openLink('https://joq-albania.com/terms')}
        />
        <LinkRow
          label="Njoftim për të dhënat"
          icon="server-outline"
          onPress={() => openLink('https://joq-albania.com/data')}
        />
        <LinkRow
          label="Lejet e aplikacionit"
          icon="lock-closed-outline"
          onPress={() => Linking.openSettings()}
          isLast
        />
      </Card>

      {/* ═══════════════════════════════════════ */}
      {/*  4. NDIHMË DHE MBËSHTETJE              */}
      {/* ═══════════════════════════════════════ */}
      <SectionLabel text="NDIHMË DHE MBËSHTETJE" />
      <Card>
        <LinkRow
          label="Na kontaktoni"
          icon="mail-outline"
          onPress={handleContact}
        />
        <LinkRow
          label="Raporto një problem"
          icon="warning-outline"
          onPress={handleReportProblem}
        />
        <LinkRow
          label="Pyetje të shpeshta (FAQ)"
          icon="help-circle-outline"
          onPress={() => openLink('https://joq-albania.com/faq')}
        />
        <LinkRow
          label="Dërgo përshtypje"
          icon="chatbox-outline"
          onPress={() =>
            Linking.openURL('mailto:feedback@joq-albania.com?subject=Përshtypje - JOQ News')
          }
        />
        <LinkRow
          label="Raporto lajm të pasaktë"
          icon="alert-circle-outline"
          onPress={handleReportNews}
          isLast
        />
      </Card>

      {/* ═══════════════════════════════════════ */}
      {/*  5. NDAJ APLIKACIONIN                   */}
      {/* ═══════════════════════════════════════ */}
      <SectionLabel text="NDAJ APLIKACIONIN" />
      <Card>
        <LinkRow
          label="Ndaj JOQ News"
          icon="share-outline"
          onPress={handleShareApp}
        />
        <LinkRow
          label="Ftoni miqtë"
          icon="people-outline"
          onPress={handleShareApp}
        />
        <LinkRow
          label="Vlerëso aplikacionin"
          icon="star-outline"
          onPress={() =>
            openLink(
              Platform.select({
                ios: 'https://apps.apple.com/app/joq-news/id0000000000',
                default: 'https://play.google.com/store/apps/details?id=com.joq.news',
              }) ?? '',
            )
          }
          isLast
        />
      </Card>

      {/* ═══════════════════════════════════════ */}
      {/*  6. RRETH (About / Brand)               */}
      {/* ═══════════════════════════════════════ */}
      <SectionLabel text="RRETH" />
      <Card>
        <InfoRow label="Versioni" value={Config.APP_VERSION} icon="information-circle-outline" />
        <InfoRow label="Numri i ndërtimit" value="1" icon="code-outline" />
        <InfoRow
          label="Artikuj të ruajtur"
          value={String(bookmarkCount)}
          icon="bookmark-outline"
        />
        {SOCIAL_LINKS.map((link, i) => (
          <LinkRow
            key={link.url}
            label={link.label}
            icon={link.icon}
            onPress={() => openLink(link.url)}
            isLast={i === SOCIAL_LINKS.length - 1}
          />
        ))}
      </Card>

      {/* ── Footer — Brand ────────────────────── */}
      <View style={[styles.footer, { marginTop: spacing.xxxl }]}>
        <AppLogo width={80} color={colors.textTertiary} />
        <Text
          style={[
            typography.caption,
            {
              color: colors.textTertiary,
              textAlign: 'center',
              marginTop: spacing.md,
            },
          ]}
        >
          v{Config.APP_VERSION}
        </Text>
        <Text
          style={[
            typography.caption,
            {
              color: colors.textTertiary,
              textAlign: 'center',
              marginTop: spacing.xxs,
            },
          ]}
        >
          Zhvilluar nga Zulbera
        </Text>
        <Text
          style={[
            typography.caption,
            {
              color: colors.textTertiary,
              textAlign: 'center',
              marginTop: spacing.xxs,
              fontSize: 10,
            },
          ]}
        >
          © {new Date().getFullYear()} JOQ Albania. Të gjitha të drejtat e rezervuara.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  segment: {
    flexDirection: 'row',
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
  },
});
