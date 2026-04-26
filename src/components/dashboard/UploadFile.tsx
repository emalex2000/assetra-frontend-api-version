"use client";

import { ChangeEvent, DragEvent, useMemo, useRef, useState } from "react";
import { FiFileText, FiLoader, FiUploadCloud } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import { AssetImportUploadResponse } from "@/types/import";
import { apiFetch } from "../../lib/apiClient";

type UploadFileProps = {
  organisationId: string;
  onUploaded: (data: AssetImportUploadResponse) => void;
};

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_EXTENSIONS = [".xlsx", ".csv"];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isAllowedFile(file: File): boolean {
  const lowerName = file.name.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
}

export default function UploadFile({
  organisationId,
  onUploaded,
}: UploadFileProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");

  const canUpload = useMemo(() => {
    return !!selectedFile && !isUploading;
  }, [selectedFile, isUploading]);

  const validateFile = (file: File): string | null => {
    if (!isAllowedFile(file)) {
      return "Only .xlsx and .csv files are allowed.";
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File size must not exceed ${MAX_FILE_SIZE_MB}MB.`;
    }

    return null;
  };

  const handleFileSelection = (file: File | null) => {
    if (!file) return;

    const validationError = validateFile(file);

    if (validationError) {
      setSelectedFile(null);
      setError(validationError);
      return;
    }

    setError("");
    setSelectedFile(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    handleFileSelection(file);
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0] ?? null;
    handleFileSelection(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await apiFetch(
        `/api/assets/${organisationId}/imports/upload/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const detail =
          data?.detail ||
          data?.file?.[0] ||
          data?.message ||
          "Upload failed. Please try again.";
        throw new Error(detail);
      }

      onUploaded(data as AssetImportUploadResponse);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-[28px] border-2 border-dashed bg-white px-4 py-8 text-center transition sm:px-6 sm:py-10 lg:px-8 lg:py-14 ${
          isDragging
            ? "border-blue-500 bg-blue-50/60"
            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50/70"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.csv"
          className="hidden"
          onChange={handleInputChange}
        />

        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 sm:h-16 sm:w-16">
          <FiUploadCloud className="text-[24px] sm:text-[28px]" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
          Drag and drop your file here
        </h3>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          or
        </p>

        <button
          type="button"
          onClick={handleBrowseClick}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Browse File
        </button>

        <p className="mt-5 text-xs text-gray-500 sm:text-sm">
          .CSV or .XLSX format, up to 10MB.
        </p>
      </div>

      <div className="rounded-[28px] border border-gray-100 bg-gray-50 px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-3 text-blue-600 shadow-sm">
              <FiFileText className="text-xl" />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900 sm:text-base">
                Prepare your file based on the example template
              </p>
              <p className="mt-1 text-sm text-gray-500">
                This helps the backend detect your columns correctly and reduces nonsense from messy spreadsheets.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 self-start rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Download example template
          </button>
        </div>
      </div>

      {selectedFile && (
        <div className="rounded-[28px] border border-green-100 bg-green-50 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                {selectedFile.name}
              </p>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                {formatBytes(selectedFile.size)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRemoveFile}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Remove
              </button>

              <button
                type="button"
                onClick={handleUpload}
                disabled={!canUpload}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUploading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    Continue
                    <FaArrowRight size={12} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}