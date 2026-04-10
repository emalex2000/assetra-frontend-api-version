"use client";

import { FiUploadCloud, FiFileText } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";

export default function UploadFile() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Upload Container */}
      <div className="w-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50/30">
        
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <FiUploadCloud size={26} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900">
          Drag and drop your file here
        </h3>

        {/* Subtitle */}
        <p className="mt-1 text-sm text-gray-500">
          or
        </p>

        {/* Browse Button */}
        <div className="mt-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Browse File
            <FaArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* File Info */}
      <p className="mt-4 text-sm text-gray-500">
        .CSV, .XLS, or .XLSX format, up to 10MB.
      </p>

      {/* Template Info */}
      <div className="mt-4 flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiFileText className="text-blue-500" />
          <span>
            Prepare your file based on the example template to ensure proper mapping.
          </span>
        </div>

        {/* Download Template */}
        <button
          type="button"
          className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:underline"
        >
          Download example template
        </button>
      </div>
    </div>
  );
}