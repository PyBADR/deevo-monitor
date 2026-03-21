/**
 * LiveDot — Animated pulsing indicator for live status.
 * Color variants: green=live, red=error, yellow=degraded.
 */
import { clsx } from "clsx";

interface LiveDotProps {
  status?: "live" | "degraded" | "error";
  size?: "sm" | "md" | "lg";
  label?: string;
}

const STATUS_COLORS = {
  live: { dot: "bg-green-500", ring: "bg-green-400/30", text: "text-green-400" },
  degraded: { dot: "bg-yellow-500", ring: "bg-yellow-400/30", text: "text-yellow-400" },
  error: { dot: "bg-red-500", ring: "bg-red-400/30", text: "text-red-400" },
};

const SIZE_MAP = {
  sm: { dot: "w-1.5 h-1.5", ring: "w-3 h-3", text: "text-[9px]" },
  md: { dot: "w-2 h-2", ring: "w-4 h-4", text: "text-[10px]" },
  lg: { dot: "w-2.5 h-2.5", ring: "w-5 h-5", text: "text-xs" },
};

export function LiveDot({ status = "live", size = "md", label }: LiveDotProps) {
  const colors = STATUS_COLORS[status];
  const sizes = SIZE_MAP[size];

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative inline-flex">
        {/* Pulsing ring */}
        <span
          className={clsx(
            "absolute inset-0 rounded-full animate-ping opacity-75",
            colors.ring,
            sizes.ring
          )}
        />
        {/* Solid dot */}
        <span
          className={clsx("relative rounded-full", colors.dot, sizes.dot)}
        />
      </span>
      {label && (
        <span className={clsx("font-mono uppercase tracking-wider", colors.text, sizes.text)}>
          {label}
        </span>
      )}
    </span>
  );
}
