export type R66ControlledExecutionScopeStatus =
  | "controlled_execution_scope_blocked"
  | "operator_review_required"
  | "controlled_execution_scope_ready";

export type R66ControlledExecutionConcept =
  | "governance_stop_dominance"
  | "controlled_execution_doctrine"
  | "execution_eligibility_review"
  | "human_approval_required"
  | "approval_does_not_equal_execution"
  | "provider_activation_blocked"
  | "runtime_activation_blocked"
  | "fail_closed_execution_boundary"
  | "simulation_first_requirement"
  | "audit_before_action_requirement"
  | "manual_operator_confirmation_required"
  | "permission_separation"
  | "no_implicit_execution"
  | "no_hidden_execution_affordance"
  | "no_autonomous_escalation"
  | "future_execution_gate_visibility"
  | "blocked_action_explanation"
  | "execution_readiness_advisory_only";

export type R66ForbiddenExecutionSemantic =
  | "send SMS"
  | "send email"
  | "call seller"
  | "call buyer"
  | "activate Twilio"
  | "activate provider"
  | "launch campaign"
  | "execute workflow"
  | "run automation"
  | "create execution queue"
  | "auto approve"
  | "auto escalate"
  | "approval sends message"
  | "approval triggers provider"
  | "approval starts workflow"
  | "autonomous outreach"
  | "autonomous negotiation"
  | "autonomous routing"
  | "runtime activation"
  | "polling"
  | "persistence activation"
  | "background jobs";

export type R66ScopeInput = {
  r65fLockdownReviewed?: boolean;
  controlledExecutionConceptsReviewed?: boolean;
  approvalSeparationReviewed?: boolean;
  providerBoundaryReviewed?: boolean;
  runtimeBoundaryReviewed?: boolean;
  simulationFirstReviewed?: boolean;
  failClosedReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  futureUiReviewed?: boolean;
  accessibilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  executionRequested?: boolean;
  providerActivationRequested?: boolean;
  twilioActivationRequested?: boolean;
  emailSmsRequested?: boolean;
  campaignLaunchRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  runtimeActivationRequested?: boolean;
  backgroundJobRequested?: boolean;
  executionQueueRequested?: boolean;
  automationRequested?: boolean;
  autonomousOutreachRequested?: boolean;
  autonomousNegotiationRequested?: boolean;
  autonomousRoutingRequested?: boolean;
  approvalGrantsExecution?: boolean;
  readOnly?: boolean;
  advisoryOnly?: boolean;
  simulationOnly?: boolean;
  providerCalled?: boolean;
  sent?: boolean;
  persistenceAllowedNow?: boolean;
  pollingAllowed?: boolean;
  runtimeActivationAllowed?: boolean;
  providerActivationAllowed?: boolean;
  uiImplementationAllowedNow?: boolean;
  extraScopeNotes?: string[];
};

export type R66ScopeSafetyFlags = {
  readOnly: true;
  advisoryOnly: true;
  simulationOnly: true;
  providerCalled: false;
  sent: false;
  persistenceAllowedNow: false;
  pollingAllowed: false;
  runtimeActivationAllowed: false;
  providerActivationAllowed: false;
  approvalGrantsExecution: false;
  uiImplementationAllowedNow: false;
  executionAllowedNow: false;
  campaignActivationAllowed: false;
  backgroundJobsAllowed: false;
};

