/**
 * Renders WordPress HTML article content in a native-friendly way.
 * Uses react-native-render-html with custom tag styles matching
 * the app's theme tokens for a premium reading experience.
 */

import React, { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import RenderHtml, {
  type MixedStyleRecord,
  defaultSystemFonts,
} from 'react-native-render-html';

import { useTheme } from '../../theme';

interface ArticleContentProps {
  html: string;
}

export function ArticleContent({ html }: ArticleContentProps) {
  const { width } = useWindowDimensions();
  const { colors, spacing, typography, fonts } = useTheme();

  const contentWidth = width - spacing.lg * 2;

  const tagsStyles = useMemo<MixedStyleRecord>(
    () => ({
      body: {
        color: colors.text,
        fontSize: typography.body.fontSize,
        lineHeight: typography.body.lineHeight * 1.4,
        fontFamily: fonts.serif,
      },
      p: {
        marginBottom: spacing.lg,
        color: colors.text,
      },
      h1: {
        fontSize: typography.h1.fontSize,
        fontWeight: typography.h1.fontWeight,
        color: colors.text,
        marginBottom: spacing.md,
        marginTop: spacing.xxl,
      },
      h2: {
        fontSize: typography.h2.fontSize,
        fontWeight: typography.h2.fontWeight,
        color: colors.text,
        marginBottom: spacing.md,
        marginTop: spacing.xl,
      },
      h3: {
        fontSize: typography.h3.fontSize,
        fontWeight: typography.h3.fontWeight,
        color: colors.text,
        marginBottom: spacing.sm,
        marginTop: spacing.xl,
      },
      a: {
        color: colors.accent,
        textDecorationLine: 'underline',
      },
      blockquote: {
        borderLeftWidth: 3,
        borderLeftColor: colors.accent,
        paddingLeft: spacing.lg,
        marginVertical: spacing.lg,
        fontStyle: 'italic',
        color: colors.textSecondary,
      },
      img: {
        borderRadius: 10,
        marginVertical: spacing.md,
      },
      ul: {
        marginBottom: spacing.lg,
        paddingLeft: spacing.lg,
      },
      ol: {
        marginBottom: spacing.lg,
        paddingLeft: spacing.lg,
      },
      li: {
        marginBottom: spacing.sm,
        color: colors.text,
      },
      figcaption: {
        fontSize: typography.caption.fontSize,
        color: colors.textTertiary,
        textAlign: 'center',
        marginTop: spacing.xs,
        marginBottom: spacing.lg,
      },
      pre: {
        backgroundColor: colors.surfaceElevated,
        padding: spacing.lg,
        borderRadius: 8,
        overflow: 'hidden',
        marginVertical: spacing.md,
      },
      code: {
        backgroundColor: colors.surfaceElevated,
        fontSize: typography.bodySm.fontSize - 1,
        paddingHorizontal: spacing.xs,
        borderRadius: 4,
      },
      table: {
        borderWidth: 1,
        borderColor: colors.border,
        marginVertical: spacing.md,
      },
      th: {
        backgroundColor: colors.surface,
        padding: spacing.sm,
        fontWeight: '600',
      },
      td: {
        padding: spacing.sm,
        borderWidth: 0.5,
        borderColor: colors.border,
      },
    }),
    [colors, spacing, typography, fonts],
  );

  const systemFonts = useMemo(
    () => [...defaultSystemFonts, fonts.serif, fonts.sans],
    [fonts],
  );

  return (
    <RenderHtml
      contentWidth={contentWidth}
      source={{ html }}
      tagsStyles={tagsStyles}
      systemFonts={systemFonts}
      enableExperimentalMarginCollapsing
      defaultTextProps={{ selectable: true }}
      renderersProps={{
        img: {
          enableExperimentalPercentWidth: true,
        },
      }}
    />
  );
}
