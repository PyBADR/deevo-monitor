/**
 * Deevo Monitor — Core Type Definitions
 */

export interface GCCCountry {
  code: string;
  name: string;
  nameAr: string;
  capital: string;
  lat: number;
  lon: number;
  currency: string;
  regulator: string;
  insuranceAuth: string;
}

export interface MapMarker {
  id: string;
  lon: number;
  lat: number;
  name: string;
  nameAr?: string;
  type: 'country' | 'oil' | 'port' | 'risk' | 'mega' | 'city' | 'military' | 'insurance';
  color: string;
  score?: number;
  details?: Record<string, string>;
}

export interface NewsItem {
  id: string;
  source: string;
  title: string;
  titleAr?: string;
  url: string;
  timestamp: string;
  level: 'alert' | 'elevated' | 'normal';
  category: string;
  channel: string;
  region: string;
  tags: string[];
}

export interface AIInsight {
  id: string;
  type: 'brief' | 'alert' | 'forecast' | 'analysis';
  label: string;
  text: string;
  confidence: number;
  model: string;
  timestamp: string;
}

export interface IntelItem {
  id: string;
  badges: string[];
  text: string;
  textAr?: string;
  source: string;
  timestamp: string;
  lat?: number;
  lon?: number;
}

export interface WebcamStream {
  id: string;
  name: string;
  nameAr: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  streamUrl: string;
  category: string;
  isLive: boolean;
}

export interface RiskProfile {
  country: string;
  compositeScore: number;
  trend: 'rising' | 'stable' | 'falling';
  trendDelta: number;
  signals: {
    U: number; // Unrest
    C: number; // Claims
    S: number; // Sanctions
    I: number; // Infrastructure
    E: number; // Environment
    F: number; // Financial
  };
  lastUpdated: string;
}

export interface StrategicTheater {
  name: string;
  nameAr: string;
  level: 'CRIT' | 'HIGH' | 'ELEV' | 'NORM' | 'LOW';
  factors: string[];
}

export interface Forecast {
  id: string;
  title: string;
  probability: number;
  timeframes: Record<string, number>;
  region: string;
  trend: 'rising' | 'stable' | 'falling';
  tags: string[];
  model: string;
  timestamp: string;
}

export type Variant = 'world' | 'insurance' | 'geopolitical' | 'finance';

export interface AppConfig {
  variant: Variant;
  ollamaUrl: string;
  cortexUrl: string;
  refreshInterval: number;
  language: 'en' | 'ar';
  theme: 'dark' | 'light';
}
