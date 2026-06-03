// hooks/useKUREligibility.ts
import { useMemo } from "react";
import { useCreditReferences } from "./useCreditReferences";
import { useBusinessProfile } from "./useBusinessProfile";
import {
  getKUREligibility,
  type KUREligibility,
} from "../utils/kurEligibility";

export function useKUREligibility(loanPurpose: "ki" | "kmk") {
  const { creditMapByType, loading: creditLoading } = useCreditReferences();
  const { business, loading: profileLoading } = useBusinessProfile();

  const eligibilityMap = useMemo(() => {
    if (!business) return {} as Record<string, KUREligibility>;

    const keys = ["supermikro", "mikro", "kecil"];
    return Object.fromEntries(
      keys.map((key) => {
        const creditType = `${key}-${loanPurpose}`;
        const credit = creditMapByType[creditType];
        if (!credit) return [creditType, null];
        return [creditType, getKUREligibility(business, credit)];
      }),
    );
  }, [business, creditMapByType, loanPurpose]);

  return {
    eligibilityMap,
    loading: creditLoading || profileLoading,
  };
}
