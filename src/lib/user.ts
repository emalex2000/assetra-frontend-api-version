import type { CurrentUser } from "@/types/auth";
import { apiFetch } from "./apiClient";

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const response = await apiFetch("/api/accounts/auth/user/", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail || data?.error || "Failed to fetch user.");
  }

  return data;
}