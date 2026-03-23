/**
 * DEEVO SaaS — Role-Based Access Control
 * Tiers: FREE (Demo), PRO (Enterprise), GOVERNMENT
 * Roles: Analyst, Executive, Admin
 */

export type PlanTier = 'free' | 'pro' | 'government';
export type UserRole = 'analyst' | 'executive' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tier: PlanTier;
  country: string; // GCC country code
  organization: string;
  createdAt: string;
}

export interface FeatureAccess {
  maxPanels: number;
  realtimeFeeds: boolean;
  aiDecisionEngine: boolean;
  scenarioSimulation: boolean;
  mapLayers: number;
  exportReports: boolean;
  sectorIntelligence: boolean;
  gdpDashboard: boolean;
  apiAccess: boolean;
}

export const TIER_ACCESS: Record<PlanTier, FeatureAccess> = {
  free: {
    maxPanels: 3,
    realtimeFeeds: false,
    aiDecisionEngine: false,
    scenarioSimulation: false,
    mapLayers: 2,
    exportReports: false,
    sectorIntelligence: false,
    gdpDashboard: false,
    apiAccess: false,
  },
  pro: {
    maxPanels: 6,
    realtimeFeeds: true,
    aiDecisionEngine: true,
    scenarioSimulation: false,
    mapLayers: 4,
    exportReports: true,
    sectorIntelligence: true,
    gdpDashboard: true,
    apiAccess: true,
  },
  government: {
    maxPanels: 6,
    realtimeFeeds: true,
    aiDecisionEngine: true,
    scenarioSimulation: true,
    mapLayers: 4,
    exportReports: true,
    sectorIntelligence: true,
    gdpDashboard: true,
    apiAccess: true,
  },
};

export function hasAccess(tier: PlanTier, feature: keyof FeatureAccess): boolean {
  const access = TIER_ACCESS[tier];
  const value = access[feature];
  return typeof value === 'boolean' ? value : (value as number) > 0;
}

export function getFeatureAccess(tier: PlanTier): FeatureAccess {
  return TIER_ACCESS[tier];
}
