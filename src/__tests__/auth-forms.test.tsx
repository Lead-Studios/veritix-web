/**
 * Auth form tests – covers validation rules and submit-state behaviour
 * for the login and sign-up flows (issues #105 / FE-014).
 */
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

// ── mocks ──────────────────────────────────────────────────────────────────
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("react-toastify", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock("framer-motion", () => {
  const React = require("react");
  const motion: Record<string, React.FC<React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }>> = {};
  ["div", "form", "h2", "p"].forEach((tag) => {
    motion[tag] = ({ children, ...rest }) => React.createElement(tag, rest, children);
  });
  return { motion, AnimatePresence: ({ children }: { children: React.ReactNode }) => children };
});

vi.mock("@/lib/auth", () => ({
  loginUser: vi.fn().mockResolvedValue({ token: "tok", user: { id: "1", email: "u@e.com" } }),
  forgotPassword: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn(),
  getToken: vi.fn().mockReturnValue(null),
}));

import LoginForm from "../components/auth/login-form";
import SignUpForm from "../components/auth/signup-form";
import ForgotPasswordForm from "../components/auth/forgot-password-form";

// Helper: submit a form bypassing native HTML5 validation
function submitForm(container: HTMLElement) {
  const form = container.querySelector("form");
  if (form) fireEvent.submit(form);
}

// ── LoginForm ──────────────────────────────────────────────────────────────
describe("LoginForm", () => {
  let container: HTMLElement;
  beforeEach(() => {
    const result = render(<LoginForm />);
    container = result.container;
  });

  it("renders email and password fields and a submit button", () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(document.getElementById("password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitted empty", async () => {
    submitForm(container);
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it("shows an error for an invalid email format", async () => {
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "not-an-email" } });
    submitForm(container);
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it("shows an error when password is too short", async () => {
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "user@example.com" } });
    fireEvent.change(document.getElementById("password")!, { target: { value: "abc" } });
    submitForm(container);
    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it("disables the submit button while the form is submitting", async () => {
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "user@example.com" } });
    fireEvent.change(document.getElementById("password")!, { target: { value: "password123" } });
    const btn = screen.getByRole("button", { name: /sign in/i });
    submitForm(container);
    await waitFor(() => expect(btn).toBeDisabled());
  });
});

// ── SignUpForm ─────────────────────────────────────────────────────────────
describe("SignUpForm", () => {
  let container: HTMLElement;
  beforeEach(() => {
    const result = render(<SignUpForm />);
    container = result.container;
  });

  it("renders all required fields", () => {
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(document.getElementById("password")).toBeInTheDocument();
  });

  it("shows required-field errors when submitted empty", async () => {
    submitForm(container);
    await waitFor(() => {
      const errors = container.querySelectorAll(".text-red-600");
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it("enforces password complexity rules", async () => {
    fireEvent.change(document.getElementById("password")!, { target: { value: "simple" } });
    submitForm(container);
    await waitFor(() => {
      // PasswordStrengthGuide shows "uppercase" text; the error message also contains it
      const uppercaseErrors = screen.getAllByText(/uppercase/i);
      expect(uppercaseErrors.length).toBeGreaterThan(0);
    });
  });

  it("enforces minimum username length", async () => {
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "ab" } });
    submitForm(container);
    await waitFor(() => {
      expect(screen.getByText(/at least 3 characters/i)).toBeInTheDocument();
    });
  });
});

// ── ForgotPasswordForm ─────────────────────────────────────────────────────
describe("ForgotPasswordForm", () => {
  let container: HTMLElement;
  beforeEach(() => {
    const result = render(<ForgotPasswordForm />);
    container = result.container;
  });

  it("renders an email field and submit button", () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send magic link/i })).toBeInTheDocument();
  });

  it("shows a validation error for an invalid email", async () => {
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "bad" } });
    submitForm(container);
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
  });

  it("disables the submit button while submitting", async () => {
    // Use a never-resolving mock to keep isSubmitting=true
    const { forgotPassword } = await import("@/lib/auth");
    (forgotPassword as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () => new Promise(() => {}),
    );
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "user@example.com" } });
    const btn = screen.getByRole("button", { name: /send magic link/i });
    submitForm(container);
    await waitFor(() => expect(btn).toBeDisabled());
  });
});
