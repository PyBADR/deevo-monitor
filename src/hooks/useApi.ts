/**
 * useApi — REST API hooks for initial data loading.
 * Fetches feed, risk, pipeline stats, and Ollama status on mount.
 */
import { useEffect } from "react";
import { useDataStore } from "@/stores/dataStore";

// In production: Vercel rewrites /api/* to Render backend
// In dev: Vite proxy handles /api/* → localhost:3001
const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function fetchJSON<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? json) as T;
  } catch {
    return null;
  }
}

export function useInitialData() {
  const setFeedItems = useDataStore((s) => s.setFeedItems);
  const updateCountryRisk = useDataStore((s) => s.updateCountryRisk);
  const setPipelineStats = useDataStore((s) => s.setPipelineStats);
  const setDRILevel = useDataStore((s) => s.setDRILevel);

  useEffect(() => {
    // Load feed
    fetchJSON<Array<Record<string, unknown>>>("/feed?limit=100").then((items) => {
      if (items && items.length > 0) {
        setFeedItems(items as never[]);
      }
    });

    // Load country risks
    fetchJSON<Array<Record<string, unknown>>>("/risk/countries").then((risks) => {
      if (risks) {
        for (const risk of risks) {
          updateCountryRisk(risk as never);
        }
      }
    });

    // Load DRI
    fetchJSON<{ level: number }>("/risk/dri").then((data) => {
      if (data?.level) {
        setDRILevel(data.level as 1 | 2 | 3 | 4 | 5);
      }
    });

    // Load pipeline stats
    fetchJSON<Record<string, unknown>>("/cortex/pipeline").then((stats) => {
      if (stats) {
        setPipelineStats(stats as never);
      }
    });
  }, [setFeedItems, updateCountryRisk, setPipelineStats, setDRILevel]);
}
