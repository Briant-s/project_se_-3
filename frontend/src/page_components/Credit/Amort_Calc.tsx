import {
  ActionIcon,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  Paper,
} from "@mantine/core";
import { HiOutlinePlus, HiPencil, HiTrash } from "react-icons/hi";
import { HiOutlineReply } from "react-icons/hi";
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

function Amort_Calc() {
  const [entries, setEntries] = useState<AmortEntry[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const navigate = useNavigate();

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
        Are you sure you want to delete <b>{title}</b>? This action can't be reversed.
      </Text>
    ),
    labels: { confirm: "Delete", cancel: "Cancel" },
    confirmProps: { color: "red" },
    onConfirm: () => handleDelete(amort_id),
  });
}

  const openForm = (entry?: AmortEntry) => {
    if (entry) {
      setEditId(entry.amort_id!);
    } else {
      setEditId(null);
    }
    modals.open({
      title: entry ? "Edit Calculation" : "Add New Calculation",
      children: (
        <AmortForm
          editId={entry?.amort_id ?? null}
          onSubmit={handleSubmit}
          initialValues={
            entry
              ? {
                  title: entry.title,
                  tenor_month: entry.tenor_month,
                  total_installment: entry.total_installment,
                }
              : undefined
          }
        />
      ),
    });
  };

  const AmortRows = entries.map((entry) => (
    <Paper
      key={entry.amort_id}
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
              Tipe pinjaman
            </Text>
            <Text size="sm" c="dimmed">•</Text>
            <Text size="sm" c="blue">
              {entry.tenor_month} bulan
            </Text>
          </Group>
        </Stack>

        {/* Kanan: Angka + Actions */}
        <Group gap="xl" align="center">
          <Stack gap={2} align="flex-end">
            <Text size="sm" c="dimmed">
              ~Rp {(entry.total_installment / entry.tenor_month).toLocaleString("id-ID")} / bulan
            </Text>
            <Text size="xs" c="dimmed">
              Rp {entry.total_installment.toLocaleString("id-ID")}
            </Text>
          </Stack>

          <Group gap="xs">
            <ActionIcon variant="filled" radius="md" onClick={() => openForm(entry)}>
              <HiPencil />
            </ActionIcon>
            <ActionIcon variant="filled" radius="md" onClick={() => confirmDelete(entry.amort_id!, entry.title)}>
              <HiTrash />
            </ActionIcon>
            <ActionIcon
              variant="filled"
              radius="md"
              onClick={() => navigate(`/credit/amort-calc/${entry.amort_id}`)}
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
          <Text fw={700} size="lg">Loan Calculation List</Text>
          <ActionIcon onClick={() => openForm()}>
            <HiOutlinePlus />
          </ActionIcon>
        </Group>

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