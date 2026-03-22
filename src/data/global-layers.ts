/**
 * Global Intelligence Layers — worldmonitor-style layer definitions.
 * 60+ data layers across 12 categories for the global situation map.
 * Each layer includes GeoJSON point data for rendering on DeckGL/MapLibre.
 */

export type LayerCategory =
  | 'GEOPOLITICAL'
  | 'MILITARY'
  | 'NUCLEAR'
  | 'INFRASTRUCTURE'
  | 'INTELLIGENCE'
  | 'CLAIMS'
  | 'FRAUD'
  | 'ENVIRONMENTAL'
  | 'SPACE'
  | 'TECH'
  | 'FINANCE'
  | 'COMMODITY';

export interface GlobalLayerDef {
  id: string;
  label: string;
  labelAr: string;
  icon: string;
  color: string;
  category: LayerCategory;
  defaultEnabled: boolean;
  description: string;
}

// ═══════════════════════════════════════════════════════
// WORLDMONITOR-PARITY LAYERS
// ═══════════════════════════════════════════════════════
export const GLOBAL_LAYER_DEFS: GlobalLayerDef[] = [
  // ── GEOPOLITICAL ──
  { id: 'conflict_zones', label: 'Conflict Zones', labelAr: 'مناطق النزاع', icon: '✕', color: '#FF3B30', category: 'GEOPOLITICAL', defaultEnabled: true, description: 'Active conflict zones and war theaters' },
  { id: 'iran_attacks', label: 'Iran Attacks', labelAr: 'هجمات إيران', icon: '💥', color: '#FF6B00', category: 'GEOPOLITICAL', defaultEnabled: true, description: 'Iranian attack vectors and proxy strikes' },
  { id: 'intel_hotspots', label: 'Intel Hotspots', labelAr: 'نقاط استخبارية', icon: '●', color: '#FFD600', category: 'INTELLIGENCE', defaultEnabled: true, description: 'Intelligence-flagged areas of concern' },
  { id: 'sanctions_zones', label: 'Sanctions Zones', labelAr: 'مناطق العقوبات', icon: '⊘', color: '#FF2D55', category: 'GEOPOLITICAL', defaultEnabled: false, description: 'OFAC/EU sanctions exposure zones' },
  { id: 'refugee_flows', label: 'Refugee Flows', labelAr: 'تدفقات اللاجئين', icon: '→', color: '#FF9500', category: 'GEOPOLITICAL', defaultEnabled: false, description: 'Major displacement and migration routes' },

  // ── MILITARY ──
  { id: 'military_bases', label: 'Military Bases', labelAr: 'قواعد عسكرية', icon: '⬡', color: '#5856D6', category: 'MILITARY', defaultEnabled: true, description: 'US/NATO/GCC/Russia/China military installations' },
  { id: 'naval_assets', label: 'Naval Assets', labelAr: 'أصول بحرية', icon: '⚓', color: '#007AFF', category: 'MILITARY', defaultEnabled: false, description: 'Naval vessel positions and patrol routes' },
  { id: 'air_defense', label: 'Air Defense', labelAr: 'دفاع جوي', icon: '◉', color: '#34C759', category: 'MILITARY', defaultEnabled: false, description: 'Air defense systems (Patriot, S-400, THAAD)' },
  { id: 'aircraft_tracks', label: 'Aircraft Tracks', labelAr: 'مسارات طيران', icon: '✈', color: '#00D4FF', category: 'MILITARY', defaultEnabled: false, description: 'Military and reconnaissance aircraft tracks' },

  // ── NUCLEAR ──
  { id: 'nuclear_sites', label: 'Nuclear Sites', labelAr: 'مواقع نووية', icon: '☢', color: '#FFD600', category: 'NUCLEAR', defaultEnabled: true, description: 'Nuclear reactors, enrichment facilities, waste storage' },
  { id: 'gamma_irradiators', label: 'Gamma Irradiators', labelAr: 'مشعات جاما', icon: '△', color: '#FFCC00', category: 'NUCLEAR', defaultEnabled: false, description: 'Category 1-3 gamma irradiation sources' },
  { id: 'radiation_watch', label: 'Radiation Watch', labelAr: 'رصد إشعاعي', icon: '◎', color: '#FF9500', category: 'NUCLEAR', defaultEnabled: false, description: 'Real-time radiation monitoring stations' },

  // ── INFRASTRUCTURE ──
  { id: 'pipelines', label: 'Pipelines', labelAr: 'خطوط أنابيب', icon: '═', color: '#FF6B35', category: 'INFRASTRUCTURE', defaultEnabled: true, description: 'Oil & gas pipeline networks' },
  { id: 'undersea_cables', label: 'Undersea Cables', labelAr: 'كابلات بحرية', icon: '〰', color: '#5AC8FA', category: 'INFRASTRUCTURE', defaultEnabled: false, description: 'Submarine fiber optic cable routes' },
  { id: 'spaceports', label: 'Spaceports', labelAr: 'موانئ فضائية', icon: '🚀', color: '#AF52DE', category: 'INFRASTRUCTURE', defaultEnabled: false, description: 'Launch facilities and space infrastructure' },
  { id: 'ai_data_centers', label: 'AI Data Centers', labelAr: 'مراكز بيانات AI', icon: '⬢', color: '#00D4FF', category: 'INFRASTRUCTURE', defaultEnabled: false, description: 'Major AI compute clusters and data centers' },
  { id: 'power_grid', label: 'Power Grid', labelAr: 'شبكة كهرباء', icon: '⚡', color: '#FFCC00', category: 'INFRASTRUCTURE', defaultEnabled: false, description: 'Power plants and major grid infrastructure' },
  { id: 'oil_facilities', label: 'Oil Facilities', labelAr: 'منشآت نفطية', icon: '🛢', color: '#FF6B35', category: 'INFRASTRUCTURE', defaultEnabled: false, description: 'Refineries, terminals, oil rigs' },
  { id: 'ports_shipping', label: 'Ports & Shipping', labelAr: 'موانئ وشحن', icon: '⚓', color: '#007AFF', category: 'INFRASTRUCTURE', defaultEnabled: false, description: 'Major shipping routes and port facilities' },

  // ── INTELLIGENCE ──
  { id: 'cyber_threats', label: 'Cyber Threats', labelAr: 'تهديدات سيبرانية', icon: '⌥', color: '#FF2D55', category: 'INTELLIGENCE', defaultEnabled: false, description: 'Active cyber attack sources and targets' },
  { id: 'terror_incidents', label: 'Terror Incidents', labelAr: 'حوادث إرهابية', icon: '⚠', color: '#FF3B30', category: 'INTELLIGENCE', defaultEnabled: false, description: 'Terrorism incidents and threat zones' },
  { id: 'protest_zones', label: 'Protest Zones', labelAr: 'مناطق احتجاج', icon: '✊', color: '#FF9500', category: 'INTELLIGENCE', defaultEnabled: false, description: 'Civil unrest and protest activity' },

  // ── CLAIMS (insurance-specific) ──
  { id: 'claims_heatmap', label: 'Claims Heat', labelAr: 'حرارة المطالبات', icon: '🔥', color: '#FF6B35', category: 'CLAIMS', defaultEnabled: true, description: 'Insurance claims density heatmap' },
  { id: 'claim_clusters', label: 'Claim Clusters', labelAr: 'تجمعات المطالبات', icon: '◉', color: '#00D4FF', category: 'CLAIMS', defaultEnabled: true, description: 'High-density claim cluster areas' },
  { id: 'risk_density', label: 'Risk Density', labelAr: 'كثافة المخاطر', icon: '⬡', color: '#FFD600', category: 'CLAIMS', defaultEnabled: true, description: 'Hexagonal risk density visualization' },
  { id: 'weather_cat', label: 'Weather CAT', labelAr: 'كوارث طبيعية', icon: '☁', color: '#5AC8FA', category: 'ENVIRONMENTAL', defaultEnabled: false, description: 'Catastrophe weather events' },
  { id: 'flood_zones', label: 'Flood Zones', labelAr: 'مناطق فيضان', icon: '🌊', color: '#007AFF', category: 'ENVIRONMENTAL', defaultEnabled: false, description: 'Flood risk zones and active flooding' },

  // ── FRAUD ──
  { id: 'fraud_links', label: 'Fraud Links', labelAr: 'روابط الاحتيال', icon: '⌒', color: '#FF2D55', category: 'FRAUD', defaultEnabled: false, description: 'Fraud network arc connections' },
  { id: 'staging_areas', label: 'Staging Areas', labelAr: 'مناطق تمثيل', icon: '⚠', color: '#FF6B35', category: 'FRAUD', defaultEnabled: false, description: 'Known accident staging locations' },
  { id: 'repair_shops', label: 'Repair Shops', labelAr: 'محلات إصلاح', icon: '🔧', color: '#FF9500', category: 'FRAUD', defaultEnabled: false, description: 'Flagged repair shops (fraud indicators)' },
  { id: 'hospital_network', label: 'Hospital Network', labelAr: 'شبكة المستشفيات', icon: '🏥', color: '#FF2D55', category: 'FRAUD', defaultEnabled: false, description: 'Medical provider fraud network' },

  // ── v4.0 EXPANDED LAYERS (45 total) ──

  // GEOPOLITICAL (additional)
  { id: 'un_missions', label: 'UN Missions', labelAr: 'بعثات الأمم المتحدة', icon: '🇺🇳', color: '#5AC8FA', category: 'GEOPOLITICAL', defaultEnabled: false, description: 'Active UN peacekeeping and observer missions' },
  { id: 'trade_routes', label: 'Trade Routes', labelAr: 'طرق التجارة', icon: '🛳', color: '#FFD600', category: 'GEOPOLITICAL', defaultEnabled: false, description: 'Major maritime and overland trade corridors' },
  { id: 'diaspora_hubs', label: 'Diaspora Hubs', labelAr: 'مراكز الشتات', icon: '👥', color: '#A78BFA', category: 'GEOPOLITICAL', defaultEnabled: false, description: 'Major diaspora population centers affecting remittance flows' },

  // MILITARY (additional)
  { id: 'naval_patrols', label: 'Naval Patrols', labelAr: 'الدوريات البحرية', icon: '⚓', color: '#60A5FA', category: 'MILITARY', defaultEnabled: false, description: 'Active naval patrol zones and carrier groups' },
  { id: 'air_defense', label: 'Air Defense Zones', labelAr: 'مناطق الدفاع الجوي', icon: '🛡', color: '#818CF8', category: 'MILITARY', defaultEnabled: false, description: 'ADIZ and air defense missile coverage' },

  // INFRASTRUCTURE (additional)
  { id: 'desalination', label: 'Desalination Plants', labelAr: 'محطات التحلية', icon: '💧', color: '#38BDF8', category: 'INFRASTRUCTURE', defaultEnabled: false, description: 'Critical water desalination infrastructure' },
  { id: 'telecom_cables', label: 'Subsea Cables', labelAr: 'كابلات بحرية', icon: '🔌', color: '#C084FC', category: 'INFRASTRUCTURE', defaultEnabled: false, description: 'Submarine fiber optic cable landing points' },
  { id: 'solar_farms', label: 'Solar Farms', labelAr: 'مزارع شمسية', icon: '☀', color: '#FACC15', category: 'INFRASTRUCTURE', defaultEnabled: false, description: 'Utility-scale solar energy installations' },

  // INTELLIGENCE (additional)
  { id: 'osint_feeds', label: 'OSINT Feeds', labelAr: 'تغذيات استخبارية مفتوحة', icon: '📡', color: '#34D399', category: 'INTELLIGENCE', defaultEnabled: false, description: 'Open-source intelligence aggregation points' },
  { id: 'social_signal', label: 'Social Signal', labelAr: 'إشارة اجتماعية', icon: '📱', color: '#F472B6', category: 'INTELLIGENCE', defaultEnabled: false, description: 'Social media signal hotspots and anomaly detection' },

  // ENVIRONMENTAL (additional)
  { id: 'air_quality', label: 'Air Quality', labelAr: 'جودة الهواء', icon: '💨', color: '#A3E635', category: 'ENVIRONMENTAL', defaultEnabled: false, description: 'Real-time air quality index monitoring' },
  { id: 'seismic_activity', label: 'Seismic Activity', labelAr: 'نشاط زلزالي', icon: '🌋', color: '#EF4444', category: 'ENVIRONMENTAL', defaultEnabled: false, description: 'Earthquake and volcanic activity monitoring' },
  { id: 'dust_storms', label: 'Dust Storms', labelAr: 'عواصف ترابية', icon: '🌪', color: '#D97706', category: 'ENVIRONMENTAL', defaultEnabled: false, description: 'GCC dust and sandstorm tracking' },
  { id: 'fires', label: 'Fires', labelAr: 'حرائق', icon: '🔥', color: '#EF4444', category: 'ENVIRONMENTAL', defaultEnabled: false, description: 'Active wildfire and satellite fire detection (FIRMS)' },
  { id: 'climate_anomalies', label: 'Climate Anomalies', labelAr: 'شذوذ مناخي', icon: '🌡', color: '#F97316', category: 'ENVIRONMENTAL', defaultEnabled: false, description: 'Temperature and precipitation anomaly monitoring' },

  // ── SPACE ──
  { id: 'satellites', label: 'Orbital Surveillance', labelAr: 'مراقبة مدارية', icon: '🛰', color: '#818CF8', category: 'SPACE', defaultEnabled: false, description: 'Active reconnaissance and surveillance satellites' },
  { id: 'gps_jamming', label: 'GPS Jamming', labelAr: 'تشويش GPS', icon: '📡', color: '#F43F5E', category: 'SPACE', defaultEnabled: false, description: 'GPS spoofing and jamming detection zones' },
  { id: 'day_night', label: 'Day/Night', labelAr: 'نهار/ليل', icon: '🌓', color: '#64748B', category: 'SPACE', defaultEnabled: false, description: 'Day/night terminator line overlay' },

  // ── TECH ──
  { id: 'startup_hubs', label: 'Startup Hubs', labelAr: 'مراكز الشركات الناشئة', icon: '🚀', color: '#10B981', category: 'TECH', defaultEnabled: false, description: 'Global startup ecosystem centers' },
  { id: 'tech_hqs', label: 'Tech HQs', labelAr: 'مقرات تقنية', icon: '🏢', color: '#6366F1', category: 'TECH', defaultEnabled: false, description: 'Major technology company headquarters' },
  { id: 'cloud_regions', label: 'Cloud Regions', labelAr: 'مناطق سحابية', icon: '☁', color: '#0EA5E9', category: 'TECH', defaultEnabled: false, description: 'AWS, Azure, GCP cloud infrastructure regions' },
  { id: 'internet_outages', label: 'Internet Disruptions', labelAr: 'انقطاعات إنترنت', icon: '🔌', color: '#EF4444', category: 'TECH', defaultEnabled: false, description: 'Active internet shutdowns and disruptions' },

  // ── FINANCE ──
  { id: 'stock_exchanges', label: 'Stock Exchanges', labelAr: 'بورصات', icon: '📈', color: '#10B981', category: 'FINANCE', defaultEnabled: false, description: '92 global stock exchanges with status' },
  { id: 'financial_centers', label: 'Financial Centers', labelAr: 'مراكز مالية', icon: '🏛', color: '#3B82F6', category: 'FINANCE', defaultEnabled: false, description: 'Global financial centers (GFCI ranking)' },
  { id: 'central_banks', label: 'Central Banks', labelAr: 'بنوك مركزية', icon: '🏦', color: '#8B5CF6', category: 'FINANCE', defaultEnabled: false, description: 'Central bank locations and rate decisions' },
  { id: 'gulf_investments', label: 'GCC Investments', labelAr: 'استثمارات خليجية', icon: '🌍', color: '#059669', category: 'FINANCE', defaultEnabled: false, description: 'GCC sovereign fund investment destinations' },

  // ── COMMODITY ──
  { id: 'commodity_hubs', label: 'Commodity Hubs', labelAr: 'مراكز السلع', icon: '📦', color: '#F59E0B', category: 'COMMODITY', defaultEnabled: false, description: 'Major commodity trading and storage hubs' },
  { id: 'mining_sites', label: 'Mining Sites', labelAr: 'مواقع تعدين', icon: '⛏', color: '#92400E', category: 'COMMODITY', defaultEnabled: false, description: 'Critical mineral extraction sites' },
  { id: 'commodity_ports', label: 'Commodity Ports', labelAr: 'موانئ سلع', icon: '⚓', color: '#0D9488', category: 'COMMODITY', defaultEnabled: false, description: 'Major bulk commodity shipping ports' },
  { id: 'critical_minerals', label: 'Critical Minerals', labelAr: 'معادن حرجة', icon: '💎', color: '#7C3AED', category: 'COMMODITY', defaultEnabled: false, description: 'Rare earth and critical mineral deposits' },

  // ── MILITARY (additional worldmonitor parity) ──
  { id: 'military_activity', label: 'Military Activity', labelAr: 'نشاط عسكري', icon: '⚔', color: '#DC2626', category: 'MILITARY', defaultEnabled: false, description: 'Real-time military movement and exercise detection' },
  { id: 'armed_conflict_events', label: 'Armed Conflict (UCDP)', labelAr: 'نزاعات مسلحة', icon: '⚔', color: '#B91C1C', category: 'MILITARY', defaultEnabled: false, description: 'Uppsala Conflict Data Program armed events' },
  { id: 'strategic_waterways', label: 'Strategic Waterways', labelAr: 'ممرات مائية', icon: '🌊', color: '#0284C7', category: 'MILITARY', defaultEnabled: false, description: 'Choke points: Hormuz, Suez, Bab el-Mandeb, Malacca' },
];

