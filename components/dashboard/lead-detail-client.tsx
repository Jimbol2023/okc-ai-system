"use client";

/* =====================================================
   LEAD DETAIL CLIENT - SAFE PRO VERSION
   -----------------------------------------------------
   - Reads API response: { ok: true, lead }
   - Shows AI Reply Panel when lastSellerReply exists
   - Keeps human approval visibility without direct sending
   - Keeps DNC protection
   - Captures seller call outcomes without outreach execution
===================================================== */

import Link from "next/link";
import { useEffect, useState } from "react";

import { SellerCallOutcomeForm } from "@/components/dashboard/seller-call-outcome-form";
import {
  SellerCallOutcomeHistory,
  type SellerCallOutcomeHistoryItem,
} from "@/components/dashboard/seller-call-outcome-history";
import { SellerCallOutcomePlanPanel } from "@/components/dashboard/seller-call-outcome-plan-panel";
import {
  createLeadDetailManualReviewModel,
  type LeadDetailManualReviewModel,
} from "@/lib/lead-detail-manual-review-usability";
import {
  createBuyerDispositionReadinessUsabilityModel,
  type BuyerDispositionReadinessUsabilityModel,
} from "@/lib/buyer-disposition-readiness-usability";
import { createSellerCallOutcomeUsabilityModel } from "@/lib/seller-call-outcome-usability";
import type { StoredLead } from "@/lib/leads-storage";

/* =============================
   TYPES
============================= */

type Lead = Partial<StoredLead> & {
  id: string;
  name?: string | null;

  lastSellerReply?: string | null;
  lastSellerReplyAt?: string | null;
  lastSellerReplyIntent?: string | null;
  lastSellerReplyConfidence?: number | null;

  requiresHumanApproval?: boolean | null;
  suggestedReply?: string | null;

  optOutReason?: string | null;
  optOutAt?: string | null;
};

type LeadApiResponse = {
  ok: boolean;
  lead?: Lead;
  error?: string;
};

type ApprovalApiResponse = {
  ok: boolean;
  action?: "approve" | "reject";
  sent?: boolean;
  message?: string;
  lead?: Partial<Lead>;
  error?: string;
};

type SellerCallOutcomesApiResponse = {
  ok: boolean;
  outcomes?: SellerCallOutcomeHistoryItem[];
  error?: string;
};

type LeadDetailObservabilitySummary = {
  revenueReadiness: string;
  missingCriticalData: string[];
  sellerCallStatus: string;
  followUpSummary: string;
  buyerPackageSummary: string;
  blockedSummary: string;
  humanReviewSummary: string;
  opportunitySummary: string;
  manualNextStep: string;
};

function getReviewTone(value: string) {
  if (value.includes("stop") || value.includes("blocked") || value.includes("no_follow_up")) {
    return "border-red-200 bg-red-50 text-red-900";
  }
  if (value.includes("cleanup") || value.includes("missing")) {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }
  if (value.includes("overdue") || value.includes("risk")) {
    return "border-orange-200 bg-orange-50 text-orange-900";
  }
  if (value.includes("review_revenue") || value.includes("ready_for")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  }
  if (value.includes("terminal")) {
    return "border-slate-200 bg-slate-50 text-slate-700";
  }

  return "border-blue-200 bg-blue-50 text-blue-900";
}

function hasValue(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0;
}

function formatSignal(value?: string | null) {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue.replaceAll("_", " ") : "Not captured";
}

function getLatestSellerCallOutcome(outcomes: SellerCallOutcomeHistoryItem[]) {
  return outcomes[0] ?? null;
}

function getMissingCriticalData(lead: Lead, latestOutcome: SellerCallOutcomeHistoryItem | null) {
  const missing: string[] = [];

  if (!hasValue(lead.propertyAddress)) missing.push("property address");
  if (!hasValue(lead.phone)) missing.push("seller contact");
  if (!hasValue(lead.source)) missing.push("lead source");
  if (!latestOutcome || latestOutcome.sellerMotivationSignal === "not_captured") missing.push("seller motivation");
  if (!latestOutcome || latestOutcome.sellerTimelineSignal === "not_captured") missing.push("seller timeline");

  return missing;
}

