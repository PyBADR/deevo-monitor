/**
 * GlobalSituation — Secondary status bar showing date/time UTC (worldmonitor parity).
 * Displays: "GLOBAL SITUATION" label + full date/time in UTC.
 *
 * Architecture Layer: UI (L6)
 */
import { useState, useEffect } from 'react';
import { useVariant } from '@/variants';

export function GlobalSituation() {
  const { variant } = useVariant();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = time.toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).toUpperCase();

  const clock = time.toLocaleTimeString('en-US', {
    hour12: false,
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div
      className="h-6 flex items-center justify-between px-4 shrink-0 font-mono border-b"
      style={{
        backgroundColor: variant.colors.bg,
        borderColor: variant.colors.border,
      }}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: variant.colors.textMuted }}>
        Global Situation
      </span>
      <span className="text-[10px]" style={{ color: variant.colors.textSecondary }}>
        {formatted}{' '}
        <span style={{ color: variant.colors.primary }} className="font-bold">
          {clock}
        </span>
        <span className="ml-1 text-[8px]" style={{ color: variant.colors.textMuted }}>
          UTC
        </span>
      </span>
    </div>
  );
}
