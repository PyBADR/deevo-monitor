/**
 * CountryIntelligence — Country Intelligence Index panel.
 * Composite risk scoring across 12 signal categories per country.
 * worldmonitor-style country instability scores.
 */
import { clsx } from 'clsx';
import { useVariant } from '@/variants';
import { GCC_COUNTRIES, type GCCCountryCode } from '@/types';

interface IntelScore {
  country: GCCCountryCode;
  overall: number;
  signals: {
    political: number;
    economic: number;
    military: number;
    cyber: number;
    social: number;
    environmental: number;
    regulatory: number;
    fraud: number;
    infrastructure: number;
    health: number;
    energy: number;
    trade: number;
  };
  trend: 'improving' | 'stable' | 'deteriorating';
}

function generateIntelScores(): IntelScore[] {
  const base: Record<GCCCountryCode, { overall: number; trend: IntelScore['trend'] }> = {
    SA: { overall: 32, trend: 'improving' },
    AE: { overall: 18, trend: 'stable' },
    QA: { overall: 22, trend: 'stable' },
    KW: { overall: 28, trend: 'stable' },
    BH: { overall: 35, trend: 'deteriorating' },
    OM: { overall: 20, trend: 'improving' },
  };

  return (Object.keys(base) as GCCCountryCode[]).map((code) => ({
    country: code,
    overall: base[code].overall,
    trend: base[code].trend,
    signals: {
      political: Math.round(base[code].overall * (0.8 + Math.random() * 0.4)),
      economic: Math.round(base[code].overall * (0.6 + Math.random() * 0.6)),
      military: Math.round(base[code].overall * (0.5 + Math.random() * 0.5)),
      cyber: Math.round(base[code].overall * (0.7 + Math.random() * 0.5)),
      social: Math.round(base[code].overall * (0.4 + Math.random() * 0.4)),
      environmental: Math.round(base[code].overall * (0.3 + Math.random() * 0.5)),
      regulatory: Math.round(base[code].overall * (0.5 + Math.random() * 0.3)),
      fraud: Math.round(base[code].overall * (0.6 + Math.random() * 0.6)),
      infrastructure: Math.round(base[code].overall * (0.3 + Math.random() * 0.3)),
      health: Math.round(base[code].overall * (0.2 + Math.random() * 0.3)),
      energy: Math.round(base[code].overall * (0.4 + Math.random() * 0.4)),
      trade: Math.round(base[code].overall * (0.3 + Math.random() * 0.3)),
    },
  }));
}

const INTEL_SCORES = generateIntelScores();

function getScoreColor(score: number): string {
  if (score >= 70) return '#FF3B30';
  if (score >= 50) return '#FF6B00';
  if (score >= 30) return '#FFD600';
  if (score >= 15) return '#00D4FF';
  return '#34C759';
}

function getScoreLabel(score: number): string {
  if (score >= 70) return 'CRITICAL';
  if (score >= 50) return 'HIGH';
  if (score >= 30) return 'ELEVATED';
  if (score >= 15) return 'MODERATE';
  return 'LOW';
}

export function CountryIntelligence() {
  const { variant } = useVariant();
  // TODO: Wire to live countryRisks from dataStore when API is connected
  // const countryRisks = useDataStore((s) => s.countryRisks);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="px-3 py-1.5 border-b shrink-0"
        style={{ borderColor: variant.colors.border }}
      >
        <span className="text-sm font-bold" style={{ color: variant.colors.text }}>
          COUNTRY INTELLIGENCE INDEX
        </span>
        <div className="text-[9px] font-mono mt-0.5" style={{ color: variant.colors.textMuted }}>
          Composite risk scoring across 12 signal categories
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: '#34C75920', color: '#34C759' }}>LOW 0-14</span>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: '#00D4FF20', color: '#00D4FF' }}>MOD 15-29</span>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: '#FFD60020', color: '#FFD600' }}>ELEV 30-49</span>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: '#FF6B0020', color: '#FF6B00' }}>HIGH 50-69</span>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: '#FF3B3020', color: '#FF3B30' }}>CRIT 70+</span>
          <span className="text-[8px] font-mono ml-auto" style={{ color: variant.colors.textMuted }}>
            GCC AVG: {Math.round(INTEL_SCORES.reduce((s, i) => s + i.overall, 0) / INTEL_SCORES.length)}
          </span>
        </div>
      </div>

      {/* Country cards */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {INTEL_SCORES.map((intel) => {
          const country = GCC_COUNTRIES[intel.country];
          const color = getScoreColor(intel.overall);
          return (
            <div
              key={intel.country}
              className="rounded border p-2"
              style={{ borderColor: `${color}30`, backgroundColor: `${color}05` }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold" style={{ color: variant.colors.text }}>
                    {country.name}
                  </span>
                  <span className="text-[9px]" style={{ color: variant.colors.textMuted }}>
                    {country.nameAr}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      'text-[9px] font-mono',
                      intel.trend === 'improving' && 'text-green-400',
                      intel.trend === 'stable' && 'text-amber-400',
                      intel.trend === 'deteriorating' && 'text-red-400'
                    )}
                  >
                    {intel.trend === 'improving' ? '↓' : intel.trend === 'deteriorating' ? '↑' : '→'}
                  </span>
                  <span
                    className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: `${color}25`, color }}
                  >
                    {intel.overall}
                  </span>
                  <span className="text-[8px] font-mono" style={{ color }}>
                    {getScoreLabel(intel.overall)}
                  </span>
                </div>
              </div>

              {/* Signal bars */}
              <div className="grid grid-cols-6 gap-1">
                {(Object.entries(intel.signals) as [string, number][]).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <div className="h-1 rounded-full bg-gray-700 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(val, 100)}%`,
                          backgroundColor: getScoreColor(val),
                        }}
                      />
                    </div>
                    <div className="text-[7px] font-mono mt-0.5" style={{ color: variant.colors.textMuted }}>
                      {key.slice(0, 4).toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
