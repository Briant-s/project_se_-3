import {
  ActionIcon,
  Badge,
  Button,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  Paper,
  SimpleGrid,
  Card,
  ColorSwatch,
  Flex,
  Loader,
  useMantineTheme,
} from "@mantine/core";
import {
  HiOutlinePlus,
  HiPencil,
  HiTrash,
  HiOutlineReply,
  HiPlus,
} from "react-icons/hi";
import { FaArrowTrendDown } from "react-icons/fa6";
import { modals } from "@mantine/modals";
import type { AmortEntry } from "../../services/models";
import {
  getAmortEntries,
  createAmortEntry,
  updateAmortEntry,
  deleteAmortEntry,
} from "../../services/amortService";
import { AmortList, TrendIndicator } from "./components";
import { useAmortModal, useKURTypeCounts } from "../../hooks";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AmortForm from "./AmortForm";
import { DonutChart } from "@mantine/charts";
import { useAmortActions } from "../../hooks/useAmortActions";
import { useBusinessProfile } from "../../hooks/useBusinessProfile";
import { useCreditReferences } from "../../hooks/useCreditReferences";
import { useLoanSummaryMetrics } from "../../hooks/useLoanSumMetrics";
import { formatPercent, formatRupiah } from "../../utils/globalFormatter";
import {
  getDtiColor,
  getFeasibilityColor,
  getSurplusColor,
} from "../../utils/getColors";

function Amort_Calc() {
  const theme = useMantineTheme();
  const [editId, setEditId] = useState<number | null>(null);
  const navigate = useNavigate();

  const { business } = useBusinessProfile();
  const { creditMap } = useCreditReferences();
  const { openForm, confirmDelete, entries, loading } = useAmortActions(
    setEditId,
    business,
    creditMap,
    editId,
  );

  const metrics = useLoanSummaryMetrics(entries, business);

  const KURTypeCounts = useKURTypeCounts(entries);

  // User KUR Amount
  const KURAmount = [
    {
      name: "Super Mikro",
      value: KURTypeCounts.supermikro,
      color: theme.other.KURColors.supermikro,
    },
    {
      name: "Mikro",
      value: KURTypeCounts.mikro,
      color: theme.other.KURColors.mikro,
    },
    {
      name: "Kecil",
      value: KURTypeCounts.kecil,
      color: theme.other.KURColors.kecil,
    },
  ];

  if (loading) {
    return (
      <Container fluid>
        <Stack align="center" mt="xl" gap="sm">
          <Loader />
          <Text c="dimmed">Loading loan calculator...</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Stack gap="md" m="xl">
        <Group justify="space-between">
          <Text fw={700} size="xl">
            Loan Simulations
          </Text>
          <Button
            bg={theme.primaryColor}
            leftSection={<HiPlus size={14} />}
            onClick={() => openForm()}
          >
            Add New Loan Calculation
          </Button>
        </Group>
        <SimpleGrid cols={3} autoFlow="auto-fill">
          {/* KUR Preference Distribution */}
          <Card h="auto" withBorder shadow="sm">
            <Stack>
              <Text>KUR Preference Distribution</Text>
              <SimpleGrid cols={{ base: 2 }} autoFlow="auto-fill">
                <Card withBorder shadow="none">
                  <Stack>

                    {KURAmount.map((item) => (
                      <Group key={item.name} justify="space-between" wrap="nowrap">
                        <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                          <ColorSwatch color={item.color} size={10} style={{ flexShrink: 0 }} />
                          <Text size="sm">{item.name}</Text>
                        </Group>
                        <Text size="sm" fw={700}>
                          {item.value}
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                </Card>
                <Card p="xs" shadow="none">
                  <Flex justify="center" align="center" h="100%">
                    <DonutChart
                      data={KURAmount}
                      thickness={20}
                      strokeWidth={5}
                      size={100}
                      withTooltip={false}
                    />
                  </Flex>
                </Card>
              </SimpleGrid>
            </Stack>
          </Card>
          {/* Loan Summary */}
          <Card withBorder shadow="sm">
            <Stack>
              <Text c="dimmed">Loan Summary</Text>
              {/* Average Loan Requested*/}
              <Stack gap="0.2rem">
                <Text fz="xs" tt="uppercase" c="dimmed" fw={700}>
                  Average Loan Requested
                </Text>
                <Stack gap="0.1rem">
                  <Group align="flex-end" gap="xs">
                    <Text fz="lg" fw={500}>
                      {formatRupiah(metrics.averageLoanRequested)}
                    </Text>
                    <Text c="red" fw={700}>
                      <TrendIndicator
                        value={metrics.loanToRevenueRatio}
                        semantic="higher-is-worse"
                        threshold={50}
                      />
                    </Text>
                  </Group>
                  <Text fz="xs" c="dimmed" fw={700}>
                    Compared to Average Monthly Revenue
                  </Text>
                </Stack>
              </Stack>
              {/* Total Loan Amount */}
              <Stack gap="0.2rem">
                <Text fz="xs" tt="uppercase" c="dimmed" fw={700}>
                  Total Loan Amount
                </Text>
                <Text fz="lg" fw={500}>
                  {formatRupiah(metrics.totalLoanAmount)}
                </Text>
              </Stack>
            </Stack>
          </Card>
          {/* Repayment Health Overview */}
          <Card withBorder shadow="sm">
            <Stack>
              <Text>Repayment Health Overview</Text>
              <Stack gap="2rem">
                {/* Feasible Simulations */}
                <Group justify="space-between">
                  <Text fz="xs" tt="uppercase" c="dimmed" fw={700}>
                    feasible simulations
                  </Text>
                  <Badge
                    color={getFeasibilityColor(
                      metrics.feasibleCount,
                      metrics.totalSimulations,
                    )}
                    variant="light"
                    size="lg"
                  >
                    {metrics.feasibleCount} / {metrics.totalSimulations}
                  </Badge>
                </Group>

                {/* Avg Surplus After Payment */}
                <Group justify="space-between">
                  <Text fz="xs" tt="uppercase" c="dimmed" fw={700}>
                    Avg Surplus After Payment
                  </Text>
                  <Badge
                    color={getSurplusColor(metrics.avgSurplus)}
                    variant="light"
                    size="lg"
                  >
                    {formatRupiah(metrics.avgSurplus)}
                  </Badge>
                </Group>

                {/* Avg Debt-To-Income */}
                <Group justify="space-between">
                  <Text fz="xs" tt="uppercase" c="dimmed" fw={700}>
                    Debt-to-Income Ratio
                  </Text>
                  <Badge
                    color={getDtiColor(metrics.avgDti)}
                    variant="light"
                    size="lg"
                  >
                    {formatPercent(metrics.avgDti)}
                  </Badge>
                </Group>
              </Stack>
            </Stack>
          </Card>
        </SimpleGrid>
        <Divider />

        <Stack gap="sm">
          <AmortList
            entries={entries}
            openForm={openForm}
            confirmDelete={confirmDelete}
          ></AmortList>
        </Stack>
      </Stack>
    </Container>
  );
}

export default Amort_Calc;
