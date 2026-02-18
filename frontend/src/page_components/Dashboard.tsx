import {
  Card,
  Container,
  Grid,
  Group,
  Paper,
  RingProgress,
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
                  <Group justify="space-between">
                    <Stack gap="0.05rem">
                      <Text size="md" fw={700}>
                        This is where
                      </Text>
                      <Text size="xl" fw={700} c="white">
                        AI Sentiment Given Here
                      </Text>
                    </Stack>
                    <RingProgress
                      size={80}
                      thickness={6}
                      rootColor="gray.4"
                      sections={[{ value: 70, color: "white" }]}
                      label={
                        <Text c="white" fw={700} ta="center">
                          70%
                        </Text>
                      }
                    ></RingProgress>
                  </Group>
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
