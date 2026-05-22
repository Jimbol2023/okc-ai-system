export const r81DriftRiskCategories = [
  "timing-signal-to-execution drift",
  "momentum-score-to-campaign drift",
  "market-opportunity-to-lead-creation drift",
  "missing-market-data-to-scraping drift",
  "demand-shift-to-buyer-contact drift",
  "urgency-to-provider drift",
  "external-data/API drift",
  "MLS drift",
  "public-record crawling drift",
  "fetch/network drift",
  "persistence drift",
  "audit-writing drift",
  "dangerous wording drift",
] as const;

export const r81DriftFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  executionAllowed: false,
  campaignAllowed: false,
  leadCreationAllowed: false,
  scrapingAllowed: false,
  buyerSellerOwnerContactAllowed: false,
  providerActivationAllowed: false,
  externalApiAllowed: false,
  mlsAccessAllowed: false,
  publicRecordCrawlingAllowed: false,
  fetchNetworkAllowed: false,
  persistenceAllowedNow: false,
  auditWritingAllowed: false,
} as const;

export type R81DriftStatus = "market_momentum_drift_blocked" | "operator_review_required" | "market_momentum_drift_audit_clear";

export type R81DriftInput = {
  timingExecutionReviewed?: boolean;
  momentumCampaignReviewed?: boolean;
  opportunityLeadCreationReviewed?: boolean;
  missingMarketScrapingReviewed?: boolean;
  demandShiftContactReviewed?: boolean;
  urgencyProviderReviewed?: boolean;
  externalDataReviewed?: boolean;
  mlsReviewed?: boolean;
  publicRecordCrawlingReviewed?: boolean;
  persistenceReviewed?: boolean;
  auditBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  executionRequested?: boolean;
  campaignRequested?: boolean;
  leadCreationRequested?: boolean;
  scrapingRequested?: boolean;
  buyerSellerOwnerContactRequested?: boolean;
  providerRequested?: boolean;
  externalApiRequested?: boolean;
  mlsRequested?: boolean;
  publicRecordCrawlingRequested?: boolean;
  fetchNetworkRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  dangerousWordingRequested?: boolean;
};

export type R81DriftResult = {
  phase: "R81B";
  status: R81DriftStatus;
  flags: typeof r81DriftFlags;
  riskCategories: typeof r81DriftRiskCategories;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R81C - Market Timing Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R81DriftInput, string]> = [
  ["timingExecutionReviewed", "timing-signal-to-execution"],
  ["momentumCampaignReviewed", "momentum-score-to-campaign"],
  ["opportunityLeadCreationReviewed", "market-opportunity-to-lead-creation"],
  ["missingMarketScrapingReviewed", "missing-market-data-to-scraping"],
  ["demandShiftContactReviewed", "demand-shift-to-buyer-contact"],
  ["urgencyProviderReviewed", "urgency-to-provider"],
  ["externalDataReviewed", "external-data/API boundary"],
  ["mlsReviewed", "MLS boundary"],
  ["publicRecordCrawlingReviewed", "public-record crawling boundary"],
  ["persistenceReviewed", "persistence boundary"],
  ["auditBoundaryReviewed", "audit boundary"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R81DriftInput, string]> = [
  ["executionRequested", "timing signals cannot execute"],
  ["campaignRequested", "momentum scores cannot start campaigns"],
  ["leadCreationRequested", "market opportunities cannot create leads"],
  ["scrapingRequested", "missing market data cannot trigger scraping"],
  ["buyerSellerOwnerContactRequested", "demand shifts cannot contact buyers, sellers, or owners"],
  ["providerRequested", "urgency cannot activate providers"],
  ["externalApiRequested", "external data/API calls remain blocked"],
  ["mlsRequested", "MLS access remains blocked"],
  ["publicRecordCrawlingRequested", "public-record crawling remains blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
  ["dangerousWordingRequested", "dangerous wording remains forbidden"],
];

export function assertR81DriftInvariants(result: R81DriftResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R81B must remain read-only advisory simulation");
  if (Object.entries(flags).some(([key, value]) => key !== "readOnly" && key !== "advisoryOnly" && key !== "simulationOnly" && value === true)) {
    throw new Error("R81B cannot authorize market drift into execution, campaigns, sourcing, contacts, providers, persistence, audit writing, or network behavior");
  }
}

export function createR81MarketMomentumDriftDataRiskAudit(input: R81DriftInput = {}): R81DriftResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R81DriftStatus =
    activeBlockedReasons.length > 0 ? "market_momentum_drift_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "market_momentum_drift_audit_clear";
  const result: R81DriftResult = {
    phase: "R81B",
    status,
    flags: r81DriftFlags,
    riskCategories: r81DriftRiskCategories,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R81C - Market Timing Read-Only UI Scope Contract",
  };
  assertR81DriftInvariants(result);
  return result;
}

export function summarizeR81MarketMomentumDriftAudit(result: R81DriftResult): string {
  assertR81DriftInvariants(result);
  return `R81B ${result.status}: market momentum drift audit blocks timing signals, momentum scores, opportunity windows, missing market data, demand shifts, and urgency from becoming execution, campaigns, leads, scraping, contact, providers, external APIs, MLS, public-record crawling, fetch/network, persistence, audit writing, or dangerous wording.`;
}
