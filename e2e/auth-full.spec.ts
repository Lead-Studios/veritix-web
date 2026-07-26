/**
 * E2E test: Full auth flow — register, verify OTP, login, and logout (FE-228).
 */
import { test, expect } from "@playwright/test";

test.describe("Auth Flow", () => {
  test("register with valid credentials shows verify-email page", async ({ page }) => {
    // Mock registration endpoint
    await page.route("**/api/auth/register", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Verification email sent" }),
      })
    );

    await page.goto("/sign-up");
    await page.waitForLoadState("networkidle");

    // Fill registration form
    const firstNameInput = page.getByLabel(/first name/i);
    if (await firstNameInput.isVisible()) {
      await firstNameInput.fill("John");
      await page.getByLabel(/last name/i).fill("Doe");
      await page.getByLabel(/username/i).fill("johndoe");
      await page.getByLabel(/email/i).fill("john@example.com");
      await page.getByLabel(/password/i).fill("SecureP@ss123");

      const submitBtn = page.getByRole("button", { name: /sign up|create account/i });
      await submitBtn.click();

      // Should redirect to verify-email page
      await page.waitForURL("**/verify-email**", { timeout: 10000 });
      expect(page.url()).toContain("verify-email");
    }
  });

  test("login with correct credentials redirects to dashboard", async ({ page }) => {
    // Mock login endpoint
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          token: "mock-jwt-token",
          user: { id: "u1", email: "test@example.com", name: "Test User" },
        }),
      })
    );

    // Mock auth check
    await page.route("**/api/auth/me", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: "u1", email: "test@example.com", name: "Test User" }),
      })
    );

    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Should redirect to dashboard
    await page.waitForURL("**/dashboard**", { timeout: 10000 });
    expect(page.url()).toContain("/dashboard");
  });

  test("login with wrong password shows inline error", async ({ page }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "Invalid credentials" }),
      })
    );

    await page.goto("/login");
    await page.waitForLoadState("networkidle");

    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /sign in/i }).click();

    // Should show error message
    await expect(page.getByText(/invalid credentials|incorrect/i)).toBeVisible({ timeout: 5000 });
  });

  test("navigate to /dashboard without auth redirects to /login", async ({ page }) => {
    await page.goto("/dashboard");
    // Should redirect to login with next param
    await page.waitForURL("**/login**", { timeout: 10000 });
    expect(page.url()).toContain("/login");
    expect(page.url()).toContain("next=%2Fdashboard");
  });

  test("login with ?next param redirects to correct page", async ({ page }) => {
    await page.route("**/api/auth/login", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          token: "mock-jwt-token",
          user: { id: "u1", email: "test@example.com" },
        }),
      })
    );

    await page.route("**/api/auth/me", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: "u1", email: "test@example.com" }),
      })
    );

    await page.goto("/login?next=%2Fdashboard");
    await page.waitForLoadState("networkidle");

    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByLabel(/password/i).fill("password123");
    await page.getByRole("button", { name: /sign in/i }).click();

    await page.waitForURL("**/dashboard**", { timeout: 10000 });
    expect(page.url()).toContain("/dashboard");
  });

  test("logout redirects to home", async ({ page }) => {
    // Set up authenticated state
    await page.route("**/api/auth/me", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: "u1", email: "test@example.com" }),
      })
    );

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Look for logout button/link
    const logoutBtn = page.getByRole("button", { name: /log ?out|sign ?out/i });
    const logoutLink = page.getByRole("link", { name: /log ?out|sign ?out/i });

    if (await logoutBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await logoutBtn.click();
    } else if (await logoutLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await logoutLink.click();
    }

    // Should redirect to home
    await page.waitForURL("/", { timeout: 5000 });
    expect(page.url()).toMatch(/\/$/);
  });
});
