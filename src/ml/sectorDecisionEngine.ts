/**
 * DEEVO Sector Decision Engine
 * Layer: Agents
 * Per-sector decision playbooks with concrete actions based on risk level.
 * Answers: "What should we do about this in each affected sector?"
 */

import type { SectorId } from './sectorOntology';
import { SECTOR_REGISTRY } from './sectorOntology';
import type { ClusterSectorAnalysis, SectorImpactScore } from './sectorImpactEngine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ActionPriority = 'immediate' | 'urgent' | 'monitor' | 'routine';
export type ActionCategory = 'risk-mitigation' | 'operational' | 'strategic' | 'compliance' | 'communication';

export interface SectorAction {
  id: string;
  sectorId: SectorId;
  priority: ActionPriority;
  category: ActionCategory;
  action: string;
  rationale: string;
  owner: string; // Role, not person
  deadline: string; // Relative: "within 4 hours", "within 24 hours"
}

export interface SectorDecisionPackage {
  sectorId: SectorId;
  label: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MODERATE' | 'LOW';
  actions: SectorAction[];
  escalationRequired: boolean;
  escalationReason: string;
}

// ---------------------------------------------------------------------------
// Playbook: Per-sector action templates keyed by risk level
// ---------------------------------------------------------------------------

interface PlaybookEntry {
  threshold: number; // minimum totalImpact to trigger
  priority: ActionPriority;
  category: ActionCategory;
  action: string;
  rationale: string;
  owner: string;
  deadline: string;
}

const PLAYBOOKS: Partial<Record<SectorId, PlaybookEntry[]>> = {
  'oil-gas': [
    { threshold: 0.7, priority: 'immediate', category: 'risk-mitigation', action: 'Activate energy price hedging protocols', rationale: 'Critical oil price or supply risk detected', owner: 'Chief Risk Officer', deadline: 'within 4 hours' },
    { threshold: 0.5, priority: 'urgent', category: 'strategic', action: 'Convene OPEC+ scenario planning session', rationale: 'Elevated supply/demand imbalance signals', owner: 'Head of Strategy', deadline: 'within 24 hours' },
    { threshold: 0.3, priority: 'monitor', category: 'operational', action: 'Increase monitoring of Hormuz transit data', rationale: 'Shipping corridor risk indicators rising', owner: 'Operations Center', deadline: 'within 48 hours' },
    { threshold: 0.1, priority: 'routine', category: 'compliance', action: 'Log signal for quarterly risk review', rationale: 'Low-level activity in energy sector', owner: 'Risk Analyst', deadline: 'next review cycle' },
  ],
  'insurance': [
    { threshold: 0.7, priority: 'immediate', category: 'risk-mitigation', action: 'Freeze new underwriting in affected lines', rationale: 'Critical exposure accumulation detected', owner: 'Chief Underwriting Officer', deadline: 'within 2 hours' },
    { threshold: 0.5, priority: 'urgent', category: 'operational', action: 'Activate claims surge response protocol', rationale: 'High probability of claims influx', owner: 'Claims Director', deadline: 'within 12 hours' },
    { threshold: 0.3, priority: 'monitor', category: 'strategic', action: 'Review portfolio concentration limits', rationale: 'Sector-specific risk building', owner: 'Portfolio Manager', deadline: 'within 48 hours' },
  ],
  'reinsurance': [
    { threshold: 0.7, priority: 'immediate', category: 'risk-mitigation', action: 'Review treaty aggregate exposure and PML', rationale: 'Catastrophe or systemic risk accumulation', owner: 'Chief Actuary', deadline: 'within 4 hours' },
    { threshold: 0.5, priority: 'urgent', category: 'strategic', action: 'Engage retrocession panel for capacity check', rationale: 'Capital adequacy under pressure', owner: 'Head of Reinsurance', deadline: 'within 24 hours' },
    { threshold: 0.3, priority: 'monitor', category: 'operational', action: 'Update loss scenario models', rationale: 'Risk landscape shifting', owner: 'Actuarial Team', deadline: 'within 48 hours' },
  ],
  'banking': [
    { threshold: 0.7, priority: 'immediate', category: 'risk-mitigation', action: 'Activate liquidity contingency plan', rationale: 'Systemic liquidity or credit risk detected', owner: 'Treasurer', deadline: 'within 2 hours' },
    { threshold: 0.5, priority: 'urgent', category: 'operational', action: 'Review credit exposure to affected sectors', rationale: 'Sector-linked NPL risk rising', owner: 'Chief Credit Officer', deadline: 'within 12 hours' },
    { threshold: 0.3, priority: 'monitor', category: 'compliance', action: 'Prepare regulatory stress-test update', rationale: 'SAMA/CBUAE may request data', owner: 'Compliance Officer', deadline: 'within 72 hours' },
  ],
  'supply-chain': [
    { threshold: 0.7, priority: 'immediate', category: 'operational', action: 'Activate alternative routing protocols', rationale: 'Major trade corridor disruption', owner: 'Head of Logistics', deadline: 'within 4 hours' },
    { threshold: 0.5, priority: 'urgent', category: 'risk-mitigation', action: 'Review marine cargo insurance coverage', rationale: 'Shipping risk premium likely to spike', owner: 'Risk Manager', deadline: 'within 24 hours' },
    { threshold: 0.3, priority: 'monitor', category: 'strategic', action: 'Assess inventory buffer adequacy', rationale: 'Supply chain delay risk building', owner: 'Supply Chain Director', deadline: 'within 48 hours' },
  ],
  'aviation': [
    { threshold: 0.7, priority: 'immediate', category: 'operational', action: 'Review flight routing and fuel hedging', rationale: 'Critical fuel or airspace disruption', owner: 'COO', deadline: 'within 4 hours' },
    { threshold: 0.4, priority: 'urgent', category: 'strategic', action: 'Assess demand impact and adjust capacity', rationale: 'Passenger or cargo demand shift', owner: 'Revenue Management', deadline: 'within 24 hours' },
  ],
  'infrastructure': [
    { threshold: 0.6, priority: 'urgent', category: 'operational', action: 'Review mega-project timeline exposure', rationale: 'Material cost or labor supply risk', owner: 'Project Director', deadline: 'within 24 hours' },
    { threshold: 0.3, priority: 'monitor', category: 'strategic', action: 'Update project risk register', rationale: 'External risk factors changing', owner: 'PMO', deadline: 'within 72 hours' },
  ],
};

