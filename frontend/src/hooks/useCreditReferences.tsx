import { useState, useEffect, useMemo } from "react";
import type { Credit } from "../services/models";
import { getCreditReference } from "../services/creditService";

export const useCreditReferences = () => {
  const [creditReferences, setCreditReferences] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const result = await getCreditReference();
        setCreditReferences(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const { creditMap, creditMapByType } = useMemo(() => {
    const mapById: Record<number, Credit> = {};
    const mapByType: Record<string, Credit> = {};

    creditReferences.forEach((credit) => {
      // 1. Original map for backward compatibility (by ID)
      mapById[credit.creditID] = credit;

      // 2. New map for dynamic form validations (by "supermikro-ki")
      mapByType[credit.creditType] = credit;
    });

    return { creditMap: mapById, creditMapByType: mapByType };
  }, [creditReferences]);

  return { creditReferences, creditMap, creditMapByType, loading };
};
