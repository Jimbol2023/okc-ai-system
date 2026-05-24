import type { StoredLead } from "./leads-storage";
import {
  createStopAndMeasureResult,
  createStopAndMeasureSummary,
  stopAndMeasureFlags,
} from "./stop-and-measure";
import type { DashboardSignalConsolidation } from "./dashboard-signal-consolidation";
import { dashboardSignalConsolidationFlags } from "./dashboard-signal-consolidation";
import type { PracticalOperatorWorkQueue } from "./operator-work-queue-practicalization";
import { practicalOperatorWorkQueueFlags, practicalOperatorWorkQueueLanes } from "./operator-work-queue-practicalization";
import type { R53ManualRevenueMetricId, R53ManualRevenueMetricsResult } from "./r53-manual-revenue-metrics-helper";

function makeMetrics(overrides: Partial<Record<R53ManualRevenueMetricId, number>> = {}): R53ManualRevenueMetricsResult {
  const metricValues: Record<R53ManualRevenueMetricId, number> = {
    total_leads_provided: 0,
    leads_needing_review: 0,
    manually_reviewed_leads: 0,
    manual_seller_calls_recorded: 0,
    seller_outcomes_recorded: 0,
    manual_follow_ups_due: 0,
    manual_follow_ups_overdue: 0,
    buyer_ready_leads: 0,
    incomplete_buyer_packages: 0,
    near_contract_opportunities: 0,
    near_close_opportunities: 0,
    blocked_leads: 0,
    dnc_opt_out_blocked_leads: 0,
    missing_critical_data_count: 0,
    governance_blocked_count: 0,
    human_review_required_count: 0,
    ...overrides,
  };

  return {
    sourceMode: "in_memory_input_only",
    inputRecordsProvided: metricValues.total_leads_provided,
    inputRecordsProcessed: metricValues.total_leads_provided,
    inputRecordsSkippedByBound: 0,
    referenceDateSource: "omitted_or_invalid",
    metrics: [],
    metricValues,
    excludedUnsafeMetrics: [],
    warningCodes: [],
    summary: "Read-only test metrics.",
    readOnly: true,
    persistenceWritten: false,
    providerCalled: false,
    sent: false,
    automationExecuted: false,
    pollingEnabled: false,
    liveExecutionAllowed: false,
    simulationOnly: true,
    advisoryOnly: true,
  };
}

function makeDashboardSignal(overrides: Partial<DashboardSignalConsolidation> = {}): DashboardSignalConsolidation {
  return {
    totalLeads: 0,
    topOperatorPriority: "no_urgent_signals",
    blockedDncCount: 0,
    cleanupCount: 0,
    overdueFollowUpCount: 0,
    dueFollowUpCount: 0,
    reviewNowCount: 0,
    nearCloseBuyerReadyCount: 0,
    safeNextDashboardStep: "No urgent dashboard signal is visible.",
    signalCards: [],
    advisoryOnly: true,
    readOnly: true,
    flags: dashboardSignalConsolidationFlags,
    ...overrides,
  };
}

function makeWorkQueue(overrides: Partial<PracticalOperatorWorkQueue> = {}): PracticalOperatorWorkQueue {
  return {
    rows: [],
    visibleRows: [],
    laneCounts: practicalOperatorWorkQueueLanes.reduce(
      (counts, lane) => ({ ...counts, [lane]: 0 }),
      {} as PracticalOperatorWorkQueue["laneCounts"],
    ),
    emptyState: "No manual work queue rows are visible.",
    dashboardPriority: "no_urgent_signals",
    recommendedNextExactStep: "Seller Call Outcome Usability",
    advisoryOnly: true,
    readOnly: true,
    flags: practicalOperatorWorkQueueFlags,
    ...overrides,
  };
}

