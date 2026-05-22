export type R57StuckDealRecoveryUiImplementationScopeStatus =
  | "implementation_scope_blocked"
  | "operator_review_required"
  | "read_only_ui_implementation_scope_ready";

export type R57StuckDealRecoveryAllowedUiPlacement = {
  surface: "existing_dashboard";
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx";
  placement: "dashboard_read_only_revenue_operations_section";
  routeChangesAllowed: false;
  redesignAllowed: false;
  implementationAllowedNow: false;
};

export type R57StuckDealRecoveryAllowedReadOnlyDataSource = {
  source: "existing_read_only_lead_and_deal_review_data";
  allowedDataOnly: string[];
  forbiddenDataSources: string[];
  sourceMutationAllowed: false;
  persistenceAllowed: false;
  pollingAllowed: false;
};

export type R57StuckDealRecoveryAllowedDisplaySection =
  | "stuck_deal_recovery_summary"
  | "revenue_leakage_indicators"
  | "overdue_manual_follow_up_section"
  | "missing_next_step_section"
  | "buyer_readiness_blocker_section"
  | "near_close_friction_section"
  | "missing_critical_data_section"
  | "human_review_required_section"
  | "safe_manual_recovery_guidance";

export type R57StuckDealRecoveryRevenuePriorityOrderItem = {
  order: number;
  section: R57StuckDealRecoveryAllowedDisplaySection;
  renderIntent: string;
  allowedReadOnlySignals: string[];
  requiredSafetyCopy: string;
};

export type R57StuckDealRecoveryForbiddenUiControl =
  | "send now"
  | "auto recover"
  | "auto follow-up"
  | "activate workflow"
  | "bulk recovery"
  | "AI negotiates"
  | "approve and send"
  | "release automation"
  | "start campaign"
  | "retry automatically"
  | "queue execution"
  | "provider activation"
  | "autonomous outreach"
  | "Send SMS"
  | "Send Email"
  | "Start Automation"
  | "Activate Provider"
  | "Run Campaign"
  | "Approve and Send"
  | "Bulk Approve"
  | "Persist Metrics"
  | "Override Governance"
  | "ready to send"
  | "send after approval"
  | "hidden execution affordances";

export type R57StuckDealRecoveryUiImplementationWarningCode =
  | "r57c_stuck_deal_recovery_ui_implementation_scope_contract_only"
  | "input_missing"
  | "r57b_scope_review_required"
  | "placement_review_required"
  | "read_only_data_review_required"
  | "display_section_review_required"
  | "revenue_priority_review_required"
  | "wording_review_required"
  | "governance_boundary_review_required"
  | "accessibility_review_required"
  | "dangerous_pattern_review_required"
  | "operator_review_required"
  | "ui_implementation_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "execution_control_rejected"
  | "redesign_rejected"
  | "autonomous_workflow_rejected"
  | "approval_grants_execution_rejected"
  | "read_only_required"
  | "advisory_only_required"
  | "simulation_only_required"
  | "provider_called_must_be_false"
  | "sent_must_be_false"
  | "persistence_not_allowed_now"
  | "polling_not_allowed"
  | "runtime_activation_not_allowed"
  | "provider_activation_allowed_must_be_false"
  | "approval_grants_execution_must_be_false"
  | "ui_implementation_not_allowed_now";

