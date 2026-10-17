import { z } from 'zod';
import { NextResponse, type NextRequest } from 'next/server';
import { forwardToBackend, toResponse } from '@/lib/api/server';
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  sessionSigningConfigured,
  signSession,
} from '@/lib/session';
import type { User } from '@/types';

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

const backendUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1).optional(),
  displayName: z.string().min(1).optional(),
  avatarUrl: z.string().optional(),
  walletAddress: z.string().optional(),
});

function secureCookie(): boolean {
  return process.env.NODE_ENV === 'production';
}

export async function POST(request: NextRequest) {
  const parsed = credentialsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: 'Enter a valid email and password.' }, { status: 400 });
  }

  if (!sessionSigningConfigured()) {
    return NextResponse.json(
      { message: 'Sign-in is not configured.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  try {
    const response = await forwardToBackend<unknown>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    });
    const responseObject =
      response && typeof response === 'object' && !Array.isArray(response)
        ? (response as Record<string, unknown>)
        : null;
    const userValue = responseObject?.user ?? response;
    const parsedUser = backendUserSchema.safeParse(userValue);

    if (!parsedUser.success) {
      return NextResponse.json(
        { message: 'The sign-in service returned an invalid user.' },
        { status: 502, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    const user: User = {
      id: parsedUser.data.id,
      email: parsedUser.data.email,
      name: parsedUser.data.name ?? parsedUser.data.displayName ?? parsedUser.data.email,
      ...(parsedUser.data.avatarUrl ? { avatarUrl: parsedUser.data.avatarUrl } : {}),
      ...(parsedUser.data.walletAddress
        ? { walletAddress: parsedUser.data.walletAddress }
        : {}),
    };
    const token = await signSession(user);
    const result = NextResponse.json(user, { headers: { 'Cache-Control': 'no-store' } });

    result.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: secureCookie(),
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return result;
  } catch (error) {
    return toResponse(error);
  }
}
