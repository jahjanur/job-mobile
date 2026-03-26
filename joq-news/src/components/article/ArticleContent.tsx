/**
 * Renders WordPress HTML article content in a native-friendly way.
 * Uses react-native-render-html with Hurme4 font family matching
 * the JOQ Albania website for a consistent reading experience.
 */

import React, { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import RenderHtml, {
  type MixedStyleRecord,
  defaultSystemFonts,
} from 'react-native-render-html';

import { useTheme } from '../../theme';
import { hurme4 } from '../../theme/typography';

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
        fontFamily: hurme4.regular,
      },
      p: {
        marginBottom: spacing.lg,
        color: colors.text,
        fontFamily: hurme4.regular,
      },
      strong: {
        fontFamily: hurme4.bold,
        fontWeight: '700',
      },
      b: {
        fontFamily: hurme4.bold,
        fontWeight: '700',
      },
      em: {
        fontStyle: 'italic',
      },
      h1: {
        fontSize: typography.h1.fontSize,
        fontFamily: hurme4.bold,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.md,
        marginTop: spacing.xxl,
      },
      h2: {
        fontSize: typography.h2.fontSize,
        fontFamily: hurme4.bold,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.md,
        marginTop: spacing.xl,
      },
      h3: {
        fontSize: typography.h3.fontSize,
        fontFamily: hurme4.semiBold,
        fontWeight: '600',
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
        fontFamily: hurme4.light,
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
        fontFamily: hurme4.regular,
      },
      figcaption: {
        fontSize: typography.caption.fontSize,
        fontFamily: hurme4.light,
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
        fontFamily: hurme4.semiBold,
        fontWeight: '600',
      },
      td: {
        padding: spacing.sm,
        borderWidth: 0.5,
        borderColor: colors.border,
      },
    }),
    [colors, spacing, typography],
  );

  const systemFonts = useMemo(
    () => [
      ...defaultSystemFonts,
      hurme4.thin,
      hurme4.light,
      hurme4.regular,
      hurme4.semiBold,
      hurme4.bold,
      hurme4.black,
      fonts.serif,
    ],
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
