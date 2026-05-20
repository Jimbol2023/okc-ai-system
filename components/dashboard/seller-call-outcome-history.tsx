"use client";

export type SellerCallOutcomeHistoryItem = {
  id: string;
  leadId: string;
  outcome: string;
  callCompletedAt: string;
  operatorSummary: string;
  sellerMotivationSignal: string;
  sellerTimelineSignal: string;
  propertyConditionSignal: string;
  priceExpectationSignal: string;
  manualNextStep: string;
  safetyFlags: string[];
  createdAt: string;
};

function formatLabel(value?: string) {
  return value ? value.replaceAll("_", " ") : "Unknown";
}

function formatDate(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown";
  }

  return parsedDate.toLocaleString();
}

export function SellerCallOutcomeHistory({ outcomes }: { outcomes: SellerCallOutcomeHistoryItem[] }) {
  return (
    <section className="rounded-xl border bg-white p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Seller Call Outcome History</h2>
          <p className="mt-1 text-sm text-gray-600">
            Append-only human-entered call outcomes. These records are visibility only and never execution commands.
          </p>
        </div>
        <span className="w-fit rounded border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold uppercase text-slate-700">
          Capture only
        </span>
      </div>

      {outcomes.length === 0 ? (
        <p className="mt-4 rounded border bg-gray-50 p-3 text-sm text-gray-600">
          No seller call outcomes have been captured yet.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {outcomes.map((outcome) => (
            <article key={outcome.id} className="rounded border border-border bg-gray-50 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-950">{formatLabel(outcome.outcome)}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase text-gray-500">
                    Completed {formatDate(outcome.callCompletedAt)}
                  </p>
                </div>
                <span className="w-fit rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold text-blue-800">
                  {formatLabel(outcome.manualNextStep)}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-700">{outcome.operatorSummary}</p>

              <div className="mt-3 grid gap-2 md:grid-cols-4">
                <div className="rounded border bg-white p-2">
                  <p className="text-xs font-semibold uppercase text-gray-500">Motivation</p>
                  <p className="text-sm font-semibold text-gray-900">{formatLabel(outcome.sellerMotivationSignal)}</p>
                </div>
                <div className="rounded border bg-white p-2">
                  <p className="text-xs font-semibold uppercase text-gray-500">Timeline</p>
                  <p className="text-sm font-semibold text-gray-900">{formatLabel(outcome.sellerTimelineSignal)}</p>
                </div>
                <div className="rounded border bg-white p-2">
                  <p className="text-xs font-semibold uppercase text-gray-500">Condition</p>
                  <p className="text-sm font-semibold text-gray-900">{formatLabel(outcome.propertyConditionSignal)}</p>
                </div>
                <div className="rounded border bg-white p-2">
                  <p className="text-xs font-semibold uppercase text-gray-500">Price</p>
                  <p className="text-sm font-semibold text-gray-900">{formatLabel(outcome.priceExpectationSignal)}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {outcome.safetyFlags.map((flag) => (
                  <span key={flag} className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-800">
                    {formatLabel(flag)}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
