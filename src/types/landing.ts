/**
 * Landing page event card data used across public marketing surfaces.
 */
export interface TrendingEvent {
  id: number;
  title: string;
  location: string;
  date: string;
  time: string;
  price: string;
  category: string;
  image: string;
}

/**
 * Steps in the "How it Works" journey on the landing page.
 */
export interface HowItWorksStep {
  id: number;
  title: string;
  description: string;
}
