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
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    changePassword: '/auth/change-password',
    resendVerification: '/auth/resend-verification',
  },

  events: {
    list: '/events',
    detail: (id: string) => `/events/${id}`,
    create: '/events',
    update: (id: string) => `/events/${id}`,
    delete: (id: string) => `/events/${id}`,
    checkIn: (eventId: string) => `/events/${eventId}/check-in`,
    checkInCount: (eventId: string) => `/events/${eventId}/check-ins/count`,
    attendees: (eventId: string) => `/events/${eventId}/attendees`,
    attendeeCheckIn: (eventId: string, attendeeId: string) =>
      `/events/${eventId}/attendees/${attendeeId}/check-in`,
    analytics: (eventId: string) => `/events/${eventId}/analytics`,
    demographics: (eventId: string) => `/events/${eventId}/demographics`,
    actions: (eventId: string) => `/events/${eventId}/actions`,
    tickets: (eventId: string) => `/events/${eventId}/tickets`,
    drafts: '/events/drafts',
    draftDetail: (draftId: string) => `/events/drafts/${draftId}`,
    duplicate: (eventId: string) => `/events/${eventId}/duplicate`,
    waitlist: (eventId: string) => `/events/${eventId}/waitlist`,
    coOrganizers: (eventId: string) => `/events/${eventId}/co-organizers`,
    reviews: (eventId: string) => `/events/${eventId}/reviews`,
  },

  tickets: {
    list: '/tickets',
    detail: (id: string) => `/tickets/${id}`,
    purchase: '/tickets/purchase',
    verify: '/tickets/verify',
    checkIn: '/tickets/check-in',
    status: (ticketCode: string) => `/tickets/${encodeURIComponent(ticketCode)}/status`,
    transfer: (ticketId: string) => `/tickets/${ticketId}/transfer`,
    transfers: (ticketId: string) => `/tickets/${ticketId}/transfers`,
    gift: (ticketId: string) => `/tickets/${ticketId}/gift`,
    resale: (ticketId: string) => `/tickets/${ticketId}/resale`,
    cancel: (ticketId: string) => `/tickets/${ticketId}/cancel`,
    userTickets: '/tickets/user',
    applePass: (ticketId: string) =>
      `/tickets/${encodeURIComponent(ticketId)}/pass/apple`,
    googlePass: (ticketId: string) =>
      `/tickets/${encodeURIComponent(ticketId)}/pass/google`,
    groupPurchase: (ticketTypeId: string) => `/tickets/${ticketTypeId}/group-purchase`,
  },

  wallet: {
    balance: '/wallet/balance',
    transactions: '/wallet/transactions',
    payoutRequest: '/wallet/payout-request',
    payoutHistory: '/wallet/payout-history',
  },

  organizer: {
    dashboard: '/organizer/dashboard',
    events: '/organizer/events',
    payouts: '/organizer/payouts',
    profile: '/organizer/profile',
    analytics: '/organizer/analytics',
  },

  admin: {
    attendees: (eventId: string) => `/admin/events/${eventId}/attendees`,
    ban: (eventId: string) => `/admin/events/${eventId}/ban`,
  },

  profile: {
    base: '/profile',
    notificationPreferences: '/profile/notification-preferences',
    account: '/profile/account',
  },

  orders: {
    detail: (orderId: string) => `/orders/${orderId}`,
    retryPayment: (orderId: string) => `/orders/${orderId}/retry-payment`,
  },

  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
  },

  upload: {
    image: '/upload/image',
    eventImage: (eventId: string) => `/events/${eventId}/image`,
    eventImages: (eventId: string) => `/events/${eventId}/images`,
  },

  contact: '/contact',
  testimonials: '/testimonials',
  verify: (ticketId: string) => `/verify/${encodeURIComponent(ticketId.trim())}`,
} as const;

/** Helper to build a full URL from a route path. */
export function buildUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';
  return `${base.replace(/\/$/, '')}${path}`;
}
