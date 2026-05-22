export const r67FinalLockdownFlags = {
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
  automationLastLocked: true,
  executionBlocked: true,
} as const;

export const r67FinalLockdownRules = [
  "Automation remains last.",
  "Intelligence never grants permission.",
  "Approval never grants execution.",
  "Readiness never grants execution.",
  "Queue priority never grants execution.",
  "Urgency never grants execution.",
  "Revenue opportunity never grants execution.",
  "Provider activation remains blocked.",
  "Runtime activation remains blocked.",
  "Polling remains blocked.",
  "Execution remains blocked.",
  "Governance stop signals remain dominant.",
] as const;

export const r67FinalForbiddenDrift = [
  "automate now",
  "send now",
  "approve and send",
  "queue triggers workflow",
  "priority triggers workflow",
  "score triggers workflow",
  "urgency triggers workflow",
  "readiness triggers workflow",
  "revenue triggers workflow",
  "activate provider",
  "create runtime job",
  "create polling loop",
  "create execution queue",
  "launch campaign",
  "autonomous routing",
  "autonomous outreach",
  "autonomous negotiation",
] as const;

export type R67FinalLockdownStatus =
  | "automation_last_lockdown_blocked"
  | "operator_review_required"
  | "automation_last_lockdown_enforced";

export type R67FinalLockdownInput = {
  r67aReviewed?: boolean;
  r67bReviewed?: boolean;
  r67cReviewed?: boolean;
  r67dReviewed?: boolean;
  r67eReviewed?: boolean;
  lockdownRulesReviewed?: boolean;
  forbiddenDriftReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  automationRequested?: boolean;
  executionRequested?: boolean;
  intelligencePermissionRequested?: boolean;
  approvalExecutionRequested?: boolean;
  readinessExecutionRequested?: boolean;
  queueExecutionRequested?: boolean;
  urgencyExecutionRequested?: boolean;
  revenueExecutionRequested?: boolean;
  providerActivationRequested?: boolean;
  runtimeActivationRequested?: boolean;
  pollingRequested?: boolean;
  campaignRequested?: boolean;
  hiddenExecutionRequested?: boolean;
};

export type R67FinalLockdownResult = {
  phase: "R67F";
  status: R67FinalLockdownStatus;
  flags: typeof r67FinalLockdownFlags;
  lockdownRules: typeof r67FinalLockdownRules;
  forbiddenDrift: typeof r67FinalForbiddenDrift;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R68A - Execution Simulation Intelligence Scope Contract";
};

const requiredReviewAreas: Array<[keyof R67FinalLockdownInput, string]> = [
  ["r67aReviewed", "R67A"],
  ["r67bReviewed", "R67B"],
  ["r67cReviewed", "R67C"],
  ["r67dReviewed", "R67D"],
  ["r67eReviewed", "R67E"],
  ["lockdownRulesReviewed", "lockdown rules"],
  ["forbiddenDriftReviewed", "forbidden drift"],
  ["operatorReviewCompleted", "operator review"],
];

const blockedReasons: Array<[keyof R67FinalLockdownInput, string]> = [
  ["automationRequested", "automation remains last and blocked"],
  ["executionRequested", "execution remains blocked"],
  ["intelligencePermissionRequested", "intelligence never grants permission"],
  ["approvalExecutionRequested", "approval never grants execution"],
  ["readinessExecutionRequested", "readiness never grants execution"],
  ["queueExecutionRequested", "queue priority never grants execution"],
  ["urgencyExecutionRequested", "urgency never grants execution"],
  ["revenueExecutionRequested", "revenue opportunity never grants execution"],
  ["providerActivationRequested", "provider activation remains blocked"],
  ["runtimeActivationRequested", "runtime activation remains blocked"],
  ["pollingRequested", "polling remains blocked"],
  ["campaignRequested", "campaign activation remains blocked"],
  ["hiddenExecutionRequested", "hidden execution affordances remain blocked"],
];

export function assertR67FinalLockdownInvariants(result: R67FinalLockdownResult): void {
  const flags = result.flags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) {
    throw new Error("R67F must remain read-only, advisory-only, and simulation-only");
  }
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    !flags.automationLastLocked ||
    !flags.executionBlocked
  ) {
    throw new Error("R67F lockdown failed automation-last execution boundary invariants");
  }
}

export function createR67AutomationLastFinalLockdownContract(
  input: R67FinalLockdownInput = {},
): R67FinalLockdownResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R67FinalLockdownStatus =
    activeBlockedReasons.length > 0
      ? "automation_last_lockdown_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "automation_last_lockdown_enforced";
  const result: R67FinalLockdownResult = {
    phase: "R67F",
    status,
    flags: r67FinalLockdownFlags,
    lockdownRules: r67FinalLockdownRules,
    forbiddenDrift: r67FinalForbiddenDrift,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R68A - Execution Simulation Intelligence Scope Contract",
  };
  assertR67FinalLockdownInvariants(result);
  return result;
}

export function summarizeR67AutomationLastFinalLockdown(result: R67FinalLockdownResult): string {
  assertR67FinalLockdownInvariants(result);
  return `R67F ${result.status}: automation-last governance is locked; intelligence, approval, readiness, queue, urgency, and revenue signals never grant execution, and provider, runtime, polling, campaign, automation, and execution remain blocked.`;
}
