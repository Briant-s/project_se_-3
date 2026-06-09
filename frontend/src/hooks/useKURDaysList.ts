import { useMemo } from "react";
import type { AmortEntry } from "../services/models";

export const useKURDaysList = (entries: AmortEntry[], days: number | null) => {
  return useMemo(() => {
    if (!entries || entries.length === 0) return [];
    let filteredEntries = entries;

    if (days && days > 0) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      filteredEntries = entries.filter(
        (entry) =>
          new Date(entry.created_at ?? "").getTime() >= cutoff.getTime(),
      );
    }
    return [...filteredEntries].sort((a, b) => {
      return (
        new Date(b.created_at ?? "").getTime() -
        new Date(a.created_at ?? "").getTime()
      );
    });
  }, [entries, days]);
};
