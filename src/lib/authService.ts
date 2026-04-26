const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type RefreshResponse = {
  access: string;
  refresh?: string;
};

export async function refreshToken(
  refresh: string
): Promise<RefreshResponse> {
  const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    throw new Error("Unable to refresh token");
  }

  return response.json();
}