const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
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
export async function getAmortEntries(): Promise<AmortEntry[]> {
  const result = await fetch(`${BASE_URL}/amort/amort-calc`, {
    headers: await getAuthHeader(),
  });
  if (!result.ok) throw new Error("Failed to fecth all entries");
  return result.json();
}

// Get single amort
export async function getAmortEntry(id: number): Promise<AmortEntry> {
  const result = await fetch(`${BASE_URL}/amort/amort-calc/${id}`, {
    headers: await getAuthHeader(),
  });
  if (!result.ok) throw new Error("Entry not found");
  return result.json();
}

// Create amort
export async function createAmortEntry(
  entry: Omit<AmortEntry, "amort_id" | "created_at">,
): Promise<AmortEntry> {
  const result = await fetch(`${BASE_URL}/amort/amort-calc`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
    body: JSON.stringify(entry),
  });
  if (!result.ok) throw new Error("Failed to create entry");
  return result.json();
}

// Update amort
export async function updateAmortEntry(
  id: number,
  entry: Omit<AmortEntry, "amort_id" | "created_at">,
): Promise<AmortEntry> {
  const result = await fetch(`${BASE_URL}/amort/amort-calc/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
    body: JSON.stringify(entry),
  });
  if (!result.ok) throw new Error(`Failed to update entry: #${id}`);
  return result.json();
}

// Delete amort
export async function deleteAmortEntry(id: number): Promise<void> {
  const result = await fetch(`${BASE_URL}/amort/amort-calc/${id}`, {
    method: "DELETE",
    headers: await getAuthHeader(),
  });
  if (!result.ok) throw new Error(`Failed to delete entry: #${id}`);
}
