import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import {
  updateAmortEntry,
  createAmortEntry,
  deleteAmortEntry,
  getAmortEntries,
} from "../services/amortService";
import { useAmortModal } from "./useAmortModal";
import type { AmortEntry, BusinessProfile, Credit } from "../services/models";
import { useEffect, useState, useCallback } from "react";
import { calculateHealthStatus } from "../utils/amort/health";
import { calculateTotalInstallment } from "../utils/amort/totalInstallment";

export function useAmortActions(
  setEditId: (id: number | null) => void,
  business: BusinessProfile | undefined,
  creditMap: Record<number, Credit>,
  editId: number | null,
) {
  const [entries, setEntries] = useState<AmortEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Memoize the fetch function
  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAmortEntries();
      setEntries(result);
    } catch (error) {
      console.error("Failed to load amort entries:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // 2. Memoize handleSubmit and remove 'editId' from parameters so it uses the hook's state
  const handleSubmit = useCallback(
    async (entry: AmortEntry) => {
      const interestRate = entry.creditID
        ? creditMap[entry.creditID]?.interestRatePerYear
        : undefined;

      const totalInstallment = calculateTotalInstallment(
        entry.principalAmount,
        entry.tenorMonth,
        interestRate,
      );

      const healthStatus = calculateHealthStatus(
        totalInstallment,
        entry.tenorMonth,
        business?.monthlyAverageIncome,
      );

      const finalEntry = {
        ...entry,
        totalInstallment,
        health_status: healthStatus,
      };

      if (editId !== null) {
        await updateAmortEntry(editId, finalEntry);
        setEditId(null);
      } else {
        await createAmortEntry(finalEntry);
      }

      modals.closeAll();
      fetchEntries();
    },
    // Add all external variables used inside this function to the dependency array
    [
      business?.monthlyAverageIncome,
      creditMap,
      editId,
      fetchEntries,
      setEditId,
    ],
  );

  const { openForm } = useAmortModal({
    onSubmit: handleSubmit,
    setEditId,
  });

  const handleDelete = useCallback(
    async (amort_id: number) => {
      try {
        await deleteAmortEntry(amort_id);
        await fetchEntries();
      } catch (err) {
        console.error(err);
      }
    },
    [fetchEntries],
  );

  const confirmDelete = useCallback(
    (amort_id: number, title: string) => {
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
    },
    [handleDelete],
  );

  return { openForm, confirmDelete, entries, loading };
}
