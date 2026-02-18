import {
  Card,
  Container,
  Grid,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";

function Dashboard() {
  return (
    <>
      <Container fluid>
        <Stack gap="lg">
          <Text>This is Dashboard Page</Text>
          <SimpleGrid
            cols={{ base: 1, sm: 1, lg: 1 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
          >
            <SimpleGrid cols={1}>
              <Stack gap={"0.5rem"}>
                <Text>Business' Health</Text>
                <Card radius="md" bg="green">
                  <Text>This is where</Text>
                  <Text> AI SENTIMENT HERE</Text>
                </Card>
              </Stack>
            </SimpleGrid>
          </SimpleGrid>
        </Stack>
      </Container>
    </>
  );
}

export default Dashboard;
