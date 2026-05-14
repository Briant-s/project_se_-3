import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Stack,
  Text,
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  Card,
  SimpleGrid,
  NumberInput,
  Divider,
} from "@mantine/core";

interface MenuItem {
  name: string;
  description: string;
  price: string;
}

interface Competitor {
  name: string;
  strength: string;
  weakness: string;
}

interface FormData {
  businessName: string;
  businessDescription: string;
  visi: string;
  misi: string;
  targetPasar: string;
  psikografi: string;
  trenPasar: string;
  competitors: Competitor[];
  strategiPemasaran: string;
  pelayananPelanggan: string;
  menuProduk: MenuItem[];
  jamOperasional: string;
  jumlahStaff: string;
  supplier: string;
  prosesOperasional: string;
  modalAwal: string;
  targetPendapatan: string;
  analisa: string;
  kesimpulan: string;
}

const initialForm: FormData = {
  businessName: "",
  businessDescription: "",
  visi: "",
  misi: "",
  targetPasar: "",
  psikografi: "",
  trenPasar: "",
  competitors: [{ name: "", strength: "", weakness: "" }],
  strategiPemasaran: "",
  pelayananPelanggan: "",
  menuProduk: [{ name: "", description: "", price: "" }],
  jamOperasional: "",
  jumlahStaff: "",
  supplier: "",
  prosesOperasional: "",
  modalAwal: "",
  targetPendapatan: "",
  analisa: "",
  kesimpulan: "",
};

function SectionTitle({ title }: { title: string }) {
  return (
    <Stack gap={4}>
      <Text fw={600} size="md">{title}</Text>
      <Divider />
    </Stack>
  );
}

