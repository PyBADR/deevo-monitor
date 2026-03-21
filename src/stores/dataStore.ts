/**
 * Data Store — Zustand state for all dashboard data.
 * Holds feed items, risk scores, pipeline stats, AI insights,
 * and map layer data. Updated by Socket.io hooks and REST API calls.
 */
import { create } from "zustand";
import type {
  FeedItem,
  CountryRisk,
  PipelineStats,
  AIInsight,
  DRILevel,
  RiskHotspot,
  ClaimCluster,
  FraudArc,
  AlertIcon,
  GCCCountryCode,
} from "@/types";
import {
  RISK_HOTSPOTS,
  CLAIM_CLUSTERS,
  FRAUD_ARCS,
  ALERT_ICONS,
  SEED_FEED,
} from "@/data/gcc-geojson";

interface DataState {
  // DRI
  driLevel: DRILevel;
  setDRILevel: (level: DRILevel) => void;

  // Feed
  feedItems: FeedItem[];
  addFeedItem: (item: FeedItem) => void;
  setFeedItems: (items: FeedItem[]) => void;

  // Country risk
  countryRisks: Map<GCCCountryCode, CountryRisk>;
  updateCountryRisk: (risk: CountryRisk) => void;

  // Pipeline
  pipelineStats: PipelineStats | null;
  setPipelineStats: (stats: PipelineStats) => void;

  // AI Insights
  insights: AIInsight[];
  addInsight: (insight: AIInsight) => void;

  // Map data
  riskHotspots: RiskHotspot[];
  claimClusters: ClaimCluster[];
  fraudArcs: FraudArc[];
  alertIcons: AlertIcon[];
  addAlertIcon: (alert: AlertIcon) => void;
}

const MAX_FEED_ITEMS = 200;
const MAX_INSIGHTS = 50;

export const useDataStore = create<DataState>((set) => ({
  // DRI
  driLevel: 2,
  setDRILevel: (level) => set({ driLevel: level }),

  // Feed
  feedItems: SEED_FEED,
  addFeedItem: (item) =>
    set((state) => ({
      feedItems: [item, ...state.feedItems].slice(0, MAX_FEED_ITEMS),
    })),
  setFeedItems: (items) => set({ feedItems: items }),

  // Country risk
  countryRisks: new Map(),
  updateCountryRisk: (risk) =>
    set((state) => {
      const next = new Map(state.countryRisks);
      next.set(risk.country, risk);
      return { countryRisks: next };
    }),

  // Pipeline
  pipelineStats: null,
  setPipelineStats: (stats) => set({ pipelineStats: stats }),

  // AI Insights
  insights: [],
  addInsight: (insight) =>
    set((state) => ({
      insights: [insight, ...state.insights].slice(0, MAX_INSIGHTS),
    })),

  // Map data — initialized with seed data
  riskHotspots: RISK_HOTSPOTS,
  claimClusters: CLAIM_CLUSTERS,
  fraudArcs: FRAUD_ARCS,
  alertIcons: ALERT_ICONS,
  addAlertIcon: (alert) =>
    set((state) => ({
      alertIcons: [alert, ...state.alertIcons],
    })),
}));
