/**
 * DEEVO Market Dynamics Engine — Economic Graph + Ministry Linking
 * Layer: Models
 * Unified graph: country → sector → ministry → GDP component → company → event
 * Edges: affects, drives, depends_on, regulated_by, propagates_to, increases, decreases
 * Answers: "Oil → Ministry of Energy → Exports → GDP"
 */

import type { SectorId, GDPComponent } from './sectorOntology';
import { SECTOR_REGISTRY, ALL_SECTOR_IDS } from './sectorOntology';

// ---------------------------------------------------------------------------
// Graph Node/Edge Types
// ---------------------------------------------------------------------------

export type EconNodeType = 'country' | 'sector' | 'ministry' | 'company' | 'event' | 'signal' | 'gdp-component';
export type EconEdgeType = 'affects' | 'drives' | 'depends_on' | 'regulated_by' | 'propagates_to' | 'increases' | 'decreases';

export interface EconNode {
  id: string;
  type: EconNodeType;
  label: string;
  labelAr: string;
  metadata: Record<string, string | number>;
}

export interface EconEdge {
  from: string;
  to: string;
  type: EconEdgeType;
  weight: number; // 0-1
  label: string;
}

export interface EconomicGraph {
  nodes: EconNode[];
  edges: EconEdge[];
}

// ---------------------------------------------------------------------------
// GCC Ministries — linked to sectors and GDP components
// ---------------------------------------------------------------------------

export interface Ministry {
  id: string;
  label: string;
  labelAr: string;
  country: string;
  sectors: SectorId[];
  gdpComponents: GDPComponent[];
}

