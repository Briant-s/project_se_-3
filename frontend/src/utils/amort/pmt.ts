export const calculatePMT = (
  principal?: number,
  tenorMonths?: number,
  annualInterestRate?: number,
): number => {
  // 1. Guard clause: Return 0 if essential data is missing
  if (!principal || !tenorMonths) {
    return 0;
  }

  // 2. Handle 0% interest (flat division) to prevent division by zero
  if (!annualInterestRate || annualInterestRate === 0) {
    return Math.round(principal / tenorMonths);
  }

  // 3. Convert annual percentage rate to a decimal monthly rate
  const monthlyRate = annualInterestRate / 12;

  // 4. Standard Amortization Formula
  const pmt =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenorMonths)) /
    (Math.pow(1 + monthlyRate, tenorMonths) - 1);

  // 5. Round to the nearest whole Rupiah
  return Math.round(pmt);
};
