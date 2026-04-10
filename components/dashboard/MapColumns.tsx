"use client";

import { FiArrowRight, FiArrowLeft, FiCheckCircle, FiFileText } from "react-icons/fi";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { MdOutlineWarningAmber } from "react-icons/md";

const columnMappings = [
  {
    fileColumn: "Device Name",
    mappedField: "Asset Name",
    active: true,
  },
  {
    fileColumn: "Serial",
    mappedField: "Serial Number",
    active: true,
  },
  {
    fileColumn: "Location",
    mappedField: "Location",
    active: true,
  },
  {
    fileColumn: "Date Purchased",
    mappedField: "Purchase Date",
    active: true,
  },
  {
    fileColumn: "Color",
    mappedField: "Select field...",
    active: false,
  },
];

const dropdownOptions = [
  "Skip this column",
  "Asset Name",
  "Serial Number",
  "Location",
  "Date Purchased",
  "Assigned To",
];

export default function MapColumns() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.8fr_0.8fr]">
        {/* Left Section */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Map Columns</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
                Your file has columns that match the asset fields below.
                <br className="hidden sm:block" />
                Please map any unmapped fields to proceed. Only mapped fields will
                be imported.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50 sm:w-auto"
            >
              Download Sample CSV
            </button>
          </div>

          {/* File Card */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
            <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3">
              <FiFileText className="text-gray-400" size={18} />
              <span className="text-sm font-medium text-gray-700">assets.xlsx</span>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
              <div className="grid grid-cols-[1fr_40px_1.2fr] border-b border-gray-200 bg-gray-50">
                <div className="px-5 py-3 text-sm font-semibold text-gray-700">
                  File Columns
                </div>
                <div />
                <div className="border-l border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700">
                  Map to Asset Fields
                </div>
              </div>

              {columnMappings.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_40px_1.2fr] items-center border-b border-gray-100 last:border-b-0"
                >
                  <div className="px-5 py-4 text-sm font-medium text-gray-800">
                    {item.fileColumn}
                  </div>

                  <div className="flex justify-center text-gray-300">
                    <FiArrowRight size={18} />
                  </div>

                  <div className="border-l border-gray-100 px-4 py-3">
                    <div
                      className={`flex h-11 items-center justify-between rounded-lg border px-4 text-sm ${
                        item.active
                          ? "border-blue-100 bg-blue-50 text-gray-800"
                          : "border-gray-200 bg-white text-gray-400"
                      }`}
                    >
                      <span>{item.mappedField}</span>
                      <span className="text-xs">▼</span>
                    </div>

                    {/* Mock open dropdown for last row */}
                    {item.fileColumn === "Color" && (
                      <div className="mt-2 w-full rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                        {dropdownOptions.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                              option === "Asset Name"
                                ? "bg-blue-50 text-gray-900"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {option === "Skip this column" ? (
                              <span className="font-medium">{option}</span>
                            ) : (
                              <>
                                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                                <span>{option}</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              {columnMappings.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 p-4 last:border-b-0"
                >
                  <div className="mb-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      File Column
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {item.fileColumn}
                    </p>
                  </div>

                  <div className="mb-3 flex items-center gap-2 text-gray-300">
                    <FiArrowRight size={16} />
                    <span className="text-xs uppercase tracking-wide">Maps to</span>
                  </div>

                  <div
                    className={`flex h-11 items-center justify-between rounded-lg border px-4 text-sm ${
                      item.active
                        ? "border-blue-100 bg-blue-50 text-gray-800"
                        : "border-gray-200 bg-white text-gray-400"
                    }`}
                  >
                    <span>{item.mappedField}</span>
                    <span className="text-xs">▼</span>
                  </div>

                  {item.fileColumn === "Color" && (
                    <div className="mt-3 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
                      {dropdownOptions.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                            option === "Asset Name"
                              ? "bg-blue-50 text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {option === "Skip this column" ? (
                            <span className="font-medium">{option}</span>
                          ) : (
                            <>
                              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                              <span>{option}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Unmapped Fields */}
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h4 className="text-lg font-semibold text-gray-900">Unmapped Fields</h4>
            <p className="mt-3 max-w-md text-sm leading-7 text-gray-500">
              Fields that are not mapped will be skipped during the import
              process.
            </p>
          </div>

          
        </div>

        {/* Right Section */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm sm:p-6">
          <h3 className="text-xl font-semibold text-gray-900">Import Summary</h3>

          <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <HiOutlineCloudUpload size={28} />
              </div>
              <h4 className="mt-4 text-xl font-semibold text-gray-900">
                File Uploaded
              </h4>
              <p className="mt-1 text-sm text-gray-500">assets.xlsx</p>
            </div>

            <div className="my-5 border-t border-gray-100" />

            <div>
              <h5 className="text-lg font-semibold text-gray-800">
                5 Columns Detected
              </h5>

              <div className="mt-4 space-y-3">
                {["Device Name", "Serial", "Location", "Date Purchased", "Color"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-gray-600"
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                      <span>{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="my-5 border-t border-gray-100" />

            <div>
              <h5 className="text-lg font-semibold text-gray-800">
                Mapping Overview
              </h5>

              <div className="mt-4 space-y-3">
                {["Asset Name", "Serial Number", "Location", "Date Purchased"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-gray-600"
                    >
                      <FiCheckCircle className="text-blue-500" size={16} />
                      <span>{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="my-5 border-t border-gray-100" />

            <div className="flex items-start gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
              <MdOutlineWarningAmber className="mt-0.5 shrink-0" size={18} />
              <p>
                1 column skipped
                <br />
                <span className="font-medium">(Color)</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}