import { useForm } from "@mantine/form";
import type { AmortEntry } from "../../services/models";
import { Stack, TextInput, Group, Button, NumberInput } from "@mantine/core";

interface Props {
  onSubmit: (values: AmortEntry) => void;
  initialValues?: AmortEntry;
}

function AmortForm({ onSubmit, initialValues }: Props) {
  // Form Fields
  const form = useForm({
    initialValues: initialValues ?? {
      title: "",
      tenor_month: 0,
      total_installment: 0,
    },
    validate: {
      title: (value) =>
        value.length < 2 ? "Title must have at least 2 letters" : null,
      month: (value) =>
        value <= 0 ? "Tenor Length must be greater than 0" : null,
      installment: (value) =>
        value <= 0 ? "Installment must be greater than 0" : null,
    },
  });

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <TextInput
            {...form.getInputProps("title")}
            label="Calculation Name"
          />
          <Group>
            <NumberInput
              {...form.getInputProps("total_installment")}
              label="Total Installment"
            />
            <NumberInput
              {...form.getInputProps("tenor_month")}
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
