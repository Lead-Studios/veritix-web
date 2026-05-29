import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("landing page should load successfully", async ({ page }) => {
    await page.goto("/");
    // Check if header title "VeriTix" is visible
    await expect(page.getByLabel("VeriTix home")).toBeVisible();
    // Check if the hero search bar inputs are present
    await expect(page.getByPlaceholder("Search events, artists...")).toBeVisible();
  });

  test("login page should load successfully", async ({ page }) => {
    await page.goto("/login");
    // Check if "Welcome Back" header is visible
    await expect(page.getByRole("heading", { name: "Welcome Back" })).toBeVisible();
    // Check if email input is present
    await expect(page.getByLabel("Email")).toBeVisible();
  });

  test("event discovery page should load successfully", async ({ page }) => {
    await page.goto("/events");
    // Check if the search inputs are present
    await expect(page.getByPlaceholder("Search events, artists, or venues")).toBeVisible();
    await expect(page.getByPlaceholder("Location")).toBeVisible();
    await expect(page.getByPlaceholder("Date")).toBeVisible();
  });
});
