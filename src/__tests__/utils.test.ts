import { isValidRedirect } from "../lib/utils";

describe("isValidRedirect", () => {
  it("should return true for valid relative paths", () => {
    expect(isValidRedirect("/dashboard")).toBe(true);
    expect(isValidRedirect("/events/123")).toBe(true);
    expect(isValidRedirect("/user/profile")).toBe(true);
  });

  it("should return false for invalid paths", () => {
    // Absolute URLs
    expect(isValidRedirect("https://example.com")).toBe(false);
    expect(isValidRedirect("http://example.com")).toBe(false);

    // Protocol-relative URLs
    expect(isValidRedirect("//example.com")).toBe(false);

    // Paths with ".."
    expect(isValidRedirect("/../path")).toBe(false);
    expect(isValidRedirect("/path/../other")).toBe(false);

    // Null or undefined
    expect(isValidRedirect(null)).toBe(false);
    expect(isValidRedirect(undefined)).toBe(false);

    // Empty string
    expect(isValidRedirect("")).toBe(false);

    // Not starting with '/'
    expect(isValidRedirect("dashboard")).toBe(false);
  });
});
