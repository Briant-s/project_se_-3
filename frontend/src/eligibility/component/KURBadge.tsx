import { Badge } from "@mantine/core";
import { cardColors } from "../../gradients";
import { HiOutlineCreditCard } from "react-icons/hi";

function KURBadge({ type }: { type: number }) {
  const map: Record<number, { color: string; label: string }> = {
    1: { color: cardColors.super_mikro, label: "Super Mikro KI" },
    2: { color: cardColors.mikro, label: "Mikro KI" },
    3: { color: cardColors.kecil, label: "Kecil KI" },
    4: { color: cardColors.super_mikro, label: "Super Mikro KMK" },
    5: { color: cardColors.mikro, label: "Mikro KMK" },
    6: { color: cardColors.kecil, label: "Kecil KMK" },
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

export default KURBadge;