const GCC_MINISTRIES: Ministry[] = [
  // Saudi Arabia
  { id: 'sa-energy', label: 'Ministry of Energy (SA)', labelAr: 'وزارة الطاقة', country: 'SA', sectors: ['oil-gas'], gdpComponents: ['net-exports', 'government-spending'] },
  { id: 'sa-finance', label: 'Ministry of Finance (SA)', labelAr: 'وزارة المالية', country: 'SA', sectors: ['banking', 'fintech'], gdpComponents: ['government-spending', 'investment'] },
  { id: 'sa-commerce', label: 'Ministry of Commerce (SA)', labelAr: 'وزارة التجارة', country: 'SA', sectors: ['ecommerce', 'supply-chain'], gdpComponents: ['consumption', 'net-exports'] },
  { id: 'sa-investment', label: 'Ministry of Investment (SA)', labelAr: 'وزارة الاستثمار', country: 'SA', sectors: ['infrastructure', 'ai-economy'], gdpComponents: ['investment'] },
  { id: 'sa-transport', label: 'Ministry of Transport (SA)', labelAr: 'وزارة النقل', country: 'SA', sectors: ['supply-chain', 'aviation'], gdpComponents: ['investment', 'net-exports'] },
  { id: 'sa-cma', label: 'SAMA', labelAr: 'البنك المركزي السعودي', country: 'SA', sectors: ['banking', 'insurance', 'fintech'], gdpComponents: ['investment', 'consumption'] },
  { id: 'sa-defense', label: 'Ministry of Defense (SA)', labelAr: 'وزارة الدفاع', country: 'SA', sectors: ['defense', 'space-satellite'], gdpComponents: ['government-spending'] },
  { id: 'sa-environment', label: 'Ministry of Environment (SA)', labelAr: 'وزارة البيئة', country: 'SA', sectors: ['food-water'], gdpComponents: ['consumption', 'government-spending'] },
  // UAE
  { id: 'ae-energy', label: 'Ministry of Energy (AE)', labelAr: 'وزارة الطاقة والبنية التحتية', country: 'AE', sectors: ['oil-gas', 'infrastructure'], gdpComponents: ['net-exports', 'investment'] },
  { id: 'ae-economy', label: 'Ministry of Economy (AE)', labelAr: 'وزارة الاقتصاد', country: 'AE', sectors: ['ecommerce', 'fintech', 'digital-economy'], gdpComponents: ['consumption', 'investment'] },
  { id: 'ae-finance', label: 'Ministry of Finance (AE)', labelAr: 'وزارة المالية', country: 'AE', sectors: ['banking'], gdpComponents: ['government-spending'] },
  { id: 'ae-cbuae', label: 'CBUAE', labelAr: 'مصرف الإمارات المركزي', country: 'AE', sectors: ['banking', 'insurance', 'fintech'], gdpComponents: ['investment', 'consumption'] },
  // Kuwait
  { id: 'kw-oil', label: 'Ministry of Oil (KW)', labelAr: 'وزارة النفط', country: 'KW', sectors: ['oil-gas'], gdpComponents: ['net-exports', 'government-spending'] },
  { id: 'kw-finance', label: 'Ministry of Finance (KW)', labelAr: 'وزارة المالية', country: 'KW', sectors: ['banking'], gdpComponents: ['government-spending', 'investment'] },
  // Qatar
  { id: 'qa-energy', label: 'Ministry of Energy (QA)', labelAr: 'وزارة الطاقة', country: 'QA', sectors: ['oil-gas'], gdpComponents: ['net-exports', 'government-spending'] },
  { id: 'qa-commerce', label: 'Ministry of Commerce (QA)', labelAr: 'وزارة التجارة والصناعة', country: 'QA', sectors: ['ecommerce', 'supply-chain'], gdpComponents: ['consumption', 'net-exports'] },
  // Bahrain
  { id: 'bh-finance', label: 'Ministry of Finance (BH)', labelAr: 'وزارة المالية', country: 'BH', sectors: ['banking', 'fintech'], gdpComponents: ['investment', 'consumption'] },
  { id: 'bh-cbb', label: 'CBB', labelAr: 'مصرف البحرين المركزي', country: 'BH', sectors: ['banking', 'insurance', 'fintech'], gdpComponents: ['investment'] },
  // Oman
  { id: 'om-energy', label: 'Ministry of Energy (OM)', labelAr: 'وزارة الطاقة والمعادن', country: 'OM', sectors: ['oil-gas'], gdpComponents: ['net-exports', 'government-spending'] },
  { id: 'om-transport', label: 'Ministry of Transport (OM)', labelAr: 'وزارة النقل', country: 'OM', sectors: ['supply-chain', 'aviation'], gdpComponents: ['net-exports', 'investment'] },
];

// ---------------------------------------------------------------------------
// Build Economic Graph
// ---------------------------------------------------------------------------

