// FE-090: Modal accessibility utilities - focus management and keyboard support

export function trapFocus(container: HTMLElement): () => void {
  const focusable = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== "Tab") return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  container.addEventListener("keydown", handleKeyDown);
  first?.focus();
  return () => container.removeEventListener("keydown", handleKeyDown);
}

export function getModalA11yProps(labelId: string, descriptionId?: string) {
  return {
    role: "dialog" as const,
    "aria-modal": true,
    "aria-labelledby": labelId,
    ...(descriptionId ? { "aria-describedby": descriptionId } : {}),
  };
}