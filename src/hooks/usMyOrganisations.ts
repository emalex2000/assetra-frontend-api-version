"use client";

import { useEffect, useState } from "react";
import { Organisation } from "@/types/organisation";
import { apiFetch } from "../lib/apiClient";

type UseMyOrganisationsReturn = {
  organisations: Organisation[];
  loading: boolean;
  error: string | null;
};

export function useMyOrganisations(): UseMyOrganisationsReturn {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchOrganisations = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch("/api/accounts/my-organisations/");

        if (!response.ok) {
          throw new Error("Failed to fetch organisations");
        }

        const data: Organisation[] = await response.json();

        if (!isMounted) return;

        setOrganisations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch organisations:", err);

        if (!isMounted) return;
        setError("Could not load organisations.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOrganisations();

    return () => {
      isMounted = false;
    };
  }, []);

  return { organisations, loading, error };
}