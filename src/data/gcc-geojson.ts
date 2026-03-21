/**
 * GCC Seed Data — Risk hotspots, claim clusters, fraud arcs, alert icons.
 * Production: replace with Cortex API → /api/v1/cortex/monitor/*
 */
import type {
  RiskHotspot,
  ClaimCluster,
  FraudArc,
  AlertIcon,
  FeedItem,
} from "@/types";

// ── Risk Hotspots (HexagonLayer / HeatmapLayer seed) ────
export const RISK_HOTSPOTS: RiskHotspot[] = [
  // Saudi Arabia
  { position: [46.6753, 24.7136], weight: 85, category: "fraud", label: "Riyadh Central" },
  { position: [39.8579, 21.3891], weight: 72, category: "claims", label: "Jeddah Port" },
  { position: [50.1033, 26.4207], weight: 68, category: "risk", label: "Dammam Industrial" },
  { position: [46.7219, 24.6333], weight: 55, category: "cyber", label: "Riyadh Tech District" },
  { position: [39.6142, 24.4686], weight: 45, category: "weather", label: "Madinah" },
  // UAE
  { position: [55.2708, 25.2048], weight: 92, category: "fraud", label: "Dubai Marina" },
  { position: [54.6973, 24.4539], weight: 78, category: "regulatory", label: "Abu Dhabi ADGM" },
  { position: [55.3364, 25.2532], weight: 65, category: "claims", label: "Dubai Healthcare City" },
  { position: [55.4033, 25.1174], weight: 58, category: "market", label: "Dubai South" },
  // Qatar
  { position: [51.5310, 25.2854], weight: 70, category: "geopolitical", label: "Doha West Bay" },
  { position: [51.4220, 25.3750], weight: 52, category: "claims", label: "Doha Industrial" },
  // Kuwait
  { position: [47.9774, 29.3759], weight: 63, category: "fraud", label: "Kuwait City" },
  { position: [48.0766, 29.0823], weight: 48, category: "risk", label: "Ahmadi" },
  // Bahrain
  { position: [50.5860, 26.2285], weight: 57, category: "regulatory", label: "Manama Financial" },
  // Oman
  { position: [58.3829, 23.5880], weight: 45, category: "weather", label: "Muscat" },
  { position: [58.1893, 23.6145], weight: 38, category: "claims", label: "Muscat Port" },
];

// ── Claim Clusters (ScatterplotLayer seed) ───────────────
export const CLAIM_CLUSTERS: ClaimCluster[] = [
  { position: [46.6753, 24.7136], count: 1247, totalValue: 45_200_000, avgProcessingDays: 12.3, country: "SA" },
  { position: [39.8579, 21.3891], count: 892, totalValue: 32_100_000, avgProcessingDays: 15.7, country: "SA" },
  { position: [50.1033, 26.4207], count: 634, totalValue: 28_700_000, avgProcessingDays: 10.1, country: "SA" },
  { position: [55.2708, 25.2048], count: 2156, totalValue: 89_400_000, avgProcessingDays: 8.4, country: "AE" },
  { position: [54.6973, 24.4539], count: 1423, totalValue: 67_200_000, avgProcessingDays: 9.2, country: "AE" },
  { position: [51.5310, 25.2854], count: 567, totalValue: 24_500_000, avgProcessingDays: 11.8, country: "QA" },
  { position: [47.9774, 29.3759], count: 445, totalValue: 19_800_000, avgProcessingDays: 14.2, country: "KW" },
  { position: [50.5860, 26.2285], count: 312, totalValue: 13_600_000, avgProcessingDays: 10.5, country: "BH" },
  { position: [58.3829, 23.5880], count: 289, totalValue: 11_200_000, avgProcessingDays: 16.3, country: "OM" },
];

