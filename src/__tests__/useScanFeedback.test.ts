import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScanFeedback } from "@/hooks/useScanFeedback";

describe("useScanFeedback", () => {
  it("returns feedback functions", () => {
    const { result } = renderHook(() => useScanFeedback());
    expect(typeof result.current.playFeedback).toBe("function");
    expect(typeof result.current.playValidSound).toBe("function");
    expect(typeof result.current.playInvalidSound).toBe("function");
    expect(typeof result.current.triggerHaptic).toBe("function");
  });
});
