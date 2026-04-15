"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiCopy,
  FiLoader,
  FiShield,
} from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";

import {
  AssetImportSession,
  AssetImportValidationResponse,
  AssetImportValidationRow,
} from "@/types/import";
import { apiFetch } from "../../lib/apiClient";

type PreviewAndValidateProps = {
  organisationId: string;
  importSession: AssetImportSession;
  onValidated: (data: AssetImportValidationResponse) => void;
};

const FIELD_LABELS: Record<string, string> = {
  name: "Asset Name",
  serial_number: "Serial Number",
  model: "Model",
  category: "Category",
  location_country: "Location Country",
};

export default function PreviewAndValidate({
  organisationId,
  importSession,
  onValidated,
}: PreviewAndValidateProps) {
  const [validationResult, setValidationResult] =
    useState<AssetImportValidationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContinuing, setIsContinuing] = useState(false);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "valid" | "invalid">(
    "all"
  );

  useEffect(() => {
    let isMounted = true;

    const runValidation = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await apiFetch(
          `/api/assets/${organisationId}/imports/${importSession.import_id}/validate/`,
          {
            method: "POST",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          const detail =
            data?.detail ||
            data?.message ||
            "Validation failed. Please try again.";
          throw new Error(detail);
        }

        if (isMounted) {
          setValidationResult(data as AssetImportValidationResponse);
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Validation failed. Please try again.";

        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    runValidation();

    return () => {
      isMounted = false;
    };
  }, [organisationId, importSession.import_id]);

  const rows = validationResult?.preview_rows ?? [];

  const filteredRows = useMemo(() => {
    if (activeFilter === "valid") {
      return rows.filter((row) => row.is_valid);
    }

    if (activeFilter === "invalid") {
      return rows.filter((row) => !row.is_valid);
    }

    return rows;
  }, [rows, activeFilter]);

  const hasInvalidRows = (validationResult?.summary.invalid_rows ?? 0) > 0;
  const canContinue = !!validationResult && !hasInvalidRows;

  const handleContinue = async () => {
    if (!validationResult) return;

    try {
      setIsContinuing(true);
      setError("");
      onValidated(validationResult);
    } catch {
      setError("Unable to continue.");
    } finally {
      setIsContinuing(false);
    }
  };

  const renderRowFields = (row: AssetImportValidationRow) => {
    const entries = Object.entries(row.normalized_data ?? {});

    if (entries.length === 0) {
      return (
        <p className="text-sm text-gray-500">
          No mapped values available for this row.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {FIELD_LABELS[key] || key}
            </p>
            <p className="mt-1 break-words text-sm font-medium text-gray-900">
              {value === null || value === "" ? "—" : String(value)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-gray-100 bg-gray-50 px-6 py-10 text-center">
        <div className="mb-4 rounded-2xl bg-blue-50 p-4 text-blue-600">
          <FiLoader className="animate-spin text-2xl" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Validating your file
        </h3>
        <p className="mt-2 max-w-md text-sm text-gray-500 sm:text-base">
          We are checking required fields, duplicates, category matches, and country values. Because spreadsheets always need supervision.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[28px] border border-red-200 bg-red-50 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-white p-3 text-red-600 shadow-sm">
            <FiAlertCircle className="text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-800">
              Validation failed
            </h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!validationResult) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <div className="rounded-[28px] border border-gray-100 bg-white px-5 py-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
              <FiCopy className="text-xl" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Total Rows
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {validationResult.summary.total_rows}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-green-100 bg-green-50 px-5 py-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white p-3 text-green-600 shadow-sm">
              <FiCheckCircle className="text-xl" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-green-700">
                Valid Rows
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {validationResult.summary.valid_rows}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-red-100 bg-red-50 px-5 py-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white p-3 text-red-600 shadow-sm">
              <FiAlertCircle className="text-xl" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-red-700">
                Invalid Rows
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {validationResult.summary.invalid_rows}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-amber-100 bg-amber-50 px-5 py-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white p-3 text-amber-600 shadow-sm">
              <FiClock className="text-xl" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
                Duplicate Serials
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {validationResult.summary.duplicate_rows}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-gray-100 bg-white">
        <div className="flex flex-col gap-4 border-b border-gray-100 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
              <FiShield className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Validation Preview
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Review the preview rows and fix any spreadsheet issues before import.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("valid")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeFilter === "valid"
                  ? "bg-green-600 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Valid
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("invalid")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeFilter === "invalid"
                  ? "bg-red-600 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Invalid
            </button>
          </div>
        </div>

        <div className="space-y-4 px-4 py-5 sm:px-6">
          {filteredRows.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              No rows available for this filter.
            </div>
          ) : (
            filteredRows.map((row) => (
              <div
                key={row.row_number}
                className={`rounded-[24px] border px-4 py-4 sm:px-5 ${
                  row.is_valid
                    ? "border-green-100 bg-green-50/50"
                    : "border-red-100 bg-red-50/50"
                }`}
              >
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-2xl p-3 ${
                        row.is_valid
                          ? "bg-white text-green-600"
                          : "bg-white text-red-600"
                      }`}
                    >
                      {row.is_valid ? (
                        <FiCheckCircle className="text-lg" />
                      ) : (
                        <FiAlertCircle className="text-lg" />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Row {row.row_number}
                      </p>
                      <p
                        className={`mt-1 text-xs font-medium ${
                          row.is_valid ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {row.is_valid ? "Ready to import" : "Needs attention"}
                      </p>
                    </div>
                  </div>
                </div>

                {renderRowFields(row)}

                {!row.is_valid && row.errors.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-red-200 bg-white px-4 py-4">
                    <p className="text-sm font-semibold text-red-700">
                      Issues found
                    </p>
                    <div className="mt-3 space-y-2">
                      {row.errors.map((issue, index) => (
                        <div
                          key={`${row.row_number}-${index}`}
                          className="flex items-start gap-2 text-sm text-red-700"
                        >
                          <FiAlertCircle className="mt-0.5 shrink-0" />
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {hasInvalidRows && (
        <div className="rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-3 text-amber-600 shadow-sm">
              <FiAlertCircle className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-800">
                Import is not ready yet
              </h3>
              <p className="mt-1 text-sm text-amber-700">
                Some rows failed validation. Fix the spreadsheet issues and re-upload or remap before continuing.
              </p>
            </div>
          </div>
        </div>
      )}

      {!hasInvalidRows && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleContinue}
            disabled={isContinuing}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isContinuing ? (
              <>
                <FiLoader className="animate-spin" />
                Continuing...
              </>
            ) : (
              <>
                Continue to Import
                <FaArrowRight size={12} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}