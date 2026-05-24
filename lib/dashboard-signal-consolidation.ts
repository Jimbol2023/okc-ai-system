import type { StoredLead } from "./leads-storage";
import type { R53ManualRevenueMetricsResult } from "./r53-manual-revenue-metrics-helper";
import { createRealManualFollowUpWorkspaceList, realManualFollowUpWorkspaceFlags } from "./real-manual-follow-up-workspace-adapter";
import { createRealManualLeadOperationsDecisionList } from "./real-manual-lead-operations-decision-adapter";

export const dashboardSignalConsolidationFlags = {
  ...realManualFollowUpWorkspaceFlags,
  dashboardSignalPersisted: false,
  dashboardRouteCreated: false,
  operatorAssignmentCreated: false,
  dashboardQueueCreated: false,
  dashboardReminderCreated: false,
  dashboardCalendarItemCreated: false,
  dashboardPollingEnabled: false,
  dashboardAutomationTriggered: false,
  dashboardCrmMutationAllowed: false,
} as const;

export type DashboardSignalPriority =
  | "no_urgent_signals"
  | "blocked_stop_first"
  | "cleanup_before_work"
  | "overdue_follow_up_review"
  | "review_revenue_now"
  | "near_close_or_buyer_ready_review"
  | "manual_review_today";

export type DashboardSignalConsolidation = {
  totalLeads: number;
  topOperatorPriority: DashboardSignalPriority;
  blockedDncCount: number;
  cleanupCount: number;
  overdueFollowUpCount: number;
  dueFollowUpCount: number;
  reviewNowCount: number;
  nearCloseBuyerReadyCount: number;
  safeNextDashboardStep: string;
  signalCards: Array<{
    label: string;
    value: number;
    helper: string;
  }>;
  advisoryOnly: true;
  readOnly: true;
  flags: typeof dashboardSignalConsolidationFlags;
};

function getTopOperatorPriority({
  totalLeads,
  blockedDncCount,
  cleanupCount,
  overdueFollowUpCount,
  reviewNowCount,
  nearCloseBuyerReadyCount,
  dueFollowUpCount,
}: {
  totalLeads: number;
  blockedDncCount: number;
  cleanupCount: number;
  overdueFollowUpCount: number;
  reviewNowCount: number;
  nearCloseBuyerReadyCount: number;
  dueFollowUpCount: number;
}): DashboardSignalPriority {
  if (totalLeads === 0) return "no_urgent_signals";
  if (blockedDncCount > 0) return "blocked_stop_first";
  if (cleanupCount > 0) return "cleanup_before_work";
  if (overdueFollowUpCount > 0) return "overdue_follow_up_review";
  if (reviewNowCount > 0) return "review_revenue_now";
  if (nearCloseBuyerReadyCount > 0) return "near_close_or_buyer_ready_review";
  if (dueFollowUpCount > 0) return "manual_review_today";
  return "no_urgent_signals";
}

function getSafeNextDashboardStep(priority: DashboardSignalPriority) {
  if (priority === "blocked_stop_first") return "Open leads with blocked or DNC signals and confirm no manual follow-up or external action should occur.";
  if (priority === "cleanup_before_work") return "Clean up missing source, contact, property, or seller context before reviewing lower-priority work.";
  if (priority === "overdue_follow_up_review") return "Review overdue follow-up timing manually from the leads workspace; no reminder, send, or task is created.";
  if (priority === "review_revenue_now") return "Review highest-value seller leads from the leads workspace before lower-value monitoring.";
  if (priority === "near_close_or_buyer_ready_review") return "Review near-close or buyer-ready records manually before buyer-facing action.";
  if (priority === "manual_review_today") return "Review due follow-ups and human-review items today without creating assignments or queues.";
  return "No urgent dashboard signal is visible. Monitor new leads and keep source tracking clean.";
}

