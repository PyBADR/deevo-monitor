/**
 * Deevo Monitor v2 — Core Type System
 * Layer 1 (Data) contract: every field typed, validated, versioned.
 * GCC-first: all country codes, currency, locale types are GCC-scoped.
 */

// ── GCC Geography ────────────────────────────────────────
export type GCCCountryCode = "SA" | "AE" | "QA" | "KW" | "BH" | "OM";

export interface GCCCountry {
  code: GCCCountryCode;
  name: string;
  nameAr: string;
  capital: string;
  center: [longitude: number, latitude: number];
  zoom: number;
  currency: string;
  regulatoryBody: string;
}

export const GCC_COUNTRIES: Record<GCCCountryCode, GCCCountry> = {
  SA: {
    code: "SA",
    name: "Saudi Arabia",
    nameAr: "المملكة العربية السعودية",
    capital: "Riyadh",
    center: [45.0792, 23.8859],
    zoom: 5.5,
    currency: "SAR",
    regulatoryBody: "SAMA",
  },
  AE: {
    code: "AE",
    name: "United Arab Emirates",
    nameAr: "الإمارات العربية المتحدة",
    capital: "Abu Dhabi",
    center: [54.3773, 24.4539],
    zoom: 7,
    currency: "AED",
    regulatoryBody: "CBUAE",
  },
  QA: {
    code: "QA",
    name: "Qatar",
    nameAr: "قطر",
    capital: "Doha",
    center: [51.1839, 25.3548],
    zoom: 8.5,
    currency: "QAR",
    regulatoryBody: "QCB",
  },
  KW: {
    code: "KW",
    name: "Kuwait",
    nameAr: "الكويت",
    capital: "Kuwait City",
    center: [47.4818, 29.3117],
    zoom: 8.5,
    currency: "KWD",
    regulatoryBody: "CBK",
  },
  BH: {
    code: "BH",
    name: "Bahrain",
    nameAr: "البحرين",
    capital: "Manama",
    center: [50.5577, 26.0667],
    zoom: 10,
    currency: "BHD",
    regulatoryBody: "CBB",
  },
  OM: {
    code: "OM",
    name: "Oman",
    nameAr: "عمان",
    capital: "Muscat",
    center: [57.5836, 21.4735],
    zoom: 6.5,
    currency: "OMR",
    regulatoryBody: "CMA",
  },
};

// ── DRI (Deevo Risk Index) ──────────────────────────────
/** 5-level composite risk index — GCC insurance DEFCON equivalent */
export type DRILevel = 1 | 2 | 3 | 4 | 5;

export interface DRIState {
  level: DRILevel;
  label: string;
  description: string;
  color: string;
  pulseRate: "none" | "slow" | "medium" | "fast" | "critical";
}

export const DRI_LEVELS: Record<DRILevel, DRIState> = {
  1: {
    level: 1,
    label: "NORMAL",
    description: "All systems nominal. Standard monitoring active.",
    color: "#22c55e",
    pulseRate: "none",
  },
  2: {
    level: 2,
    label: "ELEVATED",
    description: "Increased activity detected. Enhanced monitoring engaged.",
    color: "#eab308",
    pulseRate: "slow",
  },
  3: {
    level: 3,
    label: "HIGH",
    description: "Significant risk signals. Active investigation recommended.",
    color: "#f97316",
    pulseRate: "medium",
  },
  4: {
    level: 4,
    label: "SEVERE",
    description: "Critical risk threshold breached. Immediate action required.",
    color: "#ef4444",
    pulseRate: "fast",
  },
  5: {
    level: 5,
    label: "CRITICAL",
    description: "Maximum alert. Multiple cascading risk events in progress.",
    color: "#dc2626",
    pulseRate: "critical",
  },
};

// ── Intelligence Feed ────────────────────────────────────
export type FeedCategory =
  | "fraud"
  | "risk"
  | "claims"
  | "geopolitical"
  | "regulatory"
  | "weather"
  | "cyber"
  | "market";

export type FeedSeverity = "info" | "low" | "medium" | "high" | "critical";

export interface FeedItem {
  id: string;
  timestamp: string; // ISO 8601
  title: string;
  summary: string;
  category: FeedCategory;
  severity: FeedSeverity;
  source: string;
  sourceUrl?: string;
  country?: GCCCountryCode;
  coordinates?: [longitude: number, latitude: number];
  metadata?: Record<string, unknown>;
}

// ── Country Risk ─────────────────────────────────────────
export interface CountryRisk {
  country: GCCCountryCode;
  overallScore: number; // 0–100
  driLevel: DRILevel;
  components: {
    fraud: number;
    claims: number;
    geopolitical: number;
    regulatory: number;
    weather: number;
    cyber: number;
  };
  trend: "improving" | "stable" | "deteriorating";
  activeClaims: number;
  gwpMillions: number; // Gross Written Premium in millions
  lastUpdated: string;
}

// ── Map Layer Types ──────────────────────────────────────
export type MapLayerType =
  | "hexagon"
  | "scatterplot"
  | "arc"
  | "heatmap"
  | "icon";

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  transitionDuration?: number;
}

export interface RiskHotspot {
  position: [longitude: number, latitude: number];
  weight: number;
  category: FeedCategory;
  label?: string;
}

export interface ClaimCluster {
  position: [longitude: number, latitude: number];
  count: number;
  totalValue: number;
  avgProcessingDays: number;
  country: GCCCountryCode;
}

export interface FraudArc {
  source: [longitude: number, latitude: number];
  target: [longitude: number, latitude: number];
  sourceLabel: string;
  targetLabel: string;
  weight: number;
  fraudType: string;
}

export interface AlertIcon {
  position: [longitude: number, latitude: number];
  type: FeedCategory;
  severity: FeedSeverity;
  label: string;
  id: string;
}

// ── Pipeline Stats ───────────────────────────────────────
export interface PipelineStats {
  fnolVolume24h: number;
  fraudDetectionRate: number;
  stpRate: number; // Straight-Through Processing
  gwpTotal: number;
  activePolicies: number;
  openClaims: number;
  avgClaimCycleHours: number;
  lastUpdated: string;
}

// ── AI Insights ──────────────────────────────────────────
export interface AIInsight {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  confidence: number; // 0.0–1.0
  category: FeedCategory;
  actionable: boolean;
  suggestedAction?: string;
  model: string; // e.g., "llama3.2:3b"
}

// ── Socket.io Events ─────────────────────────────────────
export interface ServerToClientEvents {
  "feed:new": (item: FeedItem) => void;
  "risk:update": (risk: CountryRisk) => void;
  "dri:change": (level: DRILevel) => void;
  "pipeline:stats": (stats: PipelineStats) => void;
  "insight:new": (insight: AIInsight) => void;
  "alert:new": (alert: AlertIcon) => void;
}

export interface ClientToServerEvents {
  "feed:subscribe": (categories: FeedCategory[]) => void;
  "feed:unsubscribe": (categories: FeedCategory[]) => void;
  "insight:request": (prompt: string) => void;
  "country:focus": (country: GCCCountryCode) => void;
}

// ── API Response Wrappers ────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  meta: {
    timestamp: string;
    version: string;
    source: string;
  };
}

export interface ApiError {
  error: string;
  code: string;
  details?: Record<string, unknown>;
}
