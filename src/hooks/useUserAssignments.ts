"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchAllOrganisationAssignments,
  markAssignmentAsReceived,
} from "@/lib/assignments";
import type { UserDashboardAssignment } from "@/types/assignment";

type Organisation = {
  company_id: string;
  name: string;
};

type UseUserAssignmentsOptions = {
  organisations: Organisation[];
  userEmail: string;
  enabled?: boolean;
  refreshKey?: number;
};

export function useUserAssignments({
  organisations,
  userEmail,
  enabled = true,
  refreshKey = 0,
}: UseUserAssignmentsOptions) {
  const [assignments, setAssignments] = useState<UserDashboardAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const normalizedEmail = useMemo(() => {
    return userEmail.trim().toLowerCase();
  }, [userEmail]);

  const organisationsKey = useMemo(() => {
    return organisations.map((org) => org.company_id).join("|");
  }, [organisations]);

  const loadAssignments = useCallback(async () => {
    if (!enabled || !normalizedEmail || organisations.length === 0) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const allAssignmentsByOrg = await Promise.all(
        organisations.map(async (org) => {
          const items = await fetchAllOrganisationAssignments(org.company_id);

          return items.map((item) => ({
            ...item,
            organisationId: org.company_id,
            organisationName: org.name,
          }));
        })
      );

      const mine = allAssignmentsByOrg
        .flat()
        .filter((item) => {
          return item.user_email.trim().toLowerCase() === normalizedEmail;
        })
        .sort((a, b) => {
          const aTime = a.date_assigned
            ? new Date(a.date_assigned).getTime()
            : 0;

          const bTime = b.date_assigned
            ? new Date(b.date_assigned).getTime()
            : 0;

          return bTime - aTime;
        });

      setAssignments(mine);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load your assigned assets.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [enabled, normalizedEmail, organisationsKey]);

  const markReceived = useCallback(async (assignmentId: string) => {
    setActionLoadingId(assignmentId);

    try {
      await markAssignmentAsReceived({ assignment_id: assignmentId });

      setAssignments((current) =>
        current.map((item) =>
          item.assignment_id === assignmentId
            ? { ...item, received_status: "RECEIVED" }
            : item
        )
      );
    } finally {
      setActionLoadingId(null);
    }
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments, refreshKey]);

  const pendingCount = useMemo(() => {
    return assignments.filter((item) => item.received_status === "PENDING")
      .length;
  }, [assignments]);

  return {
    assignments,
    loading,
    error,
    pendingCount,
    actionLoadingId,
    reload: loadAssignments,
    markReceived,
  };
}