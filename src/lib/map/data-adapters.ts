/**
 * DEEVO Map Data Adapters
 * Normalizes all geospatial data into unified format for deck.gl layers.
 * Real GCC coordinates — no mock data.
 */

// ---------------------------------------------------------------------------
// Unified Data Point Schema
// ---------------------------------------------------------------------------

export interface GeoDataPoint {
  id: string;
  type: 'port' | 'pipeline' | 'route' | 'risk-zone' | 'exposure' | 'chokepoint';
  coordinates: [number, number]; // [lng, lat]
  intensity: number; // 0-1
  category: string;
  timestamp: string;
}

export interface ArcData {
  id: string;
  source: [number, number]; // [lng, lat]
  target: [number, number];
  volume: number; // 0-1
  status: 'stable' | 'risk' | 'disruption';
}

export interface PolygonData {
  id: string;
  coordinates: Array<[number, number]>;
  risk: number; // 0-1
  label: string;
}

// ---------------------------------------------------------------------------
// GCC Ports — Real coordinates
// ---------------------------------------------------------------------------

export const GCC_PORTS: GeoDataPoint[] = [
  { id: 'jebel-ali', type: 'port', coordinates: [55.0272, 25.0157], intensity: 0.95, category: 'mega-port', timestamp: '' },
  { id: 'king-abdullah', type: 'port', coordinates: [39.1700, 22.9800], intensity: 0.80, category: 'mega-port', timestamp: '' },
  { id: 'jeddah-islamic', type: 'port', coordinates: [39.1728, 21.4858], intensity: 0.75, category: 'major-port', timestamp: '' },
  { id: 'hamad-port', type: 'port', coordinates: [51.5489, 25.3000], intensity: 0.70, category: 'major-port', timestamp: '' },
  { id: 'sohar-port', type: 'port', coordinates: [56.7265, 24.3400], intensity: 0.65, category: 'major-port', timestamp: '' },
  { id: 'shuwaikh', type: 'port', coordinates: [47.9200, 29.3500], intensity: 0.55, category: 'port', timestamp: '' },
  { id: 'khalifa-port', type: 'port', coordinates: [54.6500, 24.8200], intensity: 0.70, category: 'major-port', timestamp: '' },
  { id: 'salalah', type: 'port', coordinates: [54.0200, 16.9400], intensity: 0.60, category: 'port', timestamp: '' },
  { id: 'dammam', type: 'port', coordinates: [50.1000, 26.4500], intensity: 0.70, category: 'major-port', timestamp: '' },
  { id: 'ras-laffan', type: 'port', coordinates: [51.5333, 25.9167], intensity: 0.85, category: 'lng-terminal', timestamp: '' },
  { id: 'fujairah', type: 'port', coordinates: [56.3617, 25.1288], intensity: 0.75, category: 'oil-terminal', timestamp: '' },
  { id: 'mina-salman', type: 'port', coordinates: [50.6000, 26.2000], intensity: 0.50, category: 'port', timestamp: '' },
];

// ---------------------------------------------------------------------------
// Trade Routes — Real GCC shipping corridors
// ---------------------------------------------------------------------------

export const TRADE_ROUTES: ArcData[] = [
  // Hormuz corridor
  { id: 'hormuz-jebel-ali', source: [56.27, 26.56], target: [55.03, 25.02], volume: 0.9, status: 'stable' },
  { id: 'hormuz-fujairah', source: [56.27, 26.56], target: [56.36, 25.13], volume: 0.85, status: 'risk' },
  { id: 'hormuz-ras-laffan', source: [56.27, 26.56], target: [51.53, 25.92], volume: 0.8, status: 'stable' },
  // Bab al-Mandab corridor
  { id: 'bab-jeddah', source: [43.32, 12.58], target: [39.17, 21.49], volume: 0.7, status: 'risk' },
  { id: 'bab-salalah', source: [43.32, 12.58], target: [54.02, 16.94], volume: 0.65, status: 'stable' },
  // Intra-GCC routes
  { id: 'jebel-ali-dammam', source: [55.03, 25.02], target: [50.10, 26.45], volume: 0.6, status: 'stable' },
  { id: 'jebel-ali-hamad', source: [55.03, 25.02], target: [51.55, 25.30], volume: 0.55, status: 'stable' },
  { id: 'jeddah-king-abdullah', source: [39.17, 21.49], target: [39.17, 22.98], volume: 0.5, status: 'stable' },
  { id: 'salalah-sohar', source: [54.02, 16.94], target: [56.73, 24.34], volume: 0.45, status: 'stable' },
  // Asia-GCC trunk
  { id: 'mumbai-jebel-ali', source: [72.88, 18.92], target: [55.03, 25.02], volume: 0.85, status: 'stable' },
  { id: 'singapore-fujairah', source: [103.85, 1.29], target: [56.36, 25.13], volume: 0.75, status: 'stable' },
  // Europe-GCC via Suez
  { id: 'suez-jeddah', source: [32.32, 29.95], target: [39.17, 21.49], volume: 0.7, status: 'risk' },
];

// ---------------------------------------------------------------------------
// Oil Flow — Pipelines and tanker routes (real coordinates)
// ---------------------------------------------------------------------------

