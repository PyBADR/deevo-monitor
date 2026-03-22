/**
 * SettingsPanel — Full settings modal with 8 sections.
 * Rendered as an overlay triggered from StatusBar or keyboard shortcut.
 */
import { useState } from 'react';
import { useSettings } from '@/settings/useSettings';
import { useVariant } from '@/variants';
import { clsx } from 'clsx';
import type { SettingsSection } from '@/settings/settings.types';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

const SECTIONS: { id: SettingsSection; label: string; icon: string }[] = [
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'map', label: 'Map', icon: '🗺️' },
  { id: 'feeds', label: 'Feeds', icon: '📡' },
  { id: 'ai', label: 'AI Engine', icon: '🤖' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'display', label: 'Display', icon: '🖥️' },
  { id: 'shortcuts', label: 'Shortcuts', icon: '⌨️' },
  { id: 'dataSources', label: 'Data Sources', icon: '🔌' },
];

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { variant } = useVariant();
  const [activeSection, setActiveSection] = useState<SettingsSection>('appearance');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative w-[800px] max-w-[90vw] h-[600px] max-h-[85vh] rounded-xl border shadow-2xl flex overflow-hidden"
        style={{
          backgroundColor: variant.colors.surface,
          borderColor: variant.colors.border,
        }}
      >
        {/* Sidebar */}
        <div
          className="w-48 shrink-0 border-r flex flex-col"
          style={{ borderColor: variant.colors.border, backgroundColor: variant.colors.bg }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: variant.colors.border }}>
            <span className="text-sm font-bold" style={{ color: variant.colors.text }}>
              Settings
            </span>
          </div>
          <nav className="flex-1 py-2 overflow-y-auto">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={clsx(
                  'w-full flex items-center gap-2 px-4 py-2 text-[11px] font-mono transition-colors text-left',
                  activeSection === s.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                )}
                style={
                  activeSection === s.id
                    ? { backgroundColor: `${variant.colors.primary}15`, color: variant.colors.primary }
                    : undefined
                }
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </nav>
          <div className="px-4 py-2 border-t" style={{ borderColor: variant.colors.border }}>
            <button
              onClick={() => useSettings.getState().resetAll()}
              className="text-[10px] font-mono text-gray-500 hover:text-red-400 transition-colors"
            >
              Reset All Settings
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-3 border-b shrink-0"
            style={{ borderColor: variant.colors.border }}
          >
            <div className="flex items-center gap-2">
              <span>{SECTIONS.find((s) => s.id === activeSection)?.icon}</span>
              <span className="text-sm font-bold" style={{ color: variant.colors.text }}>
                {SECTIONS.find((s) => s.id === activeSection)?.label}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
              style={{ color: variant.colors.textMuted }}
            >
              ✕
            </button>
          </div>

          {/* Section content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeSection === 'appearance' && <AppearanceSection />}
            {activeSection === 'map' && <MapSection />}
            {activeSection === 'feeds' && <FeedSection />}
            {activeSection === 'ai' && <AISection />}
            {activeSection === 'notifications' && <NotificationSection />}
            {activeSection === 'display' && <DisplaySection />}
            {activeSection === 'shortcuts' && <ShortcutSection />}
            {activeSection === 'dataSources' && <DataSourceSection />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reusable Setting Controls ───────────────────────────────────────

function SettingRow({ label, description, children }: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  const { variant } = useVariant();
  return (
    <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: variant.colors.border }}>
      <div className="flex-1 min-w-0 mr-4">
        <div className="text-[11px] font-mono font-bold" style={{ color: variant.colors.text }}>
          {label}
        </div>
        {description && (
          <div className="text-[10px] mt-0.5" style={{ color: variant.colors.textMuted }}>
            {description}
          </div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const { variant } = useVariant();
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-9 h-5 rounded-full relative transition-colors"
      style={{ backgroundColor: checked ? variant.colors.primary : '#374151' }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
        style={{ left: checked ? '18px' : '2px' }}
      />
    </button>
  );
}

function Select<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const { variant } = useVariant();
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="text-[10px] font-mono px-2 py-1 rounded border bg-transparent"
      style={{ borderColor: variant.colors.border, color: variant.colors.text }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ backgroundColor: variant.colors.bg }}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function NumberInput({ value, min, max, step, onChange }: {
  value: number; min: number; max: number; step?: number; onChange: (v: number) => void;
}) {
  const { variant } = useVariant();
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step ?? 1}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-20 text-[10px] font-mono px-2 py-1 rounded border bg-transparent text-right"
      style={{ borderColor: variant.colors.border, color: variant.colors.text }}
    />
  );
}

// ── Section Components ──────────────────────────────────────────────

function AppearanceSection() {
  const { appearance, updateAppearance } = useSettings();
  return (
    <div>
      <SettingRow label="Theme" description="Dark, light, or auto based on system preference">
        <Select value={appearance.theme} options={[
          { value: 'dark', label: 'Dark' },
          { value: 'light', label: 'Light' },
          { value: 'auto', label: 'Auto' },
        ]} onChange={(v) => updateAppearance({ theme: v })} />
      </SettingRow>
      <SettingRow label="Font Size">
        <Select value={appearance.fontSize} options={[
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ]} onChange={(v) => updateAppearance({ fontSize: v })} />
      </SettingRow>
      <SettingRow label="Font Family">
        <Select value={appearance.fontFamily} options={[
          { value: 'mono', label: 'Monospace' },
          { value: 'sans', label: 'Sans-Serif' },
          { value: 'system', label: 'System' },
        ]} onChange={(v) => updateAppearance({ fontFamily: v })} />
      </SettingRow>
      <SettingRow label="Animations" description="Enable UI animations and transitions">
        <Toggle checked={appearance.animationsEnabled} onChange={(v) => updateAppearance({ animationsEnabled: v })} />
      </SettingRow>
      <SettingRow label="Reduced Motion" description="Minimize motion for accessibility">
        <Toggle checked={appearance.reducedMotion} onChange={(v) => updateAppearance({ reducedMotion: v })} />
      </SettingRow>
      <SettingRow label="Compact Mode" description="Reduce padding and spacing">
        <Toggle checked={appearance.compactMode} onChange={(v) => updateAppearance({ compactMode: v })} />
      </SettingRow>
    </div>
  );
}

function MapSection() {
  const { map, updateMap } = useSettings();
  return (
    <div>
      <SettingRow label="Map Style">
        <Select value={map.mapStyle} options={[
          { value: 'dark', label: 'Dark' },
          { value: 'satellite', label: 'Satellite' },
          { value: 'light', label: 'Light' },
          { value: 'terrain', label: 'Terrain' },
        ]} onChange={(v) => updateMap({ mapStyle: v })} />
      </SettingRow>
      <SettingRow label="Default Zoom">
        <NumberInput value={map.defaultZoom} min={1} max={18} onChange={(v) => updateMap({ defaultZoom: v })} />
      </SettingRow>
      <SettingRow label="3D Buildings">
        <Toggle checked={map.show3DBuildings} onChange={(v) => updateMap({ show3DBuildings: v })} />
      </SettingRow>
      <SettingRow label="Labels">
        <Toggle checked={map.showLabels} onChange={(v) => updateMap({ showLabels: v })} />
      </SettingRow>
      <SettingRow label="Borders">
        <Toggle checked={map.showBorders} onChange={(v) => updateMap({ showBorders: v })} />
      </SettingRow>
      <SettingRow label="Weather Overlay">
        <Toggle checked={map.showWeatherOverlay} onChange={(v) => updateMap({ showWeatherOverlay: v })} />
      </SettingRow>
      <SettingRow label="Animate Flights">
        <Toggle checked={map.animateFlights} onChange={(v) => updateMap({ animateFlights: v })} />
      </SettingRow>
      <SettingRow label="Heatmap Intensity">
        <NumberInput value={map.heatmapIntensity} min={0} max={1} step={0.1} onChange={(v) => updateMap({ heatmapIntensity: v })} />
      </SettingRow>
      <SettingRow label="Cluster Threshold" description="Minimum points to activate clustering">
        <NumberInput value={map.clusterThreshold} min={2} max={100} onChange={(v) => updateMap({ clusterThreshold: v })} />
      </SettingRow>
    </div>
  );
}

function FeedSection() {
  const { feeds, updateFeeds } = useSettings();
  return (
    <div>
      <SettingRow label="Refresh Interval" description="Seconds between feed updates">
        <NumberInput value={feeds.refreshInterval} min={30} max={600} onChange={(v) => updateFeeds({ refreshInterval: v })} />
      </SettingRow>
      <SettingRow label="Max Feed Items">
        <NumberInput value={feeds.maxFeedItems} min={50} max={1000} onChange={(v) => updateFeeds({ maxFeedItems: v })} />
      </SettingRow>
      <SettingRow label="Language Filter">
        <Select value={feeds.language} options={[
          { value: 'all', label: 'All Languages' },
          { value: 'en', label: 'English' },
          { value: 'ar', label: 'Arabic' },
          { value: 'fr', label: 'French' },
        ]} onChange={(v) => updateFeeds({ language: v })} />
      </SettingRow>
      <SettingRow label="Priority Filter">
        <Select value={feeds.priorityFilter} options={[
          { value: 'all', label: 'All' },
          { value: 'high', label: 'High Only' },
          { value: 'critical', label: 'Critical Only' },
        ]} onChange={(v) => updateFeeds({ priorityFilter: v })} />
      </SettingRow>
      <SettingRow label="Show Read Items">
        <Toggle checked={feeds.showReadItems} onChange={(v) => updateFeeds({ showReadItems: v })} />
      </SettingRow>
      <SettingRow label="Auto Mark Read">
        <Toggle checked={feeds.autoMarkRead} onChange={(v) => updateFeeds({ autoMarkRead: v })} />
      </SettingRow>
      <SettingRow label="Deduplication">
        <Toggle checked={feeds.deduplication} onChange={(v) => updateFeeds({ deduplication: v })} />
      </SettingRow>
      <SettingRow label="Sound Alert for New Items">
        <Toggle checked={feeds.enableSoundAlert} onChange={(v) => updateFeeds({ enableSoundAlert: v })} />
      </SettingRow>
    </div>
  );
}

function AISection() {
  const { ai, updateAI } = useSettings();
  return (
    <div>
      <SettingRow label="AI Provider">
        <Select value={ai.provider} options={[
          { value: 'ollama', label: 'Ollama (Local)' },
          { value: 'openai', label: 'OpenAI' },
          { value: 'anthropic', label: 'Anthropic' },
          { value: 'local', label: 'Local Model' },
        ]} onChange={(v) => updateAI({ provider: v })} />
      </SettingRow>
      <SettingRow label="Model" description="LLM model identifier">
        <input
          type="text"
          value={ai.model}
          onChange={(e) => updateAI({ model: e.target.value })}
          className="text-[10px] font-mono px-2 py-1 rounded border bg-transparent w-36"
          style={{ borderColor: useVariant().variant.colors.border, color: useVariant().variant.colors.text }}
        />
      </SettingRow>
      <SettingRow label="Temperature" description="0 = deterministic, 1 = creative">
        <NumberInput value={ai.temperature} min={0} max={1} step={0.1} onChange={(v) => updateAI({ temperature: v })} />
      </SettingRow>
      <SettingRow label="Max Tokens">
        <NumberInput value={ai.maxTokens} min={256} max={8192} step={256} onChange={(v) => updateAI({ maxTokens: v })} />
      </SettingRow>
      <SettingRow label="Auto Summarize" description="Automatically summarize new feed items">
        <Toggle checked={ai.autoSummarize} onChange={(v) => updateAI({ autoSummarize: v })} />
      </SettingRow>
      <SettingRow label="Sentiment Analysis">
        <Toggle checked={ai.sentimentAnalysis} onChange={(v) => updateAI({ sentimentAnalysis: v })} />
      </SettingRow>
      <SettingRow label="Risk Scoring">
        <Toggle checked={ai.riskScoring} onChange={(v) => updateAI({ riskScoring: v })} />
      </SettingRow>
      <SettingRow label="Human-in-the-Loop" description="Require approval for high-impact AI decisions">
        <Toggle checked={ai.humanInTheLoop} onChange={(v) => updateAI({ humanInTheLoop: v })} />
      </SettingRow>
      <SettingRow label="Audit Trail" description="SHA-256 hash all AI decisions for compliance">
        <Toggle checked={ai.auditTrail} onChange={(v) => updateAI({ auditTrail: v })} />
      </SettingRow>
    </div>
  );
}

function NotificationSection() {
  const { notifications, updateNotifications } = useSettings();
  return (
    <div>
      <SettingRow label="Notifications Enabled">
        <Toggle checked={notifications.enabled} onChange={(v) => updateNotifications({ enabled: v })} />
      </SettingRow>
      <SettingRow label="Critical Alerts">
        <Toggle checked={notifications.criticalAlerts} onChange={(v) => updateNotifications({ criticalAlerts: v })} />
      </SettingRow>
      <SettingRow label="Risk Threshold Alerts">
        <Toggle checked={notifications.riskThresholdAlerts} onChange={(v) => updateNotifications({ riskThresholdAlerts: v })} />
      </SettingRow>
      <SettingRow label="Feed Alerts">
        <Toggle checked={notifications.feedAlerts} onChange={(v) => updateNotifications({ feedAlerts: v })} />
      </SettingRow>
      <SettingRow label="KPI Alerts">
        <Toggle checked={notifications.kpiAlerts} onChange={(v) => updateNotifications({ kpiAlerts: v })} />
      </SettingRow>
      <SettingRow label="Sound">
        <Toggle checked={notifications.soundEnabled} onChange={(v) => updateNotifications({ soundEnabled: v })} />
      </SettingRow>
      <SettingRow label="Sound Volume">
        <NumberInput value={notifications.soundVolume} min={0} max={100} onChange={(v) => updateNotifications({ soundVolume: v })} />
      </SettingRow>
      <SettingRow label="Desktop Notifications">
        <Toggle checked={notifications.desktopNotifications} onChange={(v) => updateNotifications({ desktopNotifications: v })} />
      </SettingRow>
      <SettingRow label="Email Digest">
        <Select value={notifications.emailDigest} options={[
          { value: 'none', label: 'None' },
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
        ]} onChange={(v) => updateNotifications({ emailDigest: v })} />
      </SettingRow>
    </div>
  );
}

function DisplaySection() {
  const { display, updateDisplay } = useSettings();
  return (
    <div>
      <SettingRow label="Bottom Panel Height" description="Pixels">
        <NumberInput value={display.bottomPanelHeight} min={150} max={500} onChange={(v) => updateDisplay({ bottomPanelHeight: v })} />
      </SettingRow>
      <SettingRow label="KPI Columns">
        <NumberInput value={display.kpiColumns} min={2} max={8} onChange={(v) => updateDisplay({ kpiColumns: v })} />
      </SettingRow>
      <SettingRow label="Show Bottom Ticker">
        <Toggle checked={display.showBottomTicker} onChange={(v) => updateDisplay({ showBottomTicker: v })} />
      </SettingRow>
      <SettingRow label="Show Status Bar">
        <Toggle checked={display.showStatusBar} onChange={(v) => updateDisplay({ showStatusBar: v })} />
      </SettingRow>
      <SettingRow label="Show Layer Panel">
        <Toggle checked={display.showLayerPanel} onChange={(v) => updateDisplay({ showLayerPanel: v })} />
      </SettingRow>
      <SettingRow label="Show Risk Legend">
        <Toggle checked={display.showRiskLegend} onChange={(v) => updateDisplay({ showRiskLegend: v })} />
      </SettingRow>
      <SettingRow label="Date Format">
        <Select value={display.dateFormat} options={[
          { value: 'us', label: 'MM/DD/YYYY' },
          { value: 'eu', label: 'DD/MM/YYYY' },
          { value: 'iso', label: 'YYYY-MM-DD' },
        ]} onChange={(v) => updateDisplay({ dateFormat: v })} />
      </SettingRow>
      <SettingRow label="Time Format">
        <Select value={display.timeFormat} options={[
          { value: '24h', label: '24-hour' },
          { value: '12h', label: '12-hour' },
        ]} onChange={(v) => updateDisplay({ timeFormat: v })} />
      </SettingRow>
      <SettingRow label="Timezone">
        <Select value={display.timezone} options={[
          { value: 'Asia/Riyadh', label: 'Riyadh (AST)' },
          { value: 'Asia/Dubai', label: 'Dubai (GST)' },
          { value: 'Asia/Kuwait', label: 'Kuwait (AST)' },
          { value: 'UTC', label: 'UTC' },
          { value: 'Europe/London', label: 'London (GMT)' },
          { value: 'America/New_York', label: 'New York (EST)' },
        ]} onChange={(v) => updateDisplay({ timezone: v })} />
      </SettingRow>
    </div>
  );
}

function ShortcutSection() {
  const { shortcuts, updateShortcuts } = useSettings();
  const { variant } = useVariant();
  return (
    <div>
      <SettingRow label="Keyboard Shortcuts Enabled">
        <Toggle checked={shortcuts.enabled} onChange={(v) => updateShortcuts({ enabled: v })} />
      </SettingRow>
      <div className="mt-4">
        <div className="text-[10px] font-mono font-bold mb-2" style={{ color: variant.colors.textMuted }}>
          KEY BINDINGS
        </div>
        <div className="space-y-1">
          {shortcuts.shortcuts.map((sc) => (
            <div
              key={sc.id}
              className="flex items-center justify-between py-1.5 px-2 rounded"
              style={{ backgroundColor: `${variant.colors.primary}05` }}
            >
              <span className="text-[10px] font-mono" style={{ color: variant.colors.text }}>
                {sc.label}
              </span>
              <span
                className="text-[9px] font-mono px-2 py-0.5 rounded border"
                style={{ borderColor: variant.colors.border, color: variant.colors.primary }}
              >
                {sc.keys}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DataSourceSection() {
  const { dataSources, updateDataSources } = useSettings();
  const { variant } = useVariant();
  return (
    <div>
      <SettingRow label="Auto Reconnect" description="Automatically reconnect to dropped data sources">
        <Toggle checked={dataSources.autoReconnect} onChange={(v) => updateDataSources({ autoReconnect: v })} />
      </SettingRow>
      <SettingRow label="Max Retries">
        <NumberInput value={dataSources.maxRetries} min={1} max={20} onChange={(v) => updateDataSources({ maxRetries: v })} />
      </SettingRow>
      <SettingRow label="Retry Delay" description="Milliseconds between retries">
        <NumberInput value={dataSources.retryDelay} min={1000} max={30000} step={1000} onChange={(v) => updateDataSources({ retryDelay: v })} />
      </SettingRow>
      <div className="mt-4">
        <div className="text-[10px] font-mono font-bold mb-2" style={{ color: variant.colors.textMuted }}>
          CONNECTED SOURCES ({dataSources.sources.length})
        </div>
        {dataSources.sources.length === 0 ? (
          <div className="text-[10px] font-mono py-4 text-center" style={{ color: variant.colors.textMuted }}>
            No custom data sources configured. Default RSS and API feeds are active.
          </div>
        ) : (
          <div className="space-y-1">
            {dataSources.sources.map((src) => (
              <div
                key={src.id}
                className="flex items-center justify-between py-1.5 px-2 rounded border"
                style={{ borderColor: variant.colors.border }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        src.status === 'connected' ? '#10B981' : src.status === 'error' ? '#EF4444' : '#6B7280',
                    }}
                  />
                  <span className="text-[10px] font-mono" style={{ color: variant.colors.text }}>
                    {src.name}
                  </span>
                  <span className="text-[8px]" style={{ color: variant.colors.textMuted }}>
                    {src.type.toUpperCase()}
                  </span>
                </div>
                <Toggle
                  checked={src.enabled}
                  onChange={(v) => {
                    const updated = dataSources.sources.map((s) =>
                      s.id === src.id ? { ...s, enabled: v } : s
                    );
                    updateDataSources({ sources: updated });
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
