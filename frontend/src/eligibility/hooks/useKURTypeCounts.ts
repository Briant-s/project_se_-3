import { useMemo } from "react";

const KUR_TYPE_MAP = {
  1: "supermikro",
  2: "mikro",
  3: "kecil",
  4: "supermikro",
  5: "mikro",
  6: "kecil",
};

export const useKURTypeCounts = (entries) => {
  return useMemo(() => {
    if (!entries || entries.length === 0) {
      return { supermikro: 0, mikro: 0, kecil: 0 };
    }
    return entries.reduce(
      (acc, entry) => {
        const type = KUR_TYPE_MAP[entry.creditID];
        if (type) acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      { supermikro: 0, mikro: 0, kecil: 0 },
    );
  }, [entries]);
};
