import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFreighterPayment } from "@/hooks/useFreighterPayment";

vi.mock("@stellar/freighter-api", () => ({
  isConnected: vi.fn().mockResolvedValue(true),
  getPublicKey: vi.fn().mockResolvedValue("GB1234567890ABCDEF"),
  signTransaction: vi.fn().mockResolvedValue("AAAAAgAAAABqWA=="),
}));

describe("useFreighterPayment", () => {
  it("initializes with idle status", () => {
    const { result } = renderHook(() => useFreighterPayment());
    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBeUndefined();
  });

  it("exposes reset function", () => {
    const { result } = renderHook(() => useFreighterPayment());
    act(() => result.current.reset());
    expect(result.current.status).toBe("idle");
  });
});
