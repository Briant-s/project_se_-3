import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import {
  updateAmortEntry,
  createAmortEntry,
  deleteAmortEntry,
  getAmortEntries,
} from "../../services/amortService";
import { useAmortModal } from "./useAmortModal";
import type { AmortEntry } from "../../services/models";
import { useEffect, useState } from "react";

export function useAmortActions(
  setEditId: (id: number | null) => void,
  editId: number | null,
) {
  const [entries, setEntries] = useState<AmortEntry[]>([]);
  const [loading, setLoading] = useState(false);

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

  async function handleSubmit(entry: AmortEntry, editId: number | null) {
    if (editId !== null) {
      await updateAmortEntry(editId, entry);
      setEditId(null);
    } else {
      await createAmortEntry(entry);
    }
    modals.closeAll();
    fetchEntries();
  }

  const { openForm } = useAmortModal({
    onSubmit: handleSubmit,
    setEditId,
  });

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

  return { openForm, confirmDelete, entries, loading };
}
