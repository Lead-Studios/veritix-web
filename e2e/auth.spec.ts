import { test, expect } from "@playwright/test";

test.describe("Auth", () => {
  test("Register then verify OTP then land on dashboard", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("First Name").fill("test");
    await page.getByLabel("Last Name").fill("user");
    await page.getByLabel("Email").fill(`test-user-${Date.now()}@test.com`);
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Sign up" }).click();
    await expect(page).toHaveURL(/verify-otp/);
    await page.getByLabel("One-Time Password").fill("123456");
    await page.getByRole("button", { name: "Verify" }).click();
    await expect(page).toHaveURL(/dashboard/);
  });

  test("Login with correct credentials reaches dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("test@test.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/dashboard/);
  });

  test("Login with wrong password shows an inline error message", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("test@test.com");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("Navigating to /dashboard without auth redirects to /login?next=/dashboard", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/login?next=/dashboard");
  });

  test("Login with ?next param redirects to the original destination after success", async ({
    page,
  }) => {
    await page.goto("/login?next=/dashboard");
    await page.getByLabel("Email").fill("test@test.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/dashboard/);
  });
});