import type { Event } from "@/types/event";

/**
 * Centralized mock event data for public and protected experiences.
 * Replace these exports with API calls in the next wave.
 */
export const mockEvents: Event[] = [
  {
    id: "summer-dance-festival-1",
    name: "Summer Dance Festival",
    image: "/images/events/detail.png",
    date: "June 15-17, 2024",
    dateEnd: "June 17, 2024",
    time: "6:00 PM - 2:00 AM",
    location: "Central Park, New York",
    venue: "Central Park",
    price: "0.08 ETH",
    priceInEth: 0.08,
    category: "festival",
    featured: true,
    attendees: 1200,
    description:
      "Get ready to move at the ultimate Summer Dance Festival of 2024 — a high-energy celebration of music, culture, and community under the open sky. This unforgettable two-day experience brings together DJs, dance crews, and music lovers from around the world for a weekend packed with rhythm, beats, and unforgettable vibes.",
    organizer: {
      name: "Rhythm Nation Collective",
      verified: true,
      description: "Bringing immersive music experiences to life",
    },
    ticketOptions: [
      {
        name: "General Admission",
        description: "Access to all stages and performances",
        benefits: ["Entry to food courts and chill-out lounges"],
        price: 0.08,
        remaining: 200,
        popular: true,
      },
      {
        name: "VIP Pass",
        description: "Everything in General Admission plus:",
        benefits: [
          "Priority entry",
          "Exclusive access to VIP dance pit and lounges",
          "Complimentary drink vouchers (x2)",
        ],
        price: 0.2,
        remaining: 70,
      },
      {
        name: "All-Access Experience",
        description: "Everything in VIP Pass plus:",
        benefits: [
          "Backstage Tour & meet-and-greet with performers",
          "Access to after-party events",
          "Festival merch bundle (shirt + wristband + tote)",
        ],
        price: 0.4,
        remaining: 30,
      },
    ],
  },
  {
    id: "electronic-music-night-1",
    name: "Electronic Music Night",
    image: "/images/events/detail2.png",
    date: "July 8, 2024",
    time: "9:00 PM - 4:00 AM",
    location: "Central Park, New York",
    venue: "Central Park",
    price: "0.05 ETH",
    priceInEth: 0.05,
    category: "music",
    featured: false,
    attendees: 800,
    description:
      "Experience the best electronic music under the stars. World-class DJs and incredible light shows await.",
    organizer: {
      name: "Beat Collective",
      verified: true,
      description: "Electronic music events since 2015",
    },
  },
  {
    id: "summer-dance-festival-2",
    name: "Summer Dance Festival",
    image: "/images/events/detail.png",
    date: "June 15-17, 2024",
    time: "6:00 PM - 2:00 AM",
    location: "Central Park, New York",
    venue: "Central Park",
    price: "0.08 ETH",
    priceInEth: 0.08,
    category: "festival",
    featured: false,
    attendees: 1200,
  },
  {
    id: "electronic-music-night-2",
    name: "Electronic Music Night",
    image: "/images/events/detail2.png",
    date: "July 8, 2024",
    time: "9:00 PM - 4:00 AM",
    location: "Central Park, New York",
    venue: "Central Park",
    price: "0.05 ETH",
    priceInEth: 0.05,
    category: "music",
    featured: false,
    attendees: 800,
  },
];

export const getEventsByCategory = (category: string): Event[] => {
  if (category === "all") return mockEvents;
  return mockEvents.filter((event) => event.category === category);
};

export const getFeaturedEvents = (): Event[] => {
  return mockEvents.filter((event) => event.featured);
};

export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find((event) => event.id === id);
};
