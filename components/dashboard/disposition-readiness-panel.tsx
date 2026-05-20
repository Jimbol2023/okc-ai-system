"use client";

import { analyzeDispositionReadiness, type BuyerReadinessState, type DispositionChecklistStatus } from "@/lib/disposition-readiness";
import type { StoredLead } from "@/lib/leads-storage";

type DispositionReadinessPanelProps = {
  lead: StoredLead;
  compact?: boolean;
};

const readinessStyles: Record<BuyerReadinessState, string> = {
  buyer_ready: "border-emerald-200 bg-emerald-50 text-emerald-800",
  almost_buyer_ready: "border-blue-200 bg-blue-50 text-blue-800",
  not_buyer_ready: "border-amber-200 bg-amber-50 text-amber-800",
  blocked: "border-red-200 bg-red-50 text-red-800",
};

const checklistStyles: Record<DispositionChecklistStatus, string> = {
  complete: "border-emerald-200 bg-emerald-50 text-emerald-800",
  missing: "border-red-200 bg-red-50 text-red-800",
  review_needed: "border-amber-200 bg-amber-50 text-amber-800",
};

function getLeadName(lead: StoredLead) {
  const name = `${lead.firstName} ${lead.lastName}`.trim();

  return name || lead.ownerName || "Unknown lead";
}

function formatLabel(value?: string) {
  return value ? value.replaceAll("_", " ") : "Unknown";
}

export function DispositionReadinessPanel({ lead, compact = false }: DispositionReadinessPanelProps) {
  const readiness = analyzeDispositionReadiness(lead);

  return (
    <section className={`rounded-xl border bg-white ${compact ? "p-4" : "p-5"}`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className={compact ? "text-lg font-bold" : "text-xl font-bold"}>Buyer / Disposition Readiness</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Internal disposition guidance only. No buyer outreach, SMS, email, contract, or assignment execution occurs.
          </p>
        </div>
        <span className={`w-fit rounded-md border px-3 py-1 text-xs font-black uppercase ${readinessStyles[readiness.buyerReadiness]}`}>
          {formatLabel(readiness.buyerReadiness)}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded border bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase text-gray-500">Readiness score</p>
          <p className="mt-1 text-2xl font-black text-gray-950">{readiness.buyerReadinessScore}/100</p>
        </div>
        <div className="rounded border bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase text-gray-500">Assignment readiness</p>
          <p className="mt-1 text-sm font-bold text-gray-950">{formatLabel(readiness.assignmentReadiness)}</p>
        </div>
        <div className="rounded border bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase text-gray-500">Lead</p>
          <p className="mt-1 truncate text-sm font-bold text-gray-950">{getLeadName(lead)}</p>
        </div>
      </div>

      <div className="mt-4 rounded border border-blue-100 bg-blue-50 p-3 text-sm text-blue-950">
        <p className="font-semibold">Buyer-side next action: {readiness.buyerSideNextAction.label}</p>
        <p className="mt-1 leading-6">{readiness.buyerSideNextAction.reason}</p>
      </div>

      {readiness.bottlenecks.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase text-gray-500">Disposition bottlenecks</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {readiness.bottlenecks.slice(0, compact ? 4 : 8).map((bottleneck) => (
              <span key={bottleneck} className="rounded-full bg-[#f5dfdc] px-2.5 py-1 text-xs font-semibold text-[#9f3a22]">
                {bottleneck}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {!compact ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase text-gray-500">Disposition package checklist</p>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {readiness.checklist.map((item) => (
              <div key={item.key} className={`rounded border p-3 ${checklistStyles[item.status]}`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold">{item.label}</p>
                  <span className="text-xs font-black uppercase">{formatLabel(item.status)}</span>
                </div>
                <p className="mt-1 text-xs leading-5">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-bold text-slate-950">Buyer match readiness</p>
        <p className="mt-1 text-xs leading-5 text-slate-600">
          Review package completeness and buyer-side readiness before any manual matching work. This panel does not call buyer matching routes or contact buyers.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {readiness.safetyNotes.map((note) => (
          <span key={note} className="rounded-full bg-[#e7eef5] px-2.5 py-1 text-xs font-semibold text-[#355066]">
            {note}
          </span>
        ))}
      </div>
    </section>
  );
}
