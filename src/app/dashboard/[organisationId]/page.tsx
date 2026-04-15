"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import SideBar from "../../../../components/dashboard/LayoutNav";
import OverviewCard from "../../../../components/dashboard/OverviewCard";
import { FiUser, FiCheckCircle, FiMonitor, FiBox } from "react-icons/fi";
import StatusOverviewCard from "../../../../components/dashboard/StatusOverview";
import QuickActionPanel from "../../../../components/dashboard/QuickActionPanel";
import RecentlyAssignedDevicesTable from "../../../../components/dashboard/DashboardTable";
import DevicesDamagedCard from "../../../../components/dashboard/DevicesDamagedCard";
import { apiFetch } from "../../../../lib/apiClient";
import router from "next/router";

type StatusTabKey =
  | "availableDevices"
  | "assignedDevices"
  | "organizationMembers"
  | "totalDevices";

type StatusTab = {
  key: StatusTabKey;
  label: string;
};

type StatusDataItem = {
  label: string;
  availableDevices: number;
  assignedDevices: number;
  organizationMembers: number;
  totalDevices: number;
};

type AssignedDeviceRow = {
  id: number | string;
  device: string;
  assignedTo: string;
  location: string;
  assignedBy: string;
  date: string;
  status: "Assigned";
};

type DamagedDataItem = {
  month: string;
  value: number;
  color: string;
};

type OrganisationDashboardResponse = {
  stats?: {
    totalDevices?: number;
    assignedDevices?: number;
    availableDevices?: number;
    organisationMembers?: number;
  };
  statusOverview?: Array<{
    label?: string;
    availableDevices?: number;
    assignedDevices?: number;
    organizationMembers?: number;
    totalDevices?: number;
  }>;
  recentlyAssignedDevices?: Array<{
    id?: number | string;
    device?: string;
    assignedTo?: string;
    location?: string;
    assignedBy?: string;
    date?: string;
    status?: string;
  }>;
  damagedDevicesTrend?: Array<{
    month?: string;
    value?: number;
  }>;
};

const statusTabs: StatusTab[] = [
  { key: "availableDevices", label: "Available Devices" },
  { key: "assignedDevices", label: "Assigned Devices" },
  { key: "organizationMembers", label: "Organization Members" },
  { key: "totalDevices", label: "Total Devices" },
];

const defaultStats = {
  totalDevices: 0,
  assignedDevices: 0,
  availableDevices: 0,
  organisationMembers: 0,
};

export default function OrganisationDashboard(): JSX.Element {
  const params = useParams<{ organisationId: string }>();
  const organisationId = params?.organisationId;

  const [stats, setStats] = useState(defaultStats);
  const [statusData, setStatusData] = useState<StatusDataItem[]>([]);
  const [assignedDevices, setAssignedDevices] = useState<AssignedDeviceRow[]>([]);
  const [damagedData, setDamagedData] = useState<DamagedDataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
        // Replace this endpoint with your real backend endpoint if different.
        const response = await apiFetch(
          `/api/accounts/my-organisations/`,
          {
            method: "GET",
          }
        );

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
            // ignore parse failure and use default message
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
    if (statusData.length > 0) {
      return statusData;
    }

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
    if (damagedData.length > 0) {
      return damagedData;
    }

    return [
      { month: "No Data", value: 0, color: "black" },
    ];
  }, [damagedData]);

  return (
    <SideBar>
      <div className="flex flex-col gap-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
            title="Total Devices"
            amount={stats.totalDevices ?? 0}
            description="All registered electronic equipment within the organization."
            icon={<FiMonitor className="text-gray-400" size={18} />}
          />

          <OverviewCard
            title="Assigned Devices"
            amount={stats.assignedDevices ?? 0}
            description="Devices currently in use by organization members."
            icon={<FiCheckCircle className="text-gray-400" size={18} />}
          />

          <OverviewCard
            title="Available Devices"
            amount={stats.availableDevices ?? 0}
            description="Devices currently available for assignment."
            icon={<FiBox className="text-gray-400" size={18} />}
          />

          <OverviewCard
            title="Organisation Members"
            amount={stats.organisationMembers ?? 0}
            description="Members currently managing or using equipment."
            icon={<FiUser className="text-gray-400" size={18} />}
          />
        </div>

        <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1">
            <StatusOverviewCard
              title="Device Status Overview"
              tabs={statusTabs}
              data={safeStatusData}
              defaultTab="assignedDevices"
            />
          </div>

          <QuickActionPanel
            organisationId={params.organisationId}
            actions={[
              { title: "Register Device" },
              { title: "Assign Device", onClick: () => router.push(`/dashboard/${params.organisationId}/assign-device`) },
              { title: "View Reports", onClick: () => router.push(`/dashboard/${params.organisationId}/reports`) },
              { title: "Manage Members", onClick: () => router.push(`/dashboard/${params.organisationId}/members`) },
            ]}
          />
        </div>

        <div className="flex w-full flex-col gap-5 bg-gray-50 xl:flex-row">
          <div className="min-w-0 flex-1">
            <RecentlyAssignedDevicesTable data={assignedDevices} />
          </div>

          <div>
            <DevicesDamagedCard
              data={safeDamagedData}
              highlightedIndex={
                safeDamagedData.length > 1 ? Math.min(5, safeDamagedData.length - 1) : 0
              }
              maxValue={
                Math.max(...safeDamagedData.map((item) => item.value), 0) || 25
              }
            />
          </div>
        </div>

        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
            Loading dashboard data...
          </div>
        )}
      </div>
    </SideBar>
  );
}