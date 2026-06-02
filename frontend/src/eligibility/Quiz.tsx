import KURDisplay from "./KURDisplay";
import { Text } from "@mantine/core";

function QuizPage() {
  return (
    <div>
      <Text size="lg" fw={500} mb="md">
        Available KUR Types
      </Text>
      <KURDisplay />
    </div>
  );
}

export default QuizPage;