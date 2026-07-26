import { loginUser, logout } from "../lib/auth";
mport { vi } from "vitest";

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

  describe("logout", () => {
    it("should clear both localStorage and sessionStorage", () => {
      localStorage.setItem("auth_token", "test_token");
      sessionStorage.setItem("auth_token", "test_token");

      logout();

      expect(localStorage.getItem("auth_token")).toBeNull();
      expect(sessionStorage.getItem("auth_token")).toBeNull();
    });
  });
});