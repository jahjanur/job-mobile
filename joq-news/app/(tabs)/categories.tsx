/**
 * Categories screen — grouped sections matching JOQ Albania website.
 * Each section displays a grid of category cards with Ionicons.
 */

import React, { useCallback } from 'react';
import {
  Linking,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CATEGORY_GROUPS,
  type CategoryEntry,
} from '../../src/constants/categories';
import { useTheme } from '../../src/theme';

const ACCENT_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F97316',
  '#10B981', '#06B6D4', '#EF4444', '#6366F1',
  '#14B8A6', '#F59E0B',
];

type Section = {
  title: string;
  data: CategoryEntry[][];
};

/** Chunk entries into pairs for a 2-column grid */
function chunkPairs(entries: CategoryEntry[]): CategoryEntry[][] {
  const result: CategoryEntry[][] = [];
  for (let i = 0; i < entries.length; i += 2) {
    result.push(entries.slice(i, i + 2));
  }
  return result;
}

const sections: Section[] = CATEGORY_GROUPS.map((g) => ({
  title: g.title,
  data: chunkPairs(g.entries),
}));

export default function CategoriesScreen() {
  const { colors, spacing, radius, typography, dark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  let globalIndex = 0;

  const handlePress = useCallback(
    (entry: CategoryEntry) => {
      if (entry.externalUrl) {
        Linking.openURL(entry.externalUrl);
        return;
      }
      if (entry.slug === 'live') {
        router.push('/live');
        return;
      }
      if (entry.slug === 'rreth-nesh') {
        return;
      }
      if (entry.id != null) {
        router.push(
          `/category/${entry.id}?name=${encodeURIComponent(entry.name)}`,
        );
      }
    },
    [router],
  );

  const renderRow = ({ item: row }: { item: CategoryEntry[] }) => (
    <View style={[styles.row, { paddingHorizontal: spacing.sm }]}>
      {row.map((entry) => {
        const colorIndex = globalIndex++;
        const accentColor = ACCENT_COLORS[colorIndex % ACCENT_COLORS.length];

        return (
          <Pressable
            key={entry.slug}
            onPress={() => handlePress(entry)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: pressed ? colors.cardPressed : colors.card,
                borderRadius: radius.lg,
                padding: spacing.xl,
                margin: spacing.xs,
                flex: 1,
                borderWidth: dark ? 0 : StyleSheet.hairlineWidth,
                borderColor: colors.borderLight,
              },
            ]}
          >
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: accentColor + '15',
                  borderRadius: radius.md,
                  width: 44,
                  height: 44,
                  marginBottom: spacing.md,
                },
              ]}
            >
              {entry.flag ? (
                <Text style={{ fontSize: 22 }}>{entry.flag}</Text>
              ) : (
                <Ionicons name={entry.icon} size={22} color={accentColor} />
              )}
            </View>
            <Text
              style={[
                typography.bodyMedium,
                { color: colors.text, fontSize: 15 },
              ]}
              numberOfLines={1}
            >
              {entry.name}
            </Text>
            {entry.externalUrl && (
              <View style={[styles.externalBadge, { marginTop: spacing.xxs }]}>
                <Ionicons
                  name="open-outline"
                  size={10}
                  color={colors.textTertiary}
                />
                <Text
                  style={[
                    typography.caption,
                    { color: colors.textTertiary, marginLeft: 3, fontSize: 10 },
                  ]}
                >
                  Web
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
      {row.length === 1 && <View style={{ flex: 1, margin: spacing.xs }} />}
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SectionList
        sections={sections}
        keyExtractor={(_, index) => String(index)}
        renderItem={renderRow}
        renderSectionHeader={({ section }) => (
          <View
            style={{
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.lg,
              paddingBottom: spacing.sm,
              backgroundColor: colors.background,
            }}
          >
            <Text
              style={[
                typography.h3,
                { color: colors.textSecondary, fontSize: 14, letterSpacing: 0.5 },
              ]}
            >
              {section.title.toUpperCase()}
            </Text>
          </View>
        )}
        ListHeaderComponent={
          <View
            style={{
              paddingTop: insets.top + spacing.lg,
              paddingHorizontal: spacing.lg,
              paddingBottom: spacing.xs,
            }}
          >
            <Text
              style={[
                typography.h1,
                {
                  color: colors.text,
                  fontSize: 26,
                  letterSpacing: -0.5,
                },
              ]}
            >
              Tema
            </Text>
            <Text
              style={[
                typography.bodySm,
                { color: colors.textSecondary, marginTop: spacing.xs },
              ]}
            >
              Shfleto sipas kategorisë
            </Text>
          </View>
        }
        contentContainerStyle={{
          paddingBottom: spacing.massive,
        }}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  externalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
