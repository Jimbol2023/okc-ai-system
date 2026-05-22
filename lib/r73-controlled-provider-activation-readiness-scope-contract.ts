export const r73ScopeFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  providerCalled: false,
  sent: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  providerActivationAllowed: false,
  approvalGrantsExecution: false,
  providerReadinessGrantsActivation: false,
  providerClientAllowed: false,
  providerEnvReadAllowed: false,
  credentialReadAllowed: false,
  fetchNetworkAllowed: false,
  outreachAuthorizedNow: false,
  smsAllowedNow: false,
  emailAllowedNow: false,
  callAllowedNow: false,
  campaignAllowedNow: false,
  auditRecordsWritten: false,
} as const;

export const r73AllowedConcepts = [
  "controlled provider activation readiness",
  "provider isolation doctrine",
  "readiness-does-not-activate doctrine",
  "governance prerequisite review",
  "provider safety prerequisite review",
  "future kill-switch prerequisite review",
  "future audit prerequisite review",
  "future runtime prerequisite review",
  "human review required",
  "future UI visibility only",
  "provider activation audit doctrine only",
] as const;

export const r73DangerousWordingPatterns = [
  "provider ready means activate",
  "activate provider now",
  "approval activates provider",
  "readiness sends",
  "queue triggers provider",
  "urgency triggers provider",
  "revenue pressure triggers provider",
  "simulation triggers provider",
  "preview triggers provider",
  "create provider client",
  "read provider credentials",
  "read provider env vars",
  "access network",
  "launch campaign",
] as const;

export const r73GovernanceBoundary = {
  governanceStopsOutrank: [
    "provider readiness",
    "revenue pressure",
    "revenue opportunity",
    "urgency",
    "queue priority",
    "AI recommendation",
    "approval status",
    "simulation readiness",
    "preview readiness",
  ],
  providerReadinessOnlyMeans: [
    "governance review may be useful",
    "human review required",
    "future prerequisites remain incomplete",
    "provider activation remains blocked",
    "runtime activation remains blocked",
    "polling remains blocked",
    "persistence remains blocked",
    "audit writing remains inactive",
    "execution remains blocked",
  ],
} as const;

export const r73AuditBoundary = {
  auditLayerActive: false,
  auditPersistenceAuthorizedNow: false,
  auditRecordsWrittenNow: false,
  wording: [
    "future audit log required",
    "audit layer not active yet",
    "audit persistence not authorized now",
    "no audit records are written in this phase",
    "provider activation audit doctrine only",
  ],
} as const;

export const r73InclusiveAccessibility = {
  semanticHeadings: true,
  clearSectionStructure: true,
  ariaLabelledby: true,
  ariaDescribedby: true,
  readableLabels: true,
  plainLanguageSummaries: true,
  textBasedStatusMeaning: true,
  noColorOnlyMeaning: true,
  sufficientSpacing: true,
  noMotionDependency: true,
  noFocusMovement: true,
  noAutoRefresh: true,
  noPolling: true,
  predictableReadingOrder: true,
  visibleGovernanceWarnings: true,
  noTinyUnreadableText: true,
  noCrampedControls: true,
} as const;

export type R73ScopeStatus = "provider_readiness_scope_blocked" | "operator_review_required" | "provider_readiness_scope_ready";

export type R73ScopeInput = {
  providerReadinessDoctrineReviewed?: boolean;
  providerIsolationReviewed?: boolean;
  humanInControlReviewed?: boolean;
  readinessDoesNotActivateReviewed?: boolean;
  governancePrerequisiteReviewed?: boolean;
  killSwitchPrerequisiteReviewed?: boolean;
  auditPrerequisiteReviewed?: boolean;
  accessibilityReviewed?: boolean;
  providerActivationRequested?: boolean;
  providerClientRequested?: boolean;
  envReadRequested?: boolean;
  credentialReadRequested?: boolean;
  fetchNetworkRequested?: boolean;
  outreachRequested?: boolean;
  sendRequested?: boolean;
  callRequested?: boolean;
  textRequested?: boolean;
  emailRequested?: boolean;
  runtimeRequested?: boolean;
  pollingRequested?: boolean;
  campaignRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
};