export function createDashboardSignalConsolidation(
  leads: StoredLead[],
  metrics: R53ManualRevenueMetricsResult,
): DashboardSignalConsolidation {
  const followUpWorkspace = createRealManualFollowUpWorkspaceList(leads);
  const leadDecisionList = createRealManualLeadOperationsDecisionList(leads);
  const decisionCounts = leadDecisionList.decisions.reduce(
    (counts, decision) => {
      if (decision.decisionLane === "stop_do_not_work") counts.blocked += 1;
      if (decision.decisionLane === "cleanup_before_decision") counts.cleanup += 1;
      if (decision.decisionLane === "review_revenue_now" || decision.decisionLane === "review_revenue_today") counts.reviewNow += 1;
      return counts;
    },
    { blocked: 0, cleanup: 0, reviewNow: 0 },
  );

  const blockedDncCount = Math.max(
    decisionCounts.blocked,
    metrics.metricValues.blocked_leads,
    metrics.metricValues.dnc_opt_out_blocked_leads,
    followUpWorkspace.laneCounts.blocked_no_follow_up,
  );
  const cleanupCount = Math.max(
    decisionCounts.cleanup,
    metrics.metricValues.missing_critical_data_count,
    followUpWorkspace.laneCounts.cleanup_before_follow_up,
  );
  const overdueFollowUpCount = Math.max(
    metrics.metricValues.manual_follow_ups_overdue,
    followUpWorkspace.laneCounts.overdue_manual_review,
  );
  const dueFollowUpCount = Math.max(
    metrics.metricValues.manual_follow_ups_due,
    followUpWorkspace.laneCounts.due_soon_manual_review,
  );
  const reviewNowCount = decisionCounts.reviewNow;
  const nearCloseBuyerReadyCount =
    metrics.metricValues.near_close_opportunities +
    metrics.metricValues.buyer_ready_leads +
    metrics.metricValues.incomplete_buyer_packages;
  const topOperatorPriority = getTopOperatorPriority({
    totalLeads: leads.length,
    blockedDncCount,
    cleanupCount,
    overdueFollowUpCount,
    reviewNowCount,
    nearCloseBuyerReadyCount,
    dueFollowUpCount,
  });

  return {
    totalLeads: leads.length,
    topOperatorPriority,
    blockedDncCount,
    cleanupCount,
    overdueFollowUpCount,
    dueFollowUpCount,
    reviewNowCount,
    nearCloseBuyerReadyCount,
    safeNextDashboardStep: getSafeNextDashboardStep(topOperatorPriority),
    signalCards: [
      {
        label: "Stop first",
        value: blockedDncCount,
        helper: "DNC, rejected, blocked, or governance-stop visibility",
      },
      {
        label: "Cleanup",
        value: cleanupCount,
        helper: "Missing source, contact, property, or seller context",
      },
      {
        label: "Follow-up pressure",
        value: overdueFollowUpCount + dueFollowUpCount,
        helper: `${overdueFollowUpCount} overdue, ${dueFollowUpCount} due`,
      },
      {
        label: "Revenue review",
        value: reviewNowCount + nearCloseBuyerReadyCount,
        helper: "Review-now, near-close, and buyer-ready signals",
      },
    ],
    advisoryOnly: true,
    readOnly: true,
    flags: dashboardSignalConsolidationFlags,
  };
}

export function createDashboardSignalConsolidationSummary() {
  return {
    phase: "Dashboard Signal Consolidation" as const,
    dashboardSignalConsolidationReady: true,
    recommendedNextExactStep: "Operator Work Queue Practicalization",
    remainingRoiPhases: [
      "Operator Work Queue Practicalization",
      "Seller Call Outcome Usability",
      "Buyer/Disposition Readiness Usability",
      "Operational Pilot Hardening",
      "Stop And Measure",
    ],
    advisoryOnly: true,
    readOnly: true,
    flags: dashboardSignalConsolidationFlags,
  };
}
