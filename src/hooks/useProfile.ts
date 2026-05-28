"use client";

import { getToken } from "@/lib/auth";
import { useCallback, useEffect, useState } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  walletAddress?: string;
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

export async function fetchProfile(): Promise<UserProfile> {
  const res = await fetch("/api/auth/me", { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to load profile");
  return res.json();
}

export async function updateProfile(
  patch: Partial<Pick<UserProfile, "name" | "email" | "avatarUrl">>
): Promise<UserProfile> {
  const res = await fetch("/api/auth/me", {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Failed to save profile");
  }
  return res.json();
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProfile();
      setProfile(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = useCallback(
    async (patch: Partial<Pick<UserProfile, "name" | "email" | "avatarUrl">>) => {
      const updated = await updateProfile(patch);
      setProfile(updated);
      return updated;
    },
    []
  );

  return { profile, loading, error, save, reload: load };
}