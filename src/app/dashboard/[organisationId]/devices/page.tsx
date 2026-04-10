"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { FiPlus, FiX, FiTag, FiMonitor, FiSearch } from "react-icons/fi";
import SideBar from "../../../../../components/dashboard/LayoutNav";
import { apiFetch } from "../../../../../lib/apiClient";


type Device = {
  asset_id: string;
  asset_name: string;
  asset_tag?: string;
  category_name?: string;
  assigned_to?: string;
  status?: string;
  condition?: string;
};

type Category = {
  category_id: string;
  name: string;
  description?: string;
};

type CategoryFormData = {
  name: string;
  description: string;
};


export default function DevicesPage(): JSX.Element {
  const params = useParams<{ organisationId: string }>();
  const organisationId = params.organisationId;

  const [devices, setDevices] = useState<Device[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingDevices, setLoadingDevices] = useState<boolean>(true);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>("");

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [creatingCategory, setCreatingCategory] = useState<boolean>(false);
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: "",
    description: "",
  });
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoadingDevices(true);
        setDeviceError(null);

        // Replace with your real device endpoint
        const response = await apiFetch(
          `/api/assets/organisations/${organisationId}/devices/`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch devices.");
        }

        const data = await response.json();
        setDevices(Array.isArray(data) ? data : data.results || []);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load devices.";
        setDeviceError(message);
        setDevices([]);
      } finally {
        setLoadingDevices(false);
      }
    };

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError(null);

        const response = await apiFetch(
          `/api/assets/organisations/${organisationId}/categories/`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories.");
        }

        const data = await response.json();
        setCategories(Array.isArray(data) ? data : data.results || []);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load categories.";
        setCategoryError(message);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (organisationId) {
      fetchDevices();
      fetchCategories();
    }
  }, [organisationId]);

  const filteredDevices = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return devices;

    return devices.filter((device) => {
      return (
        device.asset_name?.toLowerCase().includes(query) ||
        device.asset_tag?.toLowerCase().includes(query) ||
        device.category_name?.toLowerCase().includes(query) ||
        device.status?.toLowerCase().includes(query) ||
        device.condition?.toLowerCase().includes(query)
      );
    });
  }, [devices, search]);

  const handleCreateCategory = async () => {
    setCategoryFormError(null);

    if (!categoryForm.name.trim()) {
      setCategoryFormError("Category name is required.");
      return;
    }

    try {
      setCreatingCategory(true);

      const response = await apiFetch(
        `/api/assets/organisations/${organisationId}/categories/`,
        {
          method: "POST",
          body: JSON.stringify({
            name: categoryForm.name.trim(),
            description: categoryForm.description.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.name?.[0] ||
            data?.error ||
            "Failed to create category."
        );
      }

      setCategories((prev) =>
        [...prev, data].sort((a, b) => a.name.localeCompare(b.name))
      );

      setCategoryForm({
        name: "",
        description: "",
      });

      setIsCategoryModalOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create category.";
      setCategoryFormError(message);
    } finally {
      setCreatingCategory(false);
    }
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-gray-900">
              Device Management
            </h1>
            <p className="text-sm text-gray-500">
              View all devices, manage records, and organize them with categories.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <FiTag size={16} />
              Add Category
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <FiPlus size={16} />
              Add Device
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                All Devices
              </h2>

              <div className="relative w-full md:max-w-sm">
                <FiSearch
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="search"
                  placeholder="Search devices..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {deviceError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {deviceError}
              </div>
            )}

            {loadingDevices ? (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-sm text-gray-500">
                Loading devices...
              </div>
            ) : filteredDevices.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                <FiMonitor size={28} className="mx-auto mb-3 text-gray-400" />
                <h3 className="text-base font-semibold text-gray-900">
                  No devices found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Devices will appear here once they are created.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                      <th className="px-3 py-2">Device</th>
                      <th className="px-3 py-2">Tag</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Assigned To</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Condition</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredDevices.map((device) => (
                      <tr
                        key={device.asset_id}
                        className="rounded-2xl bg-gray-50 text-sm text-gray-700"
                      >
                        <td className="rounded-l-xl px-3 py-4 font-medium text-gray-900">
                          {device.asset_name || "—"}
                        </td>
                        <td className="px-3 py-4">{device.asset_tag || "—"}</td>
                        <td className="px-3 py-4">
                          {device.category_name || "—"}
                        </td>
                        <td className="px-3 py-4">
                          {device.assigned_to || "—"}
                        </td>
                        <td className="px-3 py-4">{device.status || "—"}</td>
                        <td className="rounded-r-xl px-3 py-4">
                          {device.condition || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Categories
                </h2>
                <p className="text-sm text-gray-500">
                  Organize devices by category
                </p>
              </div>
            </div>

            {categoryError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {categoryError}
              </div>
            )}

            {loadingCategories ? (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-500">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                <FiTag size={24} className="mx-auto mb-3 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-900">
                  No categories yet
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Add your first category to better organize assets.
                </p>

                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-900"
                >
                  <FiPlus size={15} />
                  Add Category
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.category_id}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
                  >
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {category.description || "No description"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>

      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Add Category
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Create a new asset category for this organisation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setCategoryFormError(null);
                }}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g. Laptops"
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of this category"
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {categoryFormError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {categoryFormError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryModalOpen(false);
                    setCategoryFormError(null);
                  }}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={creatingCategory}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {creatingCategory ? "Creating..." : "Create Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SideBar>
  );
}