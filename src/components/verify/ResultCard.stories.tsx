import type { Meta, StoryObj } from "@storybook/react";
import ResultCard from "./ResultCard";

const meta: Meta<typeof ResultCard> = {
  title: "Components/Verify/ResultCard",
  component: ResultCard,
  args: { state: "verified", title: "Ticket confirmed", description: "The ticket is valid and ready to scan." },
};

export default meta;
type Story = StoryObj<typeof ResultCard>;

export const Verified: Story = { args: { state: "verified" } };
export const Pending: Story = { args: { state: "pending" } };
export const Expired: Story = { args: { state: "expired" } };
export const Invalid: Story = { args: { state: "invalid" } };
export const Duplicate: Story = { args: { state: "duplicate" } };
export const Cancelled: Story = { args: { state: "cancelled" } };
export const Scanned: Story = { args: { state: "scanned" } };
