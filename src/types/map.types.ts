/**
 * Map domain types — viewport, layer config, GeoJSON features.
 */

export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  transitionDuration?: number;
}

export interface LayerConfig {
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
  featureCount?: number;
}

export type TimeRange = "1h" | "6h" | "24h" | "7d" | "30d";

export interface MapState {
  viewport: MapViewport;
  layers: Record<string, boolean>;
  is3D: boolean;
  selectedRegion: string | null;
  hoveredFeature: GeoFeature | null;
  timeRange: TimeRange;
}

export interface GeoFeature {
  type: "Feature";
  properties: {
    code: string;
    name: string;
    nameAr: string;
    capital: string;
    [key: string]: unknown;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][];
  };
}

export interface InfraPoint {
  id: string;
  lat: number;
  lon: number;
  name: string;
  type: "airport" | "port" | "oilfield" | "refinery" | "hospital" | "ftz";
  country: string;
}

/** 20 key GCC infrastructure points */
export const GCC_INFRASTRUCTURE: InfraPoint[] = [
  { id: "infra-1", lat: 29.2266, lon: 47.9689, name: "Kuwait Intl Airport", type: "airport", country: "KW" },
  { id: "infra-2", lat: 29.0823, lon: 48.0766, name: "Ahmadi Oil Field", type: "oilfield", country: "KW" },
  { id: "infra-3", lat: 29.358, lon: 47.932, name: "Shuwaikh Port", type: "port", country: "KW" },
  { id: "infra-4", lat: 24.9578, lon: 46.6989, name: "King Khalid Intl Airport", type: "airport", country: "SA" },
  { id: "infra-5", lat: 21.6796, lon: 39.1568, name: "Jeddah Islamic Port", type: "port", country: "SA" },
  { id: "infra-6", lat: 26.392, lon: 50.198, name: "Ras Tanura Refinery", type: "refinery", country: "SA" },
  { id: "infra-7", lat: 26.4667, lon: 50.1, name: "Dammam Port", type: "port", country: "SA" },
  { id: "infra-8", lat: 25.2532, lon: 55.3657, name: "Dubai Intl Airport", type: "airport", country: "AE" },
  { id: "infra-9", lat: 25.0, lon: 55.1, name: "Jebel Ali FTZ", type: "ftz", country: "AE" },
  { id: "infra-10", lat: 24.443, lon: 54.651, name: "Abu Dhabi Airport", type: "airport", country: "AE" },
  { id: "infra-11", lat: 24.88, lon: 54.87, name: "Ruwais Refinery", type: "refinery", country: "AE" },
  { id: "infra-12", lat: 25.261, lon: 51.565, name: "Hamad Intl Airport", type: "airport", country: "QA" },
  { id: "infra-13", lat: 25.3, lon: 51.53, name: "Hamad Port", type: "port", country: "QA" },
  { id: "infra-14", lat: 25.9257, lon: 50.6, name: "Bahrain Intl Airport", type: "airport", country: "BH" },
  { id: "infra-15", lat: 26.2, lon: 50.56, name: "Bahrain Financial Harbour", type: "ftz", country: "BH" },
  { id: "infra-16", lat: 23.5933, lon: 58.2844, name: "Muscat Intl Airport", type: "airport", country: "OM" },
  { id: "infra-17", lat: 23.62, lon: 58.57, name: "Port Sultan Qaboos", type: "port", country: "OM" },
  { id: "infra-18", lat: 24.44, lon: 56.72, name: "Sohar Refinery", type: "refinery", country: "OM" },
  { id: "infra-19", lat: 25.17, lon: 55.37, name: "Dubai Healthcare City", type: "hospital", country: "AE" },
  { id: "infra-20", lat: 24.72, lon: 46.62, name: "King Faisal Hospital Riyadh", type: "hospital", country: "SA" },
];
