/**
 * FraudHeatCalendar — GitHub-style heatmap calendar showing daily fraud incident density.
 * Displays last 12 weeks of fraud activity with color intensity by severity.
 */
import { useMemo } from 'react';
import { useVariant } from '@/variants';

interface DayData {
  date: string;       // YYYY-MM-DD
  count: number;
  severity: number;   // 0-4 intensity level
}

function generateCalendarData(): DayData[] {
  const days: DayData[] = [];
  const now = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const count = Math.floor(Math.random() * 40) + 5;
    const severity = count > 35 ? 4 : count > 25 ? 3 : count > 15 ? 2 : count > 8 ? 1 : 0;
    days.push({
      date: d.toISOString().slice(0, 10),
      count,
      severity,
    });
  }
  return days;
}

const HEAT_COLORS = ['#1a1a2e', '#3b1c32', '#6b2c3e', '#a83245', '#ef4444'];

export function FraudHeatCalendar() {
  const { variant } = useVariant();
  const data = useMemo(() => generateCalendarData(), []);

  // Group into weeks (columns of 7)
  const weeks: DayData[][] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  const totalIncidents = data.reduce((s, d) => s + d.count, 0);
  const avgDaily = (totalIncidents / data.length).toFixed(1);
  const peakDay = data.reduce((max, d) => (d.count > max.count ? d : max), data[0]!);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div
        className="flex items-center justify-between px-3 py-1.5 border-b shrink-0"
        style={{ borderColor: variant.colors.border }}
      >
        <span className="text-[10px] font-mono font-bold" style={{ color: variant.colors.primary }}>
          FRAUD ACTIVITY CALENDAR
        </span>
        <div className="flex items-center gap-4 text-[8px] font-mono" style={{ color: variant.colors.textMuted }}>
          <span>TOTAL: <strong style={{ color: variant.colors.text }}>{totalIncidents.toLocaleString()}</strong></span>
          <span>AVG/DAY: <strong style={{ color: variant.colors.text }}>{avgDaily}</strong></span>
          <span>PEAK: <strong style={{ color: '#EF4444' }}>{peakDay.count} ({peakDay.date})</strong></span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-3">
        <div className="flex gap-[3px]">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] mr-1">
            {['M', '', 'W', '', 'F', '', 'S'].map((l, i) => (
              <div
                key={i}
                className="w-3 h-3 flex items-center justify-center text-[7px] font-mono"
                style={{ color: variant.colors.textMuted }}
              >
                {l}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  className="w-3 h-3 rounded-[2px] cursor-pointer transition-colors"
                  style={{ backgroundColor: HEAT_COLORS[day.severity] }}
                  title={`${day.date}: ${day.count} incidents`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="ml-6 flex flex-col gap-1">
          <span className="text-[8px] font-mono mb-1" style={{ color: variant.colors.textMuted }}>
            INTENSITY
          </span>
          <div className="flex items-center gap-[2px]">
            {HEAT_COLORS.map((color, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-[2px]"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[7px] font-mono" style={{ color: variant.colors.textMuted }}>
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
}
