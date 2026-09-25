const PAYOUTS = [
  { ref: "ESC-001", amount: 1200, status: "Settled", date: "2026-09-10" },
  { ref: "ESC-002", amount: 850, status: "Escrowed", date: "-" },
  { ref: "ESC-003", amount: 3400, status: "Settled", date: "2026-09-18" },
  { ref: "ESC-004", amount: 960, status: "Escrowed", date: "-" },
];

export default function PayoutsPage() {
  const totalEscrowed = PAYOUTS
    .filter((p) => p.status === "Escrowed")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Payouts</h1>
      <p className="text-muted-foreground text-sm">
        Total still held in escrow:{" "}
        <span className="font-medium text-foreground">${totalEscrowed.toLocaleString()}</span>
      </p>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {["Escrow Ref", "Amount", "Status", "Settlement Date"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAYOUTS.map((p) => (
              <tr key={p.ref} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono">{p.ref}</td>
                <td className="px-4 py-3">${p.amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === "Settled" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
