"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchAssignmentsPage } from "@/lib/assignments";
import type { AssignmentListItem } from "@/types/assignment";

type UseAssignmentsOptions = {
  organisationId: string;
  page: number;
  enabled?: boolean;
  refreshKey?: number;
};

export function useAssignments({
  organisationId,
  page,
  enabled = true,
  refreshKey = 0,
}: UseAssignmentsOptions) {
  const [assignments, setAssignments] = useState<AssignmentListItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAssignments = useCallback(async () => {
    if (!enabled || !organisationId) {
      setAssignments([]);
      setCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchAssignmentsPage(organisationId, page);

      setAssignments(Array.isArray(data.results) ? data.results : []);
      setCount(typeof data.count === "number" ? data.count : 0);
    } catch (error) {
      setAssignments([]);
      setCount(0);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load assignments."
      );
    } finally {
      setLoading(false);
    }
  }, [enabled, organisationId, page]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments, refreshKey]);

  return {
    assignments,
    count,
    loading,
    error,
    reload: loadAssignments,
  };
}