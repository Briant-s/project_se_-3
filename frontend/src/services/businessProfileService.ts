import { supabase } from "../SupabaseClient";
import type { BusinessProfile } from "./models";

const BASE_URL = "http://localhost:8000";

async function getAuthHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No active session, please log in again");
  return { Authorization: `Bearer ${token}` };
}

export async function getBusinessProfile(): Promise<BusinessProfile | null> {
  const result = await fetch(`${BASE_URL}/business-profile`, {
    headers: await getAuthHeader(),
  });

  if (!result.ok) {
    if (result.status === 404) return null;
    throw new Error("Failed to fetch business profile");
  }

  const body = await result.json();
  return Object.keys(body).length === 0 ? null : body;
}

export async function createBusinessProfile(
  profile: BusinessProfile,
): Promise<BusinessProfile> {
  const result = await fetch(`${BASE_URL}/business-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
    body: JSON.stringify(profile),
  });

  if (!result.ok) throw new Error("Failed to save business profile");
  return result.json();
}

export async function updateBusinessProfile(
  profile: BusinessProfile,
): Promise<BusinessProfile> {
  const result = await fetch(`${BASE_URL}/business-profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
    body: JSON.stringify(profile),
  });

  if (!result.ok) throw new Error("Failed to update business profile");
  return result.json();
}
