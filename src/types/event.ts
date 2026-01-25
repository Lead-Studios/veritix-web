export type EventCategory = 
  | 'music' 
  | 'festival' 
  | 'sports' 
  | 'art' 
  | 'theater' 
  | 'comedy' 
  | 'conference' 
  | 'workshop';

export interface Event {
  id: string;
  name: string;
  image: string;
  date: string;
  dateEnd?: string;
  time: string;
  location: string;
  venue: string;
  price: string;
  priceInEth: number;
  category: EventCategory;
  featured?: boolean;
  attendees?: number;
  description?: string;
  organizer?: {
    name: string;
    verified: boolean;
    description: string;
  };
  ticketOptions?: {
    name: string;
    description: string;
    benefits: string[];
    price: number;
    remaining: number;
    popular?: boolean;
  }[];
  schedule?: {
    time: string;
    title: string;
    description: string;
  }[];
  performers?: {
    name: string;
    role: string;
    image: string;
  }[];
}