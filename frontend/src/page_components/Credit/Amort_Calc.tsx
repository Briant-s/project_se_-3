import {
  ActionIcon,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  Paper,
  TextInput,
  Table,
  VisuallyHidden,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { HiOutlinePlus } from "react-icons/hi";
import { modals } from "@mantine/modals";

import { HiPencil, HiTrash } from "react-icons/hi";

import type { AmortEntry } from "../../services/models";
import {
  getAmortEntries,
  createAmortEntry,
  updateAmortEntry,
  deleteAmortEntry,
} from "../../services/amortService";
import { useEffect, useState } from "react";
import AmortForm from "./AmortForm";

function Amort_Calc() {
  const [entries, setEntries] = useState<AmortEntry[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  //   Automatic Fetch Entries
  useEffect(() => {
    const loadEntries = async () => {
      const result = await getAmortEntries();
      setEntries(result);
    };
    loadEntries();
  }, []);

  //  Manual Fetch Entries
  async function fetchEntries() {
    const result = await getAmortEntries();
    setEntries(result);
  }

  // Handle Create and/or Update
  async function handleSubmit(entry: AmortEntry) {
    const payload = {
      title: entry.title,
      month: Number(entry.tenor_month),
      installment: Number(entry.total_installment),
    };
    console.log(entry.amort_id);
    if (editId !== null) {
      // Update
      await updateAmortEntry(editId, entry);
      setEditId(null);
    } else {
      // Create
      await createAmortEntry(entry);
    }

    modals.closeAll();
    fetchEntries();
  }

  //   Handle Delete
  async function handleDelete(amort_id: number) {
    try {
      await deleteAmortEntry(amort_id);
      await fetchEntries();
    } catch (err) {
      console.error(err);
    }
  }

  const openForm = (entry?: AmortEntry) => {
    modals.open({
      title: entry ? "Edit Calculation" : "Add New Calculation",
      children: (
        <>
          <AmortForm onSubmit={handleSubmit} />
        </>
      ),
    });
  };

  const AmortRows = entries.map((entry) => (
    <Table.Tr key={entry.amort_id}>
      <Table.Td>{entry.title}</Table.Td>
      <Table.Td>{entry.tenor_month} bulan</Table.Td>
      <Table.Td>Rp. {entry.total_installment}</Table.Td>
      <Table.Td>
        <Group>
          <ActionIcon>
            <HiPencil onClick={() => openForm(entry)} />
          </ActionIcon>
          <ActionIcon>
            <HiTrash onClick={() => handleDelete(entry.amort_id)} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Container fluid>
        <Stack gap="md" m="xl">
          {/* List Header */}
          <Group justify="space-between">
            <Text>Loan Calculation List</Text>
            <ActionIcon onClick={() => openForm()}>
              <HiOutlinePlus />
            </ActionIcon>
          </Group>

          <Divider />

          {/* List */}
          <Table>
            <Table.Thead>
              <Table.Th>Title</Table.Th>
              <Table.Th>Tenor Months</Table.Th>
              <Table.Th>Installment</Table.Th>
              <Table.Th>
                <VisuallyHidden>Actions</VisuallyHidden>
              </Table.Th>
            </Table.Thead>
            <Table.Tbody>{AmortRows}</Table.Tbody>
          </Table>
        </Stack>
      </Container>
    </>
  );
}

export default Amort_Calc;
