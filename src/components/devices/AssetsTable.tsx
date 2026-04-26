"use client";

import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Device } from "@/types/asset";

type Props = {
  devices: Device[];
};

const ITEMS_PER_PAGE = 8;

function truncateText(value: string, maxLength: number): string {
  if (!value) return "—";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
}

function getStatusStyles(status: string): string {
  const normalized = status?.toLowerCase();

  if (normalized === "available") {
    return "bg-green-50 text-green-700 ring-1 ring-green-200";
  }

  if (normalized === "assigned") {
    return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
  }

  if (normalized === "maintenance") {
    return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
  }

  if (normalized === "retired") {
    return "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
  }

  return "bg-gray-100 text-gray-700 ring-1 ring-gray-200";
}

function getConditionStyles(condition: string): string {
  const normalized = condition?.toLowerCase();

  if (normalized === "new") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  }

  if (normalized === "good") {
    return "bg-sky-50 text-sky-700 ring-1 ring-sky-200";
  }

  if (normalized === "repaired") {
    return "bg-violet-50 text-violet-700 ring-1 ring-violet-200";
  }

  if (normalized === "damaged") {
    return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
  }

  return "bg-gray-100 text-gray-700 ring-1 ring-gray-200";
}

function InfoPill({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {label || "—"}
    </span>
  );
}

export default function DevicesTable({ devices }: Props) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(devices.length / ITEMS_PER_PAGE));

  const currentDevices = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return devices.slice(start, start + ITEMS_PER_PAGE);
  }, [devices, page]);

  const startItem = devices.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, devices.length);

  const goToPreviousPage = () => {
    setPage((current) => Math.max(1, current - 1));
  };

  const goToNextPage = () => {
    setPage((current) => Math.min(totalPages, current + 1));
  };

  return (
    <div className="flex min-h-[360px] max-h-[640px] min-w-0 flex-col overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
            Device Inventory
          </h2>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            View and manage all registered devices in your organisation
          </p>
        </div>

        <div className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 sm:text-sm">
          {devices.length} {devices.length === 1 ? "device" : "devices"}
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="max-w-full overflow-x-auto px-4 py-4 sm:px-5">
          <table className="min-w-[920px] table-fixed border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="w-[220px] px-3 py-1">Asset Name</th>
                <th className="w-[160px] px-3 py-1">Asset Tag</th>
                <th className="w-[170px] px-3 py-1">Category</th>
                <th className="w-[190px] px-3 py-1">Assigned To</th>
                <th className="w-[120px] px-3 py-1">Status</th>
                <th className="w-[120px] px-3 py-1">Condition</th>
              </tr>
            </thead>

            <tbody>
              {currentDevices.map((device) => (
                <tr
                  key={device.id}
                  className="bg-gray-50 text-sm text-gray-700 transition hover:bg-gray-100/80"
                >
                  <td className="rounded-l-2xl px-3 py-3 align-middle">
                    <div className="max-w-[200px]">
                      <p
                        className="truncate font-semibold text-gray-900"
                        title={device.asset_name || "—"}
                      >
                        {truncateText(device.asset_name || "—", 28)}
                      </p>
                      <p className="mt-1 truncate text-xs text-gray-500">
                        ID: {truncateText(device.id || "—", 14)}
                      </p>
                    </div>
                  </td>

                  <td className="px-3 py-3 align-middle">
                    <span
                      className="block max-w-[140px] truncate text-sm text-gray-700"
                      title={device.asset_tag || "—"}
                    >
                      {device.asset_tag || "—"}
                    </span>
                  </td>

                  <td className="px-3 py-3 align-middle">
                    <span
                      className="block max-w-[150px] truncate text-sm text-gray-700"
                      title={device.category_name || "—"}
                    >
                      {device.category_name || "—"}
                    </span>
                  </td>

                  <td className="px-3 py-3 align-middle">
                    <span
                      className="block max-w-[170px] truncate text-sm text-gray-700"
                      title={device.assigned_to || "—"}
                    >
                      {device.assigned_to || "—"}
                    </span>
                  </td>

                  <td className="px-3 py-3 align-middle">
                    <InfoPill
                      label={device.status || "—"}
                      className={getStatusStyles(device.status)}
                    />
                  </td>

                  <td className="rounded-r-2xl px-3 py-3 align-middle">
                    <InfoPill
                      label={device.condition || "—"}
                      className={getConditionStyles(device.condition)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 p-4 sm:p-6 lg:hidden">
        {currentDevices.map((device) => (
          <div
            key={device.id}
            className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3
                  className="truncate text-sm font-semibold text-gray-900"
                  title={device.asset_name || "—"}
                >
                  {truncateText(device.asset_name || "—", 24)}
                </h3>
                <p
                  className="mt-1 truncate text-xs text-gray-500"
                  title={device.asset_tag || "—"}
                >
                  Tag: {truncateText(device.asset_tag || "—", 18)}
                </p>
              </div>

              <InfoPill
                label={device.status || "—"}
                className={getStatusStyles(device.status)}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Category
                </p>
                <p className="mt-1 truncate text-gray-700">
                  {device.category_name || "—"}
                </p>
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Condition
                </p>
                <div className="mt-1">
                  <InfoPill
                    label={device.condition || "—"}
                    className={getConditionStyles(device.condition)}
                  />
                </div>
              </div>

              <div className="col-span-2 min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Assigned To
                </p>
                <p className="mt-1 truncate text-gray-700">
                  {device.assigned_to || "—"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {devices.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-gray-500">
            Showing {startItem}-{endItem} of {devices.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={page === 1}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiChevronLeft size={16} />
              Prev
            </button>

            <span className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700">
              {page} / {totalPages}
            </span>

            <button
              onClick={goToNextPage}
              disabled={page === totalPages}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}