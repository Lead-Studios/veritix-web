import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NFTBadge } from "@/components/tickets/NFTBadge";

describe("NFTBadge", () => {
  it("renders NFT badge with explorer link", () => {
    render(<NFTBadge txHash="abc123" network="testnet" />);
    expect(screen.getByText("NFT Ticket")).toBeInTheDocument();
    expect(screen.getByText("View on Explorer")).toBeInTheDocument();
  });

  it("links to Stellar testnet explorer", () => {
    render(<NFTBadge txHash="abc123" network="testnet" />);
    const link = screen.getByText("View on Explorer");
    expect(link).toHaveAttribute("href", "https://stellar.expert/explorer/testnet/tx/abc123");
  });

  it("links to Stellar mainnet explorer", () => {
    render(<NFTBadge txHash="abc123" network="mainnet" />);
    const link = screen.getByText("View on Explorer");
    expect(link).toHaveAttribute("href", "https://stellar.expert/explorer/public/tx/abc123");
  });
});
