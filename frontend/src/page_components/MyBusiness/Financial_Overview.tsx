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
import { useEffect, useState } from "react";
import { HiExternalLink } from "react-icons/hi";
import { HiOutlineCreditCard, HiOutlineBanknotes } from "react-icons/hi2";
import { getBusinessProfile } from "../../services/businessProfileService";
import type { BusinessProfile } from "../../services/models";
import { DataItem } from "./component";

function FinancialOverview() {
  const [business, setBusiness] = useState<BusinessProfile | null>();

  // Fetch Business
  useEffect(() => {
    const fetchBusiness = async () => {
      const result = await getBusinessProfile();
      setBusiness(result);
    };
    fetchBusiness();
  }, []);

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
                    {business?.businessName}
                  </Text>
                  <Group gap="xs">
                    <Text size="sm" c="dimmed">
                      {business?.businessSector}
                    </Text>
                    <Text size="sm" c="dimmed">
                      •
                    </Text>
                    <Text size="sm" c="dimmed">
                      {business?.businessType}
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
                  <Text size="sm" fw={500}>
                    Current Status
                  </Text>
                  <Badge color="gray" variant="light">
                    None
                  </Badge>
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
                    value={
                      <Text c="green.7" fw={600}>
                        {business?.monthlyAverageIncome ?? "--"}
                      </Text>
                    }
                  />
                  <DataItem
                    label="Profit/Loss"
                    value={
                      <Text fw={600}>
                        {business?.monthlyAverageProfitLoss ?? "--"}
                      </Text>
                    }
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
                  <Badge
                    leftSection={<HiOutlineBanknotes size={14} />}
                    variant="outline"
                    color="gray"
                  >
                    Cash
                  </Badge>
                  <Badge
                    leftSection={<HiOutlineCreditCard size={14} />}
                    variant="outline"
                    color="blue"
                  >
                    Transfer Bank
                  </Badge>
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
