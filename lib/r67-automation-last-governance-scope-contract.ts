export const r67AutomationLastSafetyFlags = {
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
  automationAllowedNow: false,
  executionAllowedNow: false,
} as const;

export const r67AllowedAutomationLastConcepts = [
  "automation-last doctrine",
  "intelligence does not grant permission",
  "approval does not grant execution",
  "readiness does not grant execution",
  "queue priority does not grant execution",
  "urgency does not grant execution",
  "revenue opportunity does not grant execution",
  "human review remains required",
  "provider activation remains blocked",
  "runtime activation remains blocked",
  "polling remains blocked",
  "execution remains blocked",
  "autonomous escalation remains blocked",
  "simulation-first requirement",
  "fail-closed automation boundary",
  "governance stop dominance",
  "explicit operator confirmation required in future",
  "future automation prerequisites",
  "no implicit execution",
  "no hidden execution affordance",
] as const;

export const r67ForbiddenAutomationSemantics = [
  "automate now",
  "send now",
  "approve and send",
  "approval sends message",
  "queue triggers workflow",
  "priority triggers workflow",
  "score triggers workflow",
  "urgency triggers workflow",
  "readiness triggers workflow",
  "AI contacts seller",
  "AI contacts buyer",
  "AI negotiates",
  "AI follows up automatically",
  "launch campaign",
  "activate provider",
  "activate Twilio",
  "activate email",
  "activate SMS",
  "create execution queue",
  "create runtime job",
  "create polling loop",
  "create background worker",
  "autonomous routing",
  "autonomous outreach",
  "autonomous negotiation",
  "autonomous escalation",
] as const;

export const r67GovernanceBoundaryRules = [
  "Governance stop signals outrank automation readiness, execution readiness, revenue opportunity, lead quality, acquisition priority, disposition priority, operator priority, buyer readiness, stale workflow pressure, urgency, workload pressure, AI recommendation, and approval status.",
  "Automation readiness never means execute now, send now, call now, launch campaign, activate provider, start workflow, run automation, route automatically, or escalate automatically.",
  "Automation readiness only means future governance review may be required while automation, provider activation, runtime activation, polling, and execution remain blocked.",
  "Human review remains required and separate from any future controlled execution path.",
] as const;

export const r67PermissionBoundaryRules = [
  "Intelligence signals never grant permission.",
  "Approval signals never grant execution.",
  "Readiness signals never grant execution.",
  "Queue priority signals never grant execution.",
  "Urgency signals never grant execution.",
  "Revenue opportunity signals never grant execution.",
  "Scores, recommendations, and priorities remain advisory-only review labels.",
] as const;

export const r67FailClosedAutomationRules = [
  "If any permission boundary is ambiguous, automation remains blocked.",
  "If any governance stop signal is present, all readiness and priority labels remain subordinate.",
  "If provider, runtime, polling, campaign, or execution intent appears, the result must be blocked.",
  "If approval is present without separate explicit future execution authorization, execution remains forbidden.",
] as const;

export const r67FutureUiBoundaryNotes = [
  "Future UI may show read-only automation-last governance status only.",
  "Future UI must not include buttons, execution controls, provider controls, send controls, workflow controls, or approval-to-send controls.",
  "Future UI must preserve semantic headings, readable labels, visible governance warnings, and text-based status meaning.",
] as const;

export type R67AutomationLastScopeStatus =
  | "automation_last_scope_blocked"
  | "operator_review_required"
  | "automation_last_scope_ready";

export type R67AutomationLastScopeInput = {
  doctrineReviewed?: boolean;
  permissionBoundariesReviewed?: boolean;
  governanceStopDominanceReviewed?: boolean;
  forbiddenSemanticsReviewed?: boolean;
  failClosedRulesReviewed?: boolean;
  futureUiBoundariesReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  automationRequested?: boolean;
  executionRequested?: boolean;
  providerActivationRequested?: boolean;
  runtimeActivationRequested?: boolean;
  pollingRequested?: boolean;
  campaignRequested?: boolean;
  approvalGrantsExecutionRequested?: boolean;
  intelligenceGrantsPermissionRequested?: boolean;
  readinessGrantsExecutionRequested?: boolean;
  queueGrantsExecutionRequested?: boolean;
  urgencyGrantsExecutionRequested?: boolean;
  revenueGrantsExecutionRequested?: boolean;
  hiddenExecutionAffordanceRequested?: boolean;
};

export type R67AutomationLastScopeResult = {
  phase: "R67A";
  status: R67AutomationLastScopeStatus;
  safetyFlags: typeof r67AutomationLastSafetyFlags;
  allowedConcepts: typeof r67AllowedAutomationLastConcepts;
  forbiddenSemantics: typeof r67ForbiddenAutomationSemantics;
  governanceBoundaryRules: typeof r67GovernanceBoundaryRules;
  permissionBoundaryRules: typeof r67PermissionBoundaryRules;
  failClosedAutomationRules: typeof r67FailClosedAutomationRules;
  futureUiBoundaryNotes: typeof r67FutureUiBoundaryNotes;
  blockedReasons: string[];
  missingReviewAreas: string[];
  nextPhase: "R67B - Automation Drift / Permission Risk Audit";
};

