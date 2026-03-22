/**
 * i18n System — 21 languages with RTL support (worldmonitor parity).
 * Uses i18next + react-i18next for runtime translation.
 * Locale JSON files in ./locales/ directory.
 *
 * RTL languages: Arabic (ar), Farsi (fa), Hebrew (he), Urdu (ur)
 */
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// ── Locale imports ──────────────────────────────────────
import en from './locales/en.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import zh from './locales/zh.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import hi from './locales/hi.json';
import ur from './locales/ur.json';
import fa from './locales/fa.json';
import tr from './locales/tr.json';
import he from './locales/he.json';
import it from './locales/it.json';
import nl from './locales/nl.json';
import pl from './locales/pl.json';
import sv from './locales/sv.json';
import th from './locales/th.json';
import id from './locales/id.json';

// ── Types ───────────────────────────────────────────────

export type LanguageCode =
  | 'en' | 'ar' | 'fr' | 'de' | 'es' | 'pt' | 'ru' | 'zh' | 'ja'
  | 'ko' | 'hi' | 'ur' | 'fa' | 'tr' | 'he' | 'it' | 'nl' | 'pl'
  | 'sv' | 'th' | 'id';

export interface LanguageDef {
  code: LanguageCode;
  name: string;
  nativeName: string;
  rtl: boolean;
  region: string;
}

// ── Language Definitions ────────────────────────────────

export const LANGUAGES: LanguageDef[] = [
  { code: 'en', name: 'English', nativeName: 'English', rtl: false, region: 'global' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true, region: 'mena' },
  { code: 'fr', name: 'French', nativeName: 'Français', rtl: false, region: 'europe' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false, region: 'europe' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false, region: 'europe' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', rtl: false, region: 'europe' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', rtl: false, region: 'europe' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', rtl: false, region: 'asia' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', rtl: false, region: 'asia' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', rtl: false, region: 'asia' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', rtl: false, region: 'asia' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', rtl: true, region: 'asia' },
  { code: 'fa', name: 'Farsi', nativeName: 'فارسی', rtl: true, region: 'mena' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', rtl: false, region: 'mena' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', rtl: true, region: 'mena' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', rtl: false, region: 'europe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', rtl: false, region: 'europe' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', rtl: false, region: 'europe' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', rtl: false, region: 'europe' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', rtl: false, region: 'asia' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', rtl: false, region: 'asia' },
];

export const RTL_LANGUAGES: LanguageCode[] = LANGUAGES.filter((l) => l.rtl).map((l) => l.code);

// ── Helper Functions ────────────────────────────────────

export function isRTL(code: LanguageCode): boolean {
  return RTL_LANGUAGES.includes(code);
}

export function getDirection(code: LanguageCode): 'rtl' | 'ltr' {
  return isRTL(code) ? 'rtl' : 'ltr';
}

export function applyLanguageDirection(code: LanguageCode): void {
  document.documentElement.dir = getDirection(code);
  document.documentElement.lang = code;
  // Add/remove RTL class for CSS hooks
  if (isRTL(code)) {
    document.documentElement.classList.add('rtl');
  } else {
    document.documentElement.classList.remove('rtl');
  }
}

// ── i18next Initialization ──────────────────────────────

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  fr: { translation: fr },
  de: { translation: de },
  es: { translation: es },
  pt: { translation: pt },
  ru: { translation: ru },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  hi: { translation: hi },
  ur: { translation: ur },
  fa: { translation: fa },
  tr: { translation: tr },
  he: { translation: he },
  it: { translation: it },
  nl: { translation: nl },
  pl: { translation: pl },
  sv: { translation: sv },
  th: { translation: th },
  id: { translation: id },
};

// Detect stored or browser language
function detectLanguage(): LanguageCode {
  try {
    const stored = localStorage.getItem('deevo_lang') as LanguageCode | null;
    if (stored && LANGUAGES.some((l) => l.code === stored)) return stored;
  } catch {
    // localStorage unavailable
  }
  const browserLang = navigator.language.split('-')[0] as LanguageCode;
  if (LANGUAGES.some((l) => l.code === browserLang)) return browserLang;
  return 'en';
}

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: detectLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

// Apply direction on init
applyLanguageDirection(i18next.language as LanguageCode);

// Listen for language changes
i18next.on('languageChanged', (lng: string) => {
  applyLanguageDirection(lng as LanguageCode);
  try {
    localStorage.setItem('deevo_lang', lng);
  } catch {
    // localStorage unavailable
  }
});

// ── Convenience Exports ─────────────────────────────────

export { i18next };
export default i18next;

/** Change language — updates i18next, direction, and persists to localStorage */
export function setLanguage(code: LanguageCode): void {
  i18next.changeLanguage(code);
}

/** Get current language code */
export function getLanguage(): LanguageCode {
  return i18next.language as LanguageCode;
}

/** Shorthand translation function (for non-React contexts) */
export function t(key: string, options?: Record<string, unknown>): string {
  return i18next.t(key, options);
}

/** Initialize language — call once on app startup */
export function initLanguage(): LanguageCode {
  const lang = detectLanguage();
  if (i18next.language !== lang) {
    i18next.changeLanguage(lang);
  }
  return lang;
}
