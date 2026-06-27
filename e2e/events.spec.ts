import { test, expect } from "@playwright/test";

test.describe("Events", () => {
  test("Public events page loads and shows at least one event card", async ({
    page,
  }) => {
    await page.goto("/events");
    await expect(page.getByTestId("event-card")).toHaveCount(1);
  });

  test("Typing in the search box filters the visible cards", async ({
    page,
  }) => {
    await page.goto("/events");
    await page.getByPlaceholder("Search events, artists, or venues").fill("event");
    await expect(page.getByTestId("event-card")).toHaveCount(1);
    await page.getByPlaceholder("Search events, artists, or venues").fill("non-existent event");
    await expect(page.getByTestId("event-card")).toHaveCount(0);
  });

  test("Clicking a category filter updates the card list", async ({
    page,
  }) => {
    await page.goto("/events");
    await expect(page.getByTestId("event-card")).toHaveCount(1);
    await page.getByRole("button", { name: "Sports" }).click();
    await expect(page.getByTestId("event-card")).toHaveCount(0);
  });

  test("Clicking an event card navigates to the detail page", async ({
    page,
  }) => {
    await page.goto("/events");
    await page.getByTestId("event-card").click();
    await expect(page).toHaveURL(/events\/1/);
  });
});