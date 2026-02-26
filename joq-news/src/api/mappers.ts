/**
 * Mapper layer: transforms raw WordPress REST responses into
 * clean, UI-ready app models. This is the only place that
 * knows about the WordPress response shape; all UI components
 * consume AppPost / AppCategory exclusively.
 */

import { decode } from 'he';

import type {
  AppCategory,
  AppPost,
  WPCategory,
  WPPost,
} from './types';

/**
 * Extracts a clean text string from a WP "rendered" HTML field
 * by stripping tags and decoding HTML entities.
 */
function stripHtml(html: string): string {
  return decode(html.replace(/<[^>]*>/g, '').trim());
}

/**
 * Pulls the best available featured image URL from embedded data.
 * Falls back through sizes: large → full → source_url.
 */
function extractFeaturedImage(
  post: WPPost,
  size: 'medium' | 'large' = 'medium',
): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media?.source_url) return null;

  const sizes = media.media_details?.sizes;
  if (size === 'large') {
    return sizes?.large?.source_url ?? sizes?.full?.source_url ?? media.source_url;
  }
  return sizes?.medium?.source_url ?? sizes?.large?.source_url ?? media.source_url;
}

function extractFeaturedImageAlt(post: WPPost): string {
  return post._embedded?.['wp:featuredmedia']?.[0]?.alt_text ?? '';
}

function extractAuthorName(post: WPPost): string {
  return post._embedded?.author?.[0]?.name ?? 'Unknown';
}

function extractAuthorAvatar(post: WPPost): string | null {
  const urls = post._embedded?.author?.[0]?.avatar_urls;
  if (!urls) return null;
  return urls['96'] ?? urls['48'] ?? urls['24'] ?? null;
}

function extractCategoryNames(post: WPPost): string[] {
  const terms = post._embedded?.['wp:term']?.[0];
  if (!terms) return [];
  return terms.map((t) => decode(t.name));
}

// ─── Public mappers ────────────────────────────────────────

export function mapPost(post: WPPost): AppPost {
  return {
    id: post.id,
    title: stripHtml(post.title.rendered),
    excerpt: stripHtml(post.excerpt.rendered),
    content: post.content.rendered,
    slug: post.slug,
    date: post.date,
    modified: post.modified,
    authorName: extractAuthorName(post),
    authorAvatar: extractAuthorAvatar(post),
    featuredImage: extractFeaturedImage(post, 'medium'),
    featuredImageLarge: extractFeaturedImage(post, 'large'),
    featuredImageAlt: extractFeaturedImageAlt(post),
    categoryIds: post.categories,
    categoryNames: extractCategoryNames(post),
    tagIds: post.tags,
    viewCount: 0,
    link: post.link,
  };
}

export function mapPosts(posts: WPPost[]): AppPost[] {
  return posts.map(mapPost);
}

export function mapCategory(cat: WPCategory): AppCategory {
  return {
    id: cat.id,
    name: decode(cat.name),
    slug: cat.slug,
    count: cat.count,
    parentId: cat.parent,
  };
}

export function mapCategories(cats: WPCategory[]): AppCategory[] {
  return cats.map(mapCategory);
}
