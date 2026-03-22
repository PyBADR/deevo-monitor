/**
 * SettingsPanel — Full settings modal with 16 sections (worldmonitor parity).
 * v4.0: Appearance, Map, Map Tiles, Live Events, Feeds, AI Engine,
 *       Notifications, Display, Media, Pages, Shortcuts, Data Sources,
 *       Integrations, Explorer, Privacy.
 *
 * Architecture Layer: UI (L6)
 */
import { useState } from 'react';
import { useSettings } from '@/settings/useSettings';
import { useVariant } from '@/variants';
import { useMapStore } from '@/stores/mapStore';
import { clsx } from 'clsx';
import type { SettingsSection } from '@/settings/settings.types';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

const SECTIONS: { id: SettingsSection; label: string; icon: string }[] = [
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'map', label: 'Maps', icon: '🗺️' },
  { id: 'mapTile', label: 'Map Tile Provider', icon: '🧩' },
  { id: 'liveEvents', label: 'Live Events', icon: '⚡' },
  { id: 'feeds', label: 'Feeds', icon: '📡' },
  { id: 'ai', label: 'AI Engine', icon: '🤖' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'display', label: 'Display', icon: '🖥️' },
  { id: 'media', label: 'Media', icon: '🎬' },
  { id: 'pages', label: 'Pages & Panels', icon: '📑' },
  { id: 'shortcuts', label: 'Shortcuts', icon: '⌨️' },
  { id: 'dataSources', label: 'Data Sources', icon: '🔌' },
  { id: 'integrations', label: 'Integrations', icon: '🔗' },
  { id: 'explorer', label: 'Explorer', icon: '🔍' },
  { id: 'privacy', label: 'Privacy & Compliance', icon: '🛡️' },
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
        className="relative w-[900px] max-w-[92vw] h-[650px] max-h-[88vh] rounded-xl border shadow-2xl flex overflow-hidden"
        style={{
          backgroundColor: variant.colors.surface,
          borderColor: variant.colors.border,
        }}
      >
        {/* Sidebar */}
        <div
          className="w-52 shrink-0 border-r flex flex-col"
          style={{ borderColor: variant.colors.border, backgroundColor: variant.colors.bg }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: variant.colors.border }}>
            <span className="text-sm font-bold" style={{ color: variant.colors.text }}>
              Settings
            </span>
            <span className="text-[9px] ml-2 font-mono" style={{ color: variant.colors.textMuted }}>
              v4.0
            </span>
          </div>
          <nav className="flex-1 py-1 overflow-y-auto">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={clsx(
                  'w-full flex items-center gap-2 px-4 py-1.5 text-[11px] font-mono transition-colors text-left',
                  activeSection === s.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                )}
                style={
                  activeSection === s.id
                    ? { backgroundColor: `${variant.colors.primary}15`, color: variant.colors.primary }
                    : undefined
                }
              >
                <span className="text-xs">{s.icon}</span>
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
            {activeSection === 'mapTile' && <MapTileSection />}
            {activeSection === 'liveEvents' && <LiveEventsSection />}
            {activeSection === 'feeds' && <FeedSection />}
            {activeSection === 'ai' && <AISection />}
            {activeSection === 'notifications' && <NotificationSection />}
            {activeSection === 'display' && <DisplaySection />}
            {activeSection === 'media' && <MediaSection />}
            {activeSection === 'pages' && <PagesSection />}
            {activeSection === 'shortcuts' && <ShortcutSection />}
            {activeSection === 'dataSources' && <DataSourceSection />}
            {activeSection === 'integrations' && <IntegrationsSection />}
            {activeSection === 'explorer' && <ExplorerSection />}
            {activeSection === 'privacy' && <PrivacySection />}
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

