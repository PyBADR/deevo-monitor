/**
 * DEEVO Layer Configuration — deck.gl Layer Definitions
 * 4 Real GCC Intelligence Layers: Trade Routes, Oil Flow, Risk Zones, Insurance Exposure
 */

export type LayerId = 'trade-routes' | 'oil-flow' | 'risk-zones' | 'insurance-exposure';

export interface LayerConfig {
  id: LayerId;
  label: string;
  labelAr: string;
  visible: boolean;
  color: string;
  description: string;
}

export const LAYER_CONFIGS: LayerConfig[] = [
  {
    id: 'trade-routes',
    label: 'Trade Routes',
    labelAr: 'طرق التجارة',
    visible: true,
    color: '#38bdf8',
    description: 'Major GCC shipping and trade corridors',
  },
  {
    id: 'oil-flow',
    label: 'Oil Flow',
    labelAr: 'تدفق النفط',
    visible: true,
    color: '#f5a623',
    description: 'Oil pipelines and tanker shipping routes',
  },
  {
    id: 'risk-zones',
    label: 'Risk Zones',
    labelAr: 'مناطق الخطر',
    visible: false,
    color: '#f87171',
    description: 'Conflict, tension, and instability zones',
  },
  {
    id: 'insurance-exposure',
    label: 'Insurance Exposure',
    labelAr: 'التعرض التأميني',
    visible: false,
    color: '#d946ef',
    description: 'High exposure zones, claims clusters, catastrophe risk',
  },
];

export function getLayerConfig(id: LayerId): LayerConfig | undefined {
  return LAYER_CONFIGS.find((l) => l.id === id);
}