function BusinessProposal() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();


  const set = (field: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateCompetitor = (index: number, field: keyof Competitor, value: string) => {
    const updated = form.competitors.map((c, i) =>
      i === index ? { ...c, [field]: value } : c
    );
    set("competitors", updated);
  };
  const addCompetitor = () =>
    set("competitors", [...form.competitors, { name: "", strength: "", weakness: "" }]);
  const removeCompetitor = (index: number) =>
    set("competitors", form.competitors.filter((_, i) => i !== index));

  const updateMenu = (index: number, field: keyof MenuItem, value: string) => {
    const updated = form.menuProduk.map((m, i) =>
      i === index ? { ...m, [field]: value } : m
    );
    set("menuProduk", updated);
  };
  const addMenu = () =>
    set("menuProduk", [...form.menuProduk, { name: "", description: "", price: "" }]);
  const removeMenu = (index: number) =>
    set("menuProduk", form.menuProduk.filter((_, i) => i !== index));

const handleSubmit = () => {
  navigate("/business-proposal/list");
};

  if (submitted) {
    return (
      <Container fluid>
        <Stack gap="lg" align="center" mt="xl">
          <Text size="xl" fw={700} c="blue">Proposal Created Successfully!</Text>
          <Text c="dimmed">Your business proposal has been successfully saved.</Text>
          <Button variant="light" onClick={() => { setSubmitted(false); setForm(initialForm); }}>
            Create New Proposal
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Stack gap="lg">

        {/* Header */}
        <Stack gap={2}>
          <Text size="xl" fw={700}>Business Proposal</Text>
          <Text size="sm" c="dimmed">Please complete all information to create your business proposal.</Text>
        </Stack>

        <Card radius="md" withBorder shadow="sm" p="xl">
          <Stack gap="xl">

            {/* 1. Business Information */}
            <Stack gap="md">
              <SectionTitle title="1. Business Information" />
              <TextInput
                label="Business Name"
                placeholder="e.g. Acme Corp"
                required
                value={form.businessName}
                onChange={(e) => set("businessName", e.target.value)}
              />
              <Textarea
                label="Business Description"
                placeholder="Explain briefly about your business..."
                required
                autosize
                minRows={3}
                value={form.businessDescription}
                onChange={(e) => set("businessDescription", e.target.value)}
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Textarea
                  label="Vision"
                  placeholder="Your long-term business vision..."
                  required
                  autosize
                  minRows={3}
                  value={form.visi}
                  onChange={(e) => set("visi", e.target.value)}
                />
                <Textarea
                  label="Mission"
                  placeholder="Steps to achieve the vision..."
                  required
                  autosize
                  minRows={3}
                  value={form.misi}
                  onChange={(e) => set("misi", e.target.value)}
                />
              </SimpleGrid>
            </Stack>

            {/* 2. Market Analysis */}
            <Stack gap="md">
              <SectionTitle title="2. Market Analysis" />
              <Textarea
                label="Target Market"
                placeholder="Who are your target customers? (age, location, habits, etc.)"
                required
                autosize
                minRows={3}
                value={form.targetPasar}
                onChange={(e) => set("targetPasar", e.target.value)}
              />
              <Textarea
                label="Psychographics"
                placeholder="Lifestyle, values, interests, and motivations of your target market..."
                required
                autosize
                minRows={3}
                value={form.psikografi}
                onChange={(e) => set("psikografi", e.target.value)}
              />
              <Textarea
                label="Market Trends"
                placeholder="Industry or market trends relevant to your business..."
                required
                autosize
                minRows={3}
                value={form.trenPasar}
                onChange={(e) => set("trenPasar", e.target.value)}
              />

              {/* Competitors */}
              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  Competitors <Text component="span" c="red">*</Text>
                </Text>
                {form.competitors.map((comp, i) => (
                  <Card key={i} withBorder radius="md" p="md">
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text size="sm" fw={500} c="dimmed">Competitor {i + 1}</Text>
                        {form.competitors.length > 1 && (
                          <Button size="xs" color="red" variant="subtle" onClick={() => removeCompetitor(i)}>
                            Remove
                          </Button>
                        )}
                      </Group>
                      <TextInput
                        placeholder="Competitor name"
                        value={comp.name}
                        onChange={(e) => updateCompetitor(i, "name", e.target.value)}
                      />
                      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                        <Textarea
                          label="Strengths"
                          placeholder="Competitor strengths..."
                          autosize
                          minRows={2}
                          value={comp.strength}
                          onChange={(e) => updateCompetitor(i, "strength", e.target.value)}
                        />
                        <Textarea
                          label="Weaknesses"
                          placeholder="Competitor weaknesses..."
                          autosize
                          minRows={2}
                          value={comp.weakness}
                          onChange={(e) => updateCompetitor(i, "weakness", e.target.value)}
                        />
                      </SimpleGrid>
                    </Stack>
                  </Card>
                ))}
                <Button variant="light" onClick={addCompetitor} w="fit-content">
                  + Add Competitor
                </Button>
              </Stack>
            </Stack>

            {/* 3. Strategy & Products */}
            <Stack gap="md">
              <SectionTitle title="3. Strategy & Products" />
              <Textarea
                label="Marketing Strategy"
                placeholder="How will you market the business? (social media, promotions, etc.)"
                required
                autosize
                minRows={3}
                value={form.strategiPemasaran}
                onChange={(e) => set("strategiPemasaran", e.target.value)}
              />
              <Textarea
                label="Customer Service"
                placeholder="How will you serve customers? (after-sales, complaint handling, etc.)"
                required
                autosize
                minRows={3}
                value={form.pelayananPelanggan}
                onChange={(e) => set("pelayananPelanggan", e.target.value)}
              />

              {/* Menu / Product */}
              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  Menu / Products <Text component="span" c="red">*</Text>
                </Text>
                {form.menuProduk.map((item, i) => (
                  <Card key={i} withBorder radius="md" p="md">
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text size="sm" fw={500} c="dimmed">Product {i + 1}</Text>
                        {form.menuProduk.length > 1 && (
                          <Button size="xs" color="red" variant="subtle" onClick={() => removeMenu(i)}>
                            Remove
                          </Button>
                        )}
                      </Group>
                      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                        <TextInput
                          label="Product Name"
                          placeholder="e.g. Special Fried Rice"
                          value={item.name}
                          onChange={(e) => updateMenu(i, "name", e.target.value)}
                        />
                        <TextInput
                          label="Price"
                          placeholder="e.g. 25000"
                          value={item.price}
                          onChange={(e) => updateMenu(i, "price", e.target.value)}
                        />
                      </SimpleGrid>
                      <Textarea
                        label="Product Description"
                        placeholder="Brief description of the product..."
                        autosize
                        minRows={2}
                        value={item.description}
                        onChange={(e) => updateMenu(i, "description", e.target.value)}
                      />
                    </Stack>
                  </Card>
                ))}
                <Button variant="light" onClick={addMenu} w="fit-content">
                  + Add Product
                </Button>
              </Stack>
            </Stack>

            {/* 4. Operational Plan */}
            <Stack gap="md">
              <SectionTitle title="4. Operational Plan" />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Select
                  label="Operational Hours"
                  placeholder="Select operating hours"
                  required
                  data={["06:00 – 12:00", "08:00 – 17:00", "10:00 – 22:00", "12:00 – 24:00", "24 Hours", "Other"]}
                  value={form.jamOperasional}
                  onChange={(v) => set("jamOperasional", v ?? "")}
                />
                <NumberInput
                  label="Staff Count"
                  placeholder="e.g. 5"
                  required
                  min={1}
                  value={form.jumlahStaff === "" ? "" : Number(form.jumlahStaff)}
                  onChange={(v) => set("jumlahStaff", String(v))}
                />
              </SimpleGrid>
              <Textarea
                label="Suppliers"
                placeholder="Who are your raw material suppliers?"
                required
                autosize
                minRows={2}
                value={form.supplier}
                onChange={(e) => set("supplier", e.target.value)}
              />
              <Textarea
                label="Operational Process"
                placeholder="Explain the daily operational flow of your business..."
                required
                autosize
                minRows={4}
                value={form.prosesOperasional}
                onChange={(e) => set("prosesOperasional", e.target.value)}
              />
            </Stack>

            {/* 5. Financial Plan & Conclusion */}
            <Stack gap="md">
              <SectionTitle title="5. Financial Plan & Conclusion" />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <NumberInput
                  label="Initial Capital (Rp)"
                  placeholder="e.g. 50000000"
                  required
                  min={0}
                  thousandSeparator="."
                  decimalSeparator=","
                  value={form.modalAwal === "" ? "" : Number(form.modalAwal)}
                  onChange={(v) => set("modalAwal", String(v))}
                />
                <NumberInput
                  label="Monthly Revenue Target (Rp)"
                  placeholder="e.g. 20000000"
                  required
                  min={0}
                  thousandSeparator="."
                  decimalSeparator=","
                  value={form.targetPendapatan === "" ? "" : Number(form.targetPendapatan)}
                  onChange={(v) => set("targetPendapatan", String(v))}
                />
              </SimpleGrid>
              <Textarea
                label="Financial Analysis"
                placeholder="Break-even point, profit projections, or other financial notes..."
                required
                autosize
                minRows={4}
                value={form.analisa}
                onChange={(e) => set("analisa", e.target.value)}
              />
              <Textarea
                label="Conclusion"
                placeholder="Final summary and your confidence in this business..."
                required
                autosize
                minRows={4}
                value={form.kesimpulan}
                onChange={(e) => set("kesimpulan", e.target.value)}
              />
            </Stack>

          </Stack>
        </Card>

        {/* Submit */}
        <Group justify="flex-end" pb="xl">
          <Button color="blue" size="md" onClick={handleSubmit}>
            Save Draft
          </Button>
        </Group>

      </Stack>
    </Container>
  );
}

export default BusinessProposal;