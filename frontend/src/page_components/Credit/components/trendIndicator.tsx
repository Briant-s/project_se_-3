import { Text } from "@mantine/core";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6"; // Adjust import based on your icon library

// If you have formatPercent in a utils file, import it here:
// import { formatPercent } from "../utils/formatters";

const formatPercent = (num: number) => `${num.toFixed(0)}%`;

interface TrendIndicatorProps {
  value: number;
  trend?: "up" | "down"; // Allows you to reuse this for positive trends later
  color?: string;
}

function TrendIndicator({
  value,
  trend = "down",
  color = "red",
}: TrendIndicatorProps) {
  return (
    <Text
      c={color}
      fw={700}
      style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
    >
      <span>{formatPercent(value)}</span>
      {trend === "down" ? (
        <FaArrowTrendDown size={16} />
      ) : (
        <FaArrowTrendUp size={16} />
      )}
    </Text>
  );
}

export default TrendIndicator;
