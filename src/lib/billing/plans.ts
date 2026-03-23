/**
 * DEEVO SaaS — Subscription Plans
 * Pricing structure for GCC Decision Intelligence Platform
 */

import type { PlanTier } from '../auth/roles';

export interface PricingPlan {
  tier: PlanTier;
  name: string;
  nameAr: string;
  priceMonthly: number; // USD
  priceAnnual: number;  // USD (per year)
  currency: 'USD';
  features: string[];
  cta: string;
  highlighted: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    tier: 'free',
    name: 'Explorer',
    nameAr: 'المستكشف',
    priceMonthly: 0,
    priceAnnual: 0,
    currency: 'USD',
    features: [
      '3 intelligence panels',
      'Delayed feeds (15 min)',
      '2 map layers',
      'GCC overview only',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    tier: 'pro',
    name: 'Enterprise',
    nameAr: 'المؤسسات',
    priceMonthly: 2499,
    priceAnnual: 24990,
    currency: 'USD',
    features: [
      'All 6 intelligence panels',
      'Real-time feeds',
      'All 4 map layers',
      'AI decision engine',
      'Sector intelligence (14 sectors)',
      'GDP impact dashboard',
      'Export PDF reports',
      'API access',
      'Priority support',
    ],
    cta: 'Start Trial',
    highlighted: true,
  },
  {
    tier: 'government',
    name: 'Sovereign',
    nameAr: 'السيادي',
    priceMonthly: 0, // Custom pricing
    priceAnnual: 0,
    currency: 'USD',
    features: [
      'Everything in Enterprise',
      'Scenario simulation engine',
      'Cross-sector propagation modeling',
      'Ministry-level intelligence',
      'Custom risk models',
      'Dedicated account manager',
      'On-premise deployment option',
      'PDPL compliance certified',
      'White-label capability',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export function getPlan(tier: PlanTier): PricingPlan | undefined {
  return PRICING_PLANS.find((p) => p.tier === tier);
}
