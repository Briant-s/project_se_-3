import { supabase } from "../SupabaseClient";
import type { Asset } from "./models";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
console.log("BASE_URL:", BASE_URL);
async function getAuthHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No active session, please log in again");
  return { Authorization: `Bearer ${token}` };
}

export async function getAssets(): Promise<Asset[]> {
  const result = await fetch(`${BASE_URL}/assets`, {
    headers: await getAuthHeader(),
  });

  if (!result.ok) {
    if (result.status === 404) return [];
    throw new Error("Failed to fetch assets");
  }

  return result.json();
}

export async function createAsset(asset: Asset): Promise<Asset> {
  const result = await fetch(`${BASE_URL}/assets`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
    body: JSON.stringify(asset),
  });
  console.log(result);

  if (!result.ok) {
    const errorBody = await result.json().catch(() => result.text());
    console.error("Create asset error response:", errorBody);
    throw new Error("Failed to save asset");
  }
  return result.json();
}

export async function deleteAsset(assetsID: string): Promise<void> {
  const result = await fetch(`${BASE_URL}/assets/${assetsID}`, {
    method: "DELETE",
    headers: await getAuthHeader(),
  });

  if (!result.ok) {
    const errorBody = await result.json().catch(() => result.text());
    console.error("Delete asset error response:", errorBody);
    throw new Error("Failed to delete asset");
  }
}
