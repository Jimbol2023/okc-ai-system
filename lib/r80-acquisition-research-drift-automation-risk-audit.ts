export const r80DriftRiskCategories = [
  "research-to-scraping drift",
  "research-to-geocoding drift",
  "research-to-map-crawling drift",
  "research-to-lead-creation drift",
  "research-to-owner-contact drift",
  "research-to-buyer/seller-contact drift",
  "research-to-campaign drift",
  "research-to-provider drift",
  "research-to-outreach drift",
  "missing-data-to-external-API drift",
  "AI-recommendation-to-skip-tracing drift",
  "provider drift",
  "fetch/network drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
] as const;

export const r80DriftFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  scrapingAllowed: false,
  geocodingAllowed: false,
  mapCrawlingAllowed: false,
  leadCreationAllowed: false,
  ownerContactAllowed: false,
  buyerSellerContactAllowed: false,
  campaignAllowed: false,
  providerActivationAllowed: false,
  outreachAllowed: false,
  externalApiAllowed: false,
  skipTracingAllowed: false,
  fetchNetworkAllowed: false,
  persistenceAllowedNow: false,
  auditWritingAllowed: false,
  executionAllowed: false,
} as const;

export type R80DriftStatus = "acquisition_research_drift_blocked" | "operator_review_required" | "acquisition_research_drift_audit_clear";

export type R80DriftInput = {
  scrapingReviewed?: boolean;
  geocodingReviewed?: boolean;
  mapCrawlingReviewed?: boolean;
  leadCreationReviewed?: boolean;
  ownerContactReviewed?: boolean;
  buyerSellerContactReviewed?: boolean;
  campaignReviewed?: boolean;
  providerReviewed?: boolean;
  outreachReviewed?: boolean;
  missingDataExternalApiReviewed?: boolean;
  aiSkipTracingReviewed?: boolean;
  persistenceReviewed?: boolean;
  auditBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  scrapingRequested?: boolean;
  geocodingRequested?: boolean;
  mapCrawlingRequested?: boolean;
  leadCreationRequested?: boolean;
  ownerContactRequested?: boolean;
  buyerSellerContactRequested?: boolean;
  campaignRequested?: boolean;
  providerRequested?: boolean;
  outreachRequested?: boolean;
  externalApiRequested?: boolean;
  skipTracingRequested?: boolean;
  fetchNetworkRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  executionRequested?: boolean;
  dangerousWordingRequested?: boolean;
};

export type R80DriftResult = {
  phase: "R80B";
  status: R80DriftStatus;
  flags: typeof r80DriftFlags;
  riskCategories: typeof r80DriftRiskCategories;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R80C - Acquisition Research Workbench Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R80DriftInput, string]> = [
  ["scrapingReviewed", "research-to-scraping"],
  ["geocodingReviewed", "research-to-geocoding"],
  ["mapCrawlingReviewed", "research-to-map-crawling"],
  ["leadCreationReviewed", "research-to-lead-creation"],
  ["ownerContactReviewed", "research-to-owner-contact"],
  ["buyerSellerContactReviewed", "research-to-buyer/seller-contact"],
  ["campaignReviewed", "research-to-campaign"],
  ["providerReviewed", "research-to-provider"],
  ["outreachReviewed", "research-to-outreach"],
  ["missingDataExternalApiReviewed", "missing-data-to-external-API"],
  ["aiSkipTracingReviewed", "AI-recommendation-to-skip-tracing"],
  ["persistenceReviewed", "persistence boundary"],
  ["auditBoundaryReviewed", "audit boundary"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R80DriftInput, string]> = [
  ["scrapingRequested", "research cannot trigger scraping"],
  ["geocodingRequested", "research cannot trigger geocoding"],
  ["mapCrawlingRequested", "research cannot trigger map crawling"],
  ["leadCreationRequested", "research cannot create leads"],
  ["ownerContactRequested", "research cannot contact owners"],
  ["buyerSellerContactRequested", "research cannot contact buyers or sellers"],
  ["campaignRequested", "research cannot launch campaigns"],
  ["providerRequested", "research cannot activate providers"],
  ["outreachRequested", "research cannot trigger outreach"],
  ["externalApiRequested", "missing data cannot trigger external APIs"],
  ["skipTracingRequested", "AI recommendations cannot trigger skip tracing"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["executionRequested", "execution remains blocked"],
  ["dangerousWordingRequested", "dangerous wording remains forbidden"],
];

export function assertR80DriftInvariants(result: R80DriftResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R80B must remain read-only advisory simulation");
  if (Object.entries(flags).some(([key, value]) => key !== "readOnly" && key !== "advisoryOnly" && key !== "simulationOnly" && value === true)) {
    throw new Error("R80B cannot authorize sourcing, contacts, leads, campaigns, providers, persistence, audit writing, or execution");
  }
}

export function createR80AcquisitionResearchDriftAutomationRiskAudit(input: R80DriftInput = {}): R80DriftResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R80DriftStatus =
    activeBlockedReasons.length > 0 ? "acquisition_research_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "acquisition_research_drift_audit_clear";
  const result: R80DriftResult = {
    phase: "R80B",
    status,
    flags: r80DriftFlags,
    riskCategories: r80DriftRiskCategories,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R80C - Acquisition Research Workbench Read-Only UI Scope Contract",
  };
  assertR80DriftInvariants(result);
  return result;
}

export function summarizeR80AcquisitionResearchDriftAudit(result: R80DriftResult): string {
  assertR80DriftInvariants(result);
  return `R80B ${result.status}: acquisition research drift audit blocks research visibility from becoming scraping, geocoding, map crawling, lead creation, owner contact, buyer/seller contact, campaigns, providers, outreach, external APIs, skip tracing, fetch/network, persistence, audit writing, or execution.`;
}
