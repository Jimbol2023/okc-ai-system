"use client";

import { useEffect, useState } from "react";

import { generateLeads } from "@/lib/lead-generator";
import { createGeneratedLeads, fetchLeads } from "@/lib/leads-api";
import { fetchRealLeads } from "@/lib/real-leads";
import type { StoredLead } from "@/lib/leads-storage";
import { deriveManualRevenueMetrics, type R53ManualRevenueMetricsResult } from "@/lib/r53-manual-revenue-metrics-helper";
import { StatCard } from "@/components/shared/stat-card";
import SystemReadinessPanel from "@/components/dashboard/system-readiness-panel";
import BuyerIntelligencePanel from "@/components/dashboard/buyer-intelligence-panel";
import { SystemHealthSafetyBar } from "@/components/dashboard/system-health-safety-bar";
import { ActivityAuditPreviewPanel } from "@/components/dashboard/activity-audit-preview-panel";
import { ManualRevenueWorkdaySummary } from "@/components/dashboard/manual-revenue-workday-summary";
import { StuckDealRecoverySummary } from "@/components/dashboard/stuck-deal-recovery-summary";
import { NearCloseRevenueRecoverySummary } from "@/components/dashboard/near-close-revenue-recovery-summary";
import { OperatorWorkQueueSummary } from "@/components/dashboard/operator-work-queue-summary";
import { AcquisitionDailyCallPrioritySummary } from "@/components/dashboard/acquisition-daily-call-priority-summary";
import { BuyerReadyDispositionPrioritySummary } from "@/components/dashboard/buyer-ready-disposition-priority-summary";
import { BuyerDispositionOperationalIntelligenceSummary } from "@/components/dashboard/buyer-disposition-operational-intelligence-summary";
import { OperatorWorkQueueIntelligenceSummary } from "@/components/dashboard/operator-work-queue-intelligence-summary";
import { DrivingForDollarsIntelligenceSummary } from "@/components/dashboard/driving-for-dollars-intelligence-summary";
import { LeadQualityIntelligenceSummary } from "@/components/dashboard/lead-quality-intelligence-summary";
import { ControlledExecutionReadinessSummary } from "@/components/dashboard/controlled-execution-readiness-summary";
import { AutomationLastGovernanceSummary } from "@/components/dashboard/automation-last-governance-summary";
import { ExecutionSimulationIntelligenceSummary } from "@/components/dashboard/execution-simulation-intelligence-summary";
import { ProviderIsolationSafetySummary } from "@/components/dashboard/provider-isolation-safety-summary";
import { ManualOperatorActionCenterSummary } from "@/components/dashboard/manual-operator-action-center-summary";
import { ControlledHumanOutreachSummary } from "@/components/dashboard/controlled-human-outreach-summary";
import { RevenueCommandCenterSummary } from "@/components/dashboard/revenue-command-center-summary";
import { ProviderActivationReadinessSummary } from "@/components/dashboard/provider-activation-readiness-summary";
import { HitlRevenueExecutionSummary } from "@/components/dashboard/hitl-revenue-execution-summary";
import { VirtualDrivingForDollarsSummary } from "@/components/dashboard/virtual-driving-for-dollars-summary";
import { DistressPropertyIntelligenceSummary } from "@/components/dashboard/distress-property-intelligence-summary";
import { AcquisitionOpportunityScoringSummary } from "@/components/dashboard/acquisition-opportunity-scoring-summary";
import { BuyerDemandAlignmentSummary } from "@/components/dashboard/buyer-demand-alignment-summary";
import { NeighborhoodOpportunityClusteringSummary } from "@/components/dashboard/neighborhood-opportunity-clustering-summary";
import { AcquisitionResearchWorkbenchSummary } from "@/components/dashboard/acquisition-research-workbench-summary";
import { MarketTimingMomentumSummary } from "@/components/dashboard/market-timing-momentum-summary";
import { AcquisitionDataVerificationReadinessSummary } from "@/components/dashboard/acquisition-data-verification-readiness-summary";
import { AcquisitionPriorityRevenueSummary } from "@/components/dashboard/acquisition-priority-revenue-summary";
import { ControlledAcquisitionWorkflowIntelligenceSummary } from "@/components/dashboard/controlled-acquisition-workflow-intelligence-summary";
import { ManualAcquisitionCommandCenterSummary } from "@/components/dashboard/manual-acquisition-command-center-summary";
import { ControlledRevenueOperationsSummary } from "@/components/dashboard/controlled-revenue-operations-summary";
import { ManualRevenueCommandCenterSummary } from "@/components/dashboard/manual-revenue-command-center-summary";
import { RevenueThroughputCoordinationSummary } from "@/components/dashboard/revenue-throughput-coordination-summary";
import { RevenueBottleneckResolutionSummary } from "@/components/dashboard/revenue-bottleneck-resolution-summary";
import { ControlledRevenueRecoverySummary } from "@/components/dashboard/controlled-revenue-recovery-summary";

