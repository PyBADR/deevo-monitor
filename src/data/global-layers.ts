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
    default: return [];
  }
}
