"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useState } from "react";

import { generateLeads } from "@/lib/lead-generator";
import { createGeneratedLeads, fetchLeads } from "@/lib/leads-api";
import { fetchRealLeads } from "@/lib/real-leads";
import type { StoredLead } from "@/lib/leads-storage";
import { createDashboardSignalConsolidation, type DashboardSignalConsolidation } from "@/lib/dashboard-signal-consolidation";
import { createOperationalPilotHardeningSummary } from "@/lib/operational-pilot-hardening";
import { createPracticalOperatorWorkQueue, type PracticalOperatorWorkQueue, type PracticalOperatorWorkQueueLane } from "@/lib/operator-work-queue-practicalization";
import { deriveManualRevenueMetrics, type R53ManualRevenueMetricsResult } from "@/lib/r53-manual-revenue-metrics-helper";
import { reviewPilotResultsBeforeExpandingScope, type PilotResultsReview } from "@/lib/review-pilot-results";
import { createStopAndMeasureResult, type StopAndMeasureResult } from "@/lib/stop-and-measure";
import { StatCard } from "@/components/shared/stat-card";
import SystemReadinessPanel from "@/components/dashboard/system-readiness-panel";
import { SystemHealthSafetyBar } from "@/components/dashboard/system-health-safety-bar";
import { ActivityAuditPreviewPanel } from "@/components/dashboard/activity-audit-preview-panel";

const queue = [
  "Open blocked or DNC leads first and confirm no external action should occur.",
  "Clean up missing source, contact, property, or seller context before lower-priority review.",
  "Review overdue and due-soon manual follow-ups from the leads workspace.",
  "Inspect review-now, near-close, and buyer-ready records manually before any buyer-facing action."
];

type AutomationDryRunPreview = {
  ok: boolean;
  dryRun: true;
  automationExecuted: false;
  providerCalled: false;
  sent: false;
  wouldSendSms: false;
  wouldSendEmail: false;
  wouldMutateLead: false;
  wouldCreateLeads: false;
  reason: string;
  safety: {
    readOnly: true;
    smsBlocked: true;
    emailBlocked: true;
    providerBlocked: true;
    dbWritesBlocked: true;
    leadCreationBlocked: true;
    liveAutomationBlocked: true;
  };
  queuedAutomationActions: unknown[];
  summary: string;
  ranAt: string;
};

function getPendingFollowUpCount(leads: StoredLead[]) {
  return leads.reduce(
    (count, lead) => count + getLeadFollowUps(lead).filter((followUp) => followUp.status === "pending").length,
    0
  );
}

function getLeadFollowUps(lead: StoredLead) {
  return Array.isArray(lead.followUps) ? lead.followUps : [];
}

function toManualRevenueMetricInput(lead: StoredLead) {
  const followUps = getLeadFollowUps(lead);
  const pendingFollowUp = followUps.find((followUp) => followUp.status === "pending");

  return {
    ...lead,
    source: lead.source,
    address: lead.propertyAddress,
    motivation: lead.situationDetails,
    timeline: lead.nextFollowUpAt ?? pendingFollowUp?.date ?? "",
    nextFollowUpAt: lead.nextFollowUpAt ?? pendingFollowUp?.date,
    manuallyReviewed: lead.approvalStatus !== "pending_review" && lead.approvalStatus !== "needs_human_review",
    manualSellerCallRecorded: followUps.some((followUp) => followUp.type === "call" && followUp.status === "completed"),
    sellerOutcome: lead.lastSellerReply ?? lead.latestApprovalNote ?? "",
    buyerReady: lead.status === "under_contract" || lead.approvalStatus === "approved_for_outreach",
    buyerPackageComplete: lead.status === "under_contract" || lead.status === "closed",
    stage: lead.status,
    blocked: lead.approvalStatus === "rejected",
    governanceBlocked: lead.doNotContact === true || lead.approvalStatus === "rejected",
    humanReviewRequired: lead.requiresHumanApproval === true || lead.approvalStatus === "needs_human_review",
    dnc: lead.doNotContact === true,
  };
}

