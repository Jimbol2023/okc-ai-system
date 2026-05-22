export type R57StuckDealRecoveryUiScopeStatus =
  | "ui_scope_blocked"
  | "operator_review_required"
  | "ui_scope_ready_for_later_implementation";

export type R57StuckDealRecoveryAllowedUiSection =
  | "stalled_deal_categories"
  | "overdue_manual_follow_up"
  | "missing_next_step"
  | "buyer_readiness_blockers"
  | "near_close_friction"
  | "missing_data"
  | "unresolved_manual_review"
  | "revenue_leakage_indicators"
  | "safe_manual_recovery_guidance";

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
  | "Start Automation"
  | "Send SMS"
  | "Send Email"
  | "Auto Follow-Up"
  | "Activate Provider"
  | "Run Campaign"
  | "AI Autopilot"
  | "Override Governance"
  | "Persist Metrics"
  | "Approve and Send"
  | "Bulk Approve"
  | "ready to send"
  | "send after approval"
  | "auto release"
  | "bulk send"
  | "autonomous negotiation"
  | "hidden execution affordances";

export type R57StuckDealVisibilityOrderItem = {
  order: number;
  section: R57StuckDealRecoveryAllowedUiSection;
  intent: string;
  revenueLeakageReason: string;
  safeCopyRequired: string;
};

export type R57StuckDealRecoveryUiWarningCode =
  | "r57b_stuck_deal_recovery_ui_scope_audit_only"
  | "input_missing"
  | "r57a_scope_review_required"
  | "ui_surface_review_required"
  | "visibility_order_review_required"
  | "wording_review_required"
  | "revenue_leakage_review_required"
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

export type R57StuckDealRecoveryUiScopeAuditInput = {
  r57aScopeReviewed?: boolean;
  uiSurfaceReviewed?: boolean;
  visibilityOrderReviewed?: boolean;
  wordingReviewed?: boolean;
  revenueLeakageReviewed?: boolean;
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
  extraAuditNotes?: string[];
};

