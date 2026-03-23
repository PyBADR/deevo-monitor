/**
 * DEEVO Intelligence Monitor v3 — Decision Engine Panel
 * Contract 5 / Panel 4 of 7
 * Layer: UI (L6) + Governance (L7)
 *
 * Displays active decisions with explainable reasoning chains.
 * Human-in-the-loop approval for CRITICAL decisions.
 * Shows reasoning steps as a vertical chain with layer badges.
 */

import { useState } from 'react';
import type { DecisionAlert, ReasoningStep } from '../../types/decisions';

// ── Demo Decisions ───────────────────────────────────────
const DEMO_DECISIONS: DecisionAlert[] = [
  {
    id: 'dec_001',
    createdAt: new Date(Date.now() - 300_000).toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'human_review',
    title: 'Hormuz Strait Marine Risk Escalation',
    description: 'Multiple marine and energy signals detected near Strait of Hormuz. Recommending immediate review of active cargo policies.',
    variant: 'global',
    triggerSignals: ['sig_001', 'sig_002', 'sig_003'],
    correlationRule: 'HORMUZ_MARINE_ALERT',
    reasoning: [
      { step: 1, layer: 'data', explanation: 'Ingested 3 signals from 2 marine tracking sources.', evidence: ['AIS disruption detected', 'Oil tanker rerouting'], confidence: 0.92, durationMs: 45 },
      { step: 2, layer: 'features', explanation: 'Extracted maritime risk features: vessel density drop, route deviation.', evidence: ['Vessel density -40%', 'Route deviation +12nm'], confidence: 0.87, durationMs: 120 },
      { step: 3, layer: 'models', explanation: 'HORMUZ_MARINE_ALERT correlation rule matched with 0.85 confidence.', evidence: ['Rule: HORMUZ_MARINE_ALERT', '2/3 trigger categories matched'], confidence: 0.85, durationMs: 8 },
      { step: 4, layer: 'agents', explanation: 'Recommending policy review for 23 active Hormuz-corridor cargo policies.', evidence: ['23 policies exposed', 'Est. exposure: $45M'], confidence: 0.82, durationMs: 2100 },
      { step: 5, layer: 'governance', explanation: 'CRITICAL alert — requires human approval before action. PDPL Art. 22 audit trail generated.', evidence: ['Human-in-the-loop required', 'SHA-256 audit entry created'], confidence: 0.95, durationMs: 3 },
    ],
    impact: { countries: ['AE', 'OM'], lines: ['Marine Cargo', 'Energy'], estimatedImpactUSD: 45_000_000, policiesAffected: 23, regulatoryFlags: ['CBUAE Notice 2024/12'] },
    action: { type: 'POLICY_REVIEW', label: 'Review Hormuz Cargo Policies', irreversible: false, params: {} },
    alertLevel: 'CRITICAL',
    countries: ['AE', 'OM'],
    requiresHumanApproval: true,
    ttlSeconds: 3600,
    confidence: 0.82,
  },
  {
    id: 'dec_002',
    createdAt: new Date(Date.now() - 600_000).toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'executed',
    title: 'Fraud Detection Sensitivity Increase',
    description: 'Layoff signals in UAE tech sector correlate with historical fraud spikes.',
    variant: 'fraud',
    triggerSignals: ['sig_004', 'sig_005'],
    correlationRule: 'LAYOFFS_FRAUD_PREDICTOR',
    reasoning: [
      { step: 1, layer: 'data', explanation: 'Ingested 2 labor market signals.', evidence: ['UAE tech layoffs +3000'], confidence: 0.88, durationMs: 30 },
      { step: 2, layer: 'models', explanation: 'LAYOFFS_FRAUD_PREDICTOR matched.', evidence: ['Historical correlation: r=0.73'], confidence: 0.62, durationMs: 5 },
      { step: 3, layer: 'agents', explanation: 'Auto-approved: ELEVATED level, no human gate required.', evidence: ['Below CRITICAL threshold'], confidence: 0.62, durationMs: 1 },
    ],
    impact: { countries: ['AE'], lines: ['Motor', 'Medical'], estimatedImpactUSD: 8_000_000, policiesAffected: 450, regulatoryFlags: [] },
    action: { type: 'SENSITIVITY_INCREASE', label: 'Increase Fraud Detection Sensitivity', irreversible: false, params: { factor: 1.3 } },
    alertLevel: 'ELEVATED',
    countries: ['AE'],
    requiresHumanApproval: false,
    ttlSeconds: 86400,
    confidence: 0.62,
  },
];

const LAYER_COLORS: Record<string, string> = {
  data: '#3b82f6', features: '#8b5cf6', models: '#f5a623',
  agents: '#22c55e', governance: '#ef4444',
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#78716c', reasoning: '#8b5cf6', human_review: '#f5a623',
  approved: '#22c55e', rejected: '#ef4444', executed: '#06b6d4', expired: '#78716c',
};

