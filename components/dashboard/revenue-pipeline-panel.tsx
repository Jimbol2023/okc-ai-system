"use client";

import type { Route } from "next";
import Link from "next/link";

import { analyzeClosingReadiness } from "@/lib/closing-readiness";
import { analyzeDispositionReadiness } from "@/lib/disposition-readiness";
import { getRevenuePipelineSummary, type RevenuePipelineLead, type RevenueUrgency } from "@/lib/revenue-pipeline";
import type { StoredLead } from "@/lib/leads-storage";

type RevenuePipelinePanelProps = {
  leads: StoredLead[];
};

const urgencyStyles: Record<RevenueUrgency, string> = {
  critical: "border-red-200 bg-red-50 text-red-800",
  high: "border-orange-200 bg-orange-50 text-orange-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-slate-200 bg-slate-50 text-slate-700",
  blocked: "border-red-300 bg-red-50 text-red-800",
};

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

function WorkFirstCard({ item }: { item: RevenuePipelineLead }) {
  const dispositionReadiness = analyzeDispositionReadiness(item.lead);
  const closingReadiness = analyzeClosingReadiness(item.lead);

  return (
    <article className="rounded-2xl border border-border bg-white p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <Link href={`/dashboard/leads/${item.lead.id}` as Route} className="font-semibold text-primary hover:underline">
            {getLeadName(item.lead)}
          </Link>
          <p className="mt-1 text-sm text-muted">{item.lead.propertyAddress}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-700">
            Rank {item.monetizationRank}
          </span>
          <span className={`rounded-md border px-2 py-1 text-xs font-bold ${urgencyStyles[item.urgency]}`}>
            {item.urgency}
          </span>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase text-slate-500">Bucket</p>
          <p className="mt-1 text-sm font-bold text-slate-900">{item.bucket.replaceAll("_", " ")}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase text-slate-500">Lead score</p>
          <p className="mt-1 text-sm font-bold text-slate-900">{item.lead.score} / {item.lead.priority}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase text-slate-500">Estimated value</p>
          <p className="mt-1 text-sm font-bold text-slate-900">{item.estimatedValueLabel}</p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 sm:col-span-3">
          <p className="text-xs font-semibold uppercase text-slate-500">Buyer readiness</p>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {dispositionReadiness.buyerReadiness.replaceAll("_", " ")} | {dispositionReadiness.assignmentReadiness.replaceAll("_", " ")}
          </p>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 sm:col-span-3">
          <p className="text-xs font-semibold uppercase text-slate-500">Closing readiness</p>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {closingReadiness.readinessState.replaceAll("_", " ")} | risk {closingReadiness.revenueRealizationRisk.replaceAll("_", " ")}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-950">
        <span className="font-semibold">Next money action:</span> {item.nextMoneyAction.label}
        <p className="mt-1 leading-5">{item.nextMoneyAction.reason}</p>
      </div>

      {item.bottlenecks.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.bottlenecks.slice(0, 4).map((bottleneck) => (
            <span key={bottleneck} className="rounded-full bg-[#f5dfdc] px-2.5 py-1 text-xs font-semibold text-[#9f3a22]">
              {bottleneck}
            </span>
          ))}
        </div>
      ) : null}

      {item.estimatedValueAssumption ? (
        <p className="mt-3 text-xs leading-5 text-muted">{item.estimatedValueAssumption} Revenue estimates are not guarantees.</p>
      ) : null}
    </article>
  );
}

export function RevenuePipelinePanel({ leads }: RevenuePipelinePanelProps) {
  const summary = getRevenuePipelineSummary(leads);

  return (
    <section className="rounded-[1.5rem] border border-border bg-surface p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-primary">Revenue pipeline cockpit</h2>
          <p className="max-w-3xl text-sm leading-6 text-muted">
            Read-only monetization guidance for deciding what to work first. Guidance only. No outreach sent. Approval is not execution.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-[#e7eef5] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#355066]">
          Simulation/live execution disabled
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiTile label="Actionable" value={String(summary.actionableLeads)} helper="Revenue-relevant leads not hard-blocked" />
        <KpiTile label="Blocked" value={String(summary.blockedLeads)} helper="DNC, rejected, or invalid contact data" />
        <KpiTile label="Hot opportunities" value={String(summary.hotOpportunities)} helper="High score, high priority, or hot" />
        <KpiTile label="Buyer ready" value={String(summary.buyerReadyLeads)} helper="Approved, high-signal leads for future disposition review" />
        <KpiTile label="Near contract" value={String(summary.nearContractLeads)} helper="Negotiating or approved high-opportunity leads" />
        <KpiTile label="Under contract" value={String(summary.underContractLeads)} helper="Closest to closing workflow review" />
        <KpiTile label="Closing ready" value={String(summary.closingReadyLeads)} helper="Read-only title/contract readiness looks strongest" />
        <KpiTile label="Closing blocked" value={String(summary.closingBlockedLeads)} helper="Under-contract leads missing closing data" />
        <KpiTile label="Est. pipeline value" value={summary.estimatedPipelineValueLabel} helper="Assumption-based, not guaranteed revenue" />
      </div>

      {summary.missingValueReasons.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span className="font-semibold">Missing value data:</span> {summary.missingValueReasons.join(", ")}.
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-primary">Work for revenue first</h3>
            <Link href={"/dashboard/leads" as Route} className="text-sm font-semibold text-primary hover:underline">
              View leads
            </Link>
          </div>
          <div className="grid gap-3">
            {summary.workFirstLeads.length > 0 ? (
              summary.workFirstLeads.map((item) => <WorkFirstCard key={item.lead.id} item={item} />)
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted">
                No revenue-first leads yet. Add lead data, scoring context, approval state, and follow-up details.
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-primary">Where revenue is trapped</h3>
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
                No bottlenecks detected from current lead data.
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs leading-5 text-muted">
        Revenue estimates are not guarantees. This panel does not send SMS, email, buyer messages, contracts, or automation.
      </p>
    </section>
  );
}
