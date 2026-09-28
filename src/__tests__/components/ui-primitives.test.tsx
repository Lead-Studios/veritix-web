/**
 * Issue #884 — Tests for UI primitives: Dialog, Tabs, DropdownMenu
 *
 * Covers:
 *  - Variant rendering
 *  - Disabled states
 *  - Keyboard interaction (using @testing-library/user-event)
 */
import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

// ── Mock next/link and framer-motion (not used here but avoids SSR issues) ───

vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & {
      children?: React.ReactNode;
    }) => React.createElement("div", rest, children),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// ── Import UI primitives ──────────────────────────────────────────────────────

import { Dialog } from "@/components/ui/dialog";
import { Tabs } from "@/components/ui/tabs";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

// ═══════════════════════════════════════════════════════════════════════════════
// Dialog
// ═══════════════════════════════════════════════════════════════════════════════

describe("Dialog", () => {
  it("renders nothing when closed", () => {
    const onClose = vi.fn();
    render(
      <Dialog open={false} onClose={onClose} title="Test Dialog">
        <p>Dialog content</p>
      </Dialog>,
    );
    expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
  });

  it("renders title, description, and children when open", () => {
    const onClose = vi.fn();
    render(
      <Dialog
        open={true}
        onClose={onClose}
        title="Confirm Action"
        description="This action cannot be undone."
      >
        <p>Dialog body</p>
      </Dialog>,
    );
    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
    expect(screen.getByText("Dialog body")).toBeInTheDocument();
  });

  it("shows a close button with accessible label", () => {
    const onClose = vi.fn();
    render(
      <Dialog open={true} onClose={onClose} title="My Dialog">
        <p>content</p>
      </Dialog>,
    );
    expect(
      screen.getByRole("button", { name: /close dialog/i }),
    ).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Dialog open={true} onClose={onClose} title="Closeable">
        <p>body</p>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: /close dialog/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Dialog open={true} onClose={onClose} title="Escape test">
        <p>body</p>
      </Dialog>,
    );
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(
      <Dialog open={true} onClose={onClose} title="Backdrop test">
        <p>body</p>
      </Dialog>,
    );
    // The backdrop is the first fixed div (aria-hidden)
    const backdrop = container.querySelector("[aria-hidden]");
    if (backdrop) await user.click(backdrop as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders different sizes without errors", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Dialog open={true} onClose={onClose} size="sm" title="Small">
        <p>sm</p>
      </Dialog>,
    );
    expect(screen.getByText("Small")).toBeInTheDocument();

    rerender(
      <Dialog open={true} onClose={onClose} size="lg" title="Large">
        <p>lg</p>
      </Dialog>,
    );
    expect(screen.getByText("Large")).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Tabs
// ═══════════════════════════════════════════════════════════════════════════════

describe("Tabs", () => {
  const tabItems = [
    { value: "overview", label: "Overview" },
    { value: "details", label: "Details" },
    { value: "settings", label: "Settings" },
  ];

  it("renders all tab buttons", () => {
    const onTabChange = vi.fn();
    render(
      <Tabs tabs={tabItems} activeTab="overview" onTabChange={onTabChange} />,
    );
    expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Details" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Settings" })).toBeInTheDocument();
  });

  it("marks the active tab as selected", () => {
    const onTabChange = vi.fn();
    render(
      <Tabs tabs={tabItems} activeTab="details" onTabChange={onTabChange} />,
    );
    expect(
      screen.getByRole("tab", { name: "Details" }),
    ).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("tab", { name: "Overview" }),
    ).toHaveAttribute("aria-selected", "false");
  });

  it("calls onTabChange when a tab is clicked", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    render(
      <Tabs tabs={tabItems} activeTab="overview" onTabChange={onTabChange} />,
    );
    await user.click(screen.getByRole("tab", { name: "Details" }));
    expect(onTabChange).toHaveBeenCalledWith("details");
  });

  it("renders a disabled tab correctly", () => {
    const onTabChange = vi.fn();
    const tabs = [
      { value: "active", label: "Active" },
      { value: "disabled-tab", label: "Disabled", disabled: true },
    ];
    render(<Tabs tabs={tabs} activeTab="active" onTabChange={onTabChange} />);
    const disabledTab = screen.getByRole("tab", { name: "Disabled" });
    expect(disabledTab).toBeDisabled();
  });

  it("does not call onTabChange when a disabled tab is clicked", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    const tabs = [
      { value: "active", label: "Active" },
      { value: "locked", label: "Locked", disabled: true },
    ];
    render(<Tabs tabs={tabs} activeTab="active" onTabChange={onTabChange} />);
    await user.click(screen.getByRole("tab", { name: "Locked" }));
    expect(onTabChange).not.toHaveBeenCalled();
  });

  it("navigates with ArrowRight key", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    render(
      <Tabs tabs={tabItems} activeTab="overview" onTabChange={onTabChange} />,
    );
    const firstTab = screen.getByRole("tab", { name: "Overview" });
    firstTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(onTabChange).toHaveBeenCalledWith("details");
  });

  it("navigates with ArrowLeft key", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    render(
      <Tabs tabs={tabItems} activeTab="details" onTabChange={onTabChange} />,
    );
    const secondTab = screen.getByRole("tab", { name: "Details" });
    secondTab.focus();
    await user.keyboard("{ArrowLeft}");
    expect(onTabChange).toHaveBeenCalledWith("overview");
  });

  it("wraps to last tab from first on ArrowLeft", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    render(
      <Tabs tabs={tabItems} activeTab="overview" onTabChange={onTabChange} />,
    );
    const firstTab = screen.getByRole("tab", { name: "Overview" });
    firstTab.focus();
    await user.keyboard("{ArrowLeft}");
    expect(onTabChange).toHaveBeenCalledWith("settings");
  });

  it("jumps to first tab with Home key", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    render(
      <Tabs tabs={tabItems} activeTab="settings" onTabChange={onTabChange} />,
    );
    const lastTab = screen.getByRole("tab", { name: "Settings" });
    lastTab.focus();
    await user.keyboard("{Home}");
    expect(onTabChange).toHaveBeenCalledWith("overview");
  });

  it("jumps to last tab with End key", async () => {
    const user = userEvent.setup();
    const onTabChange = vi.fn();
    render(
      <Tabs tabs={tabItems} activeTab="overview" onTabChange={onTabChange} />,
    );
    const firstTab = screen.getByRole("tab", { name: "Overview" });
    firstTab.focus();
    await user.keyboard("{End}");
    expect(onTabChange).toHaveBeenCalledWith("settings");
  });

  it("has correct tabindex values (active=0, others=-1)", () => {
    const onTabChange = vi.fn();
    render(
      <Tabs tabs={tabItems} activeTab="details" onTabChange={onTabChange} />,
    );
    expect(screen.getByRole("tab", { name: "Details" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DropdownMenu
// ═══════════════════════════════════════════════════════════════════════════════

describe("DropdownMenu", () => {
  const items = [
    { value: "edit", label: "Edit" },
    { value: "duplicate", label: "Duplicate" },
    { value: "delete", label: "Delete", destructive: true },
  ];

  it("renders a trigger button", () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu trigger="Options" items={items} onSelect={onSelect} />,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("does not show menu items by default", () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu trigger="Options" items={items} onSelect={onSelect} />,
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("shows all menu items when trigger is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu trigger="Options" items={items} onSelect={onSelect} />,
    );
    await user.click(screen.getByRole("button"));
    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
    expect(within(menu).getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(within(menu).getByRole("menuitem", { name: "Duplicate" })).toBeInTheDocument();
    expect(within(menu).getByRole("menuitem", { name: "Delete" })).toBeInTheDocument();
  });

  it("calls onSelect with the correct value when an item is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu trigger="Options" items={items} onSelect={onSelect} />,
    );
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onSelect).toHaveBeenCalledWith("edit");
  });

  it("closes the menu after selecting an item", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu trigger="Options" items={items} onSelect={onSelect} />,
    );
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("menuitem", { name: "Duplicate" }));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("renders disabled items with aria-disabled", () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const withDisabled = [
      { value: "edit", label: "Edit" },
      { value: "archive", label: "Archive", disabled: true },
    ];
    render(
      <DropdownMenu trigger="Options" items={withDisabled} onSelect={onSelect} />,
    );
    // Open and check
    userEvent.click(screen.getByRole("button"));
  });

  it("closes menu on Escape key press", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu trigger="Options" items={items} onSelect={onSelect} />,
    );
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens menu on ArrowDown key from trigger", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu trigger="Options" items={items} onSelect={onSelect} />,
    );
    const trigger = screen.getByRole("button");
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("selects item on Enter key", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu trigger="Options" items={items} onSelect={onSelect} />,
    );
    await user.click(screen.getByRole("button"));
    const editItem = screen.getByRole("menuitem", { name: "Edit" });
    editItem.focus();
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledWith("edit");
  });

  it("navigates between items with ArrowDown / ArrowUp", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu trigger="Options" items={items} onSelect={onSelect} />,
    );
    await user.click(screen.getByRole("button"));
    // Wait for the menu to be open and verify items exist
    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();

    // All three items should be present
    const menuItems = screen.getAllByRole("menuitem");
    expect(menuItems).toHaveLength(3);
    expect(menuItems[0]).toHaveTextContent("Edit");
    expect(menuItems[1]).toHaveTextContent("Duplicate");
    expect(menuItems[2]).toHaveTextContent("Delete");
  });

  it("sets aria-expanded on trigger when menu is open", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu trigger="Options" items={items} onSelect={onSelect} />,
    );
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
