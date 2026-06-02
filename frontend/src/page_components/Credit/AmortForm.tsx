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
  useMantineTheme,
} from "@mantine/core";
import classes from "./AmortForm.module.css";
import { useCreditReferences } from "../../hooks/useCreditReferences";
import { formatRupiah } from "../../utils/globalFormatter";

interface Props {
  onSubmit: (values: AmortEntry, editId: number | null) => void;
  initialValues?: AmortEntry;
  editId: number | null;
}

const getCreditKey = (type: string, purpose: string) => {
  if (!type || !purpose) return null;
  const formattedType = type.replace("KUR_", "").replace("_", "").toLowerCase();
  return `${formattedType}-${purpose.toLowerCase()}`;
};

function AmortForm({ onSubmit, initialValues, editId }: Props) {
  const { creditMapByType, loading } = useCreditReferences();

  // Form Fields
  const form = useForm<AmortFormValues>({
    initialValues: initialValues ?? {
      title: "",
      tenorMonth: "",
      principalAmount: "",
      loanType: "KUR_SUPER_MIKRO",
      loanPurpose: "KI",
    },
    validate: {
      principalAmount: (value, values) => {
        const lookupKey = getCreditKey(values.loanType, values.loanPurpose);
        const activeRules = lookupKey ? creditMapByType[lookupKey] : null;

        if ((value as unknown) === "") return "Principal amount is required";

        if (activeRules && value > activeRules.maxLimit) {
          return `Amount exceeds the maximum limit of ${activeRules.maxLimit.toLocaleString()}`;
        }
        if (value <= 0) {
          return "Amount must be greater than 0";
        }
        return null;
      },

      title: (value) =>
        value.length < 2 ? "Title must have at least 2 letters" : null,

      tenorMonth: (value, values) => {
        if ((value as unknown) === "") return "Tenor is required";
        if (value <= 0) return "Tenor Length must be greater than 0";

        // 1. Look up the active credit rules using the form values
        const lookupKey = getCreditKey(values.loanType, values.loanPurpose);
        const activeRules = lookupKey ? creditMapByType[lookupKey] : null;

        // 2. Dynamic Max Tenor Validation
        // (Change 'maxTenorMonth' to match whatever the property name is in your Credit model)
        if (
          activeRules &&
          activeRules.maxTenorMonth &&
          value > activeRules.maxTenorMonth
        ) {
          return `Tenor exceeds the maximum limit of ${activeRules.maxTenorMonth} months for this credit type`;
        }

        return null;
      },

      // (Add businessAge and hasCollateral here if you are using them)
    },
  });

  const resolveCreditID: Record<string, Record<string, number>> = {
    KUR_SUPER_MIKRO: { KI: 1, KMK: 4 },
    KUR_MIKRO: { KI: 2, KMK: 5 },
    KUR_KECIL: { KI: 3, KMK: 6 },
  };

  const theme = useMantineTheme();
  const segmentColor: Record<string, string> = {
    KUR_SUPER_MIKRO: theme.other.KURColors.supermikro, // teal
    KUR_MIKRO: theme.other.KURColors.mikro, // blue
    KUR_KECIL: theme.other.KURColors.kecil, // purple
  };

  const activeColor = segmentColor[form.values.loanType] || theme.primaryColor;

  // 1. Map your loan purpose values to the theme color paths
  const purposeColor: Record<string, string> = {
    KI: "blue.5", // Maps to your brand blue
    KMK: "amber.5", // Maps to your brand teal
  };

  // 2. Safely get the active color with a fallback
  const activePurposeColor =
    purposeColor[form.values.loanPurpose] || theme.primaryColor;

  const currentKey = getCreditKey(
    form.values.loanType,
    form.values.loanPurpose,
  );
  const currentRules = currentKey ? creditMapByType[currentKey] : null;

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
            placeholder="Ekspansi Warung Bakso"
          />
          <Stack>
            <Text size="sm" fw={700}>
              Select KUR Type
            </Text>
            <SegmentedControl
              {...form.getInputProps("loanType")}
              color={activeColor}
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
              color={activePurposeColor}
              data={[
                { label: "Kredit Investasi", value: "KI" },
                { label: "Kredit Modal Kerja", value: "KMK" },
              ]}
            />
          </Stack>
          <Group>
            <NumberInput
              {...form.getInputProps("principalAmount")}
              prefix="Rp "
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              hideControls
              w="100%"
              label="Principal Amount"
              placeholder="Rp. 10.000.000,00"
              rightSectionWidth={200}
              rightSectionPointerEvents="none"
              rightSection={
                currentRules ? (
                  <Text size="xs" c="dimmed" fw={500}>
                    Max Limit: {currentRules.maxLimit.toLocaleString("id-ID")}
                  </Text>
                ) : null
              }
            />
            <NumberInput
              {...form.getInputProps("tenorMonth")}
              label="Tenor (Months)"
              placeholder="Enter tenor length"
              w="100%"
              hideControls
              rightSectionWidth={120}
              rightSectionPointerEvents="none"
              rightSection={
                currentRules?.maxTenorMonth ? (
                  <Text size="xs" c="dimmed" pr="md">
                    Max: {currentRules.maxTenorMonth} mnths
                  </Text>
                ) : null
              }
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
