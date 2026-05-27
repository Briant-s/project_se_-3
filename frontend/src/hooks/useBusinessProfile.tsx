import { useState, useEffect } from "react";
import type { BusinessProfile } from "../services/models";
import { getBusinessProfile } from "../services/businessProfileService";

export function useBusinessProfile() {
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBusiness = async () => {
    setLoading(true);
    try {
      const result = await getBusinessProfile();
      setBusiness(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, []);

  return { business, loading };
}
