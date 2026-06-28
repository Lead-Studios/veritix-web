import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useOfflineVerification } from "@/hooks/useOfflineVerification";

describe("useOfflineVerification", () => {
  it("returns initial online status", () => {
    const { result } = renderHook(() => useOfflineVerification());
    expect(typeof result.current.isOnline).toBe("boolean");
  });

  it("returns empty cache initially", () => {
    const { result } = renderHook(() => useOfflineVerification());
    expect(result.current.cacheSize).toBe(0);
  });

  it("provides clearCache function", () => {
    const { result } = renderHook(() => useOfflineVerification());
    expect(typeof result.current.clearCache).toBe("function");
  });
});
