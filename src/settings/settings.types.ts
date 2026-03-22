/**
 * Settings System — Type definitions for the 16-section settings panel.
 * v4.0: Extended with Map Tiles, Live Events, Media, Pages, Integrations,
 *       Explorer, AI Providers, and Privacy sections.
 *
 * Architecture Layer: UI (L6) — Governance (L7)
 */

// ── Appearance ──────────────────────────────────────────────────────

export interface AppearanceSettings {
  theme: 'dark' | 'light' | 'auto';
  fontSize: 'sm' | 'md' | 'lg';
  fontFamily: 'mono' | 'sans' | 'system' | 'serif' | 'arabic';
  animationsEnabled: boolean;
  reducedMotion: boolean;
  accentColor: string;          // hex override or 'variant-default'
  compactMode: boolean;
  pageAnimation: 'none' | 'fade' | 'slide' | 'scale';
  dataInkRatio: 'minimal' | 'balanced' | 'detailed';  // Tufte data-ink ratio
  uiDensity: 'compact' | 'comfortable' | 'spacious';
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

// ── Map Tile Provider ───────────────────────────────────────────────

export interface MapTileSettings {
  provider: 'carto' | 'openstreetmap' | 'mapbox' | 'esri' | 'stadia' | 'maptiler';
  mapboxToken: string;
  maptilerKey: string;
  customTileUrl: string;
  tileResolution: '256' | '512';
  retina: boolean;
  cacheEnabled: boolean;
  offlineTiles: boolean;
}

// ── Live Events ─────────────────────────────────────────────────────

export interface LiveEventsSettings {
  enabled: boolean;
  showMilitaryEvents: boolean;
  showDisasterEvents: boolean;
  showCyberEvents: boolean;
  showEconomicEvents: boolean;
  showSocialEvents: boolean;
  maxEventAge: number;           // hours — events older than this are hidden
  eventDensityLimit: number;     // max events per viewport
  flashNewEvents: boolean;
  eventSound: boolean;
  visualEarth: boolean;          // Toggle Visual Earth real-time layer
  iotStreaming: boolean;         // iCloud / IoT streaming toggle
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
  provider: 'ollama' | 'openai' | 'anthropic' | 'groq' | 'openrouter' | 'local';
  model: string;
  temperature: number;          // 0-1
  maxTokens: number;
  autoSummarize: boolean;
  sentimentAnalysis: boolean;
  riskScoring: boolean;
  language: 'en' | 'ar' | 'auto';
  humanInTheLoop: boolean;
  auditTrail: boolean;
  // Ollama-specific
  ollamaEndpoint: string;       // e.g. http://localhost:11434
  ollamaModel: string;          // e.g. llama3.2, mistral, gemma2
  downloadOnDemand: boolean;    // Auto-download model if missing
  gpuMemoryLimit: number;       // MB — restrict GPU VRAM for model
  // Provider API keys / endpoints
  groqApiKey: string;
  openrouterApiKey: string;
  openaiApiKey: string;
  anthropicApiKey: string;
  // Fallback chain
  fallbackChain: string[];      // e.g. ['ollama', 'groq', 'openrouter', 'mock']
  fullyLocal: boolean;          // Enforce zero-network AI mode
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

// ── Media ───────────────────────────────────────────────────────────

export interface MediaSettings {
  videoQuality: 'auto' | '360p' | '480p' | '720p' | '1080p';
  keepLiveStreamRunning: boolean;  // Keep live stream playing in background
  autoplayVideos: boolean;
  mutedByDefault: boolean;
  webcamThumbnailSize: 'sm' | 'md' | 'lg';
  maxConcurrentStreams: number;    // 1-4
  bufferSize: number;              // seconds of video buffer
}

// ── Pages / Panels ──────────────────────────────────────────────────

export interface PagesSettings {
  defaultTab: string;              // Which tab opens by default
  enabledPanels: string[];         // IDs of enabled bottom panels
  panelOrder: string[];            // Custom order of panels
  pageTransition: 'none' | 'fade' | 'slide';
  rememberLastTab: boolean;
  sidebarPosition: 'left' | 'right';
  sidebarCollapsed: boolean;
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

// ── Integrations ────────────────────────────────────────────────────

export interface IntegrationSettings {
  discordWebhook: string;         // Discord webhook URL for alerts
  discordEnabled: boolean;
  browserNotifications: boolean;
  browserHomepage: string;        // Custom home URL for embedded browser
  icloudSync: boolean;            // iCloud / cloud sync toggle
  exportFormat: 'json' | 'csv' | 'xlsx' | 'pdf';
  shareFormat: 'png' | 'svg' | 'pdf' | 'link';
}

// ── Explorer ────────────────────────────────────────────────────────

export interface ExplorerSettings {
  defaultView: 'grid' | 'list' | 'timeline';
  groupBy: 'none' | 'region' | 'category' | 'severity' | 'source';
  sortBy: 'timestamp' | 'severity' | 'relevance' | 'alphabetical';
  showPreview: boolean;
  previewSize: 'sm' | 'md' | 'lg';
  maxResults: number;
  includeArchived: boolean;
}

// ── Privacy ─────────────────────────────────────────────────────────

export interface PrivacySettings {
  telemetryEnabled: boolean;
  shareAnalytics: boolean;
  clearCacheOnExit: boolean;
  dataRetentionDays: number;     // 7-365
  auditLogEnabled: boolean;
  pdplCompliance: boolean;       // PDPL (Saudi) compliance mode
}

// ── Combined Settings ───────────────────────────────────────────────

export interface AllSettings {
  appearance: AppearanceSettings;
  map: MapSettings;
  mapTile: MapTileSettings;
  liveEvents: LiveEventsSettings;
  feeds: FeedSettings;
  ai: AISettings;
  notifications: NotificationSettings;
  display: DisplaySettings;
  media: MediaSettings;
  pages: PagesSettings;
  shortcuts: ShortcutSettings;
  dataSources: DataSourceSettings;
  integrations: IntegrationSettings;
  explorer: ExplorerSettings;
  privacy: PrivacySettings;
}

export type SettingsSection = keyof AllSettings;
