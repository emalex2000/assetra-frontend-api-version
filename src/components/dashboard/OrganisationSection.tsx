"use client";

import Link from "next/link";
import { useMemo, useState, ChangeEvent, JSX } from "react";
import OrganisationCard from "./OrganisationCard";

type SortOption =
  | "recently_created"
  | "oldest"
  | "most_assets"
  | "most_members";

type Organisation = {
  company_id: string;
  name: string;
  industry: string;
  company_size?: number | string;
  assetsCount?: number;
  membersCount?: number;
  location?: string;
  created_at?: string;
  company_logo?: string | null;
};

type OrganisationsSectionProps = {
  organisations?: Organisation[];
  loading?: boolean;
  error?: string | null;
};

export default function OrganisationsSection({
  organisations = [],
  loading = false,
  error = null,
}: OrganisationsSectionProps): JSX.Element {
  const [sortBy, setSortBy] = useState<SortOption>("recently_created");

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortOption);
  };

  const sortedOrganisations = useMemo(() => {
    const copied = [...organisations];

    switch (sortBy) {
      case "oldest":
        return copied.sort((a, b) => {
          const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
          return aTime - bTime;
        });

      case "most_assets":
        return copied.sort(
          (a, b) => (b.assetsCount ?? 0) - (a.assetsCount ?? 0)
        );

      case "most_members":
        return copied.sort(
          (a, b) => (b.membersCount ?? 0) - (a.membersCount ?? 0)
        );

      case "recently_created":
      default:
        return copied.sort((a, b) => {
          const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
          return bTime - aTime;
        });
    }
  }, [organisations, sortBy]);

  const formatDate = (date?: string): string => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getLogoFallback = (name?: string): string => {
    return name?.trim()?.charAt(0)?.toUpperCase() || "O";
  };

  return (
    <section className="mt-7 w-full">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-[28px] font-semibold text-gray-900">
          Your Organisations
        </h1>

        <div className="flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-3 md:self-auto">
          <label
            htmlFor="sortBy"
            className="text-sm font-medium text-gray-700"
          >
            Sort By:
          </label>

          <select
            id="sortBy"
            value={sortBy}
            onChange={handleSortChange}
            className="bg-transparent text-sm text-gray-900 outline-none"
          >
            <option value="recently_created">Recently Created</option>
            <option value="oldest">Oldest</option>
            <option value="most_assets">Most Assets</option>
            <option value="most_members">Most Members</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-gray-500">
          Loading organisations...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : sortedOrganisations.length === 0 ? (
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              No organisation yet
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create your first organisation to start managing assets and members.
            </p>
          </div>

          <Link
            href="/dashboard/create-organisation"
            className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-900"
          >
            Create organisation
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sortedOrganisations.map((organisation) => (
            <OrganisationCard
              company_id={organisation.company_id}
              key={organisation.company_id}
              logo={getLogoFallback(organisation.name)}
              name={organisation.name}
              industry={organisation.industry}
              employees={
                organisation.company_size
                  ? `${organisation.company_size} Employees`
                  : "—"
              }
              assetsCount={organisation.assetsCount ?? 0}
              membersCount={organisation.membersCount ?? 0}
              location={organisation.location ?? "—"}
              createdAt={formatDate(organisation.created_at)}
            />
          ))}
        </div>
      )}
    </section>
  );
}