export function buildEconomicGraph(): EconomicGraph {
  const nodes: EconNode[] = [];
  const edges: EconEdge[] = [];

  // GDP component nodes
  const gdpComponents: GDPComponent[] = ['consumption', 'investment', 'government-spending', 'net-exports'];
  const gdpLabels: Record<GDPComponent, { en: string; ar: string }> = {
    'consumption': { en: 'Consumption (C)', ar: 'الاستهلاك' },
    'investment': { en: 'Investment (I)', ar: 'الاستثمار' },
    'government-spending': { en: 'Government Spending (G)', ar: 'الإنفاق الحكومي' },
    'net-exports': { en: 'Net Exports (NX)', ar: 'صافي الصادرات' },
  };

  for (const comp of gdpComponents) {
    nodes.push({
      id: `gdp-${comp}`,
      type: 'gdp-component',
      label: gdpLabels[comp].en,
      labelAr: gdpLabels[comp].ar,
      metadata: {},
    });
  }

  // Sector nodes
  for (const [sectorId, sector] of SECTOR_REGISTRY) {
    nodes.push({
      id: `sector-${sectorId}`,
      type: 'sector',
      label: sector.label,
      labelAr: sector.labelAr,
      metadata: { tier: sector.tier, economicRole: sector.economicRole },
    });

    // Sector → GDP component edges
    for (const comp of sector.gdpComponents) {
      edges.push({
        from: `sector-${sectorId}`,
        to: `gdp-${comp}`,
        type: 'drives',
        weight: sector.tier === 1 ? 0.9 : sector.tier === 2 ? 0.6 : 0.3,
        label: `${sector.label} drives ${gdpLabels[comp].en}`,
      });
    }

    // Sector → Sector dependency edges
    for (const dep of sector.dependencies) {
      edges.push({
        from: `sector-${sectorId}`,
        to: `sector-${dep}`,
        type: 'depends_on',
        weight: 0.7,
        label: `${sector.label} depends on ${SECTOR_REGISTRY.get(dep)?.label ?? dep}`,
      });
    }
  }

  // Ministry nodes + edges
  for (const ministry of GCC_MINISTRIES) {
    nodes.push({
      id: `ministry-${ministry.id}`,
      type: 'ministry',
      label: ministry.label,
      labelAr: ministry.labelAr,
      metadata: { country: ministry.country },
    });

    // Sector → Ministry (regulated_by)
    for (const sectorId of ministry.sectors) {
      edges.push({
        from: `sector-${sectorId}`,
        to: `ministry-${ministry.id}`,
        type: 'regulated_by',
        weight: 0.8,
        label: `${SECTOR_REGISTRY.get(sectorId)?.label ?? sectorId} regulated by ${ministry.label}`,
      });
    }

    // Ministry → GDP component
    for (const comp of ministry.gdpComponents) {
      edges.push({
        from: `ministry-${ministry.id}`,
        to: `gdp-${comp}`,
        type: 'affects',
        weight: 0.7,
        label: `${ministry.label} affects ${gdpLabels[comp].en}`,
      });
    }
  }

  // Country nodes
  const countries = [
    { id: 'SA', label: 'Saudi Arabia', labelAr: 'المملكة العربية السعودية' },
    { id: 'AE', label: 'United Arab Emirates', labelAr: 'الإمارات العربية المتحدة' },
    { id: 'KW', label: 'Kuwait', labelAr: 'الكويت' },
    { id: 'QA', label: 'Qatar', labelAr: 'قطر' },
    { id: 'BH', label: 'Bahrain', labelAr: 'البحرين' },
    { id: 'OM', label: 'Oman', labelAr: 'عُمان' },
  ];

  for (const country of countries) {
    nodes.push({
      id: `country-${country.id}`,
      type: 'country',
      label: country.label,
      labelAr: country.labelAr,
      metadata: {},
    });

    // Country → Ministry edges
    for (const ministry of GCC_MINISTRIES.filter((m) => m.country === country.id)) {
      edges.push({
        from: `country-${country.id}`,
        to: `ministry-${ministry.id}`,
        type: 'affects',
        weight: 0.9,
        label: `${country.label} governs ${ministry.label}`,
      });
    }
  }

  return { nodes, edges };
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

export function getMinistryImpact(sectorId: SectorId): Ministry[] {
  return GCC_MINISTRIES.filter((m) => m.sectors.includes(sectorId));
}

export function getSectorsByMinistry(ministryId: string): SectorId[] {
  const ministry = GCC_MINISTRIES.find((m) => m.id === ministryId);
  return ministry?.sectors ?? [];
}

export function getGDPPathFromSector(sectorId: SectorId): Array<{ sector: string; ministry: string; gdp: string }> {
  const paths: Array<{ sector: string; ministry: string; gdp: string }> = [];
  const sector = SECTOR_REGISTRY.get(sectorId);
  if (!sector) return paths;

  const ministries = getMinistryImpact(sectorId);
  for (const ministry of ministries) {
    for (const comp of ministry.gdpComponents) {
      if (sector.gdpComponents.includes(comp)) {
        paths.push({
          sector: sector.label,
          ministry: ministry.label,
          gdp: comp,
        });
      }
    }
  }
  return paths;
}
