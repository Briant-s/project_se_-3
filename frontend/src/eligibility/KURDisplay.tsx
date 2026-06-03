import {
  SimpleGrid,
  Card,
  Stack,
  Text,
  Badge,
  Group,
  Skeleton,
} from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { useCreditReferences } from "../hooks/useCreditReferences";
import { useBusinessProfile } from "../hooks/useBusinessProfile";
import { useAssets } from "../hooks/useAssets";

const KUR_KEYS = ["supermikro", "mikro", "kecil"] as const;

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000)
    return `Rp ${(value / 1_000_000_000).toFixed(0)} billion`;
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(0)} million`;
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatTenor(minMonth: number, maxMonth: number): string {
  const toYears = (m: number) =>
    m % 12 === 0 ? `${m / 12} year${m / 12 > 1 ? "s" : ""}` : `${m} months`;
  return `${toYears(minMonth)} – ${toYears(maxMonth)}`;
}

function formatDisplayName(key: string, loanPurpose: string): string {
  const nameMap: Record<string, string> = {
    supermikro: "Super Mikro",
    mikro: "Mikro",
    kecil: "Kecil",
  };
  const purposeLabel = loanPurpose === "ki" ? "KI" : "KMK";
  return `KUR ${nameMap[key]} - ${purposeLabel}`;
}

interface KURDisplayProps {
  loanPurpose: "ki" | "kmk";
}

function KURDisplay({ loanPurpose }: KURDisplayProps) {
  const theme = useMantineTheme();
  const { creditMapByType, loading: creditLoading } = useCreditReferences();
  const { business, loading: profileLoading } = useBusinessProfile();
  const { hasCollateral, loading: assetsLoading } = useAssets();

  const userProfile = {
    businessAgeMonths: business?.businessAge ?? 0,
    hasCollateral,
    monthlyRevenue: business?.monthlyAverageIncome ?? 0,
  };

  if (creditLoading || profileLoading || assetsLoading) {
    return (
      <SimpleGrid cols={3} spacing="md">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={260} radius="md" />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid cols={3} spacing="md">
      {KUR_KEYS.map((key) => {
        const creditType = `${key}-${loanPurpose}`;
        const credit = creditMapByType[creditType];
        const color = theme.other.KURColors[key];
        const displayName = formatDisplayName(key, loanPurpose);

        if (!credit) {
          return (
            <Card
              key={key}
              withBorder
              radius="md"
              p="md"
              style={{ borderColor: `${color}50`, borderWidth: 1 }}
            >
              <Text c="dimmed" size="sm">
                Data for {displayName} not available.
              </Text>
            </Card>
          );
        }

        const details = [
          {
            label: "Interest Rate",
            value: `${credit.interestRatePerYear * 100}% per year`,
          },
          {
            label: "Loan Limit",
            value:
              credit.minLimit === 0
                ? `Up to ${formatCurrency(credit.maxLimit)}`
                : `${formatCurrency(credit.minLimit)} – ${formatCurrency(credit.maxLimit)}`,
          },
          {
            label: "Tenor",
            value: formatTenor(credit.minTenorMonth, credit.maxTenorMonth),
          },
          {
            label: "Collateral",
            value: credit.needsCollateral ? "Required" : "Not required",
          },
        ];

        const eligibilityChecks = [
          {
            label: "Business Age",
            info:
              credit.minBusinessAge === 0
                ? "No minimum required"
                : `Minimum ${credit.minBusinessAge} months`,
            met:
              credit.minBusinessAge === 0 ||
              userProfile.businessAgeMonths >= credit.minBusinessAge,
          },
          {
            label: "Collateral",
            info: credit.needsCollateral
              ? "Collateral asset required"
              : "Not required",
            met: !credit.needsCollateral || userProfile.hasCollateral,
          },
        ];

        const allEligible = eligibilityChecks.every((c) => c.met);

        return (
          <Card
            key={key}
            withBorder
            radius="md"
            p="md"
            style={{
              backgroundColor: `${color}18`,
              borderColor: `${color}50`,
              borderWidth: 1,
            }}
          >
            <Stack gap="xs">
              {/* Header */}
              <Group justify="space-between">
                <Text fw={500} style={{ color }}>
                  {displayName}
                </Text>
                <Badge
                  color={allEligible ? "green" : "red"}
                  variant="light"
                  leftSection={
                    allEligible ? (
                      <HiCheckCircle size={12} />
                    ) : (
                      <HiXCircle size={12} />
                    )
                  }
                >
                  {allEligible ? "Eligible" : "Not Eligible"}
                </Badge>
              </Group>

              {/* Details */}
              <Text size="xs" fw={500} c="dimmed" tt="uppercase" mt={4}>
                Details
              </Text>
              {details.map((d) => (
                <Group key={d.label} justify="space-between">
                  <Text size="sm" c="dimmed">
                    {d.label}
                  </Text>
                  <Text size="sm" fw={500}>
                    {d.value}
                  </Text>
                </Group>
              ))}

              {/* Requirements */}
              <Text size="xs" fw={500} c="dimmed" tt="uppercase" mt={4}>
                Requirements
              </Text>
              {eligibilityChecks.map((s) => (
                <Group key={s.label} gap="xs">
                  {s.met ? (
                    <HiCheckCircle color="green" size={16} />
                  ) : (
                    <HiXCircle color="red" size={16} />
                  )}
                  <Text size="sm" c={s.met ? "dimmed" : "red"}>
                    {s.label}: {s.info}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Card>
        );
      })}
    </SimpleGrid>
  );
}

export default KURDisplay;
