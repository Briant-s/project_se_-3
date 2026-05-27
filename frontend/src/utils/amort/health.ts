export const calculateHealthStatus = (
  totalInstallment: number | undefined,
  tenorMonth: number | undefined,
  monthlyAverageIncome: number | undefined,
): string | null => {
  if (!totalInstallment || !tenorMonth || !monthlyAverageIncome) return null;

  const healthRatio = totalInstallment / tenorMonth / monthlyAverageIncome;

  if (healthRatio <= 0.3) return "healthy";
  else if (healthRatio <= 0.5) return "warning";
  else return "not_healthy";
};
