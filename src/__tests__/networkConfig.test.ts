import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  NETWORK_OPTIONS,
  DEFAULT_NETWORK,
  type SupportedNetwork,
} from "@/lib/networkConfig";
import { validateEnvironment, getStellarNetwork } from "@/lib/envValidation";

// ─── networkConfig ────────────────────────────────────────────────────────────

describe("networkConfig", () => {
  it("exports exactly two network options", () => {
    expect(NETWORK_OPTIONS).toHaveLength(2);
  });

  it("includes stellar-mainnet and stellar-testnet", () => {
    const values = NETWORK_OPTIONS.map((n) => n.value);
    expect(values).toContain("stellar-mainnet");
    expect(values).toContain("stellar-testnet");
  });

  it("each option has value, label, and description", () => {
    for (const option of NETWORK_OPTIONS) {
      expect(option.value).toBeTruthy();
      expect(option.label).toBeTruthy();
      expect(option.description).toBeTruthy();
    }
  });

  it("DEFAULT_NETWORK is stellar-testnet", () => {
    expect(DEFAULT_NETWORK).toBe<SupportedNetwork>("stellar-testnet");
  });
});

// ─── envValidation ────────────────────────────────────────────────────────────

describe("validateEnvironment", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:4000/api";
    process.env.NEXT_PUBLIC_STELLAR_NETWORK = "testnet";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("does not throw when all required vars are present and valid", () => {
    expect(() => validateEnvironment()).not.toThrow();
  });

  it("throws when NEXT_PUBLIC_API_BASE_URL is missing", () => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
    expect(() => validateEnvironment()).toThrow(/NEXT_PUBLIC_API_BASE_URL/);
  });

  it("throws when NEXT_PUBLIC_STELLAR_NETWORK is missing", () => {
    delete process.env.NEXT_PUBLIC_STELLAR_NETWORK;
    expect(() => validateEnvironment()).toThrow(/NEXT_PUBLIC_STELLAR_NETWORK/);
  });

  it("throws when NEXT_PUBLIC_STELLAR_NETWORK has an invalid value", () => {
    process.env.NEXT_PUBLIC_STELLAR_NETWORK = "polygon";
    expect(() => validateEnvironment()).toThrow(/Invalid NEXT_PUBLIC_STELLAR_NETWORK/);
  });

  it("accepts 'mainnet' as a valid network value", () => {
    process.env.NEXT_PUBLIC_STELLAR_NETWORK = "mainnet";
    expect(() => validateEnvironment()).not.toThrow();
  });
});

describe("getStellarNetwork", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns testnet when env is testnet", () => {
    process.env.NEXT_PUBLIC_STELLAR_NETWORK = "testnet";
    expect(getStellarNetwork()).toBe("testnet");
  });

  it("returns mainnet when env is mainnet", () => {
    process.env.NEXT_PUBLIC_STELLAR_NETWORK = "mainnet";
    expect(getStellarNetwork()).toBe("mainnet");
  });

  it("falls back to testnet for unknown values", () => {
    process.env.NEXT_PUBLIC_STELLAR_NETWORK = "unknown";
    expect(getStellarNetwork()).toBe("testnet");
  });
});

// ─── useWalletPersistence ─────────────────────────────────────────────────────

describe("useWalletPersistence (sessionStorage helpers)", () => {
  const STORAGE_KEY = "veritix_wallet";
  const mockWallet = { address: "GABC123", network: "testnet", walletType: "freighter" };

  beforeEach(() => sessionStorage.clear());

  it("reads null when nothing is stored", () => {
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("stores and retrieves wallet JSON", () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(mockWallet));
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY)!);
    expect(parsed).toEqual(mockWallet);
  });

  it("removes wallet on clear", () => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(mockWallet));
    sessionStorage.removeItem(STORAGE_KEY);
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
