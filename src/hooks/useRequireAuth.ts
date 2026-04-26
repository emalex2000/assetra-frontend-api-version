// hooks/useRequireAuth.ts
"use client";

import { useEffect, useState } from "react";
import { ensureAuthenticated } from "../lib/authSession";

export function useRequireAuth(): boolean {
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const runAuthCheck = async () => {
      await ensureAuthenticated();

      if (isMounted) {
        setCheckingAuth(false);
      }
    };

    runAuthCheck();

    return () => {
      isMounted = false;
    };
  }, []);

  return checkingAuth;
}