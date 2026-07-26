import { formatCurrency } from "../src/lib/currencyFormat";

describe("formatCurrency", () => {
  it("should format an integer value correctly", () => {
    expect(formatCurrency(1000)).toBe("₦ 1,000");
  });

  it("should format a decimal value correctly", () => {
    expect(formatCurrency(1234.56)).toBe("₦ 1,235");
  });

  it("should format zero correctly", () => {
    expect(formatCurrency(0)).toBe("₦ 0");
  });

  it("should format a large number correctly", () => {
    expect(formatCurrency(1000000)).toBe("₦ 1,000,000");
  });
});
