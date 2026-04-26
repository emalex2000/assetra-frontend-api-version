"use client";

import { ChangeEvent, FormEvent, JSX, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { getData } from "country-list";

import Button from "../../../../../components/landing_page/Button";
import SideBar from "../../../../../components/dashboard/LayoutNav";
import { apiFetch } from "../../../../../lib/apiClient";

type Category = {
  category_id: string;
  name: string;
  description?: string;
};

type AssetFormData = {
  name: string;
  serial_number: string;
  model: string;
  category: string;
  location_country: string;
};

const initialFormData: AssetFormData = {
  name: "",
  serial_number: "",
  model: "",
  category: "",
  location_country: "",
};

const extractErrorMessage = (data: Record<string, unknown>): string => {
  if (typeof data.detail === "string") return data.detail;
  if (typeof data.error === "string") return data.error;
  if (typeof data.message === "string") return data.message;

  for (const value of Object.values(data)) {
    if (Array.isArray(value) && value.length > 0) {
      return String(value[0]);
    }

    if (typeof value === "string") {
      return value;
    }
  }

  return "Failed to create asset.";
};

export default function CreateAsset(): JSX.Element {
  const params = useParams<{ organisationId: string }>();
  const router = useRouter();
  const organisationId = params.organisationId;

  const [formData, setFormData] = useState<AssetFormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const countries = useMemo(() => {
    return getData()
      .map((country) => ({
        code: country.code,
        name: country.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!organisationId) return;

      try {
        setLoadingCategories(true);
        setCategoryError(null);

        const response = await apiFetch(
          `/api/assets/${organisationId}/categories/`,
          {
            method: "GET",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(extractErrorMessage(data));
        }

        const categoryList = Array.isArray(data) ? data : data.results || [];
        setCategories(categoryList);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load categories.";

        setCategoryError(message);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [organisationId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    router.push(`/dashboard/${organisationId}/devices`);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!formData.name.trim()) {
      setFormError("Asset name is required.");
      return;
    }

    if (!formData.serial_number.trim()) {
      setFormError("Serial number is required.");
      return;
    }

    if (!formData.category) {
      setFormError("Please select a category.");
      return;
    }

    if (!formData.location_country) {
      setFormError("Please select a location country.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await apiFetch(
        `/api/assets/${organisationId}/create_asset/`,
        {
          method: "POST",
          body: JSON.stringify({
            name: formData.name.trim(),
            serial_number: formData.serial_number.trim(),
            model: formData.model.trim(),
            category: formData.category,
            location_country: formData.location_country,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(extractErrorMessage(data));
      }

      setSuccessMessage("Asset created successfully.");
      setFormData(initialFormData);

      router.push(`/dashboard/${organisationId}/devices`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create asset.";

      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SideBar>
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create Asset
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-500">
            Register a new asset in your organisation
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Asset Details
            </h2>
          </div>

          {formError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {categoryError && (
            <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
              {categoryError}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Asset Name*
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Asset name"
                  className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="serial_number"
                  className="text-sm font-medium text-gray-700"
                >
                  Serial Number*
                </label>
                <input
                  id="serial_number"
                  name="serial_number"
                  type="text"
                  value={formData.serial_number}
                  onChange={handleChange}
                  placeholder="Enter device serial number"
                  className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="model"
                  className="text-sm font-medium text-gray-700"
                >
                  Model
                </label>
                <input
                  id="model"
                  name="model"
                  type="text"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Model"
                  className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="category"
                  className="text-sm font-medium text-gray-700"
                >
                  Category*
                </label>

                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={loadingCategories}
                    className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50"
                  >
                    <option value="">
                      {loadingCategories
                        ? "Loading categories..."
                        : categories.length > 0
                        ? "Select category"
                        : "No categories available"}
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.category_id}
                        value={category.category_id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <FiChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label
                  htmlFor="location_country"
                  className="text-sm font-medium text-gray-700"
                >
                  Location*
                </label>

                <div className="relative">
                  <select
                    id="location_country"
                    name="location_country"
                    value={formData.location_country}
                    onChange={handleChange}
                    className="h-11 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select country</option>

                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>

                  <FiChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse justify-end gap-3 pt-4 sm:flex-row">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-red-200 hover:text-red-500 sm:w-auto"
              >
                Cancel
              </button>

              <div className="w-full sm:w-auto">
                <Button
                  text={submitting ? "Creating..." : "Create asset"}
                  variant={"black"}
                  href={""}
                  icon={FaArrowRight}
                  iconPosition="right"
                  className="w-full bg-blue-500 sm:w-auto"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </SideBar>
  );
}