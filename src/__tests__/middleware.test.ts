import { middleware } from '../middleware';
import { NextRequest } from 'next/server';

describe('middleware', () => {
  it('should block cross-origin POST requests', () => {
    const req = new NextRequest('https://example.com/api/test', {
      method: 'POST',
      headers: {
        origin: 'https://evil.com',
        host: 'example.com',
      },
    });

    const res = middleware(req);

    expect(res.status).toBe(403);
  });

  it('should allow same-origin POST requests', () => {
    const req = new NextRequest('https://example.com/api/test', {
      method: 'POST',
      headers: {
        origin: 'https://example.com',
        host: 'example.com',
      },
    });

    const res = middleware(req);

    expect(res.status).toBe(200);
  });

  it('should allow GET requests from any origin', () => {
    const req = new NextRequest('https://example.com/api/test', {
      method: 'GET',
      headers: {
        origin: 'https://evil.com',
        host: 'example.com',
      },
    });

    const res = middleware(req);

    expect(res.status).toBe(200);
  });
});
