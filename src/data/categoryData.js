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
    "id": "cat-1",
    "name": "CONCERT",
    "description": "Live music performances",
    "icon": FaMusic,
    "imageUrl": "/Images/categories/concert.jpg",
    "count": 235,
    "events": [
      {
        "id": "e1",
        "eventName": "Rock Night Live",
        "eventDate": "2025-06-12T20:00:00Z",
        "isFeatured": true,
        "isUpcoming": true,
        "location": "New York, NY",
        "imageUrl": placeholderImage
      },
      {
        "id": "e2",
        "eventName": "Indie Music Bash",
        "eventDate": "2025-07-01T18:00:00Z",
        "isFeatured": false,
        "isUpcoming": true,
        "location": "Los Angeles, CA",
        "imageUrl": placeholderImage
      }
    ]
  },
  {
    "id": "cat-2",
    "name": "FESTIVALS",
    "description": "Multi-day music & cultural events",
    "icon": FaCampground,
    "imageUrl": "/Images/categories/festivals.jpg",
    "count": 119,
    "events": [
      {
        "id": "e3",
        "eventName": "Summer Dance Festival",
        "eventDate": "2025-05-20T10:00:00Z",
        "isFeatured": true,
        "isUpcoming": true,
        "location": "Miami, FL",
        "imageUrl": placeholderImage
      },
      {
        "id": "e4",
        "eventName": "World Culture Expo",
        "eventDate": "2025-08-15T12:00:00Z",
        "isFeatured": false,
        "isUpcoming": true,
        "location": "Chicago, IL",
        "imageUrl": placeholderImage
      }
    ]
  },
  {
    "id": "cat-3",
    "name": "WORKSHOPS",
    "description": "Educational & skill-building",
    "icon": FaLaptopCode,
    "imageUrl": "/Images/categories/workshops.jpg",
    "count": 84,
    "events": [
      {
        "id": "e5",
        "eventName": "Web Development Bootcamp",
        "eventDate": "2025-06-01T09:00:00Z",
        "isFeatured": true,
        "isUpcoming": true,
        "location": "San Francisco, CA",
        "imageUrl": placeholderImage
      },
      {
        "id": "e6",
        "eventName": "Design Thinking Workshop",
        "eventDate": "2025-07-15T14:00:00Z",
        "isFeatured": false,
        "isUpcoming": true,
        "location": "Seattle, WA",
        "imageUrl": placeholderImage
      }
    ]
  },
  {
    "id": "cat-4",
    "name": "GAMING",
    "description": "Esports & gaming tournaments",
    "icon": FaGamepad,
    "imageUrl": "/Images/categories/gaming.jpg",
    "count": 150,
    "events": [
      {
        "id": "e7",
        "eventName": "Esports Championship",
        "eventDate": "2025-07-20T16:00:00Z",
        "isFeatured": true,
        "isUpcoming": true,
        "location": "Las Vegas, NV",
        "imageUrl": placeholderImage
      },
      {
        "id": "e8",
        "eventName": "Retro Gaming Night",
        "eventDate": "2025-06-25T19:00:00Z",
        "isFeatured": false,
        "isUpcoming": true,
        "location": "Portland, OR",
        "imageUrl": placeholderImage
      }
    ]
  },
  {
    "id": "cat-5",
    "name": "DINING",
    "description": "Food tastings & culinary events",
    "icon": FaUtensils,
    "imageUrl": "/Images/categories/dining.jpg",
    "count": 78,
    "events": [
      {
        "id": "e9",
        "eventName": "International Food Festival",
        "eventDate": "2025-08-10T11:00:00Z",
        "isFeatured": true,
        "isUpcoming": true,
        "location": "Boston, MA",
        "imageUrl": placeholderImage
      },
      {
        "id": "e10",
        "eventName": "Wine & Cheese Tasting",
        "eventDate": "2025-09-05T18:00:00Z",
        "isFeatured": false,
        "isUpcoming": true,
        "location": "Napa Valley, CA",
        "imageUrl": placeholderImage
      }
    ]
  },
  {
    "id": "cat-6",
    "name": "NIGHTLIFE",
    "description": "Club events & parties",
    "icon": FaGlassCheers,
    "imageUrl": "/Images/categories/nightlife.jpg",
    "count": 324,
    "events": [
      {
        "id": "e11",
        "eventName": "Premium Nightclub Party",
        "eventDate": "2025-06-28T22:00:00Z",
        "isFeatured": true,
        "isUpcoming": true,
        "location": "Miami, FL",
        "imageUrl": placeholderImage
      },
      {
        "id": "e12",
        "eventName": "Rooftop DJ Night",
        "eventDate": "2025-07-12T21:00:00Z",
        "isFeatured": false,
        "isUpcoming": true,
        "location": "New York, NY",
        "imageUrl": placeholderImage
      }
    ]
  },
  {
    "id": "cat-7",
    "name": "FITNESS",
    "description": "Workouts & wellness activities",
    "icon": FaRunning,
    "imageUrl": "/Images/categories/fitness.jpg",
    "count": 94,
    "events": [
      {
        "id": "e13",
        "eventName": "Marathon 2025",
        "eventDate": "2025-05-15T06:00:00Z",
        "isFeatured": true,
        "isUpcoming": true,
        "location": "Chicago, IL",
        "imageUrl": placeholderImage
      },
      {
        "id": "e14",
        "eventName": "Yoga & Meditation Retreat",
        "eventDate": "2025-08-20T08:00:00Z",
        "isFeatured": false,
        "isUpcoming": true,
        "location": "Boulder, CO",
        "imageUrl": placeholderImage
      }
    ]
  },
  {
    "id": "cat-8",
    "name": "ARTS",
    "description": "Exhibitions & creative events",
    "icon": FaPaintBrush,
    "imageUrl": "/Images/categories/arts.jpg",
    "count": 174,
    "events": [
      {
        "id": "e15",
        "eventName": "Modern Art Exhibition",
        "eventDate": "2025-07-05T10:00:00Z",
        "isFeatured": true,
        "isUpcoming": true,
        "location": "San Francisco, CA",
        "imageUrl": placeholderImage
      },
      {
        "id": "e16",
        "eventName": "Sculpture Festival",
        "eventDate": "2025-09-10T11:00:00Z",
        "isFeatured": false,
        "isUpcoming": true,
        "location": "Austin, TX",
        "imageUrl": placeholderImage
      }
    ]
  },
  {
    "id": "cat-9",
    "name": "CINEMA",
    "description": "Film screenings & premieres",
    "icon": FaFilm,
    "imageUrl": "/Images/categories/cinema.jpg",
    "count": 67,
    "events": [
      {
        "id": "e17",
        "eventName": "Independent Film Festival",
        "eventDate": "2025-08-15T17:00:00Z",
        "isFeatured": true,
        "isUpcoming": true,
        "location": "Sundance, UT",
        "imageUrl": placeholderImage
      },
      {
        "id": "e18",
        "eventName": "Movie Under The Stars",
        "eventDate": "2025-07-22T20:00:00Z",
        "isFeatured": false,
        "isUpcoming": true,
        "location": "Los Angeles, CA",
        "imageUrl": placeholderImage
      }
    ]
  },
  {
    "id": "cat-10",
    "name": "MEETUPS",
    "description": "Networking & social gatherings",
    "icon": FaUsers,
    "imageUrl": "/Images/categories/meetups.jpg",
    "count": 56,
    "events": [
      {
        "id": "e19",
        "eventName": "Tech Industry Networking",
        "eventDate": "2025-06-18T18:00:00Z",
        "isFeatured": true,
        "isUpcoming": true,
        "location": "Seattle, WA",
        "imageUrl": placeholderImage
      },
      {
        "id": "e20",
        "eventName": "Startup Pitch Night",
        "eventDate": "2025-08-05T19:00:00Z",
        "isFeatured": false,
        "isUpcoming": true,
        "location": "Austin, TX",
        "imageUrl": placeholderImage
      }
    ]
  },
  {
    "id": "cat-11",
    "name": "EXCLUSIVE",
    "description": "VIP & limited access events",
    "icon": FaGem,
    "imageUrl": "/Images/categories/exclusive.jpg",
    "count": 36,
    "events": [
      {
        "id": "e21",
        "eventName": "Celebrity Gala Dinner",
        "eventDate": "2025-09-20T19:00:00Z",
        "isFeatured": true,
        "isUpcoming": true,
        "location": "Beverly Hills, CA",
        "imageUrl": placeholderImage
      },
      {
        "id": "e22",
        "eventName": "Private Wine Tasting",
        "eventDate": "2025-08-30T16:00:00Z",
        "isFeatured": false,
        "isUpcoming": true,
        "location": "Napa Valley, CA",
        "imageUrl": placeholderImage
      }
    ]
  },
  {
    "id": "cat-12",
    "name": "BEACH",
    "description": "Seaside parties & activities",
    "icon": FaUmbrellaBeach,
    "imageUrl": "/Images/categories/beach.jpg",
    "count": 122,
    "events": [
      {
        "id": "e23",
        "eventName": "Beach Volleyball Tournament",
        "eventDate": "2025-07-10T09:00:00Z",
        "isFeatured": true,
        "isUpcoming": true,
        "location": "Miami Beach, FL",
        "imageUrl": placeholderImage
      },
      {
        "id": "e24",
        "eventName": "Sunset Beach Party",
        "eventDate": "2025-08-22T18:00:00Z",
        "isFeatured": false,
        "isUpcoming": true,
        "location": "Santa Monica, CA",
        "imageUrl": placeholderImage
      }
    ]
  }
]; 