const queue = [
  "Review new seller leads and assign an owner.",
  "Import tax delinquent list and flag out-of-state owners.",
  "Score new opportunities with the deal analyzer.",
  "Create follow-up tasks for inactive prospects."
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

export default function DashboardPage() {
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
            This internal area is structured for CRM activity, property review, underwriting, and future list-management workflows.
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
      {realLeadsError ? <p className="text-sm font-medium text-red-700">{realLeadsError}</p> : null}

      <SystemReadinessPanel />

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

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        <StatCard label="Open leads" value={String(openLeadCount)} helper="Includes submitted, imported, and AI-generated leads" />
        <StatCard label="Follow-up tasks" value={String(pendingFollowUpCount)} helper="Pending scheduled outreach items" />
        <StatCard label="Tracked opportunities" value={String(openLeadCount)} helper="Lead-linked opportunities under review" />
        <StatCard label="Source coverage" value="6" helper="Website, imports, and AI-generated discovery" />
      </div>

      <ManualRevenueWorkdaySummary metrics={manualRevenueMetrics} />

      <StuckDealRecoverySummary leads={dashboardLeads} metrics={manualRevenueMetrics} />

      <NearCloseRevenueRecoverySummary leads={dashboardLeads} metrics={manualRevenueMetrics} />

      <OperatorWorkQueueSummary leads={dashboardLeads} metrics={manualRevenueMetrics} />

      <AcquisitionDailyCallPrioritySummary leads={dashboardLeads} metrics={manualRevenueMetrics} />

      <BuyerReadyDispositionPrioritySummary leads={dashboardLeads} metrics={manualRevenueMetrics} />

      <BuyerDispositionOperationalIntelligenceSummary leads={dashboardLeads} metrics={manualRevenueMetrics} />

      <OperatorWorkQueueIntelligenceSummary leads={dashboardLeads} metrics={manualRevenueMetrics} />

      <DrivingForDollarsIntelligenceSummary leads={dashboardLeads} metrics={manualRevenueMetrics} />

      <LeadQualityIntelligenceSummary leads={dashboardLeads} metrics={manualRevenueMetrics} />

      <ControlledExecutionReadinessSummary />

      <AutomationLastGovernanceSummary />

      <ExecutionSimulationIntelligenceSummary />

      <ProviderIsolationSafetySummary />

      <ManualOperatorActionCenterSummary />

      <ControlledHumanOutreachSummary />

      <RevenueCommandCenterSummary />

      <ProviderActivationReadinessSummary />

      <HitlRevenueExecutionSummary />

      <VirtualDrivingForDollarsSummary />

      <DistressPropertyIntelligenceSummary />

      <AcquisitionOpportunityScoringSummary />

      <BuyerDemandAlignmentSummary />

      <NeighborhoodOpportunityClusteringSummary />

      <AcquisitionResearchWorkbenchSummary />

      <MarketTimingMomentumSummary />

      <AcquisitionDataVerificationReadinessSummary />

      <AcquisitionPriorityRevenueSummary />

      <ControlledAcquisitionWorkflowIntelligenceSummary />

      <ManualAcquisitionCommandCenterSummary />

      <ControlledRevenueOperationsSummary />

      <ManualRevenueCommandCenterSummary />

      <RevenueThroughputCoordinationSummary />

      <RevenueBottleneckResolutionSummary />

      <ControlledRevenueRecoverySummary />

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

      <BuyerIntelligencePanel />

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
