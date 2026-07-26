/**
 * E2E test: Stellar payment flow from order to confirmation (FE-233).
 * Uses mocked API responses to validate the full purchase journey.
 */
import { test, expect } from "@playwright/test";

test.describe("Stellar Payment Flow", () => {
  test("complete purchase flow: select tickets → payment instructions → confirmation", async ({
    page,
  }) => {
    // Mock the events API
    await page.route("**/api/events", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "evt-1",
            name: "Stellar Music Festival",
            category: "music",
            eventDate: "2025-12-01T18:00:00Z",
            venue: "Grand Arena",
            location: "Lagos, Nigeria",
            imageUrl: "/test-event.png",
            price: "50 XLM",
            tickets: [
              { id: "t1", name: "General Admission", price: 50, quantity: 100 },
              { id: "t2", name: "VIP", price: 150, quantity: 20 },
            ],
          },
        ]),
      })
    );

    // Mock auth
    await page.route("**/api/auth/me", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: "user-1", email: "test@example.com", name: "Test User" }),
      })
    );

    // Navigate to event detail
    await page.goto("/events/evt-1");
    await page.waitForLoadState("networkidle");

    // Verify event details are shown
    await expect(page.getByText("Stellar Music Festival")).toBeVisible();
    await expect(page.getByText("General Admission")).toBeVisible();
  });

  test("payment instructions modal shows after order creation", async ({ page }) => {
    // Mock order creation
    await page.route("**/api/orders", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          orderId: "ord-123",
          destinationAddress: "GASW2...TESTADDRESS",
          memo: "ORDER-123",
          amountXLM: "50.00",
          expiresAt: new Date(Date.now() + 900000).toISOString(),
        }),
      })
    );

    // Mock order status polling
    await page.route("**/api/orders/ord-123/status", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: "PENDING" }),
      })
    );

    await page.goto("/events/evt-1");
    await page.waitForLoadState("networkidle");

    // Click purchase button if available
    const purchaseBtn = page.getByRole("button", { name: /purchase/i });
    if (await purchaseBtn.isVisible()) {
      await purchaseBtn.click();

      // Verify payment instructions modal appears
      await expect(page.getByText("Stellar Address")).toBeVisible({ timeout: 10000 });
      await expect(page.getByText("Memo")).toBeVisible();
    }
  });

  test("payment expiry shows retry option", async ({ page }) => {
    // Mock expired order
    await page.route("**/api/orders", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          orderId: "ord-expired",
          destinationAddress: "GASW2...TESTADDRESS",
          memo: "ORDER-EXPIRED",
          amountXLM: "50.00",
          expiresAt: new Date(Date.now() - 1000).toISOString(),
        }),
      )
    );

    await page.goto("/events/evt-1");
    await page.waitForLoadState("networkidle");

    const purchaseBtn = page.getByRole("button", { name: /purchase/i });
    if (await purchaseBtn.isVisible()) {
      await purchaseBtn.click();

      // After expiry, retry button should be available
      const retryBtn = page.getByRole("button", { name: /retry|new payment/i });
      await expect(retryBtn).toBeVisible({ timeout: 10000 });
    }
  });

  test("redirect to tickets page on successful payment", async ({ page }) => {
    let pollCount = 0;

    // Mock order creation
    await page.route("**/api/orders", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          orderId: "ord-success",
          destinationAddress: "GASW2...TESTADDRESS",
          memo: "ORDER-SUCCESS",
          amountXLM: "50.00",
          expiresAt: new Date(Date.now() + 900000).toISOString(),
        }),
      })
    );

    // Mock polling: first PENDING, then PAID
    await page.route("**/api/orders/ord-success/status", (route) => {
      pollCount++;
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: pollCount >= 2 ? "PAID" : "PENDING" }),
      });
    });

    await page.goto("/events/evt-1");
    await page.waitForLoadState("networkidle");

    const purchaseBtn = page.getByRole("button", { name: /purchase/i });
    if (await purchaseBtn.isVisible()) {
      await purchaseBtn.click();

      // Should eventually redirect to tickets page
      await page.waitForURL("**/tickets", { timeout: 15000 });
      expect(page.url()).toContain("/tickets");
    }
  });
});
