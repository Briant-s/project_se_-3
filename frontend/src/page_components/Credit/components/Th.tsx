import { Text, Table, UnstyledButton, Center } from "@mantine/core";
import { HiChevronUp, HiChevronDown, HiSelector } from "react-icons/hi";

interface HeaderProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}

function Th({ children, reversed, sorted, onSort }: HeaderProps) {
  const Icon = sorted ? (reversed ? HiChevronUp : HiChevronDown) : HiSelector;
  return (
    <Table.Th p="xs" pl="md" style={{ verticalAlign: "middle" }}>
      <UnstyledButton
        onClick={onSort}
        style={{
          outline: "none",
          background: "none",
          width: "100%",
          display: "block",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            width: "max-content",
            maxWidth: "100%",
          }}
        >
          {/* <Group justify="flex-start" gap="xs" style={{ width: 'fit-content' }}> */}
          <Text fw={500} fz="xs" style={{ whiteSpace: "nowrap" }}>
            {children}
          </Text>
          <Center style={{ flexShrink: 0, opacity: sorted ? 1 : 0.4 }}>
            <Icon size={14} />
          </Center>
        </div>
        {/* </Group> */}
      </UnstyledButton>
    </Table.Th>
  );
}

export default Th;