function deriveLeadDetailObservability(
  lead: Lead,
  outcomes: SellerCallOutcomeHistoryItem[],
): LeadDetailObservabilitySummary {
  const latestOutcome = getLatestSellerCallOutcome(outcomes);
  const missingCriticalData = getMissingCriticalData(lead, latestOutcome);
  const dncOrGovernanceBlocked = lead.doNotContact === true || lead.approvalStatus === "rejected";
  const humanReviewRequired =
    lead.requiresHumanApproval === true ||
    lead.approvalStatus === "needs_human_review" ||
    lead.approvalStatus === "pending_review" ||
    !lead.approvalStatus;
  const strongSellerSignals =
    latestOutcome?.outcome === "wants_offer" ||
    latestOutcome?.outcome === "appointment_set" ||
    latestOutcome?.sellerTimelineSignal === "strong" ||
    latestOutcome?.sellerMotivationSignal === "strong";

  return {
    revenueReadiness: dncOrGovernanceBlocked
      ? "Blocked for manual review"
      : missingCriticalData.length > 0
        ? "Needs missing data review"
        : "Ready for manual operator review",
    missingCriticalData,
    sellerCallStatus: latestOutcome
      ? `${formatSignal(latestOutcome.outcome)} captured; motivation ${formatSignal(latestOutcome.sellerMotivationSignal)}, timeline ${formatSignal(latestOutcome.sellerTimelineSignal)}.`
      : "No seller call outcome captured yet.",
    followUpSummary: latestOutcome
      ? `Manual next step: ${formatSignal(latestOutcome.manualNextStep)}.`
      : "No manual follow-up step captured yet.",
    buyerPackageSummary:
      lead.approvalStatus === "approved_for_outreach"
        ? "Buyer package still requires human completeness review before sharing."
        : "Buyer package readiness has not been confirmed.",
    blockedSummary: dncOrGovernanceBlocked
      ? "Do-not-proceed visibility: DNC, opt-out, rejected, or governance-blocked state is present."
      : "No DNC or governance-blocked state is visible from current lead data.",
    humanReviewSummary: humanReviewRequired
      ? "Human review required before any seller or buyer-facing action."
      : "Human review remains required for external-facing action even when this advisory status looks favorable.",
    opportunitySummary: strongSellerSignals
      ? "Near-contract or near-close advisory signal may exist; verify manually before next steps."
      : "No near-contract or near-close advisory signal is visible from current lead data.",
    manualNextStep: dncOrGovernanceBlocked
      ? "Pause and review compliance or governance blockers before any external action."
      : missingCriticalData.length > 0
        ? "Fill missing critical lead data, then update seller call context manually."
        : "Review seller context, buyer package completeness, and next manual follow-up outside automated execution.",
  };
}

function ManualReviewBriefPanel({ review }: { review: LeadDetailManualReviewModel }) {
  return (
    <section
      aria-labelledby="lead-detail-manual-review-brief-heading"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Consolidated manual review
          </p>
          <h2 id="lead-detail-manual-review-brief-heading" className="mt-1 text-xl font-bold text-slate-950">
            Manual Review Brief
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            One operator-facing summary from Z10 decision support, follow-up workspace timing, source tracking, and seller call context.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-800">
            Advisory only
          </span>
          <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-800">
            No external action
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className={`rounded border p-3 ${getReviewTone(review.decision.decisionLane)}`}>
          <p className="text-xs font-bold uppercase">Decision</p>
          <p className="mt-1 text-sm font-semibold">{formatSignal(review.decision.decisionLane)}</p>
        </div>
        <div className={`rounded border p-3 ${getReviewTone(review.followUp.lane)}`}>
          <p className="text-xs font-bold uppercase">Follow-up</p>
          <p className="mt-1 text-sm font-semibold">{formatSignal(review.followUp.lane)}</p>
          <p className="mt-1 text-xs">{review.followUp.timingLabel}</p>
        </div>
        <div className="rounded border border-slate-200 bg-slate-50 p-3 text-slate-800">
          <p className="text-xs font-bold uppercase">Source</p>
          <p className="mt-1 text-sm font-semibold">{review.sourceVisible}</p>
        </div>
        <div className="rounded border border-slate-200 bg-slate-50 p-3 text-slate-800">
          <p className="text-xs font-bold uppercase">Missing data</p>
          <p className="mt-1 text-sm font-semibold">
            {review.missingCriticalData.length > 0 ? review.missingCriticalData.slice(0, 4).join(", ") : "No critical gaps visible"}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_1.2fr]">
        <div className="rounded border border-blue-100 bg-blue-50 p-3 text-sm leading-6 text-blue-950">
          <p className="font-bold">Seller context</p>
          <p className="mt-2">{review.sellerContextSummary}</p>
        </div>
        <div className={`rounded border p-3 text-sm leading-6 ${getReviewTone(review.blockedVisibility)}`}>
          <p className="font-bold">Blocked visibility</p>
          <p className="mt-2">{review.blockedVisibility}</p>
        </div>
        <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-800">
          <p className="font-bold">Safe manual next review</p>
          <p className="mt-2 font-semibold">{review.safeManualNextReview}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
            providerCalled:false sent:false followUpContactExecuted:false crmMutationAllowed:false
          </p>
        </div>
      </div>
    </section>
  );
}

