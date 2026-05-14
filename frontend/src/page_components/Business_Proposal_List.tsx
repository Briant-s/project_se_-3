import { useState } from "react";
import {
  Container,
  Stack,
  Text,
  Card,
  Group,
  Button,
  SimpleGrid,
  Menu,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import type { ProposalData } from "./Business_Proposal_PDF";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProposalDraft {
  id: string;
  createdAt: string;
  data: ProposalData;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

export const dummyProposals: ProposalDraft[] = [
  {
    id: "1",
    createdAt: "2025-05-01",
    data: {
      businessName: "Warung Maju Jaya",
      businessDescription: "Warung makan yang menyajikan masakan rumahan khas Jawa dengan cita rasa autentik dan harga terjangkau.",
      visi: "Menjadi warung makan terpercaya dan terfavorit di lingkungan Kelurahan Cipete.",
      misi: "Menyajikan makanan sehat, enak, dan terjangkau setiap hari dengan pelayanan ramah.",
      targetPasar: "Warga sekitar, karyawan kantoran, dan mahasiswa usia 18–45 tahun.",
      psikografi: "Orang-orang yang menginginkan makan siang praktis, rumahan, dan tidak mahal.",
      trenPasar: "Meningkatnya permintaan makanan rumahan setelah pandemi; konsumen lebih sadar kesehatan.",
      competitors: [
        { name: "Warung Bu Sari", strength: "Sudah dikenal lama", weakness: "Menu monoton" },
        { name: "Nasi Padang Sederhana", strength: "Banyak pilihan lauk", weakness: "Harga lebih mahal" },
      ],
      strategiPemasaran: "Promosi melalui WhatsApp group warga dan Instagram. Diskon 10% untuk pelanggan baru.",
      pelayananPelanggan: "Layanan ramah, pesanan siap dalam 10 menit, tersedia layanan pesan antar via WhatsApp.",
      menuProduk: [
        { name: "Nasi Ayam Goreng", description: "Nasi putih + ayam goreng bumbu kuning + lalapan", price: "18000" },
        { name: "Nasi Sayur Lodeh", description: "Nasi putih + sayur lodeh + tempe orek", price: "13000" },
      ],
      jamOperasional: "08:00 – 17:00",
      jumlahStaff: "3",
      supplier: "Pasar Cipete untuk sayur dan bahan segar, distributor beras lokal.",
      prosesOperasional: "Belanja bahan pagi hari, masak mulai jam 06.00, buka jam 08.00, tutup saat habis atau jam 17.00.",
      modalAwal: "15000000",
      targetPendapatan: "8000000",
      analisa: "Estimasi BEP tercapai dalam 3 bulan dengan rata-rata 50 porsi/hari.",
      kesimpulan: "Warung Maju Jaya memiliki potensi pasar yang baik dengan modal awal yang terjangkau dan lokasi strategis.",
    },
  },
  {
    id: "2",
    createdAt: "2025-05-08",
    data: {
      businessName: "Kopi Sore Studio",
      businessDescription: "Coffee shop konsep co-working space yang nyaman untuk pekerja remote dan mahasiswa.",
      visi: "Menjadi third place favorit untuk bekerja dan bersantai di Jakarta Selatan.",
      misi: "Menyediakan kopi berkualitas, koneksi internet cepat, dan suasana yang mendukung produktivitas.",
      targetPasar: "Freelancer, remote worker, mahasiswa usia 20–35 tahun.",
      psikografi: "Individu produktif yang menghargai estetika, kenyamanan, dan konektivitas.",
      trenPasar: "Meningkatnya gaya kerja remote dan hybrid mendorong kebutuhan third place.",
      competitors: [
        { name: "Kopi Kenangan", strength: "Brand awareness kuat", weakness: "Tidak ada tempat duduk nyaman" },
      ],
      strategiPemasaran: "Instagram & TikTok content marketing, kolaborasi dengan komunitas desainer dan startup lokal.",
      pelayananPelanggan: "Free WiFi, colokan di setiap meja, customer service responsif di DM Instagram.",
      menuProduk: [
        { name: "Signature Latte", description: "Espresso + susu segar + caramel drizzle", price: "32000" },
        { name: "Matcha Oat Latte", description: "Matcha premium + oat milk", price: "35000" },
      ],
      jamOperasional: "10:00 – 22:00",
      jumlahStaff: "5",
      supplier: "Roastery lokal Jakarta, distributor oat milk impor.",
      prosesOperasional: "Shift pagi dan sore, briefing harian, stok dicek setiap hari sebelum buka.",
      modalAwal: "120000000",
      targetPendapatan: "35000000",
      analisa: "BEP diperkirakan bulan ke-5 dengan asumsi 80 transaksi/hari rata-rata Rp 35.000.",
      kesimpulan: "Kopi Sore Studio menarget segmen yang spesifik dengan potensi loyalitas pelanggan tinggi.",
    },
  },
  {
    id: "3",
    createdAt: "2025-05-12",
    data: {
      businessName: "Laundry Kilat Express",
      businessDescription: "Layanan laundry kilat dengan sistem antar-jemput dan notifikasi WhatsApp.",
      visi: "Menjadi layanan laundry terpercaya dan tercepat di kawasan perumahan.",
      misi: "Memberikan layanan laundry bersih, wangi, dan tepat waktu dengan harga kompetitif.",
      targetPasar: "Penghuni apartemen dan perumahan, karyawan sibuk usia 25–45 tahun.",
      psikografi: "Orang-orang yang mengutamakan efisiensi waktu dan kerapian.",
      trenPasar: "Pertumbuhan layanan on-demand dan meningkatnya penghuni apartemen di kota besar.",
      competitors: [
        { name: "Laundry 5000", strength: "Harga murah", weakness: "Kualitas tidak konsisten" },
      ],
      strategiPemasaran: "Flyer di komplek perumahan, promosi di grup WhatsApp warga, program referral.",
      pelayananPelanggan: "Penjemputan dan pengiriman di hari yang sama, update status via WhatsApp.",
      menuProduk: [
        { name: "Cuci + Setrika", description: "Per kg, selesai 1 hari", price: "8000" },
        { name: "Express 3 Jam", description: "Per kg, selesai 3 jam", price: "15000" },
      ],
      jamOperasional: "08:00 – 17:00",
      jumlahStaff: "2",
      supplier: "Distributor deterjen dan pewangi pakaian lokal.",
      prosesOperasional: "Penjemputan pagi, proses siang, pengiriman sore hari.",
      modalAwal: "20000000",
      targetPendapatan: "12000000",
      analisa: "Dengan 30 kg/hari rata-rata, BEP tercapai dalam 2 bulan.",
      kesimpulan: "Laundry Kilat Express menawarkan solusi praktis dengan modal awal rendah dan ROI cepat.",
    },
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

function BusinessProposalList() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<ProposalDraft[]>(dummyProposals);

  const handleDelete = (id: string) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <Container fluid>
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-end">
          <Stack gap={2}>
            <Text size="xl" fw={700}>Business Proposals</Text>
            <Text size="sm" c="dimmed">
              Manage and view all your business proposals.
            </Text>
          </Stack>
          <Button onClick={() => navigate("/business-proposal")}>
            + New Proposal
          </Button>
        </Group>

        {/* Empty State */}
        {proposals.length === 0 && (
          <Card radius="md" withBorder p="xl">
            <Stack align="center" gap="sm" py="xl">
              <Text fw={500}>No proposals yet</Text>
              <Text size="sm" c="dimmed">Create your first business proposal now.</Text>
              <Button variant="light" onClick={() => navigate("/business-proposal")}>
                Create Now
              </Button>
            </Stack>
          </Card>
        )}

        {/* Proposal Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {proposals.map((proposal) => (
            <Card key={proposal.id} radius="md" withBorder shadow="sm" p="lg">
              <Stack gap="sm">
                <Text fw={700} size="md">
                  {proposal.data.businessName}
                </Text>

                <Text size="sm" c="dimmed" lineClamp={2}>
                  {proposal.data.businessDescription}
                </Text>

                <Text size="xs" c="dimmed">
                  Created:{" "}
                  {new Date(proposal.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>

                <Group gap="xs" mt="xs">
                  <Button
                    size="xs"
                    variant="light"
                    style={{ flex: 1 }}
                    onClick={() => navigate(`/business-proposal/result/${proposal.id}`)}
                  >
                    View PDF
                  </Button>
                  <Menu shadow="md" width={160} position="bottom-end">
                    <Menu.Target>
                      <Button size="xs" variant="default" px="xs">
                        More
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item onClick={() => navigate("/business-proposal")}>
                        Edit
                      </Menu.Item>
                      <Menu.Item color="red" onClick={() => handleDelete(proposal.id)}>
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}

export default BusinessProposalList;
