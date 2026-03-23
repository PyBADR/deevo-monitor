/**
 * DEEVO Intelligence Monitor v3 — Entity & Edge Registry
 * Contract 3 / File 1 of 4
 * Layer: Data (L1) — 34 GCC entities + inter-entity edges
 *
 * Each entity maps to a node in the Force Graph View.
 * Each edge maps to a link with typed relationships.
 *
 * Trade-off: Static registry vs DB-driven — static chosen for
 *            offline-first capability and zero-latency graph rendering.
 *            Entity additions require code deploy (acceptable for v3).
 */

import type {
  GCCEntity,
  EntityEdge,
  EntityGraph,
  RiskLevel,
  RiskTrend,
} from '../types/entities';

// ── Helper: Entity Factory ───────────────────────────────
const e = (
  id: string,
  name: string,
  nameAr: string,
  type: GCCEntity['type'],
  country: GCCEntity['country'],
  coords: [number, number],
  riskLevel: RiskLevel = 'LOW',
  riskTrend: RiskTrend = 'stable',
  riskScore = 25,
): GCCEntity => ({
  id,
  name,
  nameAr,
  type,
  country,
  coordinates: coords,
  riskLevel,
  riskTrend,
  riskScore,
  layer: 'data',
  activeAlerts: 0,
  lastUpdated: new Date().toISOString(),
});

