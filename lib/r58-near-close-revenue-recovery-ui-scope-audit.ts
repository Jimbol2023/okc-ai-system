export type R58NearCloseRevenueRecoveryUiScopeStatus =
  | "ui_scope_blocked"
  | "operator_review_required"
  | "ui_scope_ready_for_later_implementation";

export type R58NearCloseAllowedUiSection =
  | "under_contract_review"
  | "assignment_friction"
  | "buyer_package_blockers"
  | "title_escrow_blockers"
  | "seller_response_blockers"
  | "closing_checklist_gaps"
  | "stale_near_close_timelines"
  | "missing_documents"
  | "governance_stop_signals"
  | "pre_closing_revenue_leakage_indicators"
  | "safe_manual_recovery_guidance";

export type R58ForbiddenUiControl =
  | "close deal now"
  | "send assignment"
  | "auto recover"
  | "auto follow-up"
  | "activate workflow"
  | "approve and send"
  | "queue execution"
  | "provider activation"
  | "autonomous outreach"
  | "autonomous negotiation"
  | "legal-ready"
  | "closing-ready"
  | "buyer-ready-to-contact"
  | "assignment-ready"
  | "execute closing"
  | "release automation"
  | "trigger escrow"
  | "order title automatically"
  | "hidden execution affordances";

export type R58NearCloseVisibilityOrderItem = {
  order: number;
  section: R58NearCloseAllowedUiSection;
  intent: string;
  revenueReason: string;
  safeCopyRequired: string;
};

export type R58NearCloseRevenueRecoveryUiWarningCode =
  | "r58b_near_close_recovery_ui_scope_audit_only"
  | "input_missing"
  | "r58a_scope_review_required"
  | "ui_surface_review_required"
  | "visibility_concept_review_required"
  | "wording_review_required"
  | "closing_friction_review_required"
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
  | "legal_or_closing_readiness_claim_rejected"
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

