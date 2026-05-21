export type R52UiIntegrationStatus =
  | "ui_integration_planning_blocked"
  | "operator_review_required"
  | "ui_integration_plan_ready";

export type R52UiIntegrationPriority = "highest_roi" | "safe_later" | "avoid";

export type R52UiEntryPoint =
  | "dashboard_overview"
  | "lead_detail"
  | "approval_queue"
  | "readiness_panel"
  | "revenue_cockpit"
  | "buyer_review"
  | "seller_call_outcomes";

export type R52UiHumanReviewClass =
  | "must_preserve_human_review"
  | "may_be_assisted_with_review"
  | "must_never_appear_automated";

export type R52UiIntegrationWarningCode =
  | "r52h_ui_integration_planning_contract_only"
  | "input_missing"
  | "entry_point_review_required"
  | "guidance_review_required"
  | "revenue_presentation_review_required"
  | "governance_presentation_review_required"
  | "accessibility_review_required"
  | "operator_review_required"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "workflow_mutation_rejected"
  | "persistence_activation_rejected"
  | "advisory_to_permission_rejected"
  | "activation_executed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "live_execution_allowed_must_be_false"
  | "sent_must_be_false"
  | "provider_called_must_be_false"
  | "can_send_now_must_be_false"
  | "simulation_only_required"
  | "live_test_ready_must_be_false"
  | "persistence_not_allowed_now";

export type R52ManualRevenueSopUiIntegrationInput = {
  entryPointsReviewed?: boolean;
  guidancePatternsReviewed?: boolean;
  revenuePresentationReviewed?: boolean;
  governancePresentationReviewed?: boolean;
  accessibilityStrategyReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  workflowMutationRequested?: boolean;
  persistenceActivationRequested?: boolean;
  advisoryConvertedToPermission?: boolean;
  activationExecuted?: boolean;
  providerActivationAllowed?: boolean;
  liveExecutionAllowed?: boolean;
  sent?: boolean;
  providerCalled?: boolean;
  canSendNow?: boolean;
  simulationOnly?: boolean;
  liveTestReady?: boolean;
  persistenceAllowedNow?: boolean;
  extraUiPlanningNotes?: string[];
};

export type R52UiIntegrationCandidate = {
  entryPoint: R52UiEntryPoint;
  priority: R52UiIntegrationPriority;
  guidanceType: string;
  operatorValue: string;
  safetyConstraint: string;
};

export type R52DangerousUiPattern = {
  pattern: string;
  reason: string;
};

export type R52UiHumanReviewPreservationItem = {
  workflow: string;
  classification: R52UiHumanReviewClass;
  reason: string;
};

export type R52ManualRevenueSopUiIntegrationResult = {
  uiIntegrationStatus: R52UiIntegrationStatus;
  uiIntegrationDoctrine: string;
  entryPointPlan: R52UiIntegrationCandidate[];
  safeGuidanceTypes: string[];
  dangerousUiPatterns: R52DangerousUiPattern[];
  revenuePriorityPresentation: R52UiIntegrationCandidate[];
  governanceVisibilityPresentation: R52UiIntegrationCandidate[];
  accessibilityLowCognitiveLoadStrategy: string[];
  humanReviewPreservation: R52UiHumanReviewPreservationItem[];
  implementationOrder: string[];
  roiVsOverbuildFindings: string[];
  operatorReviewRequired: boolean;
  warningCodes: string[];
  operatorNotes: string[];
  summary: string;
  activationExecuted: false;
  providerActivationAllowed: false;
  liveExecutionAllowed: false;
  sent: false;
  providerCalled: false;
  canSendNow: false;
  simulationOnly: true;
  liveTestReady: false;
  persistenceAllowedNow: false;
};

