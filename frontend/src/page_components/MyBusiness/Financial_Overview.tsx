import {
  ActionIcon,
  Avatar,
  Box,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { HiExternalLink } from "react-icons/hi";
import { BackButton } from "../../components";

function FinancialOverview() {
  return (
    <>
      <Container fluid>
        <Stack>
          <BackButton />
          <Card withBorder>
            <Group justify="space-between">
              <Group>
                <Avatar radius="lg" />
                <Group>
                  <Text>Business Name</Text>
                  <Text size="sm" c="dimmed">
                    Sector
                  </Text>
                  <Text size="sm" c="dimmed">
                    Type
                  </Text>
                </Group>
              </Group>
              <ActionIcon>
                <HiExternalLink />
              </ActionIcon>
            </Group>
          </Card>
          <Text size="lg" fw={700}>
            Financial Overview
          </Text>
          <Stack>
            <Card withBorder>
              <Group>
                <Text>Active KUR Loan:</Text>
                {/* Get User KUR Loan Here */}
                <Text c="dimmed">None</Text>
              </Group>
            </Card>
          </Stack>
          <SimpleGrid cols={2}>
            <SimpleGrid cols={1}>
              {/* Financial Performance Card */}
              <Card withBorder>
                <Stack>
                  <Text>Monthly Performance</Text>
                  {/* Profit/Loss */}
                  <Group justify="space-between">
                    <Text c="dimmed">Profit/Loss</Text>

                    <Text>Rp 500.000,00</Text>
                  </Group>
                  {/* Revenue */}
                  <Group justify="space-between">
                    <Text c="dimmed">Revenue</Text>
                    <Text>Rp 2.000.000,00</Text>
                  </Group>
                </Stack>
              </Card>
              {/* Payment Methods */}
              <Card withBorder>
                <Text>Payment Methods</Text>
              </Card>
              {/* Other KUR Loan */}
              <Card withBorder>
                <Text>Other Loans</Text>
              </Card>
            </SimpleGrid>
            <SimpleGrid cols={1}>
              {/* Business Assets */}
              <Card withBorder>
                <Text>Assets</Text>
              </Card>
              {/* Business Liabilities */}
              <Card withBorder>
                <Text>Credits & Liabilities</Text>
              </Card>
            </SimpleGrid>
          </SimpleGrid>
        </Stack>
      </Container>
    </>
  );
}

export default FinancialOverview;
