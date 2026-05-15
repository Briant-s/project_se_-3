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
import type { AmortEntry, AmortFormValues } from "../../services/models";
import {
  getAmortEntries,
  createAmortEntry,
  updateAmortEntry,
  deleteAmortEntry,
} from "../../services/amortService";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AmortForm from "./AmortForm";
import { gradients } from "../../gradients";
import { BarChart, DonutChart } from "@mantine/charts";

function Amort_Calc() {
  const [entries, setEntries] = useState<AmortEntry[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const navigate = useNavigate();

  const CREDIT_TYPE: Record<number, string> = {
    1: "KUR Super Mikro",
    2: "KUR Mikro",
    3: "KUR Kecil",
  };

  useEffect(() => {
    const loadEntries = async () => {
      const result = await getAmortEntries();
      setEntries(result);
    };
    loadEntries();
  }, []);

  async function fetchEntries() {
    const result = await getAmortEntries();
    setEntries(result);
  }

  async function handleSubmit(entry: AmortFormValues, editId: number | null) {
    if (editId !== null) {
      await updateAmortEntry(editId, entry);
      setEditId(null);
    } else {
      await createAmortEntry(entry);
    }
    modals.closeAll();
    fetchEntries();
  }

  async function handleDelete(amort_id: number) {
    try {
      await deleteAmortEntry(amort_id);
      await fetchEntries();
    } catch (err) {
      console.error(err);
    }
  }

  function confirmDelete(amort_id: number, title: string) {
    modals.openConfirmModal({
      title: <Text fw={700}>Loan Deletion Warning</Text>,
      children: (
        <Text size="sm">
          Are you sure you want to delete <b>{title}</b>? This action can't be
          reversed.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => handleDelete(amort_id),
    });
  }

  const openForm = (entry?: AmortEntry) => {
    if (entry) {
      setEditId(entry.amortID!);
    } else {
      setEditId(null);
    }
    modals.open({
      title: entry ? "Edit Calculation" : "Add New Calculation",
      children: (
        <AmortForm
          editId={entry?.amortID ?? null}
          onSubmit={handleSubmit}
          initialValues={
            entry
              ? {
                  title: entry.title,
                  tenorMonth: entry.tenorMonth,
                  totalInstallment: entry.totalInstallment,
                  principalAmount: entry.principalAmount,
                }
              : undefined
          }
        />
      ),
    });
  };

  // User KUR Amount
  const KURAmount = [
    { name: "Super Mikro", value: 20, color: "red" },
    { name: "Mikro", value: 10, color: "blue" },
    { name: "Kecil", value: 2, color: "green" },
  ];

  const AmortRows = entries.map((entry) => (
    <Paper
      key={entry.amortID}
      //withBorder
      shadow="sm"
      p="md"
      radius="md"
      style={{ borderLeft: "4px solid #228be6" }}
    >
      <Group justify="space-between" align="center">
        {/* Kiri: Info utama */}
        <Stack gap={2}>
          <Text fw={700} size="lg" c="blue">
            {entry.title}
          </Text>
          <Group gap="xs">
            <Text size="sm" c="dimmed">
              {CREDIT_TYPE[entry.creditID ?? 0]}
            </Text>
            <Text size="sm" c="dimmed">
              •
            </Text>
            <Text size="sm" c="blue">
              {entry.tenorMonth} bulan
            </Text>
          </Group>
        </Stack>

        {/* Kanan: Angka + Actions */}
        <Group gap="xl" align="center">
          <Stack gap={2} align="flex-end">
            <Text size="sm" c="dimmed">
              ~Rp{" "}
              {(entry.totalInstallment / entry.tenorMonth).toLocaleString(
                "id-ID",
              )}{" "}
              / bulan
            </Text>
            <Text size="xs" c="dimmed">
              Rp {entry.totalInstallment.toLocaleString("id-ID")}
            </Text>
          </Stack>

          <Group gap="xs">
            <ActionIcon
              variant="filled"
              radius="md"
              onClick={() => openForm(entry)}
            >
              <HiPencil />
            </ActionIcon>
            <ActionIcon
              variant="filled"
              radius="md"
              onClick={() => confirmDelete(entry.amortID!, entry.title)}
            >
              <HiTrash />
            </ActionIcon>
            <ActionIcon
              variant="filled"
              radius="md"
              onClick={() => navigate(`/credit/amort-calc/${entry.amortID}`)}
            >
              <HiOutlineReply style={{ transform: "scaleX(-1)" }} />
            </ActionIcon>
          </Group>
        </Group>
      </Group>
    </Paper>
  ));

  return (
    <Container fluid>
      <Stack gap="md" m="xl">
        <Group justify="space-between">
          <Text fw={700} size="xl">
            Loan Simulations
          </Text>
          <Button leftSection={<HiPlus size={14} />} onClick={() => openForm()}>
            Add New Loan Calculation
          </Button>
        </Group>
        <SimpleGrid cols={3} autoFlow="auto-fill">
          {/* KUR Preference Distribution */}
          <Card h="auto">
            <Stack>
              <Text>KUR Preference Distribution</Text>
              <SimpleGrid cols={2} autoFlow="auto-fill">
                <Card withBorder>
                  <Stack>
                    {KURAmount.map((item) => (
                      <Group key={item.name} justify="space-between">
                        <Group>
                          <ColorSwatch color={item.color} size={10} />
                          <Text size="sm">{item.name}</Text>
                        </Group>
                        <Text size="sm" fw={700}>
                          {item.value}
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                </Card>
                <Card p="xs">
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
          <Card>
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
                      Rp. 8.100.000,00
                    </Text>
                    <Text c="red" fw={700}>
                      <span>15%</span>
                      <FaArrowTrendDown size={16} />
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
                  Rp. 60.000.000,00
                </Text>
              </Stack>
            </Stack>
          </Card>
          {/* Repayment Health Overview */}
          <Card>
            <Stack>
              <Text>Repayment Health Overview</Text>
              <Stack gap="2rem">
                {/* Feasible Simulations */}
                <Group justify="space-between">
                  <Text fz="xs" tt="uppercase" c="dimmed" fw={700}>
                    feasible simulations
                  </Text>
                  {/* Healthy / Possible vs Total */}
                  <Badge color="green" variant="light" size="lg">
                    25 / 30
                  </Badge>
                </Group>
                {/* Avg Surplus After Payment */}
                <Group justify="space-between">
                  <Text fz="xs" tt="uppercase" c="dimmed" fw={700}>
                    Avg Surplus After Payment
                  </Text>
                  <Badge color="yellow" variant="light" size="lg">
                    Rp 300.000,00
                  </Badge>
                </Group>
                {/* Avg Debt-To-Income */}
                <Group justify="space-between">
                  <Text fz="xs" tt="uppercase" c="dimmed" fw={700}>
                    Debt-to-Income Ratio
                  </Text>
                  <Badge color="red" variant="light" size="lg">
                    30%
                  </Badge>
                </Group>
              </Stack>
            </Stack>
          </Card>
        </SimpleGrid>
        <Divider />

        <Stack gap="sm">
          {entries.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              Belum ada data. Tambahkan pinjaman baru.
            </Text>
          ) : (
            AmortRows
          )}
        </Stack>
      </Stack>
    </Container>
  );
}

export default Amort_Calc;
