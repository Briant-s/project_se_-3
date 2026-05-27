import { Badge, useMantineTheme } from "@mantine/core";
import { HiOutlineCreditCard } from "react-icons/hi";

function HealthBadge({ type }: { type: number }) {
  const theme = useMantineTheme();
  const map: Record<number, { color: string; label: string }> = {
    1: { color: theme.other.KURColors.supermikro, label: "Super Mikro KI" },
    2: { color: theme.other.KURColors.mikro, label: "Mikro KI" },
    3: { color: theme.other.KURColors.kecil, label: "Kecil KI" },
    4: { color: theme.other.KURColors.supermikro, label: "Super Mikro KMK" },
    5: { color: theme.other.KURColors.mikro, label: "Mikro KMK" },
    6: { color: theme.other.KURColors.kecil, label: "Kecil KMK" },
  };

  const { color, label } = map[type] ?? { color: "gray", label: "Unknown" };

  return (
    <Badge
      leftSection={<HiOutlineCreditCard size={14} />}
      variant="outline"
      color={color}
    >
      {label}
    </Badge>
  );
}

export default HealthBadge;
