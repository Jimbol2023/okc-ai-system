import {
  createReviewPilotResultsSummary,
  reviewPilotResultsBeforeExpandingScope,
  reviewPilotResultsFlags,
} from "./review-pilot-results";
import type { StopAndMeasureResult } from "./stop-and-measure";
import { stopAndMeasureFlags } from "./stop-and-measure";

function makeMeasurement(overrides: Partial<StopAndMeasureResult> = {}): StopAndMeasureResult {
  return {
    phase: "Stop And Measure",
    measurementStatus: "measure_operator_friction",
    operatorThroughputSignals: {
      totalLeads: 1,
      visibleManualQueueRows: 1,
      reviewNowCount: 0,
      sellerCallOutcomesRecorded: 0,
      buyerReadyNearCloseCount: 0,
    },
    frictionSignals: {
      blockedDncCount: 0,
      cleanupCount: 0,
      overdueFollowUpCount: 0,
      dueFollowUpCount: 0,
    },
    safetySignals: [],
    measurementQuestions: [],
    decisionPrompt: "Review pilot counts.",
    recommendedNextExactStep: "Review Pilot Results Before Expanding Scope",
    advisoryOnly: true,
    readOnly: true,
    flags: stopAndMeasureFlags,
    ...overrides,
  };
}

describe("review pilot results before expanding scope", () => {
  it("pauses for more data when pilot usage is empty", () => {
    const result = reviewPilotResultsBeforeExpandingScope(
      makeMeasurement({
        measurementStatus: "not_enough_pilot_data",
        operatorThroughputSignals: {
          totalLeads: 0,
          visibleManualQueueRows: 0,
          reviewNowCount: 0,
          sellerCallOutcomesRecorded: 0,
          buyerReadyNearCloseCount: 0,
        },
      }),
    );

    expect(result.pilotReviewDecision).toBe("pause_for_more_data");
    expect(result.recommendedNextExactStep).toBe("Collect More Real Pilot Usage");
    expect(result.recommendedFocusArea).toMatch(/real lead usage/i);
  });

  it("prioritizes safety cleanup when blocked or cleanup-heavy signals exist", () => {
    const result = reviewPilotResultsBeforeExpandingScope(
      makeMeasurement({
        frictionSignals: {
          blockedDncCount: 1,
          cleanupCount: 3,
          overdueFollowUpCount: 0,
          dueFollowUpCount: 0,
        },
      }),
    );

    expect(result.pilotReviewDecision).toBe("fix_safety_cleanup");
    expect(result.recommendedNextExactStep).toBe("Improve The Single Highest-Friction Operator Surface");
    expect(result.evidenceSummary.join(" ")).toContain("4 friction signals");
  });

  it("prioritizes operator friction when follow-up pressure exists", () => {
    const result = reviewPilotResultsBeforeExpandingScope(
      makeMeasurement({
        frictionSignals: {
          blockedDncCount: 0,
          cleanupCount: 0,
          overdueFollowUpCount: 2,
          dueFollowUpCount: 1,
        },
      }),
    );

    expect(result.pilotReviewDecision).toBe("fix_operator_friction");
    expect(result.recommendedFocusArea).toMatch(/stale follow-up|manual review delay/i);
  });

  it("prioritizes revenue throughput visibility when review-now seller-call buyer-ready or near-close signals exist", () => {
    const result = reviewPilotResultsBeforeExpandingScope(
      makeMeasurement({
        operatorThroughputSignals: {
          totalLeads: 4,
          visibleManualQueueRows: 2,
          reviewNowCount: 1,
          sellerCallOutcomesRecorded: 2,
          buyerReadyNearCloseCount: 1,
        },
      }),
    );

    expect(result.pilotReviewDecision).toBe("improve_revenue_throughput_visibility");
    expect(result.evidenceSummary.join(" ")).toContain("4 throughput signals");
  });

  it("holds scope when low-friction results do not justify expansion", () => {
    const result = reviewPilotResultsBeforeExpandingScope(makeMeasurement());

    expect(result.pilotReviewDecision).toBe("do_not_expand_scope");
    expect(result.recommendedNextExactStep).toBe("Hold Scope And Operate Manually");
    expect(result.finalRecommendation).toMatch(/do not justify expansion/i);
  });

  it("avoids new advisory layers and keeps execution persistence tracking and CRM mutation flags blocked", () => {
    const result = reviewPilotResultsBeforeExpandingScope(makeMeasurement());

    expect(result.scopeExpansionWarning).toContain("Do not add another advisory layer");
    expect(createReviewPilotResultsSummary().recommendedNextExactStep).toBe("Collect More Real Pilot Usage");
    expect(reviewPilotResultsFlags.providerCalled).toBe(false);
    expect(reviewPilotResultsFlags.sent).toBe(false);
    expect(reviewPilotResultsFlags.runtimeActivationAllowed).toBe(false);
    expect(reviewPilotResultsFlags.storageAuthorized).toBe(false);
    expect(reviewPilotResultsFlags.auditWritingAllowed).toBe(false);
    expect(reviewPilotResultsFlags.queueCreated).toBe(false);
    expect(reviewPilotResultsFlags.routingCreated).toBe(false);
    expect(reviewPilotResultsFlags.assignmentCreated).toBe(false);
    expect(reviewPilotResultsFlags.reminderCreated).toBe(false);
    expect(reviewPilotResultsFlags.calendarItemCreated).toBe(false);
    expect(reviewPilotResultsFlags.automationTriggered).toBe(false);
    expect(reviewPilotResultsFlags.outreachCreated).toBe(false);
    expect(reviewPilotResultsFlags.crmMutationExpanded).toBe(false);
    expect(reviewPilotResultsFlags.revenueActionExecuted).toBe(false);
    expect(reviewPilotResultsFlags.analyticsPersisted).toBe(false);
    expect(reviewPilotResultsFlags.trackingEnabled).toBe(false);
    expect(reviewPilotResultsFlags.pollingEnabled).toBe(false);
    expect(reviewPilotResultsFlags.pilotReviewPersisted).toBe(false);
    expect(reviewPilotResultsFlags.pilotScopeExpanded).toBe(false);
    expect(reviewPilotResultsFlags.pilotWorkflowCreated).toBe(false);
    expect(reviewPilotResultsFlags.pilotDecisionExecuted).toBe(false);
  });
});
