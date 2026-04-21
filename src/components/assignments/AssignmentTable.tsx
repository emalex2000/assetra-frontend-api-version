"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  FiCalendar,
  FiChevronDown,
  FiMoreVertical,
  FiRepeat,
  FiSearch,
  FiSend,
  FiEye,
  FiCheckCircle,
} from "react-icons/fi";
import type { AssignmentRow, AssignmentStatus, ReceiveStatus } from "@/types/assignment";

type Props = {
  assignments?: AssignmentRow[];
  title?: string;
};

type StatusFilter = "ALL" | AssignmentStatus;
type LocationFilter = "ALL" | string;

const demoAssignments: AssignmentRow[] = [
  {
    id: "1",
    assetName: 'MacBook Pro 14"',
    assetType: "Laptop",
    assetCode: "AST-2024-0001",
    serialNumber: "C02XQ1P2L414",
    locationName: "Lagos, NG",
    locationCode: "LAG-01",
    countryName: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    assignmentStatus: "ACTIVE",
    receiveStatus: "RECEIVED",
    assignedDate: "May 20, 2025",
  },
  {
    id: "2",
    assetName: 'Dell Monitor 24"',
    assetType: "Monitor",
    assetCode: "AST-2024-0002",
    serialNumber: "DELL24IPS7890",
    locationName: "New York, US",
    locationCode: "NYC-03",
    countryName: "United States",
    countryCode: "US",
    countryFlag: "🇺🇸",
    assignmentStatus: "ACTIVE",
    receiveStatus: "PENDING",
    assignedDate: "May 18, 2025",
  },
  {
    id: "3",
    assetName: "iPhone 15 Pro",
    assetType: "Mobile Phone",
    assetCode: "AST-2024-0003",
    serialNumber: "F2LX93K4Q2",
    locationName: "Abuja, NG",
    locationCode: "ABJ-02",
    countryName: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    assignmentStatus: "ACTIVE",
    receiveStatus: "RECEIVED",
    assignedDate: "May 15, 2025",
  },
  {
    id: "4",
    assetName: "HP LaserJet Pro M404",
    assetType: "Printer",
    assetCode: "AST-2024-0004",
    serialNumber: "CNB3M2K1Y0",
    locationName: "Lagos, NG",
    locationCode: "LAG-04",
    countryName: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    assignmentStatus: "ACTIVE",
    receiveStatus: "RECEIVED",
    assignedDate: "May 10, 2025",
  },
  {
    id: "5",
    assetName: "Sony WH-1000XM5",
    assetType: "Headphones",
    assetCode: "AST-2024-0005",
    serialNumber: "1000XM5BB736",
    locationName: "London, UK",
    locationCode: "LON-08",
    countryName: "United Kingdom",
    countryCode: "UK",
    countryFlag: "🇬🇧",
    assignmentStatus: "ACTIVE",
    receiveStatus: "PENDING",
    assignedDate: "May 21, 2025",
  },
  {
    id: "6",
    assetName: "iPad Air (5th Gen)",
    assetType: "Tablet",
    assetCode: "AST-2024-0006",
    serialNumber: "IPAD569H2L1",
    locationName: "Port Harcourt, NG",
    locationCode: "PHC-02",
    countryName: "Nigeria",
    countryCode: "NG",
    countryFlag: "🇳🇬",
    assignmentStatus: "RETURNED",
    receiveStatus: "RECEIVED",
    assignedDate: "Apr 30, 2025",
  },
];

function truncateText(value: string, maxLength: number) {
  if (!value) return "—";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
}

function getAssignmentStatusClasses(status: AssignmentStatus) {
  if (status === "ACTIVE") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  }

  return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
}

function getReceiveStatusClasses(status: ReceiveStatus) {
  if (status === "RECEIVED") {
    return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  }

  return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
}

function StatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap ${className}`}
    >
      {label}
    </span>
  );
}

function ActionMenu({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
      >
        <FiMoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-52 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50">
            <FiRepeat className="h-4 w-4 text-indigo-600" />
            Transfer Asset
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50">
            <FiCheckCircle className="h-4 w-4 text-emerald-600" />
            Mark as Received
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50">
            <FiEye className="h-4 w-4 text-sky-600" />
            View Details
          </button>

          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50">
            <FiSend className="h-4 w-4 text-violet-600" />
            Re-send Notice
          </button>
        </div>
      )}
    </div>
  );
}

export default function AssignmentsTableSection({
  assignments = demoAssignments,
  title = "Assignments",
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [locationFilter, setLocationFilter] = useState<LocationFilter>("ALL");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const locations = useMemo(() => {
    const uniqueLocations = Array.from(
      new Set(assignments.map((item) => item.locationName))
    );
    return uniqueLocations;
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const search = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !search ||
        item.assetName.toLowerCase().includes(search) ||
        item.assetCode.toLowerCase().includes(search) ||
        item.serialNumber?.toLowerCase().includes(search) ||
        item.locationCode?.toLowerCase().includes(search) ||
        item.locationName.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "ALL" || item.assignmentStatus === statusFilter;

      const matchesLocation =
        locationFilter === "ALL" || item.locationName === locationFilter;

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [assignments, searchQuery, statusFilter, locationFilter]);

  return (
    <section className="space-y-5">
      <div className="rounded-[28px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px_150px]">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by asset name, serial number, asset code or location ID..."
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="RETURNED">Returned</option>
            </select>
            <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value as LocationFilter)}
              className="h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option value="ALL">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <button
            type="button"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <FiCalendar className="h-4 w-4" />
            Date Range
          </button>
        </div>
      </div>

      <div className="rounded-[28px] border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {title} ({filteredAssignments.length})
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Track asset location, assignment status and receive confirmation.
            </p>
          </div>
        </div>

        <div className="hidden overflow-x-auto xl:block">
          <div ref={menuRef} className="min-w-[1100px] px-4 py-4 sm:px-6">
            <table className="w-full table-fixed border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-3 py-2">Asset Name</th>
                  <th className="px-3 py-2">Location ID</th>
                  <th className="px-3 py-2">Country</th>
                  <th className="px-3 py-2">Location</th>
                  <th className="px-3 py-2">Assign Date</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Receive Status</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((item) => (
                    <tr
                      key={item.id}
                      className="bg-white text-sm text-gray-700 shadow-[0_0_0_1px_rgba(229,231,235,1)] transition hover:bg-gray-50"
                    >
                      <td className="rounded-l-2xl px-3 py-4 align-middle">
                        <div className="min-w-0">
                          <p
                            className="truncate font-semibold text-gray-900"
                            title={item.assetName}
                          >
                            {truncateText(item.assetName, 26)}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {truncateText(item.assetType || item.assetCode, 22)}
                          </p>
                        </div>
                      </td>

                      <td className="px-3 py-4 align-middle">
                        <div className="min-w-0">
                          <p
                            className="truncate font-medium text-gray-800"
                            title={item.locationCode || item.assetCode}
                          >
                            {truncateText(item.locationCode || item.assetCode, 16)}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {truncateText(item.serialNumber || item.assetCode, 16)}
                          </p>
                        </div>
                      </td>

                      <td className="px-3 py-4 align-middle">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{item.countryFlag}</span>
                          <span
                            className="max-w-[90px] truncate text-sm text-gray-700"
                            title={item.countryName}
                          >
                            {truncateText(item.countryName, 12)}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-4 align-middle">
                        <span
                          className="inline-block max-w-[150px] truncate text-sm text-gray-700"
                          title={item.locationName}
                        >
                          {truncateText(item.locationName, 18)}
                        </span>
                      </td>

                      <td className="px-3 py-4 align-middle text-sm text-gray-700">
                        {item.assignedDate || "—"}
                      </td>

                      <td className="px-3 py-4 align-middle">
                        <StatusBadge
                          label={item.assignmentStatus}
                          className={getAssignmentStatusClasses(item.assignmentStatus)}
                        />
                      </td>

                      <td className="px-3 py-4 align-middle">
                        <StatusBadge
                          label={item.receiveStatus}
                          className={getReceiveStatusClasses(item.receiveStatus)}
                        />
                      </td>

                      <td className="rounded-r-2xl px-3 py-4 align-middle text-right">
                        <ActionMenu
                          isOpen={openMenuId === item.id}
                          onToggle={() =>
                            setOpenMenuId((prev) => (prev === item.id ? null : item.id))
                          }
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-10">
                        <p className="text-sm font-medium text-gray-700">
                          No assignments found
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Try a different search or filter combination.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div ref={menuRef} className="space-y-3 p-4 sm:p-6 xl:hidden">
          {filteredAssignments.length > 0 ? (
            filteredAssignments.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3
                      className="truncate text-sm font-semibold text-gray-900"
                      title={item.assetName}
                    >
                      {truncateText(item.assetName, 26)}
                    </h3>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {truncateText(item.assetCode, 18)}
                    </p>
                  </div>

                  <ActionMenu
                    isOpen={openMenuId === item.id}
                    onToggle={() =>
                      setOpenMenuId((prev) => (prev === item.id ? null : item.id))
                    }
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Location ID
                    </p>
                    <p className="mt-1 truncate text-gray-700">
                      {truncateText(item.locationCode || item.assetCode, 18)}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Country
                    </p>
                    <p className="mt-1 flex items-center gap-2 truncate text-gray-700">
                      <span>{item.countryFlag}</span>
                      <span>{truncateText(item.countryName, 16)}</span>
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Location
                    </p>
                    <p className="mt-1 truncate text-gray-700">
                      {truncateText(item.locationName, 18)}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Assign Date
                    </p>
                    <p className="mt-1 truncate text-gray-700">
                      {item.assignedDate || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Status
                    </p>
                    <div className="mt-1">
                      <StatusBadge
                        label={item.assignmentStatus}
                        className={getAssignmentStatusClasses(item.assignmentStatus)}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Receive Status
                    </p>
                    <div className="mt-1">
                      <StatusBadge
                        label={item.receiveStatus}
                        className={getReceiveStatusClasses(item.receiveStatus)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center">
              <p className="text-sm font-medium text-gray-700">No assignments found</p>
              <p className="mt-1 text-sm text-gray-500">
                Try a different search or filter combination.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}