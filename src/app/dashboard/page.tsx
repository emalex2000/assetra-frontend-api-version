"use client";

import { useEffect, useMemo, useState } from "react";
import OrganisationsSection from "../../../components/dashboard/OrganisationSection";
import OverviewCard from "../../../components/dashboard/OverviewCard";
import { FiBox, FiCheckCircle, FiMonitor, FiUser } from "react-icons/fi";
import Button from "../../../components/landing-page/Button";
import { FaPlus } from "react-icons/fa";
import { apiFetch } from "../../../lib/apiClient";
import DashboardNav from "../../../components/dashboard/DashboardNav";
import { useUserAssignments } from "@/hooks/useUserAssignments";
import MyAssignedAssetsPanel from "@/components/dashboard/MyAssignedAssetsPanel";

type Organisation = {
  company_id: string;
  name: string;
  industry: string;
  company_size?: number;
  assetsCount?: number;
  membersCount?: number;
  created_at?: string;
  company_logo?: string | null;
};

export default function Dashboard() {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const userEmail = useMemo(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("user_email") || "";
  }, []);

  useEffect(() => {
    const fetchOrganisations = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiFetch("/api/accounts/my-organisations/", {
          method: "GET",
        });

        if (!response.ok) {
          let message = "Failed to fetch organisations";

          try {
            const errorData = await response.json();
            message = errorData?.detail || errorData?.message || message;
          } catch {
            // ignore parse failure
          }

          throw new Error(message);
        }

        const data: Organisation[] = await response.json();
        setOrganisations(Array.isArray(data) ? data : []);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong";
        setError(message);
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganisations();
  }, []);

  const totalDevices = organisations.reduce(
    (sum, org) => sum + (org.assetsCount ?? 0),
    0
  );

  const organisationMembers = organisations.reduce(
    (sum, org) => sum + (org.membersCount ?? 0),
    0
  );

  const {
    assignments,
    loading: assignmentsLoading,
    error: assignmentsError,
    pendingCount,
    actionLoadingId,
    markReceived,
  } = useUserAssignments({
    organisations: organisations.map((org) => ({
      company_id: org.company_id,
      name: org.name,
    })),
    userEmail,
    enabled: organisations.length > 0 && !!userEmail,
    refreshKey,
  });

  const assignedDevices = assignments.length;
  const receivedDevices = assignments.filter(
    (item) => item.received_status === "RECEIVED"
  ).length;

  async function handleMarkReceived(assignmentId: string) {
    try {
      await markReceived(assignmentId);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to mark asset as received.";
      alert(message);
    }
  }

  return (
    <div>
      <DashboardNav>
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[32px] font-bold">Dashboard Overview</h1>
            <p>
              Welcome back, here is an overview of your organisations and assets
            </p>
          </div>

          <Button
            text="Create organisation"
            variant="black"
            href="/dashboard/create-organisation"
            icon={FaPlus}
            iconPosition="left"
            className="bg-blue-500"
          />
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <OverviewCard
            title="Total Devices"
            amount={totalDevices}
            description="All registered electronic equipment within the organization."
            icon={<FiMonitor className="text-gray-400" size={18} />}
          />

          <OverviewCard
            title="Assigned To Me"
            amount={assignedDevices}
            description="Assets currently assigned to your account."
            icon={<FiCheckCircle className="text-gray-400" size={18} />}
          />

          <OverviewCard
            title="Pending Confirmation"
            amount={pendingCount}
            description="Assets waiting for you to confirm receipt."
            icon={<FiBox className="text-gray-400" size={18} />}
          />

          <OverviewCard
            title="Organisation Members"
            amount={organisationMembers}
            description="Members currently managing or using equipment."
            icon={<FiUser className="text-gray-400" size={18} />}
          />
        </div>

        <MyAssignedAssetsPanel
          assignments={assignments}
          loading={assignmentsLoading || loading}
          error={assignmentsError}
          actionLoadingId={actionLoadingId}
          onMarkReceived={handleMarkReceived}
        />

        <div className="mt-6">
          <OrganisationsSection organisations={organisations} />
        </div>
      </DashboardNav>
    </div>
  );
}