/**
 * DEEVO Intelligence Monitor v3 — Correlation Rules Registry
 * Contract 3 / File 3 of 4
 * Layer: Models (L3) — 6 named correlation rules that fire when
 *        signal combinations match predefined patterns.
 *
 * Each rule specifies:
 *   - Trigger conditions (signal categories + thresholds)
 *   - Output alert level
 *   - Recommended action
 *   - Which DEEVO variants it applies to
 *
 * Trade-off: Declarative rules vs ML-learned correlations.
 *            Declarative chosen for auditability (PDPL Art. 22)
 *            and human-in-the-loop transparency. ML layer can
 *            be added in L3 to suggest new rules.
 */

import type { SignalCategory, AlertLevel, DeevoVariant } from '../types/signals';

// ── Rule Definition ──────────────────────────────────────
export interface CorrelationRule {
  /** Unique rule ID — SCREAMING_SNAKE_CASE */
  readonly id: string;
  /** Human-readable name */
  name: string;
  /** Arabic name */
  nameAr: string;
  /** Description of what this rule detects */
  description: string;
  /** Signal categories that must co-occur to trigger */
  triggerCategories: SignalCategory[];
  /** Minimum number of matching signals required */
  minSignals: number;
  /** Time window in seconds for signal co-occurrence */
  windowSeconds: number;
  /** Minimum confidence threshold (0.0–1.0) */
  confidenceThreshold: number;
  /** Alert level when rule fires */
  outputAlertLevel: AlertLevel;
  /** Which variants this rule applies to */
  variants: DeevoVariant[];
  /** Recommended action text */
  recommendedAction: string;
  /** Whether this rule requires human approval before action */
  requiresHumanApproval: boolean;
  /** Rule priority (lower = higher priority) */
  priority: number;
  /** Whether this rule is currently active */
  active: boolean;
}

// ── 6 Correlation Rules ──────────────────────────────────
export const CORRELATION_RULES: readonly CorrelationRule[] = [
  {
    id: 'HORMUZ_MARINE_ALERT',
    name: 'Strait of Hormuz Marine Alert',
    nameAr: 'تنبيه مضيق هرمز البحري',
    description: 'Detects co-occurrence of marine disruption signals near Hormuz with energy price spikes and military movement, indicating potential shipping insurance exposure.',
    triggerCategories: ['marine', 'energy', 'military'],
    minSignals: 2,
    windowSeconds: 3600,
    confidenceThreshold: 0.7,
    outputAlertLevel: 'CRITICAL',
    variants: ['global', 'finance'],
    recommendedAction: 'Escalate to marine underwriting team. Review all active Hormuz-corridor cargo policies. Consider rate adjustment.',
    requiresHumanApproval: true,
    priority: 1,
    active: true,
  },
  {
    id: 'IRAN_ENERGY_PROPERTY',
    name: 'Iran Energy-Property Cascade',
    nameAr: 'تصاعد الطاقة والعقارات الإيراني',
    description: 'Correlates Iranian energy sector disruptions with property damage signals in GCC border regions, indicating potential cross-border insurance claims.',
    triggerCategories: ['energy', 'geopolitical', 'claims'],
    minSignals: 2,
    windowSeconds: 7200,
    confidenceThreshold: 0.65,
    outputAlertLevel: 'CRITICAL',
    variants: ['global', 'finance'],
    recommendedAction: 'Activate property reinsurance review. Flag all Eastern Province / Fujairah policies for exposure assessment.',
    requiresHumanApproval: true,
    priority: 2,
    active: true,
  },
  {
    id: 'SANCTIONS_CLAIM_BLOCK',
    name: 'Sanctions-Triggered Claim Block',
    nameAr: 'حظر المطالبات بسبب العقوبات',
    description: 'Detects when new sanctions designations affect entities with active insurance policies, triggering automatic claim processing holds.',
    triggerCategories: ['sanctions', 'regulatory', 'claims'],
    minSignals: 2,
    windowSeconds: 1800,
    confidenceThreshold: 0.8,
    outputAlertLevel: 'CRITICAL',
    variants: ['global', 'fraud', 'finance'],
    recommendedAction: 'Immediately freeze claim processing for sanctioned entities. Notify compliance team. File SAR if applicable.',
    requiresHumanApproval: true,
    priority: 1,
    active: true,
  },
  {
    id: 'LAYOFFS_FRAUD_PREDICTOR',
    name: 'Layoffs-Driven Fraud Predictor',
    nameAr: 'مؤشر الاحتيال المرتبط بالتسريح',
    description: 'Correlates mass layoff signals in GCC sectors with historical fraud pattern spikes, predicting increased fraudulent claims within 30-90 days.',
    triggerCategories: ['labor', 'fraud', 'claims'],
    minSignals: 2,
    windowSeconds: 86400,
    confidenceThreshold: 0.55,
    outputAlertLevel: 'ELEVATED',
    variants: ['global', 'fraud'],
    recommendedAction: 'Increase fraud detection sensitivity in affected sectors. Deploy additional SIU resources. Monitor staged accident patterns.',
    requiresHumanApproval: false,
    priority: 3,
    active: true,
  },
  {
    id: 'CLIMATE_CAT_TRIGGER',
    name: 'Climate Catastrophe Trigger',
    nameAr: 'محفز كارثة مناخية',
    description: 'Detects extreme weather events (sandstorms, floods, heat waves) co-occurring with infrastructure stress signals, triggering CAT model activation.',
    triggerCategories: ['climate', 'weather', 'infrastructure'],
    minSignals: 2,
    windowSeconds: 3600,
    confidenceThreshold: 0.6,
    outputAlertLevel: 'ELEVATED',
    variants: ['global', 'finance'],
    recommendedAction: 'Activate CAT response protocol. Pre-position claims adjusters. Notify reinsurance tower. Begin IBNR reserve estimation.',
    requiresHumanApproval: false,
    priority: 2,
    active: true,
  },
  {
    id: 'DEFCON_WAR_CLAUSE',
    name: 'DEFCON War Clause Activation',
    nameAr: 'تفعيل شرط الحرب',
    description: 'Monitors military escalation signals crossing DEFCON-equivalent thresholds, triggering war exclusion clause review across all active policies.',
    triggerCategories: ['military', 'geopolitical', 'sanctions'],
    minSignals: 3,
    windowSeconds: 7200,
    confidenceThreshold: 0.75,
    outputAlertLevel: 'CRITICAL',
    variants: ['global'],
    recommendedAction: 'IMMEDIATE: Review all war exclusion clauses. Activate crisis management team. Notify Lloyd\'s syndicate partners. Prepare policyholder communications.',
    requiresHumanApproval: true,
    priority: 1,
    active: true,
  },
] as const;

// ── Rule Helpers ─────────────────────────────────────────
export const getRuleById = (id: string): CorrelationRule | undefined =>
  CORRELATION_RULES.find((r) => r.id === id);

export const getRulesForVariant = (variant: DeevoVariant): CorrelationRule[] =>
  CORRELATION_RULES.filter((r) => r.variants.includes(variant));

export const getActiveRules = (): CorrelationRule[] =>
  CORRELATION_RULES.filter((r) => r.active);

export const getCriticalRules = (): CorrelationRule[] =>
  CORRELATION_RULES.filter((r) => r.outputAlertLevel === 'CRITICAL');
