import { useEffect, useState } from "react";
import { Container, Stack, Text, Button, Group, Card, Loader } from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import BusinessProposalPDF from "./Business_Proposal_PDF";
import type { ProposalData } from "./Business_Proposal_PDF";
import { getBusinessProposal } from "../services/businessProposalService";
import type { BusinessProposal } from "../services/models";

function BusinessProposalResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState<BusinessProposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchProposal = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const result = await getBusinessProposal(id);
        setProposal(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load proposal");
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [id]);

  if (loading) {
    return (
      <Container fluid>
        <Stack align="center" mt="xl" gap="sm">
          <Loader />
          <Text c="dimmed">Loading proposal...</Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid>
        <Stack align="center" mt="xl" gap="sm">
          <Text c="red">{error}</Text>
          <Button variant="light" onClick={() => navigate("/business-proposal/list") }>
            Back to List
          </Button>
        </Stack>
      </Container>
    );
  }
  if (!proposal) {
    return (
      <Container fluid>
        <Stack align="center" mt="xl" gap="sm">
          <Text fw={600}>Proposal tidak ditemukan.</Text>
          <Button variant="light" onClick={() => navigate("/business-proposal/list")}>
            Back to List
          </Button>
        </Stack>
      </Container>
    );
  }

  const proposalData: ProposalData = {
    businessName: proposal.businessName ?? "",
    businessDescription: proposal.businessDescription ?? "",
    visi: proposal.visi ?? "",
    misi: proposal.misi ?? "",
    targetPasar: proposal.targetPasar ?? "",
    psikografi: proposal.psikografi ?? "",
    trenPasar: proposal.trenPasar ?? "",
    competitors: (proposal.competitors ?? []).map((comp) => ({
      name: comp.name ?? "",
      strength: comp.strength ?? "",
      weakness: comp.weakness ?? "",
    })),
    strategiPemasaran: proposal.strategiPemasaran ?? "",
    pelayananPelanggan: proposal.pelayananPelanggan ?? "",
    menuProduk: (proposal.products ?? []).map((prod) => ({
      name: prod.name ?? "",
      description: prod.description ?? "",
      price: prod.price ?? "",
    })),
    jamOperasional: proposal.jamOperasional ?? "",
    jumlahStaff: String(proposal.jumlahStaff ?? ""),
    supplier: proposal.supplier ?? "",
    prosesOperasional: proposal.prosesOperasional ?? "",
    modalAwal: proposal.modalAwal ?? "",
    targetPendapatan: proposal.targetPendapatan ?? "",
    analisa: proposal.analisa ?? "",
    kesimpulan: proposal.kesimpulan ?? "",
  };

  return (
    <Container fluid>
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-end">
          <Stack gap={2}>
            <Text size="xl" fw={700}>{proposalData.businessName}</Text>
            <Text size="sm" c="dimmed">Business Proposal Preview</Text>
          </Stack>
          <Group gap="xs">
            <Button
              variant="default"
              onClick={() => navigate("/business-proposal/list")}
            >
              Back
            </Button>
            <PDFDownloadLink
              document={<BusinessProposalPDF data={proposalData} />}
              fileName={`${proposalData.businessName?.replace(/\s+/g, "_") ?? "proposal"}_Proposal.pdf`}
            >
              {({ loading }) => (
                <Button disabled={loading}>
                  {loading ? "Menyiapkan..." : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          </Group>
        </Group>

        {/* PDF Viewer */}
        <Card radius="md" withBorder shadow="sm" p={0} style={{ overflow: "hidden" }}>
          <PDFViewer width="100%" height={700} showToolbar={false}>
            <BusinessProposalPDF data={proposalData} />
          </PDFViewer>
        </Card>
      </Stack>
    </Container>
  );
}

export default BusinessProposalResult;
