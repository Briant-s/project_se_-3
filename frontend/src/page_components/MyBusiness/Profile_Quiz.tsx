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
} from "@mantine/core";
import { useState } from "react";
import { HiArrowRight, HiArrowLeft, HiCheck } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

function ProfileQuiz() {
  const [active, setActive] = useState(0);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // 1. State untuk menyimpan data inputan
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    businessAge: null as string | null,
    ownerDob: "",
    businessLocation: "",
    bankAccount: null as string | null,
    sector: null as string | null,
    businessType: null as string | null,
    employeeCount: "" as number | "",
    storeType: null as string | null,
    revenueRange: null as string | null,
    profitLossRange: null as string | null,
    assets: "",
    existingLoans: null as string | null,
  });

  // 2. State untuk menyimpan pesan error
  const [errors, setErrors] = useState<Record<string, string>>({});

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  // 3. Fungsi Validasi sebelum pindah step
  const handleNext = () => {
    const newErrors: Record<string, string> = {};

    // Validasi Step 1
    if (active === 0) {
      if (!formData.businessName) newErrors.businessName = "This field is required";
      if (!formData.ownerName) newErrors.ownerName = "This field is required";
      if (!formData.businessAge) newErrors.businessAge = "Please select an option";
      if (!formData.ownerDob) newErrors.ownerDob = "Please enter a date";
      if (!formData.businessLocation) newErrors.businessLocation = "This field is required";
      if (!formData.bankAccount) newErrors.bankAccount = "Please select a bank";
    }

    // Validasi Step 2
    if (active === 1) {
      if (!formData.sector) newErrors.sector = "Please select a sector";
      if (!formData.businessType) newErrors.businessType = "Please select a type";
      if (formData.employeeCount === "") newErrors.employeeCount = "This field is required";
      if (!formData.storeType) newErrors.storeType = "Please select a store type";
    }

    // Validasi Step 3
    if (active === 2) {
      if (!formData.revenueRange) newErrors.revenueRange = "Please select a range";
      if (!formData.profitLossRange) newErrors.profitLossRange = "Please select a range";
      if (!formData.assets) newErrors.assets = "This field is required";
      if (!formData.existingLoans) newErrors.existingLoans = "Please select an option";
    }

    // Jika ada error, simpan ke state dan STOP (jangan pindah step)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Jika aman, bersihkan error dan lanjut
    setErrors({});
    setActive((current) => (current < 3 ? current + 1 : current));
  };

  const handleSaveProgress = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert(`Progress for Step ${active + 1} saved successfully!`);
      // Kamu bisa console.log(formData) di sini untuk melihat data yang tersimpan
    }, 1000);
  };

  // Fungsi helper untuk update state form
  const updateForm = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    // Hapus error saat user mulai ngetik/milih
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined } as any);
    }
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
                  <TextInput 
                    label="Business Name" placeholder="e.g. Warung Maju Jaya" withAsterisk 
                    value={formData.businessName} onChange={(e) => updateForm("businessName", e.currentTarget.value)}
                    error={errors.businessName}
                  />
                  <TextInput 
                    label="Business Owner Name" placeholder="Your Full Name" withAsterisk 
                    value={formData.ownerName} onChange={(e) => updateForm("ownerName", e.currentTarget.value)}
                    error={errors.ownerName}
                  />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <Select 
                    label="Business Age" placeholder="Select duration" withAsterisk
                    data={['< 1 Year', '1-2 Years', '3-5 Years', '> 5 Years']} 
                    value={formData.businessAge} onChange={(val) => updateForm("businessAge", val)}
                    error={errors.businessAge}
                  />
                  <TextInput 
                    label="Owner Date of Birth" type="date" withAsterisk
                    value={formData.ownerDob} onChange={(e) => updateForm("ownerDob", e.currentTarget.value)}
                    error={errors.ownerDob}
                  />
                </SimpleGrid>
                <TextInput 
                  label="Business Location" placeholder="City or Full Address" withAsterisk
                  value={formData.businessLocation} onChange={(e) => updateForm("businessLocation", e.currentTarget.value)}
                  error={errors.businessLocation}
                />
                <Select 
                  label="Business Bank Account" placeholder="Select Bank" withAsterisk
                  data={['BCA', 'Mandiri', 'BNI', 'BRI', 'Other']} 
                  value={formData.bankAccount} onChange={(val) => updateForm("bankAccount", val)}
                  error={errors.bankAccount}
                />
              </Stack>
            </Stepper.Step>

            {/* STEP 2: Operational Business */}
            <Stepper.Step label="Operational" description="Business Details">
              <Stack gap="md" mt="xl">
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <Select 
                    label="Business Sector" placeholder="Select Sector" withAsterisk
                    data={['Retail', 'F&B', 'Services', 'Manufacturing', 'Technology']} 
                    value={formData.sector} onChange={(val) => updateForm("sector", val)}
                    error={errors.sector}
                  />
                  <Select 
                    label="Business Type" placeholder="Select Type" withAsterisk
                    data={['Product', 'Service', 'Both']} 
                    value={formData.businessType} onChange={(val) => updateForm("businessType", val)}
                    error={errors.businessType}
                  />
                </SimpleGrid>
                <NumberInput 
                  label="Employee Count" placeholder="0" min={0} withAsterisk
                  value={formData.employeeCount} onChange={(val) => updateForm("employeeCount", val)}
                  error={errors.employeeCount}
                />
                <Select 
                  label="Store Type" placeholder="Select Model" withAsterisk
                  data={['Online', 'Offline', 'Both (Omnichannel)']} 
                  value={formData.storeType} onChange={(val) => updateForm("storeType", val)}
                  error={errors.storeType}
                />
              </Stack>
            </Stepper.Step>

            {/* STEP 3: Financial */}
            <Stepper.Step label="Financial" description="Financial Health">
              <Stack gap="md" mt="xl">
                <Select 
                  label="Monthly Revenue Range" placeholder="Select Range" withAsterisk
                  data={['< 10M', '10-50M', '50-100M', '> 100M']} 
                  value={formData.revenueRange} onChange={(val) => updateForm("revenueRange", val)}
                  error={errors.revenueRange}
                />
                <Select 
                  label="Monthly Profit/Loss Range" placeholder="Select Range" withAsterisk
                  data={['Net Loss', '< 5M', '5-20M', '> 20M']} 
                  value={formData.profitLossRange} onChange={(val) => updateForm("profitLossRange", val)}
                  error={errors.profitLossRange}
                />
                <TextInput 
                  label="Business Assets" placeholder="e.g. Land, Vehicle, Tools" withAsterisk
                  value={formData.assets} onChange={(e) => updateForm("assets", e.currentTarget.value)}
                  error={errors.assets}
                />
                <Select 
                  label="Existing Loans?" placeholder="Select Status" withAsterisk
                  data={['None', 'Active', 'Settled']} 
                  value={formData.existingLoans} onChange={(val) => updateForm("existingLoans", val)}
                  error={errors.existingLoans}
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
              <Group>
                {active !== 0 && (
                  <Button variant="default" onClick={prevStep} leftSection={<HiArrowLeft />}>
                    Back
                  </Button>
                )}
              </Group>

              <Group gap="sm">
                <Button 
                  variant="light" 
                  color="blue" 
                  onClick={handleSaveProgress}
                  loading={saving}
                >
                  Save Progress
                </Button>
                
                {/* Ganti onClick menjadi handleNext */}
                <Button onClick={handleNext} rightSection={<HiArrowRight />}>
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