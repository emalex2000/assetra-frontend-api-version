"use client";

import { PendingJoinRequest, ReviewJoinRequestAction } from "@/types/organisation";
import { useMemo, useState } from "react";
import {
  FiCheck,
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

type JoinRequestsTableProps = {
  data: PendingJoinRequest[];
  loading?: boolean;
  title?: string;
  itemsPerPage?: number;
  onReview: (
    requestId: string,
    action: ReviewJoinRequestAction
  ) => Promise<void> | void;
  actionLoadingId?: string | null;
};

function truncateText(value: string, maxLength: number): string {
  if (!value) return "-";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
}

function formatDate(value: string): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function JoinRequestsTable({
  data,
  loading = false,
  title = "Join Requests",
  itemsPerPage = 5,
  onReview,
  actionLoadingId = null,
}: JoinRequestsTableProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return data;

    return data.filter((request) =>
      [request.email, request.phone_number ?? "", request.status]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const pendingCount = data.filter((item) => item.status === "PENDING").length;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="w-full rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-gray-100 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
              {title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Review and manage pending organisation join requests.
            </p>
          </div>

          <div className="inline-flex w-fit items-center rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700">
            {pendingCount} pending
          </div>
        </div>

        <div className="relative w-full md:max-w-sm">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search join requests..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-gray-300 focus:bg-white"
          />
        </div>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Phone</th>
              <th className="px-6 py-4 font-medium">Requested</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-sm text-gray-500">
                  Loading join requests...
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((request) => {
                const isBusy = actionLoadingId === request.request_id;

                return (
                  <tr
                    key={request.request_id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      <span title={request.email}>
                        {truncateText(request.email, 26)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span title={request.phone_number ?? ""}>
                        {truncateText(request.phone_number ?? "-", 18)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(request.created_at)}
                    </td>

                    <td className="px-6 py-4 text-sm text-amber-600">
                      {request.status}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() =>
                            onReview(request.request_id, "APPROVED")
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-green-200 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <FiCheck />
                          Accept
                        </button>

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() =>
                            onReview(request.request_id, "REJECTED")
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <FiX />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-sm text-gray-500">
                  No join requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 p-4 lg:hidden sm:p-6">
        {loading ? (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-500">
            Loading join requests...
          </div>
        ) : paginatedData.length > 0 ? (
          paginatedData.map((request) => {
            const isBusy = actionLoadingId === request.request_id;

            return (
              <div
                key={request.request_id}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
              >
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Email
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-800">
                      <span title={request.email}>
                        {truncateText(request.email, 28)}
                      </span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Phone
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        <span title={request.phone_number ?? ""}>
                          {truncateText(request.phone_number ?? "-", 16)}
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Requested
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {formatDate(request.created_at)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Status
                    </p>
                    <p className="mt-1 text-sm text-amber-600">
                      {request.status}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onReview(request.request_id, "APPROVED")}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-white px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiCheck />
                      Accept
                    </button>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onReview(request.request_id, "REJECTED")}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiX />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-500">
            No join requests found.
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-gray-500">
          Showing{" "}
          {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiChevronLeft />
          </button>

          <span className="text-sm text-gray-600">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}