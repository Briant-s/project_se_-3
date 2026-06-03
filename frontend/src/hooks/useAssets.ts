import { useState, useEffect, useMemo } from "react";
import type { Asset } from "../services/models";
import { getAssets } from "../services/assetService";

export function useAssets() {
  const [assets, setAssets] = useState<Asset[] | null>(null); // null = not yet fetched, [] = fetched but empty

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const result = await getAssets();
        setAssets(result);
      } catch (error) {
        console.error(error);
        setAssets([]); // treat fetch error as empty, not unknown
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const { hasCollateral, totalAssetsValue } = useMemo(() => {
    if (assets === null) {
      // still fetching — unknown
      return { hasCollateral: null, totalAssetsValue: null };
    }
    if (assets.length === 0) {
      // fetched but empty — user explicitly has no assets = no collateral
      return { hasCollateral: false, totalAssetsValue: 0 };
    }
    return {
      hasCollateral: true,
      totalAssetsValue: assets.reduce(
        (sum, a) => sum + (a.assetsValue ?? 0),
        0,
      ),
    };
  }, [assets]);

  return { assets: assets ?? [], hasCollateral, totalAssetsValue, loading };
}
