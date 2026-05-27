export const calculateTotalInstallment = (
  principalAmount: number | undefined,
  interestRate: number | undefined,
  tenorMonth: number | undefined,
): number | undefined => {
  if (!principalAmount || !interestRate || !tenorMonth) return undefined;
  return principalAmount + principalAmount * interestRate * (tenorMonth / 12);
};
