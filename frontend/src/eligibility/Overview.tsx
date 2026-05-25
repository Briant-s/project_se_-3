import {
  ActionIcon,
  Button,
  Card,
  Container,
  Group,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Loader,
  useMantineTheme,
} from "@mantine/core";
import { HiOutlineReply, HiPlus } from "react-icons/hi";
import { BusinessCard } from "../components";
import { useState, useEffect, useMemo } from "react";
import type { BusinessProfile } from "../services/models";
import { getBusinessProfile } from "../services/businessProfileService";
import { getAmortsCutoff } from "../services/creditService";
import type { AmortEntry } from "../services/models";
import { KURBadge, KURCard } from "./component";
import { getAmortEntries } from "../services/amortService";

function Eligibility_Overview() {
  const theme = useMantineTheme();
  const [business, setBusiness] = useState<BusinessProfile | null>();

  const [days, setDays] = useState(7);
  const [entries, setEntries] = useState<AmortEntry[]>([]);

  const [businessLoading, setBusinessLoading] = useState(true);
  const [amortsLoading, setAmortsLoading] = useState(true);

  // Fetch Business
  useEffect(() => {
    const fetchBusiness = async () => {
      setBusinessLoading(true);
      try {
        const result = await getBusinessProfile();
        setBusiness(result);
      } catch (error) {
        console.error(error);
      } finally {
        setBusinessLoading(false);
      }
    };
    fetchBusiness();
  }, []);

  // Fetch Amort Entries
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const result = await getAmortEntries();
      setEntries(result);
    } catch (error) {
      console.error("Failed to load amort entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const KUR_TYPE_MAP = {
    1: "supermikro",
    2: "mikro",
    3: "kecil",
    4: "supermikro",
    5: "mikro",
    6: "kecil",
  };

  // Days Entries
  const daysEntries = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return entries.filter((entry) => new Date(entry.created_at) >= cutoff);
  }, [entries, days]);

  //  KUR Type Count
  const KURTypeCounts = useMemo(() =>
    entries.reduce(
      (acc, entry) => {
        const type = KUR_TYPE_MAP[entry.creditID];
        if (type) acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      { supermikro: 0, mikro: 0, kecil: 0 },
    ),
  );

  // KUR Health Count
  // const KURHealthCount = useMemo()

  // Fetch days
  useEffect(() => {
    const fetchAmortsCutoff = async () => {
      setAmortsLoading(true); // <-- Nyalakan sebelum fetch
      try {
        const result = await getAmortsCutoff(days);
        setEntries(result);
      } catch (error) {
        console.error(error);
      } finally {
        setAmortsLoading(false); // <-- Matikan setelah selesai
      }
    };
    fetchAmortsCutoff();
  }, [days]);

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
      value: 20,
      background_color: theme.other.KURColors.sm_bg,
      text_color: theme.other.KURColors.supermikro,
    },
    {
      label: "KUR Mikro",
      value: 12,
      background_color: theme.other.KURColors.m_bg,
      text_color: theme.other.KURColors.mikro,
    },
    {
      label: "KUR Kecil",
      value: 8,
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
      value: 20,
      color: theme.other.HealthStatus.healthy,
      bg: theme.other.HealthStatus.h_bg,
    },
    {
      label: "Warning",
      value: 12,
      color: theme.other.HealthStatus.warning,
      bg: theme.other.HealthStatus.w_bg,
    },
    {
      label: "Not Healthy",
      value: 10,
      color: theme.other.HealthStatus.not_healthy,
      bg: theme.other.HealthStatus.nh_bg,
    },
  ];

  const amortRows = entries.map((entry) => (
    <Paper
      key={entry.amortID}
      p="md"
      radius={0}
      bg="transparent"
      style={{
        borderBottom: "1px solid gray",
      }}
    >
      <Group justify="space-between">
        <Stack gap="0.05rem">
          <Group>
            <Text size="md">{entry.title}</Text>
            <KURBadge type={entry.creditID ?? 0} />
          </Group>
          <Text size="xs" c="dimmed">
            {formatDate(entry.created_at)}
          </Text>
        </Stack>
        <Stack gap="0.05rem">
          <Text>{entry.totalInstallment}</Text>
          <Text size="xs" c="dimmed">
            Total Installment
          </Text>
        </Stack>
        <Stack gap="0.05rem">
          <Text size="md">{entry.principalAmount}</Text>
          <Text size="xs" c="dimmed">
            Principal Amount
          </Text>
        </Stack>
        <Stack gap="0.05rem">
          <Text size="md">{entry.tenorMonth}</Text>
          <Text size="xs" c="dimmed">
            Tenor Months
          </Text>
        </Stack>
        <ActionIcon>
          <HiOutlineReply style={{ transform: "scaleX(-1)" }} />
        </ActionIcon>
      </Group>
    </Paper>
  ));

  if (businessLoading || amortsLoading) {
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
      <Container fluid style={{ minWidth: 0, minHeight: 0 }}>
        <Stack gap="md">
          <SimpleGrid cols={2} autoFlow="auto-fill">
            <Card>
              <Stack>
                <Text size="40px">{dashboardCopy.hero.title}</Text>
                {/* <Text c="dimmed">{dashboardCopy.hero.description}</Text> */}
              </Stack>
            </Card>
            <BusinessCard
              businessName={business?.businessName ?? undefined}
              businessSector={business?.businessSector ?? undefined}
              businessType={business?.businessType ?? undefined}
            />
          </SimpleGrid>

          <Card withBorder>
            <Title order={1}>Amortization Overview</Title>
            <SimpleGrid cols={2}>
              <Card>
                <Stack gap="lg">
                  {/* AMORT KUR COUNT */}
                  <Stack>
                    <Stack gap="0.2rem">
                      <Text size="xl">{dashboardCopy.kurCount.label}</Text>
                      <Text c="dimmed">{dashboardCopy.kurCount.tooltip}</Text>
                    </Stack>
                    <SimpleGrid cols={{ base: 3, sm: 3 }} autoFlow="auto-fill">
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
                            // boxShadow: "0 1px 10px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <Stack gap="sm">
                            <Group justify="space-between">
                              <Text c={item.color}>{item.label}</Text>
                              <ActionIcon
                                bg="white"
                                variant="outline"
                                color="black"
                              >
                                <HiOutlineReply
                                  color="black"
                                  style={{ transform: "scaleX(-1)" }}
                                />
                              </ActionIcon>
                            </Group>
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
              <Card>
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
                        data={[
                          { value: "1", label: "Last 1 Day" },
                          { value: "3", label: "Last 3 Day" },
                          { value: "7", label: "Last 7 Day" },
                        ]}
                      />
                      <Button bg={theme.primaryColor} leftSection={<HiPlus />}>
                        New Calculation
                      </Button>
                    </Group>
                  </Group>
                  <Card withBorder>
                    <ScrollArea h={400}>
                      {entries.length === 0 ? (
                        <Text c="dimmed" ta="center" py="xl">
                          Belum ada data. Tambahkan pinjaman baru.
                        </Text>
                      ) : (
                        amortRows
                      )}
                    </ScrollArea>
                  </Card>
                </Stack>
              </Card>
            </SimpleGrid>
          </Card>
          <Card withBorder>
            <Stack gap="0.2rem">
              <Title>{dashboardCopy.eligibility.title}</Title>
              <Text c="dimmed">{dashboardCopy.eligibility.tooltip}</Text>
            </Stack>
            <SimpleGrid cols={3}>
              <Card>KUR Super Mikro</Card>
              <Card>KUR Mikro</Card>
              <Card>KUR Kecil</Card>
            </SimpleGrid>
          </Card>
        </Stack>
      </Container>
    </>
  );
}

export default Eligibility_Overview;
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
