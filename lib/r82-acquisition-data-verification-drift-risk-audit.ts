import {
  r82AcquisitionDataVerificationReadinessFlags,
  r82DangerousWordingPatterns,
  r82FutureUiNotes,
  r82InclusiveAccessibility,
} from "./r82-acquisition-data-verification-readiness-scope-contract";

export const r82AcquisitionDataVerificationDriftRiskCategories = [
  "verification-readiness-to-execution drift",
  "missing-data-to-scraping drift",
  "incomplete-record-to-public-record-crawling drift",
  "property-data-gap-to-MLS drift",
  "seller-data-gap-to-skip-tracing drift",
  "owner-data-gap-to-owner-contact drift",
  "buyer/seller-data-gap-to-contact drift",
  "data-confidence-to-lead-creation drift",
  "verification-score-to-provider drift",
  "external API drift",
  "fetch/network drift",
  "persistence drift",
  "audit-writing drift",
  "runtime/polling drift",
  "dangerous wording drift",
] as const;

export const r82AcquisitionDataVerificationDriftFlags = {
  ...r82AcquisitionDataVerificationReadinessFlags,
  driftAuditOnly: true,
  executionAllowed: false,
  liveVerificationAllowed: false,
  sourceExpansionAllowed: false,
  contactExpansionAllowed: false,
  runtimeExpansionAllowed: false,
  persistenceExpansionAllowed: false,
  auditWritingExpansionAllowed: false,
} as const;

export const r82BlockedDriftTransitions = [
  "verification readiness cannot become execution",
  "missing data cannot become scraping",
  "incomplete records cannot become public-record crawling",
  "property data gaps cannot become MLS access",
  "seller data gaps cannot become skip tracing",
  "owner data gaps cannot become owner contact",
  "buyer/seller data gaps cannot become outreach or contact",
  "data confidence cannot create leads",
  "verification scores cannot activate providers",
  "AI recommendations cannot activate providers or execution",
  "external API drift remains blocked",
  "fetch/network drift remains blocked",
  "persistence drift remains blocked",
  "audit-writing drift remains blocked",
  "runtime and polling drift remain blocked",
  "dangerous wording remains blocked",
] as const;

export const r82DriftDangerousWordingPatterns = [
  ...r82DangerousWordingPatterns,
  "verification ready, execute",
  "missing data, scrape it",
  "incomplete record, crawl public records",
  "property gap, check MLS",
  "seller gap, skip trace",
  "owner gap, contact owner",
  "buyer seller gap, start outreach",
  "high confidence, create lead",
  "verification score, activate provider",
  "AI says verify live records",
  "write verification audit now",
  "start polling verification source",
] as const;

export const r82DriftGovernanceChecks = {
  governanceSupremacy: true,
  failClosed: true,
  manualReviewOnly: true,
  noLiveVerification: true,
  noSourceExpansion: true,
  noContactExpansion: true,
  noExecutionExpansion: true,
  noRuntimeExpansion: true,
  noPersistenceExpansion: true,
  noAuditWritingExpansion: true,
  futureUiWordingRiskNotes: [
    "Future UI copy must say readiness is advisory only.",
    "Future UI copy must not imply live verification or sourcing.",
    "Future UI copy must not include contact, provider, polling, persistence, or execution controls.",
  ],
  accessibilityRiskChecks: {
    semanticHeadings: r82InclusiveAccessibility.semanticHeadings,
    readableLabels: r82InclusiveAccessibility.readableLabels,
    textBasedStatusMeaning: r82InclusiveAccessibility.textBasedStatusMeaning,
    noColorOnlyMeaning: r82InclusiveAccessibility.noColorOnlyMeaning,
    noMotionDependency: r82InclusiveAccessibility.noMotionDependency,
    visibleGovernanceWarnings: r82InclusiveAccessibility.visibleGovernanceWarnings,
  },
} as const;

export type R82AcquisitionDataVerificationDriftStatus =
  | "acquisition_data_verification_drift_blocked"
  | "operator_review_required"
  | "acquisition_data_verification_drift_audit_clear";

