export const calculateTotalInstallment = (
  principalAmount: number | undefined,
  interestRate: number | undefined,
  tenorMonth: number | undefined,
) => {
  if (!principalAmount || !interestRate || !tenorMonth) return null;
  return principalAmount + principalAmount * interestRate * (tenorMonth / 12);
};
