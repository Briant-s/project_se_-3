import {
  ActionIcon,
  Box,
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
} from "@mantine/core";
import { HiArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { AreaChart, LineChart } from "@mantine/charts";
import { BusinessCard } from "../components";
import { useState, useEffect } from "react";
import type { BusinessProfile } from "../page_components";
import { getBusinessProfile } from "../services/businessProfileService";
import { gradients, cardColors } from "../gradients";
import { getAmortsCutoff } from "../services/creditService";
import type { AmortEntry } from "../services/models";

function Eligibility_Overview() {
  const nav = useNavigate();

  const [formProgress, setFormProgress] = useState(0);
  const [business, setBusiness] = useState<BusinessProfile | null>();

  const [days, setDays] = useState(7);
  const [entries, setEntries] = useState<AmortEntry[]>([]);

  // Fetch Business
  useEffect(() => {
    const fetchBusiness = async () => {
      const result = await getBusinessProfile();
      setBusiness(result);
    };
    fetchBusiness();
  }, []);

  // Fetch days
  useEffect(() => {
    const fetchAmortsCutoff = async () => {
      const result = await getAmortsCutoff(days);
      setEntries(result);
    };
    fetchAmortsCutoff();
  }, [days]);

  const formatDate = (dateString: string | undefined) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Dashboard Texts
  const dashboardCopy = {
    hero: {
      title: "Welcome to Your Amortization Simulator Dashboard",
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
      color: cardColors.healthy,
    },
    {
      label: "Warning",
      value: 12,
      color: cardColors.warning,
    },
    {
      label: "Not Healthy",
      value: 10,
      color: cardColors.not_healthy,
    },
  ];

  const amortRows = entries.map((entry) => (
    <Paper
      key={entry.amortID}
      p="md"
      pl={0}
      radius={0}
      style={{
        borderBottom: "1px solid gray",
      }}
    >
      <Group justify="space-between">
        <Stack gap="0.05rem">
          <Text size="md">{entry.title}</Text>
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
        <ActionIcon></ActionIcon>
      </Group>
    </Paper>
  ));

  return (
    <>
      <Container fluid style={{ minWidth: 0, minHeight: 0 }}>
        <Stack gap="md">
          <SimpleGrid cols={2} autoFlow="auto-fill">
            <Card>
              <Stack>
                <Title>{dashboardCopy.hero.title}</Title>
                <Text c="dimmed">{dashboardCopy.hero.description}</Text>
              </Stack>
            </Card>
            <BusinessCard
              businessName={business?.businessName}
              businessSector={business?.businessSector}
              businessType={business?.businessType}
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
                      <Card
                        withBorder
                        style={{
                          background: cardColors.super_mikro,
                        }}
                      >
                        <Stack gap="xs">
                          <Text size="md" c="white">
                            KUR Super Mikro
                          </Text>
                          <Text size="2rem" c="white">
                            20
                          </Text>
                        </Stack>
                      </Card>
                      <Card
                        withBorder
                        style={{
                          background: cardColors.mikro,
                        }}
                      >
                        <Stack gap="xs">
                          <Text size="md" c="white">
                            KUR Mikro
                          </Text>
                          <Text size="2rem" c="white">
                            12
                          </Text>
                        </Stack>
                      </Card>
                      <Card
                        withBorder
                        style={{
                          background: cardColors.kecil,
                        }}
                      >
                        <Stack gap="xs">
                          <Text size="md" c="white">
                            KUR Kecil
                          </Text>
                          <Text size="2rem" c="white">
                            8
                          </Text>
                        </Stack>
                      </Card>
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
                      {health_stats.map((item, i) => (
                        <Card withBorder>
                          <Stack gap="sm">
                            <Text c={item.color}>{item.label}</Text>
                            <Text size="2rem" c={item.color}>
                              {item.value}
                            </Text>
                          </Stack>
                        </Card>
                        // <Box
                        //   key={i}
                        //   p={4}
                        //   style={{
                        //     background: item.color,
                        //     borderRadius: "10px",
                        //     padding: "2px",
                        //   }}
                        // >
                        //   <Box
                        //     p={12}
                        //     style={{
                        //       background: "white",
                        //       borderRadius: "10px",
                        //       height: "100%",
                        //     }}
                        //   >
                        //     <Stack gap="xs">
                        //       <Text size="md" c="black">
                        //         {item.label}
                        //       </Text>
                        //       <Text
                        //         size="2rem"
                        //         variant="gradient"
                        //         gradient={item.from}
                        //       >
                        //         {item.value}
                        //       </Text>
                        //     </Stack>
                        //   </Box>
                        // </Box>
                      ))}
                    </SimpleGrid>
                  </Stack>
                </Stack>
              </Card>
              <Card>
                <Stack>
                  <Group justify="space-between" align="center">
                    <Stack gap="0.2rem">
                      <Text size="xl">{dashboardCopy.history.title}</Text>
                      <Text c="dimmed">{dashboardCopy.history.tooltip}</Text>
                    </Stack>
                    <Group>
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
                      <Button>Add New Calculation</Button>
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
