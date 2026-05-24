import { z9ManualRevenueRiskFlags } from "./z9-manual-revenue-risk-policy";

export const z10ManualRevenueDecisionFlags = {
  ...z9ManualRevenueRiskFlags,
  decisionPersisted: false,
  decisionRouteCreated: false,
  decisionApprovalRequested: false,
  decisionExecuted: false,
  operatorAssignmentCreated: false,
  decisionNotificationCreated: false,
  leadStatusChanged: false,
  decisionAuditWritten: false,
} as const;

export const z10RevenueDecisionLanes = [
  "stop_do_not_work",
  "cleanup_before_decision",
  "review_risk_first",
  "review_revenue_now",
  "review_revenue_today",
  "monitor_only",
  "defer_low_value",
  "terminal_no_decision",
  "consolidate_instead_of_expand",
] as const;

export type Z10RevenueDecisionLane = (typeof z10RevenueDecisionLanes)[number];

export type Z10RevenueDecisionLaneMetadata = {
  label: string;
  manualMeaning: string;
  revenuePurpose: string;
  requiresHumanReview: true;
  blockedExecutionBoundary: string;
};

const blockedBoundary = "Advisory only: no decision persistence, decision route, approval request, decision execution, operator assignment, notification, lead status change, audit write, task, queue, routing, calendar item, reminder, CRM mutation, provider call, outreach, storage write, recovery execution, or revenue action execution is authorized.";

export const z10RevenueDecisionLaneMetadata: Record<Z10RevenueDecisionLane, Z10RevenueDecisionLaneMetadata> = {
  stop_do_not_work: {
    label: "Stop do not work",
    manualMeaning: "Governance, DNC, blocked, or contact-risk signals stop manual work consideration.",
    revenuePurpose: "Keeps unsafe records out of operator decision flow.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  cleanup_before_decision: {
    label: "Cleanup before decision",
    manualMeaning: "Missing or low-confidence data must be reviewed before a useful revenue decision.",
    revenuePurpose: "Prevents misleading lead decisions from weak inputs.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  review_risk_first: {
    label: "Review risk first",
    manualMeaning: "Risk posture should be understood before revenue work is considered.",
    revenuePurpose: "Protects operator attention from fragile or unsafe opportunities.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  review_revenue_now: {
    label: "Review revenue now",
    manualMeaning: "A human should review this high-value or high-urgency revenue decision first.",
    revenuePurpose: "Keeps the strongest manual revenue opportunities visible.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  review_revenue_today: {
    label: "Review revenue today",
    manualMeaning: "A human may include this in today's manual revenue review.",
    revenuePurpose: "Supports practical daily lead review without assigning work.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  monitor_only: {
    label: "Monitor only",
    manualMeaning: "Decision signal is visible but does not deserve active work.",
    revenuePurpose: "Avoids cluttering operator focus with weak signals.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  defer_low_value: {
    label: "Defer low value",
    manualMeaning: "Low-value or low-clarity records should sit behind stronger manual opportunities.",
    revenuePurpose: "Protects operator time.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  terminal_no_decision: {
    label: "Terminal no decision",
    manualMeaning: "Terminal records should not enter active decision support.",
    revenuePurpose: "Prevents closed or dead records from creating review noise.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  consolidate_instead_of_expand: {
    label: "Consolidate instead of expand",
    manualMeaning: "Signals are too redundant or cognitively heavy to justify another advisory layer.",
    revenuePurpose: "Shifts attention toward real lead operations and usability.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
};

export function createZ10ManualRevenueDecisionPolicyReview() {
  return {
    phase: "Z10A" as const,
    flags: z10ManualRevenueDecisionFlags,
    advisoryOnly: true,
    deterministic: true,
    manualOperationsRemainPrimary: true,
    lanes: z10RevenueDecisionLanes,
    laneMetadata: z10RevenueDecisionLaneMetadata,
    consolidationCheckpoint: {
      continueAdvisoryLayerExpansion: false,
      recommendedPivot: "Real Manual Lead Operations Usability Pass",
      rationale: "Z2-Z10 now provide enough advisory contracts; the highest ROI is making real lead review easier for humans.",
    },
  };
}
