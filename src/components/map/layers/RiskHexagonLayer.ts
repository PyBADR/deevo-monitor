/**
 * RiskHexagonLayer — 3D hexagonal aggregation of risk hotspots.
 */
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import type { RiskHotspot } from "@/types";

export function createRiskHexagonLayer(data: RiskHotspot[]) {
  // @ts-expect-error DeckGL v9 constructor typing mismatch
  return new HexagonLayer({
    id: "risk-hexagon-layer",
    data,
    getPosition: (d: RiskHotspot) => d.position,
    getElevationWeight: (d: RiskHotspot) => d.weight,
    getColorWeight: (d: RiskHotspot) => d.weight,
    elevationScale: 200,
    radius: 25000,
    coverage: 0.85,
    upperPercentile: 95,
    extruded: true,
    pickable: true,
    opacity: 0.7,
    colorRange: [
      [65, 182, 196],
      [127, 205, 187],
      [199, 233, 180],
      [237, 248, 177],
      [255, 170, 80],
      [240, 59, 32],
    ] as [number, number, number][],
    material: {
      ambient: 0.6,
      diffuse: 0.6,
      shininess: 32,
    },
  });
}
