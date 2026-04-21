import { apiFetch } from "../../lib/apiClient";
import type {
  AssignableAsset,
  AssignableUser,
  AssignmentCreateResponse,
  CreateAssignmentPayload,
} from "@/types/assignment";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    let errorMessage = "Something went wrong.";

    if (isJson) {
      const errorData = await response.json().catch(() => null);
      errorMessage =
        errorData?.detail ||
        errorData?.message ||
        JSON.stringify(errorData) ||
        errorMessage;
    } else {
      const text = await response.text().catch(() => "");
      errorMessage = text || errorMessage;
    }

    throw new Error(errorMessage);
  }

  if (!isJson) {
    throw new Error("Expected JSON response from server.");
  }

  return response.json() as Promise<T>;
}

export async function fetchAssignableAssets(
  organisationId: string,
  query = ""
): Promise<AssignableAsset[]> {
  const search = new URLSearchParams();

  if (query.trim()) {
    search.set("q", query.trim());
  }

  const suffix = search.toString() ? `?${search.toString()}` : "";

  const response = await apiFetch(
    `/api/assets/${organisationId}/assignable-assets/${suffix}`,
    {
      method: "GET",
      requiresAuth: true,
    }
  );

  return parseJsonResponse<AssignableAsset[]>(response);
}

export async function fetchAssignableUsers(
  organisationId: string,
  query = ""
): Promise<AssignableUser[]> {
  const search = new URLSearchParams();

  if (query.trim()) {
    search.set("q", query.trim());
  }

  const suffix = search.toString() ? `?${search.toString()}` : "";

  const response = await apiFetch(
    `/api/assets/${organisationId}/assignable-users${suffix}`,
    {
      method: "GET",
      requiresAuth: true,
    }
  );

  return parseJsonResponse<AssignableUser[]>(response);
}

export async function createAssignment(
  organisationId: string,
  payload: CreateAssignmentPayload
): Promise<AssignmentCreateResponse> {
  const response = await apiFetch(
    `/api/assets/${organisationId}/assigments/create/`,
    {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify(payload),
    }
  );

  return parseJsonResponse<AssignmentCreateResponse>(response);
}