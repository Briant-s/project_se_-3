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
      principalAmount: 0,
      loanType: "KUR_SUPER_MIKRO",
      loanPurpose: "KI",
    },
    validate: {
      title: (value) =>
        value.length < 2 ? "Title must have at least 2 letters" : null,
      tenorMonth: (value) =>
        value <= 0 ? "Tenor Length must be greater than 0" : null,
      principalAmount: (value) =>
        value <= 0 ? "Principal must be greater than 0" : null,
    },
  });

  const resolveCreditID: Record<string, Record<string, number>> = {
    KUR_SUPER_MIKRO: { KI: 1, KMK: 4 },
    KUR_MIKRO: { KI: 2, KMK: 5 },
    KUR_KECIL: { KI: 3, KMK: 6 },
  };

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          const entry: AmortEntry = {
            title: values.title,
            tenorMonth: values.tenorMonth,
            principalAmount: values.principalAmount,
            creditID: resolveCreditID[values.loanType][values.loanPurpose],
          };

          onSubmit(entry, editId);
        })}
      >
        <Stack>
          <TextInput
            {...form.getInputProps("title")}
            label="Calculation Name"
          />
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
          <Stack>
            <Text size="sm" fw={700}>
              Select Loan Purpose
            </Text>
            <SegmentedControl
              {...form.getInputProps("loanPurpose")}
              data={[
                { label: "Kredit Investasi", value: "KI" },
                { label: "Kredit Modal Kerja", value: "KMK" },
              ]}
            />
          </Stack>
          <Group>
            <NumberInput
              {...form.getInputProps("principalAmount")}
              label="Principal Amount"
            />
            <NumberInput
              {...form.getInputProps("tenorMonth")}
              label="Tenor Months"
            />
          </Group>
        </Stack>
        <Button type="submit" fullWidth mt="md">
          Submit
        </Button>
      </form>
    </>
  );
}

export default AmortForm;
