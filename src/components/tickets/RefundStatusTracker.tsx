"use client";

interface RefundStatusTrackerProps {
  status: "none" | "requested" | "approved" | "processing" | "completed" | "rejected";
  requestedAt?: string;
  approvedAt?: string;
  completedAt?: string;
  reason?: string;
}

const STEPS = ["requested", "approved", "processing", "completed"] as const;

const STEP_LABELS: Record<string, string> = {
  requested: "Refund Requested",
  approved: "Approved",
  processing: "Processing",
  completed: "Completed",
};

export function RefundStatusTracker({
  status,
  requestedAt,
  approvedAt,
  completedAt,
  reason,
}: RefundStatusTrackerProps) {
  if (status === "none") return null;

  const currentIndex = STEPS.indexOf(status as (typeof STEPS)[number]);

  return (
    <div className="rounded-xl border border-white/10 bg-[#020718]/80 p-5 space-y-4">
      <h3 className="text-sm font-semibold text-white">Refund Status</h3>

      {status === "rejected" ? (
        <div className="rounded-lg border border-red-700/30 bg-red-900/10 p-3 text-sm text-red-300">
          <p className="font-medium">Refund Rejected</p>
          {reason && <p className="text-xs mt-1 text-red-400">{reason}</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const isCompleted = i <= currentIndex;
            const isCurrent = i === currentIndex;
            const isPending = i > currentIndex;

            let timestamp: string | undefined;
            if (step === "requested") timestamp = requestedAt;
            if (step === "approved") timestamp = approvedAt;
            if (step === "completed") timestamp = completedAt;

            return (
              <div key={step} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isCompleted
                        ? "bg-green-500 border-green-500"
                        : isCurrent
                          ? "border-yellow-500"
                          : "border-gray-600"
                    }`}
                  >
                    {isCompleted && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`w-0.5 h-6 ${
                        i < currentIndex ? "bg-green-500" : "bg-gray-700"
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p
                    className={`text-sm ${
                      isCompleted
                        ? "text-green-300"
                        : isCurrent
                          ? "text-yellow-300"
                          : "text-gray-500"
                    }`}
                  >
                    {STEP_LABELS[step]}
                    {isCurrent && status !== "completed" && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs text-yellow-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                        In progress
                      </span>
                    )}
                  </p>
                  {timestamp && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(timestamp).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
