"use client";

import { useEffect, useState } from "react";
import { fetchCurrentUser } from "@/lib/user";
import type { CurrentUser } from "@/types/auth";

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchCurrentUser();

        if (!isMounted) return;

        setUser(data);

        sessionStorage.setItem("user_id", data.id);
        sessionStorage.setItem("user_email", data.email);
        sessionStorage.setItem("user_roles", JSON.stringify(data.roles));
      } catch (error) {
        if (!isMounted) return;

        setError(
          error instanceof Error ? error.message : "Failed to load user."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    user,
    loading,
    error,
  };
}