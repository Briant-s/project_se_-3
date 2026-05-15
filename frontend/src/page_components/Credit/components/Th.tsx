import { Text, Table, UnstyledButton, Group, Center } from "@mantine/core";
import { HiChevronUp, HiChevronDown, HiSelector } from "react-icons/hi";

interface HeaderProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  //   onSort: () => void;
}

function Th({ children, reversed, sorted }: HeaderProps) {
  const Icon = sorted ? (reversed ? HiChevronUp : HiChevronDown) : HiSelector;
  return (
    <Table.Th>
      <UnstyledButton w="100%" h="100%" p="sm">
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center>
            <Icon size={16} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

export default Th;
