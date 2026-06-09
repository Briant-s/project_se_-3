import {
  Card,
  Stack,
  Group,
  Text,
  Divider,
  SimpleGrid,
  ActionIcon,
} from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AmortEntry } from "../../services/models";
import { getAmortEntry } from "../../services/amortService";
import { HiOutlineReply } from "react-icons/hi";
import { MetricCard } from "./components/MetricCard";
import { formatRupiah } from "../../utils/globalFormatter";
import { AmortBadge } from "./components/AmortBadge";
import { generateChartData } from "../../utils/amort/generateChartData";
import { useBusinessProfile } from "../../hooks/useBusinessProfile";
import { useCreditReferences } from "../../hooks/useCreditReferences";
import { FeasibilityChart } from "./components/AmortChart";
import KURBadge from "../../eligibility/component/KURBadge";
import { HealthBadge } from "../../eligibility/component";
import { AdvisoryCard } from "./components/AdvisoryCard";

function Amort_Details() {
  const { id } = useParams();
  const [entry, setEntry] = useState<AmortEntry | null>(null);

  const { business } = useBusinessProfile();
  const { creditMap } = useCreditReferences();

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await getAmortEntry(Number(id));
      setEntry(data);
    };
    load();
  }, [id]);

  if (!entry) return <div>Loading...</div>;

  const interestRate = entry.creditID
    ? creditMap[entry.creditID]?.interestRatePerYear
    : undefined;

  const chartDataArray = generateChartData(
    entry.principalAmount,
    entry.tenorMonth,
    interestRate,
    entry.pmt,
    business?.monthlyAverageIncome,
  );

  const healthStatus = (entry.health_status || "warning") as
    | "healthy"
    | "warning"
    | "not_healthy";

  // 2. Set dynamic subtitle text based on your strict 30/50 thresholds
  const dbrSubtext =
    healthStatus === "healthy"
      ? "Aman (≤ 30%)"
      : healthStatus === "warning"
        ? "Waspada (31% - 50%)"
        : "Berisiko (> 50%)";

  return (
    <>
      <Stack p="md">
        <Group>
          <ActionIcon variant="filled" radius="md" onClick={() => navigate(-1)}>
            <HiOutlineReply style={{ transform: "scaleX(1)" }} />
          </ActionIcon>
          <Text fw={700}>Loan Eligibility Analysis UMKM</Text>
        </Group>
        <Group justify="space-between">
          {/* Amort Title */}
          <Stack gap="0.5rem">
            <Text size="xl" fw={700}>
              {entry.title}
            </Text>
            <Group gap="0.5rem">
              <KURBadge type={entry.creditID ?? 0} />
              <HealthBadge type={entry.health_status ?? "healthy"} />
            </Group>
          </Stack>
          {/* Health Badge with status and dbr */}
          <AmortBadge status={healthStatus} dbrPercent={entry.dbr ?? 0} />
        </Group>
        <Divider my="md" />
        {/* 4 Amort Cards */}
        <Stack gap="0.5rem">
          <Text size="sm" c="dimmed">
            Simulation Metrics
          </Text>
          <SimpleGrid cols={4}>
            <MetricCard
              label="Principal Amount"
              value={formatRupiah(entry.principalAmount)}
              sub={`${entry.tenorMonth} months`}
              variant="default"
            />
            <MetricCard
              label="Installment / Month"
              value={formatRupiah(entry.pmt)}
              sub="PMT"
              variant={healthStatus}
            />
            <MetricCard
              label="Total Interest"
              value={formatRupiah(entry.totalInterest)}
              sub={`${(interestRate || 0) * 100}% p.a`}
              variant="default"
            />
            <MetricCard
              label="Debt Burden Ratio"
              value={`${entry.dbr}%`}
              sub={dbrSubtext}
              variant={healthStatus}
            />
          </SimpleGrid>
        </Stack>
        <Card withBorder shadow="sm">
          <Stack>
            <Text c="dimmed" size="sm">
              Amortization Chart
            </Text>

            <FeasibilityChart
              data={chartDataArray}
              isFeasible={entry.isFeasible ?? false}
            />
          </Stack>
          <AdvisoryCard
            status={healthStatus}
            dbrPercent={entry.dbr}
            pmt={entry.pmt}
            totalInterest={entry.totalInterest}
            avgMonthlyIncome={business?.monthlyAverageIncome}
            tenorMonth={entry.tenorMonth}
            principalAmount={entry.principalAmount}
            maxSafePrincipal={entry.maxSafePrincipal}
            safeExtendedTenor={entry.SafeExtendedTenor}
          />
        </Card>
      </Stack>
    </>
  );
}

export default Amort_Details;
