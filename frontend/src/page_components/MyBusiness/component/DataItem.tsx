import { Stack, Text } from "@mantine/core";

interface Props {
  label: string;
  value: string | number | React.ReactNode;
}

function DataItem({ label, value }: Props) {
  return (
    <>
      <Stack gap={0}>
        <Text size="xs" c="dimmed">
          {label}
        </Text>
        <Text size="sm" fw={500}>
          {value}
        </Text>
      </Stack>
    </>
  );
}

export default DataItem;
