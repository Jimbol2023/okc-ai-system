export const r77DriftRiskCategories = [
  "score-to-lead-creation drift",
  "score-to-owner-contact drift",
  "score-to-skip-tracing drift",
  "score-to-campaign drift",
  "score-to-provider drift",
  "high-score-to-outreach drift",
  "confidence-to-execution drift",
  "buyer-demand-to-campaign drift",
  "distress-weight-to-owner-contact drift",
  "missing-data-to-scraping drift",
  "external-data/API drift",
  "provider drift",
  "fetch/network drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
] as const;

export const r77DriftFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  leadCreationAllowed: false,
  ownerContactAllowed: false,
  skipTracingAllowed: false,
  scrapingAllowed: false,
  externalApiAllowed: false,
  outreachAllowed: false,
  providerCalled: false,
  providerActivationAllowed: false,
  fetchNetworkAllowed: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  campaignAllowed: false,
  auditWritingAllowed: false,
  executionAllowed: false,
} as const;

export type R77DriftStatus = "acquisition_scoring_drift_blocked" | "operator_review_required" | "acquisition_scoring_drift_audit_clear";

export type R77DriftInput = {
  scoreLeadCreationReviewed?: boolean;
  scoreOwnerContactReviewed?: boolean;
  scoreSkipTracingReviewed?: boolean;
  scoreCampaignReviewed?: boolean;
  scoreProviderReviewed?: boolean;
  highScoreOutreachReviewed?: boolean;
  confidenceExecutionReviewed?: boolean;
  buyerDemandCampaignReviewed?: boolean;
  distressOwnerContactReviewed?: boolean;
  missingDataScrapingReviewed?: boolean;
  externalDataReviewed?: boolean;
  providerBoundaryReviewed?: boolean;
  persistenceBoundaryReviewed?: boolean;
  auditBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  scoreLeadCreationRequested?: boolean;
  scoreOwnerContactRequested?: boolean;
  scoreSkipTracingRequested?: boolean;
  scoreCampaignRequested?: boolean;
  scoreProviderRequested?: boolean;
  highScoreOutreachRequested?: boolean;
  confidenceExecutionRequested?: boolean;
  buyerDemandCampaignRequested?: boolean;
  distressOwnerContactRequested?: boolean;
  missingDataScrapingRequested?: boolean;
  externalDataApiRequested?: boolean;
  providerRequested?: boolean;
  fetchNetworkRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  dangerousWordingRequested?: boolean;
};

export type R77DriftResult = {
  phase: "R77B";
  status: R77DriftStatus;
  flags: typeof r77DriftFlags;
  riskCategories: typeof r77DriftRiskCategories;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R77C - Acquisition Opportunity Scoring Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R77DriftInput, string]> = [
  ["scoreLeadCreationReviewed", "score-to-lead-creation"],
  ["scoreOwnerContactReviewed", "score-to-owner-contact"],
  ["scoreSkipTracingReviewed", "score-to-skip-tracing"],
  ["scoreCampaignReviewed", "score-to-campaign"],
  ["scoreProviderReviewed", "score-to-provider"],
  ["highScoreOutreachReviewed", "high-score-to-outreach"],
  ["confidenceExecutionReviewed", "confidence-to-execution"],
  ["buyerDemandCampaignReviewed", "buyer-demand-to-campaign"],
  ["distressOwnerContactReviewed", "distress-weight-to-owner-contact"],
  ["missingDataScrapingReviewed", "missing-data-to-scraping"],
  ["externalDataReviewed", "external-data/API boundary"],
  ["providerBoundaryReviewed", "provider boundary"],
  ["persistenceBoundaryReviewed", "persistence boundary"],
  ["auditBoundaryReviewed", "audit boundary"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R77DriftInput, string]> = [
  ["scoreLeadCreationRequested", "scores cannot create leads"],
  ["scoreOwnerContactRequested", "scores cannot contact owners"],
  ["scoreSkipTracingRequested", "scores cannot trigger skip tracing"],
  ["scoreCampaignRequested", "scores cannot start campaigns"],
  ["scoreProviderRequested", "scores cannot activate providers"],
  ["highScoreOutreachRequested", "high scores cannot trigger outreach"],
  ["confidenceExecutionRequested", "confidence cannot grant execution"],
  ["buyerDemandCampaignRequested", "buyer demand cannot start campaigns"],
  ["distressOwnerContactRequested", "distress weight cannot contact owners"],
  ["missingDataScrapingRequested", "missing data cannot trigger scraping"],
  ["externalDataApiRequested", "external data/API calls remain blocked"],
  ["providerRequested", "provider activation remains blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["dangerousWordingRequested", "dangerous wording remains forbidden"],
];

export function assertR77DriftInvariants(result: R77DriftResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R77B must remain read-only advisory simulation");
  if (
    flags.leadCreationAllowed ||
    flags.ownerContactAllowed ||
    flags.skipTracingAllowed ||
    flags.scrapingAllowed ||
    flags.externalApiAllowed ||
    flags.outreachAllowed ||
    flags.providerCalled ||
    flags.providerActivationAllowed ||
    flags.fetchNetworkAllowed ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.campaignAllowed ||
    flags.auditWritingAllowed ||
    flags.executionAllowed
  ) {
    throw new Error("R77B cannot authorize scoring-to-action, sourcing, providers, persistence, audit writing, campaigns, or execution");
  }
}

export function createR77AcquisitionScoringDriftExecutionRiskAudit(input: R77DriftInput = {}): R77DriftResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R77DriftStatus =
    activeBlockedReasons.length > 0 ? "acquisition_scoring_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "acquisition_scoring_drift_audit_clear";
  const result: R77DriftResult = {
    phase: "R77B",
    status,
    flags: r77DriftFlags,
    riskCategories: r77DriftRiskCategories,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R77C - Acquisition Opportunity Scoring Read-Only UI Scope Contract",
  };
  assertR77DriftInvariants(result);
  return result;
}

export function summarizeR77AcquisitionScoringDriftAudit(result: R77DriftResult): string {
  assertR77DriftInvariants(result);
  return `R77B ${result.status}: acquisition scoring drift audit blocks scores, high scores, confidence, buyer demand, distress weight, missing data, and AI recommendations from becoming lead creation, owner contact, skip tracing, campaigns, providers, scraping, fetch/network, persistence, audit writing, or execution.`;
}
