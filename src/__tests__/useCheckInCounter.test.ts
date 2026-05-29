import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCheckInCounter } from "../hooks/useCheckInCounter";

const POLL_MS = 15_000;

const makeOkFetch = (data: object) =>
  vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => data,
  } as Response);

const makeErrFetch = () =>
  vi.fn().mockResolvedValue({
    ok: false,
    status: 500,
    json: async () => ({}),
  } as Response);

describe("useCheckInCounter", () => {
  beforeEach(() => {
    // Only fake setInterval/clearInterval — leave Promise/microtask queue real
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("fetches immediately on mount when isLive=true", async () => {
    vi.stubGlobal("fetch", makeOkFetch({ checkInCount: 42, totalCapacity: 500 }));

    const { result } = renderHook(() => useCheckInCounter("evt-1", true));

    // Let the async fetch resolve
    await act(async () => {});

    expect(result.current.checkInCount).toBe(42);
    expect(result.current.totalCapacity).toBe(500);
    expect(result.current.lastUpdated).toBeInstanceOf(Date);
  });

  it("does NOT fetch on mount when isLive=false", async () => {
    const fetchMock = makeOkFetch({ checkInCount: 0, totalCapacity: 0 });
    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useCheckInCounter("evt-2", false));

    act(() => { vi.advanceTimersByTime(POLL_MS * 3); });
    await act(async () => {});

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("polls every 15 s while isLive=true", async () => {
    const fetchMock = makeOkFetch({ checkInCount: 10, totalCapacity: 200 });
    vi.stubGlobal("fetch", fetchMock);

    renderHook(() => useCheckInCounter("evt-3", true));

    // Initial fetch
    await act(async () => {});
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Tick 1
    act(() => { vi.advanceTimersByTime(POLL_MS); });
    await act(async () => {});
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // Tick 2
    act(() => { vi.advanceTimersByTime(POLL_MS); });
    await act(async () => {});
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("stops polling when isLive transitions false", async () => {
    const fetchMock = makeOkFetch({ checkInCount: 5, totalCapacity: 100 });
    vi.stubGlobal("fetch", fetchMock);

    const { rerender } = renderHook(
      ({ live }) => useCheckInCounter("evt-4", live),
      { initialProps: { live: true } }
    );

    await act(async () => {});
    const callsBefore = fetchMock.mock.calls.length;

    // Event ends
    rerender({ live: false });

    act(() => { vi.advanceTimersByTime(POLL_MS * 3); });
    await act(async () => {});

    expect(fetchMock.mock.calls.length).toBe(callsBefore);
  });

  it("clears interval on unmount", async () => {
    vi.stubGlobal("fetch", makeOkFetch({ checkInCount: 0, totalCapacity: 300 }));
    const clearSpy = vi.spyOn(global, "clearInterval");

    const { unmount } = renderHook(() => useCheckInCounter("evt-5", true));

    await act(async () => {});
    unmount();

    expect(clearSpy).toHaveBeenCalled();
  });

  it("exposes an error when the API call fails", async () => {
    vi.stubGlobal("fetch", makeErrFetch());

    const { result } = renderHook(() => useCheckInCounter("evt-6", true));

    await act(async () => {});

    expect(result.current.error).toBeTruthy();
    expect(result.current.checkInCount).toBeNull();
  });

  it("manual refresh re-fetches immediately", async () => {
    const fetchMock = makeOkFetch({ checkInCount: 77, totalCapacity: 400 });
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useCheckInCounter("evt-7", true));

    await act(async () => {});
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await act(async () => { result.current.refresh(); });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});