import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton, SkeletonCard, SkeletonList, SkeletonTable } from "./Skeleton";

const meta: Meta = {
  title: "Components/UI/Skeleton",
};

export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => <Skeleton className="h-4 w-32" />,
};

export const Card: Story = {
  render: () => <SkeletonCard className="max-w-sm" />,
};

export const List: Story = {
  render: () => <SkeletonList count={3} className="max-w-md" />,
};

export const Table: Story = {
  render: () => <SkeletonTable rows={4} />,
};
