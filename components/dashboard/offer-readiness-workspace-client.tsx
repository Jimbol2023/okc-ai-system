"use client";

import { useEffect, useState } from "react";

type OfferReadinessQueueItem = {
  id: string;
  name: string;
  source: string;
  propertyAddress: string;
  status: string;
  score: number;
  priority: string;
  approvalStatus: string;
  doNotContact: boolean;
  readinessStatus: string;
  rank: number;
  missingFacts: string[];
  nextManualAction: string;
  assumptionRoi: {
    available: boolean;
    label: string;
    assumptions?: string[];
    reviewNote?: string;
  };
  latestOutcome: {
    outcome: string;
    operatorSummary: string;
    manualNextStep: string;
  } | null;
  latestAssist: {
    nextSalesAction: string;
    callOpener: string;
  } | null;
  attributions: Array<{
    id: string;
    channel: string;
    sourceLabel: string;
    topic: string;
  }>;
};

type OfferReadinessResponse = {
  success: boolean;
  queue?: OfferReadinessQueueItem[];
  summary?: {
    totalLeadsReviewed: number;
    readyCount: number;
    blockedCount: number;
    statusCounts: Record<string, number>;
    sourceCounts: Record<string, number>;
    assumptionRoiAvailable: number;
  };
  audit?: {
    status: string;
    summary: string;
    blockedCount: number;
    missingFactCount: number;
    reviewNotes: string[];
  };
  safetyFlags?: Record<string, boolean>;
  error?: string;
};

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

