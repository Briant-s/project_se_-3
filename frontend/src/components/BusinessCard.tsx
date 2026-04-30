import { Card, Group, Avatar, Stack, ActionIcon, Text } from "@mantine/core";
import { HiExternalLink } from "react-icons/hi";

interface Props {
  businessName: string | undefined;
  businessSector: string | undefined;
  businessType: string | undefined;
}

function BusinessCard({ businessName, businessSector, businessType }: Props) {
  return (
    <>
      <Card shadow="sm" radius="md" withBorder padding="xl">
        <Group justify="space-between">
          <Group gap="md">
            <Avatar radius="md" size="lg" color="blue" />
            <Stack gap={0}>
              <Text fw={700} size="lg">
                {businessName}
              </Text>
              <Group gap="xs">
                <Text size="sm" c="dimmed">
                  {businessSector}
                </Text>
                <Text size="sm" c="dimmed">
                  •
                </Text>
                <Text size="sm" c="dimmed">
                  {businessType}
                </Text>
              </Group>
            </Stack>
          </Group>
          <ActionIcon variant="subtle" color="gray">
            <HiExternalLink size={20} />
          </ActionIcon>
        </Group>
      </Card>
    </>
  );
}

export default BusinessCard;
