import {
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { HiArrowRight } from "react-icons/hi";
import { AreaChart, LineChart } from "@mantine/charts";

function Eligibility_Overview() {
  const loan_data = [
    {
      month: 1,
      revenue: 15000000,
      installment: 8884000,
      netAfterInstallment: 6116000,
    },
    {
      month: 2,
      revenue: 16000000,
      installment: 8884000,
      netAfterInstallment: 7116000,
    },
    {
      month: 3,
      revenue: 14000000,
      installment: 8884000,
      netAfterInstallment: 5116000,
    },
    {
      month: 4,
      revenue: 12000000,
      installment: 8884000,
      netAfterInstallment: 3116000,
    },
    {
      month: 5,
      revenue: 9500000,
      installment: 8884000,
      netAfterInstallment: 616000,
    },
    {
      month: 6,
      revenue: 7000000,
      installment: 8884000,
      netAfterInstallment: -1884000,
    },
    {
      month: 7,
      revenue: 10500000,
      installment: 8884000,
      netAfterInstallment: 1616000,
    },
    {
      month: 8,
      revenue: 13000000,
      installment: 8884000,
      netAfterInstallment: 4116000,
    },
    {
      month: 9,
      revenue: 18000000,
      installment: 8884000,
      netAfterInstallment: 9116000,
    },
    {
      month: 10,
      revenue: 20000000,
      installment: 8884000,
      netAfterInstallment: 11116000,
    },
    {
      month: 11,
      revenue: 22000000,
      installment: 8884000,
      netAfterInstallment: 13116000,
    },
    {
      month: 12,
      revenue: 25000000,
      installment: 8884000,
      netAfterInstallment: 16116000,
    },
  ];

  return (
    <>
      <Container fluid style={{ minWidth: 0, minHeight: 0 }}>
        <Stack>
          <SimpleGrid cols={2}>
            <Card bg="gray.4">Halo</Card>

            <SimpleGrid>
              <Card bg="teal.4" m={10}>
                <Stack gap="0.5rem">
                  {/* <Group>
                  <Text>Loan Progress Chart</Text>
                </Group>
                <LineChart
                  // m={10}
                  p={5}
                  h={300}
                  withLegend
                  legendProps={{
                    verticalAlign: "bottom",
                    height: 50,
                    align: "center",
                  }}
                  data={loan_data}
                  dataKey="month"
                  series={[
                    { name: "revenue", color: "blue.5" },
                    { name: "installment", color: "indigo.5" },
                    { name: "netAfterInstallment", color: "teal.5" },
                  ]}
                  curveType="linear"
                  tickLine="x"
                ></LineChart> */}
                  <Text size="md" fw={700}>
                    Loan Eligibility
                  </Text>
                  <Stack gap="0.2rem">
                    <Text fw={700} c="white">
                      Loan is payable next month
                    </Text>
                    <Text size="xl" fw={700}>
                      Rp. 1.7000.000,00
                    </Text>
                  </Stack>
                  <Button
                    justify="space-between"
                    rightSection={<HiArrowRight />}
                  >
                    See Monthly Chart
                  </Button>
                </Stack>
              </Card>
              <Card bg="orange.4" m={10}>
                <Stack gap="0.2rem">
                  <Group>
                    <Text size="lg" fw={700}>
                      Cash Buffer
                    </Text>
                  </Group>
                  <Stack gap="0.2rem">
                    <Text fw={700} c="white">
                      Buffer cash is running low
                    </Text>
                    <Group gap="0.4rem">
                      <Text size="lg" c="dimmed" fw={700}>
                        Rp. 500.000,00
                      </Text>
                      <Text size="lg" fw={700}>
                        {" "}
                        /{" "}
                      </Text>
                      <Text size="lg" fw={700}>
                        Rp. 1.000.000,00
                      </Text>
                    </Group>
                  </Stack>
                  <Button
                    justify="space-between"
                    rightSection={<HiArrowRight />}
                  >
                    See Buffer Chart
                  </Button>
                  {/* <AreaChart
                  h={300}
                  type="stacked"
                  data={loan_data}
                  dataKey="month"
                  series={[
                    { name: "revenue", color: "blue.5" },
                    { name: "installment", color: "indigo.5" },
                    { name: "netAfterInstallment", color: "teal.5" },
                  ]}
                  withLegend
                  legendProps={{
                    verticalAlign: "bottom",
                    height: 50,
                    align: "center",
                  }}
                  curveType="natural"
                  withDots={false}
                ></AreaChart> */}
                </Stack>
              </Card>
            </SimpleGrid>
          </SimpleGrid>
        </Stack>
      </Container>
    </>
  );
}

export default Eligibility_Overview;