function readinessTone(status: string) {
  if (status === "ready_for_manual_offer_review") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (status === "needs_underwriting_facts") return "border-amber-200 bg-amber-50 text-amber-900";
  if (status === "needs_seller_context") return "border-blue-200 bg-blue-50 text-blue-950";
  if (status === "blocked_or_suppressed") return "border-red-200 bg-red-50 text-red-900";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export function OfferReadinessWorkspaceClient() {
  const [queue, setQueue] = useState<OfferReadinessQueueItem[]>([]);
  const [summary, setSummary] = useState<OfferReadinessResponse["summary"]>();
  const [audit, setAudit] = useState<OfferReadinessResponse["audit"]>();
  const [message, setMessage] = useState("Loading offer readiness workspace...");
  const [selectedLeadId, setSelectedLeadId] = useState("");

  const selectedLead = queue.find((lead) => lead.id === selectedLeadId) ?? queue[0] ?? null;

  async function loadOfferReadiness() {
    const response = await fetch("/api/offer-readiness", {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });
    const data = (await response.json()) as OfferReadinessResponse;

    if (!response.ok || !data.success) {
      throw new Error(data.error ?? "Unable to load offer readiness workspace.");
    }

    setQueue(data.queue ?? []);
    setSummary(data.summary);
    setAudit(data.audit);
    setMessage("Offer readiness loaded. No offers, contracts, valuation claims, or external property data were created.");
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadOfferReadiness().catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load offer readiness."));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] sm:p-6">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-xs font-bold uppercase tracking-[0.16em] text-muted">Phase 2I</p>
          <h2 className="break-words text-xl font-semibold text-primary">Offer Readiness + Deal Review Workspace</h2>
          <p className="max-w-3xl break-words text-sm leading-6 text-muted">
            Turn seller calls into manual deal-review decisions by surfacing underwriting gaps, seller context, and assumption-only review math.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.08em]">
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-950">offerSent:false</span>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-950">contract:false</span>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-950">valuationClaim:false</span>
        </div>
      </div>

      <div className="mt-5 rounded-[1rem] border border-blue-200 bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-950">
        {message}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-primary">Manual offer review queue</h3>
              <p className="mt-1 text-sm leading-6 text-muted">Ranked by readiness, seller signals, underwriting inputs, and blockers.</p>
            </div>
            <button
              type="button"
              onClick={() => loadOfferReadiness().catch((error) => setMessage(error instanceof Error ? error.message : "Unable to refresh offer readiness."))}
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
                  <span className={`w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${readinessTone(lead.readinessStatus)}`}>
                    {formatLabel(lead.readinessStatus)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{lead.nextManualAction}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">
                  {lead.source || "unknown source"} | {formatLabel(lead.status)} | score {lead.score} | rank {lead.rank}
                </p>
              </button>
            ))}
            {queue.length === 0 ? <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">No leads available for offer-readiness review.</p> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-base font-semibold text-primary">Deal review detail</h3>
          {selectedLead ? (
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-sm font-bold text-primary">{selectedLead.name}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{selectedLead.nextManualAction}</p>
              </div>

              {selectedLead.missingFacts.length > 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-950">
                  <p className="text-sm font-bold">Missing before offer review</p>
                  <p className="mt-2 text-sm leading-6">{selectedLead.missingFacts.join(", ")}</p>
                </div>
              ) : (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
                  Required v1 seller and underwriting context is present for manual offer review.
                </p>
              )}

              <div className="rounded-xl border border-border bg-slate-50 p-3">
                <p className="text-sm font-bold text-primary">{selectedLead.assumptionRoi.label}</p>
                {selectedLead.assumptionRoi.available ? (
                  <ul className="mt-2 space-y-1 text-sm leading-6 text-muted">
                    {(selectedLead.assumptionRoi.assumptions ?? []).map((assumption) => (
                      <li key={assumption}>{assumption}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-muted">Analyzer ARV, repair estimate, and desired profit are not all present.</p>
                )}
                {selectedLead.assumptionRoi.reviewNote ? (
                  <p className="mt-2 text-xs font-bold uppercase leading-5 tracking-[0.08em] text-blue-950">{selectedLead.assumptionRoi.reviewNote}</p>
                ) : null}
              </div>

              {selectedLead.latestOutcome ? (
                <div className="rounded-xl border border-border bg-white p-3">
                  <p className="text-sm font-bold text-primary">Latest seller outcome: {formatLabel(selectedLead.latestOutcome.outcome)}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{selectedLead.latestOutcome.operatorSummary}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">
                    Next: {formatLabel(selectedLead.latestOutcome.manualNextStep)}
                  </p>
                </div>
              ) : (
                <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">No seller call outcome captured yet.</p>
              )}

              {selectedLead.latestAssist ? (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-blue-950">
                  <p className="text-sm font-bold">Sales assist context</p>
                  <p className="mt-2 text-sm leading-6">{selectedLead.latestAssist.nextSalesAction}</p>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">Select a lead to review offer readiness.</p>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-base font-semibold text-primary">Readiness summary</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Ready</p>
              <p className="mt-1 text-2xl font-bold text-primary">{summary?.readyCount ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Blocked</p>
              <p className="mt-1 text-2xl font-bold text-primary">{summary?.blockedCount ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Assumption ROI</p>
              <p className="mt-1 text-2xl font-bold text-primary">{summary?.assumptionRoiAvailable ?? 0}</p>
            </div>
          </div>
          <div className="mt-3 grid gap-2">
            {Object.entries(summary?.statusCounts ?? {}).map(([status, count]) => (
              <p key={status} className="rounded-xl border border-border bg-white p-3 text-sm leading-6 text-muted">
                <span className="font-bold text-primary">{formatLabel(status)}</span>: {count} lead(s)
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-base font-semibold text-primary">Audit</h3>
          <p className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm font-semibold leading-6 text-blue-950">
            {audit?.summary ?? "Audit pending."}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Missing facts</p>
              <p className="mt-1 text-xl font-bold text-primary">{audit?.missingFactCount ?? 0}</p>
            </div>
            <div className="rounded-xl border border-border bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Blocked</p>
              <p className="mt-1 text-xl font-bold text-primary">{audit?.blockedCount ?? 0}</p>
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
