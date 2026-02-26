/**
 * Categories screen — premium grid with Feather icons per category.
 */

import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { AppCategory } from '../../src/api/types';
import { ErrorState } from '../../src/components/states/ErrorState';
import { useCategories } from '../../src/hooks/useCategories';
import { useTheme } from '../../src/theme';

type FeatherIcon = ComponentProps<typeof Feather>['name'];

const CATEGORY_ICONS: Record<string, FeatherIcon> = {
  'vec-e-jona': 'star',
  lajme: 'radio',
  teknologji: 'cpu',
  bota: 'globe',
  argetim: 'film',
  maqedoni: 'map',
  sport: 'activity',
  'persekutimi-ndaj-joq': 'shield',
  kosova: 'flag',
  sondazhe: 'bar-chart-2',
  kuriozitete: 'help-circle',
  thashetheme: 'message-circle',
  udhetime: 'map-pin',
  shendeti: 'heart',
  'si-te': 'book-open',
  live: 'video',
};

function getCategoryIcon(slug: string): FeatherIcon {
  const key = Object.keys(CATEGORY_ICONS).find((k) =>
    slug.toLowerCase().includes(k),
  );
  return key ? CATEGORY_ICONS[key] : 'file-text';
}

const ACCENT_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F97316',
  '#10B981', '#06B6D4', '#EF4444', '#6366F1',
  '#14B8A6', '#F59E0B',
];

export default function CategoriesScreen() {
  const { colors, spacing, radius, typography, dark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: categories, isLoading, isError, refetch } = useCategories();

  const renderItem = useCallback(
    ({ item, index }: { item: AppCategory; index: number }) => {
      const accentColor = ACCENT_COLORS[index % ACCENT_COLORS.length];

      return (
        <Pressable
          onPress={() =>
            router.push(
              `/category/${item.id}?name=${encodeURIComponent(item.name)}`,
            )
          }
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: pressed
                ? colors.cardPressed
                : colors.card,
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
            <Feather
              name={getCategoryIcon(item.slug)}
              size={20}
              color={accentColor}
            />
          </View>
          <Text
            style={[
              typography.bodyMedium,
              { color: colors.text, fontSize: 15 },
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text
            style={[
              typography.caption,
              { color: colors.textTertiary, marginTop: spacing.xxs },
            ]}
          >
            {item.count} {item.count === 1 ? 'artikull' : 'artikuj'}
          </Text>
        </Pressable>
      );
    },
    [colors, spacing, radius, typography, router, dark],
  );

  if (isLoading) {
    return (
      <View
        style={[
          styles.center,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[
          styles.screen,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <ErrorState onRetry={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlashList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        ListHeaderComponent={
          <View
            style={{
              paddingTop: insets.top + spacing.lg,
              paddingHorizontal: spacing.lg,
              paddingBottom: spacing.md,
            }}
          >
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
          paddingHorizontal: spacing.sm,
          paddingBottom: spacing.massive,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});
