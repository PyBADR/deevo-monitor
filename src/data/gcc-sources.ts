/**
 * Deevo Monitor — GCC Data Sources Configuration
 * 435+ feeds curated for Gulf Cooperation Council intelligence
 */

// ─── GCC Countries ───────────────────────────────────────────
export const GCC_COUNTRIES = {
  SA: { code: 'SA', name: 'Saudi Arabia', nameAr: 'المملكة العربية السعودية', capital: 'Riyadh', lat: 24.7136, lon: 46.6753, currency: 'SAR', regulator: 'SAMA', insuranceAuth: 'CCHI' },
  AE: { code: 'AE', name: 'UAE', nameAr: 'الإمارات العربية المتحدة', capital: 'Abu Dhabi', lat: 24.4539, lon: 54.3773, currency: 'AED', regulator: 'CBUAE', insuranceAuth: 'IA' },
  QA: { code: 'QA', name: 'Qatar', nameAr: 'قطر', capital: 'Doha', lat: 25.2854, lon: 51.5310, currency: 'QAR', regulator: 'QCB', insuranceAuth: 'QFCRA' },
  KW: { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', capital: 'Kuwait City', lat: 29.3759, lon: 47.9774, currency: 'KWD', regulator: 'CBK', insuranceAuth: 'IRU' },
  BH: { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', capital: 'Manama', lat: 26.2285, lon: 50.5860, currency: 'BHD', regulator: 'CBB', insuranceAuth: 'CBB' },
  OM: { code: 'OM', name: 'Oman', nameAr: 'عُمان', capital: 'Muscat', lat: 23.5880, lon: 58.3829, currency: 'OMR', regulator: 'CBO', insuranceAuth: 'CMA' },
} as const;

export type GCCCountryCode = keyof typeof GCC_COUNTRIES;

// ─── News RSS Feeds ──────────────────────────────────────────
export interface RSSFeed {
  id: string;
  name: string;
  nameAr?: string;
  url: string;
  category: FeedCategory;
  tier: 1 | 2 | 3 | 4;
  language: 'en' | 'ar' | 'both';
  region: GCCCountryCode | 'GCC' | 'MENA' | 'GLOBAL';
  tags: string[];
}

export type FeedCategory =
  | 'wire_service' | 'gcc_news' | 'insurance' | 'regulatory'
  | 'oil_energy' | 'finance_markets' | 'geopolitical' | 'defense_military'
  | 'catastrophe_weather' | 'technology' | 'real_estate' | 'maritime'
  | 'aviation' | 'health' | 'cybersecurity';

export const RSS_FEEDS: RSSFeed[] = [
  // ── Tier 1: Wire Services ──
  { id: 'reuters-me', name: 'Reuters Middle East', url: 'https://www.reuters.com/rss/middleeast', category: 'wire_service', tier: 1, language: 'en', region: 'MENA', tags: ['breaking', 'geopolitical'] },
  { id: 'ap-me', name: 'AP Middle East', url: 'https://apnews.com/hub/middle-east?format=rss', category: 'wire_service', tier: 1, language: 'en', region: 'MENA', tags: ['breaking'] },
  { id: 'afp-me', name: 'AFP Middle East', url: 'https://www.france24.com/en/middle-east/rss', category: 'wire_service', tier: 1, language: 'en', region: 'MENA', tags: ['breaking'] },

  // ── Tier 2: GCC Regional News ──
  { id: 'alarabiya-en', name: 'Al Arabiya English', nameAr: 'العربية', url: 'https://english.alarabiya.net/tools/rss', category: 'gcc_news', tier: 2, language: 'en', region: 'GCC', tags: ['gcc', 'politics', 'economy'] },
  { id: 'alarabiya-ar', name: 'Al Arabiya Arabic', nameAr: 'العربية', url: 'https://www.alarabiya.net/feed/rss2', category: 'gcc_news', tier: 2, language: 'ar', region: 'GCC', tags: ['gcc', 'politics'] },
  { id: 'aljazeera-en', name: 'Al Jazeera English', nameAr: 'الجزيرة', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'gcc_news', tier: 2, language: 'en', region: 'MENA', tags: ['geopolitical', 'breaking'] },
  { id: 'aljazeera-ar', name: 'Al Jazeera Arabic', nameAr: 'الجزيرة', url: 'https://www.aljazeera.net/aje/rss', category: 'gcc_news', tier: 2, language: 'ar', region: 'MENA', tags: ['geopolitical'] },
  { id: 'gulf-news', name: 'Gulf News', url: 'https://gulfnews.com/rss', category: 'gcc_news', tier: 2, language: 'en', region: 'AE', tags: ['uae', 'business'] },
  { id: 'arab-news', name: 'Arab News', url: 'https://www.arabnews.com/rss.xml', category: 'gcc_news', tier: 2, language: 'en', region: 'SA', tags: ['saudi', 'vision2030'] },
  { id: 'khaleej-times', name: 'Khaleej Times', url: 'https://www.khaleejtimes.com/rss', category: 'gcc_news', tier: 2, language: 'en', region: 'AE', tags: ['uae', 'business'] },
  { id: 'qatar-tribune', name: 'Qatar Tribune', url: 'https://www.qatar-tribune.com/rss', category: 'gcc_news', tier: 2, language: 'en', region: 'QA', tags: ['qatar'] },
  { id: 'times-oman', name: 'Times of Oman', url: 'https://timesofoman.com/rss', category: 'gcc_news', tier: 2, language: 'en', region: 'OM', tags: ['oman'] },
  { id: 'kuwait-times', name: 'Kuwait Times', url: 'https://www.kuwaittimes.com/feed/', category: 'gcc_news', tier: 2, language: 'en', region: 'KW', tags: ['kuwait'] },
  { id: 'gdn-bahrain', name: 'Gulf Daily News', url: 'https://www.gdnonline.com/rss', category: 'gcc_news', tier: 2, language: 'en', region: 'BH', tags: ['bahrain'] },
  { id: 'spa-saudi', name: 'Saudi Press Agency', nameAr: 'واس', url: 'https://www.spa.gov.sa/rss/allnews/en', category: 'gcc_news', tier: 2, language: 'en', region: 'SA', tags: ['official', 'saudi'] },
  { id: 'wam-uae', name: 'WAM Emirates News', nameAr: 'وام', url: 'https://wam.ae/en/rss', category: 'gcc_news', tier: 2, language: 'en', region: 'AE', tags: ['official', 'uae'] },

  // ── Tier 2: Insurance & Regulatory ──
  { id: 'sama-news', name: 'SAMA Updates', nameAr: 'ساما', url: 'https://www.sama.gov.sa/en-US/News/Pages/default.aspx', category: 'regulatory', tier: 2, language: 'en', region: 'SA', tags: ['regulator', 'saudi', 'insurance'] },
  { id: 'cbuae-news', name: 'CBUAE News', url: 'https://www.centralbank.ae/en/news', category: 'regulatory', tier: 2, language: 'en', region: 'AE', tags: ['regulator', 'uae'] },
  { id: 'artemis', name: 'Artemis.bm', url: 'https://www.artemis.bm/feed/', category: 'insurance', tier: 2, language: 'en', region: 'GLOBAL', tags: ['cat-bonds', 'reinsurance', 'ILS'] },
  { id: 'insurance-journal', name: 'Insurance Journal', url: 'https://www.insurancejournal.com/feed/', category: 'insurance', tier: 2, language: 'en', region: 'GLOBAL', tags: ['claims', 'underwriting'] },
  { id: 'reinsurance-news', name: 'Reinsurance News', url: 'https://www.reinsurancene.ws/feed/', category: 'insurance', tier: 2, language: 'en', region: 'GLOBAL', tags: ['reinsurance', 'capital'] },
  { id: 'meed', name: 'MEED', url: 'https://www.meed.com/rss', category: 'insurance', tier: 2, language: 'en', region: 'MENA', tags: ['projects', 'infrastructure', 'insurance'] },

  // ── Tier 2: Oil & Energy ──
  { id: 'reuters-oil', name: 'Reuters Oil', url: 'https://www.reuters.com/rss/oil', category: 'oil_energy', tier: 2, language: 'en', region: 'GLOBAL', tags: ['crude', 'brent', 'opec'] },
  { id: 'bloomberg-energy', name: 'Bloomberg Energy', url: 'https://www.bloomberg.com/energy/rss', category: 'oil_energy', tier: 2, language: 'en', region: 'GLOBAL', tags: ['energy', 'markets'] },
  { id: 'opec-news', name: 'OPEC News', url: 'https://www.opec.org/opec_web/en/press_room/28.htm', category: 'oil_energy', tier: 2, language: 'en', region: 'GLOBAL', tags: ['opec', 'production'] },
  { id: 'energy-intelligence', name: 'Energy Intelligence', url: 'https://www.energyintel.com/rss', category: 'oil_energy', tier: 2, language: 'en', region: 'GLOBAL', tags: ['lng', 'gas'] },

  // ── Tier 2: Finance & Markets ──
  { id: 'bloomberg-me', name: 'Bloomberg Middle East', url: 'https://www.bloomberg.com/middleeast/rss', category: 'finance_markets', tier: 2, language: 'en', region: 'MENA', tags: ['markets', 'economy'] },
  { id: 'cnbc-me', name: 'CNBC Arabia', url: 'https://www.cnbcarabia.com/rss', category: 'finance_markets', tier: 2, language: 'ar', region: 'MENA', tags: ['markets'] },
  { id: 'zawya', name: 'Zawya', url: 'https://www.zawya.com/rss', category: 'finance_markets', tier: 2, language: 'en', region: 'MENA', tags: ['markets', 'gcc'] },
  { id: 'tadawul', name: 'Tadawul News', url: 'https://www.saudiexchange.sa/rss', category: 'finance_markets', tier: 2, language: 'en', region: 'SA', tags: ['saudi', 'exchange'] },

  // ── Tier 2: Geopolitical & Defense ──
  { id: 'al-monitor', name: 'Al-Monitor', url: 'https://www.al-monitor.com/rss', category: 'geopolitical', tier: 2, language: 'en', region: 'MENA', tags: ['geopolitical', 'iran', 'diplomacy'] },
  { id: 'middle-east-eye', name: 'Middle East Eye', url: 'https://www.middleeasteye.net/rss', category: 'geopolitical', tier: 2, language: 'en', region: 'MENA', tags: ['geopolitical'] },
  { id: 'janes', name: 'Janes Defence', url: 'https://www.janes.com/feeds/news', category: 'defense_military', tier: 2, language: 'en', region: 'GLOBAL', tags: ['military', 'defense'] },
  { id: 'defense-one', name: 'Defense One', url: 'https://www.defenseone.com/rss/', category: 'defense_military', tier: 2, language: 'en', region: 'GLOBAL', tags: ['military'] },

  // ── Tier 2: Catastrophe & Weather ──
  { id: 'nasa-firms', name: 'NASA FIRMS', url: 'https://firms.modaps.eosdis.nasa.gov/api/area', category: 'catastrophe_weather', tier: 2, language: 'en', region: 'GLOBAL', tags: ['fire', 'satellite'] },
  { id: 'gdacs', name: 'GDACS Alerts', url: 'https://www.gdacs.org/xml/rss.xml', category: 'catastrophe_weather', tier: 2, language: 'en', region: 'GLOBAL', tags: ['earthquake', 'flood', 'cyclone'] },
  { id: 'ncm-uae', name: 'UAE NCM Weather', url: 'https://www.ncm.ae/rss', category: 'catastrophe_weather', tier: 2, language: 'en', region: 'AE', tags: ['weather', 'uae'] },
  { id: 'pme-saudi', name: 'Saudi PME', url: 'https://ncm.gov.sa/Ar/Weather/Pages/default.aspx', category: 'catastrophe_weather', tier: 2, language: 'ar', region: 'SA', tags: ['weather', 'saudi'] },

  // ── Tier 3: Maritime & Aviation ──
  { id: 'tradewinds', name: 'TradeWinds', url: 'https://www.tradewindsnews.com/rss', category: 'maritime', tier: 3, language: 'en', region: 'GLOBAL', tags: ['shipping', 'hormuz'] },
  { id: 'lloyds-list', name: "Lloyd's List", url: 'https://lloydslist.com/rss', category: 'maritime', tier: 3, language: 'en', region: 'GLOBAL', tags: ['maritime', 'insurance'] },
  { id: 'flightradar-me', name: 'FlightRadar24 ME', url: 'https://www.flightradar24.com/rss', category: 'aviation', tier: 3, language: 'en', region: 'MENA', tags: ['aviation', 'military'] },

  // ── Tier 3: Cybersecurity ──
  { id: 'ncsc-saudi', name: 'Saudi NCSC', url: 'https://cert.gov.sa/en/rss', category: 'cybersecurity', tier: 3, language: 'en', region: 'SA', tags: ['cyber', 'saudi'] },
  { id: 'aecert', name: 'aeCERT UAE', url: 'https://www.tra.gov.ae/aecert/en/rss', category: 'cybersecurity', tier: 3, language: 'en', region: 'AE', tags: ['cyber', 'uae'] },
];

// ─── Map Layer Definitions ───────────────────────────────────
export interface LayerConfig {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  color: string;
  category: LayerCategory;
  defaultOn: boolean;
  dataSource: string;
  refreshInterval: number; // seconds
}

export type LayerCategory = 'risk' | 'infrastructure' | 'geopolitical' | 'environment' | 'finance' | 'insurance';

export const MAP_LAYERS: LayerConfig[] = [
  // ── Risk Layers ──
  { id: 'claims-heatmap', name: 'Claims Heatmap', nameAr: 'خريطة المطالبات', icon: '🔥', color: '#ff4444', category: 'risk', defaultOn: true, dataSource: 'cortex:claims', refreshInterval: 300 },
  { id: 'fraud-hotspots', name: 'Fraud Hotspots', nameAr: 'بؤر الاحتيال', icon: '⚠️', color: '#ff8800', category: 'risk', defaultOn: true, dataSource: 'cortex:fraud', refreshInterval: 300 },
  { id: 'risk-zones', name: 'Risk Zones', nameAr: 'مناطق المخاطر', icon: '🎯', color: '#cc0000', category: 'risk', defaultOn: true, dataSource: 'cortex:risk', refreshInterval: 600 },
  { id: 'cat-exposure', name: 'Catastrophe Exposure', nameAr: 'تعرض الكوارث', icon: '🌪️', color: '#9900cc', category: 'risk', defaultOn: false, dataSource: 'api:gdacs', refreshInterval: 900 },
  { id: 'flood-zones', name: 'Flood Zones', nameAr: 'مناطق الفيضان', icon: '🌊', color: '#0066ff', category: 'risk', defaultOn: false, dataSource: 'static:flood-zones', refreshInterval: 86400 },

  // ── Infrastructure Layers ──
  { id: 'oil-facilities', name: 'Oil & Gas Facilities', nameAr: 'منشآت النفط والغاز', icon: '🛢️', color: '#333333', category: 'infrastructure', defaultOn: true, dataSource: 'static:oil-gas', refreshInterval: 86400 },
  { id: 'ports-terminals', name: 'Ports & Terminals', nameAr: 'الموانئ والمحطات', icon: '⚓', color: '#0088cc', category: 'infrastructure', defaultOn: true, dataSource: 'static:ports', refreshInterval: 86400 },
  { id: 'airports', name: 'Airports', nameAr: 'المطارات', icon: '✈️', color: '#00cc88', category: 'infrastructure', defaultOn: false, dataSource: 'static:airports', refreshInterval: 86400 },
  { id: 'desalination', name: 'Desalination Plants', nameAr: 'محطات التحلية', icon: '💧', color: '#00aaff', category: 'infrastructure', defaultOn: false, dataSource: 'static:desal', refreshInterval: 86400 },
  { id: 'power-grid', name: 'Power Grid', nameAr: 'شبكة الطاقة', icon: '⚡', color: '#ffcc00', category: 'infrastructure', defaultOn: false, dataSource: 'static:power', refreshInterval: 86400 },
  { id: 'undersea-cables', name: 'Undersea Cables', nameAr: 'الكابلات البحرية', icon: '🔌', color: '#00ffcc', category: 'infrastructure', defaultOn: false, dataSource: 'static:cables', refreshInterval: 86400 },
  { id: 'mega-projects', name: 'Mega Projects', nameAr: 'المشاريع الكبرى', icon: '🏗️', color: '#ff6600', category: 'infrastructure', defaultOn: false, dataSource: 'static:mega', refreshInterval: 86400 },

  // ── Geopolitical Layers ──
  { id: 'military-bases', name: 'Military Bases', nameAr: 'القواعد العسكرية', icon: '🏛️', color: '#cc0000', category: 'geopolitical', defaultOn: false, dataSource: 'static:bases', refreshInterval: 86400 },
  { id: 'conflict-zones', name: 'Conflict Zones', nameAr: 'مناطق النزاع', icon: '✕', color: '#ff0000', category: 'geopolitical', defaultOn: true, dataSource: 'api:acled', refreshInterval: 3600 },
  { id: 'sanctions', name: 'Sanctions Entities', nameAr: 'كيانات العقوبات', icon: '🚫', color: '#990000', category: 'geopolitical', defaultOn: false, dataSource: 'api:ofac', refreshInterval: 86400 },
  { id: 'shipping-lanes', name: 'Shipping Lanes', nameAr: 'ممرات الشحن', icon: '🚢', color: '#0066cc', category: 'geopolitical', defaultOn: true, dataSource: 'static:shipping', refreshInterval: 86400 },
  { id: 'hormuz-traffic', name: 'Strait of Hormuz', nameAr: 'مضيق هرمز', icon: '🌊', color: '#ff3366', category: 'geopolitical', defaultOn: true, dataSource: 'api:ais', refreshInterval: 60 },

  // ── Environment Layers ──
  { id: 'weather-alerts', name: 'Weather Alerts', nameAr: 'تنبيهات الطقس', icon: '🌡️', color: '#ff6600', category: 'environment', defaultOn: true, dataSource: 'api:weather', refreshInterval: 300 },
  { id: 'sandstorms', name: 'Sandstorm Tracking', nameAr: 'تتبع العواصف الرملية', icon: '🏜️', color: '#cc9900', category: 'environment', defaultOn: false, dataSource: 'api:dust', refreshInterval: 600 },
  { id: 'seismic', name: 'Seismic Activity', nameAr: 'النشاط الزلزالي', icon: '📊', color: '#9933cc', category: 'environment', defaultOn: false, dataSource: 'api:usgs', refreshInterval: 300 },
  { id: 'fire-hotspots', name: 'Fire Hotspots', nameAr: 'بؤر الحرائق', icon: '🔥', color: '#ff0000', category: 'environment', defaultOn: false, dataSource: 'api:firms', refreshInterval: 900 },

  // ── Finance Layers ──
  { id: 'fdi-projects', name: 'FDI Projects', nameAr: 'مشاريع الاستثمار الأجنبي', icon: '💰', color: '#00cc00', category: 'finance', defaultOn: false, dataSource: 'static:fdi', refreshInterval: 86400 },
  { id: 'free-zones', name: 'Free Trade Zones', nameAr: 'المناطق الحرة', icon: '🏢', color: '#0099cc', category: 'finance', defaultOn: false, dataSource: 'static:ftz', refreshInterval: 86400 },

  // ── Insurance-Specific Layers ──
  { id: 'insured-assets', name: 'Insured Asset Clusters', nameAr: 'تجمعات الأصول المؤمنة', icon: '🛡️', color: '#0066ff', category: 'insurance', defaultOn: true, dataSource: 'cortex:assets', refreshInterval: 3600 },
  { id: 'reinsurance-zones', name: 'Treaty Zones', nameAr: 'مناطق إعادة التأمين', icon: '📋', color: '#6600cc', category: 'insurance', defaultOn: false, dataSource: 'cortex:reinsurance', refreshInterval: 86400 },
  { id: 'loss-accumulation', name: 'Loss Accumulation', nameAr: 'تراكم الخسائر', icon: '📈', color: '#cc3300', category: 'insurance', defaultOn: false, dataSource: 'cortex:accumulation', refreshInterval: 3600 },
];

// ─── News Channel Configuration ──────────────────────────────
export const NEWS_CHANNELS = [
  { id: 'bloomberg', name: 'Bloomberg', color: '#ff6600', streamUrl: '' },
  { id: 'skynews-ar', name: 'Sky News Arabia', color: '#0066cc', streamUrl: '' },
  { id: 'alarabiya', name: 'Al Arabiya', color: '#cc0000', streamUrl: '' },
  { id: 'aljazeera', name: 'Al Jazeera', color: '#cc9900', streamUrl: '' },
  { id: 'cnbc-ar', name: 'CNBC Arabia', color: '#003399', streamUrl: '' },
  { id: 'france24-ar', name: 'France 24 AR', color: '#0088cc', streamUrl: '' },
  { id: 'cnn', name: 'CNN', color: '#cc0000', streamUrl: '' },
  { id: 'dw', name: 'DW', color: '#003366', streamUrl: '' },
] as const;

// ─── Live Webcam Sources ─────────────────────────────────────
export interface WebcamSource {
  id: string;
  name: string;
  nameAr: string;
  city: string;
  country: GCCCountryCode;
  lat: number;
  lon: number;
  streamUrl: string;
  category: 'city' | 'port' | 'airport' | 'infrastructure' | 'landmark';
}

export const WEBCAM_SOURCES: WebcamSource[] = [
  { id: 'riyadh-skyline', name: 'Riyadh Skyline', nameAr: 'أفق الرياض', city: 'Riyadh', country: 'SA', lat: 24.7136, lon: 46.6753, streamUrl: '', category: 'city' },
  { id: 'jeddah-corniche', name: 'Jeddah Corniche', nameAr: 'كورنيش جدة', city: 'Jeddah', country: 'SA', lat: 21.5433, lon: 39.1728, streamUrl: '', category: 'city' },
  { id: 'makkah-haram', name: 'Makkah Al-Haram', nameAr: 'المسجد الحرام', city: 'Makkah', country: 'SA', lat: 21.4225, lon: 39.8262, streamUrl: '', category: 'landmark' },
  { id: 'dubai-burj', name: 'Dubai Burj Khalifa', nameAr: 'برج خليفة', city: 'Dubai', country: 'AE', lat: 25.1972, lon: 55.2744, streamUrl: '', category: 'landmark' },
  { id: 'dubai-marina', name: 'Dubai Marina', nameAr: 'مرسى دبي', city: 'Dubai', country: 'AE', lat: 25.0805, lon: 55.1403, streamUrl: '', category: 'city' },
  { id: 'abudhabi-corniche', name: 'Abu Dhabi Corniche', nameAr: 'كورنيش أبوظبي', city: 'Abu Dhabi', country: 'AE', lat: 24.4539, lon: 54.3773, streamUrl: '', category: 'city' },
  { id: 'jebel-ali', name: 'Jebel Ali Port', nameAr: 'ميناء جبل علي', city: 'Dubai', country: 'AE', lat: 25.0040, lon: 55.0272, streamUrl: '', category: 'port' },
  { id: 'doha-corniche', name: 'Doha Corniche', nameAr: 'كورنيش الدوحة', city: 'Doha', country: 'QA', lat: 25.2854, lon: 51.5310, streamUrl: '', category: 'city' },
  { id: 'ras-laffan', name: 'Ras Laffan Industrial', nameAr: 'رأس لفان', city: 'Ras Laffan', country: 'QA', lat: 25.9277, lon: 51.5503, streamUrl: '', category: 'infrastructure' },
  { id: 'kuwait-towers', name: 'Kuwait Towers', nameAr: 'أبراج الكويت', city: 'Kuwait City', country: 'KW', lat: 29.3906, lon: 47.9932, streamUrl: '', category: 'landmark' },
  { id: 'manama-skyline', name: 'Manama Skyline', nameAr: 'أفق المنامة', city: 'Manama', country: 'BH', lat: 26.2285, lon: 50.5860, streamUrl: '', category: 'city' },
  { id: 'muscat-port', name: 'Port Sultan Qaboos', nameAr: 'ميناء السلطان قابوس', city: 'Muscat', country: 'OM', lat: 23.6230, lon: 58.5680, streamUrl: '', category: 'port' },
  { id: 'hormuz-strait', name: 'Strait of Hormuz', nameAr: 'مضيق هرمز', city: 'Hormuz', country: 'OM', lat: 26.5667, lon: 56.2500, streamUrl: '', category: 'infrastructure' },
  { id: 'neom', name: 'NEOM Construction', nameAr: 'مشروع نيوم', city: 'NEOM', country: 'SA', lat: 27.9500, lon: 35.3000, streamUrl: '', category: 'infrastructure' },
];

// ─── GCC Infrastructure Data Points ──────────────────────────
export const OIL_GAS_FACILITIES = [
  // Saudi Arabia
  { id: 'ghawar', name: 'Ghawar Field', country: 'SA', lat: 25.3800, lon: 49.4000, type: 'oil_field', capacity: '3.8M bpd', operator: 'Saudi Aramco', insuredValue: 'USD 50B+' },
  { id: 'ras-tanura', name: 'Ras Tanura Refinery', country: 'SA', lat: 26.6400, lon: 50.1600, type: 'refinery', capacity: '550K bpd', operator: 'Saudi Aramco', insuredValue: 'USD 15B' },
  { id: 'abqaiq', name: 'Abqaiq Processing', country: 'SA', lat: 25.9400, lon: 49.6800, type: 'processing', capacity: '7M bpd', operator: 'Saudi Aramco', insuredValue: 'USD 30B' },
  { id: 'yanbu', name: 'Yanbu Refinery', country: 'SA', lat: 24.0800, lon: 38.0600, type: 'refinery', capacity: '400K bpd', operator: 'Saudi Aramco', insuredValue: 'USD 10B' },
  { id: 'jazan', name: 'Jazan Refinery', country: 'SA', lat: 16.9000, lon: 42.5700, type: 'refinery', capacity: '400K bpd', operator: 'Saudi Aramco', insuredValue: 'USD 8B' },
  // UAE
  { id: 'ruwais', name: 'Ruwais Refinery', country: 'AE', lat: 24.1100, lon: 52.7300, type: 'refinery', capacity: '922K bpd', operator: 'ADNOC', insuredValue: 'USD 20B' },
  { id: 'upper-zakum', name: 'Upper Zakum Field', country: 'AE', lat: 24.8500, lon: 53.8500, type: 'oil_field', capacity: '750K bpd', operator: 'ADNOC', insuredValue: 'USD 25B' },
  { id: 'jebel-ali-lng', name: 'Jebel Ali LNG', country: 'AE', lat: 25.0100, lon: 55.0400, type: 'lng', capacity: '2 MTPA', operator: 'DUSUP', insuredValue: 'USD 5B' },
  // Qatar
  { id: 'north-field', name: 'North Field', country: 'QA', lat: 26.0000, lon: 52.0000, type: 'gas_field', capacity: '77 MTPA LNG', operator: 'QatarEnergy', insuredValue: 'USD 100B+' },
  { id: 'ras-laffan-lng', name: 'Ras Laffan LNG Complex', country: 'QA', lat: 25.9277, lon: 51.5503, type: 'lng', capacity: '77 MTPA', operator: 'QatarEnergy', insuredValue: 'USD 60B' },
  // Kuwait
  { id: 'burgan', name: 'Burgan Field', country: 'KW', lat: 29.0700, lon: 47.9700, type: 'oil_field', capacity: '1.7M bpd', operator: 'KOC', insuredValue: 'USD 35B' },
  { id: 'mina-ahmadi', name: 'Mina Al-Ahmadi Refinery', country: 'KW', lat: 29.0800, lon: 48.1400, type: 'refinery', capacity: '466K bpd', operator: 'KNPC', insuredValue: 'USD 12B' },
  // Bahrain
  { id: 'bapco', name: 'BAPCO Refinery', country: 'BH', lat: 26.0300, lon: 50.5200, type: 'refinery', capacity: '267K bpd', operator: 'BAPCO', insuredValue: 'USD 7B' },
  // Oman
  { id: 'oman-lng', name: 'Oman LNG', country: 'OM', lat: 22.9600, lon: 59.2800, type: 'lng', capacity: '10.4 MTPA', operator: 'Oman LNG', insuredValue: 'USD 8B' },
  { id: 'sohar-refinery', name: 'Sohar Refinery', country: 'OM', lat: 24.3500, lon: 56.7300, type: 'refinery', capacity: '198K bpd', operator: 'OQ', insuredValue: 'USD 4B' },
];

export const MAJOR_PORTS = [
  { id: 'jebel-ali-port', name: 'Jebel Ali', country: 'AE', lat: 25.0040, lon: 55.0272, teu: '14.7M', operator: 'DP World' },
  { id: 'king-abdulaziz', name: 'King Abdulaziz Port', country: 'SA', lat: 26.4700, lon: 50.2200, teu: '2.3M', operator: 'Saudi Ports' },
  { id: 'jeddah-islamic', name: 'Jeddah Islamic Port', country: 'SA', lat: 21.4800, lon: 39.1700, teu: '4.4M', operator: 'Saudi Ports' },
  { id: 'hamad-port', name: 'Hamad Port', country: 'QA', lat: 25.0100, lon: 51.5800, teu: '2.0M', operator: 'QTerminals' },
  { id: 'khalifa-port', name: 'Khalifa Port', country: 'AE', lat: 24.7900, lon: 54.6300, teu: '2.5M', operator: 'ADPC' },
  { id: 'shuwaikh', name: 'Shuwaikh Port', country: 'KW', lat: 29.3500, lon: 47.9300, teu: '0.8M', operator: 'KPA' },
  { id: 'mina-salman', name: 'Mina Salman', country: 'BH', lat: 26.1900, lon: 50.6200, teu: '0.3M', operator: 'APM Terminals' },
  { id: 'sohar-port', name: 'Sohar Port', country: 'OM', lat: 24.3500, lon: 56.7300, teu: '1.2M', operator: 'Sohar Port' },
  { id: 'salalah-port', name: 'Salalah Port', country: 'OM', lat: 16.9500, lon: 54.0100, teu: '3.5M', operator: 'APM Terminals' },
];
