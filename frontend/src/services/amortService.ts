const BASE_URL = "http://localhost:8000";
import type { AmortEntry } from "./models";

// Get all amort
export async function getAmortEntries(): Promise<AmortEntry[]> {
  const result = await fetch(`${BASE_URL}/amort/amort-calc`);
  if (!result.ok) throw new Error("Failed to fecth all entries");
  return result.json();
}

// Create amort
export async function createAmortEntry(
  entry: Omit<AmortEntry, "amort_id" | "created_at">,
): Promise<AmortEntry> {
  const result = await fetch(`${BASE_URL}/amort/amort-calc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!result.ok) throw new Error(`Failed to update entry: #${id}`);
  return result.json();
}

// Delete amort
export async function deleteAmortEntry(id: number): Promise<void> {
  const result = await fetch(`${BASE_URL}/amort/amort-calc/${id}`, {
    method: "DELETE",
  });
  if (!result.ok) throw new Error(`Failed to delete entry: #${id}`);
}
