export function calculateMaxSafePrincipal(
  tenorMonth: number,
  annualRate: number,
  avgMonthlyIncome: number,
  targetRatio: number = 0.3, // Defaulted to 0.3 to match your 'healthy' status
): number {
  // 1. Guard against missing or invalid inputs
  if (!tenorMonth || !avgMonthlyIncome || tenorMonth <= 0) return 0;

  const r = annualRate / 12;
  const maxPmt = avgMonthlyIncome * targetRatio;

  // 2. Handle 0% interest rate loans
  if (r === 0) return maxPmt * tenorMonth;

  // 3. Calculate max principal using Present Value of Annuity formula
  // P = PMT * [(1 + r)^n - 1] / [r * (1 + r)^n]
  const compoundFactor = Math.pow(1 + r, tenorMonth);

  return (maxPmt * (compoundFactor - 1)) / (r * compoundFactor);
}
