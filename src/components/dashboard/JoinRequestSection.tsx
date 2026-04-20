"use client";

import { FiArrowLeft, FiClock, FiXCircle, FiCheckCircle } from "react-icons/fi";
import type { MyJoinRequest } from "../../types/organisation";

type Props = {
  requests: MyJoinRequest[];
  loading?: boolean;
  error?: string | null;
};

function statusClasses(status: MyJoinRequest["status"]) {
  switch (status) {
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "REJECTED":
      return "bg-red-50 text-red-700 border-red-200";
    case "CANCELLED":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "PENDING":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
}

function StatusIcon({ status }: { status: MyJoinRequest["status"] }) {
  if (status === "APPROVED") return <FiCheckCircle className="h-4 w-4" />;
  if (status === "REJECTED") return <FiXCircle className="h-4 w-4" />;
  return <FiClock className="h-4 w-4" />;
}

export default function MyJoinRequestsSection({
  requests,
  loading = false,
  error = null,
}: Props) {
  return (
    <section className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
            Join requests
          </p>
          <h1 className="text-2xl font-semibold text-gray-950 sm:text-3xl">
            My organisation requests
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Track every request you have sent and see whether an admin has approved it.
          </p>
        </div>

        <a
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to organisations
        </a>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-[22px] border border-gray-200 bg-gray-50"
            />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900">No join requests yet</h3>
          <p className="mt-2 text-sm text-gray-600">
            Search for an organisation from your dashboard and send your first request.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <article
              key={request.request_id}
              className="rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-950">
                    {request.company_name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {request.industry || "No industry provided"}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.16em] text-gray-400">
                    Sent on {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${statusClasses(
                    request.status
                  )}`}
                >
                  <StatusIcon status={request.status} />
                  {request.status}
                </span>
              </div>

              {request.message && (
                <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                    Message
                  </p>
                  <p className="mt-2 text-sm text-gray-700">{request.message}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}