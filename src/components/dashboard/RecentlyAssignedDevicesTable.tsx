"use client";

import { RecentlyAssignedMember } from "@/types/members";
import { useMemo, useState } from "react";
import { FiChevronDown, FiMoreVertical, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";


type Props = {
  data: RecentlyAssignedMember[];
  title?: string;
  itemsPerPage?: number;
};

function getStatusClass(status: string): string {
  const value = status.toLowerCase();

  if (value === "active") {
    return "text-gray-700";
  }

  if (value === "pending") {
    return "text-gray-500";
  }

  if (value === "inactive") {
    return "text-gray-400";
  }

  return "text-gray-700";
}

export default function RecentlyAssignedDevicesTable({
  data,
  title = "Recently Assigned Devices",
  itemsPerPage = 5,
}: Props) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return data;

    return data.filter((member) =>
      [
        member.name,
        member.email,
        member.role,
        member.devicesAssigned,
        member.location,
        member.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, itemsPerPage]);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div className="w-full rounded-[24px] bg-[#f7f7f7] px-4 py-4 sm:px-5 sm:py-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-[320px]">
          <FiSearch
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="search for all items..."
            className="h-10 w-full rounded-md border border-transparent bg-white pl-10 pr-4 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-gray-200"
          />
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 self-start text-sm font-medium text-gray-700 sm:self-auto"
        >
          Filter
          <FiChevronDown size={15} />
        </button>
      </div>

      <h2 className="mb-5 text-[22px] font-semibold text-gray-900">{title}</h2>

      <div className="hidden w-full overflow-x-auto lg:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left text-[13px] font-medium text-gray-700">
              <th className="pb-4 pr-4">Member</th>
              <th className="pb-4 pr-4">Email</th>
              <th className="pb-4 pr-4">Role</th>
              <th className="pb-4 pr-4">Device Assigned</th>
              <th className="pb-4 pr-4">Location</th>
              <th className="pb-4 pr-4">Status</th>
              <th className="pb-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-gray-200 text-[13px] text-gray-700"
                >
                  <td className="py-5 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 overflow-hidden rounded-full bg-gray-300">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-gray-300 to-gray-400" />
                        )}
                      </div>
                      <span className="whitespace-nowrap">{member.name}</span>
                    </div>
                  </td>

                  <td className="py-5 pr-4 text-gray-600">{member.email}</td>
                  <td className="py-5 pr-4">{member.role}</td>
                  <td className="py-5 pr-4">{member.devicesAssigned}</td>
                  <td className="py-5 pr-4">{member.location}</td>
                  <td className={`py-5 pr-4 ${getStatusClass(member.status)}`}>
                    {member.status}
                  </td>
                  <td className="py-5 text-right">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center text-gray-700"
                    >
                      <FiMoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm text-gray-500">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 lg:hidden">
        {paginatedData.length > 0 ? (
          paginatedData.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl border border-gray-200 bg-white p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-300">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-gray-300 to-gray-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {member.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="shrink-0 text-gray-700"
                >
                  <FiMoreVertical size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Role</p>
                  <p className="mt-1 text-gray-700">{member.role}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Devices</p>
                  <p className="mt-1 text-gray-700">{member.devicesAssigned}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="mt-1 text-gray-700">{member.location}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <p className={`mt-1 ${getStatusClass(member.status)}`}>
                    {member.status}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
            No members found.
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-700">
            {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium text-gray-700">
            {Math.min(currentPage * itemsPerPage, filteredData.length)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-700">{filteredData.length}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiChevronLeft size={16} />
          </button>

          <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700">
            {currentPage} / {totalPages}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}