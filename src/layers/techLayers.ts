/**
 * Tech Variant Layers — InsurTech Hub, AI Datacenter, SAMA Sandbox map data.
 * GeoJSON-compatible feature collections for the TECH variant map layers.
 */

export interface TechHubFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    id: string;
    name: string;
    type: 'insurtech_hub' | 'ai_datacenter' | 'sama_sandbox' | 'fintech_zone';
    city: string;
    country: string;
    countryCode: string;
    description: string;
    founded?: number;
    companies?: number;
    status: 'active' | 'planned' | 'beta';
  };
}

// ── InsurTech Hubs ──────────────────────────────────────────────────

export const INSURTECH_HUBS: TechHubFeature[] = [
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [46.6753, 24.7136] },
    properties: {
      id: 'hub-riyadh', name: 'Riyadh InsurTech Hub', type: 'insurtech_hub',
      city: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA',
      description: 'Main GCC InsurTech ecosystem — SAMA sandbox, Vision 2030 accelerators',
      founded: 2019, companies: 28, status: 'active',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [55.2708, 25.2048] },
    properties: {
      id: 'hub-difc', name: 'DIFC FinTech Hive', type: 'insurtech_hub',
      city: 'Dubai', country: 'UAE', countryCode: 'AE',
      description: 'DIFC FinTech Hive — insurance innovation cluster',
      founded: 2017, companies: 42, status: 'active',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [54.6473, 24.4539] },
    properties: {
      id: 'hub-adgm', name: 'ADGM RegLab', type: 'insurtech_hub',
      city: 'Abu Dhabi', country: 'UAE', countryCode: 'AE',
      description: 'Abu Dhabi Global Market — RegLab sandbox for insurance',
      founded: 2018, companies: 18, status: 'active',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [50.5577, 26.2285] },
    properties: {
      id: 'hub-bahrain', name: 'Bahrain FinTech Bay', type: 'insurtech_hub',
      city: 'Manama', country: 'Bahrain', countryCode: 'BH',
      description: 'Bahrain FinTech Bay — InsurTech incubator',
      founded: 2018, companies: 12, status: 'active',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [47.9774, 29.3759] },
    properties: {
      id: 'hub-kuwait', name: 'Kuwait FinTech Zone', type: 'fintech_zone',
      city: 'Kuwait City', country: 'Kuwait', countryCode: 'KW',
      description: 'CBK FinTech regulatory sandbox',
      founded: 2020, companies: 8, status: 'active',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [51.531, 25.2854] },
    properties: {
      id: 'hub-qatar', name: 'Qatar FinTech Hub', type: 'fintech_zone',
      city: 'Doha', country: 'Qatar', countryCode: 'QA',
      description: 'QFC FinTech accelerator program',
      founded: 2019, companies: 10, status: 'active',
    },
  },
];

// ── AI Datacenters ──────────────────────────────────────────────────

export const AI_DATACENTERS: TechHubFeature[] = [
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [46.8, 24.85] },
    properties: {
      id: 'dc-riyadh-01', name: 'STC Cloud Riyadh', type: 'ai_datacenter',
      city: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA',
      description: 'STC hyperscale cloud — NVIDIA DGX H100 cluster for insurance AI',
      status: 'active',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [39.1728, 21.4858] },
    properties: {
      id: 'dc-jeddah-01', name: 'AWS ME (Jeddah)', type: 'ai_datacenter',
      city: 'Jeddah', country: 'Saudi Arabia', countryCode: 'SA',
      description: 'AWS Middle East region — insurance workload compute',
      status: 'active',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [55.35, 25.12] },
    properties: {
      id: 'dc-dubai-01', name: 'Azure UAE North', type: 'ai_datacenter',
      city: 'Dubai', country: 'UAE', countryCode: 'AE',
      description: 'Microsoft Azure UAE North — OpenAI inference endpoints',
      status: 'active',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [50.6, 26.1] },
    properties: {
      id: 'dc-bahrain-01', name: 'AWS ME (Bahrain)', type: 'ai_datacenter',
      city: 'Manama', country: 'Bahrain', countryCode: 'BH',
      description: 'AWS Middle East (Bahrain) — primary GCC AI compute region',
      status: 'active',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [46.55, 24.6] },
    properties: {
      id: 'dc-neom', name: 'NEOM Cognitive City DC', type: 'ai_datacenter',
      city: 'NEOM', country: 'Saudi Arabia', countryCode: 'SA',
      description: 'NEOM planned hyperscale AI datacenter — edge inference for smart insurance',
      status: 'planned',
    },
  },
];

// ── SAMA Sandbox Participants ───────────────────────────────────────

export const SAMA_SANDBOX: TechHubFeature[] = [
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [46.69, 24.71] },
    properties: {
      id: 'sama-01', name: 'SAMA InsurTech Sandbox', type: 'sama_sandbox',
      city: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA',
      description: 'SAMA regulatory sandbox — 14 active InsurTech participants (Cohort 5)',
      companies: 14, status: 'active',
    },
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [46.72, 24.74] },
    properties: {
      id: 'sama-02', name: 'SAMA Open Banking Lab', type: 'sama_sandbox',
      city: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA',
      description: 'Open banking integration testing for insurance data sharing',
      companies: 8, status: 'active',
    },
  },
];

// ── Utility: Get all tech features as GeoJSON ───────────────────────

export function getTechLayerGeoJSON() {
  return {
    type: 'FeatureCollection' as const,
    features: [...INSURTECH_HUBS, ...AI_DATACENTERS, ...SAMA_SANDBOX],
  };
}

export function getTechHubsByType(type: TechHubFeature['properties']['type']) {
  return [...INSURTECH_HUBS, ...AI_DATACENTERS, ...SAMA_SANDBOX].filter(
    (f) => f.properties.type === type
  );
}
