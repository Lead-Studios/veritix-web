import { test, expect } from "@playwright/test";

test.describe("Dashboard Visual Regression Tests", () => {
  const viewports = [
    { width: 375, height: 667, name: "mobile-375px" },
    { width: 768, height: 1024, name: "tablet-768px" },
    { width: 1280, height: 800, name: "desktop-1280px" },
  ];

  for (const vp of viewports) {
    test(`dashboard layout visual check at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/dashboard");
      await expect(page).toHaveScreenshot(`dashboard-${vp.name}.png`, {
        maxDiffPixelRatio: 0.001,
      });
    });
  }
});
