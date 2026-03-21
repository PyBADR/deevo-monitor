/**
 * StatusBar — Top navigation bar (worldmonitor-style).
 * Left: [DEEVO LOGO] [MONITOR] [v2.0.0] [● LIVE]
 * Center: [Date/Time UTC] [Region selector]
 * Right: [DRI Badge] [Settings]
 */
import { useState, useEffect } from "react";
import { useDataStore } from "@/stores/dataStore";
import { useMapStore } from "@/stores/mapStore";
import { DRIBadge } from "@/components/shared/DRIBadge";
import { LiveDot } from "@/components/shared/LiveDot";
import { GCC_COUNTRIES, type GCCCountryCode } from "@/types";
import { clsx } from "clsx";

export function StatusBar() {
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
    <header className="h-10 flex items-center justify-between px-3 bg-[#0A0E1A] border-b border-[#1F2937] z-30 shrink-0 font-mono">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <span className="text-[#00D4FF] font-bold text-sm tracking-tight">
          DEEVO
        </span>
        <span className="text-gray-400 text-xs">MONITOR</span>
        <span className="text-gray-600 text-[10px]">v2.0.0</span>
        <div className="w-px h-4 bg-[#1F2937]" />
        <LiveDot status="live" size="sm" label="LIVE" />
      </div>

      {/* Center section */}
      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-[11px]">
          {time.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="text-[#00D4FF] text-xs font-bold">
          {time.toLocaleTimeString("en-US", { hour12: false, timeZone: "UTC" })}
          <span className="text-gray-600 text-[9px] ml-1">UTC</span>
        </span>
        <div className="w-px h-4 bg-[#1F2937]" />
        {/* Region selector */}
        <div className="flex gap-1">
          <RegionButton
            code="GLOBAL"
            label="Global"
            active={!focusedCountry}
            onClick={() => handleRegion("GLOBAL")}
          />
          {(Object.keys(GCC_COUNTRIES) as GCCCountryCode[]).map((code) => (
            <RegionButton
              key={code}
              code={code}
              label={code}
              active={focusedCountry === code}
              onClick={() => handleRegion(code)}
            />
          ))}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <DRIBadge level={driLevel} size="sm" />
      </div>
    </header>
  );
}

function RegionButton({
  code: _code,
  label,
  active,
  onClick,
}: {
  code: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "text-[9px] px-1.5 py-0.5 rounded transition-colors",
        active
          ? "bg-[#00D4FF]/20 text-[#00D4FF]"
          : "text-gray-600 hover:text-gray-400"
      )}
    >
      {label}
    </button>
  );
}
