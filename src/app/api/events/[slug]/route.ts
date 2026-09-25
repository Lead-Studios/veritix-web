import { NextResponse } from 'next/server';
import { findEventBySlug } from '@/lib/events';

/**
 * GET /api/events/[slug]
 *
 * Returns a single event by its public slug, or 404 when nothing matches.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const event = findEventBySlug(slug);

  if (!event) {
    return NextResponse.json(
      { message: `No event found for "${slug}"` },
      { status: 404 },
    );
  }

  return NextResponse.json(event);
}
