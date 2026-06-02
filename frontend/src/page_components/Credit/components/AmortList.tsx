import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  Table,
  Text,
  TextInput,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import type { AmortEntry } from "../../../services/models";
import {
  HiSearch,
  HiFilter,
  HiPencil,
  HiTrash,
  HiOutlineReply,
} from "react-icons/hi";
import Th from "./Th";
import { HealthBadge, KURBadge } from "../../../eligibility/component";
import { useNavigate } from "react-router-dom";
import { formatRupiah } from "../../../utils/globalFormatter";
import { useMemo, useState } from "react";

interface AmortListProps {
  entries: AmortEntry[];
  openForm: (entry?: AmortEntry) => void;
  confirmDelete: (amort_id: number, title: string) => void;
  compact?: boolean;
}

type SortField =
  | "title"
  | "creditID"
  | "health_status"
  | "tenorMonth"
  | "totalInstallment"
  | "principalAmount";

interface SortState {
  field: SortField | null;
  reversed: boolean;
}

function AmortList({
  entries,
  openForm,
  confirmDelete,
  compact,
}: AmortListProps) {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortState>({ field: null, reversed: false });

  function handleSort(field: SortField) {
    setSort((prev) =>
      prev.field === field
        ? { field, reversed: !prev.reversed }
        : { field, reversed: false },
    );
  }

  function thProps(field: SortField) {
    return {
      sorted: sort.field === field,
      reversed: sort.reversed,
      onSort: () => handleSort(field),
    };
  }

  const sortedEntries = useMemo(() => {
    const filtered = entries.filter((entry) =>
      entry.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (!sort.field) return filtered;

    return [...filtered].sort((a, b) => {
      const aVal = a[sort.field!];
      const bVal = b[sort.field!];

      let result = 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        result = aVal.localeCompare(bVal);
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        result = aVal - bVal;
      }

      return sort.reversed ? -result : result;
    });
  }, [entries, searchQuery, sort]);

  const AmortRows = sortedEntries.map((entry) => (
    <Table.Tr key={entry.amortID}>
      {/* Title */}
      <Table.Td>{entry.title}</Table.Td>
      <Table.Td>
        <KURBadge type={entry.creditID ?? 0} />
      </Table.Td>
      <Table.Td>
        <HealthBadge type={entry.health_status} />
      </Table.Td>
      <Table.Td>{entry.tenorMonth} months</Table.Td>
      {!compact && <Table.Td>{formatRupiah(entry.totalInstallment)}</Table.Td>}
      {!compact && <Table.Td>{formatRupiah(entry.principalAmount)}</Table.Td>}
      <Table.Td>
        {" "}
        <Group gap="xs">
          <ActionIcon
            variant="filled"
            radius="md"
            onClick={() => openForm(entry)}
          >
            <HiPencil />
          </ActionIcon>
          <ActionIcon
            variant="filled"
            radius="md"
            onClick={() => confirmDelete(entry.amortID!, entry.title)}
          >
            <HiTrash />
          </ActionIcon>
          <ActionIcon
            variant="filled"
            radius="md"
            onClick={() => navigate(`/credit/amort-calc/${entry.amortID}`)}
          >
            <HiOutlineReply style={{ transform: "scaleX(-1)" }} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Card px="md" py="md" withBorder>
      <Group justify="space-between" pb={20}>
        <Group>
          <Text>Total Calculations :</Text>
          <Text>{sortedEntries.length}</Text>
        </Group>
        <Group>
          <TextInput
            placeholder="Search by Title"
            leftSection={<HiSearch size={14} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
          />
        </Group>
      </Group>
      <Box mx="-md">
        <Table
          horizontalSpacing="md"
          verticalSpacing="xs"
          miw={700}
          layout="fixed"
          px={0}
        >
          <Table.Thead bg="#ebebeb">
            <Table.Tr>
              <Th {...thProps("title")}>Title</Th>
              <Th {...thProps("creditID")}>Credit Type</Th>
              <Th {...thProps("health_status")}>Health</Th>
              <Th {...thProps("tenorMonth")}>Tenor Months</Th>
              {!compact && (
                <Th {...thProps("totalInstallment")}>Total Installment</Th>
              )}
              {!compact && (
                <Th {...thProps("principalAmount")}>Principal Amount</Th>
              )}
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {entries.length === 0 ? (
              // 1. Genuinely Empty State
              <Table.Tr>
                <Table.Td colSpan={compact ? 5 : 7}>
                  <Stack align="center" justify="center" py="xl" gap="sm">
                    <Text c="dimmed">
                      You haven't created any calculations yet.
                    </Text>
                    <Button bg={theme.primaryColor} onClick={() => openForm()}>
                      Create New Calculation
                    </Button>
                  </Stack>
                </Table.Td>
              </Table.Tr>
            ) : sortedEntries.length > 0 ? (
              // 2. Normal State (Search matches found)
              AmortRows
            ) : (
              // 3. Search Empty State
              <Table.Tr>
                <Table.Td colSpan={compact ? 5 : 7}>
                  <Stack align="center" justify="center" py="xl">
                    <Text c="dimmed">
                      No entries found matching "{searchQuery}"
                    </Text>
                  </Stack>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>
    </Card>
  );
}

export default AmortList;
