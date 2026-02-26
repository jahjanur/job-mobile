import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  parseISO,
} from 'date-fns';
import { sq } from 'date-fns/locale';

/**
 * Returns a human-friendly date string in Albanian.
 * - "2 orë më parë" for today
 * - "Dje" for yesterday
 * - "18 Shk 2026" for older dates
 */
export function formatPostDate(isoDate: string): string {
  try {
    const date = parseISO(isoDate);
    if (isToday(date)) {
      return formatDistanceToNow(date, { addSuffix: true, locale: sq });
    }
    if (isYesterday(date)) {
      return 'Dje';
    }
    return format(date, 'd MMM yyyy', { locale: sq });
  } catch {
    return isoDate;
  }
}

/**
 * Returns just the clock time in HH:mm format.
 */
export function formatPostTime(isoDate: string): string {
  try {
    return format(parseISO(isoDate), 'HH:mm');
  } catch {
    return '';
  }
}

/**
 * Returns the relative date string with clock time appended.
 * e.g. "2 orë më parë · 20:20" or "Dje · 14:30" or "18 Shk 2026 · 09:15"
 */
export function formatPostDateWithTime(isoDate: string): string {
  const datePart = formatPostDate(isoDate);
  const timePart = formatPostTime(isoDate);
  if (!timePart) return datePart;
  return `${datePart} · ${timePart}`;
}

/**
 * Returns a full formatted date for article detail in Albanian.
 */
export function formatArticleDate(isoDate: string): string {
  try {
    return format(parseISO(isoDate), 'd MMMM yyyy · HH:mm', { locale: sq });
  } catch {
    return isoDate;
  }
}

/**
 * Returns today's date formatted in Albanian.
 * e.g. "E martë, 24 Shkurt 2026"
 */
export function formatTodayAlbanian(): string {
  return format(new Date(), 'EEEE, d MMMM yyyy', { locale: sq });
}
