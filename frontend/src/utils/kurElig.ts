// utils/kurEligibility.ts
import type { BusinessProfile } from "../services/models";
import type { Credit } from "../services/models";

export interface KUREligibility {
  creditType: string;
  eligible: boolean;
  checks: {
    label: string;
    info: string;
    met: boolean;
  }[];
}

export function getKUREligibility(
  profile: BusinessProfile,
  credit: Credit,
): KUREligibility {
  const checks = [
    {
      label: "Business Age",
      info:
        credit.minBusinessAge === 0
          ? "No minimum required"
          : `Minimum ${credit.minBusinessAge} months`,
      met:
        credit.minBusinessAge === 0 ||
        (profile.businessAge ?? 0) >= credit.minBusinessAge,
    },
    {
      label: "Collateral",
      info: credit.needsCollateral
        ? "Collateral asset required"
        : "Not required",
      met: !credit.needsCollateral || (profile.hasCollateral ?? false),
    },
  ];

  return {
    creditType: credit.creditType,
    eligible: checks.every((c) => c.met),
    checks,
  };
}
