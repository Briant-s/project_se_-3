import { supabase } from "../SupabaseClient";
import type {
  BusinessProposal,
  BusinessProposalInput,
} from "./models";

const BASE_URL = "http://localhost:8000";

async function getAuthHeader() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No active session, please log in again");
  return { Authorization: `Bearer ${token}` };
}

export async function getBusinessProposals(): Promise<BusinessProposal[]> {
  const result = await fetch(`${BASE_URL}/business-proposal`, {
    headers: await getAuthHeader(),
  });
  if (!result.ok) {
    const body = await result.text();
    throw new Error(`Failed to fetch business proposals: ${result.status} ${body}`);
  }

  const payload = await result.json();
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && typeof payload === "object") {
    if (Array.isArray((payload as any).data)) {
      return (payload as any).data;
    }
    if (Array.isArray((payload as any).result)) {
      return (payload as any).result;
    }
    if (Array.isArray((payload as any).detailed)) {
      return (payload as any).detailed;
    }
  }

  throw new Error(`Unexpected business proposal response shape: ${JSON.stringify(payload)}`);
}

export async function getBusinessProposal(id: string): Promise<BusinessProposal> {
  const result = await fetch(`${BASE_URL}/business-proposal/${encodeURIComponent(id)}`, {
    headers: await getAuthHeader(),
  });
  if (!result.ok) throw new Error("Business proposal not found");
  return result.json();
}

export async function createBusinessProposal(
  payload: BusinessProposalInput,
): Promise<BusinessProposal> {
  const result = await fetch(`${BASE_URL}/business-proposal`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
    body: JSON.stringify(payload),
  });
  if (!result.ok) {
    const errorBody = await result.text();
    console.error("Create proposal error:", errorBody);
    throw new Error("Failed to create business proposal");
  }
  return result.json();
}

export async function updateBusinessProposal(
  id: string,
  payload: BusinessProposalInput,
): Promise<BusinessProposal> {
  const result = await fetch(`${BASE_URL}/business-proposal/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
    body: JSON.stringify(payload),
  });
  if (!result.ok) {
    const errorBody = await result.text();
    console.error("Update proposal error:", errorBody);
    throw new Error("Failed to update business proposal");
  }
  return result.json();
}

export async function deleteBusinessProposal(id: string): Promise<void> {
  // if (typeof id === "string") {
  //   if (!id.trim()) {
  //     throw new Error("Invalid proposal ID for deletion");
  //   }
  // } else if (!Number.isInteger(id) || id <= 0) {
  //   throw new Error("Invalid proposal ID for deletion");
  // }

  const safeId = typeof id === "string" ? encodeURIComponent(id) : id;
  const result = await fetch(`${BASE_URL}/business-proposal/${safeId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...(await getAuthHeader()) },
  });
  if (!result.ok) {
    const errorBody = await result.text();
    console.error("Delete proposal error:", result.status, errorBody);
    let message = "Failed to delete business proposal";
    try {
      const json = JSON.parse(errorBody);
      if (typeof json.detail === "string") {
        message = json.detail;
      } else if (Array.isArray(json.detail)) {
        message = JSON.stringify(json.detail);
      } else {
        message = json.message || message;
      }
    } catch {
      if (errorBody) message = errorBody;
    }
    throw new Error(`${result.status}: ${message}`);
  }
}