function deriveDashboardManualRevenueMetrics(leads: StoredLead[]) {
  return deriveManualRevenueMetrics({
    leads: leads.map(toManualRevenueMetricInput),
    maxRecords: 500,
  });
}

function formatSignalLabel(value: string) {
  return value.replaceAll("_", " ");
}

function getPriorityTone(priority: DashboardSignalConsolidation["topOperatorPriority"]) {
  if (priority === "blocked_stop_first") return "border-red-200 bg-red-50 text-red-900";
  if (priority === "cleanup_before_work") return "border-amber-200 bg-amber-50 text-amber-900";
  if (priority === "overdue_follow_up_review") return "border-orange-200 bg-orange-50 text-orange-900";
  if (priority === "review_revenue_now" || priority === "near_close_or_buyer_ready_review") {
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  }
  return "border-blue-200 bg-blue-50 text-blue-900";
}

function formatQueueLaneLabel(lane: PracticalOperatorWorkQueueLane) {
  const labels: Record<PracticalOperatorWorkQueueLane, string> = {
    stop_first: "Stop first",
    cleanup_first: "Cleanup first",
    overdue_follow_up: "Overdue follow-up",
    review_now: "Review now",
    near_close_review: "Near-close review",
    buyer_ready_review: "Buyer-ready review",
    monitor: "Monitor",
  };

  return labels[lane];
}

function getQueueLaneTone(lane: PracticalOperatorWorkQueueLane) {
  if (lane === "stop_first") return "border-red-200 bg-red-50 text-red-900";
  if (lane === "cleanup_first") return "border-amber-200 bg-amber-50 text-amber-900";
  if (lane === "overdue_follow_up") return "border-orange-200 bg-orange-50 text-orange-900";
  if (lane === "review_now" || lane === "near_close_review" || lane === "buyer_ready_review") {
    return "border-emerald-200 bg-emerald-50 text-emerald-900";
  }
  return "border-blue-200 bg-blue-50 text-blue-900";
}

