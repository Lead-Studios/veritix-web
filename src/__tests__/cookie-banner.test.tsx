import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CookieBanner, analyticsAllowed, readConsent } from '@/components/cookie-banner';

function clearConsentCookie() {
  document.cookie = 'veritix.consent=; Max-Age=0; Path=/';
}

beforeEach(clearConsentCookie);
afterEach(clearConsentCookie);

describe('CookieBanner', () => {
  it('asks when nobody has decided', () => {
    render(<CookieBanner />);

    expect(screen.getByRole('region', { name: 'Cookie consent' })).toBeInTheDocument();
  });

  it('stays out of the DOM when a choice is already stored', () => {
    document.cookie = 'veritix.consent=necessary; Path=/';

    render(<CookieBanner />);

    expect(screen.queryByRole('region', { name: 'Cookie consent' })).not.toBeInTheDocument();
  });

  it('stores the choice and disappears when "Necessary only" is picked', async () => {
    const user = userEvent.setup();
    render(<CookieBanner />);

    await user.click(screen.getByRole('button', { name: 'Necessary only' }));

    expect(screen.queryByRole('region', { name: 'Cookie consent' })).not.toBeInTheDocument();
    expect(readConsent()).toBe('necessary');
    expect(analyticsAllowed()).toBe(false);
  });

  it('allows analytics only after "Allow analytics" is picked', async () => {
    const user = userEvent.setup();
    render(<CookieBanner />);

    expect(analyticsAllowed()).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Allow analytics' }));

    expect(analyticsAllowed()).toBe(true);
    expect(screen.queryByRole('region', { name: 'Cookie consent' })).not.toBeInTheDocument();
  });

  it('treats a mangled cookie as the privacy-preserving choice without throwing', () => {
    document.cookie = 'veritix.consent=%E0%A4%A; Path=/';

    expect(readConsent()).toBe('necessary');
    expect(() => render(<CookieBanner />)).not.toThrow();
    expect(screen.queryByRole('region', { name: 'Cookie consent' })).not.toBeInTheDocument();
  });
});