// ---------------------------------------------------------------------------
// Main: Generate decision packages for all impacted sectors
// ---------------------------------------------------------------------------

function classifyRisk(impact: number): SectorDecisionPackage['riskLevel'] {
  if (impact > 0.7) return 'CRITICAL';
  if (impact > 0.5) return 'HIGH';
  if (impact > 0.3) return 'ELEVATED';
  if (impact > 0.15) return 'MODERATE';
  return 'LOW';
}

export function generateSectorDecisions(
  analysis: ClusterSectorAnalysis
): SectorDecisionPackage[] {
  const packages: SectorDecisionPackage[] = [];

  for (const impact of analysis.impacts) {
    if (impact.totalImpact < 0.05) continue;

    const playbook = PLAYBOOKS[impact.sectorId] ?? [];
    const triggeredActions: SectorAction[] = [];
    let actionIdx = 0;

    for (const entry of playbook) {
      if (impact.totalImpact >= entry.threshold) {
        triggeredActions.push({
          id: `action-${impact.sectorId}-${actionIdx++}`,
          sectorId: impact.sectorId,
          priority: entry.priority,
          category: entry.category,
          action: entry.action,
          rationale: entry.rationale,
          owner: entry.owner,
          deadline: entry.deadline,
        });
      }
    }

    // If no playbook entries, generate generic action
    if (triggeredActions.length === 0 && impact.totalImpact > 0.1) {
      triggeredActions.push({
        id: `action-${impact.sectorId}-generic`,
        sectorId: impact.sectorId,
        priority: impact.totalImpact > 0.5 ? 'urgent' : 'monitor',
        category: 'operational',
        action: `Monitor ${impact.label} sector for escalation`,
        rationale: `Propagated exposure detected (${Math.round(impact.propagatedImpact * 100)}%)`,
        owner: 'Sector Analyst',
        deadline: 'within 48 hours',
      });
    }

    const riskLevel = classifyRisk(impact.totalImpact);
    const escalationRequired = riskLevel === 'CRITICAL' || riskLevel === 'HIGH';

    packages.push({
      sectorId: impact.sectorId,
      label: impact.label,
      riskLevel,
      actions: triggeredActions.sort((a, b) => {
        const pri = { immediate: 0, urgent: 1, monitor: 2, routine: 3 };
        return pri[a.priority] - pri[b.priority];
      }),
      escalationRequired,
      escalationReason: escalationRequired
        ? `${impact.label} at ${riskLevel} risk — ${impact.triggeredDrivers.join(', ') || 'propagated exposure'}`
        : '',
    });
  }

  return packages;
}
