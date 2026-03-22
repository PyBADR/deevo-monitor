/**
 * KPI API Route — /api/kpi
 * Returns variant-specific KPI sets with fresh timestamps.
 */
import { Router } from 'express';
import { getKPISetForVariant, getAvailableKPISets } from '../kpi/index';

const router = Router();

/**
 * GET /api/kpi?variant=global
 * Returns the KPI set for the specified variant.
 */
router.get('/', (req, res) => {
  const variantId = (req.query.variant as string) || 'global';
  const kpiSet = getKPISetForVariant(variantId);
  res.json({
    kpiSet,
    timestamp: Date.now(),
  });
});

/**
 * GET /api/kpi/sets
 * Returns available KPI set metadata.
 */
router.get('/sets', (_req, res) => {
  res.json({
    sets: getAvailableKPISets(),
    timestamp: Date.now(),
  });
});

export default router;
