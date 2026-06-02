export function calculateSafeExtendedTenor(
  principalAmount: number,
  annualRate: number,
  avgMonthlyIncome: number,
  status: string,
) {
  if (status === "healthy") return 0;

  const maxPmt = avgMonthlyIncome * 0.4; // 40% safe DBR limit
  const r = annualRate / 12;

  if (r === 0) return Math.ceil(principalAmount / maxPmt);

  const denominator = maxPmt - principalAmount * r;

  // Safety check: If monthly interest is higher than the max allowed payment,
  // the loan can never be paid off, resulting in an infinite/impossible tenor.
  if (denominator <= 0) return 0;

  return Math.ceil(Math.log(maxPmt / denominator) / Math.log(1 + r));
}
