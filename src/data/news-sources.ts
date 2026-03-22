/**
 * Live News Sources — Multi-source news panel configuration.
 * Mirrors worldmonitor's LIVE NEWS panel with source tabs.
 */

export interface NewsSource {
  id: string;
  name: string;
  nameShort: string;
  color: string;
  logoEmoji: string;
  feedUrl: string;
  region: string;
  language: 'en' | 'ar' | 'fr';
  category: 'global' | 'finance' | 'tech' | 'gcc' | 'intelligence';
}

export const NEWS_SOURCES: NewsSource[] = [
  { id: 'bloomberg', name: 'Bloomberg', nameShort: 'BLOOMBERG', color: '#FF6900', logoEmoji: '📊', feedUrl: 'https://feeds.bloomberg.com/markets/news.rss', region: 'global', language: 'en', category: 'finance' },
  { id: 'skynews', name: 'Sky News', nameShort: 'SKYNEWS', color: '#C8102E', logoEmoji: '📺', feedUrl: 'https://feeds.skynews.com/feeds/rss/world.xml', region: 'global', language: 'en', category: 'global' },
  { id: 'euronews', name: 'Euronews', nameShort: 'EURONEWS', color: '#003399', logoEmoji: '🇪🇺', feedUrl: 'https://www.euronews.com/rss?format=mrss&level=theme&name=news', region: 'europe', language: 'en', category: 'global' },
  { id: 'dw', name: 'Deutsche Welle', nameShort: 'DW', color: '#0060AF', logoEmoji: '🇩🇪', feedUrl: 'https://rss.dw.com/rdf/rss-en-all', region: 'global', language: 'en', category: 'global' },
  { id: 'cnbc', name: 'CNBC', nameShort: 'CNBC', color: '#006B3E', logoEmoji: '💹', feedUrl: 'https://www.cnbc.com/id/100727362/device/rss/rss.html', region: 'global', language: 'en', category: 'finance' },
  { id: 'cnn', name: 'CNN', nameShort: 'CNN', color: '#CC0000', logoEmoji: '📡', feedUrl: 'http://rss.cnn.com/rss/edition_world.rss', region: 'global', language: 'en', category: 'global' },
  { id: 'france24', name: 'France 24', nameShort: 'FRANCE 24', color: '#00A1E0', logoEmoji: '🇫🇷', feedUrl: 'https://www.france24.com/en/rss', region: 'global', language: 'en', category: 'global' },
  { id: 'alarabiya', name: 'Al Arabiya', nameShort: 'ALARABIYA', color: '#E31E24', logoEmoji: '🇸🇦', feedUrl: 'https://english.alarabiya.net/rss.xml', region: 'gcc', language: 'en', category: 'gcc' },
  { id: 'aljazeera', name: 'Al Jazeera', nameShort: 'ALJAZEERA', color: '#D2A33C', logoEmoji: '🌍', feedUrl: 'https://www.aljazeera.com/xml/rss/all.xml', region: 'global', language: 'en', category: 'global' },
  { id: 'reuters', name: 'Reuters', nameShort: 'REUTERS', color: '#FF8000', logoEmoji: '📰', feedUrl: 'https://feeds.reuters.com/reuters/worldNews', region: 'global', language: 'en', category: 'global' },
  { id: 'bbc', name: 'BBC World', nameShort: 'BBC', color: '#BB1919', logoEmoji: '🇬🇧', feedUrl: 'https://feeds.bbci.co.uk/news/world/rss.xml', region: 'global', language: 'en', category: 'global' },
  { id: 'ft', name: 'Financial Times', nameShort: 'FT', color: '#FFF1E0', logoEmoji: '💼', feedUrl: 'https://www.ft.com/rss/home', region: 'global', language: 'en', category: 'finance' },
];

export interface WebcamSource {
  id: string;
  name: string;
  location: string;
  region: 'mideast' | 'europe' | 'americas' | 'asia' | 'space' | 'all';
  lat: number;
  lon: number;
  streamType: 'live' | 'recorded';
  thumbnailColor: string;
}

