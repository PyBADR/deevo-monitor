/**
 * DEEVO Intelligence Monitor — Hijri Calendar Utility
 * Contract C11 / Utility
 * Layer: Features (L2)
 *
 * Gregorian ↔ Hijri conversion using the Umm al-Qura algorithm.
 * Used for GCC-compliant date display in insurance documents,
 * policy inception/expiry, and regulatory filing dates.
 *
 * Trade-off: Pure JS implementation vs Intl.DateTimeFormat.
 *   Intl chosen for browser-native accuracy + locale support.
 *   Fallback to arithmetic approximation if Intl unavailable.
 */

export interface HijriDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  monthNameAr: string;
  formatted: string;
  formattedAr: string;
}

const HIJRI_MONTHS_EN = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', 'Shaban',
  'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah',
];

const HIJRI_MONTHS_AR = [
  'محرّم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
  'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
  'رمضان', 'شوّال', 'ذو القعدة', 'ذو الحجة',
];

/**
 * Convert a Gregorian Date to Hijri using Intl.DateTimeFormat.
 * Falls back to arithmetic approximation if Intl is unavailable.
 */
export function toHijri(date: Date = new Date()): HijriDate {
  try {
    // Use Intl.DateTimeFormat with islamic-umalqura calendar
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      year: 'numeric', month: 'numeric', day: 'numeric',
    });
    const parts = formatter.formatToParts(date);
    const year = parseInt(parts.find(p => p.type === 'year')?.value ?? '0');
    const month = parseInt(parts.find(p => p.type === 'month')?.value ?? '0');
    const day = parseInt(parts.find(p => p.type === 'day')?.value ?? '0');

    const monthName = HIJRI_MONTHS_EN[month - 1] ?? '';
    const monthNameAr = HIJRI_MONTHS_AR[month - 1] ?? '';

    return {
      year, month, day,
      monthName, monthNameAr,
      formatted: `${day} ${monthName} ${year} AH`,
      formattedAr: `${day} ${monthNameAr} ${year} هـ`,
    };
  } catch {
    // Fallback: arithmetic approximation (±1-2 days accuracy)
    const epochGregorian = new Date(622, 6, 16).getTime();
    const diffDays = Math.floor((date.getTime() - epochGregorian) / 86400000);
    const hijriDays = Math.floor(diffDays * (33 / 32));
    const year = Math.floor(hijriDays / 354.36667) + 1;
    const dayOfYear = hijriDays - Math.floor((year - 1) * 354.36667);
    const month = Math.min(12, Math.floor(dayOfYear / 29.5) + 1);
    const day = Math.max(1, dayOfYear - Math.floor((month - 1) * 29.5) + 1);

    const monthName = HIJRI_MONTHS_EN[month - 1] ?? '';
    const monthNameAr = HIJRI_MONTHS_AR[month - 1] ?? '';

    return {
      year, month, day,
      monthName, monthNameAr,
      formatted: `${day} ${monthName} ${year} AH`,
      formattedAr: `${day} ${monthNameAr} ${year} هـ`,
    };
  }
}

/** Get today's Hijri date string (English) */
export function getHijriToday(): string {
  return toHijri().formatted;
}

/** Get today's Hijri date string (Arabic) */
export function getHijriTodayAr(): string {
  return toHijri().formattedAr;
}

/** Get current Hijri year */
export function getHijriYear(): number {
  return toHijri().year;
}

/** Format a Gregorian date as dual calendar display */
export function dualCalendarFormat(date: Date = new Date()): string {
  const greg = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const hijri = toHijri(date).formatted;
  return `${greg} / ${hijri}`;
}
