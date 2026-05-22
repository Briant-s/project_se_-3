import { modals } from "@mantine/modals";
import type { AmortEntry } from "../../services/models";
import AmortForm from "../../page_components/Credit/AmortForm";

interface Props {
  onSubmit: (entry: AmortEntry, editId: number | null) => Promise<void> | void;
  setEditId?: (id: number | null) => void;
}

export const useAmortModal = ({ onSubmit, setEditId }: Props) => {
  const openForm = (entry?: AmortEntry) => {
    const currentEditId = entry?.amortID ?? null;

    if (setEditId) {
      setEditId(currentEditId);
    }
    modals.open({
      title: entry ? "Edit Calculation" : "Add New Calculation",
      children: (
        <AmortForm
          editId={entry?.amortID ?? null}
          onSubmit={(values: AmortEntry) => onSubmit(values, currentEditId)}
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
  return { openForm };
};
