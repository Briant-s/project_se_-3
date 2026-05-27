import { useMemo } from "react";

export const useKURDaysList = (entries, days) => {
  return useMemo(() => {
    if (!entries || entries.length === 0) return [];
    let filteredEntries = entries;

    if (days && days > 0) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      filteredEntries = entries.filter(
        (entry) => new Date(entry.created_at) >= cutoff,
      );
    }
    return [...filteredEntries].sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [entries, days]);
};
