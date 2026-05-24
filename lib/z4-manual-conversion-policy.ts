import { z3FollowUpVelocityFlags } from "./z3-follow-up-velocity-policy";

export const z4ManualConversionFlags = {
  ...z3FollowUpVelocityFlags,
  offerSent: false,
  contractGenerated: false,
  contractSent: false,
  signatureRequested: false,
  buyerContacted: false,
  sellerContacted: false,
  statusChanged: false,
  dealMovedStage: false,
  conversionActionExecuted: false,
} as const;

export const z4ManualConversionStages = [
  "lead_context_review",
  "follow_up_review",
  "offer_review",
  "negotiation_review",
  "contract_review",
  "buyer_disposition_review",
  "closing_coordination_review",
  "terminal_or_suppressed",
] as const;

export type Z4ManualConversionStage = (typeof z4ManualConversionStages)[number];

export type Z4ManualConversionStageMetadata = {
  label: string;
  manualMeaning: string;
  revenuePurpose: string;
  requiresHumanReview: true;
  blockedExecutionBoundary: string;
};

const blockedBoundary = "Advisory only: no offer, contract, signature, buyer contact, seller contact, status change, stage movement, provider call, storage write, audit write, queue, runtime job, or conversion execution is authorized.";

export const z4ManualConversionStageMetadata: Record<Z4ManualConversionStage, Z4ManualConversionStageMetadata> = {
  lead_context_review: {
    label: "Lead context review",
    manualMeaning: "A human should review seller, source, property, and conversion context before choosing a revenue path.",
    revenuePurpose: "Prevents low-context leads from entering offer or negotiation work too early.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  follow_up_review: {
    label: "Follow-up review",
    manualMeaning: "A human should resolve follow-up timing or seller response before conversion review.",
    revenuePurpose: "Keeps conversion work tied to actual seller engagement.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  offer_review: {
    label: "Offer review",
    manualMeaning: "A human should review valuation and offer assumptions before any offer is considered.",
    revenuePurpose: "Moves qualified leads toward disciplined offer preparation without sending offers.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  negotiation_review: {
    label: "Negotiation review",
    manualMeaning: "A human should review seller response, price gap, objections, and deal limits.",
    revenuePurpose: "Keeps active seller conversations aligned with conservative deal constraints.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  contract_review: {
    label: "Contract review",
    manualMeaning: "A human should review whether a deal is ready for professional contract preparation review.",
    revenuePurpose: "Prevents premature contract movement before facts, terms, and approvals are ready.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  buyer_disposition_review: {
    label: "Buyer disposition review",
    manualMeaning: "A human should review buyer/disposition readiness for an under-contract opportunity.",
    revenuePurpose: "Supports exit planning without contacting buyers or creating assignment documents.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  closing_coordination_review: {
    label: "Closing coordination review",
    manualMeaning: "A human should review title, buyer, seller, funding, and closing coordination needs.",
    revenuePurpose: "Protects near-closing revenue from operational drift.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
  terminal_or_suppressed: {
    label: "Terminal or suppressed",
    manualMeaning: "No conversion movement should occur for terminal, DNC, blocked, rejected, or suppressed records.",
    revenuePurpose: "Prevents unsafe or wasteful conversion effort.",
    requiresHumanReview: true,
    blockedExecutionBoundary: blockedBoundary,
  },
};

export function createZ4ManualConversionPolicyReview() {
  return {
    phase: "Z4A" as const,
    flags: z4ManualConversionFlags,
    advisoryOnly: true,
    deterministic: true,
    manualOperationsRemainPrimary: true,
    stages: z4ManualConversionStages,
    stageMetadata: z4ManualConversionStageMetadata,
  };
}
