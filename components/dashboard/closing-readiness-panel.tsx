"use client";

import {
  analyzeClosingReadiness,
  type ClosingChecklistStatus,
  type ClosingReadinessState,
  type RevenueRealizationRisk,
} from "@/lib/closing-readiness";
import type { StoredLead } from "@/lib/leads-storage";

type ClosingReadinessPanelProps = {
  lead: StoredLead;
  compact?: boolean;
};

const readinessStyles: Record<ClosingReadinessState, string> = {
  closing_ready: "border-emerald-200 bg-emerald-50 text-emerald-800",
  almost_closing_ready: "border-blue-200 bg-blue-50 text-blue-800",
  not_closing_ready: "border-amber-200 bg-amber-50 text-amber-800",
  closing_blocked: "border-red-200 bg-red-50 text-red-800",
  not_applicable: "border-slate-200 bg-slate-50 text-slate-700",
};

const riskStyles: Record<RevenueRealizationRisk, string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  high: "border-orange-200 bg-orange-50 text-orange-800",
  blocked: "border-red-200 bg-red-50 text-red-800",
  unknown: "border-slate-200 bg-slate-50 text-slate-700",
};

const checklistStyles: Record<ClosingChecklistStatus, string> = {
  complete: "border-emerald-200 bg-emerald-50 text-emerald-800",
  missing: "border-red-200 bg-red-50 text-red-800",
  review_needed: "border-amber-200 bg-amber-50 text-amber-800",
  not_applicable: "border-slate-200 bg-slate-50 text-slate-700",
};

function formatLabel(value?: string) {
  return value ? value.replaceAll("_", " ") : "Unknown";
}

function ChecklistGroup({
  title,
  items,
  compact,
}: {
  title: string;
  items: ReturnType<typeof analyzeClosingReadiness>["contractChecklist"];
  compact: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-gray-500">{title}</p>
      <div className="mt-2 grid gap-2 md:grid-cols-2">
        {items.slice(0, compact ? 2 : items.length).map((item) => (
          <div key={item.key} className={`rounded border p-3 ${checklistStyles[item.status]}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-bold">{item.label}</p>
              <span className="text-xs font-black uppercase">{formatLabel(item.status)}</span>
            </div>
            {!compact ? <p className="mt-1 text-xs leading-5">{item.reason}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClosingReadinessPanel({ lead, compact = false }: ClosingReadinessPanelProps) {
  const readiness = analyzeClosingReadiness(lead);

  return (
    <section className={`rounded-xl border bg-white ${compact ? "p-4" : "p-5"}`}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className={compact ? "text-lg font-bold" : "text-xl font-bold"}>Closing Readiness</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Read-only title, contract, and closing guidance. No documents generated. No title company contacted.
          </p>
        </div>
        <span className={`w-fit rounded-md border px-3 py-1 text-xs font-black uppercase ${readinessStyles[readiness.readinessState]}`}>
          {formatLabel(readiness.readinessState)}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded border bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase text-gray-500">Readiness score</p>
          <p className="mt-1 text-2xl font-black text-gray-950">{readiness.readinessScore}/100</p>
        </div>
        <div className={`rounded border p-3 ${riskStyles[readiness.revenueRealizationRisk]}`}>
          <p className="text-xs font-semibold uppercase">Revenue realization risk</p>
          <p className="mt-1 text-sm font-black">{formatLabel(readiness.revenueRealizationRisk)}</p>
        </div>
        <div className="rounded border bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase text-gray-500">Deal status</p>
          <p className="mt-1 text-sm font-bold text-gray-950">{formatLabel(lead.status)}</p>
        </div>
      </div>

      <div className="mt-4 rounded border border-blue-100 bg-blue-50 p-3 text-sm text-blue-950">
        <p className="font-semibold">Closing-side next action: {readiness.nextClosingAction.label}</p>
        <p className="mt-1 leading-6">{readiness.nextClosingAction.reason}</p>
        {readiness.nextClosingAction.blocker ? (
          <p className="mt-1 text-xs font-semibold">Blocker: {readiness.nextClosingAction.blocker}</p>
        ) : null}
      </div>

      {readiness.bottlenecks.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase text-gray-500">Closing bottlenecks</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {readiness.bottlenecks.slice(0, compact ? 4 : 10).map((bottleneck) => (
              <span key={bottleneck} className="rounded-full bg-[#f5dfdc] px-2.5 py-1 text-xs font-semibold text-[#9f3a22]">
                {bottleneck}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {!compact ? (
        <div className="mt-4 grid gap-4">
          <ChecklistGroup title="Contract workflow" items={readiness.contractChecklist} compact={compact} />
          <ChecklistGroup title="Title workflow" items={readiness.titleChecklist} compact={compact} />
          <ChecklistGroup title="Earnest money / assignment" items={readiness.earnestMoneyChecklist} compact={compact} />
        </div>
      ) : null}

      {readiness.missingFields.length > 0 ? (
        <p className="mt-4 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Missing closing data: {readiness.missingFields.join(", ")}.
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {readiness.safetyNotes.map((note) => (
          <span key={note} className="rounded-full bg-[#e7eef5] px-2.5 py-1 text-xs font-semibold text-[#355066]">
            {note}
          </span>
        ))}
      </div>

      <p className="mt-3 text-xs leading-5 text-gray-500">
        Revenue realization guidance is assumption-based and not a guarantee. This panel does not execute closing, documents, outreach, title communication, SMS, or email.
      </p>
    </section>
  );
}
