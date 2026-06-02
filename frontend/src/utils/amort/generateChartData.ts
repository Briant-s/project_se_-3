import type { AmortizationChartData } from "../../services/models";

export const generateChartData = (
  principal: number | undefined,
  tenor: number | undefined,
  annualInterestRate: number | undefined,
  pmt: number | undefined,
  avgMonthlyIncome: number | undefined,
): AmortizationChartData[] => {
  if (!principal || !tenor || !pmt || !avgMonthlyIncome) return [];

  const monthlyRate = annualInterestRate ? annualInterestRate / 12 : 0;
  let currentBalance = principal;
  const chartData: AmortizationChartData[] = [];

  for (let month = 1; month <= tenor; month++) {
    let interestPayment = 0;
    let principalPayment = pmt;

    // If there is an interest rate, calculate the split for this specific month
    if (monthlyRate > 0) {
      interestPayment = currentBalance * monthlyRate;
      principalPayment = pmt - interestPayment;
    }

    currentBalance -= principalPayment;

    chartData.push({
      month: `Bln ${month}`,
      income: avgMonthlyIncome,
      principalPaid: Math.round(principalPayment),
      interestPaid: Math.round(interestPayment),
      remainingBalance: Math.max(0, Math.round(currentBalance)),
      installment: pmt,
    });
  }

  return chartData;
};
