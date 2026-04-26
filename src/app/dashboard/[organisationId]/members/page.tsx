"use client";


import { RecentlyAssignedMember } from "@/types/members";
import RecentlyAssignedDevicesTable from "../../../../components/dashboard/RecentlyAssignedDevicesTable";
import SideBar from "../../../../components/dashboard/LayoutNav";
import { PendingJoinRequest, ReviewJoinRequestAction } from "@/types/organisation";
import { apiFetch } from "../../../../lib/apiClient";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import JoinRequestsTable from "@/components/dashboard/JoinRequestSection";

const mockMembers: RecentlyAssignedMember[] = [
  {
    id: "1",
    name: "Musa Alhaji",
    email: "Musa Alhaji@gmail.com",
    role: "Admin",
    devicesAssigned: "4 Devices",
    location: "Nigeria",
    status: "Active",
  },
  {
    id: "2",
    name: "Musa Alhaji",
    email: "Musa Alhaji@gmail.com",
    role: "Member",
    devicesAssigned: "4 Devices",
    location: "Nigeria",
    status: "Active",
  },
  {
    id: "3",
    name: "Musa Alhaji",
    email: "Musa Alhaji@gmail.com",
    role: "Admin",
    devicesAssigned: "4 Devices",
    location: "Nigeria",
    status: "Pending",
  },
  {
    id: "4",
    name: "Musa Alhaji",
    email: "Musa Alhaji@gmail.com",
    role: "Member",
    devicesAssigned: "4 Devices",
    location: "Nigeria",
    status: "Active",
  },
  {
    id: "5",
    name: "Musa Alhaji",
    email: "Musa Alhaji@gmail.com",
    role: "Admin",
    devicesAssigned: "4 Devices",
    location: "Nigeria",
    status: "Active",
  },
  {
    id: "6",
    name: "Amina Yusuf",
    email: "amina@gmail.com",
    role: "Member",
    devicesAssigned: "2 Devices",
    location: "Ghana",
    status: "Pending",
  },
];

export default function RecentlyAddedPage() {
  const params = useParams<{ organisationId: string }>();
  const organisationId = params?.organisationId;

  const [joinRequests, setJoinRequests] = useState<PendingJoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchJoinRequests = useCallback(async () => {
    if (!organisationId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch(
        `/api/accounts/organisation/${organisationId}/join-requests/`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        let message = "Failed to fetch join requests";

        try {
          const errorData = await response.json();
          message = errorData?.detail || errorData?.error || message;
        } catch {
          // fall back to default message
        }

        throw new Error(message);
      }

      const data: PendingJoinRequest[] = await response.json();
      setJoinRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      console.error("Join requests fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [organisationId]);

  useEffect(() => {
    fetchJoinRequests();
  }, [fetchJoinRequests]);

  const handleReviewRequest = async (
    requestId: string,
    action: ReviewJoinRequestAction
  ) => {
    if (!organisationId) return;

    setActionLoadingId(requestId);

    try {
      const response = await apiFetch(
        `/api/accounts/organisation/${organisationId}/join-requests/${requestId}/review/`,
        {
          method: "POST",
          body: JSON.stringify({ action }),
        }
      );

      if (!response.ok) {
        let message = `Failed to ${action === "APPROVED" ? "accept" : "reject"} request`;

        try {
          const errorData = await response.json();
          message = errorData?.detail || errorData?.error || message;
        } catch {
          // keep default message
        }

        throw new Error(message);
      }

      setJoinRequests((prev) =>
        prev.filter((item) => item.request_id !== requestId)
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      console.error("Join request review error:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <>
      <SideBar>
        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Members Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review incoming join requests before users become members.
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <JoinRequestsTable
            data={joinRequests}
            loading={loading}
            onReview={handleReviewRequest}
            actionLoadingId={actionLoadingId}
          />
        </div>
        <RecentlyAssignedDevicesTable data={mockMembers} />
      </SideBar>
    </>
  
);
}