// ═══════════════════════════════════════════════════════
// GEOJSON POINT DATA FOR LAYERS
// ═══════════════════════════════════════════════════════

export interface LayerPoint {
  id: string;
  lat: number;
  lon: number;
  name: string;
  description?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  layerId: string;
  timestamp?: string;
}

/** Conflict zone centers */
export const CONFLICT_ZONE_POINTS: LayerPoint[] = [
  { id: 'cz-1', lat: 36.2, lon: 37.13, name: 'Aleppo Front', severity: 'critical', layerId: 'conflict_zones' },
  { id: 'cz-2', lat: 33.88, lon: 35.51, name: 'Beirut Southern Front', severity: 'high', layerId: 'conflict_zones' },
  { id: 'cz-3', lat: 31.52, lon: 34.45, name: 'Gaza', severity: 'critical', layerId: 'conflict_zones' },
  { id: 'cz-4', lat: 15.36, lon: 44.21, name: 'Yemen (Sana\'a)', severity: 'high', layerId: 'conflict_zones' },
  { id: 'cz-5', lat: 36.19, lon: 44.01, name: 'Northern Iraq', severity: 'medium', layerId: 'conflict_zones' },
  { id: 'cz-6', lat: 2.05, lon: 45.34, name: 'Mogadishu', severity: 'high', layerId: 'conflict_zones' },
  { id: 'cz-7', lat: 15.55, lon: 32.53, name: 'Sudan (Khartoum)', severity: 'critical', layerId: 'conflict_zones' },
  { id: 'cz-8', lat: 48.38, lon: 35.04, name: 'Eastern Ukraine', severity: 'critical', layerId: 'conflict_zones' },
  { id: 'cz-9', lat: 34.80, lon: 36.72, name: 'Homs/Hama', severity: 'medium', layerId: 'conflict_zones' },
  { id: 'cz-10', lat: 13.52, lon: 43.25, name: 'Red Sea Corridor', severity: 'high', layerId: 'conflict_zones' },
];

