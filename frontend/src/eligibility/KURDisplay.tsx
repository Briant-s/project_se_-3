import { SimpleGrid, Card, Stack, Text, Badge, ThemeIcon, Group } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

// Simulasi data user (nanti bisa diganti dari API/context)
const userProfile = {
  businessAgeMonths: 3,        // usia bisnis 3 bulan
  hasCollateral: false,        // belum punya collateral
  monthlyRevenue: 5000000,     // 5 juta per bulan
};

const kurTypes = [
  {
    id: 1,
    name: "KUR Super Mikro",
    colorKey: "supermikro",
    details: [
      { label: "Interest Rate", value: "3% per year" },
      { label: "Loan Limit", value: "Up to Rp 10 million" },
      { label: "Tenor", value: "1–3 years" },
      { label: "Collateral", value: "Not required" },
    ],
    syarat: [
      {
        label: "Business Age",
        info: "No minimum required",
        check: () => true,
      },
      {
        label: "Collateral",
        info: "Not required",
        check: () => true,
      },
    ],
  },
  {
    id: 2,
    name: "KUR Mikro",
    colorKey: "mikro",
    details: [
      { label: "Interest Rate", value: "6% per year" },
      { label: "Loan Limit", value: "Rp 10 million – 100 million" },
      { label: "Tenor", value: "1–3 years" },
      { label: "Collateral", value: "Not required" },
    ],
    syarat: [
      {
        label: "Business Age",
        info: "Minimum 6 months",
        check: () => userProfile.businessAgeMonths >= 6,
      },
      {
        label: "Collateral",
        info: "Not required",
        check: () => true,
      },
    ],
  },
  {
    id: 3,
    name: "KUR Kecil",
    colorKey: "kecil",
    details: [
      { label: "Interest Rate", value: "6% per year" },
      { label: "Loan Limit", value: "Rp 100 million – 500 million" },
      { label: "Tenor", value: "1–4 years" },
      { label: "Collateral", value: "Required" },
    ],
    syarat: [
      {
        label: "Business Age",
        info: "Minimum 6 months",
        check: () => userProfile.businessAgeMonths >= 6,
      },
      {
        label: "Collateral",
        info: "Collateral asset required",
        check: () => userProfile.hasCollateral,
      },
    ],
  },
];

function KURDisplay() {
  const theme = useMantineTheme();

  return (
    <SimpleGrid cols={3} spacing="md">
      {kurTypes.map((kur) => {
        const color = theme.other.KURColors[kur.colorKey];
        const allEligible = kur.syarat.every((s) => s.check());

        return (
          <Card
            key={kur.id}
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
                <Text fw={500} style={{ color }}>{kur.name}</Text>
                <Badge
                  color={allEligible ? "green" : "red"}
                  variant="light"
                  leftSection={
                    allEligible
                      ? <HiCheckCircle size={12} />
                      : <HiXCircle size={12} />
                  }
                >
                  {allEligible ? "Eligible" : "Not Eligible"}
                </Badge>
              </Group>

              {/* Detail */}
              <Text size="xs" fw={500} c="dimmed" tt="uppercase" mt={4}>Details</Text>
              {kur.details.map((d) => (
                <Group key={d.label} justify="space-between">
                  <Text size="sm" c="dimmed">{d.label}</Text>
                  <Text size="sm" fw={500}>{d.value}</Text>
                </Group>
              ))}

              {/* Syarat */}
              <Text size="xs" fw={500} c="dimmed" tt="uppercase" mt={4}>Requirements</Text>
              {kur.syarat.map((s) => {
                const met = s.check();
                return (
                  <Group key={s.label} gap="xs">
                    {met
                      ? <HiCheckCircle color="green" size={16} />
                      : <HiXCircle color="red" size={16} />
                    }
                    <Text size="sm" c={met ? "dimmed" : "red"}>
                      {s.label}: {s.info}
                    </Text>
                  </Group>
                );
              })}
            </Stack>
          </Card>
        );
      })}
    </SimpleGrid>
  );
}

export default KURDisplay;