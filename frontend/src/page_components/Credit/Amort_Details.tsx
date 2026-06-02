import { Stack, Group, Text, Divider, SimpleGrid } from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AmortEntry } from "../../services/models";
import { getAmortEntry } from "../../services/amortService";
import { HiOutlineReply } from "react-icons/hi";
import { LineChart } from "@mantine/charts";
import { MetricCard } from "./components/MetricCard";
import { formatRupiah } from "../../utils/globalFormatter";
import { AmortBadge } from "./components/AmortBadge";
import { generateChartData } from "../../utils/amort/generateChartData";
import { useBusinessProfile } from "../../hooks/useBusinessProfile";
import { useCreditReferences } from "../../hooks/useCreditReferences";
import { FeasibilityChart } from "./components/AmortChart";

function Amort_Details() {
  const { id } = useParams();
  const [entry, setEntry] = useState<AmortEntry | null>(null);

  const { business } = useBusinessProfile();
  const { creditMap } = useCreditReferences();

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

  return (
    <>
      <Stack>
        <Text>Title</Text>
        <Group justify="space-between">
          {/* Amort Title */}
          <Text fw={700}>{entry.title}</Text>
          {/* Health Badge with status and dbr */}
          <AmortBadge isFeasible={true} dbrPercent={entry.dbr} />
        </Group>
        <Divider my="md" />
        {/* 4 Amort Cards */}
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
            variant={entry.isFeasible ? "default" : "warning"}
          />
          <MetricCard
            label="Total Interest"
            value={formatRupiah(entry.totalInterest)}
            sub="test"
            variant="default"
          />
          <MetricCard
            label="Debt Burden Ratio"
            value={`${entry.dbr}%`}
            sub={entry.isFeasible ? "Aman <= 40%" : "Melebihi 40%"}
            variant="success"
          />
        </SimpleGrid>
        <FeasibilityChart data={chartDataArray} isFeasible={entry.isFeasible} />
      </Stack>
    </>
  );
}

export default Amort_Details;
