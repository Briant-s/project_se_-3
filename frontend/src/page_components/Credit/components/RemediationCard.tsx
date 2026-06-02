import { Paper, Text } from "@mantine/core";

interface RemediationProps {
  optionLabel: string;
  primaryValue: string;
  description: string;
  themeColor: string;
}

export function RemediationCard({
  optionLabel,
  primaryValue,
  description,
  themeColor = "orange",
}: RemediationProps) {
  return (
    <Paper
      bg="white"
      radius="md"
      px="md"
      py="sm"
      style={{ border: `1px solid var(--mantine-color-${themeColor}-2)` }}
    >
      <Text
        tt="uppercase"
        lts="0.05em"
        fw={600}
        fz="xs"
        c={`${themeColor}.8`}
        mb={4}
      >
        {optionLabel}
      </Text>
      <Text fw={700} fz={20} c="dark.9" mb={4}>
        {primaryValue}
      </Text>
      <Text fz="xs" c="dimmed">
        {description}
      </Text>
    </Paper>
  );
}
