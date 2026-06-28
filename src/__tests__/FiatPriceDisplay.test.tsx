import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FiatPriceDisplay } from "@/components/tickets/FiatPriceDisplay";

describe("FiatPriceDisplay", () => {
  it("renders nothing while loading", () => {
    const { container } = render(<FiatPriceDisplay xlmAmount={100} />);
    expect(container.firstChild).toBeNull();
  });
});
