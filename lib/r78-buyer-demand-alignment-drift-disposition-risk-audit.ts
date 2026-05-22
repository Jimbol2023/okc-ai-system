export const r78DriftRiskCategories = [
  "alignment-to-buyer-contact drift",
  "alignment-to-seller-contact drift",
  "alignment-to-match-creation drift",
  "alignment-to-deal-blast drift",
  "buyer-demand-to-campaign drift",
  "high-alignment-to-outreach drift",
  "demand-fit-to-provider drift",
  "buyer-ready-to-send drift",
  "assignment-readiness-to-execution drift",
  "disposition-priority-to-campaign drift",
  "missing-demand-data-to-scraping drift",
  "external-data/API drift",
  "provider drift",
  "fetch/network drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
] as const;

export const r78DriftFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  buyerContactAllowed: false,
  sellerContactAllowed: false,
  matchCreationAllowed: false,
  dealBlastAllowed: false,
  campaignAllowed: false,
  outreachAllowed: false,
  providerActivationAllowed: false,
  sendAllowed: false,
  executionAllowed: false,
  scrapingAllowed: false,
  externalApiAllowed: false,
  fetchNetworkAllowed: false,
  persistenceAllowedNow: false,
  auditWritingAllowed: false,
} as const;

export type R78DriftStatus = "buyer_demand_alignment_drift_blocked" | "operator_review_required" | "buyer_demand_alignment_drift_audit_clear";

export type R78DriftInput = {
  alignmentBuyerContactReviewed?: boolean;
  alignmentSellerContactReviewed?: boolean;
  matchCreationReviewed?: boolean;
  dealBlastReviewed?: boolean;
  campaignReviewed?: boolean;
  outreachReviewed?: boolean;
  providerReviewed?: boolean;
  buyerReadySendReviewed?: boolean;
  assignmentExecutionReviewed?: boolean;
  missingDemandScrapingReviewed?: boolean;
  externalDataReviewed?: boolean;
  persistenceReviewed?: boolean;
  auditBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  buyerContactRequested?: boolean;
  sellerContactRequested?: boolean;
  matchCreationRequested?: boolean;
  dealBlastRequested?: boolean;
  campaignRequested?: boolean;
  outreachRequested?: boolean;
  providerRequested?: boolean;
  sendRequested?: boolean;
  executionRequested?: boolean;
  scrapingRequested?: boolean;
  externalApiRequested?: boolean;
  fetchNetworkRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  dangerousWordingRequested?: boolean;
};

export type R78DriftResult = {
  phase: "R78B";
  status: R78DriftStatus;
  flags: typeof r78DriftFlags;
  riskCategories: typeof r78DriftRiskCategories;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R78C - Buyer Demand Alignment Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R78DriftInput, string]> = [
  ["alignmentBuyerContactReviewed", "alignment-to-buyer-contact"],
  ["alignmentSellerContactReviewed", "alignment-to-seller-contact"],
  ["matchCreationReviewed", "alignment-to-match-creation"],
  ["dealBlastReviewed", "alignment-to-deal-blast"],
  ["campaignReviewed", "buyer-demand-to-campaign"],
  ["outreachReviewed", "high-alignment-to-outreach"],
  ["providerReviewed", "demand-fit-to-provider"],
  ["buyerReadySendReviewed", "buyer-ready-to-send"],
  ["assignmentExecutionReviewed", "assignment-readiness-to-execution"],
  ["missingDemandScrapingReviewed", "missing-demand-data-to-scraping"],
  ["externalDataReviewed", "external-data/API boundary"],
  ["persistenceReviewed", "persistence boundary"],
  ["auditBoundaryReviewed", "audit boundary"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R78DriftInput, string]> = [
  ["buyerContactRequested", "alignment cannot contact buyers"],
  ["sellerContactRequested", "alignment cannot contact sellers"],
  ["matchCreationRequested", "alignment cannot create matches"],
  ["dealBlastRequested", "alignment cannot blast deals"],
  ["campaignRequested", "buyer demand cannot start campaigns"],
  ["outreachRequested", "high alignment cannot trigger outreach"],
  ["providerRequested", "demand fit cannot activate providers"],
  ["sendRequested", "buyer-ready status cannot send"],
  ["executionRequested", "assignment readiness cannot execute"],
  ["scrapingRequested", "missing demand data cannot trigger scraping"],
  ["externalApiRequested", "external data/API calls remain blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["dangerousWordingRequested", "dangerous wording remains forbidden"],
];

export function assertR78DriftInvariants(result: R78DriftResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R78B must remain read-only advisory simulation");
  if (
    flags.buyerContactAllowed ||
    flags.sellerContactAllowed ||
    flags.matchCreationAllowed ||
    flags.dealBlastAllowed ||
    flags.campaignAllowed ||
    flags.outreachAllowed ||
    flags.providerActivationAllowed ||
    flags.sendAllowed ||
    flags.executionAllowed ||
    flags.scrapingAllowed ||
    flags.externalApiAllowed ||
    flags.fetchNetworkAllowed ||
    flags.persistenceAllowedNow ||
    flags.auditWritingAllowed
  ) {
    throw new Error("R78B cannot authorize contact, matching, blasts, campaigns, sourcing, providers, persistence, audit writing, or execution");
  }
}

export function createR78BuyerDemandAlignmentDriftDispositionRiskAudit(input: R78DriftInput = {}): R78DriftResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R78DriftStatus =
    activeBlockedReasons.length > 0 ? "buyer_demand_alignment_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "buyer_demand_alignment_drift_audit_clear";
  const result: R78DriftResult = {
    phase: "R78B",
    status,
    flags: r78DriftFlags,
    riskCategories: r78DriftRiskCategories,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R78C - Buyer Demand Alignment Read-Only UI Scope Contract",
  };
  assertR78DriftInvariants(result);
  return result;
}

export function summarizeR78BuyerDemandAlignmentDriftAudit(result: R78DriftResult): string {
  assertR78DriftInvariants(result);
  return `R78B ${result.status}: buyer-demand alignment drift audit blocks alignment, demand fit, buyer-ready status, assignment readiness, and missing demand data from becoming buyer contact, seller contact, match creation, deal blasts, campaigns, providers, scraping, fetch/network, persistence, audit writing, or execution.`;
}
