import { Box, Paper, Text, SimpleGrid, useMantineTheme } from "@mantine/core";
import { RemediationCard } from "./RemediationCard";
import { formatRupiah } from "../../../utils/globalFormatter";

interface AdvisoryProps {
  status: "healthy" | "warning" | "not_healthy";
  dbrPercent: number | undefined;
  pmt: number | undefined;
  totalInterest: number | undefined;
  avgMonthlyIncome: number | undefined;
  tenorMonth: number | undefined;
  principalAmount: number | undefined;
  maxSafePrincipal: number | undefined;
  safeExtendedTenor: number | undefined;
}

export function AdvisoryCard({
  status = "healthy",
  dbrPercent,
  pmt,
  totalInterest,
  avgMonthlyIncome,
  tenorMonth,
  principalAmount,
  maxSafePrincipal,
  safeExtendedTenor,
}: AdvisoryProps) {
  const theme = useMantineTheme();
  const { HealthStatus } = theme.other;

  const STATUS_MAP = {
    healthy: {
      bg: HealthStatus.h_bg,
      accentColor: HealthStatus.healthy,
      title: "✓ Pinjaman Layak Disetujui",
    },
    warning: {
      bg: HealthStatus.w_bg,
      accentColor: HealthStatus.warning,
      title: "⚠ Rekomendasi Penyesuaian",
    },
    not_healthy: {
      bg: HealthStatus.nh_bg,
      accentColor: HealthStatus.not_healthy, // Maps 'risky' to 'not_healthy'
      title: "✕ Risiko Tinggi — Perlu Penyesuaian Wajib",
    },
  };

  const config = STATUS_MAP[status] || STATUS_MAP.warning;
  const isHealthy = status === "healthy";

  return (
    <Paper
      mt="md"
      px="lg"
      py="md"
      radius="md"
      bg={config.bg}
      style={{ border: `1px solid ${config.accentColor}40` }} // Added 40 (hex) for 25% opacity on the border
    >
      <Text fw={600} fz="sm" c={config.accentColor} mb={6}>
        {config.title}
      </Text>

      {isHealthy ? (
        <Text fz="sm" c={config.accentColor} lh={1.7}>
          Rasio cicilan terhadap pendapatan (DBR) sebesar{" "}
          <Text span fw={700}>
            {dbrPercent}%
          </Text>{" "}
          berada di bawah batas aman 40%. Cicilan bulanan sebesar{" "}
          <Text span fw={700}>
            {formatRupiah(pmt)}
          </Text>{" "}
          dari pendapatan{" "}
          <Text span fw={700}>
            {formatRupiah(avgMonthlyIncome)}
          </Text>{" "}
          dinilai tidak memberatkan arus kas usaha. Total bunga yang dibayarkan
          selama {tenorMonth} bulan adalah{" "}
          <Text span fw={700}>
            {formatRupiah(totalInterest)}
          </Text>
          .
        </Text>
      ) : (
        <Box fz="sm" c={config.accentColor} lh={1.7}>
          <Text mb="sm" fz="sm" c={config.accentColor} lh={1.7}>
            DBR{" "}
            <Text span fw={700}>
              {dbrPercent}%
            </Text>{" "}
            melampaui batas aman 40%. Cicilan{" "}
            <Text span fw={700}>
              {formatRupiah(pmt)}/bln
            </Text>{" "}
            dinilai terlalu berat bagi pendapatan rata-rata{" "}
            <Text span fw={700}>
              {formatRupiah(avgMonthlyIncome)}/bln
            </Text>
            . Berikut dua opsi penyesuaian:
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            <RemediationCard
              optionLabel="Opsi A — Turunkan Pokok"
              primaryValue={formatRupiah(maxSafePrincipal)}
              description={`Pokok maks. agar DBR = 40% dengan tenor ${tenorMonth} bulan`}
              themeColor={config.accentColor}
            />
            <RemediationCard
              optionLabel="Opsi B — Perpanjang Tenor"
              primaryValue={
                safeExtendedTenor ? `${safeExtendedTenor} Bulan` : "—"
              }
              description={`Tenor minimal agar DBR ≤ 40% dengan pokok ${formatRupiah(principalAmount)}`}
              themeColor={config.accentColor}
            />
          </SimpleGrid>
        </Box>
      )}
    </Paper>
  );
}