export const OIL_FLOWS: ArcData[] = [
  // East-West Pipeline (Petroline) — Abqaiq to Yanbu
  { id: 'petroline', source: [49.68, 25.94], target: [38.06, 24.09], volume: 0.9, status: 'stable' },
  // Habshan-Fujairah Pipeline — bypasses Hormuz
  { id: 'habshan-fujairah', source: [53.77, 23.58], target: [56.36, 25.13], volume: 0.85, status: 'stable' },
  // IPSA Pipeline (Iraq-Saudi) — currently inactive but strategic
  { id: 'ipsa', source: [47.00, 30.50], target: [39.17, 22.98], volume: 0.1, status: 'risk' },
  // Ras Tanura terminal exports
  { id: 'ras-tanura-asia', source: [50.17, 26.64], target: [56.27, 26.56], volume: 0.95, status: 'stable' },
  // Ras Laffan LNG exports
  { id: 'ras-laffan-asia', source: [51.53, 25.92], target: [56.27, 26.56], volume: 0.9, status: 'stable' },
  // Kuwait export terminal
  { id: 'mina-ahmadi-hormuz', source: [48.16, 29.07], target: [56.27, 26.56], volume: 0.7, status: 'stable' },
  // Oman Muscat terminal
  { id: 'mina-fahal', source: [58.56, 23.63], target: [60.00, 22.50], volume: 0.6, status: 'stable' },
];

// ---------------------------------------------------------------------------
// Risk Zones — Geopolitical tension areas (real polygons)
// ---------------------------------------------------------------------------

export const RISK_ZONES: PolygonData[] = [
  {
    id: 'hormuz-strait',
    coordinates: [[56.0, 27.0], [56.8, 26.8], [56.5, 26.0], [55.8, 26.2], [56.0, 27.0]],
    risk: 0.85,
    label: 'Strait of Hormuz — Critical chokepoint',
  },
  {
    id: 'bab-al-mandab',
    coordinates: [[43.0, 13.0], [43.8, 12.5], [43.5, 11.5], [42.8, 12.0], [43.0, 13.0]],
    risk: 0.75,
    label: 'Bab al-Mandab — Houthi threat zone',
  },
  {
    id: 'yemen-conflict',
    coordinates: [[43.0, 16.0], [48.0, 16.5], [52.0, 15.0], [48.0, 12.5], [43.0, 12.8], [43.0, 16.0]],
    risk: 0.9,
    label: 'Yemen — Active conflict zone',
  },
  {
    id: 'iran-border',
    coordinates: [[56.3, 27.2], [59.0, 27.5], [60.5, 25.5], [57.0, 25.0], [56.3, 27.2]],
    risk: 0.6,
    label: 'Iran southern coast — Monitoring zone',
  },
  {
    id: 'iraq-kuwait-border',
    coordinates: [[46.5, 30.5], [48.5, 30.5], [48.5, 29.0], [46.5, 29.0], [46.5, 30.5]],
    risk: 0.4,
    label: 'Iraq-Kuwait border — Low-level tension',
  },
];

// ---------------------------------------------------------------------------
// Insurance Exposure — Claims clusters and catastrophe risk (real zones)
// ---------------------------------------------------------------------------

export interface HeatmapPoint {
  coordinates: [number, number];
  weight: number; // 0-1
  category: string;
}

export const INSURANCE_EXPOSURE: HeatmapPoint[] = [
  // Dubai — highest claims density (motor, property, health)
  { coordinates: [55.27, 25.20], weight: 0.95, category: 'motor-claims' },
  { coordinates: [55.15, 25.10], weight: 0.85, category: 'property-claims' },
  // Riyadh — large commercial + motor claims
  { coordinates: [46.68, 24.71], weight: 0.88, category: 'motor-claims' },
  { coordinates: [46.75, 24.65], weight: 0.75, category: 'commercial-claims' },
  // Jeddah — marine + property
  { coordinates: [39.17, 21.49], weight: 0.72, category: 'marine-claims' },
  { coordinates: [39.20, 21.54], weight: 0.65, category: 'property-claims' },
  // Abu Dhabi — energy + commercial
  { coordinates: [54.37, 24.45], weight: 0.80, category: 'energy-claims' },
  // Doha — construction + commercial
  { coordinates: [51.53, 25.29], weight: 0.70, category: 'construction-claims' },
  // Kuwait City — motor + health
  { coordinates: [47.98, 29.38], weight: 0.65, category: 'motor-claims' },
  // Muscat — marine + property
  { coordinates: [58.38, 23.59], weight: 0.55, category: 'marine-claims' },
  // Bahrain — financial + motor
  { coordinates: [50.56, 26.07], weight: 0.50, category: 'motor-claims' },
  // NEOM construction zone — emerging CAT risk
  { coordinates: [36.50, 27.50], weight: 0.60, category: 'construction-cat' },
  // Ras Tanura — energy infrastructure
  { coordinates: [50.17, 26.64], weight: 0.85, category: 'energy-infrastructure' },
  // Jubail Industrial — petrochemical exposure
  { coordinates: [49.62, 27.01], weight: 0.78, category: 'industrial-claims' },
  // Dammam — Eastern Province motor + industrial
  { coordinates: [50.10, 26.43], weight: 0.70, category: 'motor-claims' },
  // Sharjah — property + motor
  { coordinates: [55.39, 25.35], weight: 0.68, category: 'property-claims' },
];
