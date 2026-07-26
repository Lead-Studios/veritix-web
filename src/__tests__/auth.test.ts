import { logout } from "../lib/auth";

describe("auth", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
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
