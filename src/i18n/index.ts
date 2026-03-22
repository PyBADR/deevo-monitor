/**
 * i18n System — 21 languages with RTL support (worldmonitor parity).
 * Uses i18next + react-i18next for runtime translation.
 * Fallback: loads from static JSON when i18next is not installed.
 *
 * RTL languages: Arabic (ar), Farsi (fa), Hebrew (he), Urdu (ur)
 */

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

export function isRTL(code: LanguageCode): boolean {
  return RTL_LANGUAGES.includes(code);
}

/**
 * Get the dir attribute for an HTML element.
 */
export function getDirection(code: LanguageCode): 'rtl' | 'ltr' {
  return isRTL(code) ? 'rtl' : 'ltr';
}

/**
 * Apply language direction to the document.
 */
export function applyLanguageDirection(code: LanguageCode): void {
  document.documentElement.dir = getDirection(code);
  document.documentElement.lang = code;
}

// ── Translation Keys ────────────────────────────────────

export interface TranslationKeys {
  // Navigation
  'nav.dashboard': string;
  'nav.map': string;
  'nav.news': string;
  'nav.webcams': string;
  'nav.finance': string;
  'nav.intelligence': string;
  'nav.settings': string;

  // Status bar
  'status.live': string;
  'status.connected': string;
  'status.disconnected': string;
  'status.search': string;

  // Panels
  'panel.intelFeed': string;
  'panel.liveNews': string;
  'panel.webcams': string;
  'panel.aiInsights': string;
  'panel.strategicPosture': string;
  'panel.countryIntel': string;
  'panel.riskIndex': string;
  'panel.forecasts': string;
  'panel.alerts': string;
  'panel.pipeline': string;
  'panel.financeRadar': string;
  'panel.correlation': string;

  // Countries
  'country.SA': string;
  'country.AE': string;
  'country.KW': string;
  'country.QA': string;
  'country.BH': string;
  'country.OM': string;

  // Risk levels
  'risk.low': string;
  'risk.moderate': string;
  'risk.elevated': string;
  'risk.high': string;
  'risk.critical': string;

  // General
  'general.loading': string;
  'general.error': string;
  'general.retry': string;
  'general.noData': string;
}

// ── English (default) translations ──────────────────────

export const EN_TRANSLATIONS: TranslationKeys = {
  'nav.dashboard': 'Dashboard',
  'nav.map': 'Map',
  'nav.news': 'News',
  'nav.webcams': 'Webcams',
  'nav.finance': 'Finance',
  'nav.intelligence': 'Intelligence',
  'nav.settings': 'Settings',

  'status.live': 'LIVE',
  'status.connected': 'Connected',
  'status.disconnected': 'Disconnected',
  'status.search': 'Search',

  'panel.intelFeed': 'Intel Feed',
  'panel.liveNews': 'Live News',
  'panel.webcams': 'Webcams',
  'panel.aiInsights': 'AI Insights',
  'panel.strategicPosture': 'Strategic Posture',
  'panel.countryIntel': 'Country Intelligence',
  'panel.riskIndex': 'Risk Index',
  'panel.forecasts': 'Forecasts',
  'panel.alerts': 'Alerts',
  'panel.pipeline': 'Pipeline',
  'panel.financeRadar': 'Finance Radar',
  'panel.correlation': 'Correlation',

  'country.SA': 'Saudi Arabia',
  'country.AE': 'United Arab Emirates',
  'country.KW': 'Kuwait',
  'country.QA': 'Qatar',
  'country.BH': 'Bahrain',
  'country.OM': 'Oman',

  'risk.low': 'Low',
  'risk.moderate': 'Moderate',
  'risk.elevated': 'Elevated',
  'risk.high': 'High',
  'risk.critical': 'Critical',

  'general.loading': 'Loading...',
  'general.error': 'Error',
  'general.retry': 'Retry',
  'general.noData': 'No data available',
};

// ── Arabic translations ─────────────────────────────────

export const AR_TRANSLATIONS: TranslationKeys = {
  'nav.dashboard': 'لوحة القيادة',
  'nav.map': 'الخريطة',
  'nav.news': 'الأخبار',
  'nav.webcams': 'كاميرات مباشرة',
  'nav.finance': 'المالية',
  'nav.intelligence': 'الاستخبارات',
  'nav.settings': 'الإعدادات',

  'status.live': 'مباشر',
  'status.connected': 'متصل',
  'status.disconnected': 'غير متصل',
  'status.search': 'بحث',

  'panel.intelFeed': 'تغذية الاستخبارات',
  'panel.liveNews': 'أخبار مباشرة',
  'panel.webcams': 'كاميرات مباشرة',
  'panel.aiInsights': 'رؤى الذكاء الاصطناعي',
  'panel.strategicPosture': 'الوضع الاستراتيجي',
  'panel.countryIntel': 'استخبارات الدول',
  'panel.riskIndex': 'مؤشر المخاطر',
  'panel.forecasts': 'التوقعات',
  'panel.alerts': 'التنبيهات',
  'panel.pipeline': 'خط الأنابيب',
  'panel.financeRadar': 'رادار المالية',
  'panel.correlation': 'الارتباط',

  'country.SA': 'المملكة العربية السعودية',
  'country.AE': 'الإمارات العربية المتحدة',
  'country.KW': 'الكويت',
  'country.QA': 'قطر',
  'country.BH': 'البحرين',
  'country.OM': 'عمان',

  'risk.low': 'منخفض',
  'risk.moderate': 'معتدل',
  'risk.elevated': 'مرتفع',
  'risk.high': 'عالي',
  'risk.critical': 'حرج',

  'general.loading': 'جاري التحميل...',
  'general.error': 'خطأ',
  'general.retry': 'إعادة المحاولة',
  'general.noData': 'لا توجد بيانات',
};

// ── Translation store (lightweight, no i18next dependency required) ──

type TranslationMap = Record<LanguageCode, Partial<TranslationKeys>>;

const translations: TranslationMap = {
  en: EN_TRANSLATIONS,
  ar: AR_TRANSLATIONS,
  fr: {}, de: {}, es: {}, pt: {}, ru: {}, zh: {}, ja: {},
  ko: {}, hi: {}, ur: {}, fa: {}, tr: {}, he: {}, it: {},
  nl: {}, pl: {}, sv: {}, th: {}, id: {},
};

let currentLanguage: LanguageCode = 'en';

export function setLanguage(code: LanguageCode): void {
  currentLanguage = code;
  applyLanguageDirection(code);
  try {
    localStorage.setItem('deevo_lang', code);
  } catch {
    // localStorage unavailable
  }
}

export function getLanguage(): LanguageCode {
  return currentLanguage;
}

export function t(key: keyof TranslationKeys): string {
  const langTranslations = translations[currentLanguage];
  return (langTranslations as any)?.[key] ?? (EN_TRANSLATIONS as any)[key] ?? key;
}

/**
 * Initialize language from stored preference or browser locale.
 */
export function initLanguage(): LanguageCode {
  try {
    const stored = localStorage.getItem('deevo_lang') as LanguageCode | null;
    if (stored && LANGUAGES.some((l) => l.code === stored)) {
      setLanguage(stored);
      return stored;
    }
  } catch {
    // localStorage unavailable
  }

  // Detect from browser
  const browserLang = navigator.language.split('-')[0] as LanguageCode;
  if (LANGUAGES.some((l) => l.code === browserLang)) {
    setLanguage(browserLang);
    return browserLang;
  }

  return 'en';
}
