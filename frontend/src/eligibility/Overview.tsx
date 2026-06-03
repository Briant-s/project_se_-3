import {
  ActionIcon,
  Button,
  Card,
  Container,
  Group,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Loader,
  useMantineTheme,
  Paper,
} from "@mantine/core";
import { HiOutlineReply, HiPlus } from "react-icons/hi";
import { BusinessCard } from "../components";
import { useState, useEffect } from "react";
import type { BusinessProfile } from "../services/models";
import { getBusinessProfile } from "../services/businessProfileService";
import { KURCard } from "./component";
import { useKURDaysList, useKURHealthCounts, useKURTypeCounts } from "../hooks";
import { AmortList } from "../page_components/Credit/components";
import { useAmortActions } from "../hooks/useAmortActions";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { useCreditReferences } from "../hooks/useCreditReferences";

function Eligibility_Overview() {
  const theme = useMantineTheme();

  const [days, setDays] = useState(7);

  const [editId, setEditId] = useState<number | null>(null);

  // Fetch Business
  const { business } = useBusinessProfile();
  const { creditMap } = useCreditReferences();

  const {
    openForm,
    confirmDelete,
    entries,
    loading: businessLoading,
  } = useAmortActions(setEditId, business, creditMap, editId);

  const KURTypeCounts = useKURTypeCounts(entries);
  const KURHealthCounts = useKURHealthCounts(entries);
  const daysEntries = useKURDaysList(entries, days);
  // KUR Health Count
  // const KURHealthCount = useMemo()

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // KUR User Stats
  const KUR_stats = [
    {
      label: "KUR Super Mikro",
      value: KURTypeCounts.supermikro,
      background_color: theme.other.KURColors.sm_bg,
      text_color: theme.other.KURColors.supermikro,
    },
    {
      label: "KUR Mikro",
      value: KURTypeCounts.mikro,
      background_color: theme.other.KURColors.m_bg,
      text_color: theme.other.KURColors.mikro,
    },
    {
      label: "KUR Kecil",
      value: KURTypeCounts.kecil,
      background_color: theme.other.KURColors.k_bg,
      text_color: theme.other.KURColors.kecil,
    },
  ];

  // Dashboard Texts
  const dashboardCopy = {
    hero: {
      title: "Amortization Simulator Dashboard",
      description:
        "This dashboard provides a complete overview of your simulated loan scenarios, helping you assess financial feasibility and track your recent planning activity.",
      label: "Simulation Dashboard",
      tooltip:
        "Overview of your simulated loan scenarios and recent calculations.",
    },
    overview: {
      sectionTitle: "Amortization Overview",
    },
    kurCount: {
      title: "Simulated KUR Scenarios",
      description:
        "This section breaks down your calculated simulations by tier, giving you a quick snapshot of the financing plans you've explored across KUR Super Mikro, KUR Mikro, and KUR Kecil.",
      label: "Simulated Scenarios",
      tooltip: "Breakdown of your calculated loan simulations by KUR tier.",
    },
    feasibilityCount: {
      title: "Feasibility Status Count",
      description:
        "Keep an eye on the financial viability of your planned scenarios here. This categorizes your simulations into Healthy, Warning, and Not Healthy statuses, helping you quickly identify which loan plans are safe versus risky for your business profile.",
      label: "Feasibility Status",
      tooltip:
        "Categorizes your simulated loan plans by financial risk and viability.",
    },
    history: {
      title: "Calculation History",
      description: "Review your past loan simulations and feasibility checks.",
      label: "Calculation History",
      tooltip: "A log of your previously calculated loan simulations.",
    },
    eligibility: {
      title: "KUR Eligibility",
      label: "Eligibility Check",
      tooltip:
        "Check which KUR tiers your business qualifies for based on your profile.",
    },
  };

  //  Loan Health
  const health_stats = [
    {
      label: "Healthy",
      value: KURHealthCounts.healthy,
      color: theme.other.HealthStatus.healthy,
      bg: theme.other.HealthStatus.h_bg,
    },
    {
      label: "Warning",
      value: KURHealthCounts.warning,
      color: theme.other.HealthStatus.warning,
      bg: theme.other.HealthStatus.w_bg,
    },
    {
      label: "Not Healthy",
      value: KURHealthCounts.not_healthy,
      color: theme.other.HealthStatus.not_healthy,
      bg: theme.other.HealthStatus.nh_bg,
    },
  ];

  if (businessLoading) {
    return (
      <Container fluid>
        <Stack align="center" mt="xl" gap="sm">
          <Loader />
          <Text c="dimmed">Loading eligibility overview...</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      <Container fluid style={{ minWidth: 0, minHeight: 0 }} p="xl">
        <Stack gap="md">
          <Card withBorder shadow="sm" padding="md">
            <Title order={1}>Amortization Overview</Title>
            <SimpleGrid cols={2}>
              <Card bg="white" shadow="none">
                <Stack gap="lg">
                  {/* AMORT KUR COUNT */}
                  <Stack>
                    <Stack gap="0.2rem">
                      <Text size="xl">{dashboardCopy.kurCount.label}</Text>
                      <Text c="dimmed">{dashboardCopy.kurCount.tooltip}</Text>
                    </Stack>
                    <SimpleGrid
                      cols={{ base: 3, sm: 3 }}
                      autoFlow="auto-fill"
                      h="100%"
                    >
                      {KUR_stats.map((s, i) => (
                        <KURCard key={i} {...s} />
                      ))}
                    </SimpleGrid>
                  </Stack>
                  {/* HEALTHY LOAN COUNT */}
                  <Stack>
                    <Stack gap="0.2rem">
                      <Text size="xl">
                        {dashboardCopy.feasibilityCount.title}
                      </Text>
                      <Text c="dimmed">
                        {dashboardCopy.feasibilityCount.tooltip}
                      </Text>
                    </Stack>
                    <SimpleGrid cols={{ base: 3, sm: 3 }} autoFlow="auto-fill">
                      {health_stats.map((item) => (
                        <Card
                          withBorder
                          style={{
                            borderLeft: `8px solid ${item.color}`,
                            background: item.bg,
                            height: "100%",
                            // boxShadow: "0 1px 10px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <Stack gap="sm" justify="space-between">
                            <Text c={item.color}>{item.label}</Text>
                            <Text size="2rem" c={item.color}>
                              {item.value}
                            </Text>
                          </Stack>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </Stack>
                </Stack>
              </Card>
              <Card bg="white" shadow="none">
                <Stack>
                  <Group justify="space-between" align="flex-end">
                    <Stack gap="0.2rem">
                      <Text size="xl">{dashboardCopy.history.title}</Text>
                      <Text c="dimmed">{dashboardCopy.history.tooltip}</Text>
                    </Stack>
                    <Group align="flex-end">
                      <Select
                        label="Sort by Date Created"
                        placeholder="Pick Day Range"
                        defaultValue="7"
                        onChange={(val) => setDays(parseInt(val ?? "0"))}
                        data={[
                          { value: "1", label: "Last 1 Day" },
                          { value: "3", label: "Last 3 Day" },
                          { value: "7", label: "Last 7 Day" },
                          { value: "0", label: "All Time" },
                        ]}
                      />
                      <Button
                        bg={theme.primaryColor}
                        leftSection={<HiPlus />}
                        onClick={() => openForm()}
                      >
                        New Calculation
                      </Button>
                    </Group>
                  </Group>
                  <Card p={0}>
                    <ScrollArea h={400}>
                      {entries.length === 0 ? (
                        <Text c="dimmed" ta="center" py="xl">
                          Belum ada data. Tambahkan pinjaman baru.
                        </Text>
                      ) : (
                        <AmortList
                          entries={daysEntries}
                          openForm={openForm}
                          confirmDelete={confirmDelete}
                          compact
                        />
                      )}
                    </ScrollArea>
                  </Card>
                </Stack>
              </Card>
            </SimpleGrid>
          </Card>
        </Stack>
      </Container>
    </>
  );
}

export default Eligibility_Overview;
