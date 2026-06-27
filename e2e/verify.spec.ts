import { test, expect } from "@playwright/test";

test.describe("Verify", () => {
  test("A non-staff user accessing /verify is redirected to /dashboard", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("test@test.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Login" }).click();
    await page.goto("/verify");
    await expect(page).toHaveURL(/dashboard/);
  });

  test("A staff user can reach the verify page", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("staff@test.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Login" }).click();
    await page.goto("/verify");
    await expect(page).toHaveURL(/verify/);
  });

  test("Entering an invalid code shows the red failure result card", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("staff@test.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Login" }).click();
    await page.goto("/verify");
    await page.getByPlaceholder("Enter ticket code...").fill("invalid-code");
    await page.getByRole("button", { name: "Verify" }).click();
    await expect(page.getByTestId("failure-card")).toBeVisible();
  });

  test("Entering a valid code shows the green success result card", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("staff@test.com");
    await page.getByLabel("Password").fill("password");
    await page.getByRole("button", { name: "Login" }).click();
    await page.goto("/verify");
    await page.getByPlaceholder("Enter ticket code...").fill("valid-code");
    await page.getByRole("button", { name: "Verify" }).click();
    await expect(page.getByTestId("success-card")).toBeVisible();
  });
});