/** Military base locations */
export const MILITARY_BASE_POINTS: LayerPoint[] = [
  { id: 'mb-1', lat: 29.22, lon: 47.97, name: 'Camp Arifjan (US)', severity: 'low', layerId: 'military_bases' },
  { id: 'mb-2', lat: 25.93, lon: 50.59, name: 'NSA Bahrain (US 5th Fleet)', severity: 'low', layerId: 'military_bases' },
  { id: 'mb-3', lat: 25.12, lon: 51.31, name: 'Al Udeid AB (US/Qatar)', severity: 'low', layerId: 'military_bases' },
  { id: 'mb-4', lat: 24.25, lon: 54.55, name: 'Al Dhafra AB (US/UAE)', severity: 'low', layerId: 'military_bases' },
  { id: 'mb-5', lat: 23.59, lon: 57.94, name: 'Thumrait AB (Oman)', severity: 'low', layerId: 'military_bases' },
  { id: 'mb-6', lat: 21.12, lon: 40.38, name: 'King Faisal AB (SA)', severity: 'low', layerId: 'military_bases' },
  { id: 'mb-7', lat: 26.27, lon: 50.15, name: 'Prince Sultan AB (SA)', severity: 'low', layerId: 'military_bases' },
  { id: 'mb-8', lat: 11.55, lon: 43.14, name: 'Camp Lemonnier (US/Djibouti)', severity: 'low', layerId: 'military_bases' },
  { id: 'mb-9', lat: 35.40, lon: 35.95, name: 'Hmeimim AB (Russia/Syria)', severity: 'medium', layerId: 'military_bases' },
  { id: 'mb-10', lat: 34.73, lon: 32.49, name: 'RAF Akrotiri (UK/Cyprus)', severity: 'low', layerId: 'military_bases' },
  { id: 'mb-11', lat: 27.18, lon: 56.17, name: 'Bandar Abbas (Iran Navy)', severity: 'high', layerId: 'military_bases' },
  { id: 'mb-12', lat: 36.84, lon: 54.40, name: 'Shahid Nojeh AB (Iran)', severity: 'high', layerId: 'military_bases' },
];

