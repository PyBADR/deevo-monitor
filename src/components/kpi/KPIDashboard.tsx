/**
 * KPIDashboard — Main KPI panel rendered in the bottom tab area.
 * Fetches KPI data for the current variant, renders sections + metrics.
 */
import { useState } from 'react';
import { KPICard } from './KPICard';
import { useVariant } from '@/variants';
import { useKPIData } from '@/hooks/useKPIData';
import { clsx } from 'clsx';
import type { KPISection } from '@/kpi/kpi.types';

export function KPIDashboard() {
  const { variant } = useVariant();
  const { kpiSet, loading, error } = useKPIData();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="text-[11px] font-mono animate-pulse" style={{ color: variant.colors.textMuted }}>
          Loading KPI data...
        </span>
      </div>
    );
  }

  if (error || !kpiSet) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="text-[11px] font-mono" style={{ color: variant.colors.critical }}>
          Failed to load KPIs: {error ?? 'No data'}
        </span>
      </div>
    );
  }

  const sections = kpiSet.sections;
  const currentSection = (activeSection
    ? sections.find((s: KPISection) => s.id === activeSection)
    : undefined) ?? sections[0]!;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Section tabs */}
      <div
        className="flex items-center gap-0.5 px-2 py-1 shrink-0 border-b overflow-x-auto"
        style={{ borderColor: variant.colors.border }}
      >
        {sections.map((section: KPISection) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={clsx(
              'flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono uppercase tracking-wide transition-colors whitespace-nowrap',
              currentSection.id === section.id
                ? 'text-white'
                : 'text-gray-500 hover:text-gray-300'
            )}
            style={
              currentSection.id === section.id
                ? { backgroundColor: `${variant.colors.primary}20`, color: variant.colors.primary }
                : undefined
            }
          >
            <span>{section.icon}</span>
            <span>{section.title}</span>
          </button>
        ))}
        <div className="ml-auto shrink-0 flex items-center gap-2 pr-1">
          <span className="text-[8px] font-mono" style={{ color: variant.colors.textMuted }}>
            {kpiSet.name}
          </span>
        </div>
      </div>

      {/* Metric cards grid */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {currentSection.metrics.map((metric) => (
            <KPICard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    </div>
  );
}
