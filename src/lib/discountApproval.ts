import { isCeo, isBranchManagerOrCeo } from './roleChecks';

export type DiscountTier = 'auto' | 'bm_or_ceo' | 'ceo_only';

type RoleCheckUser = Parameters<typeof isCeo>[0];

export interface DiscountTierThresholds {
  autoMaxPercent: number;
  bmCeoMaxPercent: number;
}

// Used only if the config table is unreachable/hasn't loaded yet - keeps the
// feature usable before real thresholds arrive, not a policy value callers
// should rely on directly. The real, current thresholds live in
// dm_discount_tier_config (see discountTierConfig.ts) and are staff-editable
// via PUT /api/discount-approvals/tier-config.
export const DEFAULT_DISCOUNT_TIER_THRESHOLDS: DiscountTierThresholds = {
  autoMaxPercent: 20,
  bmCeoMaxPercent: 30,
};

// Pure, client-safe functions only - no DB access here (this module is
// imported by both server API routes and the client-side discount-approvals
// page, and pulling sequelize into a 'use client' bundle breaks the build).
// See discountTierConfig.ts for the DB-backed threshold lookup/update.

// Computed from the request's own stored amounts (not a client-supplied
// field), so the tier can't be spoofed and is always re-derivable for audit.
// `thresholds` defaults to DEFAULT_DISCOUNT_TIER_THRESHOLDS only as a last
// resort - callers should fetch the real, current thresholds via
// getDiscountTierThresholds() (discountTierConfig.ts) and pass them in explicitly.
export function getDiscountTier(
  discountAmount: number,
  originalAmount: number,
  thresholds: DiscountTierThresholds = DEFAULT_DISCOUNT_TIER_THRESHOLDS
): DiscountTier {
  const pct = originalAmount > 0 ? (discountAmount / originalAmount) * 100 : 0;
  if (pct <= thresholds.autoMaxPercent) return 'auto';
  if (pct <= thresholds.bmCeoMaxPercent) return 'bm_or_ceo';
  return 'ceo_only';
}

export function getDiscountPercentage(discountAmount: number, originalAmount: number): number {
  return originalAmount > 0 ? (discountAmount / originalAmount) * 100 : 0;
}

export function canApproveDiscountTier(tier: DiscountTier, user: RoleCheckUser): boolean {
  if (tier === 'auto') return true;
  if (tier === 'bm_or_ceo') return isBranchManagerOrCeo(user);
  return isCeo(user);
}

export function discountTierLabel(
  tier: DiscountTier,
  thresholds: DiscountTierThresholds = DEFAULT_DISCOUNT_TIER_THRESHOLDS
): string {
  if (tier === 'auto') return `Auto-approved (0-${thresholds.autoMaxPercent}%)`;
  if (tier === 'bm_or_ceo') return `Branch Manager or CEO (${thresholds.autoMaxPercent}-${thresholds.bmCeoMaxPercent}%)`;
  return `CEO only (${thresholds.bmCeoMaxPercent}%+)`;
}
