// lib/authSession.ts
import { refreshToken } from "./authService";
import { authStore } from "./authStore";
import { tokenStorage } from "./tokenStorage";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function clearClientSession(): void {
  authStore.clearAccessToken();
  tokenStorage.clearRefreshToken();

  if (typeof window !== "undefined") {
    sessionStorage.removeItem("user_email");
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("access_token");

    localStorage.removeItem("access_token");
    localStorage.removeItem("remember_me");
  }
}

export function redirectToLogin(): void {
  if (typeof window !== "undefined") {
    window.location.replace("/login");
  }
}

export async function ensureAuthenticated(): Promise<boolean> {
  if (typeof window === "undefined") {
    return true;
  }

  const refresh = tokenStorage.getRefreshToken();

  if (!refresh) {
    clearClientSession();
    redirectToLogin();
    return false;
  }

  const existingAccess = authStore.getAccessToken();
  if (existingAccess) {
    return true;
  }

  try {
    const data = await refreshToken(refresh);

    if (!data.access) {
      throw new Error("No access token returned.");
    }

    authStore.setAccessToken(data.access);

    if (data.refresh) {
      tokenStorage.setRefreshToken(data.refresh);
    }

    return true;
  } catch {
    clearClientSession();
    redirectToLogin();
    return false;
  }
}

export async function logoutUser(): Promise<void> {
  const refresh = tokenStorage.getRefreshToken();
  const access = authStore.getAccessToken();

  try {
    if (refresh) {
      await fetch(`${API_BASE_URL}/api/accounts/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(access ? { Authorization: `Bearer ${access}` } : {}),
        },
        body: JSON.stringify({ refresh }),
      });
    }
  } catch (error) {
    console.error("Logout request failed:", error);
  } finally {
    clearClientSession();
    redirectToLogin();
  }
}