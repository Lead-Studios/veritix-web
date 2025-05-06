# Data Management Documentation

## Overview
This project uses a centralized data management approach with mock data stored in `events.js` and `categoryData.js`. The data structure is designed to be easily replaceable with a real API integration in the future.

## File Structure

### `events.js`
Contains all event-related data and helper functions:
- Event details
- Ticket information
- Organizer information
- Event validation and formatting utilities

### `categoryData.js`
Contains category-related data and UI elements:
- Category definitions
- Category icons
- Category descriptions
- Event-category relationships

The relationship between events and categories is maintained through the `events` array in each category, which contains references to event IDs.

## Data Structure

### Events (`eventsById`)
Events are stored in an object where each key is the event ID. Each event has the following structure:

```typescript
interface Event {
  id: string;
  eventName: string;
  eventDate: string; // ISO format: "2025-06-12T20:00:00Z"
  location: string;
  price: string; // Format: "0.08 ETH"
  imageUrl: string;
  description: string;
  organizer: string;
  category: string;
  ticketsAvailable: number;
  isTrending: boolean;
  about: {
    intro: string;
    expectations: string[];
    outro: string;
  };
  schedule: Array<{
    day: string;
    date: string;
    events: Array<{
      time: string;
      activity: string;
    }>;
  }>;
  performers: Array<{
    name: string;
    role: string;
    image: string;
  }>;
}
```

### Categories (`categories`)
Categories are stored in an array with the following structure:

```typescript
interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType; // React icon component
  imageUrl: string;
  count: number;
  events: string[]; // Array of event IDs
}
```

### Tickets (`ticketsByEventId`)
Tickets are organized by event ID:

```typescript
interface Ticket {
  id: string;
  type: string;
  price: string;
  available: number;
  popular?: boolean;
  description: string[];
}
```

### Organizers (`organizersByEventId`)
Organizer information is stored by event ID:

```typescript
interface Organizer {
  name: string;
  description: string;
  verified: boolean;
}
```

## Helper Functions

### `validateEvent(event: Event): boolean`
Validates that an event has all required fields and proper date format. Returns `true` if valid, `false` otherwise.

### `formatEventDate(dateString: string): string`
Formats an ISO date string into a user-friendly format (e.g., "Sat, Oct 21 · 7:00 PM").

### `getTrendingEvents(): TrendingEvent[]`
Returns a list of trending events formatted for the trending section.

## Usage Examples

### Getting All Events
```javascript
import { eventsById } from '../data/events';

// Get all events as an array
const allEvents = Object.values(eventsById);
```

### Getting Event Details
```javascript
import { eventsById } from '../data/events';

const event = eventsById['e1'];
```

### Getting Event Tickets
```javascript
import { ticketsByEventId } from '../data/events';

const tickets = ticketsByEventId['e1'];
```

### Getting Category Events
```javascript
import { categories } from '../data/categoryData';
import { eventsById } from '../data/events';

// Get all events for a specific category
const category = categories.find(cat => cat.id === 'cat-1');
const categoryEvents = category.events.map(eventId => eventsById[eventId]);
```

### Validating Events
```javascript
import { validateEvent } from '../data/events';

const isValid = validateEvent(event);
if (!isValid) {
  console.warn('Invalid event data');
}
```

## Future Integration

When integrating with a real API:

1. Replace the mock data in `events.js` with API calls
2. Use the existing helper functions to validate and format API responses
3. Consider adding loading states and error handling
4. Implement caching if needed
5. Add proper TypeScript interfaces for API responses

## Best Practices

1. Always validate event data before displaying
2. Use the helper functions for consistent date formatting
3. Keep the data structure consistent across components
4. Use TypeScript types when possible
5. Handle missing or invalid data gracefully
6. Maintain the separation between event and category data
7. Keep category data focused on UI elements and event relationships

## Notes

- All dates should be stored in ISO format
- Prices should be stored as strings with ETH denomination
- Image URLs should be relative to the public directory
- Event IDs should be unique across the application
- Category IDs should be unique and follow the format 'cat-{number}'
- Event-category relationships should be maintained in both directions 