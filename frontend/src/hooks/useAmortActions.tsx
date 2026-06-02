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
import { calculateHealthStatus, isFeasible } from "../utils/amort/health";
import { calculatePMT } from "../utils/amort/pmt";
import { calculateDebtBurdenRatio } from "../utils/amort/dbr";
import { calculateMaxSafePrincipal } from "../utils/amort/maxsafe";
import { calculateSafeExtendedTenor } from "../utils/amort/safetenor";

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

      const sortedResult = result.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();

        return dateB - dateA;
      });
      setEntries(sortedResult);
    } catch (error) {
      console.error("Failed to load amort entries:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleSubmit = useCallback(
    async (entry: AmortEntry) => {
      const interestRate = entry.creditID
        ? creditMap[entry.creditID]?.interestRatePerYear
        : undefined;

      const monthlyPMT = calculatePMT(
        entry.principalAmount,
        entry.tenorMonth,
        interestRate,
      );

      const totalInstallment = (monthlyPMT || 0) * (entry.tenorMonth || 0);

      const totalInterest = Math.max(
        0,
        totalInstallment - (entry.principalAmount || 0),
      );

      const healthStatus = calculateHealthStatus(
        totalInstallment,
        entry.tenorMonth,
        business?.monthlyAverageIncome,
      );

      const feasible = isFeasible(monthlyPMT, business?.monthlyAverageIncome);

      const dbr = calculateDebtBurdenRatio(
        monthlyPMT,
        business?.monthlyAverageIncome,
      );

      const maxSafePrincipal = calculateMaxSafePrincipal(
        entry.tenorMonth || 0,
        interestRate || 0,
        business?.monthlyAverageIncome || 0,
      );

      const SafeExtendedTenor = calculateSafeExtendedTenor(
        entry.principalAmount || 0,
        interestRate || 0,
        business?.monthlyAverageIncome || 0,
        healthStatus || "healthy",
      );

      const finalEntry = {
        ...entry,
        totalInstallment,
        health_status: healthStatus,
        pmt: monthlyPMT,
        isFeasible: feasible,
        dbr,
        totalInterest,
        maxSafePrincipal,
        SafeExtendedTenor,
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
