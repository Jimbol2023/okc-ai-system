"use client";

import type { Route } from "next";
import Link from "next/link";

import {
  getOperatorWorkflowRhythmSummary,
  type ConceptualOwnerGroup,
  type EscalationTier,
  type WorkflowAgingTier,
  type WorkflowRhythmItem,
  type WorkflowRhythmState,
} from "@/lib/operator-workflow-rhythm";
import type { StoredLead } from "@/lib/leads-storage";

type OperatorWorkflowRhythmPanelProps = {
  leads: StoredLead[];
};

const agingStyles: Record<WorkflowAgingTier, string> = {
  fresh: "border-emerald-200 bg-emerald-50 text-emerald-800",
  aging: "border-amber-200 bg-amber-50 text-amber-800",
  overdue: "border-orange-200 bg-orange-50 text-orange-800",
  critical: "border-red-200 bg-red-50 text-red-800",
};

const escalationStyles: Record<EscalationTier, string> = {
  monitor: "border-slate-200 bg-slate-50 text-slate-700",
  action_needed: "border-amber-200 bg-amber-50 text-amber-800",
  urgent: "border-orange-200 bg-orange-50 text-orange-800",
  executive_attention: "border-red-200 bg-red-50 text-red-800",
};

const rhythmStyles: Record<WorkflowRhythmState, string> = {
  due_today: "border-blue-200 bg-blue-50 text-blue-800",
  due_soon: "border-cyan-200 bg-cyan-50 text-cyan-800",
  overdue: "border-red-200 bg-red-50 text-red-800",
  waiting: "border-amber-200 bg-amber-50 text-amber-800",
  blocked_waiting: "border-red-300 bg-red-50 text-red-800",
  monitor_only: "border-slate-200 bg-slate-50 text-slate-700",
  recently_updated: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

const ownerStyles: Record<ConceptualOwnerGroup, string> = {
  acquisition: "border-blue-200 bg-blue-50 text-blue-800",
  disposition: "border-violet-200 bg-violet-50 text-violet-800",
  closing: "border-emerald-200 bg-emerald-50 text-emerald-800",
  manual_review: "border-red-200 bg-red-50 text-red-800",
  data_quality: "border-amber-200 bg-amber-50 text-amber-800",
  monitor_only: "border-slate-200 bg-slate-50 text-slate-700",
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

function RhythmItemCard({ item, showTimeline = false }: { item: WorkflowRhythmItem; showTimeline?: boolean }) {
  const lead = item.workItem.lead;

  return (
    <article className="rounded-2xl border border-border bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <Link href={`/dashboard/leads/${lead.id}` as Route} className="font-semibold text-primary hover:underline">
            {getLeadName(lead)}
          </Link>
          <p className="mt-1 text-sm text-muted">{lead.propertyAddress || "No property address captured"}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-md border px-2 py-1 text-xs font-bold ${ownerStyles[item.ownerGroup]}`}>
            {formatLabel(item.ownerGroup)}
          </span>
          <span className={`rounded-md border px-2 py-1 text-xs font-bold ${agingStyles[item.agingTier]}`}>
            {formatLabel(item.agingTier)}
          </span>
          <span className={`rounded-md border px-2 py-1 text-xs font-bold ${escalationStyles[item.escalationTier]}`}>
            {formatLabel(item.escalationTier)}
          </span>
          <span className={`rounded-md border px-2 py-1 text-xs font-bold ${rhythmStyles[item.rhythmState]}`}>
            {formatLabel(item.rhythmState)}
          </span>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase text-slate-500">Current stage</p>
          <p className="mt-1 text-sm font-bold text-slate-900">{formatLabel(item.workItem.currentStage)}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase text-slate-500">Next milestone</p>
          <p className="mt-1 text-sm font-bold text-slate-900">{item.nextExpectedMilestone}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase text-slate-500">Aging estimate</p>
          <p className="mt-1 text-sm font-bold text-slate-900">{item.stalledDurationEstimate ?? "Not derivable"}</p>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-950">
        <p className="font-semibold">Operational recommendation: {item.operationalRecommendation}</p>
        <p className="mt-1 leading-5">{item.whyInThisGroup}</p>
      </div>

      <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
        <p className="font-semibold">{item.expectation.expectedWorkflowRhythm}</p>
        <p className="mt-1 leading-5">{item.expectation.currentStatus}</p>
        <p className="mt-1 text-xs font-semibold text-slate-600">{item.expectation.escalationSuggestion}</p>
      </div>

      {item.workItem.blocker ? (
        <p className="mt-3 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800">
          Blocker: {item.workItem.blocker}
        </p>
      ) : null}

      {showTimeline ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-3 xl:grid-cols-6">
          {item.refinedTimeline.map((stage) => (
            <div key={stage.stage} className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-2">
              <p className="text-xs font-black uppercase text-slate-700">{stage.label}</p>
              <p className="mt-1 text-xs leading-4 text-slate-600">{formatLabel(stage.status)}</p>
              {stage.rhythmState ? <p className="mt-1 text-xs font-semibold text-slate-500">{formatLabel(stage.rhythmState)}</p> : null}
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function RhythmList({ title, items, emptyText }: { title: string; items: WorkflowRhythmItem[]; emptyText: string }) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-primary">{title}</h3>
      <div className="space-y-3">
        {items.length > 0 ? (
          items.slice(0, 3).map((item) => <RhythmItemCard key={`${title}-${item.workItem.lead.id}`} item={item} />)
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted">{emptyText}</div>
        )}
      </div>
    </div>
  );
}

export function OperatorWorkflowRhythmPanel({ leads }: OperatorWorkflowRhythmPanelProps) {
  const summary = getOperatorWorkflowRhythmSummary(leads);

  return (
    <section className="rounded-[1.5rem] border border-border bg-surface p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">Workflow rhythm</h2>
          <p className="max-w-3xl text-sm leading-6 text-muted">
            Advisory aging, escalation, SLA-style timing, and conceptual ownership visibility. Guidance only. No outreach sent, no automation executed, and no documents generated.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-[#e7eef5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#355066]">
          Operational timing guidance only
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiTile label="Urgent" value={String(summary.urgentCount)} helper="Urgent or executive-attention items" />
        <KpiTile label="Overdue" value={String(summary.overdueCount)} helper="Overdue or critical timing items" />
        <KpiTile label="Blocked" value={String(summary.blockedCount)} helper="Blocked waiting on human review" />
        <KpiTile label="Stale / aging" value={String(summary.staleCount)} helper="Aging, overdue, or critical items" />
        <KpiTile label="Title blockers" value={String(summary.titleBlockerCount)} helper="Items waiting on title visibility" />
        <KpiTile label="Contract risk" value={String(summary.underContractRiskCount)} helper="Under-contract items with risk" />
        <KpiTile label="Monitor only" value={String(summary.monitorOnlyCount)} helper="No active timing pressure" />
        <KpiTile label="Total rhythm items" value={String(summary.totalItems)} helper="Derived from operator workqueue" />
      </div>

      <div className="mt-5">
        <h3 className="mb-3 text-lg font-semibold text-primary">Critical aging</h3>
        <div className="grid gap-3">
          {summary.criticalAgingItems.length > 0 ? (
            summary.criticalAgingItems.map((item, index) => (
              <RhythmItemCard key={item.workItem.lead.id} item={item} showTimeline={index === 0} />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted">
              No critical aging items detected from current metadata.
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <RhythmList title="Due today" items={summary.dueTodayItems} emptyText="No due-today items detected." />
        <RhythmList title="Overdue" items={summary.overdueItems} emptyText="No overdue items detected." />
        <RhythmList title="Escalated deals" items={summary.escalatedItems} emptyText="No urgent escalation items detected." />
        <RhythmList title="Waiting on title" items={summary.waitingOnTitleItems} emptyText="No title-waiting items detected." />
        <RhythmList title="Waiting on seller" items={summary.waitingOnSellerItems} emptyText="No seller-waiting items detected." />
        <RhythmList title="Waiting on buyer" items={summary.waitingOnBuyerItems} emptyText="No buyer-waiting items detected." />
        <RhythmList title="Due soon" items={summary.dueSoonItems} emptyText="No due-soon items detected." />
        <RhythmList title="Monitor only" items={summary.monitorOnlyItems} emptyText="No monitor-only items detected." />
      </div>

      {summary.recentlyUpdatedItems.length > 0 ? (
        <div className="mt-5">
          <RhythmList title="Recently updated" items={summary.recentlyUpdatedItems} emptyText="No recently updated items detected." />
        </div>
      ) : null}

      <p className="mt-5 text-xs leading-5 text-muted">
        Workflow rhythm is advisory only. It does not assign users, notify anyone, contact sellers, contact buyers, contact title companies, send SMS/email, generate documents, or execute automation.
      </p>
    </section>
  );
}
