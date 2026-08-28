"use client";

import { useEffect, useState } from "react";
import { useSession } from "./useSession";

export function useAuthState() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useSession();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsAuthenticated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return { isLoading, isAuthenticated };
}
