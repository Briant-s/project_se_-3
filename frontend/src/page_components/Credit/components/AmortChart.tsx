import React from "react";
import { CompositeChart } from "@mantine/charts";
import type { AmortizationChartProps } from "../../../services/models";

export const FeasibilityChart: React.FC<AmortizationChartProps> = ({
  data,
  isFeasible,
}) => {
  if (!data || data.length === 0) return null;

  const barPrincipalColor = isFeasible ? "blue.6" : "red.6";
  const barInterestColor = isFeasible ? "blue.2" : "red.2";

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <CompositeChart
      ml={-75}
      h={400}
      data={data}
      dataKey="month"
      maxBarWidth={35}
      withLegend
      withTooltip
      withRightYAxis
      valueFormatter={formatCurrency}
      yAxisProps={{ tickFormatter: formatCurrency, width: 100 }}
      rightYAxisProps={{ tickFormatter: formatCurrency, width: 100 }}
      // 1. FIX FOR STACKID: Passes stackId globally to all Recharts <Bar /> elements
      barProps={{ stackId: "installment" }}
      // 2. FIX FOR DASHED LINE: Passes strokeDasharray globally to the Recharts <Line /> element
      lineProps={{ strokeDasharray: "4 3" }}
      series={[
        {
          name: "income",
          label: "Pendapatan Bulanan",
          type: "area",
          color: "green.1",
          yAxisId: "left",
        },
        {
          name: "principalPaid",
          label: "Pokok",
          type: "bar",
          color: barPrincipalColor,
          yAxisId: "left",
        },
        {
          name: "interestPaid",
          label: "Bunga",
          type: "bar",
          color: barInterestColor,
          yAxisId: "left",
        },
        {
          name: "remainingBalance",
          label: "Sisa Pokok",
          type: "line",
          color: "orange.6",
          yAxisId: "right",
        },
      ]}
    />
  );
};
