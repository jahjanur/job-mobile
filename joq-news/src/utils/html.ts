import { decode } from 'he';

/**
 * Strips HTML tags from a string and decodes entities.
 * Used for titles and excerpts that come from WP as rendered HTML.
 */
export function stripHtmlTags(html: string): string {
  return decode(html.replace(/<[^>]*>/g, '').trim());
}

/**
 * Truncates text to a given word count with an ellipsis.
 */
export function truncateWords(text: string, maxWords: number): string {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '…';
}