// ── Fraud Arcs (ArcLayer seed) ───────────────────────────
export const FRAUD_ARCS: FraudArc[] = [
  {
    source: [55.2708, 25.2048], target: [46.6753, 24.7136],
    sourceLabel: "Dubai", targetLabel: "Riyadh",
    weight: 0.85, fraudType: "cross-border-staging",
  },
  {
    source: [46.6753, 24.7136], target: [50.1033, 26.4207],
    sourceLabel: "Riyadh", targetLabel: "Dammam",
    weight: 0.72, fraudType: "claim-inflation",
  },
  {
    source: [55.2708, 25.2048], target: [51.5310, 25.2854],
    sourceLabel: "Dubai", targetLabel: "Doha",
    weight: 0.65, fraudType: "policy-laundering",
  },
  {
    source: [47.9774, 29.3759], target: [50.5860, 26.2285],
    sourceLabel: "Kuwait City", targetLabel: "Manama",
    weight: 0.58, fraudType: "identity-fraud",
  },
  {
    source: [54.6973, 24.4539], target: [58.3829, 23.5880],
    sourceLabel: "Abu Dhabi", targetLabel: "Muscat",
    weight: 0.45, fraudType: "vehicle-staging",
  },
  {
    source: [39.8579, 21.3891], target: [55.2708, 25.2048],
    sourceLabel: "Jeddah", targetLabel: "Dubai",
    weight: 0.78, fraudType: "syndicate-ring",
  },
];

// ── Alert Icons (IconLayer seed) ─────────────────────────
export const ALERT_ICONS: AlertIcon[] = [
  { position: [46.6753, 24.7136], type: "fraud", severity: "critical", label: "Fraud ring detected — Riyadh", id: "alert-1" },
  { position: [55.2708, 25.2048], type: "cyber", severity: "high", label: "Phishing campaign targeting insurers", id: "alert-2" },
  { position: [51.5310, 25.2854], type: "regulatory", severity: "medium", label: "QCB regulation update", id: "alert-3" },
  { position: [50.1033, 26.4207], type: "weather", severity: "high", label: "Sandstorm warning — Eastern Province", id: "alert-4" },
  { position: [47.9774, 29.3759], type: "geopolitical", severity: "medium", label: "Trade policy shift — Kuwait", id: "alert-5" },
  { position: [50.5860, 26.2285], type: "market", severity: "low", label: "Premium rate adjustment — Bahrain", id: "alert-6" },
  { position: [58.3829, 23.5880], type: "claims", severity: "high", label: "Flood claims surge — Muscat", id: "alert-7" },
];

// ── Sample Feed Items ────────────────────────────────────
export const SEED_FEED: FeedItem[] = [
  {
    id: "feed-1",
    timestamp: new Date().toISOString(),
    title: "SAMA Issues Updated Motor Insurance Guidelines",
    summary: "Saudi Central Bank publishes comprehensive motor insurance pricing framework with AI-assisted underwriting provisions.",
    category: "regulatory",
    severity: "medium",
    source: "SAMA Bulletin",
    country: "SA",
    coordinates: [46.6753, 24.7136],
  },
  {
    id: "feed-2",
    timestamp: new Date(Date.now() - 300_000).toISOString(),
    title: "Cross-Border Fraud Ring Dismantled",
    summary: "Joint SAMA-CBUAE operation identifies organized fraud ring operating across 3 GCC countries with estimated SAR 12M in fraudulent claims.",
    category: "fraud",
    severity: "critical",
    source: "DeevoSentinel",
    country: "SA",
    coordinates: [46.6753, 24.7136],
  },
  {
    id: "feed-3",
    timestamp: new Date(Date.now() - 600_000).toISOString(),
    title: "Cyclone Warning — Oman Coastal Regions",
    summary: "IMD issues tropical cyclone advisory for Gulf of Oman. Property and marine insurers advised to activate CAT response protocols.",
    category: "weather",
    severity: "high",
    source: "Oman Met Office",
    country: "OM",
    coordinates: [58.3829, 23.5880],
  },
  {
    id: "feed-4",
    timestamp: new Date(Date.now() - 900_000).toISOString(),
    title: "Dubai Health Insurance Claims Spike +23%",
    summary: "DHA reports significant increase in health insurance claims volume driven by respiratory illness surge. Insurers should review reserves.",
    category: "claims",
    severity: "high",
    source: "DHA Analytics",
    country: "AE",
    coordinates: [55.2708, 25.2048],
  },
  {
    id: "feed-5",
    timestamp: new Date(Date.now() - 1_200_000).toISOString(),
    title: "Bahrain Fintech Regulatory Sandbox Update",
    summary: "CBB expands insurtech sandbox to include AI-driven claims processing and parametric insurance products.",
    category: "regulatory",
    severity: "info",
    source: "CBB Press Office",
    country: "BH",
    coordinates: [50.5860, 26.2285],
  },
];