export type R73ScopeResult = {
  phase: "R73A";
  status: R73ScopeStatus;
  flags: typeof r73ScopeFlags;
  allowedConcepts: typeof r73AllowedConcepts;
  dangerousWordingPatterns: typeof r73DangerousWordingPatterns;
  governanceBoundary: typeof r73GovernanceBoundary;
  auditBoundary: typeof r73AuditBoundary;
  accessibility: typeof r73InclusiveAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R73B - Provider Activation Readiness Drift / Execution Risk Audit";
};

const requiredReviewAreas: Array<[keyof R73ScopeInput, string]> = [
  ["providerReadinessDoctrineReviewed", "provider activation readiness doctrine"],
  ["providerIsolationReviewed", "provider isolation doctrine"],
  ["humanInControlReviewed", "human-in-control doctrine"],
  ["readinessDoesNotActivateReviewed", "readiness-does-not-activate doctrine"],
  ["governancePrerequisiteReviewed", "governance prerequisite doctrine"],
  ["killSwitchPrerequisiteReviewed", "future kill-switch prerequisite doctrine"],
  ["auditPrerequisiteReviewed", "future audit prerequisite doctrine"],
  ["accessibilityReviewed", "inclusive accessibility"],
];

const blockedReasons: Array<[keyof R73ScopeInput, string]> = [
  ["providerActivationRequested", "provider activation remains blocked"],
  ["providerClientRequested", "provider clients remain blocked"],
  ["envReadRequested", "provider env reads remain blocked"],
  ["credentialReadRequested", "credential reads remain blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["outreachRequested", "outreach activation remains blocked"],
  ["sendRequested", "sending remains blocked"],
  ["callRequested", "calling remains blocked"],
  ["textRequested", "texting remains blocked"],
  ["emailRequested", "email remains blocked"],
  ["runtimeRequested", "runtime activation remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["campaignRequested", "campaign activation remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
];

export function assertR73ScopeInvariants(result: R73ScopeResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R73A must remain read-only advisory simulation");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.providerReadinessGrantsActivation ||
    flags.providerClientAllowed ||
    flags.providerEnvReadAllowed ||
    flags.credentialReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.outreachAuthorizedNow ||
    flags.smsAllowedNow ||
    flags.emailAllowedNow ||
    flags.callAllowedNow ||
    flags.campaignAllowedNow ||
    flags.auditRecordsWritten
  ) {
    throw new Error("R73A cannot authorize provider activation, clients, credential/env reads, fetch/network, outreach, sending, runtime, polling, campaigns, persistence, audit writing, or execution");
  }
}

export function createR73ControlledProviderActivationReadinessScopeContract(input: R73ScopeInput = {}): R73ScopeResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R73ScopeStatus =
    activeBlockedReasons.length > 0 ? "provider_readiness_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "provider_readiness_scope_ready";
  const result: R73ScopeResult = {
    phase: "R73A",
    status,
    flags: r73ScopeFlags,
    allowedConcepts: r73AllowedConcepts,
    dangerousWordingPatterns: r73DangerousWordingPatterns,
    governanceBoundary: r73GovernanceBoundary,
    auditBoundary: r73AuditBoundary,
    accessibility: r73InclusiveAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R73B - Provider Activation Readiness Drift / Execution Risk Audit",
  };
  assertR73ScopeInvariants(result);
  return result;
}

export function summarizeR73ControlledProviderActivationReadinessScope(result: R73ScopeResult): string {
  assertR73ScopeInvariants(result);
  return `R73A ${result.status}: provider activation readiness is advisory only; readiness never activates providers, creates clients, reads credentials or env vars, uses fetch/network, sends, calls, launches campaigns, persists, writes audit records, polls, starts runtime work, or executes.`;
}
