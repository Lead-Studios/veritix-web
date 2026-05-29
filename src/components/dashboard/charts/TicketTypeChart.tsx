"use client";

import dynamic from "next/dynamic";
import type { TicketTypeBreakdown } from "@/hooks/useOrganizerAnalytics";

const TicketTypeChartInner = dynamic(
  () => import("./TicketTypeChartInner").then((m) => ({ default: m.TicketTypeChartInner })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[220px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4D21FF]/30 border-t-[#4D21FF]" />
      </div>
    ),
  }
);

interface Props {
  data: TicketTypeBreakdown[];
}

export function TicketTypeChart({ data }: Props) {
  return <TicketTypeChartInner data={data} />;
}
