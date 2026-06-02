import { Paper, Text, useMantineTheme } from "@mantine/core";

interface MetricProps {
  label: string;
  value: string;
  sub: string;
  // Updated to match your exact HealthStatus keys
  variant?: "default" | "healthy" | "warning" | "not_healthy" | "info";
}

export function MetricCard({
  label,
  value,
  sub,
  variant = "default",
}: MetricProps) {
  const theme = useMantineTheme();
  const { HealthStatus } = theme.other;

  const themes = {
    default: {
      bg: "white",
      border: "var(--mantine-color-gray-3)",
      labelColor: "dimmed",
      valueColor: "dark.9",
      subColor: "gray.6",
    },
    info: {
      bg: "blue.0",
      border: "var(--mantine-color-blue-2)",
      labelColor: "dimmed",
      valueColor: "blue.9",
      subColor: "blue.6",
    },
    healthy: {
      bg: HealthStatus.h_bg,
      border: `${HealthStatus.healthy}40`, // 25% opacity hex trick for borders
      labelColor: "dimmed",
      valueColor: HealthStatus.healthy,
      subColor: HealthStatus.healthy,
    },
    warning: {
      bg: HealthStatus.w_bg,
      border: `${HealthStatus.warning}40`,
      labelColor: "dimmed",
      valueColor: HealthStatus.warning,
      subColor: HealthStatus.warning,
    },
    not_healthy: {
      bg: HealthStatus.nh_bg,
      border: `${HealthStatus.not_healthy}40`,
      labelColor: "dimmed",
      valueColor: HealthStatus.not_healthy,
      subColor: HealthStatus.not_healthy,
    },
  };

  const t = themes[variant] ?? themes.default;

  return (
    <Paper
      bg={t.bg}
      radius="md"
      px={14}
      py={12}
      style={{ border: `0.5px solid ${t.border}` }}
      shadow="sm"
    >
      <Text fz={11} fw={500} c={t.labelColor}>
        {label}
      </Text>

      <Text mt={4} mb={2} fz={17} fw={700} c={t.valueColor}>
        {value}
      </Text>

      <Text fz={11} c={t.subColor}>
        {sub}
      </Text>
    </Paper>
  );
}
