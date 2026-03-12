import {
  Avatar,
  ActionIcon,
  Box,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  RingProgress,
  Stack,
  Text,
} from "@mantine/core";
import { HiPencil, HiExternalLink, HiOutlineX } from "react-icons/hi";
import { useState } from "react";
import { mockBusinessProfile } from "../mock_user";

function BusinessProfile() {
  const [formReminder, setFormReminder] = useState(true);
  const [firstTimeForm, setFirstTimeForm] = useState(false);
  const { identity, operational, finansial } = mockBusinessProfile;
  const formProgress = 70;
  return (
    <>
      <Container fluid>
        <Stack gap="lg">
          {/* Form Reminder */}
          {formReminder && (
            <SimpleGrid>
              <Card bg="red.5" c="red.2" shadow="md">
                <Group justify="space-between">
                  <Text>You Haven't Filled The Form Yet</Text>
                  <Group>
                    <ActionIcon>
                      <HiExternalLink />
                    </ActionIcon>
                    <ActionIcon onClick={() => setFormReminder(false)}>
                      <HiOutlineX />
                    </ActionIcon>
                  </Group>
                </Group>
              </Card>
            </SimpleGrid>
          )}
          {/* Title Text */}
          <Stack gap="0.5rem">
            <Text size="xl" fw={700}>
              Business Profile Overview
            </Text>
            <Text size="sm">
              Your business profile is a snapshot of your business that lenders
              and financial institutions use to assess your eligibility for
              loans and assistance. Keeping it complete and accurate improves
              your chances of approval.
            </Text>
          </Stack>
          {/* Gradient Background */}
          <Box
            bdrs="md"
            px="md"
            py="sm"
            style={{
              background:
                "linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%)",
            }}
          >
            <SimpleGrid>
              <Stack gap="2rem">
                <Text size="xl" c="white">
                  Business Profile
                </Text>
                <SimpleGrid
                  cols={{ base: 1, sm: 2 }}
                  // negative half of card height
                >
                  <Card shadow="md" radius="md" bg="white">
                    <Stack gap="2rem">
                      <Group justify="space-between">
                        <Avatar radius="xl" color="blue.5" />
                        <ActionIcon>
                          <HiPencil />
                        </ActionIcon>
                      </Group>
                      <Text>{identity.namaBisnis}</Text>
                      <Stack>
                        <Text>Phone Here</Text>
                        <Text>Email Here</Text>
                        <Text>Business Location Here</Text>
                      </Stack>
                    </Stack>
                  </Card>
                  <Card shadow="md" radius="md" bg="white">
                    <Stack gap="2rem">
                      <Group justify="space-between">
                        <Avatar radius="xl" color="blue.5" />
                        <ActionIcon>
                          <HiPencil />
                        </ActionIcon>
                      </Group>
                      <Text>Business Operations</Text>
                      <Stack>
                        <Text>Sector Here</Text>
                        <Text>Business Type Here</Text>
                        <Text>Employee Count:</Text>
                        <Text>Online/Offline/Both</Text>
                      </Stack>
                    </Stack>
                  </Card>
                </SimpleGrid>
              </Stack>
            </SimpleGrid>
          </Box>
          {/* Financial & Quiz Progress Link */}
          <SimpleGrid cols={2}>
            {/* Financial */}
            <Stack>
              <Stack gap="0.5rem">
                <Text size="xl" fw={700}>
                  Financial Overview
                </Text>
                <Text>Financial Sample Text</Text>
                <Card withBorder>
                  <Stack>
                    <Text fw={700}>Financial Overview</Text>
                    <Button rightSection={<HiExternalLink />}>
                      <Text>Go to Financial Page</Text>
                    </Button>
                  </Stack>
                </Card>
              </Stack>
            </Stack>
            {/* Form Progress */}
            <Stack>
              <Stack gap="0.5rem">
                <Text size="xl" fw={700}>
                  Form Progress
                </Text>
                <Text>Business Profile Form Sample Text</Text>
                <Card withBorder>
                  <Group>
                    <Stack>
                      <Text fw={700}>Quiz Progress</Text>
                      <Button rightSection={<HiExternalLink />}>
                        <Text>Continue Quiz</Text>
                      </Button>
                    </Stack>
                    <RingProgress
                      label={
                        <Text
                          ta="center"
                          size="xl"
                          style={{ pointerEvents: "none" }}
                        >
                          {formProgress}
                        </Text>
                      }
                      sections={[{ value: formProgress, color: "orange.5" }]}
                    />
                  </Group>
                </Card>
              </Stack>
            </Stack>
          </SimpleGrid>
        </Stack>
      </Container>
    </>
  );
}

export default BusinessProfile;
