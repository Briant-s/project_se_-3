import {
  Button,
  Card,
  Container,
  Group,
  NumberInput,
  Select,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
  SimpleGrid,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { useState } from "react";
import { HiArrowRight, HiArrowLeft, HiCheck, HiArrowDownOnSquare } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

function ProfileQuiz() {
  const [active, setActive] = useState(0);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  // Fungsi untuk mensimulasikan simpan data per bagian
  const handleSaveProgress = () => {
    setSaving(true);
    // Simulasi API Call
    setTimeout(() => {
      setSaving(false);
      alert(`Progress for Step ${active + 1} saved successfully!`);
    }, 1000);
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Stack gap={5}>
          <Title order={2}>Business Profile Quiz</Title>
          <Text c="dimmed" size="sm">
            Please complete the following details. You can save your progress at any step.
          </Text>
        </Stack>

        <Card withBorder padding="xl" radius="md" shadow="sm">
          <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false} breakpoint="sm">
            
            {/* STEP 1: Business Identity */}
            <Stepper.Step label="Identity" description="Basic Info">
              <Stack gap="md" mt="xl">
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <TextInput label="Business Name" placeholder="e.g. Warung Maju Jaya" withAsterisk />
                  <TextInput label="Business Owner Name" placeholder="Your Full Name" withAsterisk />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <Select 
                    label="Business Age" 
                    placeholder="Select duration"
                    data={['< 1 Year', '1-2 Years', '3-5 Years', '> 5 Years']} 
                  />
                  <TextInput label="Owner Date of Birth" type="date" />
                </SimpleGrid>
                <TextInput label="Business Location" placeholder="City or Full Address" />
                <Select 
                  label="Business Bank Account" 
                  placeholder="Select Bank"
                  data={['BCA', 'Mandiri', 'BNI', 'BRI', 'Other']} 
                />
              </Stack>
            </Stepper.Step>

            {/* STEP 2: Operational Business */}
            <Stepper.Step label="Operational" description="Business Details">
              <Stack gap="md" mt="xl">
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <Select 
                    label="Business Sector" 
                    placeholder="Select Sector"
                    data={['Retail', 'F&B', 'Services', 'Manufacturing', 'Technology']} 
                  />
                  <Select 
                    label="Business Type" 
                    placeholder="Select Type"
                    data={['Product', 'Service', 'Both']} 
                  />
                </SimpleGrid>
                <NumberInput label="Employee Count" placeholder="0" min={0} />
                <Select 
                  label="Store Type" 
                  placeholder="Select Model"
                  data={['Online', 'Offline', 'Both (Omnichannel)']} 
                />
              </Stack>
            </Stepper.Step>

            {/* STEP 3: Financial */}
            <Stepper.Step label="Financial" description="Financial Health">
              <Stack gap="md" mt="xl">
                <Select 
                  label="Monthly Revenue Range" 
                  placeholder="Select Range"
                  data={['< 10M', '10-50M', '50-100M', '> 100M']} 
                />
                <Select 
                  label="Monthly Profit/Loss Range" 
                  placeholder="Select Range"
                  data={['Net Loss', '< 5M', '5-20M', '> 20M']} 
                />
                <TextInput label="Business Assets" placeholder="e.g. Land, Vehicle, Tools" />
                <Select 
                  label="Existing Loans?" 
                  placeholder="Select Status"
                  data={['None', 'Active', 'Settled']} 
                />
              </Stack>
            </Stepper.Step>

            <Stepper.Completed>
              <Stack align="center" py="xl" gap="sm">
                <Text fw={700} size="lg">All set! Data submitted.</Text>
                <Text c="dimmed" size="sm" ta="center">
                  Thank you for completing your business profile.
                </Text>
                <Button 
                  color="green" 
                  leftSection={<HiCheck />} 
                  onClick={() => navigate('/my-business/business-profile')} 
                  mt="md"
                >
                  View My Profile
                </Button>
              </Stack>
            </Stepper.Completed>
          </Stepper>

          {active < 3 && (
            <Group justify="space-between" mt="xl">
              {/* Grup Kiri: Tombol Back */}
              <Group>
                {active !== 0 && (
                  <Button variant="default" onClick={prevStep} leftSection={<HiArrowLeft />}>
                    Back
                  </Button>
                )}
              </Group>

              {/* Grup Kanan: Tombol Save dan Next */}
              <Group gap="sm">
                <Button 
                  variant="light" 
                  color="blue" 
                  onClick={handleSaveProgress}
                  loading={saving}
                >
                  Save Progress
                </Button>
                
                <Button onClick={nextStep} rightSection={<HiArrowRight />}>
                  {active === 2 ? 'Finish' : 'Next'}
                </Button>
              </Group>
            </Group>
          )}
        </Card>
      </Stack>
    </Container>
  );
}

export default ProfileQuiz;