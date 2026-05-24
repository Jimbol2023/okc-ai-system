import type { StopAndMeasureResult } from "./stop-and-measure";
import { stopAndMeasureFlags } from "./stop-and-measure";

export const reviewPilotResultsFlags = {
  ...stopAndMeasureFlags,
  pilotReviewPersisted: false,
  pilotReviewAnalyticsPersisted: false,
  pilotReviewTrackingEnabled: false,
  pilotScopeExpanded: false,
  pilotWorkflowCreated: false,
  pilotDecisionExecuted: false,
} as const;

export type PilotReviewDecision =
  | "pause_for_more_data"
  | "fix_operator_friction"
  | "fix_safety_cleanup"
  | "improve_revenue_throughput_visibility"
  | "do_not_expand_scope";

export type PilotReviewNextStep =
  | "Collect More Real Pilot Usage"
  | "Improve The Single Highest-Friction Operator Surface"
  | "Hold Scope And Operate Manually";

export type PilotResultsReview = {
  phase: "Review Pilot Results Before Expanding Scope";
  pilotReviewDecision: PilotReviewDecision;
  evidenceSummary: string[];
  recommendedFocusArea: string;
  scopeExpansionWarning: string;
  finalRecommendation: string;
  recommendedNextExactStep: PilotReviewNextStep;
  advisoryOnly: true;
  readOnly: true;
  flags: typeof reviewPilotResultsFlags;
};

function getFrictionTotal(measurement: StopAndMeasureResult) {
  return (
    measurement.frictionSignals.blockedDncCount +
    measurement.frictionSignals.cleanupCount +
    measurement.frictionSignals.overdueFollowUpCount +
    measurement.frictionSignals.dueFollowUpCount
  );
}

function getThroughputTotal(measurement: StopAndMeasureResult) {
  return (
    measurement.operatorThroughputSignals.reviewNowCount +
    measurement.operatorThroughputSignals.sellerCallOutcomesRecorded +
    measurement.operatorThroughputSignals.buyerReadyNearCloseCount
  );
}

function getDecision(measurement: StopAndMeasureResult): PilotReviewDecision {
  if (measurement.operatorThroughputSignals.totalLeads === 0 || measurement.measurementStatus === "not_enough_pilot_data") {
    return "pause_for_more_data";
  }

  if (measurement.frictionSignals.blockedDncCount > 0 || measurement.frictionSignals.cleanupCount > 0) {
    return "fix_safety_cleanup";
  }

  if (measurement.frictionSignals.overdueFollowUpCount > 0 || measurement.frictionSignals.dueFollowUpCount > 0) {
    return "fix_operator_friction";
  }

  if (getThroughputTotal(measurement) > 0) {
    return "improve_revenue_throughput_visibility";
  }

  return "do_not_expand_scope";
}

function getNextStep(decision: PilotReviewDecision): PilotReviewNextStep {
  if (decision === "pause_for_more_data") return "Collect More Real Pilot Usage";
  if (decision === "do_not_expand_scope") return "Hold Scope And Operate Manually";
  return "Improve The Single Highest-Friction Operator Surface";
}

function getFocusArea(decision: PilotReviewDecision) {
  if (decision === "pause_for_more_data") return "Collect enough real lead usage before changing workflow surfaces.";
  if (decision === "fix_safety_cleanup") return "Resolve blocked, DNC, and missing-data review friction before revenue workflow changes.";
  if (decision === "fix_operator_friction") return "Improve the single surface causing stale follow-up or manual review delay.";
  if (decision === "improve_revenue_throughput_visibility") return "Improve visibility around review-now, seller-call, buyer-ready, or near-close records only if operators miss them.";
  return "Hold scope. Current counts do not justify adding new workflow or advisory surfaces.";
}

export function reviewPilotResultsBeforeExpandingScope(measurement: StopAndMeasureResult): PilotResultsReview {
  const decision = getDecision(measurement);
  const frictionTotal = getFrictionTotal(measurement);
  const throughputTotal = getThroughputTotal(measurement);

  return {
    phase: "Review Pilot Results Before Expanding Scope",
    pilotReviewDecision: decision,
    evidenceSummary: [
      `${measurement.operatorThroughputSignals.totalLeads} total lead records are visible in the pilot review.`,
      `${frictionTotal} friction signals are visible across blocked, cleanup, overdue, and due follow-up counts.`,
      `${throughputTotal} throughput signals are visible across review-now, seller-call, buyer-ready, and near-close counts.`,
      `${measurement.operatorThroughputSignals.visibleManualQueueRows} read-only manual queue rows are visible.`,
    ],
    recommendedFocusArea: getFocusArea(decision),
    scopeExpansionWarning:
      "Do not add another advisory layer, tracking system, automation path, or workflow engine. Pick one observed usability bottleneck or keep operating manually.",
    finalRecommendation:
      decision === "do_not_expand_scope"
        ? "Current pilot signals do not justify expansion. Keep operating manually and revisit after real usage changes."
        : "Use the measurement evidence to select one operator-facing usability improvement, then measure again before expanding scope.",
    recommendedNextExactStep: getNextStep(decision),
    advisoryOnly: true,
    readOnly: true,
    flags: reviewPilotResultsFlags,
  };
}

export function createReviewPilotResultsSummary() {
  return {
    phase: "Review Pilot Results Before Expanding Scope" as const,
    pilotResultsReviewReady: true,
    recommendedNextExactStep: "Collect More Real Pilot Usage" as const,
    advisoryOnly: true,
    readOnly: true,
    flags: reviewPilotResultsFlags,
  };
}
