"use client";

import type { Route } from "next";
import Link from "next/link";

import {
  getOperatorWorkqueueSummary,
  type OperatorRiskTier,
  type OperatorUrgencyTier,
  type OperatorWorkqueueItem,
} from "@/lib/operator-workqueue";
import type { StoredLead } from "@/lib/leads-storage";

type OperatorCommandCenterPanelProps = {
  leads: StoredLead[];
};

const urgencyStyles: Record<OperatorUrgencyTier, string> = {
  critical: "border-red-200 bg-red-50 text-red-800",
  high: "border-orange-200 bg-orange-50 text-orange-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-slate-200 bg-slate-50 text-slate-700",
};

const riskStyles: Record<OperatorRiskTier, string> = {
  blocked: "border-red-300 bg-red-50 text-red-800",
  high_risk: "border-orange-200 bg-orange-50 text-orange-800",
  medium_risk: "border-amber-200 bg-amber-50 text-amber-800",
  low_risk: "border-emerald-200 bg-emerald-50 text-emerald-800",
  unknown: "border-slate-200 bg-slate-50 text-slate-700",
};

function formatLabel(value?: string) {
  return value ? value.replaceAll("_", " ") : "Unknown";
}

function getLeadName(lead: StoredLead) {
  const name = `${lead.firstName} ${lead.lastName}`.trim();

  return name || lead.ownerName || "Unknown lead";
}

function KpiTile({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{helper}</p>
    </div>
  );
}

function Timeline({ item }: { item: OperatorWorkqueueItem }) {
  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
      {item.timeline.map((stage) => (
        <div
          key={stage.stage}
          className={`rounded-md border px-2.5 py-2 ${
            stage.status === "blocked"
              ? "border-red-200 bg-red-50"
              : stage.status === "stalled"
                ? "border-orange-200 bg-orange-50"
                : stage.status === "current"
                  ? "border-blue-200 bg-blue-50"
                  : stage.status === "complete"
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-200 bg-slate-50"
          }`}
        >
          <p className="text-xs font-black uppercase text-slate-700">{stage.label}</p>
          <p className="mt-1 text-xs leading-4 text-slate-600">{formatLabel(stage.status)}</p>
        </div>
      ))}
    </div>
  );
}

function WorkItemCard({ item, showTimeline = false }: { item: OperatorWorkqueueItem; showTimeline?: boolean }) {
  return (
    <article className="rounded-2xl border border-border bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <Link href={`/dashboard/leads/${item.lead.id}` as Route} className="font-semibold text-primary hover:underline">
            {getLeadName(item.lead)}
          </Link>
          <p className="mt-1 text-sm text-muted">{item.lead.propertyAddress || "No property address captured"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-700">
            Rank {item.operatorPriorityRank}
          </span>
          <span className={`rounded-md border px-2 py-1 text-xs font-bold ${urgencyStyles[item.urgencyTier]}`}>
            {formatLabel(item.urgencyTier)}
          </span>
          <span className={`rounded-md border px-2 py-1 text-xs font-bold ${riskStyles[item.riskTier]}`}>
            {formatLabel(item.riskTier)}
          </span>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase text-slate-500">Current stage</p>
          <p className="mt-1 text-sm font-bold text-slate-900">{formatLabel(item.currentStage)}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase text-slate-500">Next stage</p>
          <p className="mt-1 text-sm font-bold text-slate-900">{formatLabel(item.nextStage)}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase text-slate-500">Review state</p>
          <p className="mt-1 text-sm font-bold text-slate-900">{formatLabel(item.humanReviewState)}</p>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-950">
        <span className="font-semibold">Recommended next action:</span> {item.recommendedNextAction.label}
        <p className="mt-1 leading-5">{item.recommendedNextAction.reason}</p>
      </div>

      {item.blocker ? (
        <p className="mt-3 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
          Blocker: {item.blocker}
        </p>
      ) : null}

      {item.stallReason ? (
        <p className="mt-3 rounded-md border border-orange-100 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-800">
          Stalled at {formatLabel(item.stalledStage)}: {item.stallReason}
        </p>
      ) : null}

      <p className="mt-3 text-sm leading-6 text-muted">{item.whyItMatters}</p>

      {showTimeline ? <Timeline item={item} /> : null}

      <div className="mt-3 flex flex-wrap gap-2">
        {item.bottlenecks.slice(0, 5).map((bottleneck) => (
          <span key={bottleneck} className="rounded-full bg-[#f5dfdc] px-2.5 py-1 text-xs font-semibold text-[#9f3a22]">
            {bottleneck}
          </span>
        ))}
      </div>
    </article>
  );
}

function ItemList({ title, items, emptyText }: { title: string; items: OperatorWorkqueueItem[]; emptyText: string }) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-primary">{title}</h3>
      <div className="space-y-3">
        {items.length > 0 ? (
          items.slice(0, 3).map((item) => <WorkItemCard key={`${title}-${item.lead.id}`} item={item} />)
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted">{emptyText}</div>
        )}
      </div>
    </div>
  );
}

