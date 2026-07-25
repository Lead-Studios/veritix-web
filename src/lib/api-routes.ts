/**
 * Centralised API route constants.
 *
 * All paths are relative to NEXT_PUBLIC_API_BASE_URL.
 * Use these instead of raw strings to make future refactors safe and
 * to get TypeScript autocomplete across the codebase.
 *
 * @example
 * fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ROUTES.auth.login}`)
 */
export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },

  events: {
    list: "/events",
    detail: (id: string) => `/events/${id}`,
    create: "/events",
    update: (id: string) => `/events/${id}`,
    delete: (id: string) => `/events/${id}`,
    checkIn: (eventId: string) => `/events/${eventId}/check-in`,
    attendees: (eventId: string) => `/events/${eventId}/attendees`,
    analytics: (eventId: string) => `/events/${eventId}/analytics`,
    demographics: (eventId: string) => `/events/${eventId}/demographics`,
  },

  tickets: {
    list: "/tickets",
    detail: (id: string) => `/tickets/${id}`,
    purchase: "/tickets/purchase",
    verify: (ticketId: string) => `/tickets/${ticketId}/verify`,
    transfer: (ticketId: string) => `/tickets/${ticketId}/transfer`,
    userTickets: "/tickets/user",
  },

  wallet: {
    balance: "/wallet/balance",
    transactions: "/wallet/transactions",
    payoutRequest: "/wallet/payout-request",
    payoutHistory: "/wallet/payout-history",
  },

  organizer: {
    dashboard: "/organizer/dashboard",
    events: "/organizer/events",
    payouts: "/organizer/payouts",
    profile: "/organizer/profile",
  },

  notifications: {
    list: "/notifications",
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: "/notifications/read-all",
  },

  upload: {
    image: "/upload/image",
  },
} as const;

/** Helper to build a full URL from a route path. */
export function buildUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:4000/api";
  return `${base.replace(/\/$/, "")}${path}`;
}