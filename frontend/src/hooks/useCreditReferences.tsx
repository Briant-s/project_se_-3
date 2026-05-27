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

  // index by creditID for easy lookup
  const creditMap = useMemo(
    () =>
      creditReferences.reduce(
        (acc, credit) => {
          acc[credit.creditID] = credit;
          return acc;
        },
        {} as Record<number, Credit>,
      ),
    [creditReferences],
  );

  return { creditReferences, creditMap, loading };
};
