"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createAssignment,
  fetchAssignableAssets,
  fetchAssignableUsers,
} from "@/lib/assignments";
import type {
  AssignableAsset,
  AssignableUser,
  CreateAssignmentPayload,
} from "@/types/assignment";

type UseAssignAssetOptions = {
  organisationId: string;
  enabled?: boolean;
};

export function useAssignAsset({
  organisationId,
  enabled = true,
}: UseAssignAssetOptions) {
  const [assets, setAssets] = useState<AssignableAsset[]>([]);
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [assetsError, setAssetsError] = useState<string | null>(null);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loadAssets = useCallback(
    async (query = "") => {
      if (!organisationId) return;

      setAssetsLoading(true);
      setAssetsError(null);

      try {
        const data = await fetchAssignableAssets(organisationId, query);
        setAssets(data);
      } catch (error) {
        setAssetsError(
          error instanceof Error ? error.message : "Failed to load assets."
        );
      } finally {
        setAssetsLoading(false);
      }
    },
    [organisationId]
  );

  const loadUsers = useCallback(
    async (query = "") => {
      if (!organisationId) return;

      setUsersLoading(true);
      setUsersError(null);

      try {
        const data = await fetchAssignableUsers(organisationId, query);
        setUsers(data);
      } catch (error) {
        setUsersError(
          error instanceof Error ? error.message : "Failed to load users."
        );
      } finally {
        setUsersLoading(false);
      }
    },
    [organisationId]
  );

  const submitAssignment = useCallback(
    async (payload: CreateAssignmentPayload) => {
      if (!organisationId) {
        throw new Error("Organisation ID is missing.");
      }

      setSubmitting(true);
      setSubmitError(null);

      try {
        const result = await createAssignment(organisationId, payload);
        return result;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create assignment.";
        setSubmitError(message);
        throw error;
      } finally {
        setSubmitting(false);
      }
    },
    [organisationId]
  );

  useEffect(() => {
    if (!enabled || !organisationId) return;

    loadAssets();
    loadUsers();
  }, [enabled, organisationId, loadAssets, loadUsers]);

  return {
    assets,
    users,
    assetsLoading,
    usersLoading,
    submitting,
    assetsError,
    usersError,
    submitError,
    loadAssets,
    loadUsers,
    submitAssignment,
  };
}