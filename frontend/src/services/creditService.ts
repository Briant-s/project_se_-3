const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
import { supabase } from "../SupabaseClient";
import type { Credit } from "./models";

// get user JWT token
export async function getAuthHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No active session, please log in again");
  return { Authorization: `Bearer ${token}` };
}

export async function getCreditReference(): Promise<Credit[]> {
  const result = await fetch(`${BASE_URL}/credit-reference`, {
    headers: await getAuthHeader(),
  });
  if (!result.ok) throw new Error("Failed to fetch credit references");
  return result.json();
}