export type R58NearCloseRevenueRecoveryUiScopeAuditInput = {
  r58aScopeReviewed?: boolean;
  uiSurfaceReviewed?: boolean;
  visibilityConceptsReviewed?: boolean;
  wordingReviewed?: boolean;
  closingFrictionReviewed?: boolean;
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
  legalOrClosingReadinessClaimRequested?: boolean;
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

export type R58NearCloseRevenueRecoveryUiSafetyFlags = {
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

export type R58NearCloseRevenueRecoveryUiImplementationBoundary = {
  candidateSurface: "dashboard_near_close_revenue_recovery_intelligence";
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
  noLegalOrClosingReadinessClaims: true;
  useExistingReadOnlyLeadDataOnlyLater: true;
  futureImplementationRequiresExplicitAuthorization: true;
};

export type R58NearCloseRevenueRecoveryUiScopeAuditResult = R58NearCloseRevenueRecoveryUiSafetyFlags & {
  phase: "R58B";
  surface: "near_close_revenue_recovery_intelligence_ui";
  scopeStatus: R58NearCloseRevenueRecoveryUiScopeStatus;
  allowedFutureUiSections: R58NearCloseAllowedUiSection[];
  revenueRecoveryVisibilityConcepts: R58NearCloseVisibilityOrderItem[];
  safeManualRecoveryWording: string[];
  safeEscalationWording: string[];
  humanReviewRequiredWording: string[];
  closingFrictionExplanationWording: string[];
  forbiddenControlsButtonsActions: R58ForbiddenUiControl[];
  dangerousLanguagePatterns: string[];
  accessibilityExpectations: string[];
  noActionExecutionBoundaries: string[];
  invariantAssertions: string[];
  implementationBoundaries: R58NearCloseRevenueRecoveryUiImplementationBoundary;
  rejectionReasons: string[];
  safetyFlags: R58NearCloseRevenueRecoveryUiSafetyFlags;
  warningCodes: string[];
  operatorReviewRequired: boolean;
  auditNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R58NearCloseRevenueRecoveryUiInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R58NearCloseRevenueRecoveryUiSafetyFlags = {
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

const allowedFutureUiSections: R58NearCloseAllowedUiSection[] = [
  "under_contract_review",
  "governance_stop_signals",
  "title_escrow_blockers",
  "closing_checklist_gaps",
  "assignment_friction",
  "seller_response_blockers",
  "buyer_package_blockers",
  "missing_documents",
  "stale_near_close_timelines",
  "pre_closing_revenue_leakage_indicators",
  "safe_manual_recovery_guidance",
];

const revenueRecoveryVisibilityConcepts: R58NearCloseVisibilityOrderItem[] = [
  {
    order: 1,
    section: "governance_stop_signals",
    intent: "Show do-not-proceed and human-review-required blockers before revenue guidance.",
    revenueReason: "Unsafe stop signals can block all near-close recovery work.",
    safeCopyRequired: "Review required. This does not grant contact, closing, assignment, or execution permission.",
  },
  {
    order: 2,
    section: "under_contract_review",
    intent: "Show under-contract records that need manual review.",
    revenueReason: "Under-contract records are close to cash but still require verified human review.",
    safeCopyRequired: "Under contract is not legal-ready, closing-ready, or execution-ready.",
  },
  {
    order: 3,
    section: "title_escrow_blockers",
    intent: "Surface title and escrow blockers without provider activation.",
    revenueReason: "Title and escrow friction can directly delay pre-closing revenue.",
    safeCopyRequired: "Manual title or escrow review only. No order, trigger, provider call, or runtime execution.",
  },
  {
    order: 4,
    section: "closing_checklist_gaps",
    intent: "Show checklist gaps that need human completion.",
    revenueReason: "Incomplete checklist items can hide closing friction before cash conversion.",
    safeCopyRequired: "Checklist visibility is advisory and does not certify closing readiness.",
  },
  {
    order: 5,
    section: "assignment_friction",
    intent: "Show assignment path uncertainty without release controls.",
    revenueReason: "Assignment ambiguity can stall revenue even late in the deal.",
    safeCopyRequired: "Assignment review is manual only and does not make a deal assignment-ready.",
  },
  {
    order: 6,
    section: "seller_response_blockers",
    intent: "Expose stale seller response or signature blockers.",
    revenueReason: "Seller-side delay can leak revenue before closing.",
    safeCopyRequired: "Seller recovery is manual guidance only; no outreach is sent.",
  },
  {
    order: 7,
    section: "buyer_package_blockers",
    intent: "Expose incomplete buyer package or disposition blockers.",
    revenueReason: "Buyer package friction can block assignment or disposition movement.",
    safeCopyRequired: "Buyer readiness does not mean buyer-ready-to-contact.",
  },
  {
    order: 8,
    section: "missing_documents",
    intent: "Show missing close-critical documents.",
    revenueReason: "Missing documents make near-close status unreliable.",
    safeCopyRequired: "Missing document labels require manual verification and cannot invent facts.",
  },
  {
    order: 9,
    section: "stale_near_close_timelines",
    intent: "Show stale timelines that could hide revenue leakage.",
    revenueReason: "Stale timelines can make near-close status obsolete.",
    safeCopyRequired: "Timeline refresh is manual review only; no polling or auto-refresh.",
  },
  {
    order: 10,
    section: "pre_closing_revenue_leakage_indicators",
    intent: "Explain pre-closing revenue leakage risk.",
    revenueReason: "Operators need clear visibility into closest-to-cash leakage.",
    safeCopyRequired: "Indicators are explanations, not forecasts, guarantees, or permission to act.",
  },
  {
    order: 11,
    section: "safe_manual_recovery_guidance",
    intent: "Provide bounded manual next-step language after blockers are visible.",
    revenueReason: "Clear guidance helps direct high-value human attention.",
    safeCopyRequired: "Manual guidance only. No sending, execution, persistence, polling, or provider activation.",
  },
];

const safeManualRecoveryWording = [
  "Review near-close blockers manually before any seller, buyer, title, escrow, or assignment-facing action.",
  "Treat near-close as a revenue-priority signal, not legal-ready, closing-ready, assignment-ready, or execution-ready.",
  "Verify title, escrow, checklist, assignment, seller, buyer, document, and timeline facts manually.",
  "Label assumptions clearly and do not invent property, title, escrow, assignment, seller, buyer, or closing facts.",
  "Define the next human-owned review step without sending, queuing, activating, polling, persisting, or calling providers.",
];

const safeEscalationWording = [
  "Escalate for human near-close review.",
  "Manual manager review needed before any next step.",
  "Title, escrow, assignment, or checklist blocker needs human review.",
  "Compliance or governance review required before seller, buyer, title, escrow, or assignment-facing action.",
  "Escalation is a review label only and does not approve execution.",
];

const humanReviewRequiredWording = [
  "Human review required.",
  "Do-not-proceed until reviewed.",
  "Manual decision pending.",
  "Review required before any near-close next step.",
  "Review status does not grant contact, negotiation, assignment, closing, provider, or execution permission.",
];

const closingFrictionExplanationWording = [
  "Closing friction means a near-close record has unresolved manual review work before revenue can be safely pursued.",
  "Closing checklist gaps explain operator attention risk; they are not closing-readiness claims.",
  "Title or escrow blockers require human review and do not authorize provider contact.",
  "Assignment friction explains uncertainty; it does not make a deal assignment-ready.",
  "Pre-closing revenue leakage indicators are advisory and do not forecast or guarantee closing.",
];

const forbiddenControlsButtonsActions: R58ForbiddenUiControl[] = [
  "close deal now",
  "send assignment",
  "auto recover",
  "auto follow-up",
  "activate workflow",
  "approve and send",
  "queue execution",
  "provider activation",
  "autonomous outreach",
  "autonomous negotiation",
  "legal-ready",
  "closing-ready",
  "buyer-ready-to-contact",
  "assignment-ready",
  "execute closing",
  "release automation",
  "trigger escrow",
  "order title automatically",
  "hidden execution affordances",
];

const dangerousLanguagePatterns = [
  "close deal now",
  "send assignment",
  "auto recover",
  "auto follow-up",
  "activate workflow",
  "approve and send",
  "queue execution",
  "provider activation",
  "autonomous outreach",
  "autonomous negotiation",
  "legal-ready",
  "closing-ready",
  "buyer-ready-to-contact",
  "assignment-ready",
  "execute closing",
  "release automation",
  "ready to close",
  "release assignment",
  "trigger escrow",
  "order title automatically",
];

const accessibilityExpectations = [
  "Use semantic headings for the future near-close recovery region and each section.",
  "Use text labels and helper copy so blocker meaning never depends on color alone.",
  "Keep keyboard order aligned with near-close revenue recovery visibility ordering.",
  "Do not move focus, auto-refresh, poll, animate essential content, or create live-update noise.",
  "Use concise labels for counts, blockers, and guidance so screen-reader output remains scannable.",
  "Separate human-review-required states from advisory recovery guidance in accessible text.",
];

const noActionExecutionBoundaries = [
  "No buttons, links, toggles, menus, forms, or controls may trigger close, assignment, send, provider, approval, execution, persistence, polling, route changes, or workflow mutation.",
  "Future UI may display only already-available read-only lead and deal review data.",
  "Manual recovery, escalation, and human-review wording must remain labels or guidance only.",
  "Approval language must never imply permission to execute, close, contact, send, assign, queue, retry, or activate providers.",
  "No hidden execution affordances, background work, setInterval polling, provider imports, server actions, legal-readiness claims, or automation-agent imports are allowed.",
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
  "No legal-ready, closing-ready, buyer-ready-to-contact, assignment-ready, or execute-closing wording is allowed.",
];

const implementationBoundaries: R58NearCloseRevenueRecoveryUiImplementationBoundary = {
  candidateSurface: "dashboard_near_close_revenue_recovery_intelligence",
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
  noLegalOrClosingReadinessClaims: true,
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
  if (bounded && !list.includes(bounded) && list.length < maxListItems) list.push(bounded);
}

function addWarning(warningCodes: string[], warningCode: R58NearCloseRevenueRecoveryUiWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R58NearCloseRevenueRecoveryUiScopeAuditInput) {
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
    input.legalOrClosingReadinessClaimRequested === true ||
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

export function assertR58NearCloseRevenueRecoveryUiScopeInvariants(
  result: Pick<
    R58NearCloseRevenueRecoveryUiScopeAuditResult,
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
): R58NearCloseRevenueRecoveryUiInvariantCheck {
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

  return { passed: warningCodes.length === 0, warningCodes };
}

export function summarizeR58NearCloseRevenueRecoveryUiScopeAudit(
  result: R58NearCloseRevenueRecoveryUiScopeAuditResult,
) {
  const invariantCheck = assertR58NearCloseRevenueRecoveryUiScopeInvariants(result);

  return boundSummary(
    `R58B ${result.surface} status is ${result.scopeStatus}. ` +
      `${result.allowedFutureUiSections.length} future UI sections and ${result.revenueRecoveryVisibilityConcepts.length} visibility concepts are scoped. ` +
      `${result.forbiddenControlsButtonsActions.length} controls, buttons, or action semantics are forbidden. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This audit cannot authorize UI implementation, redesign, routes, providers, Twilio, automation-agent usage, Prisma changes, persistence, polling, execution controls, approval execution, legal or closing readiness claims, autonomous negotiation, outreach, or runtime activation.",
  );
}

export function createR58NearCloseRevenueRecoveryUiScopeAudit(
  input: R58NearCloseRevenueRecoveryUiScopeAuditInput = {},
): R58NearCloseRevenueRecoveryUiScopeAuditResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const auditNotes = collectNotes(input.extraAuditNotes);

  addWarning(warningCodes, "r58b_near_close_recovery_ui_scope_audit_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r58aScopeReviewed !== true) addWarning(warningCodes, "r58a_scope_review_required");
  if (input.uiSurfaceReviewed !== true) addWarning(warningCodes, "ui_surface_review_required");
  if (input.visibilityConceptsReviewed !== true) addWarning(warningCodes, "visibility_concept_review_required");
  if (input.wordingReviewed !== true) addWarning(warningCodes, "wording_review_required");
  if (input.closingFrictionReviewed !== true) addWarning(warningCodes, "closing_friction_review_required");
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
  if (input.legalOrClosingReadinessClaimRequested === true) {
    addWarning(warningCodes, "legal_or_closing_readiness_claim_rejected");
  }
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
    input.r58aScopeReviewed !== true ||
    input.uiSurfaceReviewed !== true ||
    input.visibilityConceptsReviewed !== true ||
    input.wordingReviewed !== true ||
    input.closingFrictionReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R58NearCloseRevenueRecoveryUiScopeStatus = hasForbiddenRequest(input)
    ? "ui_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "ui_scope_ready_for_later_implementation";
  const result: R58NearCloseRevenueRecoveryUiScopeAuditResult = {
    phase: "R58B",
    surface: "near_close_revenue_recovery_intelligence_ui",
    scopeStatus,
    allowedFutureUiSections,
    revenueRecoveryVisibilityConcepts,
    safeManualRecoveryWording,
    safeEscalationWording,
    humanReviewRequiredWording,
    closingFrictionExplanationWording,
    forbiddenControlsButtonsActions,
    dangerousLanguagePatterns,
    accessibilityExpectations,
    noActionExecutionBoundaries,
    invariantAssertions,
    implementationBoundaries,
    rejectionReasons,
    safetyFlags,
    warningCodes,
    operatorReviewRequired,
    auditNotes,
    nextSuggestedPhase:
      "R58C - Near-Close Revenue Recovery Intelligence Read-Only UI Implementation Scope Contract",
    summary: "R58B near-close revenue recovery UI scope audit only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR58NearCloseRevenueRecoveryUiScopeAudit(result) };
}
