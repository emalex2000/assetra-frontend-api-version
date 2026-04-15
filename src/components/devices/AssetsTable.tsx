import { Device } from "@/types/asset";

type Props = {
  devices: Device[];
};

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
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${className}`}
    >
      {label || "—"}
    </span>
  );
}

export default function DevicesTable({ devices }: Props) {
  return (
    <div className="rounded-[28px] border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
            Device Inventory
          </h2>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            View and manage all registered devices in your organisation
          </p>
        </div>

        <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 sm:text-sm">
          {devices.length} {devices.length === 1 ? "device" : "devices"}
        </div>
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden overflow-x-auto lg:block">
        <div className="w-full px-4 py-4 sm:px-5">
          <table className="w-full table-fixed border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-2 py-1">Asset Name</th>
                <th className="px-2 py-1">Asset Tag</th>
                <th className="px-2 py-1">Category</th>
                <th className="px-2 py-1">Assigned To</th>
                <th className="px-2 py-1">Status</th>
                <th className="px-2 py-1">Condition</th>
              </tr>
            </thead>

            <tbody>
              {devices.length > 0 ? (
                devices.map((device) => (
                  <tr
                    key={device.id}
                    className="bg-gray-50 text-sm text-gray-700 transition hover:bg-gray-100/80"
                  >
                    <td className="rounded-l-2xl px-2 py-2 align-middle">
                      <div className="max-w-[180px]">
                        <p
                          className="truncate font-semibold text-gray-900"
                          title={device.asset_name || "—"}
                        >
                          {truncateText(device.asset_name || "—", 24)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          ID: {truncateText(device.id || "—", 10)}
                        </p>
                      </div>
                    </td>

                    <td className="px-2 py-2 align-middle">
                      <span
                        className="w-full truncate text-sm text-gray-700"
                        title={device.asset_tag || "—"}
                      >
                        {truncateText(device.asset_tag || "—", 8)}
                      </span>
                    </td>

                    <td className="px-2 py-2 align-middle">
                      <span
                        className="inline-block max-w-[140px] truncate text-sm text-gray-700"
                        title={device.category_name || "—"}
                      >
                        {truncateText(device.category_name || "—", 8)}
                      </span>
                    </td>

                    <td className="px-4 py-4 align-middle">
                      <span
                        className="inline-block max-w-[160px] truncate text-sm text-gray-700"
                        title={device.assigned_to || "—"}
                      >
                        {truncateText(device.assigned_to || "—", 8)}
                      </span>
                    </td>

                    <td className="px-2 py-2 align-middle">
                      <InfoPill
                        label={device.status || "—"}
                        className={getStatusStyles(device.status)}
                      />
                    </td>

                    <td className="rounded-r-2xl px-2 py-2 align-middle">
                      <InfoPill
                        label={device.condition || "—"}
                        className={getConditionStyles(device.condition)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center">
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-10">
                      <p className="text-sm font-medium text-gray-700">
                        No devices found
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Devices you add will appear here.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile / Small Tablet Cards */}
      <div className="space-y-3 p-4 sm:p-6 lg:hidden">
        {devices.length > 0 ? (
          devices.map((device) => (
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
                  <p
                    className="mt-1 truncate text-gray-700"
                    title={device.category_name || "—"}
                  >
                    {truncateText(device.category_name || "—", 16)}
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
                  <p
                    className="mt-1 truncate text-gray-700"
                    title={device.assigned_to || "—"}
                  >
                    {truncateText(device.assigned_to || "—", 26)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center">
            <p className="text-sm font-medium text-gray-700">No devices found</p>
            <p className="mt-1 text-sm text-gray-500">
              Devices you add will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}