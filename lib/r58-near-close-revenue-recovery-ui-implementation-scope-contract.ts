export type R58NearCloseRevenueRecoveryUiImplementationScopeStatus =
  | "implementation_scope_blocked"
  | "operator_review_required"
  | "read_only_ui_implementation_scope_ready";

export type R58NearCloseAllowedUiPlacement = {
  surface: "existing_dashboard";
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx";
  futureComponentAllowed: "components/dashboard/near-close-revenue-recovery-summary.tsx";
  placement: "dashboard_read_only_revenue_operations_section";
  routeChangesAllowed: false;
  redesignAllowed: false;
  implementationAllowedNow: false;
};

export type R58NearCloseAllowedReadOnlyDataSource = {
  source: "existing_dashboard_loaded_lead_deal_and_manual_revenue_signals";
  allowedDataOnly: string[];
  allowedDerivedSignalsOnlyIfAlreadyInDashboardScope: string[];
  forbiddenDataSources: string[];
  newFetchAllowed: false;
  sourceMutationAllowed: false;
  persistenceAllowed: false;
  pollingAllowed: false;
};

export type R58NearCloseAllowedDisplaySection =
  | "near_close_revenue_recovery_summary"
  | "governance_stop_signals"
  | "title_escrow_blockers"
  | "closing_checklist_gaps"
  | "assignment_friction"
  | "seller_response_blockers"
  | "buyer_package_blockers"
  | "missing_document_blockers"
  | "stale_near_close_timelines"
  | "pre_closing_revenue_leakage_indicators"
  | "safe_manual_recovery_guidance";

export type R58NearCloseRevenuePriorityOrderItem = {
  order: number;
  section: R58NearCloseAllowedDisplaySection;
  renderIntent: string;
  allowedReadOnlySignals: string[];
  requiredSafetyCopy: string;
};

export type R58NearCloseForbiddenUiControl =
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

export type R58NearCloseUiImplementationWarningCode =
  | "r58c_near_close_ui_implementation_scope_contract_only"
  | "input_missing"
  | "r58b_ui_scope_review_required"
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
  | "legal_or_closing_readiness_claim_rejected"
  | "assignment_ready_claim_rejected"
  | "buyer_ready_to_contact_claim_rejected"
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

