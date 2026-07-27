import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
  args: {
    title: "No results found",
    description: "Try adjusting your filters to see more items.",
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const Search: Story = {
  args: { variant: "search", title: "No matches", description: "Try a different search term." },
};

export const Filter: Story = {
  args: { variant: "filter", title: "No items match your filters", description: "Clear a filter to broaden the results." },
};
