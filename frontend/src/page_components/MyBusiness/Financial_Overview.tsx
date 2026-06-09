import {
  Card,
  Container,
  Group,
  Stack,
  Text,
  Divider,
  Badge,
  Loader,
  Table,
  ActionIcon,
  Modal,
  Button,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { HiTrash } from "react-icons/hi";
import { HiOutlineCreditCard, HiOutlineBanknotes } from "react-icons/hi2";

import { deleteAsset } from "../../services/assetService";

import { DataItem } from "./component";
import { BusinessCard } from "../../components";
import { formatRupiah } from "../../utils/globalFormatter";
import { useBusinessProfile } from "../../hooks/useBusinessProfile";
import { useAssets } from "../../hooks/useAssets";

function FinancialOverview() {
  const { business, loading: businessLoading } = useBusinessProfile();
  const { assets, totalAssetsValue, loading: assetsLoading } = useAssets();
  const [assetsList, setAssetsList] = useState(assets);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setAssetsList(assets);
  }, [assets]);

  const handleDeleteAsset = async () => {
    if (selectedAssetId === null) return;
    setIsDeleting(true);
    try {
      await deleteAsset(String(selectedAssetId));
      setAssetsList(
        assetsList.filter((asset) => asset.assetsID !== selectedAssetId),
      );
      setDeleteModalOpened(false);
      setSelectedAssetId(null);
    } catch (error) {
      console.error("Failed to delete asset:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (assetId: number) => {
    setSelectedAssetId(assetId);
    setDeleteModalOpened(true);
  };

  if (businessLoading || assetsLoading) {
    return (
      <Container fluid>
        <Stack align="center" mt="xl" gap="sm">
          <Loader />
          <Text c="dimmed">Loading financial overview...</Text>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      <Container fluid>
        <Stack gap="lg">
          <BusinessCard
            businessName={business?.businessName ?? undefined}
            businessSector={business?.businessSector ?? undefined}
            businessType={business?.businessType ?? undefined}
          />

          {/* Card 1: Performance & Active Loans - DITAMBAHKAN shadow="sm" */}
          <Card shadow="sm" radius="md" withBorder padding="xl">
            <Stack gap="xl">
              <Group justify="space-between" align="center">
                <Text fw={700} size="lg">
                  Performance & Loans
                </Text>
              </Group>

              {/* Active KUR Loan */}
              {/* <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Active KUR Loan
                </Text>
                <Group justify="space-between" align="center">
                  <Text size="sm" fw={500}>
                    Current Status
                  </Text>
                  <Badge color="gray" variant="light">
                    None
                  </Badge>
                </Group>
              </Stack>

              <Divider /> */}

              {/* Monthly Performance */}
              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Monthly Performance
                </Text>
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <DataItem
                    label="Revenue"
                    value={
                      <Text c="green.7" fw={600}>
                        {formatRupiah(business?.monthlyAverageIncome) ?? "--"}
                      </Text>
                    }
                  />
                  <DataItem
                    label="Profit/Loss"
                    value={
                      <Text fw={600}>
                        {formatRupiah(business?.monthlyAverageProfitLoss) ??
                          "--"}
                      </Text>
                    }
                  />
                </Group>
              </Stack>

              <Divider />

              {/* Payment Methods */}
              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Payment Methods
                </Text>
                <Group gap="md">
                  {(business?.paymentMethod === "Cash" ||
                    business?.paymentMethod === "Both") && (
                    <Badge
                      leftSection={<HiOutlineBanknotes size={14} />}
                      variant="outline"
                      color="gray"
                    >
                      Cash
                    </Badge>
                  )}
                  {(business?.paymentMethod === "Transfer Bank" ||
                    business?.paymentMethod === "Both") && (
                    <Badge
                      leftSection={<HiOutlineCreditCard size={14} />}
                      variant="outline"
                      color="blue"
                    >
                      Transfer Bank
                    </Badge>
                  )}
                  {!business?.paymentMethod && (
                    <Text size="xs" c="dimmed">
                      No payment method set
                    </Text>
                  )}
                </Group>
              </Stack>
            </Stack>
          </Card>

          {/* Card 2: Assets & Liabilities - DITAMBAHKAN shadow="sm" */}
          <Card shadow="sm" radius="md" withBorder padding="xl">
            <Stack gap="xl">
              <Text fw={700} size="lg">
                Assets
              </Text>

              {/* Assets */}
              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Business Assets
                </Text>
                <Group justify="space-between" align="flex-start">
                  <DataItem
                    label="Total Assets Value"
                    value={formatRupiah(totalAssetsValue)}
                  />
                </Group>
                {assets.length > 0 && (
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Asset Name</Table.Th>
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Value</Table.Th>
                        <Table.Th></Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {assetsList.map((asset, index) => (
                        <Table.Tr key={index}>
                          <Table.Td>{asset.assetsName}</Table.Td>

                          <Table.Td>
                            {/* Tambahkan logika dinamis pada properti color */}
                            <Badge
                              size="sm"
                              color={
                                asset.assetsType === "Usaha" ? "blue" : "teal"
                              }
                              variant="light"
                            >
                              {asset.assetsType === "Usaha"
                                ? "Business"
                                : "Personal"}
                            </Badge>
                          </Table.Td>
                          {/*<Table.Td>
                                              <Badge size="sm">
                                                {asset.assetsType === "Usaha"
                                                  ? "Business"
                                                  : "Personal"}
                                              </Badge>
                                            </Table.Td>*/}
                          <Table.Td>
                            Rp{" "}
                            {Number(asset.assetsValue).toLocaleString("id-ID")}
                          </Table.Td>
                          <Table.Td>
                            <ActionIcon
                              size="sm"
                              color="red"
                              variant="light"
                              onClick={() =>
                                openDeleteModal(asset.assetsID || 0)
                              }
                            >
                              <HiTrash
                                style={{ width: "16px", height: "16px" }}
                              />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                )}
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Delete Asset"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete this asset? This action cannot be
            undone.
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              color="gray"
              onClick={() => setDeleteModalOpened(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="light"
              color="red"
              onClick={handleDeleteAsset}
              loading={isDeleting}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}

export default FinancialOverview;
