/**
 * Global type declarations for third-party modules without type definitions.
 * Architecture Layer: Data (L1) — type contracts
 */

// Vite environment types
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_WS_URL?: string;
  readonly VITE_SOCKET_URL?: string;
  readonly VITE_MAPBOX_TOKEN?: string;
  readonly VITE_OLLAMA_URL?: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'globe.gl' {
  const Globe: any;
  export default Globe;
}

declare module 'react-map-gl/maplibre' {
  export const Map: any;
  export const Marker: any;
  export const Popup: any;
  export const NavigationControl: any;
  export const Source: any;
  export const Layer: any;
}

declare module '@deck.gl/layers' {
  export const ScatterplotLayer: any;
  export const ArcLayer: any;
  export const IconLayer: any;
  export const TextLayer: any;
  export const LineLayer: any;
}

declare module '@deck.gl/aggregation-layers' {
  export const HeatmapLayer: any;
  export const HexagonLayer: any;
}

declare module '@deck.gl/react' {
  const DeckGL: any;
  export default DeckGL;
}

declare module 'date-fns' {
  export function formatDistanceToNow(date: Date | number, options?: any): string;
  export function format(date: Date | number, formatStr: string, options?: any): string;
  export function parseISO(dateString: string): Date;
  export function isToday(date: Date | number): boolean;
  export function isYesterday(date: Date | number): boolean;
  export function subHours(date: Date | number, amount: number): Date;
  export function subDays(date: Date | number, amount: number): Date;
  export function differenceInMinutes(dateLeft: Date, dateRight: Date): number;
}