export type R57StuckDealRecoveryUiImplementationScopeInput = {
  r57bScopeReviewed?: boolean;
  placementReviewed?: boolean;
  readOnlyDataReviewed?: boolean;
  displaySectionsReviewed?: boolean;
  revenuePriorityReviewed?: boolean;
  wordingReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  dangerousPatternsReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequested?: boolean;
  routeChangeRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  executionControlRequested?: boolean;
  redesignRequested?: boolean;
  autonomousWorkflowRequested?: boolean;
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

export type R57StuckDealRecoveryUiImplementationSafetyFlags = {
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
};

export type R57StuckDealRecoveryUiImplementationScopeResult =
  R57StuckDealRecoveryUiImplementationSafetyFlags & {
    phase: "R57C";
    surface: "stuck_deal_recovery_read_only_ui_implementation_scope";
    scopeStatus: R57StuckDealRecoveryUiImplementationScopeStatus;
    requiredSafetyCopy: "Read-only recovery guidance. No provider called, no message sent, no runtime execution.";
    allowedUiPlacement: R57StuckDealRecoveryAllowedUiPlacement;
    allowedReadOnlyDataSource: R57StuckDealRecoveryAllowedReadOnlyDataSource;
    allowedDisplaySections: R57StuckDealRecoveryAllowedDisplaySection[];
    revenuePriorityOrdering: R57StuckDealRecoveryRevenuePriorityOrderItem[];
    safeManualGuidanceWording: string[];
    blockedForbiddenUiControls: R57StuckDealRecoveryForbiddenUiControl[];
    dangerousLanguagePatterns: string[];
    accessibilityRequirements: string[];
    noActionExecutionBoundaries: string[];
    invariantAssertions: string[];
    rejectionReasons: string[];
    safetyFlags: R57StuckDealRecoveryUiImplementationSafetyFlags;
    warningCodes: string[];
    operatorReviewRequired: boolean;
    scopeNotes: string[];
    nextSuggestedPhase: string;
    summary: string;
  };

export type R57StuckDealRecoveryUiImplementationInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;
const requiredSafetyCopy =
  "Read-only recovery guidance. No provider called, no message sent, no runtime execution." as const;

const safetyFlags: R57StuckDealRecoveryUiImplementationSafetyFlags = {
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
};

const allowedUiPlacement: R57StuckDealRecoveryAllowedUiPlacement = {
  surface: "existing_dashboard",
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx",
  placement: "dashboard_read_only_revenue_operations_section",
  routeChangesAllowed: false,
  redesignAllowed: false,
  implementationAllowedNow: false,
};

const allowedReadOnlyDataSource: R57StuckDealRecoveryAllowedReadOnlyDataSource = {
  source: "existing_read_only_lead_and_deal_review_data",
  allowedDataOnly: [
    "lead id",
    "lead source",
    "deal stage",
    "seller outcome",
    "manual follow-up due state",
    "manual next-step state",
    "buyer-readiness blocker state",
    "near-close friction state",
    "missing critical data state",
    "human-review-required state",
    "revenue leakage indicator labels",
  ],
  forbiddenDataSources: [
    "new database tables",
    "Prisma schema changes",
    "migrations",
    "Twilio provider state",
    "provider callbacks",
    "automation-agent output",
    "polling feeds",
    "persisted UI state",
    "runtime execution queues",
  ],
  sourceMutationAllowed: false,
  persistenceAllowed: false,
  pollingAllowed: false,
};

const allowedDisplaySections: R57StuckDealRecoveryAllowedDisplaySection[] = [
  "stuck_deal_recovery_summary",
  "revenue_leakage_indicators",
  "overdue_manual_follow_up_section",
  "missing_next_step_section",
  "buyer_readiness_blocker_section",
  "near_close_friction_section",
  "missing_critical_data_section",
  "human_review_required_section",
  "safe_manual_recovery_guidance",
];

const revenuePriorityOrdering: R57StuckDealRecoveryRevenuePriorityOrderItem[] = [
  {
    order: 1,
    section: "human_review_required_section",
    renderIntent: "Show review-required and do-not-proceed records before any recovery guidance.",
    allowedReadOnlySignals: ["human-review-required state", "governance blocker label", "DNC or opt-out blocker label"],
    requiredSafetyCopy,
  },
  {
    order: 2,
    section: "near_close_friction_section",
    renderIntent: "Show near-close friction because unresolved blockers can leak the nearest revenue first.",
    allowedReadOnlySignals: ["near-close friction state", "deal stage", "manual next-step state"],
    requiredSafetyCopy,
  },
  {
    order: 3,
    section: "overdue_manual_follow_up_section",
    renderIntent: "Show overdue manual follow-up after stop signals are visible.",
    allowedReadOnlySignals: ["manual follow-up due state", "seller outcome", "lead source"],
    requiredSafetyCopy,
  },
  {
    order: 4,
    section: "missing_next_step_section",
    renderIntent: "Show deals that need a human-owned next review step.",
    allowedReadOnlySignals: ["manual next-step state", "deal stage", "seller outcome"],
    requiredSafetyCopy,
  },
  {
    order: 5,
    section: "buyer_readiness_blocker_section",
    renderIntent: "Show buyer-readiness blockers without allowing buyer outreach.",
    allowedReadOnlySignals: ["buyer-readiness blocker state", "deal stage", "missing critical data state"],
    requiredSafetyCopy,
  },
  {
    order: 6,
    section: "missing_critical_data_section",
    renderIntent: "Show data gaps that block manual acquisition or disposition decisions.",
    allowedReadOnlySignals: ["missing critical data state", "lead source", "seller outcome"],
    requiredSafetyCopy,
  },
  {
    order: 7,
    section: "revenue_leakage_indicators",
    renderIntent: "Explain why the visible stuck-deal categories may deserve manual attention.",
    allowedReadOnlySignals: ["revenue leakage indicator labels", "deal stage", "manual follow-up due state"],
    requiredSafetyCopy,
  },
  {
    order: 8,
    section: "stuck_deal_recovery_summary",
    renderIntent: "Summarize counts and categories after higher-risk blockers are visible.",
    allowedReadOnlySignals: ["lead id", "deal stage", "revenue leakage indicator labels"],
    requiredSafetyCopy,
  },
  {
    order: 9,
    section: "safe_manual_recovery_guidance",
    renderIntent: "Render concise human-owned guidance with no controls or workflow mutation.",
    allowedReadOnlySignals: ["manual next-step state", "human-review-required state", "missing critical data state"],
    requiredSafetyCopy,
  },
];

const safeManualGuidanceWording = [
  requiredSafetyCopy,
  "Review stuck-deal signals manually before taking action outside the app.",
  "Confirm governance, DNC, opt-out, source, and contact context before any off-platform contact.",
  "Use the visible signal to decide the next human-owned review step.",
  "Missing facts must be verified and assumptions must be labeled clearly.",
  "This surface may guide manual work only; it must not send, queue, retry, activate, or persist anything.",
];

const blockedForbiddenUiControls: R57StuckDealRecoveryForbiddenUiControl[] = [
  "send now",
  "auto recover",
  "auto follow-up",
  "activate workflow",
  "bulk recovery",
  "AI negotiates",
  "approve and send",
  "release automation",
  "start campaign",
  "retry automatically",
  "queue execution",
  "provider activation",
  "autonomous outreach",
  "Send SMS",
  "Send Email",
  "Start Automation",
  "Activate Provider",
  "Run Campaign",
  "Approve and Send",
  "Bulk Approve",
  "Persist Metrics",
  "Override Governance",
  "ready to send",
  "send after approval",
  "hidden execution affordances",
];

const dangerousLanguagePatterns = [
  "send now",
  "auto recover",
  "auto follow-up",
  "activate workflow",
  "bulk recovery",
  "AI negotiates",
  "approve and send",
  "release automation",
  "start campaign",
  "retry automatically",
  "queue execution",
  "provider activation",
  "autonomous outreach",
  "ready to send",
  "send after approval",
  "approved for contact",
  "execution ready",
  "closing ready without review",
];

const accessibilityRequirements = [
  "Render the future region with a semantic heading and section headings.",
  "Pair every count with a text label; do not rely on unlabeled cards.",
  "Do not communicate blocker severity with color alone.",
  "Preserve keyboard order according to the revenue-priority ordering.",
  "Do not move focus, animate essential content, auto-refresh, poll, or create live-update noise.",
  "Keep safe manual guidance and human-review-required wording distinct for screen-reader users.",
];

const noActionExecutionBoundaries = [
  "No buttons, links, toggles, menus, forms, or controls may send, call providers, approve execution, persist, poll, queue, retry, or mutate workflows.",
  "The future UI may render only read-only derived labels, counts, and explanations from existing data already available to the dashboard.",
  "Human review, approval, escalation, buyer readiness, near-close, and recovery wording must never become permission to execute.",
  "No routes, server actions, provider imports, Twilio calls, automation-agent imports, Prisma changes, migrations, polling loops, or persisted UI state are allowed.",
  "No hidden execution affordances or background activation paths are allowed.",
];

const invariantAssertions = [
  "readOnly must remain true.",
  "advisoryOnly must remain true.",
  "simulationOnly must remain true.",
  "providerCalled must remain false.",
  "sent must remain false.",
  "persistenceAllowedNow must remain false.",
  "pollingAllowed must remain false.",
  "runtimeActivationAllowed must remain false.",
  "providerActivationAllowed must remain false.",
  "approvalGrantsExecution must remain false.",
  "uiImplementationAllowedNow must remain false.",
  "required safety copy must render with every future section.",
];

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

function addWarning(
  warningCodes: string[],
  warningCode: R57StuckDealRecoveryUiImplementationWarningCode,
) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function hasForbiddenRequest(input: R57StuckDealRecoveryUiImplementationScopeInput) {
  return (
    input.uiImplementationRequested === true ||
    input.routeChangeRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.executionControlRequested === true ||
    input.redesignRequested === true ||
    input.autonomousWorkflowRequested === true ||
    input.approvalGrantsExecution === true ||
    input.readOnly === false ||
    input.advisoryOnly === false ||
    input.simulationOnly === false ||
    input.providerCalled === true ||
    input.sent === true ||
    input.persistenceAllowedNow === true ||
    input.pollingAllowed === true ||
    input.runtimeActivationAllowed === true ||
    input.providerActivationAllowed === true ||
    input.uiImplementationAllowedNow === true
  );
}

export function assertR57StuckDealRecoveryUiImplementationScopeInvariants(
  result: Pick<
    R57StuckDealRecoveryUiImplementationScopeResult,
    | "readOnly"
    | "advisoryOnly"
    | "simulationOnly"
    | "providerCalled"
    | "sent"
    | "persistenceAllowedNow"
    | "pollingAllowed"
    | "runtimeActivationAllowed"
    | "providerActivationAllowed"
    | "approvalGrantsExecution"
    | "uiImplementationAllowedNow"
  >,
): R57StuckDealRecoveryUiImplementationInvariantCheck {
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

  return {
    passed: warningCodes.length === 0,
    warningCodes,
  };
}

export function summarizeR57StuckDealRecoveryUiImplementationScopeContract(
  result: R57StuckDealRecoveryUiImplementationScopeResult,
) {
  const invariantCheck = assertR57StuckDealRecoveryUiImplementationScopeInvariants(result);

  return boundSummary(
    `R57C ${result.surface} status is ${result.scopeStatus}. ` +
      `Future placement is ${result.allowedUiPlacement.futureLikelyFile} within ${result.allowedUiPlacement.placement}. ` +
      `${result.allowedDisplaySections.length} read-only sections and ${result.revenuePriorityOrdering.length} priority slots are scoped. ` +
      `Required safety copy: ${result.requiredSafetyCopy} ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract does not authorize UI implementation, routes, providers, Twilio, automation-agent usage, Prisma changes, persistence, polling, execution controls, approval execution, redesign, or runtime activation.",
  );
}

export function createR57StuckDealRecoveryUiImplementationScopeContract(
  input: R57StuckDealRecoveryUiImplementationScopeInput = {},
): R57StuckDealRecoveryUiImplementationScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r57c_stuck_deal_recovery_ui_implementation_scope_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r57bScopeReviewed !== true) addWarning(warningCodes, "r57b_scope_review_required");
  if (input.placementReviewed !== true) addWarning(warningCodes, "placement_review_required");
  if (input.readOnlyDataReviewed !== true) addWarning(warningCodes, "read_only_data_review_required");
  if (input.displaySectionsReviewed !== true) addWarning(warningCodes, "display_section_review_required");
  if (input.revenuePriorityReviewed !== true) addWarning(warningCodes, "revenue_priority_review_required");
  if (input.wordingReviewed !== true) addWarning(warningCodes, "wording_review_required");
  if (input.governanceBoundaryReviewed !== true) addWarning(warningCodes, "governance_boundary_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.dangerousPatternsReviewed !== true) addWarning(warningCodes, "dangerous_pattern_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.uiImplementationRequested === true) addWarning(warningCodes, "ui_implementation_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.executionControlRequested === true) addWarning(warningCodes, "execution_control_rejected");
  if (input.redesignRequested === true) addWarning(warningCodes, "redesign_rejected");
  if (input.autonomousWorkflowRequested === true) addWarning(warningCodes, "autonomous_workflow_rejected");
  if (input.approvalGrantsExecution === true) addWarning(warningCodes, "approval_grants_execution_rejected");
  if (input.readOnly === false) addWarning(warningCodes, "read_only_required");
  if (input.advisoryOnly === false) addWarning(warningCodes, "advisory_only_required");
  if (input.simulationOnly === false) addWarning(warningCodes, "simulation_only_required");
  if (input.providerCalled === true) addWarning(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addWarning(warningCodes, "sent_must_be_false");
  if (input.persistenceAllowedNow === true) addWarning(warningCodes, "persistence_not_allowed_now");
  if (input.pollingAllowed === true) addWarning(warningCodes, "polling_not_allowed");
  if (input.runtimeActivationAllowed === true) addWarning(warningCodes, "runtime_activation_not_allowed");
  if (input.providerActivationAllowed === true) addWarning(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.uiImplementationAllowedNow === true) addWarning(warningCodes, "ui_implementation_not_allowed_now");

  for (const warningCode of warningCodes) {
    if (
      warningCode.endsWith("_rejected") ||
      warningCode.endsWith("_must_be_false") ||
      warningCode.endsWith("_not_allowed_now")
    ) {
      addUnique(rejectionReasons, warningCode);
    }
  }

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const missingRequiredReview =
    input.r57bScopeReviewed !== true ||
    input.placementReviewed !== true ||
    input.readOnlyDataReviewed !== true ||
    input.displaySectionsReviewed !== true ||
    input.revenuePriorityReviewed !== true ||
    input.wordingReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R57StuckDealRecoveryUiImplementationScopeStatus = hasForbiddenRequest(input)
    ? "implementation_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "read_only_ui_implementation_scope_ready";
  const result: R57StuckDealRecoveryUiImplementationScopeResult = {
    phase: "R57C",
    surface: "stuck_deal_recovery_read_only_ui_implementation_scope",
    scopeStatus,
    requiredSafetyCopy,
    allowedUiPlacement,
    allowedReadOnlyDataSource,
    allowedDisplaySections,
    revenuePriorityOrdering,
    safeManualGuidanceWording,
    blockedForbiddenUiControls,
    dangerousLanguagePatterns,
    accessibilityRequirements,
    noActionExecutionBoundaries,
    invariantAssertions,
    rejectionReasons,
    safetyFlags,
    warningCodes,
    operatorReviewRequired,
    scopeNotes,
    nextSuggestedPhase:
      "R57D - Stuck-Deal Recovery Intelligence Read-Only UI Implementation, only after explicit authorization.",
    summary: "R57C stuck-deal recovery read-only UI implementation scope contract only.",
    ...safetyFlags,
  };

  return {
    ...result,
    summary: summarizeR57StuckDealRecoveryUiImplementationScopeContract(result),
  };
}
