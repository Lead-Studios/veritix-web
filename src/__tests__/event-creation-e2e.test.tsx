import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// ---- vi.mock factories must not reference outer scope, so use vi.hoisted ----
const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/events/create",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    React.createElement("a", { href }, children),
}));

vi.mock("framer-motion", () => {
  const proxy = new Proxy(
    {},
    {
      get:
        (_t, tag: string) =>
        ({
          children,
          ...rest
        }: React.HTMLAttributes<HTMLElement> & {
          children?: React.ReactNode;
        }) =>
          React.createElement(
            tag === "button" ? "button" : "div",
            rest,
            children,
          ),
    },
  );
  return {
    motion: proxy,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock the ImageUpload component so the E2E test doesn't have to deal with
// File-validation / dimension checks. Clicking the rendered button triggers
// onChange with a fake image File so the cover-image requirement is met.
vi.mock("@/components/events/ui/ImageUpload", () => ({
  default: ({
    onChange,
  }: {
    onChange: (file: File | null) => void;
  }) =>
    React.createElement(
      "button",
      {
        type: "button",
        "data-testid": "mock-image-upload",
        onClick: () =>
          onChange(
            new File(["fake-image-bytes"], "cover.png", { type: "image/png" }),
          ),
      },
      "Upload",
    ),
}));

vi.mock("@/components/events/ui/ImageUploadField", () => ({
  ImageUploadField: ({
    onUploadComplete,
  }: {
    onUploadComplete: (imageUrl: string) => void;
  }) =>
    React.createElement(
      "button",
      {
        type: "button",
        "data-testid": "mock-image-upload",
        onClick: () =>
          onUploadComplete("https://example.com/cover.png"),
      },
      "Upload",
    ),
}));

// Avoid hitting the real Nominatim service when typing into the address combobox.
vi.mock("@/lib/locationSearch", () => ({
  searchLocations: vi.fn().mockResolvedValue([]),
}));

import CreateEventPage from "@/app/(protected)/events/create/page";

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  pushMock.mockClear();
  fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ id: "evt_123", slug: "stellar-summit-2026" }),
  });
  // @ts-expect-error - jsdom fetch override
  global.fetch = fetchMock;
  localStorage.clear();
});

describe("Event Creation – end-to-end flow", () => {
  it("walks every section with valid data, submits the FormData payload, and redirects to /events/manage", async () => {
    const { container } = render(<CreateEventPage />);

    // ----- Section 1: Basic Information -----
    fireEvent.change(
      screen.getByPlaceholderText("Give your event a catchy title"),
      { target: { value: "Stellar Summit 2026" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText("Describe your event in details"),
      {
        target: {
          value: "An on-chain ticketing showcase for VeriTix builders.",
        },
      },
    );
    // Set the cover image via the mocked uploader (uploaders[0] is the cover slot)
    const uploaders = screen.getAllByTestId("mock-image-upload");
    fireEvent.click(uploaders[0]);

    // ----- Section 2: Date & Time -----
    const dateInputs = container.querySelectorAll('input[type="date"]');
    const timeInputs = container.querySelectorAll('input[type="time"]');
    fireEvent.change(dateInputs[0], { target: { value: "2026-12-01" } });
    fireEvent.change(dateInputs[1], { target: { value: "2026-12-02" } });
    fireEvent.change(timeInputs[0], { target: { value: "10:00" } });
    fireEvent.change(timeInputs[1], { target: { value: "18:00" } });

    // ----- Section 3: Location (default = physical) -----
    fireEvent.change(screen.getByPlaceholderText("Enter Venue name"), {
      target: { value: "Stellar Hall" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Start typing an address…"),
      { target: { value: "123 Main Street" } },
    );
    fireEvent.change(screen.getByPlaceholderText("City"), {
      target: { value: "Lagos" },
    });

    // ----- Section 4: Tickets -----
    fireEvent.change(
      screen.getByPlaceholderText("e.g. VIP, General admission"),
      { target: { value: "General Admission" } },
    );
    const quantityInput = container.querySelector(
      'input[type="number"][min="0"]',
    ) as HTMLInputElement;
    fireEvent.change(quantityInput, { target: { value: "100" } });
    fireEvent.change(screen.getByPlaceholderText("e.g. 0.05"), {
      target: { value: "0.1" },
    });

    // ----- Section 5: Blockchain (default = ethereum) -----
    fireEvent.change(
      screen.getByPlaceholderText(
        "e.g. 0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
      ),
      { target: { value: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed" } },
    );

    // ----- Submit -----
    fireEvent.click(screen.getByRole("button", { name: /create event/i }));

    // The submit handler issues a single POST to /api/events with FormData.
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const [url, options] = fetchMock.mock.calls[0] as [
      string,
      { method: string; body: FormData },
    ];
    expect(url).toBe("/api/events");
    expect(options.method).toBe("POST");
    expect(options.body).toBeInstanceOf(FormData);

    const body = options.body;

    // --- Basic Information ---
    expect(body.get("title")).toBe("Stellar Summit 2026");
    expect(body.get("description")).toBe(
      "An on-chain ticketing showcase for VeriTix builders.",
    );
    expect(body.get("coverImage")).toBe("https://example.com/cover.png");

    // --- Date & Time ---
    expect(body.get("startDate")).toBe("2026-12-01");
    expect(body.get("endDate")).toBe("2026-12-02");
    expect(body.get("startTime")).toBe("10:00");
    expect(body.get("endTime")).toBe("18:00");

    // --- Location ---
    expect(body.get("eventType")).toBe("physical");
    expect(body.get("venueName")).toBe("Stellar Hall");
    expect(body.get("address")).toBe("123 Main Street");
    expect(body.get("city")).toBe("Lagos");

    // --- Tickets (the submit util appends array entries under the same key) ---
    expect(body.getAll("tickets").length).toBeGreaterThanOrEqual(1);

    // --- Blockchain ---
    expect(body.get("blockchainNetwork")).toBe("ethereum");
    expect(body.get("treasuryAddress")).toBe(
      "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    );
    expect(body.get("creatorRoyalty")).toBe("3");

    // --- Redirect to manage-events on success ---
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/events/manage");
    });
  });
});
