export const calculateHealthStatus = (
  totalInstallment: number | undefined,
  tenorMonth: number | undefined,
  monthlyAverageIncome: number | undefined,
): string | undefined => {
  console.log("calculateHealthStatus inputs:", {
    totalInstallment,
    tenorMonth,
    monthlyAverageIncome,
  });

  if (!totalInstallment || !tenorMonth || !monthlyAverageIncome) {
    console.log("Guard failed:", {
      totalInstallment,
      tenorMonth,
      monthlyAverageIncome,
    });
    return undefined;
  }

  const healthRatio = totalInstallment / tenorMonth / monthlyAverageIncome;
  console.log("healthRatio:", healthRatio);

  if (healthRatio <= 0.3) return "healthy";
  else if (healthRatio <= 0.5) return "warning";
  else return "not_healthy";
};

export const isFeasible = (
  pmt?: number,
  monthlyAverageIncome?: number,
): boolean => {
  if (!pmt || !monthlyAverageIncome || monthlyAverageIncome <= 0) {
    return false;
  }

  const dbrPercentage = (pmt / monthlyAverageIncome) * 100;
  return dbrPercentage <= 40;
};
