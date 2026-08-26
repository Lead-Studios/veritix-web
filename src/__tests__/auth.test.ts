import { loginUser, logout, getToken } from "../lib/auth";
import { vi } from "vitest";

vi.mock("next-auth/react", () => ({
  getSession: vi.fn().mockResolvedValue(null),
}));

global.fetch = vi.fn();

describe("auth", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    (global.fetch as ReturnType<typeof vi.fn>).mockClear();
  });

  describe("loginUser", () => {
    it("should store the token in localStorage when rememberMe is true", async () => {
      const mockToken = "test_token";
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ token: mockToken, user: {} }),
      });

      await loginUser({
        email: "test@example.com",
        password: "password",
        rememberMe: true,
      });

      expect(localStorage.getItem("auth_token")).toBe(mockToken);
      expect(sessionStorage.getItem("auth_token")).toBeNull();
    });

    it("should store the token in sessionStorage when rememberMe is false", async () => {
      const mockToken = "test_token";
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: async () => ({ token: mockToken, user: {} }),
      });

      await loginUser({
        email: "test@example.com",
        password: "password",
        rememberMe: false,
      });

      expect(sessionStorage.getItem("auth_token")).toBe(mockToken);
      expect(localStorage.getItem("auth_token")).toBeNull();
    });
  });

  describe("getToken", () => {
    it("should return token from localStorage when only localStorage is set", () => {
      localStorage.setItem("auth_token", "local_token");
      expect(getToken()).toBe("local_token");
    });

    it("should return token from sessionStorage when only sessionStorage is set", () => {
      sessionStorage.setItem("auth_token", "session_token");
      expect(getToken()).toBe("session_token");
    });

    it("should prefer localStorage over sessionStorage when both are set", () => {
      localStorage.setItem("auth_token", "local_token");
      sessionStorage.setItem("auth_token", "session_token");
      expect(getToken()).toBe("local_token");
    });

    it("should return null when neither store has a token", () => {
      expect(getToken()).toBeNull();
    });
  });

  describe("logout", () => {
    it("should clear both localStorage and sessionStorage", () => {
      localStorage.setItem("auth_token", "test_token");
      sessionStorage.setItem("auth_token", "test_token");

      logout();

      expect(localStorage.getItem("auth_token")).toBeNull();
      expect(sessionStorage.getItem("auth_token")).toBeNull();
    });

    it("should clear localStorage even when only localStorage was written", () => {
      localStorage.setItem("auth_token", "local_only");
      logout();
      expect(localStorage.getItem("auth_token")).toBeNull();
      expect(sessionStorage.getItem("auth_token")).toBeNull();
    });

    it("should clear sessionStorage even when only sessionStorage was written", () => {
      sessionStorage.setItem("auth_token", "session_only");
      logout();
      expect(localStorage.getItem("auth_token")).toBeNull();
      expect(sessionStorage.getItem("auth_token")).toBeNull();
    });
  });
});