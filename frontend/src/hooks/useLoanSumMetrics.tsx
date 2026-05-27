import { useMemo } from "react";
import type { AmortEntry, BusinessProfile } from "../services/models";

export function useLoanSummaryMetrics(
  entries: AmortEntry[] | undefined,
  business: BusinessProfile | undefined,
) {
  return useMemo(() => {
    // 1. Define fallback values for when there is no data
    const defaults = {
      totalLoanAmount: 0,
      averageLoanRequested: 0,
      loanToRevenueRatio: 0,
      feasibleCount: 0,
      totalSimulations: 0,
      avgSurplus: 0,
      avgDti: 0,
    };

    if (!entries || entries.length === 0) return defaults;

    const totalSimulations = entries.length;
    const monthlyIncome = business?.monthlyAverageIncome || 0;

    let totalLoanAmount = 0;
    let feasibleCount = 0;
    let totalInstallments = 0;

    // 2. Loop through entries ONCE to gather totals (better performance)
    entries.forEach((entry) => {
      totalLoanAmount += entry.principalAmount ?? 0;
      totalInstallments += entry.totalInstallment ?? 0;

      // Assuming "Feasible" means a "healthy" status.
      // Change to (entry.health_status === "healthy" || entry.health_status === "warning") if warning is acceptable.
      if (entry.health_status === "healthy") {
        feasibleCount++;
      }
    });

    // 3. Calculate Averages
    const averageLoanRequested = totalLoanAmount / totalSimulations;
    const averageInstallment = totalInstallments / totalSimulations;

    // 4. Calculate Ratios & Surplus (safeguard against division by zero)
    const loanToRevenueRatio =
      monthlyIncome > 0 ? (averageLoanRequested / monthlyIncome) * 100 : 0;

    const avgSurplus =
      monthlyIncome > 0 ? monthlyIncome - averageInstallment : 0;

    const avgDti =
      monthlyIncome > 0 ? (averageInstallment / monthlyIncome) * 100 : 0;

    return {
      totalLoanAmount,
      averageLoanRequested,
      loanToRevenueRatio,
      feasibleCount,
      totalSimulations,
      avgSurplus,
      avgDti,
    };
  }, [entries, business?.monthlyAverageIncome]);
}
