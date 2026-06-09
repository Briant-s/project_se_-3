import { Badge, useMantineTheme } from "@mantine/core";
import { HiOutlineCreditCard } from "react-icons/hi";

export type KurBadgeType = "healthy" | "warning" | "not_healthy";

interface KurTypeBadgeProps {
  type?: string | undefined; // Allows the strict types, but accepts string for API fallbacks
}

function HealthBadge({ type }: KurTypeBadgeProps) {
  const theme = useMantineTheme();
  const map: Record<string, { color: string; label: string }> = {
    healthy: {
      color: theme.other.HealthStatus.healthy,
      label: "Healthy",
    },
    warning: { color: theme.other.HealthStatus.warning, label: "Warning" },
    not_healthy: {
      color: theme.other.HealthStatus.not_healthy,
      label: "Not Healthy",
    },
  };

  const { color, label } = (type ? map[type] : null) ?? {
    color: "gray",
    label: "Unknown",
  };

  return (
    <Badge
      leftSection={<HiOutlineCreditCard size={14} />}
      variant="outline"
      color={color}
    >
      {label}
    </Badge>
  );
}

export default HealthBadge;
