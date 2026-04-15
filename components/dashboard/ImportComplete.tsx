"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiFileText,
  FiLoader,
  FiRefreshCw,
} from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";

import {
  AssetImportCommitResponse,
  AssetImportSession,
  AssetImportValidationResponse,
} from "@/types/import";
import { apiFetch } from "../../lib/apiClient";

type ImportCompleteProps = {
  organisationId: string;
  importSession: AssetImportSession | null;
  validatedSession: AssetImportValidationResponse | null;
  completedSession: AssetImportCommitResponse | null;
  onCompleted: (data: AssetImportCommitResponse) => void;
};

const FIELD_LABELS: Record<string, string> = {
  name: "Asset Name",
  serial_number: "Serial Number",
  model: "Model",
  category: "Category",
  location_country: "Location Country",
};

export default function ImportComplete({
  organisationId,
  importSession,
  validatedSession,
  completedSession,
  onCompleted,
}: ImportCompleteProps) {
  const [localResult, setLocalResult] =
    useState<AssetImportCommitResponse | null>(completedSession);
  const [isImporting, setIsImporting] = useState(!completedSession);
  const [error, setError] = useState("");

  const activeResult = useMemo(
    () => completedSession || localResult,
    [completedSession, localResult]
  );

  useEffect(() => {
    if (!importSession || !validatedSession || completedSession) {
      setIsImporting(false);
      return;
    }

    let isMounted = true;

    const commitImport = async () => {
      try {
        setIsImporting(true);
        setError("");

        const response = await apiFetch(
          `/api/assets/${organisationId}/imports/${importSession.import_id}/commit/`,
          {
            method: "POST",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          const detail =
            data?.detail ||
            data?.message ||
            "Import failed. Please try again.";
          throw new Error(detail);
        }

        if (isMounted) {
          setLocalResult(data as AssetImportCommitResponse);
          onCompleted(data as AssetImportCommitResponse);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Import failed. Please try again.";

        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsImporting(false);
        }
      }
    };

    commitImport();

    return () => {
      isMounted = false;
    };
  }, [
    organisationId,
    importSession,
    validatedSession,
    completedSession,
    onCompleted,
  ]);

  const renderFieldGrid = (
    data: Record<string, string | number | null> | undefined
  ) => {
    if (!data) {
      return (
        <p className="text-sm text-gray-500">
          No row details available.
        </p>
      );
    }

    const entries = Object.entries(data);

    if (entries.length === 0) {
      return (
        <p className="text-sm text-gray-500">
          No row details available.
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

  if (!importSession || !validatedSession) {
    return (
      <div className="rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-5 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-white p-3 text-amber-600 shadow-sm">
            <FiAlertCircle className="text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-800">
              Import data is incomplete
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              The import session is missing required context. Go back and complete the previous steps like a civilized system.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isImporting) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-gray-100 bg-gray-50 px-6 py-10 text-center">
        <div className="mb-4 rounded-2xl bg-blue-50 p-4 text-blue-600">
          <FiLoader className="animate-spin text-2xl" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Importing your assets
        </h3>
        <p className="mt-2 max-w-md text-sm text-gray-500 sm:text-base">
          We are creating asset records from the validated rows now. This is the part where the spreadsheet finally has consequences.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <div className="rounded-[28px] border border-red-200 bg-red-50 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-3 text-red-600 shadow-sm">
              <FiAlertCircle className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">
                Import failed
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <FiRefreshCw />
            Retry Flow
          </button>
        </div>
      </div>
    );
  }

  if (!activeResult) {
    return null;
  }

  const isSuccessful = activeResult.imported_count > 0 && activeResult.failed_count === 0;
  const hasFailures = activeResult.failed_count > 0;

  return (
    <div className="space-y-6">
      <div
        className={`rounded-[32px] border px-5 py-6 shadow-sm sm:px-6 ${
          isSuccessful
            ? "border-green-100 bg-green-50"
            : "border-blue-100 bg-blue-50"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`rounded-2xl p-4 shadow-sm ${
                isSuccessful
                  ? "bg-white text-green-600"
                  : "bg-white text-blue-600"
              }`}
            >
              <FiCheckCircle className="text-2xl" />
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                {isSuccessful
                  ? "Import completed successfully"
                  : "Import completed with partial results"}
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
                {isSuccessful
                  ? "Your assets were imported successfully and are now available in the organisation inventory."
                  : "Some rows were imported successfully, while others failed during the final commit step."}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Import ID
            </p>
            <p className="mt-1 break-all text-sm font-semibold text-gray-900">
              {activeResult.import_id}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-[28px] border border-green-100 bg-green-50 px-5 py-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white p-3 text-green-600 shadow-sm">
              <FiCheckCircle className="text-xl" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-green-700">
                Imported
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {activeResult.imported_count}
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
                Failed
              </p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {activeResult.failed_count}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-gray-100 bg-white px-5 py-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
              <FiFileText className="text-xl" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Source File
              </p>
              <p className="mt-1 break-words text-sm font-semibold text-gray-900">
                {importSession.filename}
              </p>
            </div>
          </div>
        </div>
      </div>

      {hasFailures && (
        <div className="rounded-[28px] border border-red-100 bg-white">
          <div className="border-b border-red-100 px-4 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-red-50 p-3 text-red-600">
                <FiAlertCircle className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Failed Rows Preview
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  These rows failed during final import. Validation helps, but reality still enjoys surprises.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 px-4 py-5 sm:px-6">
            {activeResult.failed_rows_preview.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                No failed row details were returned.
              </div>
            ) : (
              activeResult.failed_rows_preview.map((row) => (
                <div
                  key={row.row_number}
                  className="rounded-[24px] border border-red-100 bg-red-50/50 px-4 py-4 sm:px-5"
                >
                  <div className="mb-4 flex items-start gap-3">
                    <div className="rounded-2xl bg-white p-3 text-red-600">
                      <FiAlertCircle className="text-lg" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Row {row.row_number}
                      </p>
                      <p className="mt-1 text-sm text-red-700">
                        {row.error}
                      </p>
                    </div>
                  </div>

                  {renderFieldGrid(row.normalized_data)}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Link
          href={`/dashboard/${organisationId}/devices`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Go to Devices
          <FaArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}