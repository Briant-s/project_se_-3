import { Card, Container, Group, SimpleGrid, Stack, Text, Title, ThemeIcon } from "@mantine/core";
import { HiIdentification, HiChartPie, HiCalculator, HiClipboardDocumentList, HiHeart, HiArrowRight } from "react-icons/hi2";
import { Link } from "react-router-dom";

const dashboardItems = [
  {
    title: "Business Profile",
    description: "Update your business profile and information for more accurate credit results.",
    path: "/my-business/business-profile",
    icon: HiIdentification,
    color: "blue",
  },
  {
    title: "Eligibility Overview",
    description: "View a general KUR eligibility simulation for your business.",
    path: "/credit/eligibility-overview",
    icon: HiChartPie,
    color: "grape",
  },
  {
    title: "Loan Calculator",
    description: "Simulate installments and credit calculations for a clear repayment plan.",
    path: "/credit/amort-calc",
    icon: HiCalculator,
    color: "orange",
  },
  {
    title: "Business Proposal",
    description: "Manage your business proposals and view the list of created proposals.",
    path: "/business-proposal/list",
    icon: HiClipboardDocumentList,
    color: "cyan",
  },
  // {
  //   title: "Financial Health",
  //   description: "Monitor your business financial health to ensure credit readiness.",
  //   path: "/financial-health",
  //   icon: HiHeart,
  //   color: "red",
  // },
  {
    title: "Available KUR Types",
    description: "See KUR recommendations best suited to your business profile and needs.",
    path: "/credit/eligibility-quiz",
    icon: HiHeart,
    color: "red",
  },
];

function Dashboard() {
  return (
    <Container fluid style={{ minWidth: 0, minHeight: 0 }} p="xl">
      <Stack gap="xl">
        <Stack style={{ maxWidth: 760, gap: 10 }}>
          <Title order={1}>Dashboard</Title>
          <Text c="dimmed" size="md">
            Use this dashboard to quickly access important pages and explore the main PoestaKas features.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {dashboardItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                component={Link}
                to={item.path}
                withBorder
                radius="md"
                shadow="sm"
                p="lg"
                style={{ textDecoration: "none", transition: "transform 150ms ease, box-shadow 150ms ease" }}
              >
                <Group position="apart" align="flex-start">
                  <ThemeIcon radius="xl" size="lg" color={item.color}>
                    <Icon size={20} />
                  </ThemeIcon>
                  <ThemeIcon radius="xl" size="lg" variant="light">
                    <HiArrowRight size={18} />
                  </ThemeIcon>
                </Group>
                <Stack mt="md" spacing={6}>
                  <Text size="lg" fw={700}>
                    {item.title}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {item.description}
                  </Text>
                </Stack>
              </Card>
            );
          })}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}

export default Dashboard;
