import { ActionIcon, Card, Group, Stack, Text } from "@mantine/core";
import { HiOutlineReply } from "react-icons/hi";

interface KURCardProps {
  label: string;
  value: number | string;
  gradient: string;
}

function KURCard({ label, value, gradient }: KURCardProps) {
  return (
    <>
      <Card
        p={2}
        style={{
          background: gradient,
          borderRadius: "16px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Card
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "14px",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="md" c="white">
                {label}
              </Text>
              <ActionIcon bg="white">
                <HiOutlineReply
                  color="black"
                  style={{ transform: "scaleX(-1)" }}
                />
              </ActionIcon>
            </Group>
            <Text size="2rem" c="white">
              {value}
            </Text>
          </Stack>
        </Card>
      </Card>
    </>
  );
}
export default KURCard;
