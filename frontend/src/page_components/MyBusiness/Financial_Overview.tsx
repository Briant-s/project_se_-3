import {
  ActionIcon,
  Avatar,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Divider,
  Badge,
} from "@mantine/core";
import { HiExternalLink } from "react-icons/hi";
import { HiOutlineCreditCard, HiOutlineBanknotes } from "react-icons/hi2";


function FinancialOverview() {
  // Helper component untuk layout data yang konsisten
  const DataItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | React.ReactNode;
  }) => (
    <Stack gap={0} style={{ flex: 1 }}>
      <Text size="xs" c="dimmed">
        {label}
      </Text>
      <Text size="sm" fw={500}>
        {value}
      </Text>
    </Stack>
  );

  return (
    <>
      <Container fluid>
        <Stack gap="lg">

          {/* Business Header Card - DITAMBAHKAN shadow="sm" */}
          <Card shadow="sm" radius="md" withBorder padding="xl">
            <Group justify="space-between">
              <Group gap="md">
                <Avatar radius="md" size="lg" color="blue" />
                <Stack gap={0}>
                  <Text fw={700} size="lg">
                    Business Name
                  </Text>
                  <Group gap="xs">
                    <Text size="sm" c="dimmed">
                      Sector
                    </Text>
                    <Text size="sm" c="dimmed">
                      •
                    </Text>
                    <Text size="sm" c="dimmed">
                      Type
                    </Text>
                  </Group>
                </Stack>
              </Group>
              <ActionIcon variant="subtle" color="gray">
                <HiExternalLink size={20} />
              </ActionIcon>
            </Group>
          </Card>

          {/* Card 1: Performance & Active Loans - DITAMBAHKAN shadow="sm" */}
          <Card shadow="sm" radius="md" withBorder padding="xl">
            <Stack gap="xl">
              <Group justify="space-between" align="center">
                <Text fw={700} size="lg">
                  Performance & Loans
                </Text>
              </Group>

              {/* Active KUR Loan */}
              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Active KUR Loan
                </Text>
                <Group justify="space-between" align="center">
                  <Text size="sm" fw={500}>Current Status</Text>
                  <Badge color="gray" variant="light">None</Badge>
                </Group>
              </Stack>

              <Divider />

              {/* Monthly Performance */}
              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Monthly Performance
                </Text>
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <DataItem 
                    label="Revenue" 
                    value={<Text c="green.7" fw={600}>Rp 2.000.000,00</Text>} 
                  />
                  <DataItem 
                    label="Profit/Loss" 
                    value={<Text fw={600}>Rp 500.000,00</Text>} 
                  />
                </Group>
              </Stack>

              <Divider />

              {/* Payment Methods */}
              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Payment Methods
                </Text>
                <Group gap="md">
                  <Badge leftSection={<HiOutlineBanknotes size={14}/>} variant="outline" color="gray">Cash</Badge>
                  <Badge leftSection={<HiOutlineCreditCard size={14}/>} variant="outline" color="blue">Transfer Bank</Badge>
                </Group>
              </Stack>
            </Stack>
          </Card>

          {/* Card 2: Assets & Liabilities - DITAMBAHKAN shadow="sm" */}
          <Card shadow="sm" radius="md" withBorder padding="xl">
            <Stack gap="xl">
              <Text fw={700} size="lg">
                Assets & Liabilities
              </Text>

              {/* Assets */}
              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Business Assets
                </Text>
                <Group justify="space-between" align="flex-start">
                  <DataItem label="Total Assets Value" value="Rp 0,00" />
                  <DataItem label="Asset Types" value="None recorded" />
                </Group>
              </Stack>

              <Divider />

              {/* Credits & Liabilities */}
              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Credits & Liabilities
                </Text>
                <Group justify="space-between" align="flex-start">
                  <DataItem label="Total Liabilities" value="Rp 0,00" />
                  <DataItem label="Status" value="Clear" />
                </Group>
              </Stack>

              <Divider />

              {/* Other Loans */}
              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Other Loans
                </Text>
                <Group justify="space-between" align="flex-start">
                  <DataItem label="Non-KUR Loans" value="No active loans" />
                </Group>
              </Stack>
            </Stack>
          </Card>

        </Stack>
      </Container>
    </>
  );
}

export default FinancialOverview;