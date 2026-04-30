import { useForm } from "@mantine/form";
import type { AmortFormValues, AmortEntry } from "../../services/models";
import {
  Stack,
  TextInput,
  Group,
  Button,
  NumberInput,
  SegmentedControl,
  Text,
} from "@mantine/core";

interface Props {
  onSubmit: (values: AmortEntry, editId: number | null) => void;
  initialValues?: AmortEntry;
  editId: number | null;
}

function AmortForm({ onSubmit, initialValues, editId }: Props) {
  // Form Fields
  const form = useForm<AmortFormValues>({
    initialValues: initialValues ?? {
      title: "",
      tenorMonth: 0,
      totalInstallment: 0,
      principalAmount: 0,
      loanType: "KUR_SUPER_MIKRO",
    },
    validate: {
      title: (value) =>
        value.length < 2 ? "Title must have at least 2 letters" : null,
      tenorMonth: (value) =>
        value <= 0 ? "Tenor Length must be greater than 0" : null,
      totalInstallment: (value) =>
        value <= 0 ? "Installment must be greater than 0" : null,
      principalAmount: (value) =>
        value <= 0 ? "Principal must be greater than 0" : null,
    },
  });

  const resolve_creditID: Record<string, number> = {
    KUR_SUPER_MIKRO: 1,
    KUR_MIKRO: 2,
    KUR_KECIL: 3,
  };

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          const entry: AmortEntry = {
            title: values.title,
            tenorMonth: values.tenorMonth,
            totalInstallment: values.totalInstallment,
            principalAmount: values.principalAmount,
            creditID: resolve_creditID[values.loanType],
          };

          onSubmit(entry, editId);
        })}
      >
        <Stack>
          <TextInput
            {...form.getInputProps("title")}
            label="Calculation Name"
          />
          <Group>
            <NumberInput
              {...form.getInputProps("totalInstallment")}
              label="Total Installment"
            />
            <NumberInput
              {...form.getInputProps("tenorMonth")}
              label="Tenor Months"
            />
            <NumberInput
              {...form.getInputProps("principalAmount")}
              label="Principal Amount"
            />
          </Group>
          <Stack>
            <Text size="sm" fw={700}>
              Select KUR Type
            </Text>
            <SegmentedControl
              {...form.getInputProps("loanType")}
              data={[
                { label: "Super Mikro", value: "KUR_SUPER_MIKRO" },
                { label: "Mikro", value: "KUR_MIKRO" },
                { label: "Kecil", value: "KUR_KECIL" },
              ]}
            />
          </Stack>
        </Stack>
        <Button type="submit" fullWidth mt="md">
          Submit
        </Button>
      </form>
    </>
  );
}

export default AmortForm;
