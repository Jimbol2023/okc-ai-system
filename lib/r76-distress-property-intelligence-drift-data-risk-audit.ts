export const r76DriftRiskCategories = [
  "distress-signal-to-lead-creation drift",
  "distress-score-to-owner-contact drift",
  "vacancy-signal-to-outreach drift",
  "tax-risk-to-scraping drift",
  "code-violation-to-public-record-crawling drift",
  "neighborhood-pattern-to-campaign drift",
  "AI-recommendation-to-skip-tracing drift",
  "external-data/API drift",
  "map automation drift",
  "provider drift",
  "fetch/network drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
] as const;

export const r76DriftFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  leadCreationAllowed: false,
  ownerContactAllowed: false,
  outreachAllowed: false,
  skipTracingAllowed: false,
  scrapingAllowed: false,
  publicRecordCrawlingAllowed: false,
  mapAutomationAllowed: false,
  streetViewAutomationAllowed: false,
  externalApiAllowed: false,
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

export type R76DriftStatus = "distress_drift_blocked" | "operator_review_required" | "distress_drift_audit_clear";

export type R76DriftInput = {
  signalLeadCreationReviewed?: boolean;
  scoreOwnerContactReviewed?: boolean;
  vacancyOutreachReviewed?: boolean;
  taxRiskScrapingReviewed?: boolean;
  codeViolationCrawlingReviewed?: boolean;
  neighborhoodCampaignReviewed?: boolean;
  aiSkipTracingReviewed?: boolean;
  externalDataReviewed?: boolean;
  mapAutomationReviewed?: boolean;
  providerBoundaryReviewed?: boolean;
  persistenceBoundaryReviewed?: boolean;
  auditBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  signalLeadCreationRequested?: boolean;
  scoreOwnerContactRequested?: boolean;
  vacancyOutreachRequested?: boolean;
  taxRiskScrapingRequested?: boolean;
  codeViolationCrawlingRequested?: boolean;
  neighborhoodCampaignRequested?: boolean;
  aiSkipTracingRequested?: boolean;
  externalDataApiRequested?: boolean;
  mapAutomationRequested?: boolean;
  providerRequested?: boolean;
  fetchNetworkRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  dangerousWordingRequested?: boolean;
};

export type R76DriftResult = {
  phase: "R76B";
  status: R76DriftStatus;
  flags: typeof r76DriftFlags;
  riskCategories: typeof r76DriftRiskCategories;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R76C - Distress Property Intelligence Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R76DriftInput, string]> = [
  ["signalLeadCreationReviewed", "distress-signal-to-lead-creation"],
  ["scoreOwnerContactReviewed", "distress-score-to-owner-contact"],
  ["vacancyOutreachReviewed", "vacancy-signal-to-outreach"],
  ["taxRiskScrapingReviewed", "tax-risk-to-scraping"],
  ["codeViolationCrawlingReviewed", "code-violation-to-public-record-crawling"],
  ["neighborhoodCampaignReviewed", "neighborhood-pattern-to-campaign"],
  ["aiSkipTracingReviewed", "AI-recommendation-to-skip-tracing"],
  ["externalDataReviewed", "external-data/API boundary"],
  ["mapAutomationReviewed", "map automation boundary"],
  ["providerBoundaryReviewed", "provider boundary"],
  ["persistenceBoundaryReviewed", "persistence boundary"],
  ["auditBoundaryReviewed", "audit boundary"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R76DriftInput, string]> = [
  ["signalLeadCreationRequested", "distress signals cannot create leads"],
  ["scoreOwnerContactRequested", "distress scores cannot contact owners"],
  ["vacancyOutreachRequested", "vacancy signals cannot trigger outreach"],
  ["taxRiskScrapingRequested", "tax-risk categories cannot trigger scraping"],
  ["codeViolationCrawlingRequested", "code-violation categories cannot trigger public-record crawling"],
  ["neighborhoodCampaignRequested", "neighborhood patterns cannot start campaigns"],
  ["aiSkipTracingRequested", "AI recommendations cannot skip trace"],
  ["externalDataApiRequested", "external data/API calls remain blocked"],
  ["mapAutomationRequested", "map automation remains blocked"],
  ["providerRequested", "provider activation remains blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["dangerousWordingRequested", "dangerous wording remains forbidden"],
];

export function assertR76DriftInvariants(result: R76DriftResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R76B must remain read-only advisory simulation");
  if (
    flags.leadCreationAllowed ||
    flags.ownerContactAllowed ||
    flags.outreachAllowed ||
    flags.skipTracingAllowed ||
    flags.scrapingAllowed ||
    flags.publicRecordCrawlingAllowed ||
    flags.mapAutomationAllowed ||
    flags.streetViewAutomationAllowed ||
    flags.externalApiAllowed ||
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
    throw new Error("R76B cannot authorize lead creation, contact, sourcing, providers, persistence, audit writing, campaigns, or execution");
  }
}

export function createR76DistressPropertyIntelligenceDriftDataRiskAudit(input: R76DriftInput = {}): R76DriftResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R76DriftStatus =
    activeBlockedReasons.length > 0 ? "distress_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "distress_drift_audit_clear";
  const result: R76DriftResult = {
    phase: "R76B",
    status,
    flags: r76DriftFlags,
    riskCategories: r76DriftRiskCategories,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R76C - Distress Property Intelligence Read-Only UI Scope Contract",
  };
  assertR76DriftInvariants(result);
  return result;
}

export function summarizeR76DistressPropertyIntelligenceDriftAudit(result: R76DriftResult): string {
  assertR76DriftInvariants(result);
  return `R76B ${result.status}: distress drift audit blocks distress signals, scores, vacancy, tax risk, code-risk, neighborhood patterns, and AI recommendations from becoming lead creation, owner contact, outreach, scraping, public-record crawling, skip tracing, campaigns, providers, persistence, audit writing, or execution.`;
}
