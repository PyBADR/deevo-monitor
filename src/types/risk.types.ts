/**
 * Risk domain types — SCP-specified interfaces.
 * Covers DRI levels, region scores, claim hotspots, fraud zones.
 */

export type DRILevel = 1 | 2 | 3 | 4 | 5;

export interface RegionRiskScore {
  regionId: string;
  countryCode: string;
  countryName: string;
  countryNameAr: string;
  dri: DRILevel;
  driTrend: "rising" | "falling" | "stable";
  scores: {
    fraud: number;
    claims: number;
    weather: number;
    geopolitical: number;
    motor: number;
    medical: number;
  };
  lastUpdated: string;
}

export interface ClaimHotspot {
  id: string;
  lat: number;
  lon: number;
  claimCount: number;
  fraudScore: number;
  claimType: "motor" | "medical" | "property" | "marine";
  severity: "low" | "medium" | "high" | "critical";
  region: string;
  timestamp: string;
}

export interface FraudZone {
  id: string;
  polygon: [number, number][];
  fraudType:
    | "staged_accident"
    | "medical_inflation"
    | "ghost_policy"
    | "property_arson";
  riskScore: number;
  activeAlerts: number;
  region: string;
}

export interface AIInsight {
  id: string;
  type: "world_brief" | "risk_alert" | "forecast" | "fraud_signal";
  title: string;
  body: string;
  severity: "info" | "warning" | "critical";
  regions: string[];
  timestamp: string;
  source: string;
}

export interface MapLayer {
  id: string;
  label: string;
  labelAr: string;
  icon: string;
  color: string;
  visible: boolean;
  category:
    | "claims"
    | "fraud"
    | "weather"
    | "infrastructure"
    | "geopolitical";
}

/** DRI level metadata */
export const DRI_CONFIG: Record<
  DRILevel,
  { label: string; color: string; bgColor: string; description: string }
> = {
  1: {
    label: "SECURE",
    color: "#34C759",
    bgColor: "rgba(52,199,89,0.15)",
    description: "Normal operations. No significant threats detected.",
  },
  2: {
    label: "GUARDED",
    color: "#00D4FF",
    bgColor: "rgba(0,212,255,0.15)",
    description: "General risk awareness. Minor signals detected.",
  },
  3: {
    label: "ELEVATED",
    color: "#FFD600",
    bgColor: "rgba(255,214,0,0.15)",
    description: "Significant risk increase. Active monitoring engaged.",
  },
  4: {
    label: "HIGH",
    color: "#FF6B35",
    bgColor: "rgba(255,107,53,0.15)",
    description: "High risk level. Immediate assessment required.",
  },
  5: {
    label: "CRITICAL",
    color: "#FF2D55",
    bgColor: "rgba(255,45,85,0.15)",
    description: "Maximum alert. Multiple cascading risk events.",
  },
};

/** GCC region definitions with coordinates */
export const GCC_REGIONS = [
  {
    code: "KW",
    name: "Kuwait",
    nameAr: "الكويت",
    capital: "Kuwait City",
    center: [47.9774, 29.3759] as [number, number],
    zoom: 9,
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    nameAr: "المملكة العربية السعودية",
    capital: "Riyadh",
    center: [46.6753, 24.7136] as [number, number],
    zoom: 5.5,
  },
  {
    code: "AE",
    name: "UAE",
    nameAr: "الإمارات",
    capital: "Abu Dhabi",
    center: [54.3773, 24.4539] as [number, number],
    zoom: 7,
  },
  {
    code: "QA",
    name: "Qatar",
    nameAr: "قطر",
    capital: "Doha",
    center: [51.531, 25.2854] as [number, number],
    zoom: 9,
  },
  {
    code: "BH",
    name: "Bahrain",
    nameAr: "البحرين",
    capital: "Manama",
    center: [50.586, 26.2285] as [number, number],
    zoom: 10,
  },
  {
    code: "OM",
    name: "Oman",
    nameAr: "عمان",
    capital: "Muscat",
    center: [58.3829, 23.588] as [number, number],
    zoom: 6.5,
  },
] as const;
