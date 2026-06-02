// utils/getColor.ts
import { brandTheme } from "../brandTheme";

const { healthy, warning, not_healthy } = brandTheme.other?.HealthStatus;

// ─── Mantine color keys ────────────────────────────────────────────────────────
// Used for Badge `color` prop — must be registered Mantine color names

/**
 * Feasibility rate: ratio of feasible to total simulations.
 * ≥ 80% → green | 50–79% → amber | < 50% → red
 */
export function getFeasibilityColor(feasible: number, total: number): string {
  if (total === 0) return "gray.0";
  const rate = feasible / total;
  if (rate >= 0.8) return "green";
  if (rate >= 0.5) return "amber";
  return "red";
}

/**
 * Surplus after payment: higher is better.
 * > 0 → green | = 0 → amber | < 0 → red
 */
export function getSurplusColor(surplus: number): string {
  if (surplus > 0) return "green";
  if (surplus === 0) return "amber";
  return "red";
}

/**
 * Debt-to-Income ratio: lower is better.
 * < 35% → green | 35–50% → amber | > 50% → red
 */
export function getDtiColor(dti: number): string {
  if (dti < 35) return "green";
  if (dti <= 50) return "amber";
  return "red";
}

// ─── Hex values ───────────────────────────────────────────────────────────────
// Used for TrendIndicator and any component needing exact hex (not Mantine keys)

/**
 * Returns a hex color from HealthStatus theme values.
 * Three-tier: healthy → warning → not_healthy
 */
export function getTrendColor(
  value: number,
  semantic: "higher-is-worse" | "higher-is-better" = "higher-is-worse",
  threshold = 50,
  dangerZone = 1.4,
): string {
  const isAboveThreshold = value > threshold;
  const isBad =
    semantic === "higher-is-worse" ? isAboveThreshold : !isAboveThreshold;

  if (!isBad) return healthy;
  return value > threshold * dangerZone ? not_healthy : warning;
}
