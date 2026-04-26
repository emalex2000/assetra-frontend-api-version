"use client";

import { useEffect, useMemo, useState } from "react";
import { FiAlertCircle, FiCheckCircle, FiColumns, FiLoader } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import { apiFetch } from "../../lib/apiClient";
import { AssetImportMapResponse, AssetImportSession, ImportFieldOption } from "@/types/import";

type MapColumnsProps = {
  organisationId: string;
  importSession: AssetImportSession;
  onMapped: (data: AssetImportMapResponse) => void;
};

const FIELD_OPTIONS: ImportFieldOption[] = [
  { value: "name", label: "Asset Name", required: true },
  { value: "serial_number", label: "Serial Number", required: true },
  { value: "model", label: "Model" },
  { value: "category", label: "Category" },
  { value: "location_country", label: "Location Country" },
];

const SKIP_VALUE = "__skip__";

function getSuggestedField(header: string): string {
  const normalized = header.trim().toLowerCase();

  if (["device name", "asset name", "name"].includes(normalized)) {
    return "name";
  }

  if (
    ["serial", "serial number", "serial no", "s/n", "sn"].includes(normalized)
  ) {
    return "serial_number";
  }

  if (["model", "device model"].includes(normalized)) {
    return "model";
  }

  if (["category", "device category", "asset category"].includes(normalized)) {
    return "category";
  }

  if (
    ["country", "location", "location country", "asset location"].includes(
      normalized
    )
  ) {
    return "location_country";
  }

  return SKIP_VALUE;
}

export default function MapColumns({
  organisationId,
  importSession,
  onMapped,
}: MapColumnsProps) {
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initialMappings: Record<string, string> = {};

    importSession.headers.forEach((header) => {
      initialMappings[header] = getSuggestedField(header);
    });

    setMappings(initialMappings);
  }, [importSession.headers]);

  const selectedTargetFields = useMemo(() => {
    return Object.values(mappings).filter((value) => value !== SKIP_VALUE);
  }, [mappings]);

  const duplicateSelections = useMemo(() => {
    const counts: Record<string, number> = {};

    selectedTargetFields.forEach((field) => {
      counts[field] = (counts[field] || 0) + 1;
    });

    return Object.entries(counts)
      .filter(([, count]) => count > 1)
      .map(([field]) => field);
  }, [selectedTargetFields]);

  const missingRequiredFields = useMemo(() => {
    return FIELD_OPTIONS.filter((field) => field.required).filter(
      (field) => !selectedTargetFields.includes(field.value)
    );
  }, [selectedTargetFields]);

  const canContinue =
    duplicateSelections.length === 0 && missingRequiredFields.length === 0;

  const handleMappingChange = (sourceColumn: string, value: string) => {
    setMappings((prev) => ({
      ...prev,
      [sourceColumn]: value,
    }));

    setError("");
  };

  const buildPayload = () => {
    const payloadMappings: Record<string, string | null> = {};

    Object.entries(mappings).forEach(([sourceColumn, targetField]) => {
      payloadMappings[sourceColumn] =
        targetField === SKIP_VALUE ? null : targetField;
    });

    return {
      mappings: payloadMappings,
    };
  };

  const handleSubmit = async () => {
    if (!canContinue) {
      setError("Please fix duplicate mappings and map all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const response = await apiFetch(
        `/api/assets/${organisationId}/imports/${importSession.import_id}/map/`,
        {
          method: "POST",
          body: JSON.stringify(buildPayload()),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const detail =
          data?.detail ||
          data?.mappings?.[0] ||
          data?.message ||
          "Column mapping failed.";
        throw new Error(detail);
      }

      onMapped(data as AssetImportMapResponse);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Column mapping failed.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldLabel = (value: string) => {
    return FIELD_OPTIONS.find((field) => field.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-gray-100 bg-gray-50 px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 sm:text-base">
              Uploaded file
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {importSession.filename} · {importSession.total_rows} row
              {importSession.total_rows === 1 ? "" : "s"}
            </p>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Sheet
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {importSession.sheet_name}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-gray-100 bg-white">
        <div className="border-b border-gray-100 px-4 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
              <FiColumns className="text-xl" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Map spreadsheet columns
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Match each file column to the correct backend field. Unrelated columns can be skipped, because not every spreadsheet needs to be a chaotic autobiography.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-4 border-b border-gray-100 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700 md:grid">
          <div>Spreadsheet Column</div>
          <div>Map To</div>
        </div>

        <div className="divide-y divide-gray-100">
          {importSession.headers.map((header) => {
            const selectedValue = mappings[header] || SKIP_VALUE;
            const hasDuplicate =
              selectedValue !== SKIP_VALUE &&
              duplicateSelections.includes(selectedValue);

            return (
              <div
                key={header}
                className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-4 md:px-6"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400 md:hidden">
                    Spreadsheet Column
                  </p>
                  <div className="mt-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900">
                    {header}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400 md:hidden">
                    Map To
                  </p>
                  <select
                    value={selectedValue}
                    onChange={(event) =>
                      handleMappingChange(header, event.target.value)
                    }
                    className={`mt-1 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition ${
                      hasDuplicate
                        ? "border-red-300 ring-2 ring-red-100"
                        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                  >
                    <option value={SKIP_VALUE}>Skip this column</option>
                    {FIELD_OPTIONS.map((field) => (
                      <option key={field.value} value={field.value}>
                        {field.label}
                        {field.required ? " *" : ""}
                      </option>
                    ))}
                  </select>

                  {hasDuplicate && (
                    <p className="mt-2 text-xs text-red-600">
                      This field is already mapped elsewhere.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-[28px] border border-gray-100 bg-white px-4 py-5 sm:px-6">
          <p className="text-sm font-semibold text-gray-900">
            Required fields
          </p>

          <div className="mt-4 space-y-3">
            {FIELD_OPTIONS.filter((field) => field.required).map((field) => {
              const isMapped = selectedTargetFields.includes(field.value);

              return (
                <div
                  key={field.value}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {field.label}
                    </p>
                    <p className="text-xs text-gray-500">Required</p>
                  </div>

                  {isMapped ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      <FiCheckCircle />
                      Mapped
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                      <FiAlertCircle />
                      Missing
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[28px] border border-gray-100 bg-white px-4 py-5 sm:px-6">
          <p className="text-sm font-semibold text-gray-900">
            Mapping summary
          </p>

          <div className="mt-4 space-y-3">
            {Object.entries(mappings).map(([sourceColumn, targetField]) => (
              <div
                key={sourceColumn}
                className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="truncate text-sm font-medium text-gray-900">
                  {sourceColumn}
                </p>
                <span className="inline-flex self-start rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm">
                  {targetField === SKIP_VALUE
                    ? "Skipped"
                    : getFieldLabel(targetField)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {missingRequiredFields.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Missing required mapping:{" "}
          {missingRequiredFields.map((field) => field.label).join(", ")}
        </div>
      )}

      {duplicateSelections.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Duplicate field mapping detected:{" "}
          {duplicateSelections.map((field) => getFieldLabel(field)).join(", ")}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !canContinue}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <FiLoader className="animate-spin" />
              Saving mappings...
            </>
          ) : (
            <>
              Continue to Preview
              <FaArrowRight size={12} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}