import type { OrganizerAnalytics } from "@/hooks/useOrganizerAnalytics";

function toCsv(rows: Record<string, string | number>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")),
  ];
  return lines.join("\n");
}

export function exportAnalyticsCsv(data: OrganizerAnalytics, dateRange?: string): void {
  const suffix = dateRange ? ` (${dateRange})` : "";

  const revenueRows = data.revenue.map((d) => ({ Day: d.day, Revenue: d.revenue }));
  const performanceRows = data.performance.map((d) => ({ Day: d.day, Value: d.value }));
  const summaryRows = [
    { Metric: "Total Earned", Value: data.totalEarned },
    { Metric: "Payouts Queued", Value: data.payoutsQueued },
    { Metric: "Next Settlement (days)", Value: data.nextSettlementDays },
  ];

  const sections: string[] = [
    `Summary${suffix}`,
    toCsv(summaryRows),
    "",
    "Revenue by Day",
    toCsv(revenueRows),
    "",
    "Performance by Day",
    toCsv(performanceRows),
  ];

  if (data.ticketBreakdown?.length) {
    const ticketRows = data.ticketBreakdown.map((t) => ({
      "Ticket Type": t.type,
      Count: t.count,
      Revenue: t.revenue,
    }));
    sections.push("", "Ticket Type Breakdown", toCsv(ticketRows));
  }

  if (data.demographics) {
    const { region, deviceType, referralSource } = data.demographics;
    if (region.length) {
      sections.push("", "Demographics - Region", toCsv(region.map((d) => ({ Label: d.label, Count: d.count, "Percentage (%)": d.percentage }))));
    }
    if (deviceType.length) {
      sections.push("", "Demographics - Device Type", toCsv(deviceType.map((d) => ({ Label: d.label, Count: d.count, "Percentage (%)": d.percentage }))));
    }
    if (referralSource.length) {
      sections.push("", "Demographics - Referral Source", toCsv(referralSource.map((d) => ({ Label: d.label, Count: d.count, "Percentage (%)": d.percentage }))));
    }
  }

  const blob = new Blob([sections.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `analytics${suffix}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