export type R82AcquisitionDataVerificationDriftInput = {
  verificationReadinessExecutionReviewed?: boolean;
  missingDataScrapingReviewed?: boolean;
  incompleteRecordPublicRecordReviewed?: boolean;
  propertyGapMlsReviewed?: boolean;
  sellerGapSkipTracingReviewed?: boolean;
  ownerGapOwnerContactReviewed?: boolean;
  buyerSellerGapContactReviewed?: boolean;
  dataConfidenceLeadCreationReviewed?: boolean;
  verificationScoreProviderReviewed?: boolean;
  externalApiReviewed?: boolean;
  fetchNetworkReviewed?: boolean;
  persistenceReviewed?: boolean;
  auditWritingReviewed?: boolean;
  runtimePollingReviewed?: boolean;
  dangerousWordingReviewed?: boolean;
  governanceSupremacyReviewed?: boolean;
  failClosedReviewed?: boolean;
  manualReviewOnlyReviewed?: boolean;
  noLiveVerificationReviewed?: boolean;
  noSourceExpansionReviewed?: boolean;
  noContactExpansionReviewed?: boolean;
  noExecutionExpansionReviewed?: boolean;
  noRuntimeExpansionReviewed?: boolean;
  noPersistenceExpansionReviewed?: boolean;
  noAuditWritingExpansionReviewed?: boolean;
  futureUiWordingRiskReviewed?: boolean;
  accessibilityReviewed?: boolean;
  executionRequested?: boolean;
  scrapingRequested?: boolean;
  publicRecordCrawlingRequested?: boolean;
  mlsRequested?: boolean;
  skipTracingRequested?: boolean;
  ownerContactRequested?: boolean;
  buyerSellerContactRequested?: boolean;
  outreachRequested?: boolean;
  leadCreationRequested?: boolean;
  providerActivationRequested?: boolean;
  externalApiRequested?: boolean;
  fetchNetworkRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  runtimeRequested?: boolean;
  pollingRequested?: boolean;
  dangerousWordingRequested?: boolean;
};

export type R82AcquisitionDataVerificationDriftResult = {
  phase: "R82B";
  status: R82AcquisitionDataVerificationDriftStatus;
  flags: typeof r82AcquisitionDataVerificationDriftFlags;
  riskCategories: typeof r82AcquisitionDataVerificationDriftRiskCategories;
  dangerousWordingPatterns: typeof r82DriftDangerousWordingPatterns;
  blockedDriftTransitions: typeof r82BlockedDriftTransitions;
  governanceChecks: typeof r82DriftGovernanceChecks;
  futureUiNotes: typeof r82FutureUiNotes;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R82C - Acquisition Data Verification Read-Only UI Scope Contract";
};

const requiredReviewAreas: Array<[keyof R82AcquisitionDataVerificationDriftInput, string]> = [
  ["verificationReadinessExecutionReviewed", "verification-readiness-to-execution drift"],
  ["missingDataScrapingReviewed", "missing-data-to-scraping drift"],
  ["incompleteRecordPublicRecordReviewed", "incomplete-record-to-public-record-crawling drift"],
  ["propertyGapMlsReviewed", "property-data-gap-to-MLS drift"],
  ["sellerGapSkipTracingReviewed", "seller-data-gap-to-skip-tracing drift"],
  ["ownerGapOwnerContactReviewed", "owner-data-gap-to-owner-contact drift"],
  ["buyerSellerGapContactReviewed", "buyer/seller-data-gap-to-contact drift"],
  ["dataConfidenceLeadCreationReviewed", "data-confidence-to-lead-creation drift"],
  ["verificationScoreProviderReviewed", "verification-score-to-provider drift"],
  ["externalApiReviewed", "external API drift"],
  ["fetchNetworkReviewed", "fetch/network drift"],
  ["persistenceReviewed", "persistence drift"],
  ["auditWritingReviewed", "audit-writing drift"],
  ["runtimePollingReviewed", "runtime/polling drift"],
  ["dangerousWordingReviewed", "dangerous wording drift"],
  ["governanceSupremacyReviewed", "governance supremacy checks"],
  ["failClosedReviewed", "fail-closed behavior"],
  ["manualReviewOnlyReviewed", "manual-review-only doctrine"],
  ["noLiveVerificationReviewed", "no-live-verification doctrine"],
  ["noSourceExpansionReviewed", "no-source-expansion doctrine"],
  ["noContactExpansionReviewed", "no-contact-expansion doctrine"],
  ["noExecutionExpansionReviewed", "no-execution-expansion doctrine"],
  ["noRuntimeExpansionReviewed", "no-runtime-expansion doctrine"],
  ["noPersistenceExpansionReviewed", "no-persistence-expansion doctrine"],
  ["noAuditWritingExpansionReviewed", "no-audit-writing-expansion doctrine"],
  ["futureUiWordingRiskReviewed", "future UI wording risk notes"],
  ["accessibilityReviewed", "inclusive accessibility risk checks"],
];