export type R57StuckDealRecoveryUiSafetyFlags = {
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

export type R57StuckDealRecoveryUiImplementationBoundary = {
  candidateSurface: "dashboard_stuck_deal_recovery_intelligence";
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx";
  noUiImplementationNow: true;
  noNewRoutes: true;
  noPolling: true;
  noPersistence: true;
  noProviderControls: true;
  noExecutionControls: true;
  noAutomationAgent: true;
  noApprovalBehaviorChanges: true;
  noRedesign: true;
  useExistingReadOnlyLeadDataOnlyLater: true;
  futureImplementationRequiresExplicitAuthorization: true;
};

export type R57StuckDealRecoveryUiScopeAuditResult = R57StuckDealRecoveryUiSafetyFlags & {
  phase: "R57B";
  surface: "stuck_deal_recovery_intelligence_ui";
  scopeStatus: R57StuckDealRecoveryUiScopeStatus;
  allowedFutureUiSections: R57StuckDealRecoveryAllowedUiSection[];
  stuckDealVisibilityOrdering: R57StuckDealVisibilityOrderItem[];
  safeManualRecoveryWording: string[];
  safeEscalationWording: string[];
  humanReviewRequiredWording: string[];
  revenueLeakageExplanationWording: string[];
  forbiddenControlsButtonsActions: R57StuckDealRecoveryForbiddenUiControl[];
  accessibilityExpectations: string[];
  noActionExecutionBoundaries: string[];
  dangerousPatternChecks: string[];
  invariantAssertions: string[];
  implementationBoundaries: R57StuckDealRecoveryUiImplementationBoundary;
  rejectionReasons: string[];
  safetyFlags: R57StuckDealRecoveryUiSafetyFlags;
  warningCodes: string[];
  operatorReviewRequired: boolean;
  auditNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R57StuckDealRecoveryUiInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R57StuckDealRecoveryUiSafetyFlags = {
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

const allowedFutureUiSections: R57StuckDealRecoveryAllowedUiSection[] = [
  "stalled_deal_categories",
  "overdue_manual_follow_up",
  "missing_next_step",
  "buyer_readiness_blockers",
  "near_close_friction",
  "missing_data",
  "unresolved_manual_review",
  "revenue_leakage_indicators",
  "safe_manual_recovery_guidance",
];

const stuckDealVisibilityOrdering: R57StuckDealVisibilityOrderItem[] = [
  {
    order: 1,
    section: "unresolved_manual_review",
    intent: "Show human-review-required and do-not-proceed items before revenue guidance.",
    revenueLeakageReason: "Unsafe or unresolved review states can block every later recovery decision.",
    safeCopyRequired: "Human review required. This does not grant permission to contact, send, or execute.",
  },
  {
    order: 2,
    section: "near_close_friction",
    intent: "Surface near-close blockers that are closest to revenue loss.",
    revenueLeakageReason: "Near-close friction can leak immediate revenue when manual blockers remain unresolved.",
    safeCopyRequired: "Near-close review needed. Not closing-ready, buyer-ready, or execution-ready.",
  },
  {
    order: 3,
    section: "overdue_manual_follow_up",
    intent: "Show overdue human-owned follow-up work after stop signals are visible.",
    revenueLeakageReason: "Delayed manual follow-up can reduce seller momentum and conversion.",
    safeCopyRequired: "Manual follow-up needed after governance, DNC, and opt-out status are reviewed.",
  },
  {
    order: 4,
    section: "missing_next_step",
    intent: "Make deals with no human-owned next step easy to find.",
    revenueLeakageReason: "Deals without a next manual step drift out of the operator workday.",
    safeCopyRequired: "Assign a human-owned next review step. No workflow is changed by this audit.",
  },
  {
    order: 5,
    section: "buyer_readiness_blockers",
    intent: "Expose buyer package or disposition blockers without implying buyer outreach.",
    revenueLeakageReason: "Incomplete buyer readiness can delay disposition after acquisition qualification.",
    safeCopyRequired: "Buyer readiness requires manual review. No buyer-facing action is available.",
  },
  {
    order: 6,
    section: "missing_data",
    intent: "Show source, contact, property, motivation, timeline, outcome, and buyer package gaps.",
    revenueLeakageReason: "Missing data lowers decision quality and can hide viable recovery work.",
    safeCopyRequired: "Complete missing data manually and label assumptions clearly.",
  },
  {
    order: 7,
    section: "stalled_deal_categories",
    intent: "Group stalled records by deterministic recovery category for operator scanning.",
    revenueLeakageReason: "Category visibility helps operators find repeated blockers without automation.",
    safeCopyRequired: "Categories are advisory and read-only.",
  },
  {
    order: 8,
    section: "revenue_leakage_indicators",
    intent: "Explain why a stuck-deal signal matters to revenue without overstating facts.",
    revenueLeakageReason: "Revenue leakage language helps prioritize manual attention.",
    safeCopyRequired: "Revenue leakage indicators are explanations, not forecasts, guarantees, or permission to act.",
  },
  {
    order: 9,
    section: "safe_manual_recovery_guidance",
    intent: "Provide concise manual recovery guidance after risks and blockers are visible.",
    revenueLeakageReason: "Clear human-owned guidance can improve throughput without execution controls.",
    safeCopyRequired: "Manual guidance only. No sending, provider activation, persistence, polling, or runtime execution.",
  },
];

const safeManualRecoveryWording = [
  "Review this stuck deal manually.",
  "Confirm governance, DNC, opt-out, and source status before any off-platform contact.",
  "Identify the next human-owned recovery step.",
  "Complete missing source, contact, motivation, timeline, outcome, or buyer package data manually.",
  "Prepare a manual recovery note; do not send, queue, or activate anything from this surface.",
];

const safeEscalationWording = [
  "Escalate for human review.",
  "Manual manager review needed.",
  "Review blocker with the operator before work continues.",
  "Compliance or governance review required before any seller or buyer-facing action.",
  "Escalation is a review label only and does not approve execution.",
];

const humanReviewRequiredWording = [
  "Human review required.",
  "Review required before any next step.",
  "Do-not-proceed until reviewed.",
  "Manual decision pending.",
  "Review status does not grant contact, sending, negotiation, or provider permission.",
];

const revenueLeakageExplanationWording = [
  "This signal may indicate revenue leakage because manual follow-up or deal movement has stalled.",
  "Revenue leakage indicators explain operator attention risk; they are not automated forecasts.",
  "Near-close friction may deserve earlier manual review because the deal is closer to revenue.",
  "Missing data can hide the next manual recovery step and should be verified before action.",
  "Buyer-readiness blockers can slow disposition but do not authorize buyer outreach.",
];

const forbiddenControlsButtonsActions: R57StuckDealRecoveryForbiddenUiControl[] = [
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
  "Start Automation",
  "Send SMS",
  "Send Email",
  "Auto Follow-Up",
  "Activate Provider",
  "Run Campaign",
  "AI Autopilot",
  "Override Governance",
  "Persist Metrics",
  "Approve and Send",
  "Bulk Approve",
  "ready to send",
  "send after approval",
  "auto release",
  "bulk send",
  "autonomous negotiation",
  "hidden execution affordances",
];

const accessibilityExpectations = [
  "Use semantic headings for the future stuck-deal recovery region and each section.",
  "Use text labels and helper copy so blocker meaning never depends on color alone.",
  "Keep keyboard order aligned with stuck-deal visibility ordering.",
  "Do not move focus, auto-refresh, poll, animate essential content, or create live-update noise.",
  "Use concise labels for counts and categories so screen-reader output remains scannable.",
  "Separate review-required states from advisory recovery guidance in accessible text.",
];

const noActionExecutionBoundaries = [
  "No buttons, links, toggles, menus, forms, or controls may trigger send, provider, approval, escalation execution, persistence, polling, route changes, or workflow mutation.",
  "Future UI may display only already-available read-only lead and deal review data.",
  "Manual recovery, escalation, and human-review wording must remain labels or guidance only.",
  "Approval language must never imply permission to execute, send, negotiate, queue, retry, or activate providers.",
  "No hidden execution affordances, background work, setInterval polling, provider imports, server actions, or automation-agent imports are allowed.",
];

const dangerousPatternChecks = [
  "Reject send now, auto recover, auto follow-up, activate workflow, bulk recovery, AI negotiates, approve and send, release automation, start campaign, retry automatically, queue execution, provider activation, and autonomous outreach wording.",
  "Reject action-looking controls near stuck-deal recovery guidance, leakage indicators, or review-required states.",
  "Reject copy that treats human review, approval, near-close, buyer readiness, or escalation as permission to execute.",
  "Reject any enabled flag that sets providerCalled, sent, runtimeActivationAllowed, providerActivationAllowed, persistenceAllowedNow, pollingAllowed, approvalGrantsExecution, or uiImplementationAllowedNow to true.",
  "Reject routes, providers, Twilio, automation-agent, Prisma, migrations, polling, persistence, runtime activation, execution controls, redesign, and hidden execution affordances.",
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
];

const implementationBoundaries: R57StuckDealRecoveryUiImplementationBoundary = {
  candidateSurface: "dashboard_stuck_deal_recovery_intelligence",
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx",
  noUiImplementationNow: true,
  noNewRoutes: true,
  noPolling: true,
  noPersistence: true,
  noProviderControls: true,
  noExecutionControls: true,
  noAutomationAgent: true,
  noApprovalBehaviorChanges: true,
  noRedesign: true,
  useExistingReadOnlyLeadDataOnlyLater: true,
  futureImplementationRequiresExplicitAuthorization: true,
};

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

function addWarning(warningCodes: string[], warningCode: R57StuckDealRecoveryUiWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function hasForbiddenRequest(input: R57StuckDealRecoveryUiScopeAuditInput) {
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

export function assertR57StuckDealRecoveryUiScopeInvariants(
  result: Pick<
    R57StuckDealRecoveryUiScopeAuditResult,
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
): R57StuckDealRecoveryUiInvariantCheck {
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

export function summarizeR57StuckDealRecoveryUiScopeAudit(result: R57StuckDealRecoveryUiScopeAuditResult) {
  const invariantCheck = assertR57StuckDealRecoveryUiScopeInvariants(result);

  return boundSummary(
    `R57B ${result.surface} status is ${result.scopeStatus}. ` +
      `${result.allowedFutureUiSections.length} future UI sections and ${result.stuckDealVisibilityOrdering.length} visibility slots are scoped for later implementation only. ` +
      `${result.forbiddenControlsButtonsActions.length} controls, buttons, or action semantics are forbidden. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This audit cannot authorize UI implementation, routes, providers, Twilio, automation-agent usage, Prisma changes, persistence, polling, execution controls, approval execution, redesign, hidden execution affordances, or runtime activation.",
  );
}

export function createR57StuckDealRecoveryUiScopeAudit(
  input: R57StuckDealRecoveryUiScopeAuditInput = {},
): R57StuckDealRecoveryUiScopeAuditResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const auditNotes = collectNotes(input.extraAuditNotes);

  addWarning(warningCodes, "r57b_stuck_deal_recovery_ui_scope_audit_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r57aScopeReviewed !== true) addWarning(warningCodes, "r57a_scope_review_required");
  if (input.uiSurfaceReviewed !== true) addWarning(warningCodes, "ui_surface_review_required");
  if (input.visibilityOrderReviewed !== true) addWarning(warningCodes, "visibility_order_review_required");
  if (input.wordingReviewed !== true) addWarning(warningCodes, "wording_review_required");
  if (input.revenueLeakageReviewed !== true) addWarning(warningCodes, "revenue_leakage_review_required");
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
    input.r57aScopeReviewed !== true ||
    input.uiSurfaceReviewed !== true ||
    input.visibilityOrderReviewed !== true ||
    input.wordingReviewed !== true ||
    input.revenueLeakageReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R57StuckDealRecoveryUiScopeStatus = hasForbiddenRequest(input)
    ? "ui_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "ui_scope_ready_for_later_implementation";
  const result: R57StuckDealRecoveryUiScopeAuditResult = {
    phase: "R57B",
    surface: "stuck_deal_recovery_intelligence_ui",
    scopeStatus,
    allowedFutureUiSections,
    stuckDealVisibilityOrdering,
    safeManualRecoveryWording,
    safeEscalationWording,
    humanReviewRequiredWording,
    revenueLeakageExplanationWording,
    forbiddenControlsButtonsActions,
    accessibilityExpectations,
    noActionExecutionBoundaries,
    dangerousPatternChecks,
    invariantAssertions,
    implementationBoundaries,
    rejectionReasons,
    safetyFlags,
    warningCodes,
    operatorReviewRequired,
    auditNotes,
    nextSuggestedPhase:
      "R57C - Stuck-Deal Recovery Intelligence Read-Only UI Implementation, only after explicit authorization.",
    summary: "R57B stuck-deal recovery intelligence UI scope audit only.",
    ...safetyFlags,
  };

  return {
    ...result,
    summary: summarizeR57StuckDealRecoveryUiScopeAudit(result),
  };
}
