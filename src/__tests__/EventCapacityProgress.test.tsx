import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CapacityProgressBar } from "@/components/events/EventCapacityProgress";

describe("CapacityProgressBar", () => {
  it("calculates 75% sold correctly and displays urgency cues", () => {
    render(<CapacityProgressBar sold={750} total={1000} />);

    expect(screen.getByText("75% sold")).toBeInTheDocument();
    expect(screen.getByText("250 spots left")).toBeInTheDocument();

    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "75");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    expect(progressbar).toHaveAttribute("aria-label", "75% sold");
  });

  it("handles 100% capacity and displays 'Sold out'", () => {
    render(<CapacityProgressBar sold={500} total={500} />);

    expect(screen.getByText("100% sold")).toBeInTheDocument();
    expect(screen.getByText("Sold out")).toBeInTheDocument();

    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "100");
  });

  it("handles 0 sold gracefully", () => {
    render(<CapacityProgressBar sold={0} total={200} />);

    expect(screen.getByText("0% sold")).toBeInTheDocument();
    expect(screen.getByText("200 spots left")).toBeInTheDocument();

    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "0");
  });

  it("hides labels when showLabels is false", () => {
    render(<CapacityProgressBar sold={50} total={100} showLabels={false} />);

    expect(screen.queryByText("50% sold")).toBeNull();
    expect(screen.queryByText("50 spots left")).toBeNull();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
