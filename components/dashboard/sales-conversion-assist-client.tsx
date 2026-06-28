"use client";

import { useEffect, useMemo, useState } from "react";

type SalesQueueLead = {
  id: string;
  name: string;
  phone: string;
  propertyAddress: string;
  source: string;
  status: string;
  score: number;
  priority: string;
  salesQueueRank: number;
  nextSalesAction: string;
  offerReadiness: {
    status: string;
    missing: string[];
    summary: string;
  };
  salesConversionAssists: SalesAssist[];
  marketingSalesAttributions: SalesAttribution[];
  latestSellerCallOutcome: {
    id: string;
    outcome: string;
    operatorSummary: string;
    manualNextStep: string;
    callCompletedAt: string;
  } | null;
};

type SalesAttribution = {
  id: string;
  leadId: string;
  channel: string;
  topic: string;
  sourceLabel: string;
  attributionStatus: string;
  attributionNote: string;
};

type SalesAssist = {
  id: string;
  leadId: string;
  nextSalesAction: string;
  callOpener: string;
  sellerQuestions: string[];
  objectionNotes: string[];
  followUpDrafts: string[];
  offerReadiness: {
    status: string;
    missing: string[];
    summary: string;
  };
  manualApprovalStatus: string;
};

type FutureApiReview = {
  group: string;
  requestedRoutes: string[];
  recommendation: string;
  reason: string;
};

type SalesConversionResponse = {
  ok: boolean;
  salesQueue?: SalesQueueLead[];
  attributions?: SalesAttribution[];
  assists?: SalesAssist[];
  roiSummary?: {
    totalAttributedLeads: number;
    channels: Record<string, { leads: number; sourceLabels: string[] }>;
    pipelineCounts: Record<string, number>;
  };
  futureApiReview?: FutureApiReview[];
  error?: string;
};