const requiredReviewAreas: Array<[keyof R67AutomationLastScopeInput, string]> = [
  ["doctrineReviewed", "automation-last doctrine"],
  ["permissionBoundariesReviewed", "permission boundaries"],
  ["governanceStopDominanceReviewed", "governance-stop dominance"],
  ["forbiddenSemanticsReviewed", "forbidden automation semantics"],
  ["failClosedRulesReviewed", "fail-closed automation rules"],
  ["futureUiBoundariesReviewed", "future UI boundaries"],
  ["operatorReviewCompleted", "operator review"],
];

const blockedReasons: Array<[keyof R67AutomationLastScopeInput, string]> = [
  ["automationRequested", "automation remains forbidden"],
  ["executionRequested", "execution remains forbidden"],
  ["providerActivationRequested", "provider activation remains forbidden"],
  ["runtimeActivationRequested", "runtime activation remains forbidden"],
  ["pollingRequested", "polling remains forbidden"],
  ["campaignRequested", "campaign activation remains forbidden"],
  ["approvalGrantsExecutionRequested", "approval cannot grant execution"],
  ["intelligenceGrantsPermissionRequested", "intelligence cannot grant permission"],
  ["readinessGrantsExecutionRequested", "readiness cannot grant execution"],
  ["queueGrantsExecutionRequested", "queue priority cannot grant execution"],
  ["urgencyGrantsExecutionRequested", "urgency cannot grant execution"],
  ["revenueGrantsExecutionRequested", "revenue opportunity cannot grant execution"],
  ["hiddenExecutionAffordanceRequested", "hidden execution affordances are forbidden"],
];

export function assertR67AutomationLastScopeInvariants(result: R67AutomationLastScopeResult): void {
  const flags = result.safetyFlags;
  if (!flags.readOnly || !flags.advisoryOnly || !flags.simulationOnly) {
    throw new Error("R67A must remain read-only, advisory-only, and simulation-only");
  }
  if (
    flags.providerCalled ||
    flags.sent ||
    flags.persistenceAllowedNow ||
    flags.pollingAllowed ||
    flags.runtimeActivationAllowed ||
    flags.providerActivationAllowed ||
    flags.approvalGrantsExecution ||
    flags.automationAllowedNow ||
    flags.executionAllowedNow
  ) {
    throw new Error("R67A cannot authorize execution, automation, provider activation, runtime activation, polling, persistence, sending, or approval-to-execution");
  }
  if (!result.permissionBoundaryRules.includes("Approval signals never grant execution.")) {
    throw new Error("R67A must preserve approval-is-not-execution");
  }
}

export function createR67AutomationLastGovernanceScopeContract(
  input: R67AutomationLastScopeInput = {},
): R67AutomationLastScopeResult {
  const activeBlockedReasons = blockedReasons.filter(([key]) => input[key]).map(([, reason]) => reason);
  const missingReviewAreas = requiredReviewAreas.filter(([key]) => !input[key]).map(([, label]) => label);
  const status: R67AutomationLastScopeStatus =
    activeBlockedReasons.length > 0
      ? "automation_last_scope_blocked"
      : missingReviewAreas.length > 0
        ? "operator_review_required"
        : "automation_last_scope_ready";

  const result: R67AutomationLastScopeResult = {
    phase: "R67A",
    status,
    safetyFlags: r67AutomationLastSafetyFlags,
    allowedConcepts: r67AllowedAutomationLastConcepts,
    forbiddenSemantics: r67ForbiddenAutomationSemantics,
    governanceBoundaryRules: r67GovernanceBoundaryRules,
    permissionBoundaryRules: r67PermissionBoundaryRules,
    failClosedAutomationRules: r67FailClosedAutomationRules,
    futureUiBoundaryNotes: r67FutureUiBoundaryNotes,
    blockedReasons: activeBlockedReasons,
    missingReviewAreas,
    nextPhase: "R67B - Automation Drift / Permission Risk Audit",
  };
  assertR67AutomationLastScopeInvariants(result);
  return result;
}

export function summarizeR67AutomationLastGovernanceScope(result: R67AutomationLastScopeResult): string {
  assertR67AutomationLastScopeInvariants(result);
  return `R67A ${result.status}: automation remains last; ${result.allowedConcepts.length} governance concepts are allowed, ${result.forbiddenSemantics.length} automation semantics are forbidden, and intelligence, approval, readiness, queue, urgency, and revenue signals cannot grant execution.`;
}
