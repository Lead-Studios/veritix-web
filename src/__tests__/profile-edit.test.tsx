/**
 * Integration tests for the profile edit flow (FE-100 / issue #229).
 * Covers: field rendering, Zod validation errors, successful save toast,
 * and API error toast.
 */
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

// ── mocks ────────────────────────────────────────────────────────────────────

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("framer-motion", () => {
  const motion: Record<string, React.FC<React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }>> = {};
  ["div", "form", "h2", "p"].forEach((tag) => {
    motion[tag] = ({ children, ...rest }) => React.createElement(tag, rest, children);
  });
  return { motion, AnimatePresence: ({ children }: { children: React.ReactNode }) => children };
});

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

const mockGetProfile = vi.fn();
const mockUpdateProfile = vi.fn();

vi.mock("@/lib/profile", () => ({
  getProfile: (...args: unknown[]) => mockGetProfile(...args),
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
  changePassword: vi.fn(),
  getNotificationPreferences: vi.fn().mockResolvedValue({
    upcomingEvents: false,
    ticketConfirmations: false,
    platformUpdates: false,
  }),
  patchNotificationPreference: vi.fn(),
  deleteAccount: vi.fn(),
}));

import ProfileEditSection from "../components/profile/ProfileEditSection";
import { toast } from "react-toastify";

// ── helpers ───────────────────────────────────────────────────────────────────

function submitForm(container: HTMLElement) {
  const form = container.querySelector("form");
  if (form) fireEvent.submit(form);
}

// ── tests ─────────────────────────────────────────────────────────────────────

describe("ProfileEditSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetProfile.mockResolvedValue({ name: "Alice", email: "alice@example.com" });
  });

  it("renders name and email fields pre-filled from session data", async () => {
    render(<ProfileEditSection />);

    await waitFor(() => {
      expect((screen.getByLabelText(/name/i) as HTMLInputElement).value).toBe("Alice");
      expect((screen.getByLabelText(/email/i) as HTMLInputElement).value).toBe("alice@example.com");
    });
  });

  it("shows Zod validation errors when submitted with empty fields", async () => {
    mockGetProfile.mockResolvedValue({ name: "", email: "" });
    const { container } = render(<ProfileEditSection />);

    await waitFor(() => {
      expect((screen.getByLabelText(/name/i) as HTMLInputElement).value).toBe("");
    });

    submitForm(container);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it("shows Zod validation error for invalid email", async () => {
    const { container } = render(<ProfileEditSection />);

    await waitFor(() => screen.getByLabelText(/email/i));

    await userEvent.clear(screen.getByLabelText(/email/i));
    await userEvent.type(screen.getByLabelText(/email/i), "not-an-email");

    submitForm(container);

    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it("calls updateProfile and shows success toast on valid submit", async () => {
    mockUpdateProfile.mockResolvedValue(undefined);
    const { container } = render(<ProfileEditSection />);

    await waitFor(() => screen.getByLabelText(/name/i));

    submitForm(container);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        name: "Alice",
        email: "alice@example.com",
      });
      expect(toast.success).toHaveBeenCalledWith("Profile saved!");
    });
  });

  it("shows error toast when updateProfile API call fails", async () => {
    mockUpdateProfile.mockRejectedValue(new Error("Server error"));
    const { container } = render(<ProfileEditSection />);

    await waitFor(() => screen.getByLabelText(/name/i));

    submitForm(container);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Server error");
    });
  });
});
