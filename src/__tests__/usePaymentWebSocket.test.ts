import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePaymentWebSocket } from "@/hooks/usePaymentWebSocket";

describe("usePaymentWebSocket", () => {
  it("returns disconnected status initially", () => {
    const { result } = renderHook(() =>
      usePaymentWebSocket({ url: "ws://localhost:8080" })
    );
    expect(result.current.wsStatus).toBe("connecting");
  });
});
