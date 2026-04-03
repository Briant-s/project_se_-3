import {
  ActionIcon,
  Box,
  Button,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  Modal,
  Paper,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { HiOutlinePlus } from "react-icons/hi";
import { modals } from "@mantine/modals";

function Amort_Calc() {
  const [opened, { open, close }] = useDisclosure(false);

  const openForm = () =>
    modals.open({
      title: "Add New Calculation",
      children: (
        <>
          <Stack>
            <TextInput label="Calculation Name" />
            <Group>
              <TextInput type="number" label="Total Installment" />
              <TextInput type="number" label="Tenor Months" />
            </Group>
          </Stack>
          <Button fullWidth onClick={() => modals.closeAll()} mt="md">
            Submit
          </Button>
        </>
      ),
    });

  return (
    <>
      <Container fluid>
        <Stack gap="md" m="xl">
          {/* List Header */}
          <Group justify="space-between">
            <Text>Loan Calculation List</Text>
            <ActionIcon onClick={openForm}>
              <HiOutlinePlus />
            </ActionIcon>
          </Group>
          <Divider />
          {/* List */}
        </Stack>
      </Container>
    </>
  );
}

export default Amort_Calc;
