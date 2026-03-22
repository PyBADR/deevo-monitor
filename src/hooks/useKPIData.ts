/**
 * useKPIData — Hook to fetch KPI data for the active variant.
 * Polls /api/kpi?variant=<id> every 60s with fresh data.
 */
import { useState, useEffect, useCallback } from 'react';
import { useVariant } from '@/variants';
import type { KPISet } from '@/kpi/kpi.types';

const API_BASE = import.meta.env.VITE_API_URL ?? '';
const POLL_INTERVAL = 60_000; // 60s

interface UseKPIDataReturn {
  kpiSet: KPISet | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useKPIData(): UseKPIDataReturn {
  const { variantId } = useVariant();
  const [kpiSet, setKpiSet] = useState<KPISet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKPIs = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/kpi?variant=${variantId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setKpiSet(data.kpiSet ?? data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [variantId]);

  useEffect(() => {
    setLoading(true);
    fetchKPIs();
    const interval = setInterval(fetchKPIs, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchKPIs]);

  return { kpiSet, loading, error, refetch: fetchKPIs };
}
