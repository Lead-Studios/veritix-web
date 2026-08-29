'use client';

export interface SummaryProps {
  eventName: string;
  ticketsSold: number;
  checkedIn: number;
}

export default function EventSummary({
  eventName,
  ticketsSold,
  checkedIn,
}: SummaryProps) {
  const noShows = Math.max(0, ticketsSold - checkedIn);
  const rate = ticketsSold > 0 ? ((checkedIn / ticketsSold) * 100).toFixed(1) : '0';

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 rounded-xl border border-white/10 bg-[#101428] text-white space-y-6">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold">{eventName} - Post Event Summary</h2>
          <p className="text-xs text-gray-400">Final attendance & check-in metrics</p>
        </div>
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
        >
          Export Summary (PDF)
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-white/5 border border-white/5">
          <span className="text-xs text-gray-400">Tickets Sold</span>
          <p className="text-2xl font-bold text-white pt-1">{ticketsSold}</p>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/5">
          <span className="text-xs text-gray-400">Checked In</span>
          <p className="text-2xl font-bold text-emerald-400 pt-1">{checkedIn}</p>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/5">
          <span className="text-xs text-gray-400">No Shows</span>
          <p className="text-2xl font-bold text-amber-400 pt-1">{noShows}</p>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/5">
          <span className="text-xs text-gray-400">Check-in Rate</span>
          <p className="text-2xl font-bold text-blue-400 pt-1">{rate}%</p>
        </div>
      </div>
    </div>
  );
}
