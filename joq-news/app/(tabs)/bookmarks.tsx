/**
 * Bookmarks screen — premium design with Ionicons.
 * Displays locally saved articles with an elegant empty state.
 */

import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookmarkCard } from '../../src/components/cards/BookmarkCard';
import { EmptyState } from '../../src/components/states/EmptyState';
import {
  type BookmarkEntry,
  useBookmarksStore,
} from '../../src/store/bookmarksStore';
import { useTheme } from '../../src/theme';

export default function BookmarksScreen() {
  const { colors, spacing, typography, radius, dark } = useTheme();
  const insets = useSafeAreaInsets();

  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const clearAll = useBookmarksStore((s) => s.clearAll);

  const renderItem = useCallback(
    ({ item }: { item: BookmarkEntry }) => (
      <BookmarkCard bookmark={item} />
    ),
    [],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {bookmarks.length === 0 ? (
        <View style={{ paddingTop: insets.top + spacing.lg, flex: 1 }}>
          <Text
            style={[
              typography.h1,
              {
                color: colors.text,
                paddingHorizontal: spacing.lg,
                fontSize: 26,
                letterSpacing: -0.5,
                fontWeight: '800',
              },
            ]}
          >
            Ruajtur
          </Text>
          <EmptyState
            icon="bookmark-outline"
            title="Asnjë artikull i ruajtur"
            message="Ruaj artikujt për t'i lexuar më vonë, edhe pa internet."
          />
        </View>
      ) : (
        <FlashList
          data={bookmarks}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          ListHeaderComponent={
            <View
              style={{
                paddingTop: insets.top + spacing.lg,
                paddingHorizontal: spacing.lg,
                paddingBottom: spacing.lg,
              }}
            >
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
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
                    Ruajtur
                  </Text>
                  <Text
                    style={[
                      typography.bodySm,
                      { color: colors.textSecondary, marginTop: spacing.xs },
                    ]}
                  >
                    {bookmarks.length}{' '}
                    {bookmarks.length === 1
                      ? 'artikull i ruajtur'
                      : 'artikuj të ruajtur'}
                  </Text>
                </View>
                {bookmarks.length > 0 && (
                  <Pressable
                    onPress={clearAll}
                    hitSlop={8}
                    style={[
                      styles.clearBtn,
                      {
                        backgroundColor: colors.surface,
                        borderRadius: radius.full,
                        borderWidth: dark ? 0 : StyleSheet.hairlineWidth,
                        borderColor: colors.borderLight,
                      },
                    ]}
                  >
                    <Ionicons name="trash-outline" size={16} color={colors.textTertiary} />
                  </Pressable>
                )}
              </View>
            </View>
          }
          contentContainerStyle={{ paddingBottom: spacing.massive }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
