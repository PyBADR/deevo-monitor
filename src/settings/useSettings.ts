/**
 * useSettings — Zustand store for persisted application settings.
 * v4.0: 16 sections — extended with MapTile, LiveEvents, Media, Pages,
 *       Integrations, Explorer, Privacy.
 * Settings are saved to localStorage and loaded on startup.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AllSettings,
  AppearanceSettings,
  MapSettings,
  MapTileSettings,
  LiveEventsSettings,
  FeedSettings,
  AISettings,
  NotificationSettings,
  DisplaySettings,
  MediaSettings,
  PagesSettings,
  ShortcutSettings,
  DataSourceSettings,
  IntegrationSettings,
  ExplorerSettings,
  PrivacySettings,
  SettingsSection,
} from './settings.types';

// ── Defaults ────────────────────────────────────────────────────────

const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: 'dark',
  fontSize: 'md',
  fontFamily: 'mono',
  animationsEnabled: true,
  reducedMotion: false,
  accentColor: 'variant-default',
  compactMode: false,
  pageAnimation: 'fade',
  dataInkRatio: 'balanced',
  uiDensity: 'comfortable',
};

const DEFAULT_MAP: MapSettings = {
  mapStyle: 'dark',
  show3DBuildings: false,
  showLabels: true,
  showBorders: true,
  defaultZoom: 5,
  clusterThreshold: 10,
  heatmapIntensity: 0.6,
  animateFlights: true,
  showWeatherOverlay: false,
  defaultCenter: { lat: 24.5, lng: 48.0 },
};

const DEFAULT_MAP_TILE: MapTileSettings = {
  provider: 'carto',
  mapboxToken: '',
  maptilerKey: '',
  customTileUrl: '',
  tileResolution: '256',
  retina: true,
  cacheEnabled: true,
  offlineTiles: false,
};

const DEFAULT_LIVE_EVENTS: LiveEventsSettings = {
  enabled: true,
  showMilitaryEvents: true,
  showDisasterEvents: true,
  showCyberEvents: true,
  showEconomicEvents: true,
  showSocialEvents: true,
  maxEventAge: 48,
  eventDensityLimit: 200,
  flashNewEvents: true,
  eventSound: false,
  visualEarth: true,
  iotStreaming: false,
};

const DEFAULT_FEEDS: FeedSettings = {
  refreshInterval: 120,
  maxFeedItems: 200,
  showReadItems: true,
  autoMarkRead: false,
  enabledCategories: [],
  language: 'all',
  priorityFilter: 'all',
  enableSoundAlert: false,
  deduplication: true,
};

const DEFAULT_AI: AISettings = {
  provider: 'ollama',
  model: 'llama3.2',
  temperature: 0.3,
  maxTokens: 2048,
  autoSummarize: true,
  sentimentAnalysis: true,
  riskScoring: true,
  language: 'auto',
  humanInTheLoop: true,
  auditTrail: true,
  ollamaEndpoint: 'http://localhost:11434',
  ollamaModel: 'llama3.2',
  downloadOnDemand: true,
  gpuMemoryLimit: 8192,
  groqApiKey: '',
  openrouterApiKey: '',
  openaiApiKey: '',
  anthropicApiKey: '',
  fallbackChain: ['ollama', 'groq', 'openrouter', 'mock'],
  fullyLocal: false,
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  enabled: true,
  criticalAlerts: true,
  riskThresholdAlerts: true,
  feedAlerts: false,
  kpiAlerts: false,
  soundEnabled: false,
  soundVolume: 50,
  desktopNotifications: false,
  emailDigest: 'none',
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
};

const DEFAULT_DISPLAY: DisplaySettings = {
  bottomPanelHeight: 280,
  showBottomTicker: true,
  showStatusBar: true,
  showLayerPanel: true,
  showRiskLegend: true,
  kpiColumns: 6,
  dateFormat: 'us',
  timeFormat: '24h',
  timezone: 'Asia/Riyadh',
  numberFormat: 'us',
};

const DEFAULT_MEDIA: MediaSettings = {
  videoQuality: 'auto',
  keepLiveStreamRunning: false,
  autoplayVideos: false,
  mutedByDefault: true,
  webcamThumbnailSize: 'md',
  maxConcurrentStreams: 2,
  bufferSize: 5,
};

const DEFAULT_PAGES: PagesSettings = {
  defaultTab: 'feed',
  enabledPanels: [
    'feed', 'news', 'webcams', 'ai', 'posture', 'intel', 'risk',
    'strategy', 'livecase', 'finance', 'market', 'financial',
    'economical', 'premium', 'premstock', 'premnews', 'premii',
    'daily', 'energy', 'energymarket', 'gold', 'basemetals',
    'crypto', 'cryptonews', 'token', 'central', 'consumer',
    'gccbiz', 'gccmarket', 'region', 'globalnews', 'topical',
    'technology', 'telegram', 'brand', 'correlation', 'kpi',
    'forecast', 'alerts', 'pipeline',
  ],
  panelOrder: [
    'feed', 'news', 'webcams', 'ai', 'posture', 'intel', 'risk',
    'strategy', 'livecase', 'finance', 'market', 'financial',
    'economical', 'premium', 'premstock', 'premnews', 'premii',
    'daily', 'energy', 'energymarket', 'gold', 'basemetals',
    'crypto', 'cryptonews', 'token', 'central', 'consumer',
    'gccbiz', 'gccmarket', 'region', 'globalnews', 'topical',
    'technology', 'telegram', 'brand', 'correlation', 'kpi',
    'forecast', 'alerts', 'pipeline',
  ],
  pageTransition: 'fade',
  rememberLastTab: true,
  sidebarPosition: 'left',
  sidebarCollapsed: false,
};

const DEFAULT_SHORTCUTS: ShortcutSettings = {
  enabled: true,
  shortcuts: [
    { id: 'toggle-feed', label: 'Toggle Feed Panel', keys: 'Alt+1', action: 'tab:feed' },
    { id: 'toggle-ai', label: 'Toggle AI Panel', keys: 'Alt+2', action: 'tab:ai' },
    { id: 'toggle-risk', label: 'Toggle Risk Panel', keys: 'Alt+3', action: 'tab:risk' },
    { id: 'toggle-forecast', label: 'Toggle Forecasts', keys: 'Alt+4', action: 'tab:forecast' },
    { id: 'toggle-alerts', label: 'Toggle Alerts', keys: 'Alt+5', action: 'tab:alerts' },
    { id: 'toggle-pipeline', label: 'Toggle Pipeline', keys: 'Alt+6', action: 'tab:pipeline' },
    { id: 'toggle-finance', label: 'Toggle Finance', keys: 'Alt+7', action: 'tab:finance' },
    { id: 'toggle-correlation', label: 'Toggle Correlation', keys: 'Alt+8', action: 'tab:correlation' },
    { id: 'search', label: 'Search', keys: 'Ctrl+K', action: 'search' },
    { id: 'settings', label: 'Open Settings', keys: 'Ctrl+,', action: 'settings' },
    { id: 'reset-map', label: 'Reset Map View', keys: 'Ctrl+0', action: 'map:reset' },
    { id: 'fullscreen', label: 'Toggle Fullscreen', keys: 'F11', action: 'fullscreen' },
    { id: 'toggle-globe', label: 'Toggle 2D/3D', keys: 'Ctrl+G', action: 'map:toggle3d' },
  ],
};

const DEFAULT_DATASOURCES: DataSourceSettings = {
  sources: [],
  autoReconnect: true,
  maxRetries: 5,
  retryDelay: 3000,
};

const DEFAULT_INTEGRATIONS: IntegrationSettings = {
  discordWebhook: '',
  discordEnabled: false,
  browserNotifications: false,
  browserHomepage: '',
  icloudSync: false,
  exportFormat: 'json',
  shareFormat: 'png',
};

const DEFAULT_EXPLORER: ExplorerSettings = {
  defaultView: 'grid',
  groupBy: 'category',
  sortBy: 'timestamp',
  showPreview: true,
  previewSize: 'md',
  maxResults: 100,
  includeArchived: false,
};

const DEFAULT_PRIVACY: PrivacySettings = {
  telemetryEnabled: false,
  shareAnalytics: false,
  clearCacheOnExit: false,
  dataRetentionDays: 90,
  auditLogEnabled: true,
  pdplCompliance: true,
};

// ── Store ───────────────────────────────────────────────────────────

interface SettingsStore extends AllSettings {
  // Actions
  updateAppearance: (partial: Partial<AppearanceSettings>) => void;
  updateMap: (partial: Partial<MapSettings>) => void;
  updateMapTile: (partial: Partial<MapTileSettings>) => void;
  updateLiveEvents: (partial: Partial<LiveEventsSettings>) => void;
  updateFeeds: (partial: Partial<FeedSettings>) => void;
  updateAI: (partial: Partial<AISettings>) => void;
  updateNotifications: (partial: Partial<NotificationSettings>) => void;
  updateDisplay: (partial: Partial<DisplaySettings>) => void;
  updateMedia: (partial: Partial<MediaSettings>) => void;
  updatePages: (partial: Partial<PagesSettings>) => void;
  updateShortcuts: (partial: Partial<ShortcutSettings>) => void;
  updateDataSources: (partial: Partial<DataSourceSettings>) => void;
  updateIntegrations: (partial: Partial<IntegrationSettings>) => void;
  updateExplorer: (partial: Partial<ExplorerSettings>) => void;
  updatePrivacy: (partial: Partial<PrivacySettings>) => void;
  resetSection: (section: SettingsSection) => void;
  resetAll: () => void;
}

const DEFAULTS: AllSettings = {
  appearance: DEFAULT_APPEARANCE,
  map: DEFAULT_MAP,
  mapTile: DEFAULT_MAP_TILE,
  liveEvents: DEFAULT_LIVE_EVENTS,
  feeds: DEFAULT_FEEDS,
  ai: DEFAULT_AI,
  notifications: DEFAULT_NOTIFICATIONS,
  display: DEFAULT_DISPLAY,
  media: DEFAULT_MEDIA,
  pages: DEFAULT_PAGES,
  shortcuts: DEFAULT_SHORTCUTS,
  dataSources: DEFAULT_DATASOURCES,
  integrations: DEFAULT_INTEGRATIONS,
  explorer: DEFAULT_EXPLORER,
  privacy: DEFAULT_PRIVACY,
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      updateAppearance: (partial) =>
        set((s) => ({ appearance: { ...s.appearance, ...partial } })),
      updateMap: (partial) =>
        set((s) => ({ map: { ...s.map, ...partial } })),
      updateMapTile: (partial) =>
        set((s) => ({ mapTile: { ...s.mapTile, ...partial } })),
      updateLiveEvents: (partial) =>
        set((s) => ({ liveEvents: { ...s.liveEvents, ...partial } })),
      updateFeeds: (partial) =>
        set((s) => ({ feeds: { ...s.feeds, ...partial } })),
      updateAI: (partial) =>
        set((s) => ({ ai: { ...s.ai, ...partial } })),
      updateNotifications: (partial) =>
        set((s) => ({ notifications: { ...s.notifications, ...partial } })),
      updateDisplay: (partial) =>
        set((s) => ({ display: { ...s.display, ...partial } })),
      updateMedia: (partial) =>
        set((s) => ({ media: { ...s.media, ...partial } })),
      updatePages: (partial) =>
        set((s) => ({ pages: { ...s.pages, ...partial } })),
      updateShortcuts: (partial) =>
        set((s) => ({ shortcuts: { ...s.shortcuts, ...partial } })),
      updateDataSources: (partial) =>
        set((s) => ({ dataSources: { ...s.dataSources, ...partial } })),
      updateIntegrations: (partial) =>
        set((s) => ({ integrations: { ...s.integrations, ...partial } })),
      updateExplorer: (partial) =>
        set((s) => ({ explorer: { ...s.explorer, ...partial } })),
      updatePrivacy: (partial) =>
        set((s) => ({ privacy: { ...s.privacy, ...partial } })),

      resetSection: (section) =>
        set(() => ({ [section]: DEFAULTS[section] })),
      resetAll: () =>
        set(() => ({ ...DEFAULTS })),
    }),
    {
      name: 'deevo-settings',
      version: 2,
    }
  )
);
