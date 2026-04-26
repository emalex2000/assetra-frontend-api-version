// src/hooks/useCurrentOrganisation.ts

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "../lib/apiClient";

type Organisation = {
  company_id: string;
  name: string;
};

export function useCurrentOrganisation() {
  const params = useParams<{ organisationId?: string }>();
  const organisationId = params?.organisationId;

  const [organisation, setOrganisation] = useState<Organisation | null>(null);

  useEffect(() => {
    if (!organisationId) return;

    async function load() {
      try {
        const res = await apiFetch("/api/accounts/my-organisations/");
        const data: Organisation[] = await res.json();

        const current = data.find(
          (org) => org.company_id === organisationId
        );

        setOrganisation(current || null);
      } catch (err) {
        console.error("Failed to load organisation", err);
      }
    }

    load();
  }, [organisationId]);

  return organisation;
}