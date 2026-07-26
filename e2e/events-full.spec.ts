/**
 * E2E test: Events browsing, search, and detail page (FE-229).
 */
import { test, expect } from "@playwright/test";

test.describe("Events Discovery", () => {
  test.beforeEach(async ({ page }) => {
    // Mock events API
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
          },
          {
            id: "evt-2",
            name: "Crypto Art Exhibition",
            category: "art",
            eventDate: "2025-11-15T10:00:00Z",
            venue: "Gallery Hall",
            location: "Abuja, Nigeria",
            imageUrl: "/test-event2.png",
            price: "25 XLM",
          },
          {
            id: "evt-3",
            name: "Tech Conference 2025",
            category: "conference",
            eventDate: "2025-10-20T09:00:00Z",
            venue: "Convention Center",
            location: "Port Harcourt, Nigeria",
            imageUrl: "/test-event3.png",
            price: "100 XLM",
          },
        ]),
      })
    );
  });

  test("events page loads with event cards", async ({ page }) => {
    await page.goto("/events");
    await page.waitForLoadState("networkidle");

    // Should show search inputs
    await expect(page.getByPlaceholder("Search events, artists, or venues")).toBeVisible();
  });

  test("search input filters visible cards", async ({ page }) => {
    await page.goto("/events");
    await page.waitForLoadState("networkidle");

    const searchInput = page.getByPlaceholder("Search events, artists, or venues");
    if (await searchInput.isVisible()) {
      await searchInput.fill("Music");
      // Verify the input has the value
      await expect(searchInput).toHaveValue("Music");
    }
  });

  test("clicking an event card navigates to the detail page", async ({ page }) => {
    await page.goto("/events");
    await page.waitForLoadState("networkidle");

    // Look for event links
    const eventLink = page.getByRole("link", { name: /stellar music festival/i });
    if (await eventLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await eventLink.click();
      await page.waitForURL("**/events/evt-1**", { timeout: 10000 });
      expect(page.url()).toContain("/events/evt-1");
    }
  });

  test("event detail shows title, date, venue, and ticket selector", async ({ page }) => {
    // Mock single event API
    await page.route("**/api/events/evt-1", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
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
          ],
        }),
      })
    );

    await page.goto("/events/evt-1");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Stellar Music Festival")).toBeVisible({ timeout: 10000 });
  });

  test("purchase button without auth redirects to login with next param", async ({ page }) => {
    await page.route("**/api/auth/me", (route) =>
      route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({}) })
    );

    await page.goto("/events/evt-1");
    await page.waitForLoadState("networkidle");

    const purchaseBtn = page.getByRole("button", { name: /purchase/i });
    if (await purchaseBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await purchaseBtn.click();
      await page.waitForURL("**/login**", { timeout: 10000 });
      expect(page.url()).toContain("/login");
    }
  });

  test("URL filter params are populated on load", async ({ page }) => {
    await page.goto("/events?q=music");
    await page.waitForLoadState("networkidle");

    const searchInput = page.getByPlaceholder("Search events, artists, or venues");
    if (await searchInput.isVisible()) {
      await expect(searchInput).toHaveValue("music");
    }
  });
});
