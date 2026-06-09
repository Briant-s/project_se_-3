import { useState } from "react";
import KURDisplay from "./KURDisplay";
import { Select, Stack, Text, Box } from "@mantine/core";

function QuizPage() {
  const [purpose, setPurpose] = useState<"ki" | "kmk">("ki");
  const [switching, setSwitching] = useState(false);

  const handlePurposeChange = (value: string | null) => {
    setSwitching(true);
    setPurpose((value as "ki" | "kmk") ?? "ki");
    setTimeout(() => setSwitching(false), 400);
  };

  return (
    <Stack p="md">
      <Text size="lg" fw={500} mb="md">
        Available KUR Types
      </Text>
      <Select
        label="Loan Purpose"
        value={purpose}
        onChange={handlePurposeChange}
        data={[
          { value: "ki", label: "Kredit Investasi (KI)" },
          { value: "kmk", label: "Kredit Modal Kerja (KMK)" },
        ]}
      />
      <Box
        style={{
          opacity: switching ? 0 : 1,
          transition: "opacity 200ms ease",
          pointerEvents: switching ? "none" : "auto",
        }}
      >
        <KURDisplay loanPurpose={purpose} />
      </Box>
    </Stack>
  );
}

export default QuizPage;