/** Nuclear facility locations */
export const NUCLEAR_SITE_POINTS: LayerPoint[] = [
  { id: 'ns-1', lat: 32.58, lon: 51.47, name: 'Isfahan Nuclear Complex (Iran)', severity: 'critical', layerId: 'nuclear_sites' },
  { id: 'ns-2', lat: 32.01, lon: 52.98, name: 'Natanz Enrichment (Iran)', severity: 'critical', layerId: 'nuclear_sites' },
  { id: 'ns-3', lat: 27.17, lon: 56.08, name: 'Bushehr Nuclear Plant (Iran)', severity: 'high', layerId: 'nuclear_sites' },
  { id: 'ns-4', lat: 34.37, lon: 49.25, name: 'Arak Heavy Water (Iran)', severity: 'high', layerId: 'nuclear_sites' },
  { id: 'ns-5', lat: 36.80, lon: 52.43, name: 'Fordow Enrichment (Iran)', severity: 'critical', layerId: 'nuclear_sites' },
  { id: 'ns-6', lat: 23.96, lon: 52.24, name: 'Barakah Nuclear (UAE)', severity: 'low', layerId: 'nuclear_sites' },
  { id: 'ns-7', lat: 31.78, lon: 35.21, name: 'Dimona (Israel)', severity: 'high', layerId: 'nuclear_sites' },
  { id: 'ns-8', lat: 30.08, lon: 31.23, name: 'El Dabaa (Egypt - planned)', severity: 'low', layerId: 'nuclear_sites' },
];

