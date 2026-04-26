"use client";

import { ChangeEvent, FormEvent, JSX, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
import { getData } from "country-list";
import { authStore } from "../../../lib/authStore";

type FormDataState = {
  name: string;
  industry: string;
  company_size: string;
  company_type: string;
  country: string;
  organisation_email: string;
  organisation_phone_number: string;
};

type CreateOrganisationResponse = {
  message?: string;
  error?: string;
  [key: string]: unknown;
};

const industries = [
  "Technology",
  "Healthcare",
  "Education",
  "Finance",
  "Manufacturing",
  "Retail",
  "Telecommunications",
  "Energy",
  "Logistics",
  "Government",
  "Other",
];

const companySizes = [
  { label: "1-10 Employees", value: "10" },
  { label: "11-50 Employees", value: "50" },
  { label: "51-200 Employees", value: "200" },
  { label: "201-500 Employees", value: "500" },
  { label: "500+ Employees", value: "501" },
];

const companyTypes = [
  "Private Company",
  "Public Company",
  "Nonprofit",
  "Government Agency",
  "Startup",
  "Enterprise",
  "Other",
];

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

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

  return "Failed to create organisation";
};

export default function CreateOrganisation(): JSX.Element {
  const router = useRouter();

  const countries = useMemo(() => {
    return getData().sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    industry: "",
    company_size: "",
    company_type: "",
    country: "",
    organisation_email: "",
    organisation_phone_number: "",
    
  });
  console.log(formData)
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  console.log("logo problem")
  const [logoName, setLogoName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCompanyLogo(file);
    setLogoName(file ? file.name : "");
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;

  return (
    authStore.getAccessToken() ||
    sessionStorage.getItem("access_token") ||
    localStorage.getItem("access_token")
  );
};

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (
    !formData.name.trim() ||
    !formData.industry ||
    !formData.company_size ||
    !formData.company_type ||
    !formData.country
  ) {
    setError("Please fill in all required organisation fields.");
    return;
  }

  try {
    setLoading(true);

    const accessToken = getAccessToken();

    if (!accessToken) {
      throw new Error("You are not authenticated.");
    }

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("industry", formData.industry);
    payload.append("company_size", formData.company_size);
    payload.append("company_type", formData.company_type);
    payload.append("country", formData.country);

    if (formData.organisation_email.trim()) {
      payload.append(
        "organisation_email",
        formData.organisation_email.trim().toLowerCase()
      );
    }

    if (formData.organisation_phone_number.trim()) {
      payload.append(
        "organisation_phone_number",
        formData.organisation_phone_number.trim()
      );
    }

    if (companyLogo) {
      payload.append("company_logo", companyLogo);
    }

    const res = await fetch(`${API_BASE_URL}/api/accounts/create-company/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: payload,
    });

    const contentType = res.headers.get("content-type") || "";
    let data: Record<string, unknown> = {};

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const rawText = await res.text();
      throw new Error(rawText || "Backend returned a non-JSON response.");
    }

    if (!res.ok) {
      throw new Error(extractErrorMessage(data));
    }

    setSuccess("Organisation created successfully.");
    router.push("/dashboard");
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Something went wrong.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <img src="/logo.png" alt="Logo" className="h-auto w-[140px]" />
          <button
            type="button"
            onClick={handleSkip}
            className="cursor-pointer text-sm font-medium text-blue-600"
          >
            Skip for now
          </button>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-[28px] font-semibold text-gray-900 sm:text-[32px]">
            Create Your Organisation
          </h1>
          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Add your company details to get started
          </p>
        </div>

        <div className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          <h2 className="mb-6 text-[20px] font-semibold text-gray-900">
            Organisation Details
          </h2>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Organisation Name*
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter organisation name"
                className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="industry" className="text-sm font-medium text-gray-700">
                  Industry*
                </label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-blue-500"
                >
                  <option value="">Select industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="company_size" className="text-sm font-medium text-gray-700">
                  Company Size*
                </label>
                <select
                  id="company_size"
                  value={formData.company_size}
                  onChange={handleChange}
                  className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-blue-500"
                >
                  <option value="">Select company size</option>
                  {companySizes.map((size) => (
                    <option key={size.label} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="company_type" className="text-sm font-medium text-gray-700">
                  Company Type*
                </label>
                <select
                  id="company_type"
                  value={formData.company_type}
                  onChange={handleChange}
                  className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-blue-500"
                >
                  <option value="">Select company type</option>
                  {companyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="country" className="text-sm font-medium text-gray-700">
                  Country*
                </label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-blue-500"
                >
                  <option value="">Select country</option>
                  {countries.map((country: { code: Key | readonly string[] | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-[16px] font-semibold text-gray-900">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="organisation_email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Organisation Email
                    </label>
                    <input
                      id="organisation_email"
                      type="email"
                      value={formData.organisation_email}
                      onChange={handleChange}
                      placeholder="Defaults to creator email"
                      className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="organisation_phone_number"
                      className="text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      id="organisation_phone_number"
                      type="tel"
                      value={formData.organisation_phone_number}
                      onChange={handleChange}
                      placeholder="Defaults to creator phone number"
                      className="h-12 w-full rounded-lg border border-gray-300 px-4 outline-none transition focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="organisationLogo"
                    className="text-sm font-medium text-gray-700"
                  >
                    Organisation Logo
                  </label>

                  <label
                    htmlFor="organisationLogo"
                    className="flex min-h-[210px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 text-center transition hover:border-blue-500 hover:bg-blue-50"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <FiUploadCloud size={30} />
                    </div>

                    <p className="text-sm font-semibold text-gray-800">
                      {logoName || "Upload Photo"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Drag and drop or <span className="font-medium text-blue-600">browse</span>
                    </p>
                    <p className="mt-2 text-xs text-gray-400">PNG, JPG, or JPEG</p>
                  </label>
/*....................................................................... */
                  <input
                    id="organisationLogo"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">
                {success}
              </div>
            )}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleSkip}
                className="cursor-pointer text-sm font-medium text-blue-600"
              >
                Skip for now
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Organisation"}
                <FaArrowRight />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

