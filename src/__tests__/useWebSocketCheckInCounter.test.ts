import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useWebSocketCheckInCounter } from "@/hooks/useWebSocketCheckInCounter";

describe("useWebSocketCheckInCounter", () => {
  it("returns disconnected state initially", () => {
    const { result } = renderHook(() =>
      useWebSocketCheckInCounter("evt-1", "ws://localhost:8080")
    );
    expect(result.current.connected).toBe(false);
    expect(result.current.checkInCount).toBe(0);
  });

  it("handles null eventId", () => {
    const { result } = renderHook(() =>
      useWebSocketCheckInCounter(null, "ws://localhost:8080")
    );
    expect(result.current.connected).toBe(false);
  });
});
