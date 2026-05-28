import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";

// ─── EmptyState ───────────────────────────────────────────────────────────────

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="No results" description="Try a different search." />);
    expect(screen.getByText("No results")).toBeInTheDocument();
    expect(screen.getByText("Try a different search.")).toBeInTheDocument();
  });

  it("does not render a CTA button when action prop is omitted", () => {
    render(<EmptyState title="Empty" description="Nothing here." />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders CTA button when action prop is provided", () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        title="Empty"
        description="Nothing here."
        action={{ label: "Add item", onClick }}
      />
    );
    expect(screen.getByRole("button", { name: /add item/i })).toBeInTheDocument();
  });

  it("calls action.onClick when CTA button is clicked", async () => {
    const onClick = vi.fn();
    render(
      <EmptyState
        title="Empty"
        description="Nothing here."
        action={{ label: "Add item", onClick }}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /add item/i }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("matches snapshot (default variant)", () => {
    const { container } = render(
      <EmptyState title="No events" description="Create your first event." />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("matches snapshot (search variant)", () => {
    const { container } = render(
      <EmptyState title="No results" description="Try again." variant="search" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

// ─── ErrorState ───────────────────────────────────────────────────────────────

describe("ErrorState", () => {
  it("renders message", () => {
    render(<ErrorState message="Something broke." />);
    expect(screen.getByText("Something broke.")).toBeInTheDocument();
  });

  it("uses default title when title prop is omitted", () => {
    render(<ErrorState message="Oops." />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders custom title when provided", () => {
    render(<ErrorState title="Custom Error" message="Details here." />);
    expect(screen.getByText("Custom Error")).toBeInTheDocument();
  });

  it("fires retry callback when action button is clicked", async () => {
    const onRetry = vi.fn();
    render(
      <ErrorState
        message="Failed to load."
        action={{ label: "Retry", onClick: onRetry }}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("renders secondary action button when provided", () => {
    render(
      <ErrorState
        message="Error."
        secondaryAction={{ label: "Go home", onClick: vi.fn() }}
      />
    );
    expect(screen.getByRole("button", { name: /go home/i })).toBeInTheDocument();
  });

  it("matches snapshot (default error type)", () => {
    const { container } = render(<ErrorState message="Something went wrong." />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("matches snapshot (notFound type)", () => {
    const { container } = render(
      <ErrorState type="notFound" message="Page not found." />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

// ─── LoadingState ─────────────────────────────────────────────────────────────

describe("LoadingState", () => {
  it("renders spinner variant with default text", () => {
    render(<LoadingState />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders custom text in spinner variant", () => {
    render(<LoadingState text="Fetching data..." />);
    expect(screen.getByText("Fetching data...")).toBeInTheDocument();
  });

  it("renders skeleton variant without spinner text", () => {
    render(<LoadingState variant="skeleton" />);
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("renders card variant with correct number of skeleton cards", () => {
    const { container } = render(<LoadingState variant="card" count={4} />);
    // Each card has animate-pulse class
    const cards = container.querySelectorAll(".animate-pulse");
    expect(cards.length).toBe(4);
  });

  it("renders list variant with correct number of skeleton rows", () => {
    const { container } = render(<LoadingState variant="list" count={2} />);
    const rows = container.querySelectorAll(".animate-pulse");
    expect(rows.length).toBe(2);
  });

  it("matches snapshot (spinner)", () => {
    const { container } = render(<LoadingState />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("matches snapshot (skeleton)", () => {
    const { container } = render(<LoadingState variant="skeleton" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