// ── 34 GCC Entities ──────────────────────────────────────
export const GCC_ENTITIES: readonly GCCEntity[] = [
  // ── Saudi Arabia (9) ───────────────────────────────────
  e('regulator_SA_sama', 'SAMA', 'ساما', 'regulator', 'SA', [46.68, 24.71]),
  e('insurer_SA_tawuniya', 'Tawuniya', 'التعاونية', 'insurer', 'SA', [46.69, 24.72], 'MEDIUM', 'stable', 42),
  e('insurer_SA_bupa', 'Bupa Arabia', 'بوبا العربية', 'insurer', 'SA', [46.70, 24.73], 'LOW', 'improving', 30),
  e('sovereign_SA_pif', 'PIF', 'صندوق الاستثمارات العامة', 'sovereign_fund', 'SA', [46.67, 24.69]),
  e('exchange_SA_tadawul', 'Tadawul', 'تداول', 'exchange', 'SA', [46.69, 24.71]),
  e('refinery_SA_rastanura', 'Ras Tanura', 'رأس تنورة', 'refinery', 'SA', [50.20, 26.39], 'MEDIUM', 'stable', 45),
  e('port_SA_dammam', 'King Abdulaziz Port', 'ميناء الملك عبدالعزيز', 'port', 'SA', [50.10, 26.47]),
  e('oilfield_SA_ghawar', 'Ghawar Field', 'حقل الغوار', 'oilfield', 'SA', [49.20, 25.40], 'LOW', 'stable', 20),
  e('hospital_SA_kfsh', 'King Faisal Specialist Hospital', 'مستشفى الملك فيصل التخصصي', 'hospital', 'SA', [46.62, 24.72]),

  // ── UAE (8) ────────────────────────────────────────────
  e('regulator_AE_cbuae', 'CBUAE', 'مصرف الإمارات المركزي', 'regulator', 'AE', [54.38, 24.45]),
  e('insurer_AE_adnic', 'ADNIC', 'أدنيك', 'insurer', 'AE', [54.37, 24.46], 'LOW', 'improving', 28),
  e('insurer_AE_oman_ins', 'Oman Insurance', 'عمان للتأمين', 'insurer', 'AE', [55.27, 25.20], 'MEDIUM', 'stable', 38),
  e('ftz_AE_difc', 'DIFC', 'مركز دبي المالي العالمي', 'ftz', 'AE', [55.28, 25.21]),
  e('ftz_AE_jafza', 'JAFZA', 'جافزا', 'ftz', 'AE', [55.10, 25.00]),
  e('airport_AE_dxb', 'Dubai Intl Airport', 'مطار دبي الدولي', 'airport', 'AE', [55.37, 25.25]),
  e('port_AE_fujairah', 'Port of Fujairah', 'ميناء الفجيرة', 'port', 'AE', [56.34, 25.12], 'MEDIUM', 'deteriorating', 50),
  e('tech_hub_AE_hub71', 'Hub71', 'هب71', 'tech_hub', 'AE', [54.44, 24.45]),

  // ── Qatar (4) ──────────────────────────────────────────
  e('regulator_QA_qcb', 'QCB', 'مصرف قطر المركزي', 'regulator', 'QA', [51.53, 25.29]),
  e('insurer_QA_qic', 'QIC', 'قطر للتأمين', 'insurer', 'QA', [51.52, 25.30], 'LOW', 'stable', 22),
  e('sovereign_QA_qia', 'QIA', 'جهاز قطر للاستثمار', 'sovereign_fund', 'QA', [51.53, 25.31]),
  e('port_QA_hamad', 'Hamad Port', 'ميناء حمد', 'port', 'QA', [51.56, 25.30]),

  // ── Kuwait (4) ─────────────────────────────────────────
  e('regulator_KW_cbk', 'CBK', 'بنك الكويت المركزي', 'regulator', 'KW', [47.98, 29.38]),
  e('insurer_KW_gig', 'GIG', 'مجموعة الخليج للتأمين', 'insurer', 'KW', [47.97, 29.37], 'LOW', 'stable', 26),
  e('sovereign_KW_kia', 'KIA', 'الهيئة العامة للاستثمار', 'sovereign_fund', 'KW', [47.99, 29.38]),
  e('oilfield_KW_burgan', 'Burgan Field', 'حقل برقان', 'oilfield', 'KW', [47.98, 29.07], 'LOW', 'stable', 18),

  // ── Bahrain (4) ────────────────────────────────────────
  e('regulator_BH_cbb', 'CBB', 'مصرف البحرين المركزي', 'regulator', 'BH', [50.59, 26.23]),
  e('insurer_BH_solidarity', 'Solidarity', 'سوليدرتي', 'insurer', 'BH', [50.58, 26.22], 'LOW', 'improving', 20),
  e('ftz_BH_bhb', 'Bahrain Bourse', 'بورصة البحرين', 'exchange', 'BH', [50.57, 26.24]),
  e('airport_BH_bah', 'Bahrain Intl Airport', 'مطار البحرين الدولي', 'airport', 'BH', [50.63, 26.27]),

  // ── Oman (5) ───────────────────────────────────────────
  e('regulator_OM_cma', 'CMA Oman', 'هيئة سوق المال', 'regulator', 'OM', [58.54, 23.61]),
  e('insurer_OM_dhofar', 'Dhofar Insurance', 'ظفار للتأمين', 'insurer', 'OM', [58.53, 23.60], 'LOW', 'stable', 24),
  e('port_OM_sohar', 'Port of Sohar', 'ميناء صحار', 'port', 'OM', [56.73, 24.34]),
  e('refinery_OM_sohar_ref', 'Sohar Refinery', 'مصفاة صحار', 'refinery', 'OM', [56.72, 24.35], 'LOW', 'stable', 22),
  e('desalination_OM_barka', 'Barka Desal Plant', 'محطة بركاء للتحلية', 'desalination', 'OM', [57.88, 23.68]),
] as const;

// ── Edge Factory ─────────────────────────────────────────
const edge = (
  source: string,
  target: string,
  type: EntityEdge['type'],
  label: string,
  weight = 0.5,
): EntityEdge => ({
  id: `edge_${source}_${target}`,
  source,
  target,
  type,
  weight,
  label,
  active: true,
  lastUpdated: new Date().toISOString(),
});