export function OperatorCommandCenterPanel({ leads }: OperatorCommandCenterPanelProps) {
  const summary = getOperatorWorkqueueSummary(leads);

  return (
    <section className="rounded-[1.5rem] border border-border bg-surface p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">Operator command center</h2>
          <p className="max-w-3xl text-sm leading-6 text-muted">
            Unified read-only workqueue across acquisition, disposition, assignment, and closing. Guidance only. No outreach sent, no automation executed, and no documents generated.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-[#e7eef5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#355066]">
          Operator review required
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiTile label="Work items" value={String(summary.totalItems)} helper="Ranked advisory queue" />
        <KpiTile label="Critical" value={String(summary.criticalItems)} helper="Highest urgency or blocked revenue work" />
        <KpiTile label="Revenue at risk" value={String(summary.highRiskItems)} helper="Blocked or high-risk operational items" />
        <KpiTile label="Human review" value={String(summary.manualReviewItems)} helper="Manual review required before progress" />
        <KpiTile label="Stalled" value={String(summary.stalledItems)} helper="Detected stage or follow-up stagnation" />
        <KpiTile label="Buyer ready" value={String(summary.buyerReadyItems)} helper="Ready for internal disposition review" />
        <KpiTile label="Under contract" value={String(summary.underContractItems)} helper="Closest to assignment or closing work" />
        <KpiTile label="Closing blocked" value={String(summary.closingBlockedItems)} helper="Title, contract, buyer, or closing blocker" />
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-primary">Work first today</h3>
          <Link href={"/dashboard/leads" as Route} className="text-sm font-semibold text-primary hover:underline">
            View all leads
          </Link>
        </div>
        <div className="grid gap-3">
          {summary.workFirstItems.length > 0 ? (
            summary.workFirstItems.map((item, index) => (
              <WorkItemCard key={item.lead.id} item={item} showTimeline={index === 0} />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted">
              No operator workqueue items yet. Add leads, scores, approval states, disposition data, and closing data.
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <ItemList title="Revenue at risk" items={summary.revenueAtRiskItems} emptyText="No high-risk revenue items detected." />
        <ItemList title="Urgent human review" items={summary.urgentHumanReviewItems} emptyText="No urgent human-review items detected." />
        <ItemList title="Stalled deals" items={summary.stalledDealItems} emptyText="No stalled deals detected from current lead data." />
        <ItemList title="Closing blocked" items={summary.closingBlockedItemsList} emptyText="No closing-blocked deals detected." />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <ItemList title="Buyer ready" items={summary.buyerReadyItemsList} emptyText="No buyer-ready deals detected yet." />
        <div>
          <h3 className="mb-3 text-lg font-semibold text-primary">Cash flow blocked by</h3>
          <div className="space-y-3">
            {summary.topBottlenecks.length > 0 ? (
              summary.topBottlenecks.map((item) => (
                <div key={item.label} className="rounded-2xl border border-border bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-primary">{item.label}</p>
                    <span className="rounded-full bg-[#eef2f3] px-2.5 py-1 text-xs font-bold text-primary">{item.count}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted">
                No operational bottlenecks detected from current lead data.
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs leading-5 text-muted">
        This command center is advisory only. It does not contact sellers, buyers, title companies, providers, send SMS/email, generate documents, or execute automation.
      </p>
    </section>
  );
}
