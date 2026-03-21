/**
 * DRIBadge — Deevo Risk Index indicator.
 * 5-level severity badge with pulsing animation at higher levels.
 */
import { clsx } from "clsx";
import type { DRILevel } from "@/types";
import { DRI_LEVELS } from "@/types";

interface DRIBadgeProps {
  level: DRILevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function DRIBadge({ level, size = "md", showLabel = true }: DRIBadgeProps) {
  const dri = DRI_LEVELS[level];

  return (
    <div
      className={clsx(
        "dri-badge",
        size === "sm" && "text-[10px] px-2 py-0.5",
        size === "md" && "text-xs px-3 py-1",
        size === "lg" && "text-sm px-4 py-1.5",
        dri.pulseRate === "fast" && "animate-pulse",
        dri.pulseRate === "critical" && "animate-pulse",
        dri.pulseRate === "medium" && "animate-pulse-slow",
      )}
      style={{
        backgroundColor: `${dri.color}22`,
        color: dri.color,
        borderColor: `${dri.color}44`,
        borderWidth: 1,
        borderStyle: "solid",
      }}
      title={dri.description}
    >
      <span
        className={clsx(
          "inline-block w-2 h-2 rounded-full",
          dri.pulseRate !== "none" && "animate-pulse",
        )}
        style={{ backgroundColor: dri.color }}
      />
      {showLabel && (
        <>
          <span className="font-mono">DRI-{level}</span>
          <span className="hidden sm:inline font-normal opacity-75">
            {dri.label}
          </span>
        </>
      )}
    </div>
  );
}
