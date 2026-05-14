import { Container, Stack, Text, Button, Group, Card, Loader } from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import BusinessProposalPDF from "./Business_Proposal_PDF";
import { dummyProposals } from "./Business_Proposal_List";

function BusinessProposalResult() {
  const { id } = useParams();
  const navigate = useNavigate();

  const proposal = dummyProposals.find((p) => p.id === id);

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

  return (
    <Container fluid>
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between" align="flex-end">
          <Stack gap={2}>
            <Text size="xl" fw={700}>{proposal.data.businessName}</Text>
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
              document={<BusinessProposalPDF data={proposal.data} />}
              fileName={`${proposal.data.businessName.replace(/\s+/g, "_")}_Proposal.pdf`}
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
            <BusinessProposalPDF data={proposal.data} />
          </PDFViewer>
        </Card>
      </Stack>
    </Container>
  );
}

export default BusinessProposalResult;
