"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "veritix_cookie_consent";

type Prefs = { analytics: boolean; marketing: boolean };
type Consent = { functional: true } & Prefs;

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ analytics: false, marketing: false });

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function save(consent: Consent) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0a0f24]/95 p-4 backdrop-blur sm:p-6"
    >
      <div className="mx-auto max-w-4xl space-y-4">
        <p className="text-sm text-white/80">
          We use cookies to improve your experience.{" "}
          <Link href="/cookies" className="underline hover:text-white">
            Cookie Policy
          </Link>
        </p>

        {expanded && (
          <div className="space-y-2 rounded-xl bg-white/5 p-4 text-sm text-white/80">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked disabled className="accent-[#4d21ff]" />
              <span>Functional (always on)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.analytics}
                onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                className="accent-[#4d21ff]"
              />
              <span>Analytics cookies</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.marketing}
                onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
                className="accent-[#4d21ff]"
              />
              <span>Marketing cookies</span>
            </label>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => save({ functional: true, analytics: true, marketing: true })}
            className="rounded-full bg-gradient-to-r from-[#4d21ff] to-[#21d4ff] px-5 py-2 text-sm font-semibold text-white"
          >
            Accept All
          </button>
          <button
            onClick={() => save({ functional: true, analytics: false, marketing: false })}
            className="rounded-full border border-[#3a3c77] px-5 py-2 text-sm text-white/80 hover:text-white"
          >
            Reject Non-Essential
          </button>
          {expanded ? (
            <button
              onClick={() => save({ functional: true, ...prefs })}
              className="rounded-full border border-[#3a3c77] px-5 py-2 text-sm text-white/80 hover:text-white"
            >
              Save Preferences
            </button>
          ) : (
            <button
              onClick={() => setExpanded(true)}
              className="rounded-full border border-[#3a3c77] px-5 py-2 text-sm text-white/80 hover:text-white"
            >
              Manage Preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