function SectionHeader({ title }: { title: string }) {
  const { variant } = useVariant();
  return (
    <div className="text-[10px] font-mono font-bold mt-4 mb-2 uppercase tracking-wider" style={{ color: variant.colors.primary }}>
      {title}
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

function TextInput({ value, placeholder, onChange }: {
  value: string; placeholder?: string; onChange: (v: string) => void;
}) {
  const { variant } = useVariant();
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="text-[10px] font-mono px-2 py-1 rounded border bg-transparent w-44"
      style={{ borderColor: variant.colors.border, color: variant.colors.text }}
    />
  );
}

function PasswordInput({ value, placeholder, onChange }: {
  value: string; placeholder?: string; onChange: (v: string) => void;
}) {
  const { variant } = useVariant();
  return (
    <input
      type="password"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="text-[10px] font-mono px-2 py-1 rounded border bg-transparent w-44"
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
          { value: 'serif', label: 'Serif' },
          { value: 'arabic', label: 'Arabic (Noto Kufi)' },
          { value: 'system', label: 'System' },
        ]} onChange={(v) => updateAppearance({ fontFamily: v })} />
      </SettingRow>
      <SettingRow label="Page Animation" description="Transition effect between panels">
        <Select value={appearance.pageAnimation} options={[
          { value: 'none', label: 'None' },
          { value: 'fade', label: 'Fade' },
          { value: 'slide', label: 'Slide' },
          { value: 'scale', label: 'Scale' },
        ]} onChange={(v) => updateAppearance({ pageAnimation: v })} />
      </SettingRow>
      <SettingRow label="Data-Ink Ratio" description="Tufte principle — minimize non-data elements">
        <Select value={appearance.dataInkRatio} options={[
          { value: 'minimal', label: 'Minimal' },
          { value: 'balanced', label: 'Balanced' },
          { value: 'detailed', label: 'Detailed' },
        ]} onChange={(v) => updateAppearance({ dataInkRatio: v })} />
      </SettingRow>
      <SettingRow label="UI Density">
        <Select value={appearance.uiDensity} options={[
          { value: 'compact', label: 'Compact' },
          { value: 'comfortable', label: 'Comfortable' },
          { value: 'spacious', label: 'Spacious' },
        ]} onChange={(v) => updateAppearance({ uiDensity: v })} />
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
  // Smart Map Engine controls from mapStore
  const mapStoreMode = useMapStore((s) => s.mode);
  const mapStoreStyle = useMapStore((s) => s.style);
  const pulseEnabled = useMapStore((s) => s.pulseAnimationsEnabled);
  const extrusionEnabled = useMapStore((s) => s.riskExtrusionEnabled);
  const setMapMode = useMapStore((s) => s.setMode);
  const setMapStyle = useMapStore((s) => s.setStyle);
  const togglePulse = useMapStore((s) => s.togglePulseAnimations);
  const toggleExtrusion = useMapStore((s) => s.toggleRiskExtrusion);
  const enableAll = useMapStore((s) => s.enableAllLayers);
  const disableAll = useMapStore((s) => s.disableAllLayers);
  const activeLayers = useMapStore((s) => s.activeLayers);

  return (
    <div>
      {/* ── Smart Map Engine ── */}
      <div className="text-[9px] uppercase tracking-widest font-mono text-gray-500 px-3 pt-2 pb-1">Smart Map Engine</div>
      <SettingRow label="Map Mode" description="2D flat map or 3D globe">
        <Select value={mapStoreMode} options={[
          { value: '2d', label: '2D Flat Map' },
          { value: '3d', label: '3D Globe' },
        ]} onChange={(v) => setMapMode(v as '2d' | '3d')} />
      </SettingRow>
      <SettingRow label="Visual Style" description="Cyberpunk, Satellite, or Minimal">
        <Select value={mapStoreStyle} options={[
          { value: 'cyberpunk', label: 'Cyberpunk Dark' },
          { value: 'satellite', label: 'Satellite' },
          { value: 'minimal', label: 'Clean Minimal' },
        ]} onChange={(v) => setMapStyle(v as 'cyberpunk' | 'satellite' | 'minimal')} />
      </SettingRow>
      <SettingRow label="Pulse Animations" description="Animated hotspot pulses on map">
        <Toggle checked={pulseEnabled} onChange={() => togglePulse()} />
      </SettingRow>
      <SettingRow label="Risk Extrusion" description="3D vertical bars showing risk intensity">
        <Toggle checked={extrusionEnabled} onChange={() => toggleExtrusion()} />
      </SettingRow>
      <SettingRow label="Active Layers" description={`${activeLayers.size}/45 layers active`}>
        <div className="flex gap-1">
          <button onClick={enableAll} className="text-[9px] font-mono px-2 py-0.5 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30">All ON</button>
          <button onClick={disableAll} className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30">All OFF</button>
        </div>
      </SettingRow>

      {/* ── Legacy Map Settings ── */}
      <div className="text-[9px] uppercase tracking-widest font-mono text-gray-500 px-3 pt-3 pb-1">Base Map</div>
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

function MapTileSection() {
  const { mapTile, updateMapTile } = useSettings();
  return (
    <div>
      <SettingRow label="Tile Provider" description="Base map tile source">
        <Select value={mapTile.provider} options={[
          { value: 'carto', label: 'CARTO (Default)' },
          { value: 'openstreetmap', label: 'OpenStreetMap' },
          { value: 'mapbox', label: 'Mapbox' },
          { value: 'esri', label: 'Esri' },
          { value: 'stadia', label: 'Stadia Maps' },
          { value: 'maptiler', label: 'MapTiler' },
        ]} onChange={(v) => updateMapTile({ provider: v })} />
      </SettingRow>
      {mapTile.provider === 'mapbox' && (
        <SettingRow label="Mapbox Token" description="Your Mapbox access token">
          <PasswordInput value={mapTile.mapboxToken} placeholder="pk.ey..." onChange={(v) => updateMapTile({ mapboxToken: v })} />
        </SettingRow>
      )}
      {mapTile.provider === 'maptiler' && (
        <SettingRow label="MapTiler Key" description="Your MapTiler API key">
          <PasswordInput value={mapTile.maptilerKey} placeholder="API key" onChange={(v) => updateMapTile({ maptilerKey: v })} />
        </SettingRow>
      )}
      <SettingRow label="Custom Tile URL" description="Override with custom XYZ tile server">
        <TextInput value={mapTile.customTileUrl} placeholder="https://tiles.example/{z}/{x}/{y}.png" onChange={(v) => updateMapTile({ customTileUrl: v })} />
      </SettingRow>
      <SettingRow label="Tile Resolution">
        <Select value={mapTile.tileResolution} options={[
          { value: '256', label: '256px' },
          { value: '512', label: '512px (HiDPI)' },
        ]} onChange={(v) => updateMapTile({ tileResolution: v })} />
      </SettingRow>
      <SettingRow label="Retina Tiles" description="Use @2x tiles for high-DPI displays">
        <Toggle checked={mapTile.retina} onChange={(v) => updateMapTile({ retina: v })} />
      </SettingRow>
      <SettingRow label="Tile Cache" description="Cache tiles locally for faster loading">
        <Toggle checked={mapTile.cacheEnabled} onChange={(v) => updateMapTile({ cacheEnabled: v })} />
      </SettingRow>
      <SettingRow label="Offline Tiles" description="Pre-download GCC region tiles for offline use">
        <Toggle checked={mapTile.offlineTiles} onChange={(v) => updateMapTile({ offlineTiles: v })} />
      </SettingRow>
    </div>
  );
}

function LiveEventsSection() {
  const { liveEvents, updateLiveEvents } = useSettings();
  return (
    <div>
      <SettingRow label="Live Events Enabled" description="Show real-time events on map">
        <Toggle checked={liveEvents.enabled} onChange={(v) => updateLiveEvents({ enabled: v })} />
      </SettingRow>
      <SectionHeader title="Event Types" />
      <SettingRow label="Military Events">
        <Toggle checked={liveEvents.showMilitaryEvents} onChange={(v) => updateLiveEvents({ showMilitaryEvents: v })} />
      </SettingRow>
      <SettingRow label="Disaster Events">
        <Toggle checked={liveEvents.showDisasterEvents} onChange={(v) => updateLiveEvents({ showDisasterEvents: v })} />
      </SettingRow>
      <SettingRow label="Cyber Events">
        <Toggle checked={liveEvents.showCyberEvents} onChange={(v) => updateLiveEvents({ showCyberEvents: v })} />
      </SettingRow>
      <SettingRow label="Economic Events">
        <Toggle checked={liveEvents.showEconomicEvents} onChange={(v) => updateLiveEvents({ showEconomicEvents: v })} />
      </SettingRow>
      <SettingRow label="Social Events">
        <Toggle checked={liveEvents.showSocialEvents} onChange={(v) => updateLiveEvents({ showSocialEvents: v })} />
      </SettingRow>
      <SectionHeader title="Rendering" />
      <SettingRow label="Visual Earth" description="3D earth overlay with real-time event visualization">
        <Toggle checked={liveEvents.visualEarth} onChange={(v) => updateLiveEvents({ visualEarth: v })} />
      </SettingRow>
      <SettingRow label="IoT / Cloud Streaming" description="Stream from iCloud and IoT sources">
        <Toggle checked={liveEvents.iotStreaming} onChange={(v) => updateLiveEvents({ iotStreaming: v })} />
      </SettingRow>
      <SettingRow label="Flash New Events" description="Brief flash animation on new events">
        <Toggle checked={liveEvents.flashNewEvents} onChange={(v) => updateLiveEvents({ flashNewEvents: v })} />
      </SettingRow>
      <SettingRow label="Event Sound">
        <Toggle checked={liveEvents.eventSound} onChange={(v) => updateLiveEvents({ eventSound: v })} />
      </SettingRow>
      <SettingRow label="Max Event Age" description="Hide events older than (hours)">
        <NumberInput value={liveEvents.maxEventAge} min={1} max={168} onChange={(v) => updateLiveEvents({ maxEventAge: v })} />
      </SettingRow>
      <SettingRow label="Event Density Limit" description="Max events per viewport">
        <NumberInput value={liveEvents.eventDensityLimit} min={10} max={1000} onChange={(v) => updateLiveEvents({ eventDensityLimit: v })} />
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
  const { variant } = useVariant();
  return (
    <div>
      <SectionHeader title="Primary Provider" />
      <SettingRow label="AI Provider">
        <Select value={ai.provider} options={[
          { value: 'ollama', label: 'Ollama (Local)' },
          { value: 'groq', label: 'Groq Cloud' },
          { value: 'openrouter', label: 'OpenRouter' },
          { value: 'openai', label: 'OpenAI' },
          { value: 'anthropic', label: 'Anthropic' },
          { value: 'local', label: 'Local Model' },
        ]} onChange={(v) => updateAI({ provider: v })} />
      </SettingRow>
      <SettingRow label="Model" description="LLM model identifier">
        <TextInput value={ai.model} placeholder="llama3.2" onChange={(v) => updateAI({ model: v })} />
      </SettingRow>
      <SettingRow label="Temperature" description="0 = deterministic, 1 = creative">
        <NumberInput value={ai.temperature} min={0} max={1} step={0.1} onChange={(v) => updateAI({ temperature: v })} />
      </SettingRow>
      <SettingRow label="Max Tokens">
        <NumberInput value={ai.maxTokens} min={256} max={8192} step={256} onChange={(v) => updateAI({ maxTokens: v })} />
      </SettingRow>

      <SectionHeader title="Ollama (Local AI)" />
      <SettingRow label="Ollama Endpoint" description="Local Ollama server URL">
        <TextInput value={ai.ollamaEndpoint} placeholder="http://localhost:11434" onChange={(v) => updateAI({ ollamaEndpoint: v })} />
      </SettingRow>
      <SettingRow label="Ollama Model" description="Model to load in Ollama">
        <TextInput value={ai.ollamaModel} placeholder="llama3.2" onChange={(v) => updateAI({ ollamaModel: v })} />
      </SettingRow>
      <SettingRow label="Download On Demand" description="Auto-pull models when needed">
        <Toggle checked={ai.downloadOnDemand} onChange={(v) => updateAI({ downloadOnDemand: v })} />
      </SettingRow>
      <SettingRow label="GPU Memory Limit" description="Max VRAM in MB (Mac M4 Max = 128GB unified)">
        <NumberInput value={ai.gpuMemoryLimit} min={1024} max={131072} step={1024} onChange={(v) => updateAI({ gpuMemoryLimit: v })} />
      </SettingRow>
      <SettingRow label="Fully Local Mode" description="Never send data to external AI providers">
        <Toggle checked={ai.fullyLocal} onChange={(v) => updateAI({ fullyLocal: v })} />
      </SettingRow>

      <SectionHeader title="Cloud Provider Keys" />
      <SettingRow label="Groq API Key">
        <PasswordInput value={ai.groqApiKey} placeholder="gsk_..." onChange={(v) => updateAI({ groqApiKey: v })} />
      </SettingRow>
      <SettingRow label="OpenRouter API Key">
        <PasswordInput value={ai.openrouterApiKey} placeholder="sk-or-..." onChange={(v) => updateAI({ openrouterApiKey: v })} />
      </SettingRow>
      <SettingRow label="OpenAI API Key">
        <PasswordInput value={ai.openaiApiKey} placeholder="sk-..." onChange={(v) => updateAI({ openaiApiKey: v })} />
      </SettingRow>
      <SettingRow label="Anthropic API Key">
        <PasswordInput value={ai.anthropicApiKey} placeholder="sk-ant-..." onChange={(v) => updateAI({ anthropicApiKey: v })} />
      </SettingRow>

      <SectionHeader title="Fallback Chain" />
      <div className="py-2">
        <div className="text-[10px] font-mono" style={{ color: variant.colors.textMuted }}>
          Provider fallback order: {ai.fallbackChain.join(' → ')}
        </div>
      </div>

      <SectionHeader title="Features" />
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

function MediaSection() {
  const { media, updateMedia } = useSettings();
  return (
    <div>
      <SettingRow label="Video Quality" description="Webcam and live stream quality">
        <Select value={media.videoQuality} options={[
          { value: 'auto', label: 'Auto' },
          { value: '360p', label: '360p' },
          { value: '480p', label: '480p' },
          { value: '720p', label: '720p HD' },
          { value: '1080p', label: '1080p Full HD' },
        ]} onChange={(v) => updateMedia({ videoQuality: v })} />
      </SettingRow>
      <SettingRow label="Keep Live Stream Running" description="Continue playing when panel is hidden">
        <Toggle checked={media.keepLiveStreamRunning} onChange={(v) => updateMedia({ keepLiveStreamRunning: v })} />
      </SettingRow>
      <SettingRow label="Autoplay Videos">
        <Toggle checked={media.autoplayVideos} onChange={(v) => updateMedia({ autoplayVideos: v })} />
      </SettingRow>
      <SettingRow label="Muted by Default">
        <Toggle checked={media.mutedByDefault} onChange={(v) => updateMedia({ mutedByDefault: v })} />
      </SettingRow>
      <SettingRow label="Webcam Thumbnail Size">
        <Select value={media.webcamThumbnailSize} options={[
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ]} onChange={(v) => updateMedia({ webcamThumbnailSize: v })} />
      </SettingRow>
      <SettingRow label="Max Concurrent Streams" description="Simultaneous video feeds (1-4)">
        <NumberInput value={media.maxConcurrentStreams} min={1} max={4} onChange={(v) => updateMedia({ maxConcurrentStreams: v })} />
      </SettingRow>
      <SettingRow label="Buffer Size" description="Seconds of video buffer">
        <NumberInput value={media.bufferSize} min={1} max={30} onChange={(v) => updateMedia({ bufferSize: v })} />
      </SettingRow>
    </div>
  );
}

function PagesSection() {
  const { pages, updatePages } = useSettings();
  const { variant } = useVariant();
  return (
    <div>
      <SettingRow label="Default Tab" description="Panel shown on startup">
        <TextInput value={pages.defaultTab} placeholder="feed" onChange={(v) => updatePages({ defaultTab: v })} />
      </SettingRow>
      <SettingRow label="Page Transition">
        <Select value={pages.pageTransition} options={[
          { value: 'none', label: 'None' },
          { value: 'fade', label: 'Fade' },
          { value: 'slide', label: 'Slide' },
        ]} onChange={(v) => updatePages({ pageTransition: v })} />
      </SettingRow>
      <SettingRow label="Remember Last Tab" description="Restore last active panel on reload">
        <Toggle checked={pages.rememberLastTab} onChange={(v) => updatePages({ rememberLastTab: v })} />
      </SettingRow>
      <SettingRow label="Sidebar Position">
        <Select value={pages.sidebarPosition} options={[
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' },
        ]} onChange={(v) => updatePages({ sidebarPosition: v })} />
      </SettingRow>
      <SettingRow label="Sidebar Collapsed">
        <Toggle checked={pages.sidebarCollapsed} onChange={(v) => updatePages({ sidebarCollapsed: v })} />
      </SettingRow>

      <SectionHeader title="Enabled Panels" />
      <div className="space-y-1 mt-2">
        {[
          { id: 'feed', label: 'Live News Feed' },
          { id: 'ai', label: 'AI Insights' },
          { id: 'risk', label: 'Risk Index' },
          { id: 'forecast', label: 'Strategic Forecasts' },
          // Core Intelligence
          { id: 'feed', label: 'Intel Feed' },
          { id: 'news', label: 'Live News' },
          { id: 'webcams', label: 'Live Webcams' },
          { id: 'ai', label: 'AI Insights' },
          { id: 'posture', label: 'Strategic Posture' },
          { id: 'intel', label: 'Country Intelligence' },
          { id: 'risk', label: 'Risk Index' },
          { id: 'strategy', label: 'Strategy' },
          { id: 'livecase', label: 'Live Case' },
          // Markets & Finance
          { id: 'finance', label: 'Finance Radar' },
          { id: 'market', label: 'Market & Finance' },
          { id: 'financial', label: 'Financial Overview' },
          { id: 'economical', label: 'Economical' },
          { id: 'premium', label: 'Premium Stocks' },
          { id: 'premstock', label: 'Premium Stock' },
          { id: 'premnews', label: 'Premium Market News' },
          { id: 'premii', label: 'Premium II' },
          { id: 'daily', label: 'Daily Market' },
          // Commodities
          { id: 'energy', label: 'Energy' },
          { id: 'energymarket', label: 'PTC / Energy Market' },
          { id: 'gold', label: 'Gold & Silver' },
          { id: 'basemetals', label: 'Base Metals & Trade' },
          // Crypto
          { id: 'crypto', label: 'Crypto' },
          { id: 'cryptonews', label: 'Crypto News & Trading' },
          { id: 'token', label: 'Token' },
          // Banking & Consumer
          { id: 'central', label: 'Central Banks' },
          { id: 'consumer', label: 'Consumer' },
          // GCC
          { id: 'gccbiz', label: 'GCC Business News' },
          { id: 'gccmarket', label: 'GCC Market' },
          // News & Intel
          { id: 'region', label: 'Region News' },
          { id: 'globalnews', label: 'Global News' },
          { id: 'topical', label: 'Topical' },
          { id: 'technology', label: 'Technology' },
          { id: 'telegram', label: 'Telegram Intel' },
          { id: 'brand', label: 'Brand & Application' },
          // Analysis
          { id: 'correlation', label: 'Correlation Engine' },
          { id: 'kpi', label: 'KPI Dashboard' },
          { id: 'forecast', label: 'Forecasts' },
          { id: 'alerts', label: 'Alert Manager' },
          { id: 'pipeline', label: 'Pipeline' },
        ].map((panel) => (
          <div
            key={panel.id}
            className="flex items-center justify-between py-1 px-2 rounded"
            style={{ backgroundColor: `${variant.colors.primary}05` }}
          >
            <span className="text-[10px] font-mono" style={{ color: variant.colors.text }}>
              {panel.label}
            </span>
            <Toggle
              checked={pages.enabledPanels.includes(panel.id)}
              onChange={(v) => {
                const updated = v
                  ? [...pages.enabledPanels, panel.id]
                  : pages.enabledPanels.filter((p) => p !== panel.id);
                updatePages({ enabledPanels: updated });
              }}
            />
          </div>
        ))}
      </div>
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

function IntegrationsSection() {
  const { integrations, updateIntegrations } = useSettings();
  return (
    <div>
      <SectionHeader title="Discord" />
      <SettingRow label="Discord Integration" description="Send alerts to Discord channel">
        <Toggle checked={integrations.discordEnabled} onChange={(v) => updateIntegrations({ discordEnabled: v })} />
      </SettingRow>
      {integrations.discordEnabled && (
        <SettingRow label="Discord Webhook URL" description="Paste your Discord webhook URL">
          <TextInput value={integrations.discordWebhook} placeholder="https://discord.com/api/webhooks/..." onChange={(v) => updateIntegrations({ discordWebhook: v })} />
        </SettingRow>
      )}

      <SectionHeader title="Browser" />
      <SettingRow label="Browser Notifications">
        <Toggle checked={integrations.browserNotifications} onChange={(v) => updateIntegrations({ browserNotifications: v })} />
      </SettingRow>
      <SettingRow label="Browser Homepage" description="Custom URL for embedded browser panel">
        <TextInput value={integrations.browserHomepage} placeholder="https://..." onChange={(v) => updateIntegrations({ browserHomepage: v })} />
      </SettingRow>

      <SectionHeader title="Cloud Sync" />
      <SettingRow label="iCloud Sync" description="Sync settings and bookmarks via iCloud">
        <Toggle checked={integrations.icloudSync} onChange={(v) => updateIntegrations({ icloudSync: v })} />
      </SettingRow>

      <SectionHeader title="Export & Share" />
      <SettingRow label="Export Format" description="Default format for data exports">
        <Select value={integrations.exportFormat} options={[
          { value: 'json', label: 'JSON' },
          { value: 'csv', label: 'CSV' },
          { value: 'xlsx', label: 'Excel (XLSX)' },
          { value: 'pdf', label: 'PDF' },
        ]} onChange={(v) => updateIntegrations({ exportFormat: v })} />
      </SettingRow>
      <SettingRow label="Share Format" description="Default format for sharing screenshots">
        <Select value={integrations.shareFormat} options={[
          { value: 'png', label: 'PNG' },
          { value: 'svg', label: 'SVG' },
          { value: 'pdf', label: 'PDF' },
          { value: 'link', label: 'Share Link' },
        ]} onChange={(v) => updateIntegrations({ shareFormat: v })} />
      </SettingRow>
    </div>
  );
}

function ExplorerSection() {
  const { explorer, updateExplorer } = useSettings();
  return (
    <div>
      <SettingRow label="Default View">
        <Select value={explorer.defaultView} options={[
          { value: 'grid', label: 'Grid' },
          { value: 'list', label: 'List' },
          { value: 'timeline', label: 'Timeline' },
        ]} onChange={(v) => updateExplorer({ defaultView: v })} />
      </SettingRow>
      <SettingRow label="Group By">
        <Select value={explorer.groupBy} options={[
          { value: 'none', label: 'None' },
          { value: 'region', label: 'Region' },
          { value: 'category', label: 'Category' },
          { value: 'severity', label: 'Severity' },
          { value: 'source', label: 'Source' },
        ]} onChange={(v) => updateExplorer({ groupBy: v })} />
      </SettingRow>
      <SettingRow label="Sort By">
        <Select value={explorer.sortBy} options={[
          { value: 'timestamp', label: 'Newest First' },
          { value: 'severity', label: 'Severity' },
          { value: 'relevance', label: 'Relevance' },
          { value: 'alphabetical', label: 'Alphabetical' },
        ]} onChange={(v) => updateExplorer({ sortBy: v })} />
      </SettingRow>
      <SettingRow label="Show Preview" description="Show content preview in results">
        <Toggle checked={explorer.showPreview} onChange={(v) => updateExplorer({ showPreview: v })} />
      </SettingRow>
      <SettingRow label="Preview Size">
        <Select value={explorer.previewSize} options={[
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ]} onChange={(v) => updateExplorer({ previewSize: v })} />
      </SettingRow>
      <SettingRow label="Max Results" description="Maximum items to show in explorer">
        <NumberInput value={explorer.maxResults} min={10} max={500} onChange={(v) => updateExplorer({ maxResults: v })} />
      </SettingRow>
      <SettingRow label="Include Archived">
        <Toggle checked={explorer.includeArchived} onChange={(v) => updateExplorer({ includeArchived: v })} />
      </SettingRow>
    </div>
  );
}

function PrivacySection() {
  const { privacy, updatePrivacy } = useSettings();
  return (
    <div>
      <SettingRow label="Telemetry" description="Send anonymous usage data to improve the product">
        <Toggle checked={privacy.telemetryEnabled} onChange={(v) => updatePrivacy({ telemetryEnabled: v })} />
      </SettingRow>
      <SettingRow label="Share Analytics" description="Share anonymous analytics with development team">
        <Toggle checked={privacy.shareAnalytics} onChange={(v) => updatePrivacy({ shareAnalytics: v })} />
      </SettingRow>
      <SettingRow label="Clear Cache on Exit" description="Remove all cached data when closing the app">
        <Toggle checked={privacy.clearCacheOnExit} onChange={(v) => updatePrivacy({ clearCacheOnExit: v })} />
      </SettingRow>
      <SettingRow label="Data Retention" description="Days to keep historical data (7-365)">
        <NumberInput value={privacy.dataRetentionDays} min={7} max={365} onChange={(v) => updatePrivacy({ dataRetentionDays: v })} />
      </SettingRow>
      <SettingRow label="Audit Log" description="Keep SHA-256 audit log of all data operations">
        <Toggle checked={privacy.auditLogEnabled} onChange={(v) => updatePrivacy({ auditLogEnabled: v })} />
      </SettingRow>
      <SettingRow label="PDPL Compliance" description="Enable Saudi PDPL data sovereignty controls">
        <Toggle checked={privacy.pdplCompliance} onChange={(v) => updatePrivacy({ pdplCompliance: v })} />
      </SettingRow>
    </div>
  );
}
