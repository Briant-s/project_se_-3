// hooks/useAssetForm.ts
import { useState, useRef } from "react";
import type { Asset } from "../services/models";
import { createAsset, deleteAsset } from "../services/assetService";

interface AssetFormState {
  assetsName: string;
  assetsType: "Usaha" | "Pribadi" | null;
  assetsValue: number | null;
}

export function useAssetForm() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [assetForm, setAssetForm] = useState<AssetFormState>({
    assetsName: "",
    assetsType: null,
    assetsValue: null,
  });
  const [isAddingAsset, setIsAddingAsset] = useState(false);

  // Use refs so handlers always see latest values without needing them as deps
  const businessIDRef = useRef<string | number | null>(null);
  const profileExistsRef = useRef(false);

  const setBusinessID = (id: string | number | null) => {
    businessIDRef.current = id;
  };

  const setProfileExists = (exists: boolean) => {
    profileExistsRef.current = exists;
  };

  const handleAddAsset = async () => {
    if (
      !assetForm.assetsName ||
      !assetForm.assetsType ||
      assetForm.assetsValue === null
    ) {
      alert("Please fill in all asset fields");
      return;
    }
    if (!profileExistsRef.current) {
      alert("Please save your business profile first before adding assets.");
      return;
    }

    setIsAddingAsset(true);
    try {
      const newAsset: Asset = {
        assetsID: 0,
        businessID: businessIDRef.current,
        assetsName: assetForm.assetsName,
        assetsType: assetForm.assetsType,
        assetsValue: Number(assetForm.assetsValue),
      };
      const savedAsset = await createAsset(newAsset);
      setAssets((prev) => [...prev, savedAsset]);
      setAssetForm({ assetsName: "", assetsType: null, assetsValue: null });
      alert("Asset added successfully!");
    } catch (error) {
      console.error("Failed to add asset:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Failed to add asset";
      alert(`Error: ${errorMsg}`);
    } finally {
      setIsAddingAsset(false);
    }
  };

  const handleDeleteAsset = async (index: number) => {
    const asset = assets[index];
    if (!asset.assetsID) {
      setAssets((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    try {
      await deleteAsset(String(asset.assetsID));
      setAssets((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Failed to delete asset:", error);
      alert("Failed to delete asset. Please try again.");
    }
  };

  return {
    assets,
    setAssets,
    assetForm,
    setAssetForm,
    isAddingAsset,
    handleAddAsset,
    handleDeleteAsset,
    setBusinessID, // call this when businessID is known
    setProfileExists, // call this when profileExists changes
  };
}
