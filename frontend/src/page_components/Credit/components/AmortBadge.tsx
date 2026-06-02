import { Paper, Group, Text, useMantineTheme } from "@mantine/core";

interface BadgeProps {
  status?: "healthy" | "warning" | "not_healthy";
  dbrPercent: number;
}

export function AmortBadge({ status = "warning", dbrPercent }: BadgeProps) {
  const theme = useMantineTheme();
  const { HealthStatus } = theme.other;

  // Map the specific status to the theme colors, icons, and labels
  const STATUS_MAP = {
    healthy: {
      bg: HealthStatus.h_bg,
      accentColor: HealthStatus.healthy,
      icon: "✓",
      label: "Healthy", // or "Aman" if you want to match the Indonesian text
    },
    warning: {
      bg: HealthStatus.w_bg,
      accentColor: HealthStatus.warning,
      icon: "⚠",
      label: "Warning", // or "Waspada"
    },
    not_healthy: {
      bg: HealthStatus.nh_bg,
      accentColor: HealthStatus.not_healthy,
      icon: "✕",
      label: "Risky", // or "Berisiko"
    },
  };

  const config = STATUS_MAP[status] || STATUS_MAP.warning;

  return (
    <Paper
      bg={config.bg}
      radius="md"
      px={14}
      py={8}
      style={{ border: `1px solid ${config.accentColor}40` }} // 25% opacity border
    >
      <Group gap={8} wrap="nowrap" align="center">
        <Text fz={18} c={config.accentColor} lh={1}>
          {config.icon}
        </Text>

        <div>
          <Text
            fz={11}
            fw={600}
            c={config.accentColor}
            tt="uppercase"
            lts="0.05em"
            lh={1.2}
          >
            {config.label}
          </Text>
          <Text fz={13} c={config.accentColor} lh={1.2} mt={2}>
            DBR {dbrPercent}%
          </Text>
        </div>
      </Group>
    </Paper>
  );
}
