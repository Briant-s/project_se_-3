import {
  ActionIcon,
  Button,
  Card,
  Container,
  Group,
  RingProgress,
  Stack,
  Text,
  Divider,
} from "@mantine/core";
import { HiPencil, HiExternalLink, HiOutlineX } from "react-icons/hi";
import { useState, useEffect } from "react";
import { mockBusinessProfile } from "../../mock_user";
import { getBusinessProfile } from "../../services/businessProfileService";
import type { BusinessProfile } from "../../services/models";
import { DataItem } from "./component";
function BusinessProfile() {
  const [formReminder, setFormReminder] = useState(true);
  const { operational } = mockBusinessProfile;
  // const formProgress = 70;
  const [formProgress, setFormProgress] = useState(0);
  const [business, setBusiness] = useState<BusinessProfile | null>();

  const calculateFormCompletion = (
    business: BusinessProfile | null | undefined,
  ): number => {
    if (!business) return 0;
    const fields = [
      business.businessName,
      business.businessAge,
      business.ownerName,
      business.businessLocation,
      business.businessType,
      business.businessSector,
      business.totalEmployees,
      business.storeType,
      business.monthlyAverageIncome,
      business.monthlyAverageProfitLoss,
      business.businessAssets,
      business.isOtherKredit,
    ];
    const filled = fields.filter(
      (value) => value !== null && value !== undefined && value !== "",
    ).length;
    return Math.round((filled / fields.length) * 100);
  };

  // Fetch Business
  useEffect(() => {
    const fetchBusiness = async () => {
      const result = await getBusinessProfile();
      setBusiness(result);
      const completion = calculateFormCompletion(result);
      setFormProgress(completion);
      setFormReminder(completion < 100);
    };
    fetchBusiness();
  }, []);

  return (
    <>
      <Container fluid>
        <Stack gap="lg">
          {/* Form Reminder */}
          {formReminder && (
            <Card
              withBorder
              shadow="sm"
              radius="md"
              p="sm"
              style={{
                backgroundColor: "var(--mantine-color-red-light)",
                borderColor: "var(--mantine-color-red-light-hover)",
                borderLeft: "4px solid var(--mantine-color-red-filled)",
              }}
            >
              <Group justify="space-between" wrap="nowrap">
                <Group gap="sm">
                  <Stack gap={0}>
                    <Text size="sm" fw={600} c="red.9">
                      Action Required: Profile Incomplete
                    </Text>
                    <Text size="xs" c="red.8">
                      You haven't filled out the business form yet. Complete it
                      to get a better financial assessment.
                    </Text>
                  </Stack>
                </Group>

                <Group gap="xs">
                  <Button
                    variant="white"
                    color="red"
                    size="compact-xs"
                    radius="xl"
                    rightSection={<HiExternalLink size={14} />}
                  >
                    Fill Now
                  </Button>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    size="sm"
                    onClick={() => setFormReminder(false)}
                  >
                    <HiOutlineX size={16} />
                  </ActionIcon>
                </Group>
              </Group>
            </Card>
          )}

          {/* Header Title */}
          {/* <Stack gap="xs">
            <Text size="xl" fw={700}>Business Profile Overview</Text>
            <Text size="sm" c="dimmed">
              Your business profile is a snapshot used by lenders to assess eligibility. 
              Keeping it accurate improves your chances of approval.
            </Text>
          </Stack> */}

          {/* Section 1: Main Profile & Operations */}
          <Card shadow="sm" radius="md" withBorder padding="xl">
            <Stack gap="xl">
              <Group justify="space-between">
                <Text fw={700} size="lg">
                  {business?.businessName}
                </Text>
                <ActionIcon variant="subtle" color="gray">
                  <HiPencil />
                </ActionIcon>
              </Group>

              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Business Contact
                </Text>
                <Group justify="space-between" align="flex-start">
                  <DataItem
                    label="Phone"
                    value={business?.businessContactNumber ?? "--"}
                  />
                  <DataItem
                    label="Email"
                    value={business?.businessEmail ?? "--"}
                  />
                  <DataItem
                    label="Location"
                    value={business?.businessLocation ?? "--"}
                  />
                </Group>
              </Stack>

              <Divider />

              <Stack gap="xs">
                <Text size="sm" c="dimmed" fw={500}>
                  Business Operations
                </Text>
                <Group justify="space-between" align="flex-start">
                  <DataItem
                    label="Sector"
                    value={business?.businessSector ?? "--"}
                  />
                  <DataItem
                    label="Business Type"
                    value={business?.businessType ?? "--"}
                  />
                  <DataItem
                    label="Employees"
                    value={business?.totalEmployees ?? "--"}
                  />
                  <DataItem
                    label="Operating"
                    value={business?.storeType ?? "--"}
                  />
                </Group>
              </Stack>
            </Stack>
          </Card>

          {/* Section 2: Financial & Readiness*/}
          <Card shadow="sm" radius="md" withBorder padding="xl">
            <Stack gap="xl">
              <Text fw={700} size="lg">
                Business Readiness
              </Text>

              {/* Financial Row */}
              <Group justify="space-between" align="center">
                <Stack gap={0} style={{ flex: 1 }}>
                  <Text fw={600} size="sm">
                    Financial Overview
                  </Text>
                  <Text size="xs" c="dimmed">
                    Review your latest financial statements and health score.
                  </Text>
                </Stack>
                <Button
                  variant="light"
                  rightSection={<HiExternalLink />}
                  size="xs"
                >
                  View Financials
                </Button>
              </Group>

              <Divider />

              {/* Form Progress Row */}
              <Group justify="space-between" align="center">
                <Group gap="lg" style={{ flex: 1 }}>
                  <RingProgress
                    size={80}
                    thickness={8}
                    roundCaps
                    label={
                      <Text ta="center" fw={700} size="xs">
                        {formProgress}%
                      </Text>
                    }
                    sections={[{ value: formProgress, color: "blue" }]}
                  />
                  <Stack gap={0}>
                    <Text fw={600} size="sm">
                      Form Completion
                    </Text>
                    <Text size="xs" c="dimmed">
                      Complete your business profile quiz to unlock more
                      features.
                    </Text>
                  </Stack>
                </Group>
                <Button rightSection={<HiExternalLink />} size="xs">
                  Continue Quiz
                </Button>
              </Group>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </>
  );
}

export default BusinessProfile;
