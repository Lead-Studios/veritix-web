import { 
  FaMusic, 
  FaCampground, 
  FaLaptopCode, 
  FaGamepad, 
  FaUtensils, 
  FaGlassCheers, 
  FaRunning, 
  FaPaintBrush, 
  FaFilm, 
  FaUsers, 
  FaGem, 
  FaUmbrellaBeach 
} from "react-icons/fa";

// Placeholder image for events
const placeholderImage = "/Images/placeholder.png";

export const categories = [
  {
    id: "cat-1",
    name: "CONCERT",
    description: "Live music performances",
    icon: FaMusic,
    imageUrl: "/Images/categories/concert.jpg",
    count: 235,
    events: ["e1", "e2"]
  },
  {
    id: "cat-2",
    name: "FESTIVALS",
    description: "Multi-day music & cultural events",
    icon: FaCampground,
    imageUrl: "/Images/categories/festivals.jpg",
    count: 119,
    events: ["e1"]
  },
  {
    id: "cat-3",
    name: "WORKSHOPS",
    description: "Educational & skill-building",
    icon: FaLaptopCode,
    imageUrl: "/Images/categories/workshops.jpg",
    count: 84,
    events: ["e2"]
  },
  {
    id: "cat-4",
    name: "GAMING",
    description: "Esports & gaming tournaments",
    icon: FaGamepad,
    imageUrl: "/Images/categories/gaming.jpg",
    count: 150,
    events: ["e1"]
  },
  {
    id: "cat-5",
    name: "DINING",
    description: "Food tastings & culinary events",
    icon: FaUtensils,
    imageUrl: "/Images/categories/dining.jpg",
    count: 78,
    events: ["e2"]
  },
  {
    id: "cat-6",
    name: "NIGHTLIFE",
    description: "Club events & parties",
    icon: FaGlassCheers,
    imageUrl: "/Images/categories/nightlife.jpg",
    count: 324,
    events: ["e1"]
  },
  {
    id: "cat-7",
    name: "FITNESS",
    description: "Workouts & wellness activities",
    icon: FaRunning,
    imageUrl: "/Images/categories/fitness.jpg",
    count: 94,
    events: ["e2"]
  },
  {
    id: "cat-8",
    name: "ARTS",
    description: "Exhibitions & creative events",
    icon: FaPaintBrush,
    imageUrl: "/Images/categories/arts.jpg",
    count: 174,
    events: ["e1"]
  },
  {
    id: "cat-9",
    name: "CINEMA",
    description: "Film screenings & premieres",
    icon: FaFilm,
    imageUrl: "/Images/categories/cinema.jpg",
    count: 67,
    events: ["e2"]
  },
  {
    id: "cat-10",
    name: "MEETUPS",
    description: "Networking & social gatherings",
    icon: FaUsers,
    imageUrl: "/Images/categories/meetups.jpg",
    count: 56,
    events: ["e1"]
  },
  {
    id: "cat-11",
    name: "EXCLUSIVE",
    description: "VIP & limited access events",
    icon: FaGem,
    imageUrl: "/Images/categories/exclusive.jpg",
    count: 36,
    events: ["e2"]
  },
  {
    id: "cat-12",
    name: "BEACH",
    description: "Seaside parties & activities",
    icon: FaUmbrellaBeach,
    imageUrl: "/Images/categories/beach.jpg",
    count: 122,
    events: ["e1"]
  }
]; 