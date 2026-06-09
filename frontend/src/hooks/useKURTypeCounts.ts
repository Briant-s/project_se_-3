import { useMemo } from "react";
import type { AmortEntry } from "../services/models";

const KUR_TYPE_MAP: Record<number, string> = {
  1: "supermikro",
  2: "mikro",
  3: "kecil",
  4: "supermikro",
  5: "mikro",
  6: "kecil",
};

type KURTypeCounts = { supermikro: number; mikro: number; kecil: number };

export const useKURTypeCounts = (entries: AmortEntry[]) => {
  return useMemo(() => {
    if (!entries || entries.length === 0) {
      return { supermikro: 0, mikro: 0, kecil: 0 };
    }
    return entries.reduce<KURTypeCounts>(
      (acc, entry) => {
        const type = entry.creditID ? KUR_TYPE_MAP[entry.creditID] : undefined;
        if (type)
          acc[type as keyof KURTypeCounts] =
            (acc[type as keyof KURTypeCounts] || 0) + 1;
        return acc;
      },
      { supermikro: 0, mikro: 0, kecil: 0 },
    );
  }, [entries]);
};
