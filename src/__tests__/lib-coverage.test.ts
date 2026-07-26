import { describe, it, expect } from "vitest";
import { cn } from "../lib/cn";
import { formatCurrency } from "../lib/currencyFormat";
import { buildLocationString } from "../lib/locationFields";
import { getInventoryStatusLabel } from "../lib/inventoryStatus";
import { CONTACT_CONFIG } from "../lib/contactConfig";
import { getGalleryLimitMessage, MAX_GALLERY_IMAGES } from "../lib/galleryLimit";

describe("src/lib utilities coverage", () => {
  it("tests cn helper", () => {
    expect(cn("bg-red-500", undefined, "text-white")).toBe("bg-red-500 text-white");
  });

  it("tests currencyFormat helper", () => {
    expect(formatCurrency(100)).toContain("100");
  });

  it("tests locationFields helper", () => {
    expect(buildLocationString("123 Main St", "City", "State")).toBe("123 Main St, City, State");
    expect(buildLocationString("", "", "")).toBe("");
  });

  it("tests inventoryStatus helper", () => {
    expect(getInventoryStatusLabel(0)).toBe("Sold Out");
    expect(getInventoryStatusLabel(5)).toBe("Low Stock");
    expect(getInventoryStatusLabel(50)).toBe("In Stock");
  });

  it("tests contactConfig", () => {
    expect(CONTACT_CONFIG.supportEmail).toBeDefined();
  });

  it("tests galleryLimit helper", () => {
    expect(MAX_GALLERY_IMAGES).toBeGreaterThan(0);
    expect(getGalleryLimitMessage(MAX_GALLERY_IMAGES)).toContain("Maximum");
  });
});
