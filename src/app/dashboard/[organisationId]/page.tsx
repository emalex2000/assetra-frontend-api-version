"use client";

import { JSX, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SideBar from "../../../../components/dashboard/LayoutNav";
import OverviewCard from "../../../../components/dashboard/OverviewCard";
import { FiUser, FiCheckCircle, FiMonitor, FiBox } from "react-icons/fi";
import StatusOverviewCard from "../../../../components/dashboard/StatusOverview";
import QuickActionPanel from "../../../../components/dashboard/QuickActionPanel";
import RecentlyAssignedDevicesTable from "../../../../components/dashboard/DashboardTable";
import DevicesDamagedCard, {
  type DamagedDeviceData,
} from "../../../../components/dashboard/DevicesDamagedCard";
import { apiFetch } from "../../../../lib/apiClient";

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


type OrganisationListItem = {
  company_id: string;
  name: string;
  industry?: string;
  company_size?: number | string;
  country?: string;
  created_at?: string;
  company_logo?: string | null;
  membersCount?: number;
  assetsCount?: number;
};

type DashboardStats = {
  totalDevices: number;
  assignedDevices: number;
  availableDevices: number;
  organisationMembers: number;
};

const statusTabs: StatusTab[] = [
  { key: "availableDevices", label: "Available Devices" },
  { key: "assignedDevices", label: "Assigned Devices" },
  { key: "organizationMembers", label: "Organization Members" },
  { key: "totalDevices", label: "Total Devices" },
];

const defaultStats: DashboardStats = {
  totalDevices: 0,
  assignedDevices: 0,
  availableDevices: 0,
  organisationMembers: 0,
};

export default function OrganisationDashboard(): JSX.Element {
  const params = useParams<{ organisationId: string }>();
  const organisationId = params?.organisationId;
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [statusData, setStatusData] = useState<StatusDataItem[]>([]);
  const [assignedDevices, setAssignedDevices] = useState<AssignedDeviceRow[]>([]);
  const [damagedData, setDamagedData] = useState<DamagedDeviceData[]>([]);
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

        const organisations: OrganisationListItem[] = await response.json();

        const currentOrganisation = organisations.find(
          (item) => item.company_id === organisationId
        );

        if (!currentOrganisation) {
          throw new Error("Organisation not found in your accessible organisations.");
        }

        const totalDevices = currentOrganisation.assetsCount ?? 0;
        const organisationMembers = currentOrganisation.membersCount ?? 0;

        setStats({
          totalDevices,
          assignedDevices: 0,
          availableDevices: totalDevices,
          organisationMembers,
        });

        setStatusData([
          {
            label: currentOrganisation.name || "Organisation",
            availableDevices: totalDevices,
            assignedDevices: 0,
            organizationMembers: organisationMembers,
            totalDevices,
          },
        ]);

        setAssignedDevices([]);
        setDamagedData([]);
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

  const safeStatusData = useMemo(() => {
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

  const safeDamagedData = useMemo(() => {
    if (damagedData.length > 0) return damagedData;

    return [{ month: "No Data", value: 0, color: "black" }];
  }, [damagedData]);

  return (
    <SideBar>
      <div className="flex flex-col gap-4">
        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
            title="Total Devices"
            amount={stats.totalDevices}
            description="All registered electronic equipment within the organization."
            icon={<FiMonitor className="text-gray-400" size={18} />}
          />

          <OverviewCard
            title="Assigned Devices"
            amount={stats.assignedDevices}
            description="Devices currently in use by organization members."
            icon={<FiCheckCircle className="text-gray-400" size={18} />}
          />

          <OverviewCard
            title="Available Devices"
            amount={stats.availableDevices}
            description="Devices currently available for assignment."
            icon={<FiBox className="text-gray-400" size={18} />}
          />

          <OverviewCard
            title="Organisation Members"
            amount={stats.organisationMembers}
            description="Members currently managing or using equipment."
            icon={<FiUser className="text-gray-400" size={18} />}
          />
        </div>

        <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
          <div className="w-full xl:flex-1">
            <StatusOverviewCard
              title="Device Status Overview"
              tabs={statusTabs}
              data={safeStatusData}
              defaultTab="totalDevices"
            />
          </div>

          <QuickActionPanel
            organisationId={organisationId}
            actions={[
              { title: "Register Device" },
              {
                title: "Assign Device",
                onClick: () => router.push(`/dashboard/${organisationId}/assign-device`),
              },
              {
                title: "View Reports",
                onClick: () => router.push(`/dashboard/${organisationId}/reports`),
              },
              {
                title: "Manage Members",
                onClick: () => router.push(`/dashboard/${organisationId}/members`),
              },
            ]}
          />
        </div>

        <div className="bg-gray-50 w-full flex flex-col gap-5 xl:flex-row">
          <RecentlyAssignedDevicesTable data={assignedDevices} />
          <div>
            <DevicesDamagedCard
              data={safeDamagedData}
              highlightedIndex={0}
              maxValue={25}
            />
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
            Loading dashboard data...
          </div>
        )}
      </div>
    </SideBar>
  );
}