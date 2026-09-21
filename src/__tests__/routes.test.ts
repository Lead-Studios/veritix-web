import { describe, expect, it } from 'vitest';
import { isAuthPath, isProtectedPath, routes } from '@/lib/routes';

describe('route guards', () => {
  it('treats dashboard paths and their children as protected', () => {
    expect(isProtectedPath('/dashboard')).toBe(true);
    expect(isProtectedPath('/dashboard/analytics')).toBe(true);
  });

  it('does not protect public paths', () => {
    expect(isProtectedPath('/events')).toBe(false);
    expect(isProtectedPath('/')).toBe(false);
  });

  it('does not treat a path that merely starts with a protected prefix as protected', () => {
    expect(isProtectedPath('/settings-public')).toBe(false);
  });

  it('identifies auth routes', () => {
    expect(isAuthPath(routes.login)).toBe(true);
    expect(isAuthPath(routes.events)).toBe(false);
  });
});
