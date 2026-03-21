/**
 * RiskHeatmapLayer — 2D heatmap overlay of risk intensity.
 */
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import type { RiskHotspot } from "@/types";

export function createHeatmapLayer(data: RiskHotspot[]) {
  // @ts-expect-error DeckGL v9 constructor typing mismatch
  return new HeatmapLayer({
    id: "risk-heatmap-layer",
    data,
    getPosition: (d: RiskHotspot) => d.position,
    getWeight: (d: RiskHotspot) => d.weight,
    radiusPixels: 60,
    intensity: 1.5,
    threshold: 0.1,
    colorRange: [
      [0, 25, 53],
      [6, 182, 212],
      [234, 179, 8],
      [239, 68, 68],
      [220, 38, 38],
    ] as [number, number, number][],
    opacity: 0.6,
    pickable: false,
  });
}
