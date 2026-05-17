import {
  Stack,
  Text,
  Button,
  Title,
  Divider,
  SimpleGrid,
  Paper,
} from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AmortEntry } from "../../services/models";
import { getAmortEntry } from "../../services/amortService";
import { HiOutlineReply } from "react-icons/hi";
import { LineChart } from "@mantine/charts";

function Amort_Details() {
  const { id } = useParams();
  const [entry, setEntry] = useState<AmortEntry | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const data = await getAmortEntry(Number(id));
      setEntry(data);
    };
    load();
  }, [id]);

  if (!entry) return <div>Loading...</div>;

  // Sample data
  const data = [
    {
      date: "Month 1",
      Balance: 9900,
      Interest: 500,
      Principal: 1000,
    },
    {
      date: "Month 2",
      Balance: 9795,
      Interest: 495,
      Principal: 1050,
    },
    {
      date: "Month 3",
      Balance: 9684,
      Interest: 490,
      Principal: 1110,
    },
    {
      date: "Month 4",
      Balance: 9567,
      Interest: 484,
      Principal: 1170,
    },
    {
      date: "Month 5",
      Balance: 9444,
      Interest: 478,
      Principal: 1230,
    },
  ];
  return (
    <>
      <Stack>
        <Button
          w="fit-content"
          size="md"
          leftSection={<HiOutlineReply size={14} />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>

        {/* Entry Descriptions */}
        <Stack>
          <Title order={1}>{entry.title}</Title>
          <Text>Item description will be here</Text>
        </Stack>

        <Divider />
        {/* Amort Calcs */}
        <Stack gap="2rem">
          <Title>Amortization Balance Overtime</Title>
          <SimpleGrid cols={3}>
            {/* Monthly Payment */}
            <Paper withBorder p={5}>
              <Stack>
                <Text fw="bold" c="dimmed">
                  Monthly Payment
                </Text>
                <Text ml={20}>sejumlah uang dalam rp</Text>
              </Stack>
            </Paper>
            {/* Total Installment */}
            <Paper withBorder p={5}>
              <Stack>
                <Text fw="bold" c="dimmed">
                  Total Installment
                </Text>
                <Text ml={20}>Rp. {entry.total_installment}</Text>
              </Stack>
            </Paper>
            {/* Tenor Months */}
            <Paper withBorder p={5}>
              <Stack>
                <Text fw="bold" c="dimmed">
                  Tenor Month
                </Text>
                <Text ml={20}>{entry.tenor_month} bulan</Text>
              </Stack>
            </Paper>
          </SimpleGrid>
          <Paper w={500}>
            <Title>Balance Overtime</Title>
            <LineChart
              h={300}
              data={data}
              dataKey="date"
              withLegend
              series={[
                { name: "Balance", color: "indigo.6" },
                { name: "Interest", color: "blue.6" },
                { name: "Principal", color: "teal.6" },
              ]}
            />
          </Paper>
        </Stack>
      </Stack>
    </>
  );
}

export default Amort_Details;
