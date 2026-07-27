import type { Meta, StoryObj } from "@storybook/react";
import EventCard from "./EventCard";
import type { Event } from "@/types/event";

const sampleEvent: Event = {
  id: "evt-1",
  name: "Neon Nights",
  description: "An immersive live concert experience.",
  eventDate: "2026-09-18T19:00:00.000Z",
  location: "Lagos",
  venue: "The Grand Hall",
  city: "Lagos",
  category: "music",
  status: "PUBLISHED",
  imageUrl: "/images/events/event.png",
  organizerId: "org-1",
  organizer: { name: "Sunset Records", verified: true },
  price: "$45",
  featured: true,
};

const meta: Meta<typeof EventCard> = {
  title: "Components/Events/EventCard",
  component: EventCard,
  args: { event: sampleEvent },
};

export default meta;
type Story = StoryObj<typeof EventCard>;

export const Default: Story = {};

export const WithoutImage: Story = {
  args: {
    event: { ...sampleEvent, imageUrl: undefined },
  },
};

export const SoldOut: Story = {
  args: {
    event: { ...sampleEvent, price: "Sold out" },
  },
};
