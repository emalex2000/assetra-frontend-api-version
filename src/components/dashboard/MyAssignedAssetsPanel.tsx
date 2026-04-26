"use client";

import { useMemo, useState } from "react";
import { FiCheckCircle, FiClock, FiMapPin, FiPackage } from "react-icons/fi";
import Button from "../landing_page/Button";
import type { UserDashboardAssignment } from "@/types/assignment";

type Props = {
  assignments: UserDashboardAssignment[];
  loading: boolean;
  error: string | null;
  actionLoadingId: string | null;
  onMarkReceived: (assignmentId: string) => Promise<void>;
};

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "blue" | "green" | "amber" | "gray";
}) {
  const classes =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700 border border-amber-200"
      : tone === "blue"
      ? "bg-blue-50 text-blue-700 border border-blue-200"
      : "bg-gray-100 text-gray-700 border border-gray-200";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${classes}`}
    >
      {label}
    </span>
  );
}

function formatDate(value: string | null) {
  if (!value) return "No date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString();
}

export default function MyAssignedAssetsPanel({
  assignments,
  loading,
  error,
  actionLoadingId,
  onMarkReceived,
}: Props) {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.max(1, Math.ceil(assignments.length / pageSize));

  const paginatedAssignments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return assignments.slice(start, start + pageSize);
  }, [assignments, page]);

  const pendingCount = assignments.filter(
    (item) => item.received_status === "PENDING"
  ).length;

  return (
    <section className="mt-6 rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            My Assigned Assets
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Assets assigned to you across your organisations.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-sm text-amber-700">
          <FiClock className="h-4 w-4" />
          <span>{pendingCount} pending confirmation</span>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-gray-50 px-4 py-10 text-center text-sm text-gray-500">
          Loading your assigned assets...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : assignments.length === 0 ? (
        <div className="rounded-2xl bg-gray-50 px-4 py-10 text-center">
          <p className="text-sm font-medium text-gray-800">
            No assets assigned to you yet
          </p>
          <p className="mt-1 text-sm text-gray-500">
            When someone assigns an asset to you, it will show up here.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedAssignments.map((item) => {
              const isPending = item.received_status === "PENDING";
              const isSubmitting = actionLoadingId === item.assignment_id;

              return (
                <div
                  key={item.assignment_id}
                  className="rounded-3xl border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <FiPackage className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-base font-semibold text-gray-900">
                            {item.asset_name}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.organisationName}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <StatusBadge label={item.status} tone="blue" />
                            <StatusBadge
                              label={item.received_status}
                              tone={isPending ? "amber" : "green"}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-2xl bg-white p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Location
                          </p>
                          <p className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                            <FiMapPin className="h-4 w-4 text-gray-400" />
                            {item.location}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Date Assigned
                          </p>
                          <p className="mt-2 text-sm text-gray-700">
                            {formatDate(item.date_assigned)}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                            Action
                          </p>
                          <p className="mt-2 text-sm text-gray-700">
                            {isPending
                              ? "Confirm once the asset is with you."
                              : "Asset has already been confirmed as received."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="lg:ml-4 lg:w-auto">
                      {isPending ? (
                        <Button
                          text={isSubmitting ? "Updating..." : "Mark Received"}
                          variant="blue"
                          onClick={() => onMarkReceived(item.assignment_id)}
                          className="w-full lg:w-auto"
                        />
                      ) : (
                        <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                          <FiCheckCircle className="h-4 w-4" />
                          Received
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {assignments.length > pageSize && (
            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>

              <p className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </p>

              <button
                type="button"
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={page === totalPages}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}