/** Intel hotspot locations */
export const INTEL_HOTSPOT_POINTS: LayerPoint[] = [
  { id: 'ih-1', lat: 26.22, lon: 50.59, name: 'Bahrain Financial Hub', severity: 'medium', layerId: 'intel_hotspots' },
  { id: 'ih-2', lat: 25.20, lon: 55.27, name: 'Dubai Free Zone', severity: 'medium', layerId: 'intel_hotspots' },
  { id: 'ih-3', lat: 33.89, lon: 35.50, name: 'Beirut Intelligence Hub', severity: 'high', layerId: 'intel_hotspots' },
  { id: 'ih-4', lat: 36.76, lon: 3.06, name: 'Algiers Watch Point', severity: 'medium', layerId: 'intel_hotspots' },
  { id: 'ih-5', lat: 41.01, lon: 28.98, name: 'Istanbul Nexus', severity: 'medium', layerId: 'intel_hotspots' },
  { id: 'ih-6', lat: 35.70, lon: 51.42, name: 'Tehran Operations', severity: 'critical', layerId: 'intel_hotspots' },
  { id: 'ih-7', lat: 33.31, lon: 44.37, name: 'Baghdad Green Zone', severity: 'high', layerId: 'intel_hotspots' },
  { id: 'ih-8', lat: 29.31, lon: 47.48, name: 'Kuwait City Finance', severity: 'low', layerId: 'intel_hotspots' },
];

/** Pipeline route points */
export const PIPELINE_POINTS: LayerPoint[] = [
  { id: 'pl-1', lat: 26.30, lon: 50.20, name: 'East-West Pipeline (SA)', layerId: 'pipelines' },
  { id: 'pl-2', lat: 24.10, lon: 52.40, name: 'Habshan-Fujairah (UAE)', layerId: 'pipelines' },
  { id: 'pl-3', lat: 25.90, lon: 51.50, name: 'Dolphin Gas Pipeline', layerId: 'pipelines' },
  { id: 'pl-4', lat: 30.10, lon: 48.30, name: 'Iraq-Turkey Pipeline', layerId: 'pipelines' },
  { id: 'pl-5', lat: 27.50, lon: 56.00, name: 'Strait of Hormuz Transit', severity: 'critical', layerId: 'pipelines' },
  { id: 'pl-6', lat: 12.80, lon: 43.30, name: 'Bab el-Mandeb Strait', severity: 'high', layerId: 'pipelines' },
];

/** AI Data Center locations */
export const AI_DATA_CENTER_POINTS: LayerPoint[] = [
  { id: 'dc-1', lat: 25.26, lon: 55.30, name: 'G42 AI Campus (Abu Dhabi)', layerId: 'ai_data_centers' },
  { id: 'dc-2', lat: 24.49, lon: 54.75, name: 'Core42 Data Center (UAE)', layerId: 'ai_data_centers' },
  { id: 'dc-3', lat: 24.77, lon: 46.74, name: 'STC Cloud (Riyadh)', layerId: 'ai_data_centers' },
  { id: 'dc-4', lat: 25.32, lon: 55.39, name: 'AWS ME Region (Bahrain)', layerId: 'ai_data_centers' },
  { id: 'dc-5', lat: 25.25, lon: 51.53, name: 'Microsoft Azure Qatar', layerId: 'ai_data_centers' },
  { id: 'dc-6', lat: 25.20, lon: 55.27, name: 'Oracle Cloud Dubai', layerId: 'ai_data_centers' },
];

/** Iran attack/proxy strike points */
export const IRAN_ATTACK_POINTS: LayerPoint[] = [
  { id: 'ia-1', lat: 26.30, lon: 50.10, name: 'Abqaiq Attack (2019)', severity: 'critical', layerId: 'iran_attacks' },
  { id: 'ia-2', lat: 28.38, lon: 36.57, name: 'Houthi Drone Strikes', severity: 'high', layerId: 'iran_attacks' },
  { id: 'ia-3', lat: 32.02, lon: 34.77, name: 'IRGC Missile Strikes (Israel)', severity: 'critical', layerId: 'iran_attacks' },
  { id: 'ia-4', lat: 36.19, lon: 44.01, name: 'PMF/IRGC Operations (Iraq)', severity: 'high', layerId: 'iran_attacks' },
  { id: 'ia-5', lat: 13.50, lon: 43.20, name: 'Houthi Anti-Ship (Red Sea)', severity: 'critical', layerId: 'iran_attacks' },
  { id: 'ia-6', lat: 33.50, lon: 36.30, name: 'Hezbollah Positions (Syria)', severity: 'high', layerId: 'iran_attacks' },
  { id: 'ia-7', lat: 33.88, lon: 35.51, name: 'Hezbollah (Lebanon)', severity: 'critical', layerId: 'iran_attacks' },
];

// ═══════════════════════════════════════════════════════
// EXPANDED LAYER DATA — Space, Tech, Finance, Commodity,
// Environmental, Infrastructure, Military (additional)
// ═══════════════════════════════════════════════════════

/** Spaceport / launch site locations */
export const SPACEPORT_POINTS: LayerPoint[] = [
  { id: 'sp-1', lat: 28.57, lon: -80.65, name: 'Cape Canaveral (US)', layerId: 'spaceports' },
  { id: 'sp-2', lat: 34.63, lon: -120.63, name: 'Vandenberg SFB (US)', layerId: 'spaceports' },
  { id: 'sp-3', lat: 5.24, lon: -52.77, name: 'Kourou (ESA/France)', layerId: 'spaceports' },
  { id: 'sp-4', lat: 45.96, lon: 63.56, name: 'Baikonur (Russia/KZ)', layerId: 'spaceports' },
  { id: 'sp-5', lat: 19.61, lon: 110.95, name: 'Wenchang (China)', layerId: 'spaceports' },
  { id: 'sp-6', lat: 13.72, lon: 80.23, name: 'Sriharikota (India)', layerId: 'spaceports' },
  { id: 'sp-7', lat: 31.25, lon: 131.08, name: 'Tanegashima (Japan)', layerId: 'spaceports' },
  { id: 'sp-8', lat: 25.97, lon: -97.16, name: 'Starbase Boca Chica (SpaceX)', layerId: 'spaceports' },
];

