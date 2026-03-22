/**
 * Settings System — Type definitions for the 8-section settings panel.
 * Sections: Appearance, Map, Feeds, AI, Notifications, Display, Shortcuts, Data Sources.
 */

// ── Appearance ──────────────────────────────────────────────────────

export interface AppearanceSettings {
  theme: 'dark' | 'light' | 'auto';
  fontSize: 'sm' | 'md' | 'lg';
  fontFamily: 'mono' | 'sans' | 'system';
  animationsEnabled: boolean;
  reducedMotion: boolean;
  accentColor: string;          // hex override or 'variant-default'
  compactMode: boolean;
}

// ── Map ─────────────────────────────────────────────────────────────

export interface MapSettings {
  mapStyle: 'dark' | 'satellite' | 'light' | 'terrain';
  show3DBuildings: boolean;
  showLabels: boolean;
  showBorders: boolean;
  defaultZoom: number;          // 1-18
  clusterThreshold: number;     // min points before clustering
  heatmapIntensity: number;     // 0-1
  animateFlights: boolean;
  showWeatherOverlay: boolean;
  defaultCenter: { lat: number; lng: number };
}

// ── Feeds ───────────────────────────────────────────────────────────

export interface FeedSettings {
  refreshInterval: number;      // seconds
  maxFeedItems: number;
  showReadItems: boolean;
  autoMarkRead: boolean;
  enabledCategories: string[];
  language: 'all' | 'en' | 'ar' | 'fr';
  priorityFilter: 'all' | 'high' | 'critical';
  enableSoundAlert: boolean;
  deduplication: boolean;
}

// ── AI ──────────────────────────────────────────────────────────────

export interface AISettings {
  provider: 'ollama' | 'openai' | 'anthropic' | 'local';
  model: string;
  temperature: number;          // 0-1
  maxTokens: number;
  autoSummarize: boolean;
  sentimentAnalysis: boolean;
  riskScoring: boolean;
  language: 'en' | 'ar' | 'auto';
  humanInTheLoop: boolean;
  auditTrail: boolean;
}

// ── Notifications ───────────────────────────────────────────────────

export interface NotificationSettings {
  enabled: boolean;
  criticalAlerts: boolean;
  riskThresholdAlerts: boolean;
  feedAlerts: boolean;
  kpiAlerts: boolean;
  soundEnabled: boolean;
  soundVolume: number;          // 0-100
  desktopNotifications: boolean;
  emailDigest: 'none' | 'daily' | 'weekly';
  quietHoursStart: string;      // 'HH:MM'
  quietHoursEnd: string;
}

// ── Display ─────────────────────────────────────────────────────────

export interface DisplaySettings {
  bottomPanelHeight: number;    // px
  showBottomTicker: boolean;
  showStatusBar: boolean;
  showLayerPanel: boolean;
  showRiskLegend: boolean;
  kpiColumns: number;           // 2-8
  dateFormat: 'us' | 'eu' | 'iso';
  timeFormat: '12h' | '24h';
  timezone: string;             // IANA timezone
  numberFormat: 'us' | 'eu' | 'ar';
}

// ── Shortcuts ───────────────────────────────────────────────────────

export interface KeyboardShortcut {
  id: string;
  label: string;
  keys: string;                 // e.g. 'Ctrl+K', 'Alt+1'
  action: string;
}

export interface ShortcutSettings {
  enabled: boolean;
  shortcuts: KeyboardShortcut[];
}

// ── Data Sources ────────────────────────────────────────────────────

export interface DataSourceConfig {
  id: string;
  name: string;
  type: 'rss' | 'api' | 'websocket' | 'database';
  url: string;
  enabled: boolean;
  refreshInterval: number;
  lastSync: number;
  status: 'connected' | 'disconnected' | 'error';
  credentials?: {
    apiKey?: string;
    authType?: 'none' | 'bearer' | 'basic' | 'oauth';
  };
}

export interface DataSourceSettings {
  sources: DataSourceConfig[];
  autoReconnect: boolean;
  maxRetries: number;
  retryDelay: number;
}

// ── Combined Settings ───────────────────────────────────────────────

export interface AllSettings {
  appearance: AppearanceSettings;
  map: MapSettings;
  feeds: FeedSettings;
  ai: AISettings;
  notifications: NotificationSettings;
  display: DisplaySettings;
  shortcuts: ShortcutSettings;
  dataSources: DataSourceSettings;
}

export type SettingsSection = keyof AllSettings;