export const WEBCAM_SOURCES: WebcamSource[] = [
  { id: 'wc-1', name: 'Tehran', location: 'Iran', region: 'mideast', lat: 35.70, lon: 51.42, streamType: 'live', thumbnailColor: '#FF6B35' },
  { id: 'wc-2', name: 'Tel Aviv', location: 'Israel', region: 'mideast', lat: 32.09, lon: 34.78, streamType: 'live', thumbnailColor: '#007AFF' },
  { id: 'wc-3', name: 'Beirut', location: 'Lebanon', region: 'mideast', lat: 33.89, lon: 35.50, streamType: 'live', thumbnailColor: '#FF2D55' },
  { id: 'wc-4', name: 'Jerusalem', location: 'Israel', region: 'mideast', lat: 31.77, lon: 35.23, streamType: 'live', thumbnailColor: '#FFD600' },
  { id: 'wc-5', name: 'Dubai', location: 'UAE', region: 'mideast', lat: 25.20, lon: 55.27, streamType: 'live', thumbnailColor: '#00D4FF' },
  { id: 'wc-6', name: 'Riyadh', location: 'Saudi Arabia', region: 'mideast', lat: 24.71, lon: 46.67, streamType: 'live', thumbnailColor: '#34C759' },
  { id: 'wc-7', name: 'Istanbul', location: 'Turkey', region: 'mideast', lat: 41.01, lon: 28.98, streamType: 'live', thumbnailColor: '#FF3B30' },
  { id: 'wc-8', name: 'Kyiv', location: 'Ukraine', region: 'europe', lat: 50.45, lon: 30.52, streamType: 'live', thumbnailColor: '#005BBB' },
  { id: 'wc-9', name: 'Moscow', location: 'Russia', region: 'europe', lat: 55.76, lon: 37.62, streamType: 'live', thumbnailColor: '#CC0000' },
  { id: 'wc-10', name: 'London', location: 'UK', region: 'europe', lat: 51.51, lon: -0.13, streamType: 'live', thumbnailColor: '#BB1919' },
  { id: 'wc-11', name: 'Washington DC', location: 'USA', region: 'americas', lat: 38.91, lon: -77.04, streamType: 'live', thumbnailColor: '#003087' },
  { id: 'wc-12', name: 'New York', location: 'USA', region: 'americas', lat: 40.71, lon: -74.01, streamType: 'live', thumbnailColor: '#1D428A' },
  { id: 'wc-13', name: 'Beijing', location: 'China', region: 'asia', lat: 39.91, lon: 116.40, streamType: 'live', thumbnailColor: '#DE2910' },
  { id: 'wc-14', name: 'Tokyo', location: 'Japan', region: 'asia', lat: 35.68, lon: 139.69, streamType: 'live', thumbnailColor: '#BC002D' },
  { id: 'wc-15', name: 'ISS Tracker', location: 'Space', region: 'space', lat: 0, lon: 0, streamType: 'live', thumbnailColor: '#AF52DE' },
  { id: 'wc-16', name: 'Damascus', location: 'Syria', region: 'mideast', lat: 33.51, lon: 36.29, streamType: 'live', thumbnailColor: '#CE1126' },
  { id: 'wc-17', name: 'Baghdad', location: 'Iraq', region: 'mideast', lat: 33.31, lon: 44.37, streamType: 'live', thumbnailColor: '#007A3D' },
  { id: 'wc-18', name: 'Doha', location: 'Qatar', region: 'mideast', lat: 25.29, lon: 51.53, streamType: 'live', thumbnailColor: '#8A1538' },
  { id: 'wc-19', name: 'Kuwait City', location: 'Kuwait', region: 'mideast', lat: 29.38, lon: 47.99, streamType: 'live', thumbnailColor: '#007A3D' },
  { id: 'wc-20', name: 'Muscat', location: 'Oman', region: 'mideast', lat: 23.59, lon: 58.38, streamType: 'live', thumbnailColor: '#DB161B' },
  { id: 'wc-21', name: 'Manama', location: 'Bahrain', region: 'mideast', lat: 26.23, lon: 50.59, streamType: 'live', thumbnailColor: '#CE1126' },
  { id: 'wc-22', name: 'Paris', location: 'France', region: 'europe', lat: 48.86, lon: 2.35, streamType: 'live', thumbnailColor: '#002395' },
  { id: 'wc-23', name: 'Berlin', location: 'Germany', region: 'europe', lat: 52.52, lon: 13.41, streamType: 'live', thumbnailColor: '#DD0000' },
  { id: 'wc-24', name: 'Singapore', location: 'Singapore', region: 'asia', lat: 1.35, lon: 103.82, streamType: 'live', thumbnailColor: '#EF3340' },
  { id: 'wc-25', name: 'Mumbai', location: 'India', region: 'asia', lat: 19.08, lon: 72.88, streamType: 'live', thumbnailColor: '#FF9933' },
  { id: 'wc-26', name: 'Cairo', location: 'Egypt', region: 'mideast', lat: 30.04, lon: 31.24, streamType: 'live', thumbnailColor: '#CE1126' },
  { id: 'wc-27', name: 'Taipei', location: 'Taiwan', region: 'asia', lat: 25.03, lon: 121.56, streamType: 'live', thumbnailColor: '#FE0000' },
];
