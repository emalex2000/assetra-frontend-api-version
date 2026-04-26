"use client";

import { useCallback, useEffect, useState } from "react";
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
    if (!organisationId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchAssignments(organisationId, page);
      setAssignments(data.results);
      setCount(data.count);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load assignments."
      );
    } finally {
      setLoading(false);
    }
  }, [organisationId, page]);

  useEffect(() => {
    if (!enabled || !organisationId) return;
    loadAssignments();
  }, [enabled, organisationId, page, refreshKey, loadAssignments]);

  return {
    assignments,
    count,
    loading,
    error,
    reload: loadAssignments,
  };
}