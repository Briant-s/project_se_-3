import {
  ActionIcon,
  Box,
  Button,
  Card,
  Group,
  Table,
  Text,
  TextInput,
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
import { KURBadge } from "../../../eligibility/component";
import { useNavigate } from "react-router-dom";

interface AmortListProps {
  entries: AmortEntry[];
  openForm: (entry?: AmortEntry) => void;
  confirmDelete: (amort_id: number, title: string) => void;
  compact?: boolean;
}

function AmortList({
  entries,
  openForm,
  confirmDelete,
  compact,
}: AmortListProps) {
  const navigate = useNavigate();
  const AmortRows = entries.map((entry) => (
    <Table.Tr key={entry.amortID}>
      {/* Title */}
      <Table.Td>{entry.title}</Table.Td>
      <Table.Td>
        <KURBadge type={entry.creditID ?? 0} />
      </Table.Td>
      <Table.Td>{entry.healthStatus ?? null}</Table.Td>
      <Table.Td>{entry.tenorMonth}</Table.Td>
      {!compact && <Table.Td>{entry.totalInstallment}</Table.Td>}
      {!compact && <Table.Td>{entry.principalAmount}</Table.Td>}
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
          <Text>{entries.length}</Text>
        </Group>
        <Group>
          <TextInput
            placeholder="Search by Title"
            leftSection={<HiSearch size={14} />}
          />
          <Button leftSection={<HiFilter size={14} />}>Filter</Button>
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
          <Table.Tbody bg="#ebebeb">
            <Table.Tr>
              <Th sorted={false} reversed={false}>
                Title
              </Th>
              <Th sorted={false} reversed={false}>
                Credit Type
              </Th>

              <Th sorted={false} reversed={false}>
                Health
              </Th>
              <Th sorted={false} reversed={false}>
                Tenor Months
              </Th>
              {!compact && (
                <Th sorted={false} reversed={false}>
                  Total Installment
                </Th>
              )}
              {!compact && (
                <Th sorted={false} reversed={false}>
                  Principal Amount
                </Th>
              )}
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Tbody>
          <Table.Tbody>{AmortRows}</Table.Tbody>
        </Table>
      </Box>
    </Card>
  );
}

export default AmortList;
