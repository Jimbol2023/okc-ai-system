import { z7ManualRevenueBottleneckFlags } from "./z7-manual-revenue-bottleneck-policy";

export const z8ManualRevenueRecoveryFlags = {
  ...z7ManualRevenueBottleneckFlags,
  recoveryPlanCreated: false,
  recoveryStepAssigned: false,
  recoverySequencePersisted: false,
  dependencyUpdated: false,
  handoffCreated: false,
  sellerRecoveryContacted: false,
  buyerRecoveryContacted: false,
  closingRecoveryContacted: false,
  recoveryCoordinationExecuted: false,
} as const;

export const z8RecoveryCoordinationLanes = [
  "governance_stop",
  "blocked_recovery",
  "data_recovery_needed",
  "follow_up_recovery",
  "conversion_recovery",
  "buyer_disposition_recovery",
  "closing_recovery",
  "multi_bottleneck_recovery",
  "monitor_recovery",
  "no_recovery_terminal",
] as const;

export type Z8RecoveryCoordinationLane = (typeof z8RecoveryCoordinationLanes)[number];

export type Z8RecoveryCoordinationLaneMetadata = {
  label: string;
  manualMeaning: string;
  revenuePurpose: string;
  requiresHumanReview: true;
  blockedExecutionBoundary: string;
};

const blockedBoundary = "Advisory only: no recovery plan, recovery step assignment, recovery sequence persistence, dependency update, handoff, seller contact, buyer contact, closing contact, task, queue, routing, assignment, calendar item, reminder, CRM mutation, provider call, outreach, audit write, storage write, or recovery coordination execution is authorized.";

export const z8RecoveryCoordinationLaneMetadata: Record<Z8RecoveryCoordinationLane, Z8RecoveryCoordinationLaneMetadata> = {
  governance_stop: {
    label: "Governance stop",
    manualMeaning: "Human must resolve governance constraints before recovery coordination is considered.",
    revenuePurpose: "Prevents unsafe recovery paths from entering manual review.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  blocked_recovery: {
    label: "Blocked recovery",
    manualMeaning: "DNC, blocked, or contact-safety signals suppress recovery coordination.",
    revenuePurpose: "Keeps recovery work from creating prohibited contact risk.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  data_recovery_needed: {
    label: "Data recovery needed",
    manualMeaning: "Missing dependencies or data must be reviewed before recovery coordination.",
    revenuePurpose: "Improves recovery confidence before operator time is spent.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  follow_up_recovery: {
    label: "Follow-up recovery",
    manualMeaning: "Manual follow-up recovery should be reviewed for stale or overdue leads.",
    revenuePurpose: "Reduces revenue leakage from follow-up breakdowns.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  conversion_recovery: {
    label: "Conversion recovery",
    manualMeaning: "Manual offer, negotiation, or contract recovery should be reviewed.",
    revenuePurpose: "Protects revenue opportunities stuck near conversion.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  buyer_disposition_recovery: {
    label: "Buyer disposition recovery",
    manualMeaning: "Manual buyer/disposition recovery should be reviewed without buyer outreach.",
    revenuePurpose: "Keeps exit-side recovery pressure visible.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  closing_recovery: {
    label: "Closing recovery",
    manualMeaning: "Manual closing recovery should be reviewed for near-close pressure.",
    revenuePurpose: "Protects revenue closest to realization.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  multi_bottleneck_recovery: {
    label: "Multi-bottleneck recovery",
    manualMeaning: "Several recovery dependencies are present and need coordinated human review.",
    revenuePurpose: "Clarifies complex stuck revenue paths without executing recovery steps.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  monitor_recovery: {
    label: "Monitor recovery",
    manualMeaning: "No urgent recovery coordination path is detected from advisory input.",
    revenuePurpose: "Maintains recovery visibility without unnecessary work.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  no_recovery_terminal: {
    label: "No recovery terminal",
    manualMeaning: "Terminal records should not enter active recovery coordination.",
    revenuePurpose: "Prevents closed or dead records from consuming recovery attention.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
};

export function createZ8ManualRevenueRecoveryPolicyReview() {
  return {
    phase: "Z8A" as const,
    flags: z8ManualRevenueRecoveryFlags,
    advisoryOnly: true,
    deterministic: true,
    manualOperationsRemainPrimary: true,
    lanes: z8RecoveryCoordinationLanes,
    laneMetadata: z8RecoveryCoordinationLaneMetadata,
  };
}
