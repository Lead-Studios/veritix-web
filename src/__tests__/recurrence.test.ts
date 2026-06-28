import { describe, expect, it } from "vitest";

import {
  DEFAULT_RECURRENCE,
  dayLabel,
  describeRecurrence,
  formatOccurrenceLabel,
  generateOccurrences,
} from "@/lib/recurrence";

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

describe("recurrence helpers", () => {
  it("wraps day labels for out-of-range values", () => {
    expect(dayLabel(-1)).toBe("Sat");
    expect(dayLabel(8)).toBe("Mon");
  });

  it("generates daily occurrences with a count limit", () => {
    const occurrences = generateOccurrences("2026-06-27", {
      ...DEFAULT_RECURRENCE,
      frequency: "daily",
      interval: 2,
      endType: "count",
      count: 3,
    });

    expect(occurrences.map(localDateKey)).toEqual([
      "2026-06-27",
      "2026-06-29",
      "2026-07-01",
    ]);
  });

  it("generates weekly occurrences for selected weekdays", () => {
    const occurrences = generateOccurrences("2026-06-24", {
      ...DEFAULT_RECURRENCE,
      frequency: "weekly",
      daysOfWeek: [1, 5],
      endType: "count",
      count: 3,
    });

    expect(occurrences.map(localDateKey)).toEqual([
      "2026-06-26",
      "2026-06-29",
      "2026-07-03",
    ]);
  });

  it("describes recurrence and formats occurrence labels", () => {
    const config = {
      ...DEFAULT_RECURRENCE,
      frequency: "weekly" as const,
      daysOfWeek: [1, 3],
      endType: "date" as const,
      until: "2026-07-15",
    };

    expect(describeRecurrence(config)).toBe(
      "Every week on Mon, Wed, until 2026-07-15"
    );
    expect(formatOccurrenceLabel(new Date(2026, 5, 29))).toBe(
      "Mon, Jun 29, 2026"
    );
  });
});
