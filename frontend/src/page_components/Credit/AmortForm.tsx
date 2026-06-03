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
  Card,
  Badge,
  ThemeIcon,
  Anchor,
} from "@mantine/core";
import classes from "./AmortForm.module.css";
import { useCreditReferences } from "../../hooks/useCreditReferences";
import { useBusinessProfile } from "../../hooks/useBusinessProfile";
import { useAssets } from "../../hooks/useAssets";
import { formatRupiah } from "../../utils/globalFormatter";
import { HiCheckCircle, HiXCircle, HiLockClosed } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";

interface Props {
  onSubmit: (values: AmortEntry, editId: number | null) => void;
  initialValues?: AmortEntry;
  editId: number | null;
}

const KUR_KEYS = ["KUR_SUPER_MIKRO", "KUR_MIKRO", "KUR_KECIL"] as const;
type KurKey = (typeof KUR_KEYS)[number];

const getCreditKey = (type: string, purpose: string) => {
  if (!type || !purpose) return null;
  const formattedType = type.replace("KUR_", "").replace("_", "").toLowerCase();
  return `${formattedType}-${purpose.toLowerCase()}`;
};

function AmortForm({ onSubmit, initialValues, editId }: Props) {
  const { creditMapByType, loading } = useCreditReferences();
  const { business } = useBusinessProfile();
  const { hasCollateral } = useAssets();

  const navigate = useNavigate();

  const handleCheckEligibility = () => {
    modals.closeAll();
    navigate("/credit/eligibility-quiz");
  };

  const theme = useMantineTheme();

  // Derive eligibility for each KUR type against the selected purpose
  const getEligibility = (kurType: KurKey, purpose: string) => {
    const key = getCreditKey(kurType, purpose);
    const credit = key ? creditMapByType[key] : null;

    // credit data not loaded yet — don't disable anything
    if (!credit) return { eligible: true, unknown: false };

    const businessAgeMonths = business?.businessAge ?? 0;

    const ageOk =
      credit.minBusinessAge === 0 || businessAgeMonths >= credit.minBusinessAge;

    const collateralUnknown = credit.needsCollateral && hasCollateral === null;
    const collateralOk = !credit.needsCollateral || hasCollateral === true;

    return {
      eligible: ageOk && collateralOk && !collateralUnknown,
      unknown: collateralUnknown,
    };
  };

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
        if (activeRules && value > activeRules.maxLimit)
          return `Amount exceeds the maximum limit of ${activeRules.maxLimit.toLocaleString()}`;
        if (value <= 0) return "Amount must be greater than 0";
        return null;
      },
      title: (value) =>
        value.length < 2 ? "Title must have at least 2 letters" : null,
      tenorMonth: (value, values) => {
        if ((value as unknown) === "") return "Tenor is required";
        if (value <= 0) return "Tenor Length must be greater than 0";
        const lookupKey = getCreditKey(values.loanType, values.loanPurpose);
        const activeRules = lookupKey ? creditMapByType[lookupKey] : null;
        if (activeRules?.maxTenorMonth && value > activeRules.maxTenorMonth)
          return `Tenor exceeds the maximum of ${activeRules.maxTenorMonth} months for this credit type`;
        return null;
      },
    },
  });

  const resolveCreditID: Record<string, Record<string, number>> = {
    KUR_SUPER_MIKRO: { KI: 1, KMK: 4 },
    KUR_MIKRO: { KI: 2, KMK: 5 },
    KUR_KECIL: { KI: 3, KMK: 6 },
  };

  const segmentColor: Record<string, string> = {
    KUR_SUPER_MIKRO: theme.other.KURColors.supermikro,
    KUR_MIKRO: theme.other.KURColors.mikro,
    KUR_KECIL: theme.other.KURColors.kecil,
  };

  const purposeColor: Record<string, string> = {
    KI: "blue.5",
    KMK: "amber.5",
  };

  const activeColor = segmentColor[form.values.loanType] || theme.primaryColor;
  const activePurposeColor =
    purposeColor[form.values.loanPurpose] || theme.primaryColor;

  const currentKey = getCreditKey(
    form.values.loanType,
    form.values.loanPurpose,
  );
  const currentRules = currentKey ? creditMapByType[currentKey] : null;

  // Build segmented control data with disabled state for locked types
  const kurSegmentData = [
    { label: "Super Mikro", value: "KUR_SUPER_MIKRO" },
    { label: "Mikro", value: "KUR_MIKRO" },
    { label: "Kecil", value: "KUR_KECIL" },
  ].map((item) => {
    const { eligible, unknown } = getEligibility(
      item.value as KurKey,
      form.values.loanPurpose,
    );
    return {
      ...item,
      disabled: !eligible && !unknown, // only hard-disable when definitely ineligible
    };
  });

  // KUR info card labels
  const kurLabels: Record<KurKey, string> = {
    KUR_SUPER_MIKRO: "KUR Super Mikro",
    KUR_MIKRO: "KUR Mikro",
    KUR_KECIL: "KUR Kecil",
  };

  return (
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

        {/* KUR Type Selector */}
        <Stack gap="xs">
          <Group justify="space-between" align="center">
            <Text size="sm" fw={700}>
              Select KUR Type
            </Text>
            <Anchor
              size="xs"
              c="dimmed"
              onClick={handleCheckEligibility}
              style={{ cursor: "pointer" }}
            >
              Check eligibility →
            </Anchor>
          </Group>
          <SegmentedControl
            {...form.getInputProps("loanType")}
            color={activeColor}
            data={kurSegmentData}
          />

          {/* Info card for selected KUR type */}
          {currentRules && (
            <Card
              withBorder
              radius="md"
              p="sm"
              style={{
                backgroundColor: `${segmentColor[form.values.loanType]}18`,
                borderColor: `${segmentColor[form.values.loanType]}50`,
              }}
            >
              <Group justify="space-between" wrap="nowrap">
                <Stack gap={2}>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                    {kurLabels[form.values.loanType]}
                  </Text>
                  <Text size="sm" fw={600}>
                    {currentRules.interestRatePerYear}% / year
                  </Text>
                </Stack>
                <Group gap="xs">
                  <Badge
                    variant="light"
                    color={currentRules.needsCollateral ? "orange" : "green"}
                    leftSection={
                      currentRules.needsCollateral ? (
                        <HiLockClosed size={10} />
                      ) : (
                        <HiCheckCircle size={10} />
                      )
                    }
                  >
                    {currentRules.needsCollateral
                      ? "Collateral required"
                      : "No collateral"}
                  </Badge>
                  {(() => {
                    const { eligible, unknown } = getEligibility(
                      form.values.loanType,
                      form.values.loanPurpose,
                    );
                    return (
                      <Badge
                        variant="light"
                        color={eligible ? "green" : unknown ? "yellow" : "red"}
                        leftSection={
                          eligible ? (
                            <HiCheckCircle size={10} />
                          ) : (
                            <HiXCircle size={10} />
                          )
                        }
                      >
                        {eligible
                          ? "Eligible"
                          : unknown
                            ? "Incomplete Data"
                            : "Not Eligible"}
                      </Badge>
                    );
                  })()}
                </Group>
              </Group>
            </Card>
          )}
        </Stack>

        {/* Loan Purpose Selector */}
        <Stack gap="xs">
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
                  Max: {currentRules.maxLimit.toLocaleString("id-ID")}
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
  );
}

export default AmortForm;
