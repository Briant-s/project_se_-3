import { useMemo } from "react";
import type { AmortEntry } from "../services/models";

export const useKURHealthCounts = (entries: AmortEntry[] | undefined) => {
  return useMemo(() => {
    // Default state to return if there are no entries
    if (!entries || entries.length === 0) {
      return { healthy: 0, warning: 0, not_healthy: 0 };
    }

    return entries.reduce(
      (acc, entry) => {
        const status = entry.health_status;

        // Ensure the status exists and matches one of our expected keys
        if (
          status === "healthy" ||
          status === "warning" ||
          status === "not_healthy"
        ) {
          acc[status] += 1;
        }

        return acc;
      },
      { healthy: 0, warning: 0, not_healthy: 0 }, // Initial accumulator state
    );
  }, [entries]);
};
