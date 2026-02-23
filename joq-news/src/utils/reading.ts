/**
 * Estimates reading time based on word count.
 * Average reading speed: ~200 words per minute.
 */

export function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text.split(' ').length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min lexim`;
}