describe("stop and measure", () => {
  it("returns a safe not-enough-data measurement for empty leads", () => {
    const result = createStopAndMeasureResult({
      leads: [],
      metrics: makeMetrics(),
      dashboardSignal: makeDashboardSignal(),
      workQueue: makeWorkQueue(),
    });

    expect(result.measurementStatus).toBe("not_enough_pilot_data");
    expect(result.operatorThroughputSignals.totalLeads).toBe(0);
    expect(result.decisionPrompt).toMatch(/Not enough pilot data/i);
  });

  it("surfaces blocked, cleanup, follow-up, review-now, seller-call, buyer-ready, and near-close counts from existing inputs", () => {
    const result = createStopAndMeasureResult({
      leads: [{ id: "lead-1" } as StoredLead],
      metrics: makeMetrics({
        total_leads_provided: 3,
        manual_seller_calls_recorded: 2,
        seller_outcomes_recorded: 1,
      }),
      dashboardSignal: makeDashboardSignal({
        totalLeads: 3,
        blockedDncCount: 1,
        cleanupCount: 2,
        overdueFollowUpCount: 3,
        dueFollowUpCount: 4,
        reviewNowCount: 5,
        nearCloseBuyerReadyCount: 6,
      }),
      workQueue: makeWorkQueue({
        visibleRows: [
          {
            leadId: "lead-1",
            leadLabel: "Ada Seller",
            sourceVisible: "website",
            queueLane: "review_now",
            priorityRank: 100,
            reason: "Review now.",
            blockerLabels: [],
            cleanupLabels: [],
            followUpLabel: "ready",
            safeManualReview: "Review manually.",
            detailHref: "/dashboard/leads/lead-1",
            advisoryOnly: true,
            readOnly: true,
            flags: practicalOperatorWorkQueueFlags,
          },
        ],
      }),
    });

    expect(result.frictionSignals).toEqual({
      blockedDncCount: 1,
      cleanupCount: 2,
      overdueFollowUpCount: 3,
      dueFollowUpCount: 4,
    });
    expect(result.operatorThroughputSignals).toEqual({
      totalLeads: 3,
      visibleManualQueueRows: 1,
      reviewNowCount: 5,
      sellerCallOutcomesRecorded: 2,
      buyerReadyNearCloseCount: 6,
    });
    expect(result.measurementStatus).toBe("measure_safety_cleanup");
  });

  it("keeps measurement questions focused on usability and operator throughput instead of new advisory expansion", () => {
    const result = createStopAndMeasureResult({
      leads: [{ id: "lead-1" } as StoredLead],
      metrics: makeMetrics({ total_leads_provided: 1 }),
      dashboardSignal: makeDashboardSignal({ totalLeads: 1, reviewNowCount: 1 }),
      workQueue: makeWorkQueue(),
    });

    expect(result.measurementQuestions.join(" ")).toMatch(/operator|blocked|overdue|seller-call|usability bottleneck/i);
    expect(result.safetySignals.join(" ")).toContain("Do not add another advisory layer");
    expect(result.recommendedNextExactStep).toBe("Review Pilot Results Before Expanding Scope");
    expect(createStopAndMeasureSummary().recommendedNextExactStep).toBe("Review Pilot Results Before Expanding Scope");
  });

  it("keeps execution persistence analytics tracking and CRM mutation flags blocked", () => {
    expect(stopAndMeasureFlags.providerCalled).toBe(false);
    expect(stopAndMeasureFlags.sent).toBe(false);
    expect(stopAndMeasureFlags.runtimeActivationAllowed).toBe(false);
    expect(stopAndMeasureFlags.storageAuthorized).toBe(false);
    expect(stopAndMeasureFlags.auditWritingAllowed).toBe(false);
    expect(stopAndMeasureFlags.queueCreated).toBe(false);
    expect(stopAndMeasureFlags.routingCreated).toBe(false);
    expect(stopAndMeasureFlags.assignmentCreated).toBe(false);
    expect(stopAndMeasureFlags.reminderCreated).toBe(false);
    expect(stopAndMeasureFlags.calendarItemCreated).toBe(false);
    expect(stopAndMeasureFlags.automationTriggered).toBe(false);
    expect(stopAndMeasureFlags.outreachCreated).toBe(false);
    expect(stopAndMeasureFlags.crmMutationExpanded).toBe(false);
    expect(stopAndMeasureFlags.revenueActionExecuted).toBe(false);
    expect(stopAndMeasureFlags.analyticsPersisted).toBe(false);
    expect(stopAndMeasureFlags.trackingEnabled).toBe(false);
    expect(stopAndMeasureFlags.pollingEnabled).toBe(false);
  });
});
