import type { Meta, StoryObj } from "@storybook/react";
import { TicketPass, type AttendeeTicket } from "./TicketPass";

const meta: Meta<typeof TicketPass> = {
  title: "Tickets/TicketPass",
  component: TicketPass,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TicketPass>;

const baseTicket: AttendeeTicket = {
  id: "tkt_001",
  eventName: "Stellar Dev Summit 2026",
  eventDate: "2026-03-15",
  eventTime: "18:00",
  venue: "Eko Convention Centre, Lagos",
  ticketType: "VIP",
  ticketCode: "TKT-2026-VIP-001",
  walletStatus: "confirmed",
  transferState: "transferable",
  ownerAddress: "GAXSF2JVLIPYR6GF3SX5JMZ4SBLS3VIXYONNFE4IF675LDN2MXZ3FQBF",
  txHash: "a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890",
  network: "testnet",
};

export const Confirmed: Story = {
  args: {
    ticket: baseTicket,
    onTransfer: () => {},
  },
};

export const PendingWallet: Story = {
  args: {
    ticket: {
      ...baseTicket,
      walletStatus: "pending",
    },
  },
};

export const FailedWallet: Story = {
  args: {
    ticket: {
      ...baseTicket,
      walletStatus: "failed",
    },
  },
};

export const Transferred: Story = {
  args: {
    ticket: {
      ...baseTicket,
      transferState: "transferred",
    },
  },
};

export const NotTransferable: Story = {
  args: {
    ticket: {
      ...baseTicket,
      transferState: "none",
    },
  },
};
