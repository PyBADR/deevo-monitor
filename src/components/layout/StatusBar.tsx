/**
 * StatusBar — Top navigation bar (worldmonitor-style).
 * Left: [VariantSwitcher] [● LIVE] [v3.0.0]
 * Center: [Date/Time UTC] [Region selector]
 * Right: [DRI Badge] [KPI toggle] [Settings]
 */
import { useState, useEffect } from "react";
import { useDataStore } from "@/stores/dataStore";
import { useMapStore } from "@/stores/mapStore";
import { DRIBadge } from "@/components/shared/DRIBadge";
import { LiveDot } from "@/components/shared/LiveDot";
import { VariantSwitcher } from "@/components/ui/VariantSwitcher";
import { useVariant } from "@/variants";
import { GCC_COUNTRIES, type GCCCountryCode } from "@/types";
import { clsx } from "clsx";

export function StatusBar() {
  const { variant } = useVariant();
  const driLevel = useDataStore((s) => s.driLevel);
  const flyToCountry = useMapStore((s) => s.flyToCountry);
  const resetView = useMapStore((s) => s.resetView);
  const focusedCountry = useMapStore((s) => s.focusedCountry);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRegion = (code: string) => {
    if (code === "GLOBAL") {
      resetView();
    } else {
      flyToCountry(code as GCCCountryCode);
    }
  };

  return (
    <header
      className="h-10 flex items-center justify-between px-3 border-b z-30 shrink-0 font-mono"
      style={{
        backgroundColor: variant.colors.bg,
        borderColor: variant.colors.border,
      }}
    >
      {/* Left section */}
      <div className="flex items-center gap-2">
        <VariantSwitcher />
        <div className="w-px h-4" style={{ backgroundColor: variant.colors.border }} />
        <LiveDot status="live" size="sm" label="LIVE" />
        <span style={{ color: variant.colors.textMuted }} className="text-[10px]">
          v3.0.0
        </span>
      </div>

      {/* Center section */}
      <div className="flex items-center gap-4">
        <span style={{ color: variant.colors.textSecondary }} className="text-[11px]">
          {time.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="text-xs font-bold" style={{ color: variant.colors.primary }}>
          {time.toLocaleTimeString("en-US", { hour12: false, timeZone: "UTC" })}
          <span style={{ color: variant.colors.textMuted }} className="text-[9px] ml-1">
            UTC
          </span>
        </span>
        <div className="w-px h-4" style={{ backgroundColor: variant.colors.border }} />
        {/* Region selector */}
        <div className="flex gap-1">
          <RegionButton
            code="GLOBAL"
            label="Global"
            active={!focusedCountry}
            onClick={() => handleRegion("GLOBAL")}
            primaryColor={variant.colors.primary}
          />
          {(Object.keys(GCC_COUNTRIES) as GCCCountryCode[]).map((code) => (
            <RegionButton
              key={code}
              code={code}
              label={code}
              active={focusedCountry === code}
              onClick={() => handleRegion(code)}
              primaryColor={variant.colors.primary}
            />
          ))}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <VariantBadge />
        {variant.showPanels.riskIndex && <DRIBadge level={driLevel} size="sm" />}
      </div>
    </header>
  );
}

function VariantBadge() {
  const { variantId, variant } = useVariant();
  const labels: Record<string, string> = {
    global: 'G', tech: 'T', finance: 'F', fraud: 'FR',
  };
  return (
    <span
      className="text-[9px] font-bold px-1.5 py-0.5 rounded"
      style={{
        backgroundColor: `${variant.colors.primary}20`,
        color: variant.colors.primary,
      }}
    >
      {labels[variantId]}
    </span>
  );
}

function RegionButton({
  code: _code,
  label,
  active,
  onClick,
  primaryColor,
}: {
  code: string;
  label: string;
  active: boolean;
  onClick: () => void;
  primaryColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "text-[9px] px-1.5 py-0.5 rounded transition-colors",
        active ? "text-white" : "text-gray-600 hover:text-gray-400"
      )}
      style={active ? { backgroundColor: `${primaryColor}20`, color: primaryColor } : undefined}
    >
      {label}
    </button>
  );
}
