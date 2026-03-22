/**
 * useSettings — Zustand store for persisted application settings.
 * Settings are saved to localStorage and loaded on startup.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AllSettings,
  AppearanceSettings,
  MapSettings,
  FeedSettings,
  AISettings,
  NotificationSettings,
  DisplaySettings,
  ShortcutSettings,
  DataSourceSettings,
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

const DEFAULT_SHORTCUTS: ShortcutSettings = {
  enabled: true,
  shortcuts: [
    { id: 'toggle-feed', label: 'Toggle Feed Panel', keys: 'Alt+1', action: 'tab:feed' },
    { id: 'toggle-ai', label: 'Toggle AI Panel', keys: 'Alt+2', action: 'tab:ai' },
    { id: 'toggle-risk', label: 'Toggle Risk Panel', keys: 'Alt+3', action: 'tab:risk' },
    { id: 'toggle-forecast', label: 'Toggle Forecasts', keys: 'Alt+4', action: 'tab:forecast' },
    { id: 'toggle-alerts', label: 'Toggle Alerts', keys: 'Alt+5', action: 'tab:alerts' },
    { id: 'toggle-pipeline', label: 'Toggle Pipeline', keys: 'Alt+6', action: 'tab:pipeline' },
    { id: 'search', label: 'Search', keys: 'Ctrl+K', action: 'search' },
    { id: 'settings', label: 'Open Settings', keys: 'Ctrl+,', action: 'settings' },
    { id: 'reset-map', label: 'Reset Map View', keys: 'Ctrl+0', action: 'map:reset' },
    { id: 'fullscreen', label: 'Toggle Fullscreen', keys: 'F11', action: 'fullscreen' },
  ],
};

const DEFAULT_DATASOURCES: DataSourceSettings = {
  sources: [],
  autoReconnect: true,
  maxRetries: 5,
  retryDelay: 3000,
};

// ── Store ───────────────────────────────────────────────────────────

interface SettingsStore extends AllSettings {
  // Actions
  updateAppearance: (partial: Partial<AppearanceSettings>) => void;
  updateMap: (partial: Partial<MapSettings>) => void;
  updateFeeds: (partial: Partial<FeedSettings>) => void;
  updateAI: (partial: Partial<AISettings>) => void;
  updateNotifications: (partial: Partial<NotificationSettings>) => void;
  updateDisplay: (partial: Partial<DisplaySettings>) => void;
  updateShortcuts: (partial: Partial<ShortcutSettings>) => void;
  updateDataSources: (partial: Partial<DataSourceSettings>) => void;
  resetSection: (section: SettingsSection) => void;
  resetAll: () => void;
}

const DEFAULTS: AllSettings = {
  appearance: DEFAULT_APPEARANCE,
  map: DEFAULT_MAP,
  feeds: DEFAULT_FEEDS,
  ai: DEFAULT_AI,
  notifications: DEFAULT_NOTIFICATIONS,
  display: DEFAULT_DISPLAY,
  shortcuts: DEFAULT_SHORTCUTS,
  dataSources: DEFAULT_DATASOURCES,
};

export const useSettings = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      updateAppearance: (partial) =>
        set((s) => ({ appearance: { ...s.appearance, ...partial } })),
      updateMap: (partial) =>
        set((s) => ({ map: { ...s.map, ...partial } })),
      updateFeeds: (partial) =>
        set((s) => ({ feeds: { ...s.feeds, ...partial } })),
      updateAI: (partial) =>
        set((s) => ({ ai: { ...s.ai, ...partial } })),
      updateNotifications: (partial) =>
        set((s) => ({ notifications: { ...s.notifications, ...partial } })),
      updateDisplay: (partial) =>
        set((s) => ({ display: { ...s.display, ...partial } })),
      updateShortcuts: (partial) =>
        set((s) => ({ shortcuts: { ...s.shortcuts, ...partial } })),
      updateDataSources: (partial) =>
        set((s) => ({ dataSources: { ...s.dataSources, ...partial } })),

      resetSection: (section) =>
        set(() => ({ [section]: DEFAULTS[section] })),
      resetAll: () =>
        set(() => ({ ...DEFAULTS })),
    }),
    {
      name: 'deevo-settings',
      version: 1,
    }
  )
);
