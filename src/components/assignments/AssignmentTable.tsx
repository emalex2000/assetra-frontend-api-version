"use client";

import { FiChevronLeft, FiChevronRight, FiMapPin } from "react-icons/fi";
import type { AssignmentListItem } from "@/types/assignment";

type Props = {
  assignments: AssignmentListItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalCount: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
};

function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: "status" | "received";
}) {
  const normalized = label.toUpperCase();

  const className =
    variant === "received"
      ? normalized === "RECEIVED"
        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
        : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
      : normalized === "ACTIVE"
      ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
      : normalized === "TRANSFERRED"
      ? "bg-violet-50 text-violet-700 ring-1 ring-violet-200"
      : "bg-slate-100 text-slate-700 ring-1 ring-slate-200";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${className}`}
    >
      {label}
    </span>
  );
}

function TruncatedEmail({ email }: { email: string }) {
  return (
    <span
      title={email}
      className="block max-w-[180px] truncate text-sm text-gray-700"
    >
      {email}
    </span>
  );
}

export default function AssignmentTable({
  assignments,
  loading,
  error,
  currentPage,
  totalCount,
  pageSize = 10,
  onPageChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <section className="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Assignments Table
          </h2>
          <p className="text-sm text-gray-500">
            Asset name, location, status, received state, and assigned user.
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {totalCount} total assignment{totalCount === 1 ? "" : "s"}
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-gray-50 px-4 py-10 text-center text-sm text-gray-500">
          Loading assignments...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : assignments.length === 0 ? (
        <div className="rounded-2xl bg-gray-50 px-4 py-10 text-center">
          <p className="text-sm font-medium text-gray-700">No assignments found</p>
          <p className="mt-1 text-sm text-gray-500">
            Once you assign assets, they will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <th className="px-4 py-2">Asset Name</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Received</th>
                  <th className="px-4 py-2">User Email</th>
                </tr>
              </thead>

              <tbody>
                {assignments.map((item) => (
                  <tr
                    key={item.assignment_id}
                    className="rounded-2xl bg-gray-50 text-sm text-gray-700"
                  >
                    <td className="rounded-l-2xl px-4 py-4 font-medium text-gray-900">
                      {item.asset_name}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="h-4 w-4 text-gray-400" />
                        <span>{item.location}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge label={item.status} variant="status" />
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge
                        label={item.received_status}
                        variant="received"
                      />
                    </td>

                    <td className="rounded-r-2xl px-4 py-4">
                      <TruncatedEmail email={item.user_email} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 lg:hidden">
            {assignments.map((item) => (
              <div
                key={item.assignment_id}
                className="rounded-3xl border border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.asset_name}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <FiMapPin className="h-4 w-4" />
                      {item.location}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge label={item.status} variant="status" />
                  <StatusBadge
                    label={item.received_status}
                    variant="received"
                  />
                </div>

                <div className="mt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    User Email
                  </p>
                  <TruncatedEmail email={item.user_email} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiChevronLeft className="h-4 w-4" />
              Prev
            </button>

            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>

            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </section>
  );
}