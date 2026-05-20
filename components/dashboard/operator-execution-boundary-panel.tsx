"use client";

import type { Route } from "next";
import Link from "next/link";

import {
  analyzeOperatorExecutionBoundaryLead,
  getOperatorExecutionBoundarySummary,
  type ManualPrepPacket,
  type ManualPrepReadiness,
  type OperatorExecutionBoundaryLead,
} from "@/lib/operator-execution-boundary";
import type { StoredLead } from "@/lib/leads-storage";

type OperatorExecutionBoundaryPanelProps = {
  leads?: StoredLead[];
  lead?: StoredLead;
  compact?: boolean;
};

const readinessStyles: Record<ManualPrepReadiness, string> = {
  ready_for_manual_prep: "border-emerald-200 bg-emerald-50 text-emerald-800",
  needs_review: "border-amber-200 bg-amber-50 text-amber-800",
  blocked: "border-red-200 bg-red-50 text-red-800",
};

function formatLabel(value?: string) {
  return value ? value.replaceAll("_", " ") : "Unknown";
}

function getLeadName(lead: StoredLead) {
  const name = `${lead.firstName} ${lead.lastName}`.trim();

  return name || lead.ownerName || "Unknown lead";
}

function PillList({ items, tone = "neutral" }: { items: string[]; tone?: "neutral" | "safe" | "danger" }) {
  const styles = {
    neutral: "bg-[#eef2f3] text-primary",
    safe: "bg-emerald-50 text-emerald-800",
    danger: "bg-red-50 text-red-800",
  };

  return (
    <div className="flex flex-wrap gap-2">
      {items.length > 0 ? (
        items.map((item) => (
          <span key={item} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[tone]}`}>
            {item}
          </span>
        ))
      ) : (
        <span className="text-sm text-muted">None identified from current data.</span>
      )}
    </div>
  );
}

function PrepPacketCard({ packet }: { packet: ManualPrepPacket }) {
  return (
    <article className="rounded-2xl border border-border bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-primary">{packet.title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted">{packet.reason}</p>
        </div>
        <span className={`w-fit rounded-md border px-2 py-1 text-xs font-bold ${readinessStyles[packet.readiness]}`}>
          {formatLabel(packet.readiness)}
        </span>
      </div>

      <div className="mt-3 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-950">
        <span className="font-semibold">Recommended manual step:</span> {packet.recommendedManualStep}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Manual checklist</p>
          <ul className="space-y-2 text-sm leading-6 text-muted">
            {packet.checklist.slice(0, 6).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Blockers</p>
            <PillList items={packet.blockers.slice(0, 6)} tone="danger" />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Missing information</p>
            <PillList items={packet.missingInformation.slice(0, 6)} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {packet.safetyNotes.map((note) => (
          <span key={note} className="rounded-full bg-[#f5dfdc] px-2.5 py-1 text-xs font-semibold text-[#9f3a22]">
            {note}
          </span>
        ))}
      </div>
    </article>
  );
}

function LeadPrepOverview({ item }: { item: OperatorExecutionBoundaryLead }) {
  return (
    <article className="rounded-2xl border border-border bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <Link href={`/dashboard/leads/${item.lead.id}` as Route} className="font-semibold text-primary hover:underline">
            {getLeadName(item.lead)}
          </Link>
          <p className="mt-1 text-sm leading-6 text-muted">{item.lead.propertyAddress || "No property address captured"}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{item.pilotReason}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-700">
            Rank {item.revenue.monetizationRank}
          </span>
          <span className={`rounded-md border px-2 py-1 text-xs font-bold ${readinessStyles[item.manualSellerCallPrep.readiness]}`}>
            {formatLabel(item.manualSellerCallPrep.readiness)}
          </span>
        </div>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase text-slate-500">Approval</p>
          <p className="mt-1 text-sm font-bold text-slate-900">{formatLabel(item.approvalState)}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase text-slate-500">DNC</p>
          <p className="mt-1 text-sm font-bold text-slate-900">{item.dncState}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase text-slate-500">Manual step</p>
          <p className="mt-1 text-sm font-bold text-slate-900">{item.manualSellerCallPrep.recommendedManualStep}</p>
        </div>
      </div>
    </article>
  );
}

function DetailPrepView({ lead }: { lead: StoredLead }) {
  const item = analyzeOperatorExecutionBoundaryLead(lead);

  return (
    <section className="rounded-xl border bg-white p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Controlled Operational Prep Boundary</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Manual-action prep only. No outreach sent, no automation executed, no provider called, and no documents generated.
          </p>
        </div>
        <span className="w-fit rounded-full bg-[#e7eef5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#355066]">
          Approval is not execution
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded border bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase text-gray-500">Pilot state</p>
          <p className="mt-1 text-sm font-bold text-gray-900">{item.pilotEligible ? "Eligible for prep" : "Needs review"}</p>
        </div>
        <div className="rounded border bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase text-gray-500">Approval</p>
          <p className="mt-1 text-sm font-bold text-gray-900">{formatLabel(item.approvalState)}</p>
        </div>
        <div className="rounded border bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase text-gray-500">DNC</p>
          <p className="mt-1 text-sm font-bold text-gray-900">{item.dncState}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <PrepPacketCard packet={item.manualSellerCallPrep} />
        <PrepPacketCard packet={item.manualBuyerDispositionPrep} />
        <PrepPacketCard packet={item.manualClosingPrep} />
      </div>
    </section>
  );
}

export function OperatorExecutionBoundaryPanel({ leads = [], lead, compact = false }: OperatorExecutionBoundaryPanelProps) {
  if (lead) {
    return <DetailPrepView lead={lead} />;
  }

  const summary = getOperatorExecutionBoundarySummary(leads);

  return (
    <section className="rounded-[1.5rem] border border-border bg-surface p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">Controlled operational execution boundary</h2>
          <p className="max-w-3xl text-sm leading-6 text-muted">
            Prep-only boundary for first real-world revenue workflow. Operators may prepare manual action, but the system sends nothing, calls no providers, executes no automation, and generates no documents.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-[#e7eef5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#355066]">
          Manual action only
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {summary.safetyLabels.map((label) => (
          <span key={label} className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#355066]">
            {label}
          </span>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-white p-4">
        <h3 className="text-lg font-semibold text-primary">First workflow pilot</h3>
        <p className="mt-2 text-sm leading-6 text-muted">{summary.firstWorkflowPilot}</p>
        <div className="mt-3 grid gap-2 md:grid-cols-5">
          {summary.pilotFlow.map((step) => (
            <div key={step} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold leading-5 text-slate-700">
              {step}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Operators may do manually</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
            {summary.operatorMayDo.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">AI may recommend</h3>
          <PillList items={summary.aiMayRecommend} tone="safe" />
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">AI must never execute yet</h3>
          <PillList items={summary.aiMustNeverExecute} tone="danger" />
        </div>
      </div>

      {!compact ? (
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <div>
            <h3 className="mb-3 text-lg font-semibold text-primary">Seller call prep pilot candidates</h3>
            <div className="space-y-3">
              {summary.pilotCandidates.length > 0 ? (
                summary.pilotCandidates.map((item) => <LeadPrepOverview key={item.lead.id} item={item} />)
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted">
                  No approved, non-DNC, high-priority seller call prep candidates detected from current leads.
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-primary">Blocked manual prep</h3>
            <div className="space-y-3">
              {summary.blockedManualPrep.length > 0 ? (
                summary.blockedManualPrep.map((item) => <LeadPrepOverview key={item.lead.id} item={item} />)
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted">
                  No blocked manual prep items detected from current leads.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Human approval required for</h3>
          <PillList items={summary.humanApprovalRequiredFor} />
        </div>
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-lg font-semibold text-primary">Mock / dry-run only</h3>
          <PillList items={summary.mockDryRunOnly} />
        </div>
      </div>
    </section>
  );
}
