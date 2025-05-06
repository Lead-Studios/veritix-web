// src/data/events.js

export const eventsById = {
  'e1': {
    id: 'e1',
    eventName: 'Rock Night Live',
    eventDate: '2025-06-12T20:00:00Z',
    location: 'New York, NY',
    price: '0.08 ETH',
    imageUrl: '/Images/placeholder.png',
    description: 'Join us for an unforgettable night of rock music featuring top artists from around the world. Experience the energy of live performances in the heart of New York City.',
    organizer: 'Music Events Inc.',
    category: 'CONCERT',
    ticketsAvailable: 1000,
    isTrending: true,
    about: {
      intro: "Get ready to move at the ultimate Summer Dance Festival of 2024 — a high-energy celebration of music, culture, and community under the open sky. This unforgettable two-day experience brings together top DJs, dance crews, and music lovers from around the world for a weekend packed with rhythm, beats, and unforgettable vibes.",
      expectations: [
        "Live performances from internationally acclaimed DJs and artists",
        "Dance battles, workshops, and flash mobs",
        "Themed stages from house, EDM, Afrobeat, and more",
        "Food trucks, art installations, and wellness lounges",
        "After-dark glow parties and sunrise dance sessions"
      ],
      outro: "Whether you're a hardcore raver, casual music fan, or just looking to soak up the sun with good vibes, the Summer Dance Festival is your ticket to a weekend of freedom, connection, and movement. Let's dance the summer away!"
    },
    schedule: [
      { day: "Day 1", date: "2024-07-15", events: [
        { time: "2:00 PM", activity: "Gates Open & Welcome Set" },
        { time: "3:00 PM", activity: "DJ Luna (Main Stage)" },
        { time: "5:00 PM", activity: "Dance Workshop: Hip-Hop" },
        { time: "7:00 PM", activity: "Sunset Set: DJ Nova" },
      ]},
      { day: "Day 2", date: "2024-07-16", events: [
        { time: "10:00 AM", activity: "Yoga & Wellness Lounge" },
        { time: "12:00 PM", activity: "Brunch Beats: DJ Echo" },
        { time: "2:00 PM", activity: "Dance Battle Finals" },
        { time: "4:00 PM", activity: "Live Band: The Groovers" },
        { time: "6:00 PM", activity: "Closing Set: DJ Nova & Friends" }
      ]}
    ],
    performers: [
      { name: "DJ Luna", role: "Main Stage", image: "/Images/performers/placeholder.png" },
      { name: "DJ Nova", role: "Sunset Set", image: "/Images/performers/placeholder.png" },
      { name: "The Groovers", role: "Live Band", image: "/Images/performers/placeholder.png" }
    ]
  },
  'e2': {
    id: 'e2',
    eventName: 'Indie Music Bash',
    eventDate: '2025-07-01T18:00:00Z',
    location: 'Los Angeles, CA',
    price: '0.12 ETH',
    imageUrl: '/Images/placeholder.png',
    description: 'Discover the best indie artists in an intimate setting. This event showcases emerging talent and provides a unique opportunity to experience new music.',
    organizer: 'Indie Music Collective',
    category: 'CONCERT',
    ticketsAvailable: 500,
    isTrending: true,
    about: {
      intro: "Join us for an evening celebrating the vibrant indie music scene of Los Angeles.",
      expectations: [
        "Performances from 5 up-and-coming indie artists",
        "Intimate venue with excellent acoustics",
        "Meet and greet with artists after the show",
        "Exclusive merchandise available only at the event"
      ],
      outro: "This is your chance to discover tomorrow's biggest stars today!"
    },
    schedule: [
      { day: "Main Event", date: "2025-07-01", events: [
        { time: "6:00 PM", activity: "Doors Open" },
        { time: "7:00 PM", activity: "Opening Act: The Wanderers" },
        { time: "8:00 PM", activity: "Feature Performance: Crystal Moon" },
        { time: "9:30 PM", activity: "Headliner: The River Collective" },
        { time: "11:00 PM", activity: "After-party & Meet and Greet" }
      ]}
    ],
    performers: [
      { name: "The Wanderers", role: "Opening Act", image: "/Images/performers/placeholder.png" },
      { name: "Crystal Moon", role: "Feature Artist", image: "/Images/performers/placeholder.png" },
      { name: "The River Collective", role: "Headliner", image: "/Images/performers/placeholder.png" }
    ]
  }
};

export const ticketsByEventId = {
  'e1': [
    {
      id: "t1",
      type: "General Admission",
      price: "0.08 ETH",
      available: 200,
      popular: true,
      description: [
        "Access to all stages and performances",
        "Entry to food courts and chill-out lounges"
      ]
    },
    {
      id: "t2",
      type: "VIP Pass",
      price: "0.2 ETH",
      available: 70,
      description: [
        "Everything in General Admission plus:",
        "Priority entry",
        "Exclusive access to VIP dance pit and lounges",
        "Complimentary drink vouchers (x2)"
      ]
    },
    {
      id: "t3",
      type: "All-Access Experience",
      price: "0.4 ETH",
      available: 30,
      description: [
        "Everything in VIP Pass plus:",
        "Backstage tour & meet-and-greet with performers",
        "Access to after-party events",
        "Festival merch bundle (shirt + wristband + tote)"
      ]
    }
  ]
};

export const organizersByEventId = {
  'e1': {
    name: "Rhythm Nation Collective",
    description: "Bringing immersive music experiences to life",
    verified: true
  }
};

// Helper functions for data validation and formatting
export const validateEvent = (event) => {
  const requiredFields = ['id', 'eventName', 'eventDate', 'location', 'price', 'category'];
  const missingFields = requiredFields.filter(field => !event[field]);
  
  if (missingFields.length > 0) {
    console.warn(`Event ${event.id} is missing required fields:`, missingFields);
    return false;
  }
  
  // Validate date format
  try {
    new Date(event.eventDate);
  } catch (e) {
    console.warn(`Event ${event.id} has invalid date format:`, event.eventDate);
    return false;
  }
  
  return true;
};

export const formatEventDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  } catch (e) {
    console.warn('Invalid date format:', dateString);
    return 'Invalid Date';
  }
};

export const getTrendingEvents = () => {
  return Object.values(eventsById)
    .filter(event => event.isTrending)
    .map(event => ({
      id: event.id,
      title: event.eventName,
      time: formatEventDate(event.eventDate),
      amount: event.price,
      type: event.category.toLowerCase(),
      color: "bg-[#00FFA0] text-[#013237]"
    }));
}; 