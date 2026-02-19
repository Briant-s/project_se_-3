import {
  Box,
  Card,
  Center,
  Container,
  Grid,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Image,
} from "@mantine/core";

function BusinessProfile() {
  return (
    <>
      <Container fluid>
        <Stack gap="lg">
          <Stack gap="0.5rem">
            <Text size="xl" fw={700}>
              Business Profile Overview
            </Text>
            <Text>
              Your business profile is a snapshot of your business that lenders
              and financial institutions use to assess your eligibility for
              loans and assistance. Keeping it complete and accurate improves
              your chances of approval.
            </Text>
          </Stack>
          <SimpleGrid
            cols={{ base: 1, sm: 1, lg: 1 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
          >
            <SimpleGrid cols={1}>
              <Card radius="md" bg="yellow.4">
                <Stack gap="0.05rem">
                  <Text size="xl" fw={700} c="white">
                    Warning!!!
                  </Text>
                  <Text size="md" fw={700}>
                    Business Profile is incomplete, complete now
                  </Text>
                </Stack>
              </Card>
            </SimpleGrid>
            {/* Business Identity */}
            <SimpleGrid>
              <Card bg="violet.3">
                <Stack>
                  <Group>
                    <Text size="lg" fw={700}>
                      Business Name Here
                    </Text>
                  </Group>
                  <Group>
                    <Text>Ownership Type</Text>
                    <Text>Business Type</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text>Profile :</Text>
                    <Text>50%</Text>
                  </Group>
                  <Progress value={50} color="green.5" size="md" radius="sm" />
                </Stack>
              </Card>
            </SimpleGrid>
            {/* Business Details */}
            <SimpleGrid cols={2}>
              <Card bg="gray">
                <Stack>
                  <Text size="lg" fw={700}>
                    Business Details
                  </Text>
                  <Stack gap="0.5rem">
                    <Text>Registered: </Text>
                    <Text>Est.: </Text>
                    <Text>Scale: </Text>
                  </Stack>
                </Stack>
              </Card>
              <Card bg="gray">
                <Stack>
                  <Text size="lg" fw={700}>
                    Location
                  </Text>
                  <Text>
                    Jl. Raya Kb. Jeruk No.27, RT.1/RW.9, Kemanggisan, Kec.
                    Palmerah, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta
                    11530
                  </Text>
                </Stack>
              </Card>
            </SimpleGrid>
            {/* Contacts */}
            <SimpleGrid cols={1}>
              <Card bg="blue">
                <Stack>
                  <Text size="lg" fw={700}>
                    Owner & Contacts
                  </Text>
                  <Group>
                    <Text>Owner Name</Text>
                    <Text>Owner Email</Text>
                    <Text>Owner Number</Text>
                  </Group>
                </Stack>
              </Card>
            </SimpleGrid>
          </SimpleGrid>
        </Stack>
      </Container>
    </>
  );
}

export default BusinessProfile;