export type R52ManualRevenueSopUiIntegrationInvariantCheck = {
  passed: boolean;
  warningCodes: Array<
    | "activation_executed_must_be_false"
    | "provider_activation_allowed_must_be_false"
    | "live_execution_allowed_must_be_false"
    | "sent_must_be_false"
    | "provider_called_must_be_false"
    | "can_send_now_must_be_false"
    | "simulation_only_required"
    | "live_test_ready_must_be_false"
    | "persistence_not_allowed_now"
  >;
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

function normalizeText(value?: string | null) {
  return value?.trim() ?? "";
}

function boundText(value?: string | null) {
  const normalized = normalizeText(value);

  if (normalized.length <= maxTextLength) return normalized;

  return `${normalized.slice(0, maxTextLength)}...`;
}

function boundSummary(value: string) {
  if (value.length <= maxSummaryLength) return value;

  return `${value.slice(0, maxSummaryLength)}...`;
}

function addUnique(list: string[], value: string) {
  const bounded = boundText(value);

  if (bounded && !list.includes(bounded) && list.length < maxListItems) {
    list.push(bounded);
  }
}

function addWarning(warningCodes: string[], warningCode: R52UiIntegrationWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function hasForbiddenUiIntegrationRequest(input: R52ManualRevenueSopUiIntegrationInput) {
  return (
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.workflowMutationRequested === true ||
    input.persistenceActivationRequested === true ||
    input.advisoryConvertedToPermission === true ||
    input.activationExecuted === true ||
    input.providerActivationAllowed === true ||
    input.liveExecutionAllowed === true ||
    input.sent === true ||
    input.providerCalled === true ||
    input.canSendNow === true ||
    input.liveTestReady === true ||
    input.persistenceAllowedNow === true
  );
}

const entryPointPlan: R52UiIntegrationCandidate[] = [
  {
    entryPoint: "dashboard_overview",
    priority: "highest_roi",
    guidanceType: "Manual-only workday banner and next safe action",
    operatorValue: "Gives the operator the day-start doctrine and immediate manual sequence.",
    safetyConstraint: "Must not add activation, automation, send, polling, or provider controls.",
  },
  {
    entryPoint: "readiness_panel",
    priority: "highest_roi",
    guidanceType: "Governance and readiness explanation",
    operatorValue: "Connects system readiness to manual-only operating guidance.",
    safetyConstraint: "Must remain advisory and must not change canSendNow or live readiness flags.",
  },
  {
    entryPoint: "lead_detail",
    priority: "highest_roi",
    guidanceType: "Lead-specific do-not-proceed and next review prompts",
    operatorValue: "Shows source, DNC, missing data, seller call, and follow-up blockers near the work.",
    safetyConstraint: "Must not auto-contact, auto-approve, or mutate lead workflow state.",
  },
  {
    entryPoint: "approval_queue",
    priority: "highest_roi",
    guidanceType: "Human-review preserved approval context",
    operatorValue: "Reinforces that approval state changes still do not send SMS or email.",
    safetyConstraint: "Must keep approval separate from provider execution.",
  },
  {
    entryPoint: "revenue_cockpit",
    priority: "safe_later",
    guidanceType: "Near-close and bottleneck visibility",
    operatorValue: "Helps operators see where manual effort can move revenue.",
    safetyConstraint: "Must label assumptions and avoid invented property facts.",
  },
  {
    entryPoint: "buyer_review",
    priority: "safe_later",
    guidanceType: "Disposition package completeness guidance",
    operatorValue: "Shows missing valuation, contract, access, photo, buyer, and package fields.",
    safetyConstraint: "Must preserve human package review before buyer-facing work.",
  },
  {
    entryPoint: "seller_call_outcomes",
    priority: "highest_roi",
    guidanceType: "Manual call outcome capture guidance",
    operatorValue: "Keeps seller communication disciplined around motivation, condition, timeline, and compliance notes.",
    safetyConstraint: "Must never imply recording an outcome sends or schedules automated outreach.",
  },
];

const safeGuidanceTypes = [
  "Manual-only banners.",
  "Governance reminders.",
  "Next-safe-action cards.",
  "Do-not-proceed blocker warnings.",
  "Workflow sequencing hints.",
  "Review-required notices.",
  "Dry-run-only reminders.",
];

const dangerousUiPatterns: R52DangerousUiPattern[] = [
  {
    pattern: "Activation-looking controls",
    reason: "Buttons labeled enable, activate, start, autopilot, or live can imply execution permission.",
  },
  {
    pattern: "Misleading automation language",
    reason: "AI autopilot or auto-close language can undermine manual operator control.",
  },
  {
    pattern: "Polling-based guidance",
    reason: "Repeated refresh loops can look or behave like uncontrolled runtime automation.",
  },
  {
    pattern: "Auto-refresh mutation patterns",
    reason: "Guidance surfaces must not mutate lead, approval, buyer, or revenue state.",
  },
  {
    pattern: "Progress persistence before audit controls",
    reason: "Persisting workflow progress requires R50 audit persistence controls before implementation.",
  },
  {
    pattern: "Inline override controls",
    reason: "Blockers should not be paired with unsafe bypass or override actions.",
  },
];

const revenuePriorityPresentation: R52UiIntegrationCandidate[] = [
  {
    entryPoint: "dashboard_overview",
    priority: "highest_roi",
    guidanceType: "Work-first lead list summary",
    operatorValue: "Shows highest-value and overdue leads with blockers.",
    safetyConstraint: "Must not auto-contact or auto-escalate.",
  },
  {
    entryPoint: "lead_detail",
    priority: "highest_roi",
    guidanceType: "Missing critical data panel",
    operatorValue: "Shows missing source, contact, address, motivation, condition, timeline, ARV, and repairs.",
    safetyConstraint: "Must not invent property facts and must label assumptions.",
  },
  {
    entryPoint: "revenue_cockpit",
    priority: "highest_roi",
    guidanceType: "Near-close and bottleneck board",
    operatorValue: "Shows contract, title, buyer, disposition, and package blockers.",
    safetyConstraint: "Must remain a manual review surface with no auto-stage movement.",
  },
  {
    entryPoint: "buyer_review",
    priority: "safe_later",
    guidanceType: "Incomplete disposition package checklist",
    operatorValue: "Helps prepare buyer-facing review packages safely.",
    safetyConstraint: "Must require human review before sharing.",
  },
];

const governanceVisibilityPresentation: R52UiIntegrationCandidate[] = [
  {
    entryPoint: "readiness_panel",
    priority: "highest_roi",
    guidanceType: "Simulation-only status",
    operatorValue: "Clarifies that the system is safe for manual workflow only.",
    safetyConstraint: "Must keep providerActivationAllowed, liveExecutionAllowed, and canSendNow false.",
  },
  {
    entryPoint: "dashboard_overview",
    priority: "highest_roi",
    guidanceType: "Provider-disabled and runtime-blocked reminders",
    operatorValue: "Keeps the live-risk boundary visible during daily work.",
    safetyConstraint: "Must not expose provider toggles.",
  },
  {
    entryPoint: "approval_queue",
    priority: "highest_roi",
    guidanceType: "Manual-review-required status",
    operatorValue: "Prevents approval screens from being confused with sending screens.",
    safetyConstraint: "Must not call send-sms, Twilio, or provider routes.",
  },
  {
    entryPoint: "readiness_panel",
    priority: "safe_later",
    guidanceType: "Audit persistence disabled status",
    operatorValue: "Explains that future audit persistence is planned but inactive.",
    safetyConstraint: "Must never set persistenceAllowedNow true.",
  },
];

const accessibilityLowCognitiveLoadStrategy = [
  "Use one primary manual next action per surface.",
  "Separate blockers, warnings, and informational guidance visually and textually.",
  "Make status meaning available as text, not color alone.",
  "Keep keyboard focus order aligned with the operator work sequence.",
  "Avoid motion-dependent state changes and auto-refreshing guidance.",
  "Use concise headings and predictable placement for readiness, blocker, and next-action areas.",
];

const humanReviewPreservation: R52UiHumanReviewPreservationItem[] = [
  {
    workflow: "Seller outreach and follow-up",
    classification: "must_preserve_human_review",
    reason: "Seller communication requires DNC, opt-out, approval, claims, and context review.",
  },
  {
    workflow: "Buyer-facing package sharing",
    classification: "must_preserve_human_review",
    reason: "Disposition work requires package completeness, valuation review, contract status, and operator approval.",
  },
  {
    workflow: "Lead prioritization visibility",
    classification: "may_be_assisted_with_review",
    reason: "Priority guidance can be assisted if it remains read-only and never contacts or mutates leads.",
  },
  {
    workflow: "Provider sending and runtime automation",
    classification: "must_never_appear_automated",
    reason: "The UI must not imply autonomous execution or live provider capability.",
  },
];

const implementationOrder = [
  "Plan read-only SOP visibility surfaces and copy before component changes.",
  "Add manual-only and simulation-only banners to overview/readiness surfaces.",
  "Add next-safe-action guidance without mutation controls.",
  "Add blocker visibility to lead detail, approval queue, and revenue surfaces.",
  "Add revenue-priority presentation for work-first, overdue, near-close, and incomplete-package work.",
  "Implement accessibility improvements for keyboard order, focus visibility, and non-color-only indicators.",
  "Add observability around read-only UI errors before expanding workflow surfaces.",
  "Implement audit persistence only after R50 controls become runtime-safe.",
  "Revisit controlled runtime planning only after SOP visibility, accessibility, audit, and observability are proven.",
];

const roiVsOverbuildFindings = [
  "Highest ROI is clarity at the point of work: next safe action plus blocker reason.",
  "Dashboard-wide SOP banners are useful only if concise and tied to real operator action.",
  "Decorative governance summaries are lower value than explicit blocked states and missing data.",
  "Progress persistence is overbuilt until audit persistence and access controls are operational.",
  "Automation-style controls create more risk than revenue until governance and observability are runtime-proven.",
];

export function assertR52ManualRevenueSopUiIntegrationInvariants(
  result: Pick<
    R52ManualRevenueSopUiIntegrationResult,
    | "activationExecuted"
    | "providerActivationAllowed"
    | "liveExecutionAllowed"
    | "sent"
    | "providerCalled"
    | "canSendNow"
    | "simulationOnly"
    | "liveTestReady"
    | "persistenceAllowedNow"
  >,
): R52ManualRevenueSopUiIntegrationInvariantCheck {
  const warningCodes: R52ManualRevenueSopUiIntegrationInvariantCheck["warningCodes"] = [];

  if (result.activationExecuted !== false) warningCodes.push("activation_executed_must_be_false");
  if (result.providerActivationAllowed !== false) warningCodes.push("provider_activation_allowed_must_be_false");
  if (result.liveExecutionAllowed !== false) warningCodes.push("live_execution_allowed_must_be_false");
  if (result.sent !== false) warningCodes.push("sent_must_be_false");
  if (result.providerCalled !== false) warningCodes.push("provider_called_must_be_false");
  if (result.canSendNow !== false) warningCodes.push("can_send_now_must_be_false");
  if (result.simulationOnly !== true) warningCodes.push("simulation_only_required");
  if (result.liveTestReady !== false) warningCodes.push("live_test_ready_must_be_false");
  if (result.persistenceAllowedNow !== false) warningCodes.push("persistence_not_allowed_now");

  return {
    passed: warningCodes.length === 0,
    warningCodes,
  };
}

export function summarizeR52ManualRevenueSopUiIntegration(result: R52ManualRevenueSopUiIntegrationResult) {
  const invariantCheck = assertR52ManualRevenueSopUiIntegrationInvariants(result);

  return boundSummary(
    `R52H manual revenue SOP UI integration status is ${result.uiIntegrationStatus}. ` +
      `${result.entryPointPlan.length} entry points, ${result.safeGuidanceTypes.length} safe guidance types, ` +
      `${result.dangerousUiPatterns.length} dangerous UI patterns, and ${result.implementationOrder.length} implementation steps are defined. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract is planning-only, advisory-only, simulation-only, and cannot authorize UI mutation, automation, providers, live sending, polling, persistence, or execution.",
  );
}

export function createR52ManualRevenueSopUiIntegrationContract(
  input: R52ManualRevenueSopUiIntegrationInput = {},
): R52ManualRevenueSopUiIntegrationResult {
  const warningCodes: string[] = [];
  const operatorNotes = collectNotes(input.extraUiPlanningNotes);

  addWarning(warningCodes, "r52h_ui_integration_planning_contract_only");
  addWarning(warningCodes, "persistence_not_allowed_now");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.entryPointsReviewed !== true) addWarning(warningCodes, "entry_point_review_required");
  if (input.guidancePatternsReviewed !== true) addWarning(warningCodes, "guidance_review_required");
  if (input.revenuePresentationReviewed !== true) addWarning(warningCodes, "revenue_presentation_review_required");
  if (input.governancePresentationReviewed !== true) addWarning(warningCodes, "governance_presentation_review_required");
  if (input.accessibilityStrategyReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.workflowMutationRequested === true) addWarning(warningCodes, "workflow_mutation_rejected");
  if (input.persistenceActivationRequested === true) addWarning(warningCodes, "persistence_activation_rejected");
  if (input.advisoryConvertedToPermission === true) addWarning(warningCodes, "advisory_to_permission_rejected");
  if (input.activationExecuted === true) addWarning(warningCodes, "activation_executed_must_be_false");
  if (input.providerActivationAllowed === true) addWarning(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.liveExecutionAllowed === true) addWarning(warningCodes, "live_execution_allowed_must_be_false");
  if (input.sent === true) addWarning(warningCodes, "sent_must_be_false");
  if (input.providerCalled === true) addWarning(warningCodes, "provider_called_must_be_false");
  if (input.canSendNow === true) addWarning(warningCodes, "can_send_now_must_be_false");
  if (input.simulationOnly !== true) addWarning(warningCodes, "simulation_only_required");
  if (input.liveTestReady === true) addWarning(warningCodes, "live_test_ready_must_be_false");
  if (input.persistenceAllowedNow === true) addWarning(warningCodes, "persistence_not_allowed_now");

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const uiIntegrationStatus: R52UiIntegrationStatus = hasForbiddenUiIntegrationRequest(input)
    ? "ui_integration_planning_blocked"
    : operatorReviewRequired ||
        input.entryPointsReviewed !== true ||
        input.guidancePatternsReviewed !== true ||
        input.revenuePresentationReviewed !== true ||
        input.governancePresentationReviewed !== true ||
        input.accessibilityStrategyReviewed !== true
      ? "operator_review_required"
      : "ui_integration_plan_ready";

  const result: R52ManualRevenueSopUiIntegrationResult = {
    uiIntegrationStatus,
    uiIntegrationDoctrine:
      "Manual revenue SOP UI integration must make safe operator guidance visible without adding mutation controls, execution controls, polling, providers, or persistence.",
    entryPointPlan,
    safeGuidanceTypes,
    dangerousUiPatterns,
    revenuePriorityPresentation,
    governanceVisibilityPresentation,
    accessibilityLowCognitiveLoadStrategy,
    humanReviewPreservation,
    implementationOrder,
    roiVsOverbuildFindings,
    operatorReviewRequired,
    warningCodes,
    operatorNotes,
    summary: "R52H manual revenue SOP UI integration planning contract only.",
    activationExecuted: false,
    providerActivationAllowed: false,
    liveExecutionAllowed: false,
    sent: false,
    providerCalled: false,
    canSendNow: false,
    simulationOnly: true,
    liveTestReady: false,
    persistenceAllowedNow: false,
  };

  return {
    ...result,
    summary: summarizeR52ManualRevenueSopUiIntegration(result),
  };
}