function BuyerDispositionReadinessPanel({ readiness }: { readiness: BuyerDispositionReadinessUsabilityModel }) {
  return (
    <section
      aria-labelledby="buyer-disposition-readiness-heading"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Buyer / disposition readiness
          </p>
          <h2 id="buyer-disposition-readiness-heading" className="mt-1 text-xl font-bold text-slate-950">
            Buyer Package Review
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Internal buyer/disposition visibility only. No buyer outreach, assignment, contract, reminder, routing, or status movement is created.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-800">
            Read only
          </span>
          <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-800">
            No buyer contact
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className={`rounded border p-3 ${getReviewTone(readiness.buyerReadinessLabel)}`}>
          <p className="text-xs font-bold uppercase">Buyer readiness</p>
          <p className="mt-1 text-sm font-semibold">{readiness.buyerReadinessLabel}</p>
          <p className="mt-1 text-xs">Score {readiness.buyerReadinessScore}/100</p>
        </div>
        <div className={`rounded border p-3 ${getReviewTone(readiness.assignmentReadinessLabel)}`}>
          <p className="text-xs font-bold uppercase">Assignment readiness</p>
          <p className="mt-1 text-sm font-semibold">{readiness.assignmentReadinessLabel}</p>
        </div>
        <div className="rounded border border-slate-200 bg-slate-50 p-3 text-slate-800">
          <p className="text-xs font-bold uppercase">Source</p>
          <p className="mt-1 text-sm font-semibold">{readiness.sourceVisible}</p>
        </div>
        <div className="rounded border border-slate-200 bg-slate-50 p-3 text-slate-800">
          <p className="text-xs font-bold uppercase">Package checklist</p>
          <p className="mt-1 text-sm font-semibold">
            {readiness.packageChecklistSummary.complete}/{readiness.packageChecklistSummary.total} complete
          </p>
          <p className="mt-1 text-xs">
            {readiness.packageChecklistSummary.missing} missing, {readiness.packageChecklistSummary.reviewNeeded} review
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_1.2fr]">
        <div className="rounded border border-blue-100 bg-blue-50 p-3 text-sm leading-6 text-blue-950">
          <p className="font-bold">Near-close visibility</p>
          <p className="mt-2">{readiness.nearCloseVisibility}</p>
          <p className="mt-2">{readiness.closingVisibility}</p>
        </div>
        <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          <p className="font-bold">Missing package data</p>
          {readiness.missingPackageData.length > 0 ? (
            <p className="mt-2">{readiness.missingPackageData.slice(0, 6).join(", ")}</p>
          ) : (
            <p className="mt-2">No buyer package gaps are visible from current lead data.</p>
          )}
          {readiness.blockerLabels.length > 0 ? (
            <p className="mt-2 font-semibold">Blockers: {readiness.blockerLabels.slice(0, 4).join(", ")}</p>
          ) : null}
        </div>
        <div className="rounded border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-800">
          <p className="font-bold">Safe manual next review</p>
          <p className="mt-2 font-semibold">{readiness.safeManualNextReview}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
            buyerContacted:false contractGenerated:false assignmentExecuted:false crmMutationExpanded:false
          </p>
        </div>
      </div>
    </section>
  );
}

