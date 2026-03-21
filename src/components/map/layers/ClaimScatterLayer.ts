/**
 * ClaimScatterLayer — Scatterplot of claim clusters by volume.
 * Circle radius = claim count, color = avg processing time.
 */
import { ScatterplotLayer } from "@deck.gl/layers";
import type { ClaimCluster } from "@/types";

function processingColor(days: number): [number, number, number, number] {
  if (days < 10) return [16, 185, 129, 180];
  if (days < 14) return [234, 179, 8, 180];
  return [239, 68, 68, 180];
}

export function createClaimScatterLayer(data: ClaimCluster[]) {
  return new ScatterplotLayer({
    id: "claim-scatter-layer",
    data,
    getPosition: (d: ClaimCluster) => d.position,
    getRadius: (d: ClaimCluster) => Math.sqrt(d.count) * 500,
    getFillColor: (d: ClaimCluster) => processingColor(d.avgProcessingDays),
    getLineColor: [255, 255, 255, 80],
    lineWidthMinPixels: 1,
    stroked: true,
    filled: true,
    pickable: true,
    radiusMinPixels: 8,
    radiusMaxPixels: 60,
    opacity: 0.8,
  });
}
