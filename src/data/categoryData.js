import {
  FaMusic,
  FaFootballBall,
  FaTheaterMasks,
  FaLaugh,
  FaCalendarAlt,
  FaMicrophone,
  FaUsers,
  FaGem,
  FaUmbrellaBeach,
} from "react-icons/fa";

export const categories = [
  {
    id: "cat-1",
    name: "CONCERT",
    description: "Live music performances",
    icon: FaMusic,
    imageUrl: "/Images/categories/concert.jpg",
    count: 235,
    events: ["e1", "e2"],
  },
  {
    id: "cat-2",
    name: "SPORTS",
    description: "Athletic competitions and games",
    icon: FaFootballBall,
    imageUrl: "/Images/categories/sports.jpg",
    count: 189,
    events: [],
  },
  {
    id: "cat-3",
    name: "THEATER",
    description: "Dramatic performances and plays",
    icon: FaTheaterMasks,
    imageUrl: "/Images/categories/theater.jpg",
    count: 156,
    events: [],
  },
  {
    id: "cat-4",
    name: "COMEDY",
    description: "Stand-up and comedy shows",
    icon: FaLaugh,
    imageUrl: "/Images/categories/comedy.jpg",
    count: 98,
    events: [],
  },
  {
    id: "cat-5",
    name: "FESTIVALS",
    description: "Multi-day cultural celebrations",
    icon: FaCalendarAlt,
    imageUrl: "/Images/categories/festivals.jpg",
    count: 67,
    events: [],
  },
  {
    id: "cat-6",
    name: "CONFERENCES",
    description: "Professional and educational events",
    icon: FaMicrophone,
    imageUrl: "/Images/categories/conferences.jpg",
    count: 134,
    events: [],
  },
  {
    id: "cat-7",
    name: "NETWORKING",
    description: "Professional networking events",
    icon: FaUsers,
    imageUrl: "/Images/categories/networking.jpg",
    count: 89,
    events: [],
  },
  {
    id: "cat-8",
    name: "EXHIBITIONS",
    description: "Art and cultural exhibitions",
    icon: FaGem,
    imageUrl: "/Images/categories/exhibitions.jpg",
    count: 76,
    events: [],
  },
  {
    id: "cat-9",
    name: "OUTDOOR",
    description: "Outdoor activities and adventures",
    icon: FaUmbrellaBeach,
    imageUrl: "/Images/categories/outdoor.jpg",
    count: 112,
    events: [],
  },
];

// Helper function to get category by ID
export const getCategoryById = (id) => {
  return categories.find((category) => category.id === id);
};

// Helper function to get categories with events
export const getCategoriesWithEvents = () => {
  return categories.filter(
    (category) => category.events && category.events.length > 0
  );
};

// Helper function to get total event count
export const getTotalEventCount = () => {
  return categories.reduce((total, category) => total + category.count, 0);
};
