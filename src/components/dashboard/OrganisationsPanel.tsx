"use client";

import Link from "next/link";
import Image from "next/image";
import { FiChevronRight } from "react-icons/fi";
import { useMyOrganisations } from "@/hooks/usMyOrganisations";

function getInitials(name: string): string {
  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function formatMeta(industry: string | null, country: string): string {
  if (industry && industry.trim()) {
    return `${industry} • ${country}`;
  }

  return country;
}

function resolveImageUrl(url: string | null): string | null {
  if (!url) return null;

  // if backend already returns absolute url
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // replace with your env variable if needed
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${baseUrl}${url}`;
}

export default function OrganisationList() {
  const { organisations, loading, error } = useMyOrganisations();

  return (
    <div className="rounded-3xl w-full border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[22px] font-semibold text-gray-900">
          Your Organisations
        </h2>

        <Link
          href="/dashboard/organisations"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all
        </Link>
      </div>

      <div className="border-t border-gray-100" />

      {loading ? (
        <div className="py-6">
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-gray-100 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 rounded bg-gray-200" />
                      <div className="h-3 w-28 rounded bg-gray-100" />
                    </div>
                  </div>

                  <div className="h-6 w-16 rounded-full bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="py-8 text-sm text-red-500">{error}</div>
      ) : organisations.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-base font-medium text-gray-800">
            No organisations yet
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Create one to start managing assets and members.
          </p>
        </div>
      ) : (
        <div className="mt-3 max-h-[320px] space-y-3 overflow-y-auto pr-1">
          {organisations.map((organisation) => {
            const logoUrl = resolveImageUrl(organisation.company_logo);

            return (
              <Link
                key={organisation.company_id}
                href={`/dashboard/${organisation.company_id}`}
                className="flex items-center justify-between rounded-2xl border border-gray-100 px-4 py-4 transition hover:bg-gray-50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {logoUrl ? (
                    <div className="relative h-12 w-12 flex flex-row items-center overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={logoUrl}
                        alt={organisation.name}
                        fill
                        className="object-cover "
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
                      <span>{formatMeta(organisation.industry, organisation.country)}</span>
                      <span>•</span>
                      <span>{organisation.assetsCount} Assets</span>
                      <span>•</span>
                      <span>{organisation.membersCount} Members</span>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-3">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Active
                  </span>

                  <FiChevronRight className="text-lg text-gray-400" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}