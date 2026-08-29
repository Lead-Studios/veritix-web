import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SocialShareButtons from "@/components/events/SocialShareButtons";

describe("SocialShareButtons", () => {
  const defaultProps = {
    title: "Awesome Concert 2026",
    url: "https://veritix.io/events/evt-123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Twitter, WhatsApp, and Copy Link buttons with proper labels", () => {
    render(<SocialShareButtons {...defaultProps} />);

    expect(screen.getByRole("link", { name: "Share on Twitter" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Share on WhatsApp" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy link" })).toBeInTheDocument();
  });

  it("encodes title and URL correctly in Twitter/X share URL", () => {
    render(<SocialShareButtons {...defaultProps} />);

    const twitterLink = screen.getByRole("link", { name: "Share on Twitter" });
    expect(twitterLink).toHaveAttribute("href", expect.stringContaining("twitter.com/intent/tweet"));
    expect(twitterLink).toHaveAttribute("href", expect.stringContaining("Awesome%20Concert%202026"));
    expect(twitterLink).toHaveAttribute("href", expect.stringContaining("https%3A%2F%2Fveritix.io%2Fevents%2Fevt-123"));
    expect(twitterLink).toHaveAttribute("target", "_blank");
    expect(twitterLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("encodes title and URL correctly in WhatsApp share URL", () => {
    render(<SocialShareButtons {...defaultProps} />);

    const whatsappLink = screen.getByRole("link", { name: "Share on WhatsApp" });
    expect(whatsappLink).toHaveAttribute("href", expect.stringContaining("api.whatsapp.com/send"));
    expect(whatsappLink).toHaveAttribute("href", expect.stringContaining("Awesome%20Concert%202026"));
    expect(whatsappLink).toHaveAttribute("href", expect.stringContaining("https%3A%2F%2Fveritix.io%2Fevents%2Fevt-123"));
    expect(whatsappLink).toHaveAttribute("target", "_blank");
    expect(whatsappLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("copies URL to clipboard and shows Copied! indicator", async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<SocialShareButtons {...defaultProps} />);

    const copyBtn = screen.getByRole("button", { name: "Copy link" });
    await user.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith("https://veritix.io/events/evt-123");
    expect(screen.getByText("Copied!")).toBeInTheDocument();
  });
});
