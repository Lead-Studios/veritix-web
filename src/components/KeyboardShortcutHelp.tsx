"use client";

import { useEffect, useState, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";

interface ShortcutGroup {
  title: string;
  shortcuts: { key: string; description: string }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: "Global",
    shortcuts: [
      { key: "?", description: "Open keyboard shortcuts help" },
      { key: "Esc", description: "Close modal or dialog" },
    ],
  },
  {
    title: "Verify Page",
    shortcuts: [
      { key: "Esc", description: "Clear result and refocus input" },
      { key: "Enter", description: "Verify ticket code" },
    ],
  },
  {
    title: "Dashboard",
    shortcuts: [
      { key: "E", description: "Export analytics CSV" },
    ],
  },
];

export function KeyboardShortcutHelp() {
  const [open, setOpen] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isInput) return;

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Modal open={open} onClose={() => setOpen(false)} title="Keyboard Shortcuts" size="md">
      <div className="space-y-6">
        {SHORTCUT_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">
              {group.title}
            </h3>
            <div className="space-y-2">
              {group.shortcuts.map((shortcut) => (
                <div
                  key={shortcut.key}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-white/70">{shortcut.description}</span>
                  <kbd className="rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-xs font-mono text-white/90">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
