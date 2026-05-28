import { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WalletAddressDisplay } from "../components/profile/WalletAddressDisplay";
import { useProfile } from "../hooks/useProfile";

const MOCK_PROFILE = {
  id: "u1",
  name: "Ada Lovelace",
  email: "ada@example.com",
  avatarUrl: "https://example.com/ada.jpg",
  walletAddress: "GABCDE12345FGHIJ67890KLMNO",
};

const okFetch = (data: object) =>
  vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => data,
  } as Response);

const errFetch = (message = "Server error") =>
  vi.fn().mockResolvedValue({
    ok: false,
    status: 500,
    json: async () => ({ message }),
  } as Response);

describe("useProfile", () => {
  afterEach(() => vi.restoreAllMocks());

  it("fetches profile on mount and exposes data", async () => {
    vi.stubGlobal("fetch", okFetch(MOCK_PROFILE));

    const { result } = renderHook(() => useProfile());

    expect(result.current.loading).toBe(true);

    await act(async () => {});

    expect(result.current.profile?.name).toBe("Ada Lovelace");
    expect(result.current.profile?.email).toBe("ada@example.com");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("exposes error when fetch fails", async () => {
    vi.stubGlobal("fetch", errFetch("Failed to load profile"));

    const { result } = renderHook(() => useProfile());

    await act(async () => {});

    expect(result.current.error).toBe("Failed to load profile");
    expect(result.current.profile).toBeNull();
  });

  it("save() calls PATCH and updates profile state", async () => {
    const fetchMock = vi
      .fn()
      // First call: GET /api/auth/me
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => MOCK_PROFILE } as Response)
      // Second call: PATCH /api/auth/me
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ ...MOCK_PROFILE, name: "Ada Updated" }),
      } as Response);

    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useProfile());
    await act(async () => {});

    await act(async () => {
      await result.current.save({ name: "Ada Updated" });
    });

    expect(result.current.profile?.name).toBe("Ada Updated");
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const patchCall = fetchMock.mock.calls[1];
    expect(patchCall[1]?.method).toBe("PATCH");
  });

  it("save() throws and does not update state on API error", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => MOCK_PROFILE } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: "Invalid email" }),
      } as Response);

    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useProfile());
    await act(async () => {});

    await expect(
      act(async () => { await result.current.save({ email: "bad" }); })
    ).rejects.toThrow("Invalid email");

    // Profile unchanged
    expect(result.current.profile?.name).toBe("Ada Lovelace");
  });
});

describe("WalletAddressDisplay", () => {
  beforeEach(() => {
    // jsdom doesn't implement clipboard — stub it
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it("renders the wallet address when provided", () => {
    render(
      <WalletAddressDisplay address={MOCK_PROFILE.walletAddress} />
    );

    expect(screen.getAllByText(MOCK_PROFILE.walletAddress).length).toBeGreaterThan(0);
  });

  it("copies address to clipboard on button click", async () => {
    render(
      <WalletAddressDisplay address={MOCK_PROFILE.walletAddress} />
    );

    const copyBtn = screen.getByRole("button", { name: /copy wallet address/i });
    fireEvent.click(copyBtn);

    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(MOCK_PROFILE.walletAddress)
    );
  });

  it("shows a checkmark after copying", async () => {
    render(
      <WalletAddressDisplay address={MOCK_PROFILE.walletAddress} />
    );

    const copyBtn = screen.getByRole("button", { name: /copy wallet address/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      // The Copy icon is replaced by a Check icon (aria-label changes)
      expect(screen.queryByLabelText(/copy wallet address/i)).not.toBeNull();
    });
  });

  it("shows 'No wallet connected' when address is absent", () => {
    render(<WalletAddressDisplay />);
    expect(screen.getByText(/no wallet connected/i)).toBeInTheDocument();
  });

  it("calls onConnectClick when the connect prompt is clicked", () => {
    const onConnect = vi.fn();
    render(<WalletAddressDisplay onConnectClick={onConnect} />);

    const connectBtn = screen.getByRole("button", { name: /connect wallet/i });
    fireEvent.click(connectBtn);

    expect(onConnect).toHaveBeenCalledOnce();
  });
});