interface DecisionEnginePanelProps {
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function DecisionEnginePanel({ onApprove, onReject }: DecisionEnginePanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(DEMO_DECISIONS[0]?.id ?? null);

  const renderReasoningStep = (step: ReasoningStep) => (
    <div key={step.step} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
        <span style={{
          background: LAYER_COLORS[step.layer] ?? '#555',
          color: 'white', fontSize: 8, padding: '2px 6px',
          borderRadius: 4, fontFamily: 'IBM Plex Mono, monospace',
          textTransform: 'uppercase',
        }}>
          {step.layer}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, marginTop: 2 }}>
          {step.durationMs}ms
        </span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginBottom: 4 }}>
          {step.explanation}
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {step.evidence.map((e, i) => (
            <span key={i} style={{
              background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
              fontSize: 9, padding: '1px 6px', borderRadius: 3,
              fontFamily: 'IBM Plex Mono, monospace',
            }}>
              {e}
            </span>
          ))}
        </div>
        {/* Confidence bar */}
        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
            <div style={{ width: `${step.confidence * 100}%`, height: '100%', background: LAYER_COLORS[step.layer] ?? '#555', borderRadius: 2 }} />
          </div>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'IBM Plex Mono' }}>
            {(step.confidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      background: '#0a0f1a', borderRadius: 12,
      border: '1px solid rgba(245,166,35,0.2)',
      padding: 16, height: '100%', display: 'flex', flexDirection: 'column',
      overflow: 'auto',
    }}>
      <h3 style={{ color: '#f5a623', fontFamily: 'IBM Plex Mono, monospace', fontSize: 14, margin: '0 0 12px' }}>
        DECISION ENGINE
      </h3>

      {DEMO_DECISIONS.map((decision) => {
        const isExpanded = expandedId === decision.id;
        return (
          <div key={decision.id} style={{
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${decision.status === 'human_review' ? 'rgba(245,166,35,0.4)' : 'rgba(255,255,255,0.05)'}`,
            borderRadius: 8, marginBottom: 10, overflow: 'hidden',
          }}>
            {/* Decision Header */}
            <div
              onClick={() => setExpandedId(isExpanded ? null : decision.id)}
              style={{ padding: '10px 12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <div style={{ color: 'white', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{decision.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                  {decision.correlationRule} · {decision.confidence.toFixed(0)}% confidence
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{
                  background: STATUS_COLORS[decision.status] ?? '#555',
                  color: 'white', fontSize: 9, padding: '2px 8px', borderRadius: 4,
                  fontFamily: 'IBM Plex Mono, monospace', textTransform: 'uppercase',
                }}>
                  {decision.status.replace('_', ' ')}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>{isExpanded ? '▲' : '▼'}</span>
              </div>
            </div>

            {/* Expanded: Reasoning Chain + Actions */}
            {isExpanded && (
              <div style={{ padding: '0 12px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: '10px 0 8px' }}>
                  REASONING CHAIN ({decision.reasoning.length} steps)
                </div>
                {decision.reasoning.map(renderReasoningStep)}

                {/* Impact summary */}
                <div style={{
                  background: 'rgba(245,166,35,0.05)', borderRadius: 6, padding: 10, marginTop: 8,
                  border: '1px solid rgba(245,166,35,0.1)',
                }}>
                  <div style={{ color: '#f5a623', fontSize: 10, fontFamily: 'IBM Plex Mono', marginBottom: 6 }}>IMPACT</div>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span style={{ color: 'white', fontSize: 12, fontFamily: 'IBM Plex Mono' }}>
                      ${(decision.impact.estimatedImpactUSD / 1_000_000).toFixed(0)}M
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                      {decision.impact.policiesAffected} policies
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                      {decision.impact.countries.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Approval buttons for human_review */}
                {decision.status === 'human_review' && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button
                      onClick={() => onApprove?.(decision.id)}
                      style={{
                        flex: 1, padding: '8px 16px', borderRadius: 6,
                        background: '#22c55e', color: 'white', border: 'none',
                        fontFamily: 'IBM Plex Mono, monospace', fontSize: 12,
                        cursor: 'pointer', fontWeight: 600,
                      }}
                    >
                      ✓ APPROVE
                    </button>
                    <button
                      onClick={() => onReject?.(decision.id)}
                      style={{
                        flex: 1, padding: '8px 16px', borderRadius: 6,
                        background: 'transparent', color: '#ef4444',
                        border: '1px solid #ef4444',
                        fontFamily: 'IBM Plex Mono, monospace', fontSize: 12,
                        cursor: 'pointer', fontWeight: 600,
                      }}
                    >
                      ✕ REJECT
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
