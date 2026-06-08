import { useCallback, useEffect, useState } from "react";

import {
  Container,
  Stack,
  Text,
  Card,
  Group,
  Button,
  SimpleGrid,
  Menu,
  Loader,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";

import { useNavigate } from "react-router-dom";

import { getBusinessProposals, deleteBusinessProposal } from "../services/businessProposalService";

import type { ProposalData } from "./Business_Proposal_PDF";

import type { BusinessProposal } from "../services/models";



// ─── Types ────────────────────────────────────────────────────────────────────
export interface ProposalDraft {
  id: string | number | null;
  createdAt: string;
  data: ProposalData;
}



// ─── Component ───────────────────────────────────────────────────────────────
function BusinessProposalList() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<ProposalDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const toProposalDraft = useCallback((proposal: BusinessProposal): ProposalDraft => {
    const rawProposal = proposal as unknown as Record<string, unknown>;
      const id = proposal.proposalID;

    return {
      id,
      createdAt:
        proposal.created_at ??
        (rawProposal["createdAt"] as string | undefined) ??
        (rawProposal["created_at"] as string | undefined) ??
        "",
      data: {
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

      },

    };

  }, []);



  useEffect(() => {

    const fetchProposals = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getBusinessProposals();
        console.log("BusinessProposalList fetched proposals", result);
        const sorted = result
          .map(toProposalDraft)
          .sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          });
        setProposals(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load proposals");
      } finally {
        setLoading(false);
      }

    };
    fetchProposals();
  }, [toProposalDraft]);



  const handleDelete = async (id: string) => {
    try {
      await deleteBusinessProposal(id);
      setProposals((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete proposal");
    }
  };

  const confirmDeleteProposal = (id: string) => {
    openConfirmModal({
      title: "Delete Proposal",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this proposal draft? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => handleDelete(id),
    });
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

        {loading ? (
          <Card radius="md" withBorder p="xl">
            <Stack align="center" gap="sm" py="xl">
              <Loader />
              <Text size="sm" c="dimmed">Loading proposals...</Text>
            </Stack>
          </Card>
        ) : (

          <>
            {error && (
              <Text c="red" size="sm">
                {error}
              </Text>
            )}

            {proposals.length === 0 && (
              <Card radius="md" withBorder p="xl">
                <Stack align="center" gap="sm" py="xl">
                  <Text fw={500}>No proposals yet</Text>
                  <Text size="sm" c="dimmed">Create your first business proposal now.</Text>
                  <Button variant="light" onClick={() => navigate("/business-proposal") }>
                    Create Now
                  </Button>
                </Stack>
              </Card>
            )}

        {/* Proposal Cards */}

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">

          {proposals.map((proposal, index) => (

        <Card
          key={`${proposal.id ?? index}-${index}`}
          radius="md"
          withBorder
          shadow="sm"
          p="lg"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}

        >

                <Stack gap="xs" style={{ flex: 1 }}>
                    <Text fw={700} size="md" lineClamp={2} style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                      {proposal.data.businessName}
                    </Text>
                    <Text size="sm" c="dimmed" lineClamp={2}>
                      {proposal.data.businessDescription}
                    </Text>
                  </Stack>



                <Text size="xs" c="dimmed" mt="auto" pt="xs">
                    Created:{" "}
                    {new Date(proposal.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>

                {/* {console.log(proposal)} */}



                <Group gap="xs" mt="xs">
                  <Button
                    size="xs"
                    variant="light"
                    style={{ flex: 1 }}
                    onClick={() => proposal.id != null && navigate(`/ai-business-proposal/result/${proposal.id}`)}
                    // disabled={!proposal.id}
                  >

                    View AI PDF
                  </Button>
                  <Menu shadow="md" width={160} position="bottom-end">
                    <Menu.Target>
                      <Button size="xs" variant="default" px="xs">
                        More
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={() => proposal.id && navigate(`/business-proposal/edit/${proposal.id}`)}
                        // disabled={!proposal.id}
                      >
                        Edit
                      </Menu.Item>

                      <Menu.Item
                        color="red"
                        onClick={() => proposal.id != null && confirmDeleteProposal(String(proposal.id))}
                        // disabled={!proposal.id}
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              {/* </Stack> */}
            </Card>
          ))}
        </SimpleGrid>
          </>
        )}
      </Stack>
    </Container>

  );

}

export default BusinessProposalList; 

