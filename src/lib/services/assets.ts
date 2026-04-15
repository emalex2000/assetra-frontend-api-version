import { Category, CreateCategoryPayload, CreateDevicePayload, Device } from "@/types/asset";
import { apiFetch } from "../../../lib/apiClient";


function normalizeDevice(raw: Record<string, unknown>): Device {
  return {
    id: String(raw.asset_id ?? raw.id ?? raw.device_id ?? crypto.randomUUID()),
    asset_name: String(raw.asset_name ?? raw.name ?? "—"),
    asset_tag: String(raw.asset_tag ?? raw.serial_number ?? "—"),
    category_name: String(raw.category_name ?? raw.category ?? "—"),
    assigned_to: String(raw.assigned_to ?? raw.current_holder_name ?? "—"),
    status: String(raw.status ?? "—"),
    condition: String(raw.condition ?? "—"),
  };
}

function normalizeCategory(raw: Record<string, unknown>): Category {
  return {
    category_id: String(raw.category_id ?? raw.id ?? ""),
    name: String(raw.name ?? "Unnamed Category"),
    description: String(raw.description ?? ""),
  };
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    let errorMessage = "Request failed";

    try {
      if (contentType?.includes("application/json")) {
        const errorData = await response.json();
        errorMessage =
          errorData?.detail ||
          errorData?.message ||
          JSON.stringify(errorData);
      } else {
        errorMessage = await response.text();
      }
    } catch {
      errorMessage = `Request failed with status ${response.status}`;
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null as T;
  }

  if (contentType?.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  throw new Error("Expected JSON response from server");
}

export async function fetchDevices(organisationId: string): Promise<Device[]> {
  const response = await apiFetch(
    `/api/assets/${organisationId}/assets/`,
    {
      method: "GET",
    }
  );

  const data = await parseJsonResponse<unknown>(response);

  const items = Array.isArray(data)
    ? data
    : Array.isArray((data as { results?: unknown[] })?.results)
    ? (data as { results: unknown[] }).results
    : [];

  return items.map((item) => normalizeDevice(item as Record<string, unknown>));
}

export async function fetchCategories(
  organisationId: string
): Promise<Category[]> {
  const response = await apiFetch(
    `/api/assets/${organisationId}/categories/`,
    {
      method: "GET",
    }
  );

  const data = await parseJsonResponse<unknown>(response);

  const items = Array.isArray(data)
    ? data
    : Array.isArray((data as { results?: unknown[] })?.results)
    ? (data as { results: unknown[] }).results
    : [];

  return items.map((item) => normalizeCategory(item as Record<string, unknown>));
}

export async function createCategory(
  organisationId: string,
  payload: CreateCategoryPayload
): Promise<Category> {
  const response = await apiFetch(
    `/api/assets/${organisationId}/categories/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  const data = await parseJsonResponse<Record<string, unknown>>(response);
  return normalizeCategory(data);
}

export async function createDevice(
  organisationId: string,
  payload: CreateDevicePayload
): Promise<Device> {
  const response = await apiFetch(
    `/api/assets/${organisationId}/create_asset/`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  const data = await parseJsonResponse<Record<string, unknown>>(response);
  return normalizeDevice(data);
}