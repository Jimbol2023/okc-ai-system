import type { DashboardSignalConsolidation } from "./dashboard-signal-consolidation";
import type { StoredLead } from "./leads-storage";
import type { PracticalOperatorWorkQueue } from "./operator-work-queue-practicalization";
import type { R53ManualRevenueMetricsResult } from "./r53-manual-revenue-metrics-helper";

export const stopAndMeasureFlags = {
  providerCalled: false,
  sent: false,
  runtimeActivationAllowed: false,
  storageAuthorized: false,
  auditWritingAllowed: false,
  queueCreated: false,
  routingCreated: false,
  assignmentCreated: false,
  reminderCreated: false,
  calendarItemCreated: false,
  automationTriggered: false,
  outreachCreated: false,
  crmMutationExpanded: false,
  revenueActionExecuted: false,
  analyticsPersisted: false,
  trackingEnabled: false,
  pollingEnabled: false,
} as const;

export type StopAndMeasureStatus =
  | "not_enough_pilot_data"
  | "measure_operator_friction"
  | "measure_revenue_throughput"
  | "measure_safety_cleanup";

export type StopAndMeasureResult = {
  phase: "Stop And Measure";
  measurementStatus: StopAndMeasureStatus;
  operatorThroughputSignals: {
    totalLeads: number;
    visibleManualQueueRows: number;
    reviewNowCount: number;
    sellerCallOutcomesRecorded: number;
    buyerReadyNearCloseCount: number;
  };
  frictionSignals: {
    blockedDncCount: number;
    cleanupCount: number;
    overdueFollowUpCount: number;
    dueFollowUpCount: number;
  };
  safetySignals: string[];
  measurementQuestions: string[];
  decisionPrompt: string;
  recommendedNextExactStep: "Review Pilot Results Before Expanding Scope";
  advisoryOnly: true;
  readOnly: true;
  flags: typeof stopAndMeasureFlags;
};

export type StopAndMeasureInput = {
  leads: StoredLead[];
  metrics: R53ManualRevenueMetricsResult;
  dashboardSignal: DashboardSignalConsolidation;
  workQueue: PracticalOperatorWorkQueue;
};

function getMeasurementStatus({
  totalLeads,
  blockedDncCount,
  cleanupCount,
  overdueFollowUpCount,
  dueFollowUpCount,
  reviewNowCount,
  buyerReadyNearCloseCount,
}: {
  totalLeads: number;
  blockedDncCount: number;
  cleanupCount: number;
  overdueFollowUpCount: number;
  dueFollowUpCount: number;
  reviewNowCount: number;
  buyerReadyNearCloseCount: number;
}): StopAndMeasureStatus {
  if (totalLeads === 0) return "not_enough_pilot_data";
  if (blockedDncCount > 0 || cleanupCount > 0) return "measure_safety_cleanup";
  if (overdueFollowUpCount > 0 || dueFollowUpCount > 0) return "measure_operator_friction";
  if (reviewNowCount > 0 || buyerReadyNearCloseCount > 0) return "measure_revenue_throughput";
  return "measure_operator_friction";
}

export function createStopAndMeasureResult(input: StopAndMeasureInput): StopAndMeasureResult {
  const sellerCallOutcomesRecorded = Math.max(
    input.metrics.metricValues.manual_seller_calls_recorded,
    input.metrics.metricValues.seller_outcomes_recorded,
  );
  const buyerReadyNearCloseCount = input.dashboardSignal.nearCloseBuyerReadyCount;
  const totalLeads = input.dashboardSignal.totalLeads;
  const blockedDncCount = input.dashboardSignal.blockedDncCount;
  const cleanupCount = input.dashboardSignal.cleanupCount;
  const overdueFollowUpCount = input.dashboardSignal.overdueFollowUpCount;
  const dueFollowUpCount = input.dashboardSignal.dueFollowUpCount;
  const reviewNowCount = input.dashboardSignal.reviewNowCount;

  return {
    phase: "Stop And Measure",
    measurementStatus: getMeasurementStatus({
      totalLeads,
      blockedDncCount,
      cleanupCount,
      overdueFollowUpCount,
      dueFollowUpCount,
      reviewNowCount,
      buyerReadyNearCloseCount,
    }),
    operatorThroughputSignals: {
      totalLeads,
      visibleManualQueueRows: input.workQueue.visibleRows.length,
      reviewNowCount,
      sellerCallOutcomesRecorded,
      buyerReadyNearCloseCount,
    },
    frictionSignals: {
      blockedDncCount,
      cleanupCount,
      overdueFollowUpCount,
      dueFollowUpCount,
    },
    safetySignals: [
      "No analytics persistence, tracking, polling, queue creation, routing, assignment, reminder, calendar item, outreach, or automation is enabled.",
      "Use these counts to decide whether the pilot workflow reduced operator friction before expanding scope.",
      "Do not add another advisory layer until real pilot use shows a specific bottleneck.",
    ],
    measurementQuestions: [
      "Can the operator identify the first lead to inspect without opening multiple panels?",
      "Are blocked, DNC, and cleanup records being resolved before revenue review?",
      "Are overdue and due-soon follow-ups visible enough to prevent stale leads?",
      "Do seller-call and buyer-ready counts point to real manual revenue movement?",
      "Which single usability bottleneck should be improved next, if any?",
    ],
    decisionPrompt:
      totalLeads === 0
        ? "Not enough pilot data yet. Load real leads, then measure whether the dashboard and work queue help the operator choose the next manual review."
        : "Review these pilot counts with real operator use before expanding scope. Continue only where the numbers show friction or missed revenue throughput.",
    recommendedNextExactStep: "Review Pilot Results Before Expanding Scope",
    advisoryOnly: true,
    readOnly: true,
    flags: stopAndMeasureFlags,
  };
}

export function createStopAndMeasureSummary() {
  return {
    phase: "Stop And Measure" as const,
    stopAndMeasureReady: true,
    recommendedNextExactStep: "Review Pilot Results Before Expanding Scope" as const,
    advisoryOnly: true,
    readOnly: true,
    flags: stopAndMeasureFlags,
  };
}
