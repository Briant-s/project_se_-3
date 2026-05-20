import { ActionIcon, Card, Group, Stack, Text } from "@mantine/core";
import { HiOutlineReply } from "react-icons/hi";

interface KURCardProps {
  label: string;
  value: number | string;
  background_color : string;
  text_color: string;

}

function KURCard({ label, value, background_color, text_color }: KURCardProps) {
  return (
    <>
      <Card
        p={2}
        style={{
          background: background_color,
          borderRadius: "16px",
          boxShadow: "0 1px 10px rgba(0, 0, 0, 0.2)",
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
              <Text size="md" c={text_color}>
                {label}
              </Text>
              <ActionIcon bg="white">
                <HiOutlineReply
                  color="black"
                  style={{ transform: "scaleX(-1)" }}
                />
              </ActionIcon>
            </Group>
            <Text size="2rem" c={text_color}>
              {value}
            </Text>
          </Stack>
        </Card>
      </Card>
    </>
  );
}
export default KURCard;
