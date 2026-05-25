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
  SegmentedControl,
  Loader,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { HiArrowRight, HiArrowLeft, HiCheck } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import {
  createBusinessProfile,
  getBusinessProfile,
  updateBusinessProfile,
} from "../../services/businessProfileService";
import type {
  BusinessProfileForm,
  BusinessProfile,
} from "../../services/models";

function ProfileQuiz() {
  const [active, setActive] = useState(0);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // A helper function to adjust typing, just ignore
  const toBusinessProfile = (
    formData: BusinessProfileForm,
  ): BusinessProfile => ({
    businessName: formData.businessName,
    ownerName: formData.ownerName,
    businessAge: formData.businessAge !== "" ? formData.businessAge : undefined,
    totalEmployees:
      formData.totalEmployees !== "" ? Number(formData.totalEmployees) : null,
    monthlyAverageIncome:
      formData.monthlyAverageIncome !== ""
        ? formData.monthlyAverageIncome
        : undefined,
    monthlyAverageProfitLoss:
      formData.monthlyAverageProfitLoss !== ""
        ? formData.monthlyAverageProfitLoss
        : undefined,
    isProfitable: formData.isProfitable ?? undefined,
    // rest pass through directly
    ownerDob: formData.ownerDob,
    businessLocation: formData.businessLocation,
    businessBankAcc: formData.businessBankAcc,
    businessSector: formData.businessSector,
    businessType: formData.businessType,
    storeType: formData.storeType,
    businessAssets: formData.businessAssets,
    isOtherKredit: formData.isOtherKredit,
    umkmUnlockLevel: formData.umkmUnlockLevel,
    businessContactNumber: formData.businessContactNumber,
    businessEmail: formData.businessEmail,
  });

  // 1. State untuk menyimpan data inputan
  const [formData, setFormData] = useState<BusinessProfileForm>({
    businessName: "",
    ownerName: "",
    businessAge: "",
    ownerDob: "",
    businessLocation: "",
    businessBankAcc: null,
    businessSector: null,
    businessType: null,
    totalEmployees: "",
    storeType: null,
    monthlyAverageIncome: "",
    monthlyAverageProfitLoss: "",
    businessAssets: "",
    isOtherKredit: null,
    umkmUnlockLevel: null,
    businessContactNumber: "",
    businessEmail: "",
    isProfitable: null,
    businessAgeYears: "" as number | "",
    businessAgeMonths: "" as number | "",
  });

  // 2. State untuk menyimpan pesan error
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileExists, setProfileExists] = useState(false);

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getBusinessProfile();
        if (!profile) return;

        setFormData({
          businessName: profile.businessName || "",
          ownerName: profile.ownerName || "",
          businessAge: profile.businessAge ?? "",
          ownerDob: profile.ownerDob || "",
          businessLocation: profile.businessLocation || "",
          businessBankAcc: profile.businessBankAcc || null,
          businessSector: profile.businessSector || null,
          businessType: profile.businessType || null,
          totalEmployees:
            typeof profile.totalEmployees === "number"
              ? profile.totalEmployees
              : profile.totalEmployees
                ? Number(profile.totalEmployees)
                : "",
          storeType: profile.storeType || null,
          monthlyAverageIncome: profile.monthlyAverageIncome ?? "",
          monthlyAverageProfitLoss: profile.monthlyAverageProfitLoss ?? "",
          businessAssets: profile.businessAssets || "",
          isOtherKredit: profile.isOtherKredit || null,
          umkmUnlockLevel: profile.umkmUnlockLevel || null,
          businessContactNumber: profile.businessContactNumber || "",
          businessEmail: profile.businessEmail || "",
          isProfitable: profile.isProfitable || null,
          businessAgeYears:
            profile.businessAge != null
              ? Math.floor(profile.businessAge / 12)
              : "",
          businessAgeMonths:
            profile.businessAge != null ? profile.businessAge % 12 : "",
        });
        setProfileExists(true);
      } catch (error) {
        console.error("Unable to load profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const saveProfileToSupabase = async () => {
    const payload = toBusinessProfile(formData);

    const saveFunction = profileExists
      ? updateBusinessProfile
      : createBusinessProfile;
    return await saveFunction(payload);
  };

  // 3. Fungsi Validasi sebelum pindah step
  const handleNext = async () => {
    const newErrors: Record<string, string> = {};

    // Validasi Step 1
    if (active === 0) {
      if (!formData.businessName)
        newErrors.businessName = "This field is required";
      if (!formData.businessEmail)
        newErrors.businessEmail = "This field is required";
      if (!formData.businessContactNumber)
        newErrors.businessContactNumber = "This field is required";
      if (!formData.ownerName) newErrors.ownerName = "This field is required";
      if (formData.businessAgeYears === "" && formData.businessAgeMonths === "")
        newErrors.businessAge = "Please enter business age";
      if (!formData.ownerDob) newErrors.ownerDob = "Please enter a date";
      if (!formData.businessLocation)
        newErrors.businessLocation = "This field is required";
      if (!formData.businessBankAcc)
        newErrors.businessBankAcc = "Please select a bank";
    }

    // Validasi Step 2
    if (active === 1) {
      if (!formData.businessSector)
        newErrors.businessSector = "Please select a sector";
      if (!formData.businessType)
        newErrors.businessType = "Please select a type";
      if (formData.totalEmployees === "")
        newErrors.totalEmployees = "This field is required";
      if (!formData.storeType)
        newErrors.storeType = "Please select a store type";
    }

    // Validasi Step 3
    if (active === 2) {
      if (!formData.monthlyAverageIncome)
        newErrors.monthlyAverageIncome = "Please select a range";
      if (!formData.monthlyAverageProfitLoss)
        newErrors.monthlyAverageProfitLoss = "Please select a range";
      if (!formData.businessAssets)
        newErrors.businessAssets = "This field is required";
      if (!formData.isOtherKredit)
        newErrors.isOtherKredit = "Please select an option";
      if (formData.isProfitable === null)
        newErrors.isProfitable = "Please select profit or loss";
    }

    // Jika ada error, simpan ke state dan STOP (jangan pindah step)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Jika aman, bersihkan error dan lanjut
    setErrors({});

    if (active === 2) {
      setSaving(true);
      const profileData = toBusinessProfile(formData);

      const saveFunction = profileExists
        ? updateBusinessProfile
        : createBusinessProfile;

      saveFunction(profileData)
        .then(() => {
          // window.dispatchEvent(new Event("quiz_updated"));
          window.dispatchEvent(
            new CustomEvent("quiz_updated", { detail: { progress: 100 } }),
          );
          setActive((current) => (current < 3 ? current + 1 : current));
        })
        .catch((err) => {
          console.error(err);
          alert("Failed to save profile to Supabase. Please try again.");
        })
        .finally(() => setSaving(false));
    } else {
      setActive((current) => (current < 3 ? current + 1 : current));
    }
  };

  const handleSaveProgress = async () => {
    setSaving(true);
    try {
      await saveProfileToSupabase();
      // 1. Definisikan array field yang mau dihitung progresnya
      const fields = [
        formData.businessName,
        formData.businessAge,
        formData.ownerName,
        formData.businessLocation,
        formData.businessType,
        formData.businessSector,
        formData.totalEmployees,
        formData.storeType,
        formData.monthlyAverageIncome,
        formData.monthlyAverageProfitLoss,
        formData.businessAssets,
        formData.isOtherKredit,
        // formData.businessName, formData.businessAge, formData.ownerName,
        // formData.businessLocation, formData.businessType, formData.businessSector,
        // formData.totalEmployees, formData.storeType, formData.monthlyAverageIncome,
        // formData.monthlyAverageProfitLoss, formData.businessAssets, formData.isOtherKredit
      ];
      // 2. Hitung berapa banyak field yang sudah terisi
      const filled = fields.filter(
        (value) => value !== null && value !== undefined && value !== "",
      ).length;

      // 3. 💡 BUAT VARIABEL currentProgress DISINI AGAR TIDAK ERROR LAGI
      const currentProgress = Math.round((filled / fields.length) * 100);

      // 4. Kirimkan custom event ke Sidebar beserta datanya
      window.dispatchEvent(
        new CustomEvent("quiz_updated", {
          detail: { progress: currentProgress },
        }),
      );

      alert("Progress saved to Supabase");
    } catch (error) {
      console.error("Save error:", error);
      alert("Unable to save progress. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Fungsi helper untuk update state form
  const updateForm = (field: string, value: string | number | null) => {
    setFormData({ ...formData, [field]: value });
    // Hapus error saat user mulai ngetik/milih
    if (errors[field]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[field];
        return nextErrors;
      });
    }
  };

  if (isLoadingProfile) {
    return (
      <Container fluid>
        <Stack align="center" mt="xl" gap="sm">
          <Loader />
          <Text c="dimmed">Loading profile quiz...</Text>
        </Stack>
      </Container>
    );
  }
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Stack gap={5}>
          <Title order={2}>Business Profile Quiz</Title>
          <Text c="dimmed" size="sm">
            Please complete the following details. You can save your progress at
            any step.
          </Text>
        </Stack>

        <Card withBorder padding="xl" radius="md" shadow="sm">
          <Stepper
            active={active}
            onStepClick={setActive}
            allowNextStepsSelect={false}
          >
            {/* STEP 1: Business Identity */}
            <Stepper.Step label="Identity" description="Basic Info">
              <Stack gap="md" mt="xl">
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <TextInput
                    label="Business Name"
                    placeholder="e.g. Warung Maju Jaya"
                    withAsterisk
                    value={formData.businessName}
                    onChange={(e) =>
                      updateForm("businessName", e.currentTarget.value)
                    }
                    error={errors.businessName}
                  />
                  <TextInput
                    label="Business Owner Name"
                    placeholder="Your Full Name"
                    withAsterisk
                    value={formData.ownerName}
                    onChange={(e) =>
                      updateForm("ownerName", e.currentTarget.value)
                    }
                    error={errors.ownerName}
                  />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <TextInput
                    label="Business Email"
                    placeholder="test@gmail.com"
                    withAsterisk
                    value={formData.businessEmail}
                    onChange={(e) =>
                      updateForm("businessEmail", e.currentTarget.value)
                    }
                    error={errors.businessEmail}
                  />
                  <TextInput
                    label="Business Contact"
                    placeholder="Phone Number"
                    withAsterisk
                    value={formData.businessContactNumber}
                    onChange={(e) =>
                      updateForm("businessContactNumber", e.currentTarget.value)
                    }
                    error={errors.businessContactNumber}
                  />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  <Stack gap={4}>
                    <Text size="sm" fw={500}>
                      Business Age <span style={{ color: "red" }}>*</span>
                    </Text>
                    <Group gap="sm">
                      <NumberInput
                        placeholder="0 years"
                        min={0}
                        max={99}
                        suffix=" yrs"
                        style={{ width: 120 }}
                        value={formData.businessAgeYears ?? ""}
                        hideControls
                        onChange={(val) => {
                          setFormData((prev) => ({
                            ...prev,
                            businessAgeYears: val as number | "",
                            businessAge:
                              (Number(val) || 0) * 12 +
                              (Number(prev.businessAgeMonths) || 0),
                          }));
                        }}
                      />
                      <NumberInput
                        placeholder="0 months"
                        min={0}
                        max={11}
                        suffix=" mo"
                        style={{ width: 120 }}
                        value={formData.businessAgeMonths ?? ""}
                        hideControls
                        onChange={(val) => {
                          setFormData((prev) => ({
                            ...prev,
                            businessAgeMonths: val as number | "",
                            businessAge:
                              (Number(prev.businessAgeYears) || 0) * 12 +
                              (Number(val) || 0),
                          }));
                        }}
                      />
                    </Group>
                    {errors.businessAge && (
                      <Text size="xs" c="red">
                        {errors.businessAge}
                      </Text>
                    )}
                  </Stack>
                  <TextInput
                    label="Owner Date of Birth"
                    type="date"
                    withAsterisk
                    value={formData.ownerDob}
                    onChange={(e) =>
                      updateForm("ownerDob", e.currentTarget.value)
                    }
                    error={errors.ownerDob}
                  />
                </SimpleGrid>
                <TextInput
                  label="Business Location"
                  placeholder="City or Full Address"
                  withAsterisk
                  value={formData.businessLocation}
                  onChange={(e) =>
                    updateForm("businessLocation", e.currentTarget.value)
                  }
                  error={errors.businessLocation}
                />
                <Select
                  label="Business Bank Account"
                  placeholder="Select Bank"
                  withAsterisk
                  data={["BCA", "Mandiri", "BNI", "BRI", "Other"]}
                  value={formData.businessBankAcc}
                  onChange={(val) => updateForm("businessBankAcc", val)}
                  error={errors.businessBankAcc}
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
                    withAsterisk
                    data={[
                      "Retail",
                      "F&B",
                      "Services",
                      "Manufacturing",
                      "Technology",
                    ]}
                    value={formData.businessSector}
                    onChange={(val) => updateForm("businessSector", val)}
                    error={errors.businessSector}
                  />
                  <Select
                    label="Business Type"
                    placeholder="Select Type"
                    withAsterisk
                    data={["Product", "Service", "Both"]}
                    value={formData.businessType}
                    onChange={(val) => updateForm("businessType", val)}
                    error={errors.businessType}
                  />
                </SimpleGrid>
                <NumberInput
                  label="Employee Count"
                  placeholder="0"
                  min={0}
                  withAsterisk
                  value={formData.totalEmployees}
                  onChange={(val) => updateForm("totalEmployees", val)}
                  error={errors.totalEmployees}
                />
                <Select
                  label="Store Type"
                  placeholder="Select Model"
                  withAsterisk
                  data={["Online", "Offline", "Both (Omnichannel)"]}
                  value={formData.storeType}
                  onChange={(val) => updateForm("storeType", val)}
                  error={errors.storeType}
                />
              </Stack>
            </Stepper.Step>

            {/* STEP 3: Financial */}
            <Stepper.Step label="Financial" description="Financial Health">
              <Stack gap="md" mt="xl">
                <NumberInput
                  label="Monthly Average Income"
                  placeholder="0"
                  withAsterisk
                  min={0}
                  prefix="Rp "
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  hideControls
                  value={formData.monthlyAverageIncome}
                  onChange={(val) => updateForm("monthlyAverageIncome", val)}
                  error={errors.monthlyAverageIncome}
                />
                <Stack gap={4}>
                  <Text size="sm" fw={500}>
                    Monthly Profit / Loss{" "}
                    <span style={{ color: "red" }}>*</span>
                  </Text>
                  <Group gap="sm" align="flex-start">
                    <SegmentedControl
                      data={[
                        { label: "Profit", value: "true" },
                        { label: "Loss", value: "false" },
                      ]}
                      value={
                        formData.isProfitable === null
                          ? ""
                          : String(formData.isProfitable)
                      }
                      onChange={(val) =>
                        setFormData((prev) => ({
                          ...prev,
                          isProfitable: val === "true",
                        }))
                      }
                    />
                    <NumberInput
                      placeholder="0"
                      min={0}
                      prefix="Rp "
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2}
                      hideControls
                      disabled={formData.isProfitable === null}
                      value={formData.monthlyAverageProfitLoss}
                      onChange={(val) =>
                        updateForm("monthlyAverageProfitLoss", val)
                      }
                      error={errors.monthlyAverageProfitLoss}
                    />
                  </Group>
                  {errors.isProfitable && (
                    <Text size="xs" c="red">
                      {errors.isProfitable}
                    </Text>
                  )}
                </Stack>
                <TextInput
                  label="Business Assets"
                  placeholder="e.g. Land, Vehicle, Tools"
                  withAsterisk
                  value={formData.businessAssets}
                  onChange={(e) =>
                    updateForm("businessAssets", e.currentTarget.value)
                  }
                  error={errors.businessAssets}
                />
                <Select
                  label="Existing Loans?"
                  placeholder="Select Status"
                  withAsterisk
                  data={["None", "Active", "Settled"]}
                  value={formData.isOtherKredit}
                  onChange={(val) => updateForm("isOtherKredit", val)}
                  error={errors.isOtherKredit}
                />
              </Stack>
            </Stepper.Step>

            <Stepper.Completed>
              <Stack align="center" py="xl" gap="sm">
                <Text fw={700} size="lg">
                  All set! Data submitted.
                </Text>
                <Text c="dimmed" size="sm" ta="center">
                  Thank you for completing your business profile.
                </Text>
                <Button
                  color="green"
                  leftSection={<HiCheck />}
                  onClick={() => navigate("/my-business/business-profile")}
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
                  <Button
                    variant="default"
                    onClick={prevStep}
                    leftSection={<HiArrowLeft />}
                  >
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
                  {active === 2 ? "Finish" : "Next"}
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
