"use client";

import { useEffect, useState } from "react";

type WorkspaceOutcome = {
  id: string;
  outcome: string;
  callCompletedAt: string;
  operatorSummary: string;
  sellerMotivationSignal: string;
  sellerTimelineSignal: string;
  propertyConditionSignal: string;
  priceExpectationSignal: string;
  manualNextStep: string;
};

type WorkspaceAssist = {
  id: string;
  nextSalesAction: string;
  callOpener: string;
  manualApprovalStatus: string;
  createdAt: string;
};

type WorkspaceQueueLead = {
  id: string;
  name: string;
  phone: string;
  propertyAddress: string;
  source: string;
  status: string;
  score: number;
  priority: string;
  ageDays: number;
  rank: number;
  blocked: boolean;
  missingFacts: string[];
  latestOutcome: WorkspaceOutcome | null;
  latestAssist: WorkspaceAssist | null;
  attributions: Array<{
    id: string;
    channel: string;
    sourceLabel: string;
    topic: string;
    attributionStatus: string;
  }>;
  manualIntakes: Array<{
    id: string;
    sourceLabel: string;
    intakeStatus: string;
    manualReviewStatus: string;
  }>;
  nextManualAction: string;
};

type SalesWorkspaceResponse = {
  success: boolean;
  queue?: WorkspaceQueueLead[];
  roi?: {
    totalLeads: number;
    activeQueue: number;
    blockedQueue: number;
    sourceCounts: Record<string, number>;
    pipelineCounts: Record<string, number>;
    sellerCallOutcomes: number;
    salesAssists: number;
    attributedLeads: number;
    manualSourceCaptures: number;
  };
  audit?: {
    status: string;
    summary: string;
    blockedCount: number;
    missingFactCount: number;
    outcomeCount: number;
    reviewNotes: string[];
  };
  safetyFlags?: Record<string, boolean>;
  error?: string;
};

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

