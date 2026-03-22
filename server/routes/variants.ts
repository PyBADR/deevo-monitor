/**
 * Variants API Route — /api/variants
 * Returns variant configurations and metadata.
 */
import { Router } from 'express';
import { getFeedsForVariant, getFeedStats } from '../feeds/all-feeds.config';
import { getKPISetForVariant } from '../kpi/index';

const router = Router();

// Minimal variant metadata (full configs live in client)
const VARIANT_META = [
  { id: 'global', name: 'DEEVO Monitor', domain: 'monitor.deevo.ai', kpiSet: 'insurance' },
  { id: 'tech', name: 'DEEVO Tech', domain: 'tech.deevo.ai', kpiSet: 'insurtech' },
  { id: 'finance', name: 'DEEVO Finance', domain: 'finance.deevo.ai', kpiSet: 'financial' },
  { id: 'fraud', name: 'DEEVO Sentinel', domain: 'fraud.deevo.ai', kpiSet: 'fraud' },
];

/**
 * GET /api/variants
 * Returns all variant metadata.
 */
router.get('/', (_req, res) => {
  res.json({
    variants: VARIANT_META,
    timestamp: Date.now(),
  });
});

/**
 * GET /api/variants/:id
 * Returns detailed variant info including feed count and KPI summary.
 */
router.get('/:id', (req, res) => {
  const variantId = req.params.id;
  const meta = VARIANT_META.find((v) => v.id === variantId);

  if (!meta) {
    return res.status(404).json({ error: `Variant '${variantId}' not found` });
  }

  const feeds = getFeedsForVariant(variantId);
  const kpiSet = getKPISetForVariant(variantId);

  res.json({
    ...meta,
    feedCount: feeds.length,
    kpiSections: kpiSet.sections.length,
    kpiMetrics: kpiSet.sections.reduce((sum, s) => sum + s.metrics.length, 0),
    feedStats: getFeedStats(),
    timestamp: Date.now(),
  });
});

export default router;
