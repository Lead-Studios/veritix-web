import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import NewsletterForm from "../components/NewsletterForm";

describe("NewsletterForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders email input and submit button", () => {
    render(<NewsletterForm />);
    expect(screen.getByPlaceholderText(/Enter your email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Subscribe/i })).toBeInTheDocument();
  });

  it("shows validation error on invalid email", async () => {
    render(<NewsletterForm />);
    const input = screen.getByPlaceholderText(/Enter your email address/i);
    const button = screen.getByRole("button", { name: /Subscribe/i });

    fireEvent.change(input, { target: { value: "invalid-email" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it("shows success confirmation on valid email submission", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<NewsletterForm />);
    const input = screen.getByPlaceholderText(/Enter your email address/i);
    const button = screen.getByRole("button", { name: /Subscribe/i });

    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/You're subscribed! Check your inbox for a confirmation./i)).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/newsletter"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "test@example.com" }),
      })
    );
  });

  it("shows server error message on API failure", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: "This email is already subscribed" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<NewsletterForm />);
    const input = screen.getByPlaceholderText(/Enter your email address/i);
    const button = screen.getByRole("button", { name: /Subscribe/i });

    fireEvent.change(input, { target: { value: "duplicate@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/This email is already subscribed/i)).toBeInTheDocument();
    });
  });
});
