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

  const normalizedEmail = useMemo(
    () => userEmail.trim().toLowerCase(),
    [userEmail]
  );

  const loadAssignments = useCallback(async () => {
    if (!enabled || !normalizedEmail || organisations.length === 0) {
      setAssignments([]);
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

      const flattened = allAssignmentsByOrg.flat();

      const mine = flattened
        .filter(
          (item) => item.user_email.trim().toLowerCase() === normalizedEmail
        )
        .sort((a, b) => {
          const aTime = a.date_assigned ? new Date(a.date_assigned).getTime() : 0;
          const bTime = b.date_assigned ? new Date(b.date_assigned).getTime() : 0;
          return bTime - aTime;
        });

      setAssignments(mine);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load your assigned assets."
      );
    } finally {
      setLoading(false);
    }
  }, [enabled, normalizedEmail, organisations]);

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
    } catch (error) {
      throw error;
    } finally {
      setActionLoadingId(null);
    }
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments, refreshKey]);

  const pendingCount = assignments.filter(
    (item) => item.received_status === "PENDING"
  ).length;

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