/** Stock exchange locations */
export const STOCK_EXCHANGE_POINTS: LayerPoint[] = [
  { id: 'se-1', lat: 40.71, lon: -74.01, name: 'NYSE (New York)', layerId: 'stock_exchanges' },
  { id: 'se-2', lat: 51.51, lon: -0.09, name: 'LSE (London)', layerId: 'stock_exchanges' },
  { id: 'se-3', lat: 35.68, lon: 139.77, name: 'TSE (Tokyo)', layerId: 'stock_exchanges' },
  { id: 'se-4', lat: 22.28, lon: 114.16, name: 'HKEX (Hong Kong)', layerId: 'stock_exchanges' },
  { id: 'se-5', lat: 31.23, lon: 121.47, name: 'SSE (Shanghai)', layerId: 'stock_exchanges' },
  { id: 'se-6', lat: 24.77, lon: 46.74, name: 'Tadawul (Riyadh)', severity: 'low', layerId: 'stock_exchanges' },
  { id: 'se-7', lat: 25.20, lon: 55.27, name: 'DFM (Dubai)', severity: 'low', layerId: 'stock_exchanges' },
  { id: 'se-8', lat: 24.45, lon: 54.65, name: 'ADX (Abu Dhabi)', severity: 'low', layerId: 'stock_exchanges' },
  { id: 'se-9', lat: 25.29, lon: 51.53, name: 'QSE (Doha)', severity: 'low', layerId: 'stock_exchanges' },
  { id: 'se-10', lat: 29.38, lon: 47.99, name: 'Boursa Kuwait', severity: 'low', layerId: 'stock_exchanges' },
  { id: 'se-11', lat: 26.23, lon: 50.59, name: 'BHB (Bahrain)', severity: 'low', layerId: 'stock_exchanges' },
  { id: 'se-12', lat: 23.59, lon: 58.38, name: 'MSM (Muscat)', severity: 'low', layerId: 'stock_exchanges' },
  { id: 'se-13', lat: 50.11, lon: 8.68, name: 'Deutsche Börse (Frankfurt)', layerId: 'stock_exchanges' },
  { id: 'se-14', lat: 19.08, lon: 72.88, name: 'BSE/NSE (Mumbai)', layerId: 'stock_exchanges' },
  { id: 'se-15', lat: 43.65, lon: -79.38, name: 'TSX (Toronto)', layerId: 'stock_exchanges' },
];

/** Financial center locations */
export const FINANCIAL_CENTER_POINTS: LayerPoint[] = [
  { id: 'fc-1', lat: 40.71, lon: -74.01, name: 'New York (GFCI #1)', layerId: 'financial_centers' },
  { id: 'fc-2', lat: 51.51, lon: -0.13, name: 'London (GFCI #2)', layerId: 'financial_centers' },
  { id: 'fc-3', lat: 1.35, lon: 103.82, name: 'Singapore (GFCI #3)', layerId: 'financial_centers' },
  { id: 'fc-4', lat: 22.32, lon: 114.17, name: 'Hong Kong (GFCI #4)', layerId: 'financial_centers' },
  { id: 'fc-5', lat: 25.20, lon: 55.27, name: 'Dubai (DIFC)', severity: 'low', layerId: 'financial_centers' },
  { id: 'fc-6', lat: 24.77, lon: 46.74, name: 'Riyadh (Financial District)', severity: 'low', layerId: 'financial_centers' },
  { id: 'fc-7', lat: 26.23, lon: 50.59, name: 'Bahrain (BFH)', severity: 'low', layerId: 'financial_centers' },
  { id: 'fc-8', lat: 47.37, lon: 8.54, name: 'Zurich', layerId: 'financial_centers' },
  { id: 'fc-9', lat: 35.68, lon: 139.69, name: 'Tokyo', layerId: 'financial_centers' },
];

/** Central bank locations */
export const CENTRAL_BANK_POINTS: LayerPoint[] = [
  { id: 'cb-1', lat: 24.69, lon: 46.69, name: 'SAMA (Saudi Central Bank)', severity: 'low', layerId: 'central_banks' },
  { id: 'cb-2', lat: 24.45, lon: 54.38, name: 'CBUAE (Central Bank UAE)', severity: 'low', layerId: 'central_banks' },
  { id: 'cb-3', lat: 25.29, lon: 51.53, name: 'QCB (Qatar Central Bank)', severity: 'low', layerId: 'central_banks' },
  { id: 'cb-4', lat: 29.37, lon: 47.98, name: 'CBK (Central Bank Kuwait)', severity: 'low', layerId: 'central_banks' },
  { id: 'cb-5', lat: 26.22, lon: 50.58, name: 'CBB (Central Bank Bahrain)', severity: 'low', layerId: 'central_banks' },
  { id: 'cb-6', lat: 23.61, lon: 58.59, name: 'CBO (Central Bank Oman)', severity: 'low', layerId: 'central_banks' },
  { id: 'cb-7', lat: 38.89, lon: -77.05, name: 'US Federal Reserve', layerId: 'central_banks' },
  { id: 'cb-8', lat: 50.11, lon: 8.68, name: 'ECB (Frankfurt)', layerId: 'central_banks' },
  { id: 'cb-9', lat: 51.51, lon: -0.09, name: 'Bank of England', layerId: 'central_banks' },
];

