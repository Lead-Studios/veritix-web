import { lifecycleRoute } from '@/lib/api/event-routes';

/**
 * POST /api/events/[id]/publish
 *
 * Publishes a draft the signed-in user organizes. 404 for someone else's
 * event, 409 if the event is not a draft.
 */
export const POST = lifecycleRoute('publish');
