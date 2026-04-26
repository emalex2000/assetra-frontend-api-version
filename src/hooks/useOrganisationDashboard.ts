"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/apiClient";
import { AssignedDeviceRow, DamagedDataItem, DashboardStats, OrganisationDashboardResponse, StatusDataItem } from "@/types/dashboard";

const defaultStats: DashboardStats = {
  totalDevices: 0,
  assignedDevices: 0,
  availableDevices: 0,
  organisationMembers: 0,
};

type UseOrganisationDashboardReturn = {
  stats: DashboardStats;
  statusData: StatusDataItem[];
  assignedDevices: AssignedDeviceRow[];
  damagedData: DamagedDataItem[];
  loading: boolean;
  error: string | null;
};

export function useOrganisationDashboard(
  organisationId?: string
): UseOrganisationDashboardReturn {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [statusData, setStatusData] = useState<StatusDataItem[]>([]);
  const [assignedDevices, setAssignedDevices] = useState<AssignedDeviceRow[]>(
    []
  );
  const [damagedData, setDamagedData] = useState<DamagedDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!organisationId) {
        setLoading(false);
        setError("Organisation ID is missing.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await apiFetch("/api/accounts/my-organisations/", {
          method: "GET",
        });

        if (!response.ok) {
          let message = "Failed to fetch organisation dashboard data.";

          try {
            const errorData = await response.json();
            message =
              errorData?.detail ||
              errorData?.message ||
              errorData?.error ||
              message;
          } catch {
            // ignore parse failure
          }

          throw new Error(message);
        }

        const data: OrganisationDashboardResponse = await response.json();

        setStats({
          totalDevices: data?.stats?.totalDevices ?? 0,
          assignedDevices: data?.stats?.assignedDevices ?? 0,
          availableDevices: data?.stats?.availableDevices ?? 0,
          organisationMembers: data?.stats?.organisationMembers ?? 0,
        });

        setStatusData(
          Array.isArray(data?.statusOverview)
            ? data.statusOverview.map((item, index) => ({
                label: item?.label || `Item ${index + 1}`,
                availableDevices: item?.availableDevices ?? 0,
                assignedDevices: item?.assignedDevices ?? 0,
                organizationMembers: item?.organizationMembers ?? 0,
                totalDevices: item?.totalDevices ?? 0,
              }))
            : []
        );

        setAssignedDevices(
          Array.isArray(data?.recentlyAssignedDevices)
            ? data.recentlyAssignedDevices.map((item, index) => ({
                id: item?.id ?? index + 1,
                device: item?.device || "—",
                assignedTo: item?.assignedTo || "—",
                location: item?.location || "—",
                assignedBy: item?.assignedBy || "—",
                date: item?.date || "—",
                status: "Assigned",
              }))
            : []
        );

        setDamagedData(
          Array.isArray(data?.damagedDevicesTrend)
            ? data.damagedDevicesTrend.map((item, index) => ({
                month: item?.month || `M${index + 1}`,
                value: item?.value ?? 0,
                color: index % 2 === 0 ? "black" : "blue",
              }))
            : []
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong while loading dashboard data.";

        setError(message);
        setStats(defaultStats);
        setStatusData([]);
        setAssignedDevices([]);
        setDamagedData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [organisationId]);

  const safeStatusData = useMemo<StatusDataItem[]>(() => {
    if (statusData.length > 0) return statusData;

    return [
      {
        label: "No Data",
        availableDevices: 0,
        assignedDevices: 0,
        organizationMembers: 0,
        totalDevices: 0,
      },
    ];
  }, [statusData]);

  const safeDamagedData = useMemo<DamagedDataItem[]>(() => {
    if (damagedData.length > 0) return damagedData;

    return [
      {
        month: "No Data",
        value: 0,
        color: "black",
      },
    ];
  }, [damagedData]);

  return {
    stats,
    statusData: safeStatusData,
    assignedDevices,
    damagedData: safeDamagedData,
    loading,
    error,
  };
}