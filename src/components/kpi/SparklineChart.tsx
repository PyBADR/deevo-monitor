/**
 * SparklineChart — Tiny inline SVG sparkline for KPI metrics.
 * Renders a polyline + gradient fill from SparklinePoint[] data.
 */
import { useMemo } from 'react';
import type { SparklinePoint } from '@/kpi/kpi.types';

interface SparklineChartProps {
  data: SparklinePoint[];
  color: string;
  width?: number;
  height?: number;
  filled?: boolean;
}

export function SparklineChart({
  data,
  color,
  width = 80,
  height = 24,
  filled = true,
}: SparklineChartProps) {
  const { linePath, fillPath } = useMemo(() => {
    if (!data.length) return { linePath: '', fillPath: '' };

    const values = data.map((d) => d.v);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const pad = 1;

    const points = data.map((d, i) => ({
      x: pad + (i / (data.length - 1)) * (width - pad * 2),
      y: pad + (1 - (d.v - min) / range) * (height - pad * 2),
    }));

    const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const last = points[points.length - 1]!;
    const first = points[0]!;
    const fill = `${line} L${last.x.toFixed(1)},${height} L${first.x.toFixed(1)},${height} Z`;

    return { linePath: line, fillPath: fill };
  }, [data, width, height]);

  if (!data.length) return null;

  const gradientId = `spark-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <svg width={width} height={height} className="shrink-0">
      {filled && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <path d={fillPath} fill={`url(#${gradientId})`} />
        </>
      )}
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