/** GCC Sovereign Fund investment destinations */
export const GULF_INVESTMENT_POINTS: LayerPoint[] = [
  { id: 'gi-1', lat: 37.77, lon: -122.42, name: 'PIF/ADIA — Silicon Valley Tech', severity: 'low', layerId: 'gulf_investments' },
  { id: 'gi-2', lat: 51.51, lon: -0.13, name: 'PIF/QIA — London Real Estate', severity: 'low', layerId: 'gulf_investments' },
  { id: 'gi-3', lat: 40.71, lon: -74.01, name: 'ADIA/KIA — NY Finance', severity: 'low', layerId: 'gulf_investments' },
  { id: 'gi-4', lat: 41.39, lon: 2.17, name: 'QSI — FC Barcelona', severity: 'low', layerId: 'gulf_investments' },
  { id: 'gi-5', lat: 48.86, lon: 2.35, name: 'QSI — Paris (PSG)', severity: 'low', layerId: 'gulf_investments' },
  { id: 'gi-6', lat: 53.48, lon: -2.24, name: 'ADUG — Manchester City', severity: 'low', layerId: 'gulf_investments' },
  { id: 'gi-7', lat: 34.05, lon: -118.24, name: 'PIF — Lucid Motors', severity: 'low', layerId: 'gulf_investments' },
  { id: 'gi-8', lat: 26.07, lon: 50.56, name: 'Mumtalakat — Bahrain Sovereign', severity: 'low', layerId: 'gulf_investments' },
];

/** Startup hub locations */
export const STARTUP_HUB_POINTS: LayerPoint[] = [
  { id: 'sh-1', lat: 37.39, lon: -122.08, name: 'Silicon Valley', layerId: 'startup_hubs' },
  { id: 'sh-2', lat: 51.52, lon: -0.08, name: 'London Tech City', layerId: 'startup_hubs' },
  { id: 'sh-3', lat: 32.07, lon: 34.78, name: 'Tel Aviv', layerId: 'startup_hubs' },
  { id: 'sh-4', lat: 12.97, lon: 77.59, name: 'Bangalore', layerId: 'startup_hubs' },
  { id: 'sh-5', lat: 1.30, lon: 103.85, name: 'Singapore', layerId: 'startup_hubs' },
  { id: 'sh-6', lat: 25.20, lon: 55.27, name: 'Dubai (DIFC Innovation)', severity: 'low', layerId: 'startup_hubs' },
  { id: 'sh-7', lat: 24.77, lon: 46.74, name: 'Riyadh (NEOM/Oxagon)', severity: 'low', layerId: 'startup_hubs' },
  { id: 'sh-8', lat: 52.52, lon: 13.41, name: 'Berlin', layerId: 'startup_hubs' },
];

/** Tech company HQ locations */
export const TECH_HQ_POINTS: LayerPoint[] = [
  { id: 'th-1', lat: 37.48, lon: -122.14, name: 'Meta (Menlo Park)', layerId: 'tech_hqs' },
  { id: 'th-2', lat: 37.33, lon: -122.01, name: 'Apple (Cupertino)', layerId: 'tech_hqs' },
  { id: 'th-3', lat: 37.42, lon: -122.08, name: 'Google (Mountain View)', layerId: 'tech_hqs' },
  { id: 'th-4', lat: 47.64, lon: -122.13, name: 'Microsoft (Redmond)', layerId: 'tech_hqs' },
  { id: 'th-5', lat: 47.62, lon: -122.35, name: 'Amazon (Seattle)', layerId: 'tech_hqs' },
  { id: 'th-6', lat: 37.77, lon: -122.39, name: 'OpenAI (SF)', layerId: 'tech_hqs' },
  { id: 'th-7', lat: 39.95, lon: 116.33, name: 'ByteDance (Beijing)', layerId: 'tech_hqs' },
  { id: 'th-8', lat: 22.54, lon: 113.94, name: 'Tencent (Shenzhen)', layerId: 'tech_hqs' },
  { id: 'th-9', lat: 37.57, lon: 127.00, name: 'Samsung (Seoul)', layerId: 'tech_hqs' },
];

/** Cloud region locations */
export const CLOUD_REGION_POINTS: LayerPoint[] = [
  { id: 'cr-1', lat: 26.07, lon: 50.56, name: 'AWS me-south-1 (Bahrain)', severity: 'low', layerId: 'cloud_regions' },
  { id: 'cr-2', lat: 25.29, lon: 51.53, name: 'Azure Qatar', severity: 'low', layerId: 'cloud_regions' },
  { id: 'cr-3', lat: 25.28, lon: 55.31, name: 'GCP me-central2 (Dammam)', severity: 'low', layerId: 'cloud_regions' },
  { id: 'cr-4', lat: 39.96, lon: -83.00, name: 'AWS us-east-2 (Ohio)', layerId: 'cloud_regions' },
  { id: 'cr-5', lat: 50.11, lon: 8.68, name: 'AWS eu-central-1 (Frankfurt)', layerId: 'cloud_regions' },
  { id: 'cr-6', lat: 35.68, lon: 139.69, name: 'AWS ap-northeast-1 (Tokyo)', layerId: 'cloud_regions' },
  { id: 'cr-7', lat: 1.35, lon: 103.82, name: 'AWS ap-southeast-1 (Singapore)', layerId: 'cloud_regions' },
];

/** Commodity hub locations */
export const COMMODITY_HUB_POINTS: LayerPoint[] = [
  { id: 'ch-1', lat: 1.26, lon: 103.85, name: 'Singapore (LNG Hub)', layerId: 'commodity_hubs' },
  { id: 'ch-2', lat: 51.51, lon: -0.13, name: 'London (LME Metals)', layerId: 'commodity_hubs' },
  { id: 'ch-3', lat: 41.88, lon: -87.63, name: 'Chicago (CME Grains)', layerId: 'commodity_hubs' },
  { id: 'ch-4', lat: 25.20, lon: 55.27, name: 'Dubai (DMCC Gold)', severity: 'low', layerId: 'commodity_hubs' },
  { id: 'ch-5', lat: 29.76, lon: -95.37, name: 'Houston (Oil & Gas)', layerId: 'commodity_hubs' },
  { id: 'ch-6', lat: 26.43, lon: 50.10, name: 'Ras Tanura (Saudi Oil Terminal)', severity: 'high', layerId: 'commodity_hubs' },
  { id: 'ch-7', lat: 51.95, lon: 4.48, name: 'Rotterdam (European Hub)', layerId: 'commodity_hubs' },
];

