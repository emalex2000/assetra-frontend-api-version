"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiChevronRight, FiLock, FiSearch, FiUsers } from "react-icons/fi";
import { apiFetch } from "../../../lib/apiClient";
import { OrganisationSearchResult } from "@/types/search";


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function getInitials(name: string): string {
  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function buildLogoUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}${path}`;
}

export default function OrganisationSearchSection() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OrganisationSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const trimmedQuery = useMemo(() => query.trim(), [query]);
  useEffect(() => {
  const timeoutId = setTimeout(() => {
    void fetchOrganisations(trimmedQuery);
  }, 350);

  return () => clearTimeout(timeoutId);
}, [trimmedQuery]);

  const fetchOrganisations = async (searchValue: string) => {
  if (!searchValue.trim()) {
    setResults([]);
    setSearchDone(false);
    setError(null);
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const response = await apiFetch(
      `/api/accounts/organisations_search/?q=${encodeURIComponent(searchValue)}`
    );

    if (!response.ok) {
      throw new Error("Failed to search organisations");
    }

    const data: OrganisationSearchResult[] = await response.json();
    setResults(Array.isArray(data) ? data : []);
    setSearchDone(true);
  } catch (err) {
    console.error("Organisation search failed:", err);
    setError("Could not search organisations right now.");
    setSearchDone(true);
  } finally {
    setLoading(false);
  }
};

  const handleJoin = async (companyId: string) => {
    try {
      setJoiningId(companyId);
      setError(null);

      const response = await apiFetch(
        `/api/accounts/organisation/${companyId}/join`,
        {
          method: "POST",
          body: JSON.stringify({}),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Could not send join request"
        );
      }

      setResults((prev) =>
        prev.map((item) =>
          item.company_id === companyId
            ? { ...item, has_pending_request: true }
            : item
        )
      );
    } catch (err) {
      console.error("Join request failed:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Could not send join request.");
      }
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="flex flex-row gap-3">
      <div className="rounded-3xl border border-gray-100 w-full bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-[24px] font-semibold text-gray-900">
            Find organisations
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Search listed organisations and request access where permitted.
          </p>
        </div>

        <div className="mb-5">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search organisations..."
              className="h-13 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-12 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />

            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {loading ? "Searching..." : ""}
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        {!searchDone ? (
          <div className="rounded-2xl border border-dashed border-gray-200 px-5 py-10 text-center">
            <p className="text-sm text-gray-500">
              Search for an organisation to see matching results here.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 px-5 py-10 text-center">
            <p className="text-base font-medium text-gray-800">
              No organisations found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Try a different name or check the spelling.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((organisation) => {
              const logoUrl = buildLogoUrl(organisation.company_logo);

              const actionLabel = organisation.is_member
                ? "Already a member"
                : organisation.has_pending_request
                ? "Request pending"
                : organisation.allow_join_request
                ? "Join"
                : "Join unavailable";

              const actionDisabled =
                organisation.is_member ||
                organisation.has_pending_request ||
                !organisation.allow_join_request ||
                joiningId === organisation.company_id;

              const content = (
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 px-4 py-4 transition hover:bg-gray-50">
                  <div className="flex min-w-0 items-center gap-3">
                    {logoUrl ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gray-100">
                        <img
                          src={logoUrl}
                          alt={organisation.name}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-sm font-semibold text-white">
                        {getInitials(organisation.name)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-[16px] font-semibold text-gray-900">
                        {organisation.name}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        {organisation.industry ? <span>{organisation.industry}</span> : null}
                        {organisation.industry ? <span>•</span> : null}
                        <span>{organisation.country}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      disabled={actionDisabled}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!actionDisabled) {
                          void handleJoin(organisation.company_id);
                        }
                      }}
                      className={`rounded-xl px-4 py-2 text-sm cursor-pointer font-semibold transition ${
                        organisation.is_member
                          ? "cursor-not-allowed bg-green-100 text-green-700"
                          : organisation.has_pending_request
                          ? "cursor-not-allowed bg-yellow-100 text-yellow-700"
                          : organisation.allow_join_request
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "cursor-not-allowed bg-gray-100 text-gray-500"
                      }`}
                    >
                      {joiningId === organisation.company_id
                        ? "Sending..."
                        : actionLabel}
                    </button>

                    {organisation.is_member ? (
                      <FiChevronRight className="text-lg text-gray-400" />
                    ) : (
                      <FiLock className="text-base text-gray-350 text-gray-400" />
                    )}
                  </div>
                </div>
              );

              if (organisation.is_member) {
                return (
                  <Link
                    key={organisation.company_id}
                    href={`/dashboard/${organisation.company_id}`}
                    className="block"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <div key={organisation.company_id}>
                  {content}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-3xl w-[500px] border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-[20px] font-semibold text-gray-900">
            Pending requests
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            A quick glance at organisations you have already reached out to.
          </p>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-2">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-13 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <FiUsers className="text-[18px]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Request tracking area
                </p>
                <p className="mt-1 text-[10px]  text-gray-500">
                  You can place your pending organisation request summary here
                  later when the endpoint is ready.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-sm text-gray-500">
            Nothing wired yet. A rare moment of peace in a software project.
          </div>
        </div>
      </div>
    </div>
  );
}