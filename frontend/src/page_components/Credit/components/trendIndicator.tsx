import { Text } from "@mantine/core";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6"; // Adjust import based on your icon library

const formatPercent = (num: number) => `${num.toFixed(0)}%`;

interface TrendIndicatorProps {
  value: number;
  /**
   * "higher-is-worse": red+down when value is high (e.g. loan-to-revenue ratio)
   * "higher-is-better": green+up when value is high (e.g. repayment rate)
   * Defaults to "higher-is-worse"
   */
  semantic?: "higher-is-worse" | "higher-is-better";
  /** Optional threshold (0–100). Above = bad direction, below = good. Defaults to 50 */
  threshold?: number;
}

function TrendIndicator({
  value,
  semantic = "higher-is-worse",
  threshold = 50,
}: TrendIndicatorProps) {
  const isAboveThreshold = value > threshold;

  const isBad =
    semantic === "higher-is-worse" ? isAboveThreshold : !isAboveThreshold;

  const color = isBad ? "red" : "green";
  const trend = isBad ? "up" : "down"; // arrow shows direction of the metric

  return (
    <Text
      c={color}
      fw={700}
      style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
    >
      <span>{formatPercent(value)}</span>
      {trend === "up" ? (
        <FaArrowTrendUp size={16} />
      ) : (
        <FaArrowTrendDown size={16} />
      )}
    </Text>
  );
}

export default TrendIndicator;