function LeadDetailObservabilityPanel({
  lead,
  outcomes,
  review,
}: {
  lead: Lead;
  outcomes: SellerCallOutcomeHistoryItem[];
  review: LeadDetailManualReviewModel;
}) {
  const summary = deriveLeadDetailObservability(lead, outcomes);

  return (
    <section
      aria-labelledby="lead-detail-observability-heading"
      className="rounded-xl border border-slate-200 bg-white p-5"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Read-only observability
          </p>
          <h2 id="lead-detail-observability-heading" className="mt-1 text-xl font-bold text-slate-950">
            Lead detail observability
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Advisory lead-specific summary only. The Manual Review Brief above is the controlling operator summary;
            this panel keeps supporting context visible without enabling execution.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-800">
            Read only
          </span>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-800">
            Advisory only
          </span>
          <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-red-800">
            External action blocked
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">Revenue readiness</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{summary.revenueReadiness}</p>
        </div>
        <div className="rounded border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">Seller call status</p>
          <p className="mt-1 text-sm text-slate-700">{summary.sellerCallStatus}</p>
        </div>
        <div className="rounded border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">Buyer package</p>
          <p className="mt-1 text-sm text-slate-700">{summary.buyerPackageSummary}</p>
        </div>
        <div className="rounded border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-bold uppercase text-slate-500">Human review</p>
          <p className="mt-1 text-sm text-slate-700">{summary.humanReviewSummary}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm lg:grid-cols-[1fr_1fr_1.2fr]">
        <div className="rounded border border-amber-200 bg-amber-50 p-3 text-amber-950">
          <p className="font-bold">Missing critical data</p>
          {review.missingCriticalData.length > 0 ? (
            <ul className="mt-2 space-y-1" aria-label="Missing critical lead data">
              {review.missingCriticalData.map((item) => (
                <li key={item}>! {item}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2">No critical missing data is visible from current lead data.</p>
          )}
        </div>

        <div className="rounded border border-red-200 bg-red-50 p-3 text-red-950">
          <p className="font-bold">Blocked-state visibility</p>
          <p className="mt-2">{review.blockedVisibility}</p>
        </div>

        <div className="rounded border border-slate-200 bg-slate-50 p-3 text-slate-800">
          <p className="font-bold">Manual next step</p>
          <p className="mt-2">{summary.followUpSummary}</p>
          <p className="mt-2">{summary.opportunitySummary}</p>
          <p className="mt-2 font-semibold">{review.safeManualNextReview}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
            readOnly:true providerCalled:false sent:false liveExecutionAllowed:false
          </p>
        </div>
      </div>
    </section>
  );
}

/* =============================
   COMPONENT
============================= */

export function LeadDetailClient({ leadId }: { leadId: string }) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [aiReplyText, setAiReplyText] = useState("");
  const [aiReplySendState, setAiReplySendState] =
    useState<"idle" | "saving" | "approved" | "rejected">("idle");
  const [aiReplyError, setAiReplyError] = useState<string | null>(null);
  const [aiReplyStatusMessage, setAiReplyStatusMessage] = useState<string | null>(null);
  const [sellerCallOutcomes, setSellerCallOutcomes] = useState<SellerCallOutcomeHistoryItem[]>([]);
  const [sellerCallOutcomeError, setSellerCallOutcomeError] = useState<string | null>(null);

  /* =============================
     FETCH LEAD
  ============================= */

  useEffect(() => {
    async function loadLead() {
      try {
        setLoading(true);
        setLoadError(null);

        const res = await fetch(`/api/leads/${leadId}`, {
          method: "GET",
          cache: "no-store",
        });

        const data = (await res.json()) as LeadApiResponse;

        if (!res.ok || !data.ok || !data.lead) {
          setLead(null);
          setLoadError(data.error || "Unable to load lead.");
          return;
        }

        setLead(data.lead);
        setAiReplyText(data.lead.suggestedReply ?? "");

        const outcomesResponse = await fetch(`/api/leads/${leadId}/seller-call-outcomes`, {
          method: "GET",
          cache: "no-store",
        });
        const outcomesData = (await outcomesResponse.json()) as SellerCallOutcomesApiResponse;

        if (!outcomesResponse.ok || !outcomesData.ok) {
          setSellerCallOutcomes([]);
          setSellerCallOutcomeError(outcomesData.error || "Unable to load seller call outcomes.");
          return;
        }

        setSellerCallOutcomes(outcomesData.outcomes ?? []);
        setSellerCallOutcomeError(null);
      } catch (error) {
        console.error("Failed to load lead:", error);
        setLead(null);
        setLoadError("Failed to load lead.");
      } finally {
        setLoading(false);
      }
    }

    void loadLead();
  }, [leadId]);

  /* =============================
     APPROVE OR REJECT AI REPLY
  ============================= */

  async function submitApproval(action: "approve" | "reject") {
    if (!lead) return;

    if (action === "approve" && lead.doNotContact) {
      setAiReplyError("This lead is marked Do Not Contact. Approval was blocked.");
      return;
    }

    if (action === "approve" && !aiReplyText.trim()) {
      setAiReplyError("Approved reply message is empty.");
      return;
    }

    try {
      setAiReplySendState("saving");
      setAiReplyError(null);
      setAiReplyStatusMessage(null);

      const res = await fetch(`/api/leads/${lead.id}/approval`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          action,
          message: aiReplyText.trim(),
        }),
      });

      const data = (await res.json()) as ApprovalApiResponse;

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Approval update failed.");
      }

      if (data.lead) {
        setLead((currentLead) =>
          currentLead
            ? {
                ...currentLead,
                ...data.lead,
              }
            : currentLead,
        );
      }

      if (data.lead?.suggestedReply !== undefined) {
        setAiReplyText(data.lead.suggestedReply ?? "");
      }

      setAiReplySendState(action === "approve" ? "approved" : "rejected");
      setAiReplyStatusMessage(data.message || "Approval updated. No SMS or email was sent.");
    } catch (error) {
      console.error("Failed to update AI reply approval:", error);
      setAiReplyError(
        error instanceof Error ? error.message : "Failed to update approval.",
      );
      setAiReplySendState("idle");
    }
  }

  /* =============================
     HELPERS
  ============================= */

  function formatDate(date?: string | null) {
    if (!date) return "Unknown";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown";
    }

    return parsedDate.toLocaleString();
  }

  /* =============================
     LOADING STATE
  ============================= */

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Link
          href="/dashboard/leads"
          className="inline-flex text-sm font-semibold text-primary"
        >
          &lt;- Back to leads
        </Link>

        <div className="rounded-xl border bg-white p-6 text-sm text-muted">
          <p className="font-semibold text-slate-900">Loading lead detail...</p>
          <p className="mt-1 leading-6">
            Preparing the Manual Review Brief, seller-call history, follow-up state, and buyer/disposition visibility. No outreach, routing, reminder, or automation is running.
          </p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="space-y-6 p-6">
        <Link
          href="/dashboard/leads"
          className="inline-flex text-sm font-semibold text-primary"
        >
          &lt;- Back to leads
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm leading-6 text-red-800">
          <p className="font-semibold">Lead detail could not be opened.</p>
          <p className="mt-1">{loadError || "Lead not found."}</p>
          <p className="mt-2">Return to the leads workspace and verify the record still exists. No lead status, approval, seller-call, buyer/disposition, or outreach action was created.</p>
        </div>
      </div>
    );
  }

  /* =============================
     MAIN UI
  ============================= */

  const manualReview = createLeadDetailManualReviewModel(lead, sellerCallOutcomes);
  const buyerDispositionReadiness = createBuyerDispositionReadinessUsabilityModel(lead);
  const sellerCallUsability = createSellerCallOutcomeUsabilityModel(lead, sellerCallOutcomes);

  return (
    <div className="space-y-6 p-6">
      <Link
        href="/dashboard/leads"
        className="inline-flex text-sm font-semibold text-primary"
      >
        &lt;- Back to leads
      </Link>

      <section
        aria-labelledby="lead-detail-manual-sop-heading"
        className="rounded-xl border border-blue-100 bg-blue-50 p-4"
      >
        <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <h2
              id="lead-detail-manual-sop-heading"
              className="text-lg font-bold text-blue-950"
            >
              Manual lead review only
            </h2>
            <p className="mt-2 text-sm leading-6 text-blue-950">
              Review seller context manually outside the app, then record any completed call outcome here.
              Human review is required before any seller or buyer-facing action.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-900">
              Do not proceed if
            </p>
            <ul className="mt-2 space-y-1 text-sm leading-6 text-blue-950" aria-label="Lead detail do not proceed conditions">
              <li>! Lead data is incomplete.</li>
              <li>! DNC or opt-out risk exists.</li>
              <li>! Motivation or timeline is unclear.</li>
              <li>! Buyer package is incomplete.</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-900">
              Next safe manual action
            </p>
            <p className="mt-2 text-sm leading-6 text-blue-950">
              Review missing data, confirm DNC/opt-out status, prepare seller call notes,
              and prepare disposition packages manually after confirming buyer readiness.
            </p>
          </div>
        </div>
      </section>

      <ManualReviewBriefPanel review={manualReview} />

      <BuyerDispositionReadinessPanel readiness={buyerDispositionReadiness} />

      <LeadDetailObservabilityPanel lead={lead} outcomes={sellerCallOutcomes} review={manualReview} />

      <section className="rounded-xl border bg-white p-4">
        <h2 className="mb-2 text-lg font-bold">Lead Info</h2>

        <p>
          <strong>Name:</strong> {lead.name || "N/A"}
        </p>
        <p>
          <strong>Phone:</strong> {lead.phone || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {lead.propertyAddress || "N/A"}
        </p>
        <p>
          <strong>Source:</strong> {lead.source || "N/A"}
        </p>
        <p>
          <strong>Approval Status:</strong> {lead.approvalStatus || "pending_review"}
        </p>
      </section>

      <SellerCallOutcomeForm
        leadId={lead.id}
        usability={sellerCallUsability}
        onOutcomeSaved={(outcome) => {
          setSellerCallOutcomes((currentOutcomes) => [outcome, ...currentOutcomes]);
        }}
      />

      {sellerCallOutcomeError ? (
        <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold leading-6 text-amber-800">
          Seller-call history could not be loaded: {sellerCallOutcomeError}. The Manual Review Brief remains visible; no seller-call record, reminder, outreach, or automation was created.
        </p>
      ) : null}

      <SellerCallOutcomeHistory outcomes={sellerCallOutcomes} usability={sellerCallUsability} />

      <SellerCallOutcomePlanPanel compact />

      {lead.lastSellerReply ? (
        <section className="rounded-xl border-2 border-blue-300 bg-[#f7fbff] p-5">
          <h2 className="mb-2 text-xl font-bold text-blue-950">
            AI Seller Reply Analysis
          </h2>

          <p className="mb-4 text-sm text-gray-600">
            Approval review is captured here without sending SMS or email.
          </p>

          <div className="mb-4 rounded border bg-white p-3">
            <p className="mb-1 text-xs text-gray-500">Seller Reply</p>
            <p>{lead.lastSellerReply}</p>
            <p className="mt-2 text-xs text-gray-400">
              {formatDate(lead.lastSellerReplyAt)}
            </p>
          </div>

          <div className="mb-4 grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded border bg-white p-3">
              <strong>Intent:</strong>{" "}
              {lead.lastSellerReplyIntent || "Unknown"}
            </div>

            <div className="rounded border bg-white p-3">
              <strong>Confidence:</strong>{" "}
              {typeof lead.lastSellerReplyConfidence === "number"
                ? `${(lead.lastSellerReplyConfidence * 100).toFixed(0)}%`
                : "Unknown"}
            </div>

            <div className="rounded border bg-white p-3">
              <strong>Approval:</strong>{" "}
              {lead.requiresHumanApproval ? "YES" : "NO"}
            </div>
          </div>

          <textarea
            value={aiReplyText}
            onChange={(event) => setAiReplyText(event.target.value)}
            rows={5}
            className="mb-3 w-full rounded border p-3"
            placeholder="Edit or approve AI reply..."
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => submitApproval("approve")}
              disabled={aiReplySendState === "saving" || !!lead.doNotContact}
              className="rounded bg-orange-500 px-4 py-2 text-white disabled:opacity-50"
            >
              {aiReplySendState === "saving"
                ? "Saving..."
                : "Save approval review, not sent"}
            </button>

            <button
              type="button"
              onClick={() => submitApproval("reject")}
              disabled={aiReplySendState === "saving"}
              className="rounded border border-red-200 px-4 py-2 text-red-700 disabled:opacity-50"
            >
              Reject reply review
            </button>

            <button
              type="button"
              onClick={() => setAiReplyText(lead.suggestedReply || "")}
              className="rounded border px-4 py-2"
            >
              Reset
            </button>
          </div>

          {lead.doNotContact ? (
            <p className="mt-2 text-red-600">
              Do Not Contact - external contact disabled
            </p>
          ) : null}

          {aiReplyError ? (
            <p className="mt-2 text-red-600">{aiReplyError}</p>
          ) : null}

          {aiReplyStatusMessage ? (
            <p className="mt-2 text-green-600">
              {aiReplyStatusMessage}
            </p>
          ) : null}
        </section>
      ) : (
        <section className="rounded-xl border bg-white p-5">
          <h2 className="mb-2 text-lg font-bold">AI Seller Reply Analysis</h2>
          <p className="text-sm text-gray-600">
            No seller reply has been captured for this lead yet.
          </p>
        </section>
      )}
    </div>
  );
}