function ManualWorkQueue({ queue }: { queue: PracticalOperatorWorkQueue }) {
  return (
    <section
      aria-labelledby="manual-work-queue-heading"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Read-only review order</p>
          <h2 id="manual-work-queue-heading" className="break-words text-xl font-semibold text-primary">
            Manual work queue
          </h2>
          <p className="max-w-3xl break-words text-sm leading-6 text-muted">
            Practical ordering from current lead records only. No assignments, stored queue items, routing, reminders, calendar items, outreach, or workflow state are created.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <span className="max-w-full break-words rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-center leading-5 text-emerald-800">
            Read only
          </span>
          <span className="max-w-full break-words rounded-full border border-red-200 bg-red-50 px-3 py-1 text-center leading-5 text-red-800">
            No assignment
          </span>
        </div>
      </div>

      {queue.visibleRows.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-border bg-white p-4 text-sm leading-6 text-muted">
          <p className="font-semibold text-primary">No manual work rows are urgent right now.</p>
          <p className="mt-1">
            {queue.emptyState} Keep source tracking clean, watch new submissions, and use the leads workspace for manual review when records appear.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-3">
          {queue.visibleRows.map((row) => {
            const visibleChips = [...row.blockerLabels, ...row.cleanupLabels].slice(0, 4);

            return (
              <article key={row.leadId} className="min-w-0 rounded-2xl border border-border bg-white p-4">
                <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex max-w-full flex-wrap gap-2">
                      <span className={`max-w-full break-words rounded-full border px-3 py-1 text-xs font-bold uppercase leading-5 tracking-[0.08em] ${getQueueLaneTone(row.queueLane)}`}>
                        {formatQueueLaneLabel(row.queueLane)}
                      </span>
                      <span className="max-w-full break-words rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold leading-5 text-blue-900">
                        Source: {row.sourceVisible}
                      </span>
                    </div>
                    <h3 className="break-words text-base font-semibold text-primary">{row.leadLabel}</h3>
                    <p className="break-words text-sm leading-6 text-muted">{row.reason}</p>
                  </div>
                  <Link
                    href={row.detailHref as Route}
                    className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary/30"
                  >
                    Open lead detail
                  </Link>
                </div>

                <div className="mt-3 flex max-w-full flex-wrap gap-2">
                  <span className="max-w-full break-words rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold leading-5 text-slate-700">
                    {row.followUpLabel}
                  </span>
                  {visibleChips.map((chip) => (
                    <span key={chip} className="max-w-full break-words rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold leading-5 text-amber-900">
                      {chip}
                    </span>
                  ))}
                </div>

                <p className="mt-3 break-words text-sm leading-6 text-muted">{row.safeManualReview}</p>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-4 break-words text-xs font-semibold uppercase leading-5 tracking-[0.1em] text-muted">
        readOnly:true, queueItemCreated:false, operatorAssignmentCreated:false, reminderCreated:false, crmMutationAllowed:false
      </p>
    </section>
  );
}

function DashboardSignalBrief({ signal }: { signal: DashboardSignalConsolidation }) {
  return (
    <section
      aria-labelledby="dashboard-signal-brief-heading"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Dashboard signal consolidation</p>
          <h2 id="dashboard-signal-brief-heading" className="break-words text-xl font-semibold text-primary">
            Operator signal brief
          </h2>
          <p className="max-w-3xl break-words text-sm leading-6 text-muted">
            One read-only signal surface for what to review first. It consolidates lead decisions, follow-up pressure, cleanup risk, blocked states, and revenue review signals without creating work, queues, reminders, or automation.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <span className="max-w-full break-words rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-center leading-5 text-emerald-800">
            Read only
          </span>
          <span className="max-w-full break-words rounded-full border border-red-200 bg-red-50 px-3 py-1 text-center leading-5 text-red-800">
            No execution
          </span>
        </div>
      </div>

      <div className={`mt-5 rounded-2xl border p-4 ${getPriorityTone(signal.topOperatorPriority)}`}>
        <p className="text-xs font-bold uppercase tracking-[0.12em]">Top operator priority</p>
        <p className="mt-1 break-words text-lg font-semibold capitalize">{formatSignalLabel(signal.topOperatorPriority)}</p>
        <p className="mt-2 break-words text-sm leading-6">{signal.safeNextDashboardStep}</p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {signal.signalCards.map((card) => (
          <StatCard key={card.label} label={card.label} value={String(card.value)} helper={card.helper} />
        ))}
      </div>

      <div className="mt-5 grid gap-3 text-sm lg:grid-cols-[1fr_1fr_1fr]">
        <Link
          href="/dashboard/leads"
          className="rounded-2xl border border-border bg-white p-4 font-semibold text-primary transition hover:border-primary/30"
        >
          Review leads workspace
          <span className="mt-1 block text-sm font-normal leading-6 text-muted">Manual lead decisions, follow-up lanes, source, and cleanup visibility.</span>
        </Link>
        <Link
          href="/dashboard/approvals"
          className="rounded-2xl border border-border bg-white p-4 font-semibold text-primary transition hover:border-primary/30"
        >
          Review approvals
          <span className="mt-1 block text-sm font-normal leading-6 text-muted">Human approval visibility only; approval does not grant execution.</span>
        </Link>
        <Link
          href="/dashboard/leads"
          className="rounded-2xl border border-border bg-white p-4 font-semibold text-primary transition hover:border-primary/30"
        >
          Review follow-ups
          <span className="mt-1 block text-sm font-normal leading-6 text-muted">Overdue and due-soon follow-up review remains manual and outside automation.</span>
        </Link>
      </div>
    </section>
  );
}

function StopAndMeasurePanel({ measurement }: { measurement: StopAndMeasureResult }) {
  return (
    <section
      aria-labelledby="stop-and-measure-heading"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Pilot measurement checkpoint</p>
          <h2 id="stop-and-measure-heading" className="break-words text-xl font-semibold text-primary">
            Stop and measure
          </h2>
          <p className="max-w-3xl break-words text-sm leading-6 text-muted">
            Read-only pilot review from already-loaded lead data. Use these counts to decide whether real operator friction exists before expanding scope.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <span className="max-w-full break-words rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-center leading-5 text-emerald-800">
            No tracking
          </span>
          <span className="max-w-full break-words rounded-full border border-red-200 bg-red-50 px-3 py-1 text-center leading-5 text-red-800">
            No expansion
          </span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <p className="font-bold capitalize">{formatSignalLabel(measurement.measurementStatus)}</p>
        <p className="mt-1">{measurement.decisionPrompt}</p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <StatCard
          label="Blocked / DNC"
          value={String(measurement.frictionSignals.blockedDncCount)}
          helper="Stop-first records to inspect before work"
        />
        <StatCard
          label="Cleanup"
          value={String(measurement.frictionSignals.cleanupCount)}
          helper="Missing source, contact, property, or seller context"
        />
        <StatCard
          label="Follow-up pressure"
          value={String(measurement.frictionSignals.overdueFollowUpCount + measurement.frictionSignals.dueFollowUpCount)}
          helper={`${measurement.frictionSignals.overdueFollowUpCount} overdue, ${measurement.frictionSignals.dueFollowUpCount} due`}
        />
        <StatCard
          label="Manual queue rows"
          value={String(measurement.operatorThroughputSignals.visibleManualQueueRows)}
          helper="Visible read-only rows, not stored assignments"
        />
      </div>

      <div className="mt-4 grid gap-3 text-sm md:grid-cols-2 2xl:grid-cols-3">
        <div className="min-w-0 rounded-2xl border border-border bg-white p-4">
          <p className="break-words font-semibold text-primary">Revenue review</p>
          <p className="mt-1 break-words text-muted">
            {measurement.operatorThroughputSignals.reviewNowCount} review-now,{" "}
            {measurement.operatorThroughputSignals.buyerReadyNearCloseCount} buyer-ready or near-close.
          </p>
        </div>
        <div className="min-w-0 rounded-2xl border border-border bg-white p-4">
          <p className="break-words font-semibold text-primary">Seller-call visibility</p>
          <p className="mt-1 break-words text-muted">
            {measurement.operatorThroughputSignals.sellerCallOutcomesRecorded} seller-call outcome records are visible in the pilot measurement.
          </p>
        </div>
        <div className="min-w-0 rounded-2xl border border-border bg-white p-4">
          <p className="break-words font-semibold text-primary">Next decision</p>
          <p className="mt-1 break-words text-muted">{measurement.recommendedNextExactStep}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-white p-4 text-sm leading-6 text-muted">
        <p className="font-semibold text-primary">Measurement questions</p>
        <ul className="mt-2 space-y-1">
          {measurement.measurementQuestions.slice(0, 3).map((question) => (
            <li key={question}>- {question}</li>
          ))}
        </ul>
      </div>

      <p className="mt-4 break-words text-xs font-semibold uppercase leading-5 tracking-[0.1em] text-muted">
        readOnly:true analyticsPersisted:false trackingEnabled:false pollingEnabled:false queueCreated:false crmMutationExpanded:false
      </p>
    </section>
  );
}

function PilotReviewGatePanel({ review }: { review: PilotResultsReview }) {
  return (
    <section
      aria-labelledby="pilot-review-gate-heading"
      className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
    >
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-2">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Scope review gate</p>
          <h2 id="pilot-review-gate-heading" className="break-words text-xl font-semibold text-primary">
            Pilot Review Gate
          </h2>
          <p className="max-w-3xl break-words text-sm leading-6 text-muted">
            Uses the Stop And Measure counts only. Pick the next move from observed operator friction, not speculative advisory expansion.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
          <span className="max-w-full break-words rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-center leading-5 text-emerald-800">
            Read only
          </span>
          <span className="max-w-full break-words rounded-full border border-red-200 bg-red-50 px-3 py-1 text-center leading-5 text-red-800">
            Scope held
          </span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">
        <p className="font-bold capitalize">{formatSignalLabel(review.pilotReviewDecision)}</p>
        <p className="mt-1">{review.finalRecommendation}</p>
      </div>

      <div className="mt-4 grid gap-3 text-sm lg:grid-cols-[1fr_1fr]">
        <div className="min-w-0 rounded-2xl border border-border bg-white p-4">
          <p className="break-words font-semibold text-primary">Recommended focus</p>
          <p className="mt-1 break-words leading-6 text-muted">{review.recommendedFocusArea}</p>
          <p className="mt-3 break-words text-xs font-bold uppercase leading-5 tracking-[0.08em] text-muted">
            Next: {review.recommendedNextExactStep}
          </p>
        </div>
        <div className="min-w-0 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
          <p className="break-words font-semibold">Expansion warning</p>
          <p className="mt-1 break-words leading-6">{review.scopeExpansionWarning}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-white p-4 text-sm leading-6 text-muted">
        <p className="font-semibold text-primary">Evidence</p>
        <ul className="mt-2 space-y-1">
          {review.evidenceSummary.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </div>

      <p className="mt-4 break-words text-xs font-semibold uppercase leading-5 tracking-[0.1em] text-muted">
        readOnly:true pilotReviewPersisted:false trackingEnabled:false pilotScopeExpanded:false pilotWorkflowCreated:false pilotDecisionExecuted:false
      </p>
    </section>
  );
}

export default function DashboardPage() {
  const operationalPilot = createOperationalPilotHardeningSummary();
  const [openLeadCount, setOpenLeadCount] = useState(0);
  const [pendingFollowUpCount, setPendingFollowUpCount] = useState(0);
  const [dealFinderMessage, setDealFinderMessage] = useState<string | null>(null);
  const [isRunningDealFinder, setIsRunningDealFinder] = useState(false);
  const [realLeadsMessage, setRealLeadsMessage] = useState<string | null>(null);
  const [realLeadsError, setRealLeadsError] = useState<string | null>(null);
  const [isFetchingRealLeads, setIsFetchingRealLeads] = useState(false);
  const [isAutomationPreviewing, setIsAutomationPreviewing] = useState(false);
  const [automationPreview, setAutomationPreview] = useState<AutomationDryRunPreview | null>(null);
  const [automationPreviewError, setAutomationPreviewError] = useState<string | null>(null);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [dashboardLeads, setDashboardLeads] = useState<StoredLead[]>([]);
  const [manualRevenueMetrics, setManualRevenueMetrics] = useState<R53ManualRevenueMetricsResult>(() =>
    deriveDashboardManualRevenueMetrics([])
  );
  const dashboardSignal = createDashboardSignalConsolidation(dashboardLeads, manualRevenueMetrics);
  const practicalWorkQueue = createPracticalOperatorWorkQueue(dashboardLeads, manualRevenueMetrics);
  const stopAndMeasure = createStopAndMeasureResult({
    leads: dashboardLeads,
    metrics: manualRevenueMetrics,
    dashboardSignal,
    workQueue: practicalWorkQueue,
  });
  const pilotReview = reviewPilotResultsBeforeExpandingScope(stopAndMeasure);

  async function refreshLeadCounts() {
    const leads = await fetchLeads();

    setOpenLeadCount(leads.length);
    setPendingFollowUpCount(getPendingFollowUpCount(leads));
    setDashboardLeads(leads);
    setManualRevenueMetrics(deriveDashboardManualRevenueMetrics(leads));
    setIsLoadingLeads(false);

    return leads;
  }

  async function handleRunDealFinder() {
    setIsRunningDealFinder(true);
    setRealLeadsError(null);

    try {
      const generatedLeads = generateLeads();
      const result = await createGeneratedLeads(generatedLeads);

      setOpenLeadCount(result.leads.length);
      setPendingFollowUpCount(getPendingFollowUpCount(result.leads));
      setDashboardLeads(result.leads);
      setManualRevenueMetrics(deriveDashboardManualRevenueMetrics(result.leads));
      setDealFinderMessage(
        result.skippedCount > 0
          ? `${result.addedCount} new leads found. ${result.skippedCount} duplicates skipped.`
          : `${result.addedCount} new leads found.`
      );
    } finally {
      setIsRunningDealFinder(false);
    }
  }

  async function handleFetchRealLeads() {
    setIsFetchingRealLeads(true);
    setRealLeadsError(null);

    try {
      const fetchedLeads = await fetchRealLeads();
      const result = await createGeneratedLeads(fetchedLeads);

      setOpenLeadCount(result.leads.length);
      setPendingFollowUpCount(getPendingFollowUpCount(result.leads));
      setDashboardLeads(result.leads);
      setManualRevenueMetrics(deriveDashboardManualRevenueMetrics(result.leads));
      setRealLeadsMessage(
        result.skippedCount > 0
          ? `${result.addedCount} real leads fetched. ${result.skippedCount} duplicates skipped.`
          : `${result.addedCount} real leads fetched.`
      );
    } catch {
      setRealLeadsError("Failed to fetch leads.");
    } finally {
      setIsFetchingRealLeads(false);
    }
  }

  useEffect(() => {
    void refreshLeadCounts();
  }, []);

  async function handlePreviewAutomationDryRun() {
    setIsAutomationPreviewing(true);
    setAutomationPreviewError(null);

    try {
      const response = await fetch("/api/automation", {
        method: "POST",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });
      const result = (await response.json()) as AutomationDryRunPreview;

      if (
        !response.ok ||
        result.dryRun !== true ||
        result.automationExecuted !== false ||
        result.providerCalled !== false ||
        result.sent !== false
      ) {
        throw new Error("Automation dry-run preview returned an unsafe response.");
      }

      setAutomationPreview(result);
    } catch (error) {
      setAutomationPreview(null);
      setAutomationPreviewError(
        error instanceof Error ? error.message : "Automation dry-run preview failed.",
      );
    } finally {
      setIsAutomationPreviewing(false);
    }
  }

  return (
    <div className="min-w-0 space-y-7 xl:space-y-8">
      <SystemHealthSafetyBar
        leadCount={openLeadCount}
        pendingFollowUpCount={pendingFollowUpCount}
        isLoadingLeads={isLoadingLeads}
        isAutomationRunning={isAutomationPreviewing}
      />

      <ActivityAuditPreviewPanel
        leadCount={openLeadCount}
        pendingFollowUpCount={pendingFollowUpCount}
        isLoadingLeads={isLoadingLeads}
      />

      <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 space-y-3">
          <p className="break-words text-sm font-semibold uppercase tracking-[0.2em] text-muted">Internal Dashboard</p>
          <h1 className="break-words text-3xl font-semibold text-primary md:text-4xl">Operations overview</h1>
          <p className="max-w-2xl break-words text-sm leading-6 text-muted md:text-base">
            This pilot view is for manual CRM review, follow-up visibility, and revenue inspection. User-triggered tools below do not send outreach, create assignments, schedule reminders, or run automation.
          </p>
        </div>

        <div className="flex max-w-full flex-wrap gap-2 xl:justify-end">
          <button
            type="button"
            onClick={() => void handlePreviewAutomationDryRun()}
            disabled={isAutomationPreviewing}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30 hover:text-primary-strong disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isAutomationPreviewing ? "Previewing..." : "Preview Automation Dry Run"}
          </button>
          <button
            type="button"
            onClick={() => void handleFetchRealLeads()}
            disabled={isFetchingRealLeads}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:border-primary/30 hover:text-primary-strong disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isFetchingRealLeads ? "Fetching..." : "Fetch Real Leads"}
          </button>
          <button
            type="button"
            onClick={() => void handleRunDealFinder()}
            disabled={isRunningDealFinder || isLoadingLeads}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#d89a42] px-5 py-2.5 text-sm font-bold text-[#102437] transition hover:bg-[#e5a64f] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isRunningDealFinder ? "Running..." : "Run Deal Finder"}
          </button>
        </div>
      </div>

      {dealFinderMessage ? <p className="text-sm font-medium text-success">{dealFinderMessage}</p> : null}
      {realLeadsMessage ? <p className="text-sm font-medium text-success">{realLeadsMessage}</p> : null}
      {realLeadsError ? (
        <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">
          {realLeadsError} No outreach, routing, reminders, or CRM status movement was created. Review the source feed manually before retrying.
        </p>
      ) : null}

      <SystemReadinessPanel />

      <section className="rounded-[1.5rem] border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950 sm:p-5">
        <p className="font-bold">Operational pilot hardening</p>
        <p className="mt-1">
          Dashboard, leads workspace, lead detail, seller-call capture, and buyer/disposition review are ready for manual pilot use. Next step: {operationalPilot.recommendedNextExactStep}.
        </p>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em]">
          providerCalled:false sent:false queueCreated:false assignmentCreated:false reminderCreated:false crmMutationExpanded:false
        </p>
      </section>

      <section className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
        <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 space-y-2">
            <h2 className="break-words text-xl font-semibold text-primary">Automation Agent</h2>
            <p className="break-words text-sm leading-6 text-muted">
              Manual dry-run preview for automation boundaries. No polling, live automation, provider call, SMS, email, or database mutation is executed here.
            </p>
          </div>
          <span className="inline-flex max-w-full break-words rounded-full bg-[#e7eef5] px-3 py-1 text-center text-xs font-semibold uppercase leading-5 tracking-[0.12em] text-[#355066]">
            Dry Run Only
          </span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          <StatCard
            label="Last Preview"
            value={automationPreview ? new Intl.DateTimeFormat("en-US", { dateStyle: "short", timeStyle: "short" }).format(new Date(automationPreview.ranAt)) : "Not yet"}
            helper="Manual dry-run preview only"
          />
          <StatCard
            label="Automation Executed"
            value="false"
            helper="No live automation runs from this panel"
          />
          <StatCard
            label="Provider Called"
            value="false"
            helper="No provider or Twilio call is allowed"
          />
          <StatCard
            label="SMS Sent"
            value="false"
            helper="No SMS or email is sent"
          />
        </div>

        {automationPreview ? (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950">
            <p className="break-words font-semibold">Advisory dry-run result</p>
            <p className="mt-1 break-words leading-6">{automationPreview.summary}</p>
            <div className="mt-3 flex max-w-full flex-wrap gap-2">
              <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 text-xs font-bold leading-5">dryRun:true</span>
              <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 text-xs font-bold leading-5">automationExecuted:false</span>
              <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 text-xs font-bold leading-5">providerCalled:false</span>
              <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 text-xs font-bold leading-5">sent:false</span>
              <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 text-xs font-bold leading-5">liveExecutionAllowed:false</span>
              <span className="max-w-full break-words rounded border border-blue-200 bg-white px-2 py-1 text-xs font-bold leading-5">simulationOnly:true</span>
            </div>
          </div>
        ) : null}

        {automationPreviewError ? (
          <p className="mt-4 break-words rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">
            {automationPreviewError}
          </p>
        ) : null}
      </section>

      <DashboardSignalBrief signal={dashboardSignal} />

      <ManualWorkQueue queue={practicalWorkQueue} />

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <StatCard label="Open leads" value={String(openLeadCount)} helper="Submitted, imported, and generated leads under review" />
        <StatCard label="Manual follow-ups" value={String(pendingFollowUpCount)} helper="Pending follow-up placeholders; no reminders or sends created" />
        <StatCard label="Cleanup needed" value={String(dashboardSignal.cleanupCount)} helper="Missing source, contact, property, or seller context" />
        <StatCard label="Stop / DNC" value={String(dashboardSignal.blockedDncCount)} helper="Do-not-proceed visibility, not an override control" />
      </div>

      <section
        aria-labelledby="manual-revenue-metrics-heading"
        className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6"
      >
        <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="break-words text-sm font-semibold uppercase tracking-[0.16em] text-muted">Read-only observability</p>
            <h2 id="manual-revenue-metrics-heading" className="break-words text-xl font-semibold text-primary">
              Manual revenue metrics
            </h2>
            <p className="max-w-3xl break-words text-sm leading-6 text-muted">
              In-memory dashboard summary for manual operator review only. No polling, persistence, provider call, SMS,
              email, automation, or live execution is enabled by these metrics.
            </p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.1em]">
            <span className="max-w-full break-words rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-center leading-5 text-emerald-800">
              Read only
            </span>
            <span className="max-w-full break-words rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-center leading-5 text-blue-800">
              Simulation only
            </span>
            <span className="max-w-full break-words rounded-full border border-red-200 bg-red-50 px-3 py-1 text-center leading-5 text-red-800">
              Providers blocked
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          <StatCard
            label="Needs manual review"
            value={String(manualRevenueMetrics.metricValues.leads_needing_review)}
            helper="Review queue signal only; no approval or outreach is triggered"
          />
          <StatCard
            label="Seller calls recorded"
            value={String(manualRevenueMetrics.metricValues.manual_seller_calls_recorded)}
            helper="Manual call outcomes recorded in lead data"
          />
          <StatCard
            label="Buyer-ready leads"
            value={String(manualRevenueMetrics.metricValues.buyer_ready_leads)}
            helper="Requires human package review before sharing"
          />
          <StatCard
            label="Blocked leads"
            value={String(manualRevenueMetrics.metricValues.blocked_leads)}
            helper="Do-not-proceed visibility, not an override control"
          />
        </div>

        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2 2xl:grid-cols-3">
          <div className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <p className="break-words font-semibold text-primary">Manual follow-up load</p>
            <p className="mt-1 break-words text-muted">
              {manualRevenueMetrics.metricValues.manual_follow_ups_due} due,{" "}
              {manualRevenueMetrics.metricValues.manual_follow_ups_overdue} overdue.
            </p>
          </div>
          <div className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <p className="break-words font-semibold text-primary">Critical data risk</p>
            <p className="mt-1 break-words text-muted">
              {manualRevenueMetrics.metricValues.missing_critical_data_count} leads have missing source, address,
              contact, motivation, or timeline data.
            </p>
          </div>
          <div className="min-w-0 rounded-2xl border border-border bg-white p-4">
            <p className="break-words font-semibold text-primary">Safety boundary</p>
            <p className="mt-1 break-words text-muted">
              readOnly:true, providerCalled:false, sent:false, automationExecuted:false.
            </p>
          </div>
        </div>
      </section>

      <StopAndMeasurePanel measurement={stopAndMeasure} />

      <PilotReviewGatePanel review={pilotReview} />

      <section className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
        <h2 className="break-words text-xl font-semibold text-primary">Suggested operator workflow</h2>
        <div className="mt-4 grid gap-3">
          {queue.map((item) => (
            <div key={item} className="min-w-0 break-words rounded-2xl border border-border bg-white px-4 py-3 text-sm text-muted">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
