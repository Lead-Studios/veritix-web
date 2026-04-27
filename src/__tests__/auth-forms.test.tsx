/**
 * Auth form tests – covers validation rules and submit-state behaviour
 * for the login and sign-up flows (issues #105 / FE-014).
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

// ── mocks ──────────────────────────────────────────────────────────────────
// next/link renders an <a> in tests
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

// react-toastify – we don't need real toasts in unit tests
vi.mock("react-toastify", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

// framer-motion – render children without animation overhead
vi.mock("framer-motion", () => {
  const React = require("react");
  const motion: Record<string, React.FC<React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }>> = {};
  ["div", "form", "h2", "p"].forEach((tag) => {
    motion[tag] = ({ children, ...rest }) => React.createElement(tag, rest, children);
  });
  return { motion, AnimatePresence: ({ children }: { children: React.ReactNode }) => children };
});

import LoginForm from "../components/auth/login-form";
import SignUpForm from "../components/auth/signup-form";
import ForgotPasswordForm from "../components/auth/forgot-password-form";

// ── helpers ────────────────────────────────────────────────────────────────
const user = userEvent.setup();

// ── LoginForm ──────────────────────────────────────────────────────────────
describe("LoginForm", () => {
  beforeEach(() => render(<LoginForm />));

  it("renders email and password fields and a submit button", () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitted empty", async () => {
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it("shows an error for an invalid email format", async () => {
    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it("shows an error when password is too short", async () => {
    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "abc");
    await user.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it("disables the submit button while the form is submitting", async () => {
    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    const btn = screen.getByRole("button", { name: /sign in/i });
    await user.click(btn);
    // Button becomes disabled immediately on submit
    await waitFor(() => expect(btn).toBeDisabled());
  });
});

// ── SignUpForm ─────────────────────────────────────────────────────────────
describe("SignUpForm", () => {
  beforeEach(() => render(<SignUpForm />));

  it("renders all required fields", () => {
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("shows required-field errors when submitted empty", async () => {
    await user.click(screen.getByRole("button", { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
  });

  it("enforces password complexity rules", async () => {
    await user.type(screen.getByLabelText(/password/i), "simple");
    await user.click(screen.getByRole("button", { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/uppercase/i)).toBeInTheDocument();
    });
  });

  it("enforces minimum username length", async () => {
    await user.type(screen.getByLabelText(/username/i), "ab");
    await user.click(screen.getByRole("button", { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
    });
  });
});

// ── ForgotPasswordForm ─────────────────────────────────────────────────────
describe("ForgotPasswordForm", () => {
  beforeEach(() => render(<ForgotPasswordForm />));

  it("renders an email field and submit button", () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send magic link/i })).toBeInTheDocument();
  });

  it("shows a validation error for an invalid email", async () => {
    await user.type(screen.getByLabelText(/email/i), "bad");
    await user.click(screen.getByRole("button", { name: /send magic link/i }));
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it("disables the submit button while submitting", async () => {
    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    const btn = screen.getByRole("button", { name: /send magic link/i });
    await user.click(btn);
    await waitFor(() => expect(btn).toBeDisabled());
  });
});
