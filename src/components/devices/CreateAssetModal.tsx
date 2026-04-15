"use client";

import { Category, CreateDevicePayload } from "@/types/asset";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useMemo, useState } from "react";
import { getData } from "country-list";
import { FiChevronDown, FiPackage, FiTag, FiGrid, FiMapPin } from "react-icons/fi";

type Props = {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (payload: CreateDevicePayload) => Promise<void>;
};

export default function CreateDeviceModal({
  open,
  onClose,
  categories,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CreateDevicePayload>({
    name: "",
    serial_number: "",
    model: "",
    category: "",
    location_country: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const countries = useMemo(() => getData(), []);

  if (!open) return null;

  const handleChange = (
    key: keyof CreateDevicePayload,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.serial_number.trim() || !form.category) {
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit({
        ...form,
        name: form.name.trim(),
        serial_number: form.serial_number.trim(),
        model: form.model?.trim(),
        location_country: form.location_country?.trim(),
      });

      setForm({
        name: "",
        serial_number: "",
        model: "",
        category: "",
        location_country: "",
      });

      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="w-full max-w-2xl rounded-[28px] border border-gray-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
            Create Device
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Add a new device to your organisation inventory.
          </p>
        </div>

        {/* Body */}
        <div className="px-5 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Device Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Device Name
              </label>
              <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-gray-400 focus-within:bg-white">
                <FiPackage className="mr-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="e.g. MacBook Pro 16"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Serial Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Serial Number
              </label>
              <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-gray-400 focus-within:bg-white">
                <FiTag className="mr-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="e.g. SN-10293-XY"
                  value={form.serial_number}
                  onChange={(e) =>
                    handleChange("serial_number", e.target.value)
                  }
                  className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Model */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Model
              </label>
              <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-gray-400 focus-within:bg-white">
                <FiPackage className="mr-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="e.g. M3 Pro"
                  value={form.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiGrid size={18} />
                </div>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiChevronDown size={18} />
                </div>
                <select
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-11 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Location Country
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiMapPin size={18} />
                </div>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiChevronDown size={18} />
                </div>
                <select
                  value={form.location_country}
                  onChange={(e) =>
                    handleChange("location_country", e.target.value)
                  }
                  className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-11 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:bg-white"
                >
                  <option value="">Select country</option>
                  {countries.map((country: { code: Key | readonly string[] | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-500">
                The country value will be submitted as its country code.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            onClick={onClose}
            className="rounded-2xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Device"}
          </button>
        </div>
      </div>
    </div>
  );
}