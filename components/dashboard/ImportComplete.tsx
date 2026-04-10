"use client";

import {
  FiCheckCircle,
  FiXCircle,
  FiDownload,
  FiArrowRight,
  FiFolder,
} from "react-icons/fi";

export default function ImportComplete() {
  return (
    <div className="w-full">
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="px-4 py-8 sm:px-6 sm:py-10">
          {/* Success Icon */}
          <div className="flex flex-col items-center text-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <FiCheckCircle className="text-green-600" size={40} />
              <span className="absolute -left-2 top-4 h-2.5 w-2.5 rounded-full bg-green-200" />
              <span className="absolute -right-2 bottom-5 h-3 w-3 rounded-full bg-green-200" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
              Import Complete!
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              The import process finished successfully.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Success Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <FiCheckCircle className="text-green-600" size={24} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    165 Assets imported
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 sm:text-base">
                    Added successfully
                  </p>
                </div>
              </div>
            </div>

            {/* Failed Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <FiXCircle className="text-red-500" size={24} />
                </div>

                <div className="w-full">
                  <h3 className="text-xl font-semibold text-gray-900">
                    3 Rows failed to import
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 sm:text-base">
                    Download{" "}
                    <span className="font-medium text-blue-600">error report</span>{" "}
                    for details
                  </p>

                  <button
                    type="button"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:underline"
                  >
                    <FiDownload size={16} />
                    Download error report
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-10 flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 sm:text-base">
              You can view the{" "}
              <span className="font-medium text-blue-600">imported assets</span> in
              your <span className="font-medium text-blue-600">asset management dashboard</span>.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <FiFolder size={16} />
                Import another file
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Finish
                <FiArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}