/** Strategic waterway chokepoints */
export const STRATEGIC_WATERWAY_POINTS: LayerPoint[] = [
  { id: 'sw-1', lat: 26.56, lon: 56.25, name: 'Strait of Hormuz', severity: 'critical', layerId: 'strategic_waterways' },
  { id: 'sw-2', lat: 30.46, lon: 32.34, name: 'Suez Canal', severity: 'high', layerId: 'strategic_waterways' },
  { id: 'sw-3', lat: 12.64, lon: 43.26, name: 'Bab el-Mandeb', severity: 'critical', layerId: 'strategic_waterways' },
  { id: 'sw-4', lat: 1.26, lon: 103.55, name: 'Strait of Malacca', severity: 'medium', layerId: 'strategic_waterways' },
  { id: 'sw-5', lat: 41.12, lon: 29.05, name: 'Turkish Straits (Bosphorus)', severity: 'medium', layerId: 'strategic_waterways' },
  { id: 'sw-6', lat: 9.00, lon: 79.60, name: 'Palk Strait', severity: 'low', layerId: 'strategic_waterways' },
];

/** Desalination plant locations (GCC) */
export const DESALINATION_POINTS: LayerPoint[] = [
  { id: 'ds-1', lat: 26.14, lon: 50.22, name: 'Ras Al Khair (SA) — world\'s largest', severity: 'low', layerId: 'desalination' },
  { id: 'ds-2', lat: 25.08, lon: 55.14, name: 'Jebel Ali (UAE)', severity: 'low', layerId: 'desalination' },
  { id: 'ds-3', lat: 29.33, lon: 47.95, name: 'Doha West (Kuwait)', severity: 'low', layerId: 'desalination' },
  { id: 'ds-4', lat: 25.35, lon: 51.44, name: 'Ras Abu Fontas (Qatar)', severity: 'low', layerId: 'desalination' },
  { id: 'ds-5', lat: 23.64, lon: 57.63, name: 'Barka (Oman)', severity: 'low', layerId: 'desalination' },
  { id: 'ds-6', lat: 26.20, lon: 50.48, name: 'Al Hidd (Bahrain)', severity: 'low', layerId: 'desalination' },
];

/** Solar farm locations */
export const SOLAR_FARM_POINTS: LayerPoint[] = [
  { id: 'sf-1', lat: 24.45, lon: 54.61, name: 'Al Dhafra Solar (UAE) — 2GW', severity: 'low', layerId: 'solar_farms' },
  { id: 'sf-2', lat: 23.76, lon: 45.56, name: 'Sudair Solar (SA) — 1.5GW', severity: 'low', layerId: 'solar_farms' },
  { id: 'sf-3', lat: 25.02, lon: 55.37, name: 'Mohammed bin Rashid Solar Park (UAE)', severity: 'low', layerId: 'solar_farms' },
  { id: 'sf-4', lat: 25.25, lon: 51.55, name: 'Al Kharsaah Solar (Qatar)', severity: 'low', layerId: 'solar_farms' },
  { id: 'sf-5', lat: 23.15, lon: 57.10, name: 'Ibri Solar (Oman)', severity: 'low', layerId: 'solar_farms' },
];

/** Oil facility locations */
export const OIL_FACILITY_POINTS: LayerPoint[] = [
  { id: 'of-1', lat: 25.38, lon: 49.62, name: 'Ghawar Field (SA)', severity: 'low', layerId: 'oil_facilities' },
  { id: 'of-2', lat: 26.43, lon: 50.10, name: 'Ras Tanura Refinery (SA)', severity: 'medium', layerId: 'oil_facilities' },
  { id: 'of-3', lat: 24.83, lon: 54.90, name: 'Ruwais Refinery (UAE)', severity: 'low', layerId: 'oil_facilities' },
  { id: 'of-4', lat: 25.77, lon: 55.94, name: 'Fujairah Oil Terminal (UAE)', severity: 'low', layerId: 'oil_facilities' },
  { id: 'of-5', lat: 29.08, lon: 48.08, name: 'Kuwait Refineries', severity: 'low', layerId: 'oil_facilities' },
  { id: 'of-6', lat: 25.90, lon: 51.55, name: 'Ras Laffan (Qatar LNG)', severity: 'low', layerId: 'oil_facilities' },
  { id: 'of-7', lat: 23.20, lon: 57.07, name: 'Sohar Refinery (Oman)', severity: 'low', layerId: 'oil_facilities' },
  { id: 'of-8', lat: 26.30, lon: 50.21, name: 'Abqaiq Processing (SA)', severity: 'critical', layerId: 'oil_facilities' },
];

/** Get all points for a given layer */
export function getLayerPoints(layerId: string): LayerPoint[] {
  switch (layerId) {
    case 'conflict_zones': return CONFLICT_ZONE_POINTS;
    case 'military_bases': return MILITARY_BASE_POINTS;
    case 'nuclear_sites': return NUCLEAR_SITE_POINTS;
    case 'intel_hotspots': return INTEL_HOTSPOT_POINTS;
    case 'pipelines': return PIPELINE_POINTS;
    case 'ai_data_centers': return AI_DATA_CENTER_POINTS;
    case 'iran_attacks': return IRAN_ATTACK_POINTS;
    case 'spaceports': return SPACEPORT_POINTS;
    case 'stock_exchanges': return STOCK_EXCHANGE_POINTS;
    case 'financial_centers': return FINANCIAL_CENTER_POINTS;
    case 'central_banks': return CENTRAL_BANK_POINTS;
    case 'gulf_investments': return GULF_INVESTMENT_POINTS;
    case 'startup_hubs': return STARTUP_HUB_POINTS;
    case 'tech_hqs': return TECH_HQ_POINTS;
    case 'cloud_regions': return CLOUD_REGION_POINTS;
    case 'commodity_hubs': return COMMODITY_HUB_POINTS;
    case 'strategic_waterways': return STRATEGIC_WATERWAY_POINTS;
    case 'desalination': return DESALINATION_POINTS;
    case 'solar_farms': return SOLAR_FARM_POINTS;
    case 'oil_facilities': return OIL_FACILITY_POINTS;
    default: return [];
  }
}
