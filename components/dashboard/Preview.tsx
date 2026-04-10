"use client";

import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiDownload,
  FiSearch,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const previewRows = [
  {
    id: 1,
    assetName: "Laptop A",
    serialNumber: "",
    model: "HP ProBh 450",
    category: "Laptop",
    location: "Lagos Office",
    error: "Serial number is missing",
    type: "error",
  },
  {
    id: 2,
    assetName: "Printer B",
    serialNumber: "12345",
    model: "HP LaserJet 12",
    category: "Printer",
    location: "Lagos Office",
    error: "Duplicate serial number",
    type: "warning",
  },
  {
    id: 3,
    assetName: "Desktop C",
    serialNumber: "12345",
    model: "Del Optilex 703",
    category: "Desktop",
    location: "Abuja Office",
    error: "Serial number duplicated",
    type: "neutral",
  },
  {
    id: 4,
    assetName: "Monitor D",
    serialNumber: "INVALID-SN76531",
    model: "OOO1243",
    category: "Monitor",
    location: "Abuja Office",
    error: "Invalid serial number format",
    type: "error",
  },
  {
    id: 5,
    assetName: "Tablet E",
    serialNumber: "OOO1243",
    model: "TAB5678",
    category: "Tablet",
    location: "Abuja Office",
    error: "Serial number duplicated",
    type: "neutral",
  },
  {
    id: 6,
    assetName: "Monitor F",
    serialNumber: "",
    model: "",
    category: "Monitor",
    location: "Abuja Office",
    error: "Serial number is missing",
    type: "error",
  },
] as const;

function getErrorStyle(type: string) {
  switch (type) {
    case "error":
      return {
        row: "bg-red-50/40",
        text: "text-red-600",
        icon: <FiAlertCircle size={16} className="text-red-500 shrink-0" />,
      };
    case "warning":
      return {
        row: "bg-amber-50/40",
        text: "text-amber-600",
        icon: <FiAlertTriangle size={16} className="text-amber-500 shrink-0" />,
      };
    default:
      return {
        row: "bg-gray-50",
        text: "text-gray-500",
        icon: <FiAlertCircle size={16} className="text-gray-400 shrink-0" />,
      };
  }
}

export default function PreviewAndValidate() {
  return (
    <div className="w-full">
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 py-5 sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">
                1
              </div>

              <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
                <h3 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                  Some issues detected
                </h3>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <span className="text-gray-500">35 Errors</span>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <span className="text-gray-500">12 Duplicates</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="inline-flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700"
              >
                Show All
                <FiChevronDown size={16} />
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700"
              >
                All Statuses
                <FiChevronDown size={16} />
              </button>

              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5">
                <FiSearch className="text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 sm:w-[140px]"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 lg:flex-row">
            <div className="flex flex-1 items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
              <FiAlertTriangle size={18} className="shrink-0 text-amber-500" />
              <p>Please address the issues marked below to proceed with the import.</p>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
            >
              <FiDownload size={16} />
              Download error report
            </button>
          </div>
        </div>

        <div className="px-4 py-5 sm:px-6">
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-gray-200 lg:block">
            <div className="grid grid-cols-[60px_1.2fr_1.2fr_1fr_1fr_1fr_1.5fr] bg-gray-50">
              <div className="border-r border-gray-200 px-4 py-4 text-sm font-semibold text-gray-700">
                #
              </div>
              <div className="border-r border-gray-200 px-4 py-4 text-sm font-semibold text-gray-700">
                Asset Name
              </div>
              <div className="border-r border-gray-200 px-4 py-4 text-sm font-semibold text-gray-700">
                Serial Number
              </div>
              <div className="border-r border-gray-200 px-4 py-4 text-sm font-semibold text-gray-700">
                Model
              </div>
              <div className="border-r border-gray-200 px-4 py-4 text-sm font-semibold text-gray-700">
                Category
              </div>
              <div className="border-r border-gray-200 px-4 py-4 text-sm font-semibold text-gray-700">
                Location
              </div>
              <div className="px-4 py-4 text-sm font-semibold text-gray-700">
                Error State
              </div>
            </div>

            {previewRows.map((row) => {
              const style = getErrorStyle(row.type);

              return (
                <div
                  key={row.id}
                  className={`grid grid-cols-[60px_1.2fr_1.2fr_1fr_1fr_1fr_1.5fr] border-t border-gray-200 ${style.row}`}
                >
                  <div className="border-r border-gray-200 px-4 py-4 text-sm text-gray-700">
                    {row.id}
                  </div>
                  <div className="border-r border-gray-200 px-4 py-4 text-sm text-gray-800">
                    {row.assetName}
                  </div>
                  <div
                    className={`border-r border-gray-200 px-4 py-4 text-sm ${
                      row.serialNumber ? "text-gray-700" : "text-gray-400"
                    } ${row.serialNumber === "INVALID-SN76531" ? "text-red-600" : ""}`}
                  >
                    {row.serialNumber || "—"}
                  </div>
                  <div className="border-r border-gray-200 px-4 py-4 text-sm text-gray-600">
                    {row.model || "—"}
                  </div>
                  <div className="border-r border-gray-200 px-4 py-4 text-sm text-gray-700">
                    {row.category}
                  </div>
                  <div className="border-r border-gray-200 px-4 py-4 text-sm text-gray-700">
                    {row.location}
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-4 text-sm ${style.text}`}>
                    {style.icon}
                    <span>{row.error}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 lg:hidden">
            {previewRows.map((row) => {
              const style = getErrorStyle(row.type);

              return (
                <div
                  key={row.id}
                  className={`rounded-2xl border border-gray-200 p-4 ${style.row}`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Row {row.id}
                      </p>
                      <h4 className="mt-1 text-lg font-semibold text-gray-900">
                        {row.assetName}
                      </h4>
                    </div>

                    <div className={`flex items-center gap-2 text-sm ${style.text}`}>
                      {style.icon}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Serial Number
                      </p>
                      <p
                        className={`mt-1 text-sm ${
                          row.serialNumber
                            ? "text-gray-700"
                            : "text-gray-400"
                        } ${row.serialNumber === "INVALID-SN76531" ? "text-red-600" : ""}`}
                      >
                        {row.serialNumber || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Model
                      </p>
                      <p className="mt-1 text-sm text-gray-700">{row.model || "—"}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Category
                      </p>
                      <p className="mt-1 text-sm text-gray-700">{row.category}</p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Location
                      </p>
                      <p className="mt-1 text-sm text-gray-700">{row.location}</p>
                    </div>
                  </div>

                  <div className={`mt-4 flex items-start gap-2 rounded-xl bg-white/70 px-3 py-3 text-sm ${style.text}`}>
                    {style.icon}
                    <span>{row.error}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">Showing 6 of 200 rows</p>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400"
              >
                <FiChevronLeft size={16} />
              </button>

              <button
                type="button"
                className="flex h-10 min-w-[40px] items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700"
              >
                1
              </button>

              <button
                type="button"
                className="flex h-10 min-w-[40px] items-center justify-center rounded-lg bg-blue-50 px-3 text-sm font-medium text-blue-600"
              >
                2
              </button>

              <button
                type="button"
                className="flex h-10 min-w-[40px] items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700"
              >
                3
              </button>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}