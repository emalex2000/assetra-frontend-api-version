import { refreshToken } from "./authService";
import { authStore } from "./authStore";
import { tokenStorage } from "./tokenStorage";
import { clearClientSession, redirectToLogin } from "./authSession";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

let refreshPromise: Promise<string | null> | null = null;

async function tryRefresh(): Promise<string | null> {
  const currentRefreshToken = tokenStorage.getRefreshToken();

  if (!currentRefreshToken) {
    return null;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const data = await refreshToken(currentRefreshToken);

        authStore.setAccessToken(data.access);

        if (data.refresh) {
          tokenStorage.setRefreshToken(data.refresh);
        }

        return data.access;
      } catch {
        clearClientSession();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

type ApiFetchOptions = RequestInit & {
  requiresAuth?: boolean;
};

export async function apiFetch(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<Response> {
  const { requiresAuth = true, headers, ...restOptions } = options;

  const buildHeaders = (token?: string | null) => {
    const requestHeaders = new Headers(headers || {});

    const isFormData =
      typeof FormData !== "undefined" && restOptions.body instanceof FormData;

    if (!requestHeaders.has("Content-Type") && !isFormData) {
      requestHeaders.set("Content-Type", "application/json");
    }

    if (requiresAuth && token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    return requestHeaders;
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: buildHeaders(authStore.getAccessToken()),
  });

  if (!requiresAuth || response.status !== 401) {
    return response;
  }

  const newAccessToken = await tryRefresh();

  if (!newAccessToken) {
    clearClientSession();
    redirectToLogin();
    return response;
  }

  response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...restOptions,
    headers: buildHeaders(newAccessToken),
  });

  if (response.status === 401) {
    clearClientSession();
    redirectToLogin();
  }

  return response;
}