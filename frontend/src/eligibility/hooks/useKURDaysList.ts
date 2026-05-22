import { useMemo } from "react";

export const useKURDaysList = (entries, days) => {
  return useMemo(() => {
    if (!days || days === 0) return entries;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return entries.filter((entry) => new Date(entry.created_at) >= cutoff);
  }, [entries, days]);
};