const blockedReasons: Array<[keyof R82AcquisitionDataVerificationDriftInput, string]> = [
  ["executionRequested", "verification readiness cannot become execution"],
  ["scrapingRequested", "missing data cannot become scraping"],
  ["publicRecordCrawlingRequested", "incomplete records cannot become public-record crawling"],
  ["mlsRequested", "property gaps cannot become MLS access"],
  ["skipTracingRequested", "seller gaps cannot become skip tracing"],
  ["ownerContactRequested", "owner gaps cannot become owner contact"],
  ["buyerSellerContactRequested", "buyer/seller gaps cannot become contact"],
  ["outreachRequested", "buyer/seller gaps cannot become outreach"],
  ["leadCreationRequested", "data confidence cannot create leads"],
  ["providerActivationRequested", "verification scores cannot activate providers"],
  ["externalApiRequested", "external API drift remains blocked"],
  ["fetchNetworkRequested", "fetch/network drift remains blocked"],
  ["persistenceRequested", "persistence drift remains blocked"],
  ["auditWritingRequested", "audit-writing drift remains blocked"],
  ["runtimeRequested", "runtime drift remains blocked"],
  ["pollingRequested", "polling drift remains blocked"],
  ["dangerousWordingRequested", "dangerous wording remains forbidden"],
];

export function classifyR82AcquisitionDataVerificationDangerousWording(text: string): "dangerous_wording_detected" | "wording_clear" {
  const normalized = text.toLowerCase();
  return r82DriftDangerousWordingPatterns.some((pattern) => normalized.includes(pattern.toLowerCase())) ? "dangerous_wording_detected" : "wording_clear";
}

export function assertR82AcquisitionDataVerificationDriftInvariants(result: R82AcquisitionDataVerificationDriftResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly || !flags.driftAuditOnly) {
    throw new Error("R82B must remain read-only advisory drift audit simulation");
  }
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.verificationReadinessGrantsExecution ||
    flags.executionAllowed ||
    flags.liveVerificationAllowed ||
    flags.sourceExpansionAllowed ||
    flags.contactExpansionAllowed ||
    flags.runtimeExpansionAllowed ||
    flags.persistenceExpansionAllowed ||
    flags.auditWritingExpansionAllowed ||
    flags.externalApiAllowed ||
    flags.scrapingAllowed ||
    flags.mlsAccessAllowed ||
    flags.publicRecordCrawlingAllowed ||
    flags.skipTracingAllowed ||
    flags.ownerLookupAllowed ||
    flags.ownerContactAllowed ||
    flags.buyerSellerContactAllowed ||
    flags.leadCreationAllowed ||
    flags.providerClientAllowed ||
    flags.providerEnvReadAllowed ||
    flags.credentialReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.auditRecordsWritten
  ) {
    throw new Error("R82B cannot authorize drift into verification, sourcing, contact, providers, persistence, audit writing, runtime, polling, network, leads, or execution");
  }
  if (!result.futureUiNotes.advisoryOnly || result.futureUiNotes.controlsAuthorized) {
    throw new Error("R82B future UI wording must remain advisory-only and control-free");
  }
  if (!result.governanceChecks.governanceSupremacy || !result.governanceChecks.failClosed) {
    throw new Error("R82B must preserve governance supremacy and fail-closed behavior");
  }
}

export function createR82AcquisitionDataVerificationDriftRiskAudit(input: R82AcquisitionDataVerificationDriftInput = {}): R82AcquisitionDataVerificationDriftResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R82AcquisitionDataVerificationDriftStatus =
    activeBlockedReasons.length > 0
      ? "acquisition_data_verification_drift_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "acquisition_data_verification_drift_audit_clear";
  const result: R82AcquisitionDataVerificationDriftResult = {
    phase: "R82B",
    status,
    flags: r82AcquisitionDataVerificationDriftFlags,
    riskCategories: r82AcquisitionDataVerificationDriftRiskCategories,
    dangerousWordingPatterns: r82DriftDangerousWordingPatterns,
    blockedDriftTransitions: r82BlockedDriftTransitions,
    governanceChecks: r82DriftGovernanceChecks,
    futureUiNotes: r82FutureUiNotes,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R82C - Acquisition Data Verification Read-Only UI Scope Contract",
  };
  assertR82AcquisitionDataVerificationDriftInvariants(result);
  return result;
}

export function summarizeR82AcquisitionDataVerificationDriftRiskAudit(result: R82AcquisitionDataVerificationDriftResult): string {
  assertR82AcquisitionDataVerificationDriftInvariants(result);
  return `R82B ${result.status}: acquisition data verification drift audit blocks verification readiness, missing data, incomplete records, data gaps, confidence, scores, UI wording, and AI recommendations from becoming execution, scraping, public-record crawling, MLS access, skip tracing, contact, lead creation, providers, external APIs, fetch/network, persistence, audit writing, runtime jobs, polling, or autonomous acquisition.`;
}
