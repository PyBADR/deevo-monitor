/**
 * RiskMeter — SVG circular gauge for risk scores (0–100).
 * Color transitions green → yellow → red by value.
 * Animated fill on mount via CSS stroke-dashoffset.
 */
import { useMemo } from "react";

interface RiskMeterProps {
  value: number;
  label: string;
  size?: number;
}

function scoreColor(value: number): string {
  if (value >= 75) return "#FF2D55";
  if (value >= 50) return "#FF6B35";
  if (value >= 30) return "#FFD600";
  return "#34C759";
}

export function RiskMeter({ value, label, size = 64 }: RiskMeterProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const color = useMemo(() => scoreColor(clamped), [clamped]);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1F2937"
          strokeWidth={4}
        />
        {/* Value arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out, stroke 0.5s ease" }}
        />
      </svg>
      {/* Center value */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span
          className="font-mono font-bold text-sm"
          style={{ color }}
        >
          {clamped}
        </span>
      </div>
      <span className="text-[9px] text-gray-500 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
