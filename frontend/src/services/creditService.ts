const BASE_URL = "http://localhost:8000";
import { supabase } from "../SupabaseClient";
import type { AmortEntry } from "./models";

// get user JWT token
export async function getAuthHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No active session, please log in again");
  return { Authorization: `Bearer ${token}` };
}

// Get all amort
export async function getAmortsCutoff(days: number): Promise<AmortEntry[]> {
  const result = await fetch(
    `${BASE_URL}/credit/eligibility-overview?c_days=${days}`,
    {
      headers: await getAuthHeader(),
    },
  );
  if (!result.ok) throw new Error("Failed to fecth all entries with cutoff");
  return result.json();
}
