/**
 * FraudArcLayer — Animated arcs showing cross-border fraud connections.
 */
import { ArcLayer } from "@deck.gl/layers";
import type { FraudArc } from "@/types";

export function createFraudArcLayer(data: FraudArc[]) {
  // @ts-expect-error DeckGL v9 constructor typing mismatch
  return new ArcLayer({
    id: "fraud-arc-layer",
    data,
    getSourcePosition: (d: FraudArc) => d.source,
    getTargetPosition: (d: FraudArc) => d.target,
    getSourceColor: [6, 182, 212, 200],
    getTargetColor: [244, 63, 94, 200],
    getWidth: (d: FraudArc) => d.weight * 6,
    getHeight: 0.3,
    greatCircle: true,
    pickable: true,
    widthMinPixels: 1,
    widthMaxPixels: 8,
  });
}
