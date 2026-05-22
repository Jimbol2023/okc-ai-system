export const r71FinalFlags = {
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
  credentialEnvReadAllowed: false,
  fetchNetworkAllowed: false,
  providerClientAllowed: false,
  auditLoggingActive: false,
  auditRecordsWritten: false,
  controlledOutreachLocked: true,
  executionBlocked: true,
} as const;

export const r71FinalLockdownRules = [
  "Outreach preparation never sends.",
  "Message preview never sends.",
  "Call preparation never calls.",
  "Approval never grants sending.",
  "Recommendation never grants outreach.",
  "Urgency never grants outreach.",
  "Revenue priority never grants outreach.",
  "Queue never grants outreach.",
  "Readiness never grants outreach.",
  "Provider readiness never grants outreach.",
  "Simulation never grants outreach.",
  "Provider activation remains blocked.",
  "Credential and env reads remain blocked.",
  "Fetch/network remains blocked.",
  "Provider clients remain blocked.",
  "Runtime remains blocked.",
  "Polling remains blocked.",
  "Persistence remains blocked.",
  "Audit logging remains inactive.",
  "Execution remains blocked.",
] as const;

export type R71FinalStatus = "controlled_outreach_lockdown_blocked" | "operator_review_required" | "controlled_outreach_lockdown_enforced";

export type R71FinalInput = {
  r71aReviewed?: boolean;
  r71bReviewed?: boolean;
  r71cReviewed?: boolean;
  r71dReviewed?: boolean;
  r71eReviewed?: boolean;
  lockdownRulesReviewed?: boolean;
  accessibilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  outreachPreparationSendRequested?: boolean;
  messagePreviewSendRequested?: boolean;
  callPreparationCallRequested?: boolean;
  approvalSendRequested?: boolean;
  recommendationOutreachRequested?: boolean;
  urgencyOutreachRequested?: boolean;
  revenueOutreachRequested?: boolean;
  queueOutreachRequested?: boolean;
  readinessOutreachRequested?: boolean;
  providerReadinessOutreachRequested?: boolean;
  simulationOutreachRequested?: boolean;
  providerActivationRequested?: boolean;
  credentialEnvReadRequested?: boolean;
  fetchNetworkRequested?: boolean;
  providerClientRequested?: boolean;
  runtimeRequested?: boolean;
  pollingRequested?: boolean;
  campaignRequested?: boolean;
  persistenceRequested?: boolean;
  auditWritingRequested?: boolean;
  executionRequested?: boolean;
};

export type R71FinalResult = {
  phase: "R71F";
  status: R71FinalStatus;
  flags: typeof r71FinalFlags;
  lockdownRules: typeof r71FinalLockdownRules;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R72A - Revenue Command Center Scope Contract";
};

const requiredReviewAreas: Array<[keyof R71FinalInput, string]> = [
  ["r71aReviewed", "R71A"],
  ["r71bReviewed", "R71B"],
  ["r71cReviewed", "R71C"],
  ["r71dReviewed", "R71D"],
  ["r71eReviewed", "R71E"],
  ["lockdownRulesReviewed", "lockdown rules"],
  ["accessibilityReviewed", "inclusive accessibility"],
  ["operatorReviewCompleted", "operator review"],
];

const blockedReasons: Array<[keyof R71FinalInput, string]> = [
  ["outreachPreparationSendRequested", "outreach preparation never sends"],
  ["messagePreviewSendRequested", "message preview never sends"],
  ["callPreparationCallRequested", "call preparation never calls"],
  ["approvalSendRequested", "approval never grants sending"],
  ["recommendationOutreachRequested", "recommendation never grants outreach"],
  ["urgencyOutreachRequested", "urgency never grants outreach"],
  ["revenueOutreachRequested", "revenue priority never grants outreach"],
  ["queueOutreachRequested", "queue never grants outreach"],
  ["readinessOutreachRequested", "readiness never grants outreach"],
  ["providerReadinessOutreachRequested", "provider readiness never grants outreach"],
  ["simulationOutreachRequested", "simulation never grants outreach"],
  ["providerActivationRequested", "provider activation remains blocked"],
  ["credentialEnvReadRequested", "credential and env reads remain blocked"],
  ["fetchNetworkRequested", "fetch/network remains blocked"],
  ["providerClientRequested", "provider clients remain blocked"],
  ["runtimeRequested", "runtime remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["campaignRequested", "campaigns remain blocked"],
  ["persistenceRequested", "persistence remains blocked"],
  ["auditWritingRequested", "audit logging remains inactive"],
  ["executionRequested", "execution remains blocked"],
];

export function assertR71FinalInvariants(result: R71FinalResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) throw new Error("R71F must remain read-only advisory simulation");
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
    flags.credentialEnvReadAllowed ||
    flags.fetchNetworkAllowed ||
    flags.providerClientAllowed ||
    flags.auditLoggingActive ||
    flags.auditRecordsWritten ||
    !flags.controlledOutreachLocked ||
    !flags.executionBlocked
  ) {
    throw new Error("R71F lockdown failed controlled outreach invariants");
  }
}

export function createR71ControlledHumanOutreachFinalLockdownContract(input: R71FinalInput = {}): R71FinalResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R71FinalStatus =
    activeBlockedReasons.length > 0 ? "controlled_outreach_lockdown_blocked" : missingReviewAreas.length > 0 ? "operator_review_required" : "controlled_outreach_lockdown_enforced";
  const result: R71FinalResult = {
    phase: "R71F",
    status,
    flags: r71FinalFlags,
    lockdownRules: r71FinalLockdownRules,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R72A - Revenue Command Center Scope Contract",
  };
  assertR71FinalInvariants(result);
  return result;
}

export function summarizeR71ControlledHumanOutreachFinalLockdown(result: R71FinalResult): string {
  assertR71FinalInvariants(result);
  return `R71F ${result.status}: controlled human outreach is locked as preparation-only; previews, call prep, approval, recommendations, urgency, revenue, queue, readiness, provider readiness, and simulation never grant outreach, while providers, credential/env reads, fetch/network, provider clients, campaigns, runtime, polling, persistence, audit writing, and execution remain blocked.`;
}
