/**
 * AlertIconLayer — Icon markers for active alerts on the map.
 * Uses text characters as icons for cross-platform consistency.
 */
import { TextLayer } from "@deck.gl/layers";
import type { AlertIcon, FeedSeverity } from "@/types";

function severityColor(severity: FeedSeverity): [number, number, number, number] {
  switch (severity) {
    case "critical": return [220, 38, 38, 255];
    case "high": return [239, 68, 68, 230];
    case "medium": return [245, 158, 11, 200];
    case "low": return [234, 179, 8, 180];
    case "info": return [6, 182, 212, 160];
  }
}

function categorySymbol(type: string): string {
  switch (type) {
    case "fraud": return "!";
    case "cyber": return "#";
    case "weather": return "~";
    case "regulatory": return "S";
    case "geopolitical": return "F";
    case "claims": return "*";
    case "market": return "M";
    default: return "o";
  }
}

export function createAlertIconLayer(data: AlertIcon[]) {
  return new TextLayer({
    id: "alert-icon-layer",
    data,
    getPosition: (d: AlertIcon) => d.position,
    getText: (d: AlertIcon) => categorySymbol(d.type),
    getColor: (d: AlertIcon) => severityColor(d.severity),
    getSize: (d: AlertIcon) => (d.severity === "critical" ? 24 : d.severity === "high" ? 20 : 16),
    getAngle: 0,
    getTextAnchor: "middle",
    getAlignmentBaseline: "center",
    pickable: true,
    billboard: true,
    fontFamily: "monospace",
    fontWeight: "bold",
    background: true,
    getBackgroundColor: [10, 14, 26, 200],
    backgroundPadding: [4, 2, 4, 2],
  });
}
