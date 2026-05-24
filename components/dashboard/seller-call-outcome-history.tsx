"use client";

import type { SellerCallOutcomeUsabilityModel } from "@/lib/seller-call-outcome-usability";

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

export function SellerCallOutcomeHistory({
  outcomes,
  usability,
}: {
  outcomes: SellerCallOutcomeHistoryItem[];
  usability?: SellerCallOutcomeUsabilityModel;
}) {
  const rows =
    usability?.historyScanRows ??
    outcomes.map((outcome) => ({
      id: outcome.id,
      outcomeLabel: formatLabel(outcome.outcome),
      completedAtLabel: formatDate(outcome.callCompletedAt),
      manualNextStepLabel: formatLabel(outcome.manualNextStep),
      sellerSignalSummary: `Motivation ${formatLabel(outcome.sellerMotivationSignal)}; timeline ${formatLabel(outcome.sellerTimelineSignal)}; condition ${formatLabel(outcome.propertyConditionSignal)}; price ${formatLabel(outcome.priceExpectationSignal)}.`,
      operatorSummary: outcome.operatorSummary,
      safetyFlags: outcome.safetyFlags,
    }));

  return (
    <section className="rounded-xl border bg-white p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Seller call outcome history</h2>
          <p className="mt-1 text-sm text-gray-600">
            Latest manual outcome first. These records are visibility only and never execution commands.
          </p>
        </div>
        <span className="w-fit rounded border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold uppercase text-slate-700">
          Capture only
        </span>
      </div>

      {rows.length === 0 ? (
        <p className="mt-4 rounded border bg-gray-50 p-3 text-sm text-gray-600">
          No seller call outcomes have been captured yet. After a completed manual seller call, record the outcome, seller signals, safe manual next review, and a short internal summary here.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {rows.map((row) => (
            <article key={row.id} className="rounded border border-border bg-gray-50 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-950">{row.outcomeLabel}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase text-gray-500">
                    Completed {row.completedAtLabel}
                  </p>
                </div>
                <span className="w-fit rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold text-blue-800">
                  {row.manualNextStepLabel}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-700">{row.operatorSummary}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-gray-900">{row.sellerSignalSummary}</p>

              <div className="mt-3 grid gap-2 md:grid-cols-4">
                {row.sellerSignalSummary.split("; ").map((signal) => (
                  <div key={signal} className="rounded border bg-white p-2">
                    <p className="text-xs font-semibold uppercase text-gray-500">{signal.split(" ")[0]}</p>
                    <p className="text-sm font-semibold text-gray-900">{signal.split(" ").slice(1).join(" ")}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {row.safetyFlags.map((flag) => (
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