function formatStatus(value: string) {
  return value.replaceAll("_", " ");
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="space-y-2">
      <p className="break-words text-xs font-bold uppercase tracking-[0.16em] text-muted">{eyebrow}</p>
      <h2 className="break-words text-xl font-semibold text-primary">{title}</h2>
      <p className="max-w-3xl break-words text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

export function SalesConversionAssistClient() {
  const [salesQueue, setSalesQueue] = useState<SalesQueueLead[]>([]);
  const [attributions, setAttributions] = useState<SalesAttribution[]>([]);
  const [assists, setAssists] = useState<SalesAssist[]>([]);
  const [roiSummary, setRoiSummary] = useState<SalesConversionResponse["roiSummary"]>();
  const [futureApiReview, setFutureApiReview] = useState<FutureApiReview[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [message, setMessage] = useState("Loading sales conversion assist...");
  const [busy, setBusy] = useState(false);

  const selectedLead = useMemo(() => salesQueue.find((lead) => lead.id === selectedLeadId) ?? salesQueue[0], [salesQueue, selectedLeadId]);

  async function loadSalesConversion() {
    const response = await fetch("/api/sales-conversion", {
      headers: {
        Accept: "application/json",
      },
    });
    const data = (await response.json()) as SalesConversionResponse;

    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Unable to load sales conversion assist.");
    }

    setSalesQueue(data.salesQueue ?? []);
    setAttributions(data.attributions ?? []);
    setAssists(data.assists ?? []);
    setRoiSummary(data.roiSummary);
    setFutureApiReview(data.futureApiReview ?? []);
    setMessage("Sales conversion assist loaded. No outbound messages, social APIs, or CRM mutations occurred.");
  }

  useEffect(() => {
    loadSalesConversion().catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load sales conversion assist."));
  }, []);

  async function createAssist(leadId: string) {
    setBusy(true);
    try {
      const response = await fetch("/api/sales-conversion/assist", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId,
          manualApprovalStatus: "pending_manual_review",
        }),
      });
      const data = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Unable to generate sales assist.");
      }

      await loadSalesConversion();
      setMessage("Manual sales assist generated. No SMS, email, calls, or lead status changes occurred.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to generate sales assist.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] sm:p-6">
      <SectionHeader
        eyebrow="Phase 2F"
        title="Sales Conversion Assist"
        description="Connect marketing activity to seller conversations, offer readiness, and ROI without auto-publishing or auto-contacting anyone."
      />

      <div className="mt-5 rounded-[1rem] border border-blue-200 bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-950">
        {message}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-base font-semibold text-primary">Sales Queue</h3>
          <div className="mt-3 grid gap-3">
            {salesQueue.slice(0, 8).map((lead) => (
              <button
                key={lead.id}
                type="button"
                onClick={() => setSelectedLeadId(lead.id)}
                className="rounded-xl border border-border bg-slate-50 p-3 text-left"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-primary">{lead.name}</p>
                    <p className="mt-1 text-sm text-muted">{lead.propertyAddress}</p>
                  </div>
                  <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-amber-900">
                    Rank {lead.salesQueueRank}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{lead.nextSalesAction}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">
                  {lead.source || "unknown source"} | {formatStatus(lead.status)} | score {lead.score}
                </p>
              </button>
            ))}
            {salesQueue.length === 0 ? <p className="text-sm text-muted">No seller leads are available for sales conversion review.</p> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-base font-semibold text-primary">Lead Sales Assist</h3>
          {selectedLead ? (
            <div className="mt-3 space-y-3">
              <p className="text-sm font-semibold text-primary">{selectedLead.name}</p>
              <p className="text-sm leading-6 text-muted">{selectedLead.offerReadiness.summary}</p>
              {selectedLead.offerReadiness.missing.length > 0 ? (
                <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
                  Missing: {selectedLead.offerReadiness.missing.join(", ")}
                </p>
              ) : null}
              {selectedLead.latestSellerCallOutcome ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800">
                  <p className="text-sm font-bold">Latest seller outcome: {formatStatus(selectedLead.latestSellerCallOutcome.outcome)}</p>
                  <p className="mt-2 text-sm leading-6">{selectedLead.latestSellerCallOutcome.operatorSummary}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">
                    Next: {formatStatus(selectedLead.latestSellerCallOutcome.manualNextStep)}
                  </p>
                </div>
              ) : (
                <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                  Seller call outcome has not been captured yet.
                </p>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={() => createAssist(selectedLead.id)}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
              >
                Generate Sales Assist
              </button>
              {selectedLead.salesConversionAssists.length > 0 ? (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-blue-950">
                  <p className="text-sm font-bold">Call opener</p>
                  <p className="mt-2 text-sm leading-6">{selectedLead.salesConversionAssists[0].callOpener}</p>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">Select a lead to generate manual sales guidance.</p>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-base font-semibold text-primary">ROI Snapshot</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Attributed Leads</p>
              <p className="mt-1 text-2xl font-bold text-primary">{roiSummary?.totalAttributedLeads ?? 0}</p>
            </div>
            {Object.entries(roiSummary?.pipelineCounts ?? {}).map(([status, count]) => (
              <div key={status} className="rounded-xl border border-border bg-slate-50 p-3">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">{formatStatus(status)}</p>
                <p className="mt-1 text-2xl font-bold text-primary">{count}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            {Object.entries(roiSummary?.channels ?? {}).map(([channel, summary]) => (
              <p key={channel} className="rounded-xl border border-border bg-white p-3 text-sm leading-6 text-muted">
                <span className="font-bold text-primary">{formatStatus(channel)}</span>: {summary.leads} attributed lead(s)
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4">
          <h3 className="text-base font-semibold text-primary">Social API Review</h3>
          <div className="mt-3 grid gap-3">
            {futureApiReview.map((item) => (
              <article key={item.group} className="rounded-xl border border-border bg-slate-50 p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <p className="text-sm font-bold text-primary">{item.group}</p>
                  <span className="w-fit rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-red-900">
                    {formatStatus(item.recommendation)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{item.reason}</p>
                <p className="mt-2 break-words text-xs font-semibold leading-5 text-muted">{item.requestedRoutes.join(", ")}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      {attributions.length > 0 ? (
        <div className="mt-5 rounded-2xl border border-border bg-white p-4">
          <h3 className="text-base font-semibold text-primary">Recent Marketing Attribution</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {attributions.slice(0, 6).map((attribution) => (
              <div key={attribution.id} className="rounded-xl border border-border bg-slate-50 p-3">
                <p className="text-sm font-bold text-primary">{attribution.topic}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-muted">
                  {formatStatus(attribution.channel)} | {attribution.sourceLabel}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">{attribution.attributionNote}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {assists.length > 0 ? (
        <div className="mt-5 rounded-2xl border border-border bg-white p-4">
          <h3 className="text-base font-semibold text-primary">Recent Sales Assists</h3>
          <div className="mt-3 grid gap-3">
            {assists.slice(0, 5).map((assist) => (
              <div key={assist.id} className="rounded-xl border border-border bg-slate-50 p-3">
                <p className="text-sm font-bold text-primary">{assist.nextSalesAction}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{assist.callOpener}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
