export const calculateDebtBurdenRatio = (
  pmt: number | undefined,
  monthlyAverageIncome: number | undefined,
): number => {
  if (!pmt || !monthlyAverageIncome || monthlyAverageIncome <= 0) {
    return 0;
  }
  const rawRatio = (pmt / monthlyAverageIncome) * 100;

  return Math.round(rawRatio * 100) / 100;
};