function rankTone(lead: WorkspaceQueueLead) {
  if (lead.blocked) return "border-red-200 bg-red-50 text-red-900";
  if (lead.rank >= 90) return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (lead.rank >= 60) return "border-amber-200 bg-amber-50 text-amber-900";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export function SalesFollowUpWorkspaceClient() {
  const [queue, setQueue] = useState<WorkspaceQueueLead[]>([]);
  const [roi, setRoi] = useState<SalesWorkspaceResponse["roi"]>();
  const [audit, setAudit] = useState<SalesWorkspaceResponse["audit"]>();
  const [message, setMessage] = useState("Loading sales follow-up workspace...");
  const [selectedLeadId, setSelectedLeadId] = useState("");

  const selectedLead = queue.find((lead) => lead.id === selectedLeadId) ?? queue[0] ?? null;

  async function loadWorkspace() {
    const response = await fetch("/api/sales-workspace", {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });
    const data = (await response.json()) as SalesWorkspaceResponse;

    if (!response.ok || !data.success) {
      throw new Error(data.error ?? "Unable to load sales follow-up workspace.");
    }

    setQueue(data.queue ?? []);
    setRoi(data.roi);
    setAudit(data.audit);
    setMessage("Sales workspace loaded. Review remains manual; no outbound action was triggered.");
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadWorkspace().catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load sales workspace."));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] sm:p-6">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-xs font-bold uppercase tracking-[0.16em] text-muted">Phase 2H</p>
          <h2 className="break-words text-xl font-semibold text-primary">Sales Follow-Up Workspace</h2>
          <p className="max-w-3xl break-words text-sm leading-6 text-muted">
            Work captured seller leads from one manual queue with source context, call prep, missing facts, latest outcomes, and ROI visibility.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.08em]">
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-950">sent:false</span>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-950">providerCalled:false</span>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-950">automation:false</span>
        </div>
      </div>

      <div className="mt-5 rounded-[1rem] border border-blue-200 bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-950">
        {message}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-primary">Highest-priority seller work</h3>
              <p className="mt-1 text-sm leading-6 text-muted">Ranked by status, score, source capture, attribution, missing facts, and call outcome gaps.</p>
            </div>
            <button
              type="button"
              onClick={() => loadWorkspace().catch((error) => setMessage(error instanceof Error ? error.message : "Unable to refresh workspace."))}
              className="rounded-xl border border-border px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-primary"
            >
              Refresh
            </button>
          </div>

          <div className="mt-3 grid gap-3">
            {queue.slice(0, 10).map((lead) => (
              <button
                key={lead.id}
                type="button"
                onClick={() => setSelectedLeadId(lead.id)}
                className="rounded-xl border border-border bg-slate-50 p-3 text-left"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-primary">{lead.name}</p>
                    <p className="mt-1 text-sm text-muted">{lead.propertyAddress || "Property address missing"}</p>
                  </div>
                  <span className={`w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${rankTone(lead)}`}>
                    {lead.blocked ? "Blocked" : `Rank ${lead.rank}`}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{lead.nextManualAction}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">
                  {lead.source || "unknown source"} | {formatLabel(lead.status)} | score {lead.score} | {lead.ageDays}d old
                </p>
              </button>
            ))}
            {queue.length === 0 ? <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">No seller leads available for manual sales review.</p> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-base font-semibold text-primary">Call prep and outcome audit</h3>
          {selectedLead ? (
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-sm font-bold text-primary">{selectedLead.name}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{selectedLead.nextManualAction}</p>
              </div>

              {selectedLead.latestAssist ? (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-blue-950">
                  <p className="text-sm font-bold">Call opener</p>
                  <p className="mt-2 text-sm leading-6">{selectedLead.latestAssist.callOpener}</p>
                </div>
              ) : (
                <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
                  Generate a Sales Conversion Assist before using call prep language.
                </p>
              )}

              {selectedLead.missingFacts.length > 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-950">
                  <p className="text-sm font-bold">Missing before offer review</p>
                  <p className="mt-2 text-sm leading-6">{selectedLead.missingFacts.join(", ")}</p>
                </div>
              ) : (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
                  Core seller facts are captured for manual offer-readiness review.
                </p>
              )}

              {selectedLead.latestOutcome ? (
                <div className="rounded-xl border border-border bg-slate-50 p-3">
                  <p className="text-sm font-bold text-primary">Latest outcome: {formatLabel(selectedLead.latestOutcome.outcome)}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{selectedLead.latestOutcome.operatorSummary}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">
                    Next: {formatLabel(selectedLead.latestOutcome.manualNextStep)}
                  </p>
                </div>
              ) : (
                <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                  No seller call outcome captured yet.
                </p>
              )}

              {selectedLead.attributions.length > 0 || selectedLead.manualIntakes.length > 0 ? (
                <div className="rounded-xl border border-border bg-white p-3">
                  <p className="text-sm font-bold text-primary">Source evidence</p>
                  {selectedLead.attributions.map((attribution) => (
                    <p key={attribution.id} className="mt-2 text-sm leading-6 text-muted">
                      {formatLabel(attribution.channel)} / {attribution.sourceLabel}: {attribution.topic}
                    </p>
                  ))}
                  {selectedLead.manualIntakes.map((intake) => (
                    <p key={intake.id} className="mt-2 text-sm leading-6 text-muted">
                      Manual intake: {intake.sourceLabel} / {formatLabel(intake.intakeStatus)}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">Select a seller lead to review call prep.</p>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-base font-semibold text-primary">Source-to-sales ROI</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Active queue</p>
              <p className="mt-1 text-2xl font-bold text-primary">{roi?.activeQueue ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Manual captures</p>
              <p className="mt-1 text-2xl font-bold text-primary">{roi?.manualSourceCaptures ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Call outcomes</p>
              <p className="mt-1 text-2xl font-bold text-primary">{roi?.sellerCallOutcomes ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Attributed leads</p>
              <p className="mt-1 text-2xl font-bold text-primary">{roi?.attributedLeads ?? 0}</p>
            </div>
          </div>
          <div className="mt-3 grid gap-2">
            {Object.entries(roi?.sourceCounts ?? {}).slice(0, 6).map(([source, count]) => (
              <p key={source} className="rounded-xl border border-border bg-white p-3 text-sm leading-6 text-muted">
                <span className="font-bold text-primary">{formatLabel(source)}</span>: {count} lead(s)
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-base font-semibold text-primary">Audit</h3>
          <p className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm font-semibold leading-6 text-blue-950">
            {audit?.summary ?? "Audit pending."}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Blocked</p>
              <p className="mt-1 text-xl font-bold text-primary">{audit?.blockedCount ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Missing facts</p>
              <p className="mt-1 text-xl font-bold text-primary">{audit?.missingFactCount ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Outcomes</p>
              <p className="mt-1 text-xl font-bold text-primary">{audit?.outcomeCount ?? 0}</p>
            </div>
          </div>
          <ul className="mt-3 space-y-2">
            {(audit?.reviewNotes ?? []).map((note) => (
              <li key={note} className="rounded-xl border border-border bg-slate-50 p-3 text-sm leading-6 text-muted">
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
