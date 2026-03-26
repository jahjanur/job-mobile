import { Share, Platform } from 'react-native';

import type { AppPost } from '../api/types';

/** Build the full web URL for an article */
export function getArticleWebUrl(post: AppPost): string {
  const link = post.link;
  if (link.startsWith('http')) return link;
  return `https://joq-albania.com${link.startsWith('/') ? '' : '/'}${link}`;
}

/** Build the deep link URL for the app */
export function getArticleAppLink(postId: number): string {
  return `joq-news://article/${postId}`;
}

/** Strip HTML tags from excerpt for a clean preview */
function cleanExcerpt(excerpt: string): string {
  return excerpt
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export async function shareArticle(post: AppPost): Promise<void> {
  const webUrl = getArticleWebUrl(post);
  const category = post.categoryNames[0] ?? '';
  const excerpt = cleanExcerpt(post.excerpt);
  const shortExcerpt = excerpt.length > 120 ? excerpt.slice(0, 117) + '...' : excerpt;

  // Build a nicely formatted share message
  const lines: string[] = [];

  if (category) {
    lines.push(`📰 ${category.toUpperCase()}`);
    lines.push('');
  }

  lines.push(post.title);

  if (shortExcerpt) {
    lines.push('');
    lines.push(shortExcerpt);
  }

  lines.push('');
  lines.push(`🔗 ${webUrl}`);
  lines.push('');
  lines.push('📲 Shkarko JOQ News: https://joq-albania.com/app');

  const message = lines.join('\n');

  try {
    await Share.share(
      Platform.OS === 'ios'
        ? { title: post.title, message, url: webUrl }
        : { title: post.title, message },
      { dialogTitle: 'Ndaj artikullin' },
    );
  } catch {
    // user cancelled
  }
}
