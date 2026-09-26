import { lifecycleRoute } from '@/lib/api/event-routes';

/**
 * POST /api/events/[id]/cancel
 *
 * Cancels a draft or published event the signed-in user organizes. 404 for
 * someone else's event, 409 if it is already cancelled or completed.
 */
export const POST = lifecycleRoute('cancel');