export type R58NearCloseUiImplementationScopeInput = {
  r58bUiScopeReviewed?: boolean;
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
  legalOrClosingReadinessClaimRequested?: boolean;
  assignmentReadyClaimRequested?: boolean;
  buyerReadyToContactClaimRequested?: boolean;
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

export type R58NearCloseUiImplementationSafetyFlags = {
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

export type R58NearCloseUiImplementationScopeResult = R58NearCloseUiImplementationSafetyFlags & {
  phase: "R58C";
  surface: "near_close_revenue_recovery_read_only_ui_implementation_scope";
  scopeStatus: R58NearCloseRevenueRecoveryUiImplementationScopeStatus;
  requiredSafetyCopy: "Read-only near-close recovery guidance. No provider called, no message sent, no runtime execution.";
  allowedUiPlacement: R58NearCloseAllowedUiPlacement;
  allowedReadOnlyDataSource: R58NearCloseAllowedReadOnlyDataSource;
  allowedDisplaySections: R58NearCloseAllowedDisplaySection[];
  revenuePriorityOrdering: R58NearCloseRevenuePriorityOrderItem[];
  safeManualGuidanceWording: string[];
  blockedForbiddenUiControls: R58NearCloseForbiddenUiControl[];
  dangerousLanguagePatterns: string[];
  accessibilityRequirements: string[];
  noActionExecutionBoundaries: string[];
  invariantAssertions: string[];
  rejectionReasons: string[];
  safetyFlags: R58NearCloseUiImplementationSafetyFlags;
  warningCodes: string[];
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R58NearCloseUiImplementationInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;
const requiredSafetyCopy =
  "Read-only near-close recovery guidance. No provider called, no message sent, no runtime execution." as const;

const safetyFlags: R58NearCloseUiImplementationSafetyFlags = {
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

const allowedUiPlacement: R58NearCloseAllowedUiPlacement = {
  surface: "existing_dashboard",
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx",
  futureComponentAllowed: "components/dashboard/near-close-revenue-recovery-summary.tsx",
  placement: "dashboard_read_only_revenue_operations_section",
  routeChangesAllowed: false,
  redesignAllowed: false,
  implementationAllowedNow: false,
};

const allowedReadOnlyDataSource: R58NearCloseAllowedReadOnlyDataSource = {
  source: "existing_dashboard_loaded_lead_deal_and_manual_revenue_signals",
  allowedDataOnly: [
    "lead id",
    "lead source",
    "lead status or deal stage",
    "approval status",
    "human-review-required state",
    "do-not-contact or opt-out state",
    "seller response or seller outcome",
    "manual follow-up due state",
    "buyer package completeness signal",
    "near-close or under-contract status signal",
    "missing critical data signal",
  ],
  allowedDerivedSignalsOnlyIfAlreadyInDashboardScope: [
    "manual revenue metric values",
    "stuck-deal read-only derived labels",
    "near-close friction labels derived in memory from loaded dashboard leads",
    "pre-closing leakage labels derived from already-loaded dashboard signals",
  ],
  forbiddenDataSources: [
    "new fetch requests",
    "new routes",
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
  newFetchAllowed: false,
  sourceMutationAllowed: false,
  persistenceAllowed: false,
  pollingAllowed: false,
};

const allowedDisplaySections: R58NearCloseAllowedDisplaySection[] = [
  "near_close_revenue_recovery_summary",
  "governance_stop_signals",
  "title_escrow_blockers",
  "closing_checklist_gaps",
  "assignment_friction",
  "seller_response_blockers",
  "buyer_package_blockers",
  "missing_document_blockers",
  "stale_near_close_timelines",
  "pre_closing_revenue_leakage_indicators",
  "safe_manual_recovery_guidance",
];

const revenuePriorityOrdering: R58NearCloseRevenuePriorityOrderItem[] = [
  {
    order: 1,
    section: "governance_stop_signals",
    renderIntent: "Show do-not-proceed and human-review-required blockers before near-close guidance.",
    allowedReadOnlySignals: ["human-review-required state", "approval status", "do-not-contact or opt-out state"],
    requiredSafetyCopy,
  },
  {
    order: 2,
    section: "title_escrow_blockers",
    renderIntent: "Surface title and escrow blockers closest to cash without provider actions.",
    allowedReadOnlySignals: ["near-close or under-contract status signal", "missing critical data signal"],
    requiredSafetyCopy,
  },
  {
    order: 3,
    section: "closing_checklist_gaps",
    renderIntent: "Show checklist gaps as manual review needs, not readiness certification.",
    allowedReadOnlySignals: ["missing critical data signal", "lead status or deal stage"],
    requiredSafetyCopy,
  },
  {
    order: 4,
    section: "assignment_friction",
    renderIntent: "Show assignment uncertainty without release or send controls.",
    allowedReadOnlySignals: ["lead status or deal stage", "buyer package completeness signal"],
    requiredSafetyCopy,
  },
  {
    order: 5,
    section: "seller_response_blockers",
    renderIntent: "Show seller-side response or outcome blockers.",
    allowedReadOnlySignals: ["seller response or seller outcome", "manual follow-up due state"],
    requiredSafetyCopy,
  },
  {
    order: 6,
    section: "buyer_package_blockers",
    renderIntent: "Show buyer package blockers without buyer-ready-to-contact semantics.",
    allowedReadOnlySignals: ["buyer package completeness signal", "lead status or deal stage"],
    requiredSafetyCopy,
  },
  {
    order: 7,
    section: "missing_document_blockers",
    renderIntent: "Show missing close-critical document blockers as verification needs.",
    allowedReadOnlySignals: ["missing critical data signal", "lead source"],
    requiredSafetyCopy,
  },
  {
    order: 8,
    section: "stale_near_close_timelines",
    renderIntent: "Show stale near-close timelines without polling or auto-refresh.",
    allowedReadOnlySignals: ["manual follow-up due state", "seller response or seller outcome"],
    requiredSafetyCopy,
  },
  {
    order: 9,
    section: "pre_closing_revenue_leakage_indicators",
    renderIntent: "Explain leakage before closing using advisory labels.",
    allowedReadOnlySignals: ["manual revenue metric values", "near-close friction labels derived in memory from loaded dashboard leads"],
    requiredSafetyCopy,
  },
  {
    order: 10,
    section: "near_close_revenue_recovery_summary",
    renderIntent: "Summarize near-close recovery signals after blockers and leakage are visible.",
    allowedReadOnlySignals: ["lead id", "lead status or deal stage", "pre-closing leakage labels derived from already-loaded dashboard signals"],
    requiredSafetyCopy,
  },
  {
    order: 11,
    section: "safe_manual_recovery_guidance",
    renderIntent: "Render concise human-owned guidance with no controls or mutation.",
    allowedReadOnlySignals: ["human-review-required state", "missing critical data signal", "manual follow-up due state"],
    requiredSafetyCopy,
  },
];

const safeManualGuidanceWording = [
  requiredSafetyCopy,
  "Review near-close recovery signals manually before taking action outside the app.",
  "Treat under-contract and near-close status as revenue-priority context, not legal readiness or closing readiness.",
  "Assignment friction is a review signal only and does not mean assignment-ready.",
  "Buyer package visibility does not mean buyer-ready-to-contact.",
  "Verify title, escrow, checklist, assignment, seller, buyer, document, and timeline facts manually.",
  "This surface may guide manual work only; it must not send, queue, retry, close, assign, activate, or persist anything.",
];

const blockedForbiddenUiControls: R58NearCloseForbiddenUiControl[] = [
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

const accessibilityRequirements = [
  "Render the future region with a semantic heading and section headings.",
  "Pair every count or blocker with a readable text label.",
  "Do not communicate severity or readiness with color alone.",
  "Preserve keyboard order according to the revenue-priority ordering.",
  "Do not move focus, animate essential content, auto-refresh, poll, or create live-update noise.",
  "Keep safe manual guidance and human-review-required wording distinct for screen-reader users.",
];

const noActionExecutionBoundaries = [
  "No buttons, links, toggles, menus, forms, or controls may close, assign, send, call providers, approve execution, persist, poll, queue, retry, or mutate workflows.",
  "The future UI may render only read-only labels, counts, and explanations from existing dashboard-loaded data and already-scoped derived signals.",
  "Human review, approval, under-contract, near-close, title, escrow, assignment, buyer, and recovery wording must never become permission to execute.",
  "No routes, new fetches, server actions, provider imports, Twilio calls, automation-agent imports, Prisma changes, migrations, polling loops, or persisted UI state are allowed.",
  "No legal-ready, closing-ready, assignment-ready, buyer-ready-to-contact, execute-closing, or hidden execution affordances are allowed.",
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
  "no legal, closing, assignment-ready, or buyer-ready-to-contact claims may appear.",
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
  if (bounded && !list.includes(bounded) && list.length < maxListItems) list.push(bounded);
}

function addWarning(warningCodes: string[], warningCode: R58NearCloseUiImplementationWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R58NearCloseUiImplementationScopeInput) {
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
    input.assignmentReadyClaimRequested === true ||
    input.buyerReadyToContactClaimRequested === true ||
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

export function assertR58NearCloseUiImplementationScopeInvariants(
  result: Pick<
    R58NearCloseUiImplementationScopeResult,
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
): R58NearCloseUiImplementationInvariantCheck {
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

export function summarizeR58NearCloseUiImplementationScopeContract(
  result: R58NearCloseUiImplementationScopeResult,
) {
  const invariantCheck = assertR58NearCloseUiImplementationScopeInvariants(result);

  return boundSummary(
    `R58C ${result.surface} status is ${result.scopeStatus}. ` +
      `Future placement is ${result.allowedUiPlacement.futureLikelyFile} within ${result.allowedUiPlacement.placement}. ` +
      `${result.allowedDisplaySections.length} read-only sections and ${result.revenuePriorityOrdering.length} priority slots are scoped. ` +
      `Required safety copy: ${result.requiredSafetyCopy} ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract does not authorize UI implementation, redesign, routes, providers, Twilio, automation-agent usage, Prisma changes, persistence, polling, execution controls, approval execution, legal readiness, closing readiness, assignment readiness, buyer-contact readiness, autonomous outreach, or runtime activation.",
  );
}

export function createR58NearCloseRevenueRecoveryUiImplementationScopeContract(
  input: R58NearCloseUiImplementationScopeInput = {},
): R58NearCloseUiImplementationScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes = collectNotes(input.extraScopeNotes);

  addWarning(warningCodes, "r58c_near_close_ui_implementation_scope_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r58bUiScopeReviewed !== true) addWarning(warningCodes, "r58b_ui_scope_review_required");
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
  if (input.legalOrClosingReadinessClaimRequested === true) {
    addWarning(warningCodes, "legal_or_closing_readiness_claim_rejected");
  }
  if (input.assignmentReadyClaimRequested === true) addWarning(warningCodes, "assignment_ready_claim_rejected");
  if (input.buyerReadyToContactClaimRequested === true) {
    addWarning(warningCodes, "buyer_ready_to_contact_claim_rejected");
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
    input.r58bUiScopeReviewed !== true ||
    input.placementReviewed !== true ||
    input.readOnlyDataReviewed !== true ||
    input.displaySectionsReviewed !== true ||
    input.revenuePriorityReviewed !== true ||
    input.wordingReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R58NearCloseRevenueRecoveryUiImplementationScopeStatus = hasForbiddenRequest(input)
    ? "implementation_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "read_only_ui_implementation_scope_ready";
  const result: R58NearCloseUiImplementationScopeResult = {
    phase: "R58C",
    surface: "near_close_revenue_recovery_read_only_ui_implementation_scope",
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
      "R58D - Near-Close Revenue Recovery Intelligence Read-Only UI Implementation",
    summary: "R58C near-close revenue recovery read-only UI implementation scope contract only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR58NearCloseUiImplementationScopeContract(result) };
}
