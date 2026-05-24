import { z8ManualRevenueRecoveryFlags } from "./z8-manual-revenue-recovery-policy";

export const z9ManualRevenueRiskFlags = {
  ...z8ManualRevenueRecoveryFlags,
  riskEscalationCreated: false,
  riskDecisionPersisted: false,
  riskScorePersisted: false,
  riskRouteCreated: false,
  riskApprovalRequested: false,
  riskRecommendationExecuted: false,
  operatorAlertCreated: false,
  riskReviewArchived: false,
} as const;

export const z9RevenueRiskReviewLanes = [
  "governance_stop",
  "contact_risk_stop",
  "data_confidence_risk",
  "recovery_complexity_risk",
  "near_close_risk",
  "buyer_disposition_risk",
  "conversion_quality_risk",
  "follow_up_leakage_risk",
  "monitor_risk",
  "terminal_no_risk_review",
] as const;

export type Z9RevenueRiskReviewLane = (typeof z9RevenueRiskReviewLanes)[number];

export type Z9RevenueRiskReviewLaneMetadata = {
  label: string;
  manualMeaning: string;
  revenuePurpose: string;
  requiresHumanReview: true;
  blockedExecutionBoundary: string;
};

const blockedBoundary = "Advisory only: no risk escalation, risk decision persistence, risk score persistence, risk route, risk approval request, operator alert, archive, task, queue, routing, assignment, calendar item, reminder, CRM mutation, provider call, outreach, audit write, storage write, recovery execution, or revenue action execution is authorized.";

export const z9RevenueRiskReviewLaneMetadata: Record<Z9RevenueRiskReviewLane, Z9RevenueRiskReviewLaneMetadata> = {
  governance_stop: {
    label: "Governance stop",
    manualMeaning: "Governance constraints outrank every revenue risk signal.",
    revenuePurpose: "Prevents unsafe opportunities from entering risk review decisions.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  contact_risk_stop: {
    label: "Contact risk stop",
    manualMeaning: "DNC, blocked, or contact-risk signals stop revenue risk review from becoming work.",
    revenuePurpose: "Protects the operation from prohibited contact paths.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  data_confidence_risk: {
    label: "Data confidence risk",
    manualMeaning: "Missing, low-confidence, or misleading data needs human review.",
    revenuePurpose: "Prevents fragile revenue decisions based on weak inputs.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  recovery_complexity_risk: {
    label: "Recovery complexity risk",
    manualMeaning: "Recovery appears too complex or redundant for simple operator use.",
    revenuePurpose: "Reduces operational complexity and architecture inflation.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  near_close_risk: {
    label: "Near-close risk",
    manualMeaning: "Near-close revenue has risk that should be checked before manual action.",
    revenuePurpose: "Protects high-value revenue closest to realization.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  buyer_disposition_risk: {
    label: "Buyer disposition risk",
    manualMeaning: "Buyer or disposition path has risk that should be reviewed without outreach.",
    revenuePurpose: "Keeps exit-side revenue risk visible.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  conversion_quality_risk: {
    label: "Conversion quality risk",
    manualMeaning: "Offer, negotiation, or contract quality is not clear enough for confident conversion work.",
    revenuePurpose: "Prevents rushed conversion decisions from weak signals.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  follow_up_leakage_risk: {
    label: "Follow-up leakage risk",
    manualMeaning: "Follow-up pressure may be leaking revenue or confusing operator next steps.",
    revenuePurpose: "Reduces revenue loss from stale or unclear follow-up.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  monitor_risk: {
    label: "Monitor risk",
    manualMeaning: "Risk signal is not strong or distinct enough to justify a new work lane.",
    revenuePurpose: "Avoids diminishing returns and keeps the system usable.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  terminal_no_risk_review: {
    label: "Terminal no risk review",
    manualMeaning: "Terminal records should not enter active revenue risk review.",
    revenuePurpose: "Prevents closed or dead records from creating review noise.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
};

export function createZ9ManualRevenueRiskPolicyReview() {
  return {
    phase: "Z9A" as const,
    flags: z9ManualRevenueRiskFlags,
    advisoryOnly: true,
    deterministic: true,
    manualOperationsRemainPrimary: true,
    lanes: z9RevenueRiskReviewLanes,
    laneMetadata: z9RevenueRiskReviewLaneMetadata,
    scopeDiscipline: {
      usefulOnlyIf: "Z9 reduces operator confusion or prevents risky manual work.",
      consolidateInsteadWhen: "Signals merely rename Z7/Z8 without adding a concrete risk decision.",
    },
  };
}
