import { apiFetch } from "@/lib/apiClient";
import type {
  OrganisationSearchResult,
  PendingJoinRequest,
  ReviewJoinRequestPayload,
} from "@/types/organisation";

export async function searchOrganisations(
  query: string
): Promise<OrganisationSearchResult[]> {
  const response = await apiFetch(
    `/api/accounts/organisations/search/?q=${encodeURIComponent(query)}`,
    { method: "GET" }
  );

  if (!response.ok) {
    let message = "Failed to search organisations";
    try {
      const errorData = await response.json();
      message = errorData?.detail || errorData?.message || errorData?.error || message;
    } catch {}
    throw new Error(message);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function createJoinRequest(companyId: string, message?: string) {
  const response = await apiFetch(
    `/api/accounts/organisations/${companyId}/join-request/`,
    {
      method: "POST",
      body: JSON.stringify({
        message: message || "I would like to join this organisation.",
      }),
    }
  );

  if (!response.ok) {
    let message = "Failed to send join request";
    try {
      const errorData = await response.json();
      message = errorData?.detail || errorData?.message || errorData?.error || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

export async function fetchOrganisationJoinRequests(
  organisationId: string
): Promise<PendingJoinRequest[]> {
  const response = await apiFetch(
    `/api/accounts/organisations/${organisationId}/join-requests/`,
    { method: "GET" }
  );

  if (!response.ok) {
    let message = "Failed to fetch join requests";
    try {
      const errorData = await response.json();
      message = errorData?.detail || errorData?.message || errorData?.error || message;
    } catch {}
    throw new Error(message);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function reviewJoinRequest(
  organisationId: string,
  requestId: string,
  payload: ReviewJoinRequestPayload
) {
  const response = await apiFetch(
    `/api/accounts/organisations/${organisationId}/join-requests/${requestId}/review/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    let message = "Failed to review join request";
    try {
      const errorData = await response.json();
      message = errorData?.detail || errorData?.message || errorData?.error || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}