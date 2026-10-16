import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerifyPage from '@/app/(protected)/verify/page';

const EVENT = {
  id: 'evt_1',
  slug: 'lagos-sound-festival',
  title: 'Lagos Sound Festival',
  description: '',
  venue: 'Eko',
  city: 'Lagos',
  startsAt: '2026-10-17T16:00:00.000Z',
  endsAt: '2026-10-17T23:00:00.000Z',
  status: 'published',
  organizer: { id: 'org_1', name: 'Rhythm Nation', verified: true },
  tiers: [],
};

function json(body: unknown, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(body), { status }));
}

let verifyReply: { body: unknown; status: number };
const fetchMock = vi.fn((input: RequestInfo | URL) => {
  const url = String(input);
  if (url.startsWith('/api/events')) {
    return json({ items: [EVENT], page: 1, pageSize: 50, total: 1 });
  }
  return json(verifyReply.body, verifyReply.status);
});

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockClear();
});
afterEach(() => vi.unstubAllGlobals());

async function enterCode(code: string) {
  const user = userEvent.setup();
  render(<VerifyPage />);
  // The only published event is selected automatically.
  expect(await screen.findByLabelText('Event')).toHaveValue('evt_1');
  await user.type(screen.getByLabelText('Ticket code'), code);
  await user.click(screen.getByRole('button', { name: 'Check ticket' }));
}

describe('VerifyPage', () => {
  it("loads only the signed-in organizer's events", async () => {
    render(<VerifyPage />);
    await screen.findByLabelText('Event');
    expect(fetchMock).toHaveBeenCalledWith('/api/events?mine=1&pageSize=50');
  });

  it('shows a valid result and sends the code with the selected event', async () => {
    verifyReply = {
      status: 200,
      body: { status: 'valid', message: 'Ticket accepted.', ticketId: 'tkt_1', usedAt: '2026-10-17T18:00:00.000Z' },
    };
    await enterCode('abc.def');

    expect(await screen.findByText('Valid — let them in')).toBeInTheDocument();
    const [, init] = fetchMock.mock.calls.find(([url]) => url === '/api/verify') as unknown as [
      string,
      RequestInit,
    ];
    expect(JSON.parse(String(init.body))).toEqual({ payload: 'abc.def', eventId: 'evt_1' });
  });

  it('shows an already-used result with when it was first scanned', async () => {
    verifyReply = {
      status: 409,
      body: { status: 'already_used', message: 'x', usedAt: '2026-10-17T18:00:00.000Z' },
    };
    await enterCode('abc.def');

    expect(await screen.findByText('Already used')).toBeInTheDocument();
    expect(screen.getByText(/First scanned/)).toBeInTheDocument();
  });

  it.each(['malformed', 'invalid_signature', 'wrong_event', 'not_found'])(
    'shows an invalid result for %s',
    async (status) => {
      verifyReply = { status: 400, body: { status, message: 'This ticket code is not genuine.' } };
      await enterCode('abc.def');

      expect(await screen.findByText('Invalid ticket')).toBeInTheDocument();
    },
  );

  it('does not call a failed request a verdict on the ticket', async () => {
    verifyReply = { status: 503, body: { message: 'Ticket verification is not configured.' } };
    await enterCode('abc.def');

    expect(await screen.findByText('Could not check ticket')).toBeInTheDocument();
    expect(screen.queryByText('Invalid ticket')).not.toBeInTheDocument();
  });

  it('clears the result for the next ticket', async () => {
    verifyReply = { status: 200, body: { status: 'valid', message: 'ok' } };
    await enterCode('abc.def');
    await userEvent.click(await screen.findByRole('button', { name: 'Scan next ticket' }));

    expect(screen.queryByText('Valid — let them in')).not.toBeInTheDocument();
  });

  it('falls back to manual entry when the browser cannot scan', async () => {
    render(<VerifyPage />);
    await screen.findByLabelText('Event');
    await userEvent.click(screen.getByRole('button', { name: /start camera/i }));

    expect(screen.getByText(/cannot scan QR codes with the camera/)).toBeInTheDocument();
    expect(screen.getByLabelText('Ticket code')).toBeEnabled();
  });
});
