export const r71ScopeFlags = {
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
  outreachAuthorizedNow: false,
  smsAllowedNow: false,
  emailAllowedNow: false,
  callAllowedNow: false,
  campaignAllowedNow: false,
  providerClientAllowed: false,
  providerEnvReadAllowed: false,
  fetchNetworkAllowed: false,
  auditRecordsWritten: false,
} as const;

export const r71AllowedConcepts = [
  "controlled human outreach workflow",
  "outreach preparation visibility",
  "human review required",
  "contact is not authorized in this phase",
  "message preparation review only",
  "call preparation review only",
  "provider remains blocked",
  "future UI visibility only",
  "controlled outreach audit doctrine only",
] as const;

export const r71DangerousWordingPatterns = [
  "send now",
  "call now",
  "text now",
  "email now",
  "approve and send",
  "message preview sends",
  "call prep calls",
  "launch campaign",
  "activate provider",
  "AI sends follow-up",
  "queue triggers outreach",
  "revenue priority triggers outreach",
] as const;

export const r71GovernanceBoundary = {
  governanceStopsOutrank: [
    "outreach readiness",
    "revenue priority",
    "operator priority",
    "seller urgency",
    "buyer readiness",
    "near-close status",
    "stuck-deal status",
    "AI recommendation",
    "workload pressure",
    "approval status",
    "simulation readiness",
    "provider readiness",
  ],
  outreachPreparationOnlyMeans: [
    "human review may be useful",
    "manual decision required",
    "contact is not authorized in this phase",
    "provider activation remains blocked",
    "runtime activation remains blocked",
    "polling remains blocked",
    "persistence remains blocked",
    "audit writing remains inactive",
    "execution remains blocked",
  ],
} as const;

export const r71AuditBoundary = {
  auditLayerActive: false,
  auditPersistenceAuthorizedNow: false,
  auditRecordsWrittenNow: false,
  wording: [
    "future audit log required",
    "audit layer not active yet",
    "audit persistence not authorized now",
    "no audit records are written in this phase",
    "controlled outreach audit doctrine only",
  ],
} as const;

export const r71InclusiveAccessibility = {
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

export type R71ScopeStatus = "controlled_outreach_scope_blocked" | "operator_review_required" | "controlled_outreach_scope_ready";

export type R71ScopeInput = {
  controlledOutreachDoctrineReviewed?: boolean;
  humanInControlReviewed?: boolean;
  advisoryOnlyReviewed?: boolean;
  providerIsolationReviewed?: boolean;
  noContactBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  auditBoundaryReviewed?: boolean;
  outreachRequested?: boolean;
  sendRequested?: boolean;
  callRequested?: boolean;
  textRequested?: boolean;
  emailRequested?: boolean;
  providerRequested?: boolean;
  providerClientRequested?: boolean;
  envReadRequested?: boolean;
  fetchNetworkRequested?: boolean;
  runtimeRequested?: boolean;
  pollingRequested?: boolean;
  campaignRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
};

export type R71ScopeResult = {
  phase: "R71A";
  status: R71ScopeStatus;
  flags: typeof r71ScopeFlags;
  allowedConcepts: typeof r71AllowedConcepts;
  dangerousWordingPatterns: typeof r71DangerousWordingPatterns;
  governanceBoundary: typeof r71GovernanceBoundary;
  auditBoundary: typeof r71AuditBoundary;
  accessibility: typeof r71InclusiveAccessibility;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R71B - Controlled Outreach Drift / Send Risk Audit";
};

const requiredReviewAreas: Array<[keyof R71ScopeInput, string]> = [
  ["controlledOutreachDoctrineReviewed", "controlled human outreach doctrine"],
  ["humanInControlReviewed", "human-in-control doctrine"],
  ["advisoryOnlyReviewed", "advisory-only doctrine"],
  ["providerIsolationReviewed", "provider isolation"],
  ["noContactBoundaryReviewed", "no-contact boundary"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["auditBoundaryReviewed", "audit boundary"],
];

const blockedReasons: Array<[keyof R71ScopeInput, string]> = [
  ["outreachRequested", "outreach activation remains blocked"],
  ["sendRequested", "sending remains blocked"],
  ["callRequested", "calling remains blocked"],
  ["textRequested", "texting remains blocked"],
  ["emailRequested", "email remains blocked"],
  ["providerRequested", "provider activation remains blocked"],
  ["providerClientRequested", "provider clients remain blocked"],
  ["envReadRequested", "provider env reads remain blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["runtimeRequested", "runtime activation remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["campaignRequested", "campaign activation remains blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit writing remains blocked"],
];

export function assertR71ScopeInvariants(result: R71ScopeResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R71A must remain read-only advisory simulation");
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.outreachAuthorizedNow ||
    flags.smsAllowedNow ||
    flags.emailAllowedNow ||
    flags.callAllowedNow ||
    flags.campaignAllowedNow ||
    flags.providerClientAllowed ||
    flags.providerEnvReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.auditRecordsWritten
  ) {
    throw new Error("R71A cannot authorize outreach, sending, calls, providers, campaigns, env reads, fetch/network, runtime, polling, persistence, audit writing, or execution");
  }
}

export function createR71ControlledHumanOutreachWorkflowScopeContract(input: R71ScopeInput = {}): R71ScopeResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R71ScopeStatus =
    activeBlockedReasons.length > 0 ? "controlled_outreach_scope_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "controlled_outreach_scope_ready";
  const result: R71ScopeResult = {
    phase: "R71A",
    status,
    flags: r71ScopeFlags,
    allowedConcepts: r71AllowedConcepts,
    dangerousWordingPatterns: r71DangerousWordingPatterns,
    governanceBoundary: r71GovernanceBoundary,
    auditBoundary: r71AuditBoundary,
    accessibility: r71InclusiveAccessibility,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R71B - Controlled Outreach Drift / Send Risk Audit",
  };
  assertR71ScopeInvariants(result);
  return result;
}

export function summarizeR71ControlledHumanOutreachWorkflowScope(result: R71ScopeResult): string {
  assertR71ScopeInvariants(result);
  return `R71A ${result.status}: controlled human outreach is planning-only; preparation never sends, calls, texts, emails, launches campaigns, activates providers, reads env, uses fetch/network, persists, writes audit records, or executes.`;
}