export type R66ScopeResult = R66ScopeSafetyFlags & {
  phase: "R66A";
  surface: "controlled_execution_scope";
  scopeStatus: R66ControlledExecutionScopeStatus;
  allowedConcepts: R66ControlledExecutionConcept[];
  forbiddenSemantics: R66ForbiddenExecutionSemantic[];
  deterministicScope: {
    phase: "R66A";
    implementationAllowed: false;
    executionAllowed: false;
    providerActivationAllowed: false;
    runtimeActivationAllowed: false;
    pollingAllowed: false;
    persistenceAllowed: false;
    campaignAllowed: false;
    backgroundJobsAllowed: false;
  };
  governanceBoundaries: string[];
  approvalSeparationRules: string[];
  providerActivationBoundaryRules: string[];
  runtimeActivationBoundaryRules: string[];
  simulationFirstRules: string[];
  failClosedRules: string[];
  futureUiBoundaryNotes: string[];
  deterministicInvariants: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R66ScopeSafetyFlags;
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R66ScopeInvariantCheck = { passed: boolean; warningCodes: string[] };

const safetyFlags: R66ScopeSafetyFlags = {
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
  uiImplementationAllowedNow: false,
  executionAllowedNow: false,
  campaignActivationAllowed: false,
  backgroundJobsAllowed: false,
};

const allowedConcepts: R66ControlledExecutionConcept[] = [
  "governance_stop_dominance",
  "controlled_execution_doctrine",
  "execution_eligibility_review",
  "human_approval_required",
  "approval_does_not_equal_execution",
  "provider_activation_blocked",
  "runtime_activation_blocked",
  "fail_closed_execution_boundary",
  "simulation_first_requirement",
  "audit_before_action_requirement",
  "manual_operator_confirmation_required",
  "permission_separation",
  "no_implicit_execution",
  "no_hidden_execution_affordance",
  "no_autonomous_escalation",
  "future_execution_gate_visibility",
  "blocked_action_explanation",
  "execution_readiness_advisory_only",
];

const forbiddenSemantics: R66ForbiddenExecutionSemantic[] = [
  "send SMS",
  "send email",
  "call seller",
  "call buyer",
  "activate Twilio",
  "activate provider",
  "launch campaign",
  "execute workflow",
  "run automation",
  "create execution queue",
  "auto approve",
  "auto escalate",
  "approval sends message",
  "approval triggers provider",
  "approval starts workflow",
  "autonomous outreach",
  "autonomous negotiation",
  "autonomous routing",
  "runtime activation",
  "polling",
  "persistence activation",
  "background jobs",
];

const deterministicScope: R66ScopeResult["deterministicScope"] = {
  phase: "R66A",
  implementationAllowed: false,
  executionAllowed: false,
  providerActivationAllowed: false,
  runtimeActivationAllowed: false,
  pollingAllowed: false,
  persistenceAllowed: false,
  campaignAllowed: false,
  backgroundJobsAllowed: false,
};

const governanceBoundaries = [
  "Governance stop signals must outrank revenue opportunity, lead quality, acquisition readiness, disposition readiness, operator priority, execution eligibility, urgency, workload pressure, and stale workflow pressure.",
  "Controlled execution readiness is advisory only and never means execute now, send now, activate provider, launch workflow, contact seller, contact buyer, or start automation.",
  "Execution remains blocked until a future explicitly authorized implementation phase defines separate human approval, operator confirmation, provider audit, simulation evidence, and fail-closed controls.",
];

const approvalSeparationRules = [
  "Human approval is a review signal, not execution permission.",
  "Approval cannot send messages, trigger providers, start workflows, create queues, launch campaigns, or run automation.",
  "Any future execution gate must require a separate operator confirmation after approval and after governance checks.",
];

const providerActivationBoundaryRules = [
  "Provider and Twilio activation remain blocked.",
  "No provider credentials, outbound provider calls, email/SMS systems, call systems, or provider tests are authorized.",
  "Provider readiness may be described only as blocked future eligibility visibility.",
];

const runtimeActivationBoundaryRules = [
  "Runtime activation, polling, background jobs, execution queues, and workflow runners remain blocked.",
  "No persistence, scheduled jobs, queue workers, or hidden state machines may be introduced by R66A.",
];

const simulationFirstRules = [
  "Future execution consideration must begin with simulation-only evidence.",
  "Simulation output cannot mutate data, contact anyone, call providers, create jobs, or grant execution permission.",
  "Simulation-first review must fail closed when governance, provider, audit, or operator confirmation requirements are incomplete.",
];

const failClosedRules = [
  "Missing operator review keeps the scope in operator_review_required status.",
  "Any requested execution, provider activation, Twilio activation, email/SMS, campaign, polling, persistence, runtime activation, background job, execution queue, automation, autonomous outreach, autonomous negotiation, autonomous routing, or approval-grants-execution blocks the scope.",
  "Unsafe input flags are never echoed into output safety flags.",
];

const futureUiBoundaryNotes = [
  "Future UI may show controlled execution readiness as read-only advisory visibility only.",
  "Future UI must not add buttons, send controls, provider controls, approval-to-send controls, runtime activation, polling, campaign controls, or execution queue controls.",
  "Future UI must use semantic headings, readable labels, screen-reader-friendly summaries, text-based status meaning, no color-only meaning, no motion dependency, no focus movement, no auto-refresh, and no polling.",
];

const deterministicInvariants = [
  "readOnly:true",
  "advisoryOnly:true",
  "simulationOnly:true",
  "providerCalled:false",
  "sent:false",
  "persistenceAllowedNow:false",
  "pollingAllowed:false",
  "runtimeActivationAllowed:false",
  "providerActivationAllowed:false",
  "approvalGrantsExecution:false",
  "uiImplementationAllowedNow:false",
  "executionAllowedNow:false",
  "campaignActivationAllowed:false",
  "backgroundJobsAllowed:false",
];

function addUnique(list: string[], value: string) {
  const trimmed = value.trim();
  if (trimmed && !list.includes(trimmed)) list.push(trimmed.length <= 180 ? trimmed : `${trimmed.slice(0, 180)}...`);
}

function hasForbiddenRequest(input: R66ScopeInput) {
  return Boolean(
    input.executionRequested ||
      input.providerActivationRequested ||
      input.twilioActivationRequested ||
      input.emailSmsRequested ||
      input.campaignLaunchRequested ||
      input.pollingRequested ||
      input.persistenceRequested ||
      input.runtimeActivationRequested ||
      input.backgroundJobRequested ||
      input.executionQueueRequested ||
      input.automationRequested ||
      input.autonomousOutreachRequested ||
      input.autonomousNegotiationRequested ||
      input.autonomousRoutingRequested ||
      input.approvalGrantsExecution ||
      input.readOnly === false ||
      input.advisoryOnly === false ||
      input.simulationOnly === false ||
      input.providerCalled ||
      input.sent ||
      input.persistenceAllowedNow ||
      input.pollingAllowed ||
      input.runtimeActivationAllowed ||
      input.providerActivationAllowed ||
      input.uiImplementationAllowedNow,
  );
}

export function assertR66ControlledExecutionScopeInvariants(result: Pick<R66ScopeResult, keyof R66ScopeSafetyFlags>): R66ScopeInvariantCheck {
  const warningCodes: string[] = [];
  if (result.readOnly !== true) warningCodes.push("read_only_required");
  if (result.advisoryOnly !== true) warningCodes.push("advisory_only_required");
  if (result.simulationOnly !== true) warningCodes.push("simulation_only_required");
  if (result.providerCalled !== false) warningCodes.push("provider_called_must_be_false");
  if (result.sent !== false) warningCodes.push("sent_must_be_false");
  if (result.persistenceAllowedNow !== false) warningCodes.push("persistence_not_allowed_now");
  if (result.pollingAllowed !== false) warningCodes.push("polling_not_allowed");
  if (result.runtimeActivationAllowed !== false) warningCodes.push("runtime_activation_not_allowed");
  if (result.providerActivationAllowed !== false) warningCodes.push("provider_activation_allowed_must_be_false");
  if (result.approvalGrantsExecution !== false) warningCodes.push("approval_grants_execution_must_be_false");
  if (result.uiImplementationAllowedNow !== false) warningCodes.push("ui_implementation_not_allowed_now");
  if (result.executionAllowedNow !== false) warningCodes.push("execution_not_allowed_now");
  if (result.campaignActivationAllowed !== false) warningCodes.push("campaign_activation_not_allowed");
  if (result.backgroundJobsAllowed !== false) warningCodes.push("background_jobs_not_allowed");
  return { passed: warningCodes.length === 0, warningCodes };
}

export function summarizeR66ControlledExecutionScope(result: R66ScopeResult) {
  const invariantCheck = assertR66ControlledExecutionScopeInvariants(result);
  return `R66A ${result.surface} status is ${result.scopeStatus}. ${result.allowedConcepts.length} controlled execution concepts and ${result.forbiddenSemantics.length} forbidden execution semantics are scoped. Invariants ${invariantCheck.passed ? "passed" : "failed"}. This contract cannot authorize execution, providers, Twilio, email/SMS, campaigns, polling, persistence, runtime activation, background jobs, automation, autonomous routing, or approval-to-execution.`;
}

export function createR66ControlledExecutionScopeContract(input: R66ScopeInput = {}): R66ScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes: string[] = [];
  for (const note of input.extraScopeNotes ?? []) addUnique(scopeNotes, note);

  addUnique(warningCodes, "r66a_scope_contract_only");
  if (Object.keys(input).length === 0) addUnique(warningCodes, "input_missing");
  if (input.r65fLockdownReviewed !== true) addUnique(warningCodes, "r65f_lockdown_review_required");
  if (input.controlledExecutionConceptsReviewed !== true) addUnique(warningCodes, "controlled_execution_concepts_review_required");
  if (input.approvalSeparationReviewed !== true) addUnique(warningCodes, "approval_separation_review_required");
  if (input.providerBoundaryReviewed !== true) addUnique(warningCodes, "provider_boundary_review_required");
  if (input.runtimeBoundaryReviewed !== true) addUnique(warningCodes, "runtime_boundary_review_required");
  if (input.simulationFirstReviewed !== true) addUnique(warningCodes, "simulation_first_review_required");
  if (input.failClosedReviewed !== true) addUnique(warningCodes, "fail_closed_review_required");
  if (input.governanceBoundaryReviewed !== true) addUnique(warningCodes, "governance_boundary_review_required");
  if (input.futureUiReviewed !== true) addUnique(warningCodes, "future_ui_review_required");
  if (input.accessibilityReviewed !== true) addUnique(warningCodes, "accessibility_review_required");
  if (input.operatorReviewCompleted !== true) addUnique(warningCodes, "operator_review_required");

  const rejectionMap: Array<[boolean | undefined, string]> = [
    [input.executionRequested, "execution_rejected"],
    [input.providerActivationRequested, "provider_activation_rejected"],
    [input.twilioActivationRequested, "twilio_activation_rejected"],
    [input.emailSmsRequested, "email_sms_rejected"],
    [input.campaignLaunchRequested, "campaign_launch_rejected"],
    [input.pollingRequested, "polling_rejected"],
    [input.persistenceRequested, "persistence_rejected"],
    [input.runtimeActivationRequested, "runtime_activation_rejected"],
    [input.backgroundJobRequested, "background_job_rejected"],
    [input.executionQueueRequested, "execution_queue_rejected"],
    [input.automationRequested, "automation_rejected"],
    [input.autonomousOutreachRequested, "autonomous_outreach_rejected"],
    [input.autonomousNegotiationRequested, "autonomous_negotiation_rejected"],
    [input.autonomousRoutingRequested, "autonomous_routing_rejected"],
    [input.approvalGrantsExecution, "approval_grants_execution_rejected"],
  ];
  for (const [flag, code] of rejectionMap) if (flag === true) addUnique(warningCodes, code);
  if (input.providerCalled === true) addUnique(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addUnique(warningCodes, "sent_must_be_false");
  if (input.pollingAllowed === true) addUnique(warningCodes, "polling_not_allowed");
  if (input.runtimeActivationAllowed === true) addUnique(warningCodes, "runtime_activation_not_allowed");
  if (input.providerActivationAllowed === true) addUnique(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.uiImplementationAllowedNow === true) addUnique(warningCodes, "ui_implementation_not_allowed_now");
  for (const warningCode of warningCodes) if (warningCode.endsWith("_rejected") || warningCode.endsWith("_must_be_false") || warningCode.endsWith("_not_allowed_now")) addUnique(rejectionReasons, warningCode);

  const missingReview =
    input.r65fLockdownReviewed !== true ||
    input.controlledExecutionConceptsReviewed !== true ||
    input.approvalSeparationReviewed !== true ||
    input.providerBoundaryReviewed !== true ||
    input.runtimeBoundaryReviewed !== true ||
    input.simulationFirstReviewed !== true ||
    input.failClosedReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.futureUiReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.operatorReviewCompleted !== true;
  const scopeStatus: R66ControlledExecutionScopeStatus = hasForbiddenRequest(input)
    ? "controlled_execution_scope_blocked"
    : missingReview
      ? "operator_review_required"
      : "controlled_execution_scope_ready";

  const result: R66ScopeResult = {
    phase: "R66A",
    surface: "controlled_execution_scope",
    scopeStatus,
    allowedConcepts,
    forbiddenSemantics,
    deterministicScope,
    governanceBoundaries,
    approvalSeparationRules,
    providerActivationBoundaryRules,
    runtimeActivationBoundaryRules,
    simulationFirstRules,
    failClosedRules,
    futureUiBoundaryNotes,
    deterministicInvariants,
    warningCodes,
    rejectionReasons,
    safetyFlags,
    operatorReviewRequired: input.operatorReviewCompleted !== true,
    scopeNotes,
    nextSuggestedPhase: "R66B - Controlled Execution Risk / Permission Boundary Audit",
    summary: "R66A controlled execution scope contract only.",
    ...safetyFlags,
  };
  return { ...result, summary: summarizeR66ControlledExecutionScope(result) };
}