// ── Inter-Entity Edges ───────────────────────────────────
export const GCC_EDGES: readonly EntityEdge[] = [
  // Regulatory oversight
  edge('regulator_SA_sama', 'insurer_SA_tawuniya', 'regulatory', 'SAMA oversight'),
  edge('regulator_SA_sama', 'insurer_SA_bupa', 'regulatory', 'SAMA oversight'),
  edge('regulator_AE_cbuae', 'insurer_AE_adnic', 'regulatory', 'CBUAE oversight'),
  edge('regulator_AE_cbuae', 'insurer_AE_oman_ins', 'regulatory', 'CBUAE oversight'),
  edge('regulator_QA_qcb', 'insurer_QA_qic', 'regulatory', 'QCB oversight'),
  edge('regulator_KW_cbk', 'insurer_KW_gig', 'regulatory', 'CBK oversight'),
  edge('regulator_BH_cbb', 'insurer_BH_solidarity', 'regulatory', 'CBB oversight'),
  edge('regulator_OM_cma', 'insurer_OM_dhofar', 'regulatory', 'CMA oversight'),

  // Reinsurance cession
  edge('insurer_SA_tawuniya', 'insurer_QA_qic', 'reinsurance', 'Treaty cession', 0.7),
  edge('insurer_AE_adnic', 'insurer_QA_qic', 'reinsurance', 'Facultative cession', 0.4),
  edge('insurer_KW_gig', 'insurer_SA_tawuniya', 'reinsurance', 'Cross-GCC reinsurance', 0.5),
  edge('insurer_BH_solidarity', 'insurer_AE_oman_ins', 'reinsurance', 'Retakaful', 0.3),

  // Energy supply chain
  edge('oilfield_SA_ghawar', 'refinery_SA_rastanura', 'energy', 'Crude pipeline', 0.9),
  edge('refinery_SA_rastanura', 'port_SA_dammam', 'energy', 'Product export', 0.8),
  edge('oilfield_KW_burgan', 'port_QA_hamad', 'energy', 'LNG export route', 0.4),
  edge('refinery_OM_sohar_ref', 'port_OM_sohar', 'energy', 'Refinery-port link', 0.85),

  // Financial flows
  edge('sovereign_SA_pif', 'exchange_SA_tadawul', 'financial', 'PIF → Tadawul', 0.8),
  edge('sovereign_QA_qia', 'ftz_AE_difc', 'financial', 'QIA → DIFC investment', 0.6),
  edge('sovereign_KW_kia', 'exchange_SA_tadawul', 'financial', 'KIA → Tadawul cross-listing', 0.5),
  edge('ftz_BH_bhb', 'ftz_AE_difc', 'financial', 'Cross-exchange linkage', 0.4),

  // Trade & logistics
  edge('port_AE_fujairah', 'ftz_AE_jafza', 'trade', 'Fujairah → JAFZA logistics', 0.7),
  edge('airport_AE_dxb', 'ftz_AE_jafza', 'supply_chain', 'Air-FTZ cargo', 0.65),
  edge('port_QA_hamad', 'port_SA_dammam', 'supply_chain', 'GCC marine corridor', 0.5),
  edge('airport_BH_bah', 'ftz_AE_difc', 'supply_chain', 'BAH → DIFC air link', 0.3),

  // Risk transfer chains
  edge('insurer_SA_tawuniya', 'sovereign_SA_pif', 'risk_transfer', 'Sovereign backstop', 0.6),
  edge('insurer_AE_adnic', 'ftz_AE_difc', 'risk_transfer', 'DIFC captive facility', 0.4),

  // Correlation-detected
  edge('port_AE_fujairah', 'refinery_SA_rastanura', 'correlation', 'Hormuz chokepoint co-risk', 0.75),
  edge('desalination_OM_barka', 'hospital_SA_kfsh', 'correlation', 'Climate-health cascade', 0.3),
] as const;

// ── Assembled Graph ──────────────────────────────────────
export const GCC_ENTITY_GRAPH: EntityGraph = {
  nodes: [...GCC_ENTITIES],
  edges: [...GCC_EDGES],
  meta: {
    totalNodes: GCC_ENTITIES.length,
    totalEdges: GCC_EDGES.length,
    lastUpdated: new Date().toISOString(),
    version: '3.0.0',
  },
};

// ── Lookup Helpers ───────────────────────────────────────
export const getEntityById = (id: string): GCCEntity | undefined =>
  GCC_ENTITIES.find((n) => n.id === id);

export const getEntitiesByCountry = (country: GCCEntity['country']): GCCEntity[] =>
  GCC_ENTITIES.filter((n) => n.country === country);

export const getEntitiesByType = (type: GCCEntity['type']): GCCEntity[] =>
  GCC_ENTITIES.filter((n) => n.type === type);

export const getEdgesForEntity = (entityId: string): EntityEdge[] =>
  GCC_EDGES.filter((e) => e.source === entityId || e.target === entityId);
