"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

export interface DropdownMenuItemDef {
  label: ReactNode;
  value: string;
  disabled?: boolean;
  destructive?: boolean;
  icon?: ReactNode;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItemDef[];
  onSelect: (value: string) => void;
  align?: "left" | "right";
  className?: string;
}

/**
 * DropdownMenu — an accessible dropdown following the ARIA menu button pattern.
 *
 * - Trigger button toggles the menu with `aria-haspopup="menu"`.
 * - Each item has `role="menuitem"`.
 * - Keyboard: Arrow keys navigate items, Enter/Space select, Escape closes.
 * - Focus returns to trigger on close.
 * - Clicking outside closes the menu.
 */
export function DropdownMenu({
  trigger,
  items,
  onSelect,
  align = "left",
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const enabledItems = items.filter((i) => !i.disabled);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  // Focus first item when menu opens
  useEffect(() => {
    if (open) {
      setFocusedIndex(0);
      const firstEnabled = items.findIndex((i) => !i.disabled);
      if (firstEnabled !== -1) {
        setTimeout(() => itemRefs.current[firstEnabled]?.focus(), 10);
      }
    }
  }, [open, items]);

  const close = () => {
    setOpen(false);
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
    if (e.key === "Escape") close();
  };

  const handleItemKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }

    const currentEnabledIndex = enabledItems.findIndex(
      (i) => i.value === items[index].value,
    );

    let nextItem: DropdownMenuItemDef | undefined;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      nextItem = enabledItems[(currentEnabledIndex + 1) % enabledItems.length];
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      nextItem =
        enabledItems[
          (currentEnabledIndex - 1 + enabledItems.length) % enabledItems.length
        ];
    } else if (e.key === "Home") {
      e.preventDefault();
      nextItem = enabledItems[0];
    } else if (e.key === "End") {
      e.preventDefault();
      nextItem = enabledItems[enabledItems.length - 1];
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!items[index].disabled) {
        onSelect(items[index].value);
        close();
      }
      return;
    }

    if (nextItem) {
      const nextIndex = items.findIndex((i) => i.value === nextItem!.value);
      setFocusedIndex(nextIndex);
      itemRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
      >
        {trigger}
        <ChevronDown
          size={14}
          className={cn(
            "text-gray-400 transition-transform duration-150",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          ref={menuRef}
          role="menu"
          aria-label="dropdown menu"
          className={cn(
            "absolute z-50 mt-1 min-w-[10rem] overflow-hidden rounded-xl border border-white/10 bg-[#0b1025] py-1 shadow-xl",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {items.map((item, index) => (
            <li
              key={item.value}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              role="menuitem"
              tabIndex={item.disabled ? -1 : focusedIndex === index ? 0 : -1}
              aria-disabled={item.disabled}
              onClick={() => {
                if (!item.disabled) {
                  onSelect(item.value);
                  close();
                }
              }}
              onKeyDown={(e) => handleItemKeyDown(e, index)}
              className={cn(
                "flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm transition-colors",
                item.destructive
                  ? "text-red-400 hover:bg-red-500/10"
                  : "text-gray-200 hover:bg-white/5",
                item.disabled && "cursor-not-allowed opacity-40",
              )}
            >
              {item.icon && (
                <span className="shrink-0 text-gray-400" aria-hidden>
                  {item.icon}
                </span>
              )}
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
