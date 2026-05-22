export type R61BuyerReadyDispositionUiScopeStatus =
  | "ui_scope_blocked"
  | "operator_review_required"
  | "ui_scope_ready_for_later_implementation";

export type R61BuyerReadyDispositionAllowedUiSection =
  | "governance_stop_signals"
  | "buyer_ready_disposition_priority"
  | "near_buyer_ready_review"
  | "ready_to_package_deal"
  | "incomplete_buyer_package"
  | "buyer_fit_review_needed"
  | "buyer_demand_alignment_review"
  | "disposition_bottleneck"
  | "blocked_buyer_disposition"
  | "missing_buyer_package_data"
  | "high_probability_buyer_review"
  | "manual_disposition_review_guidance"
  | "operator_package_prep_guidance";

export type R61BuyerReadyDispositionVisibilityConcept = {
  order: number;
  section: R61BuyerReadyDispositionAllowedUiSection;
  intent: string;
  revenuePriorityReason: string;
  safeCopyRequired: string;
};

export type R61BuyerReadyDispositionForbiddenUiControl =
  | "send to buyers"
  | "blast buyers"
  | "auto email buyers"
  | "auto SMS buyers"
  | "launch buyer campaign"
  | "activate buyer outreach"
  | "queue buyer execution"
  | "match and send automatically"
  | "approve and send"
  | "execute disposition workflow"
  | "release buyer automation"
  | "autonomous buyer negotiation"
  | "provider activation"
  | "hidden execution affordances";

export type R61BuyerReadyDispositionUiWarningCode =
  | "r61b_buyer_ready_disposition_ui_scope_audit_only"
  | "input_missing"
  | "r61a_scope_review_required"
  | "ui_surface_review_required"
  | "visibility_concept_review_required"
  | "buyer_ready_visibility_review_required"
  | "package_completeness_visibility_review_required"
  | "buyer_fit_visibility_review_required"
  | "demand_alignment_visibility_review_required"
  | "wording_review_required"
  | "governance_boundary_review_required"
  | "accessibility_review_required"
  | "dangerous_patterns_review_required"
  | "operator_review_required"
  | "ui_implementation_rejected"
  | "dashboard_change_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "email_sms_sending_rejected"
  | "buyer_outreach_execution_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "execution_control_rejected"
  | "redesign_rejected"
  | "autonomous_buyer_outreach_rejected"
  | "autonomous_negotiation_rejected"
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

export type R61BuyerReadyDispositionUiScopeAuditInput = {
  r61aScopeReviewed?: boolean;
  uiSurfaceReviewed?: boolean;
  visibilityConceptsReviewed?: boolean;
  buyerReadyVisibilityReviewed?: boolean;
  packageCompletenessVisibilityReviewed?: boolean;
  buyerFitVisibilityReviewed?: boolean;
  demandAlignmentVisibilityReviewed?: boolean;
  wordingReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  dangerousPatternsReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequested?: boolean;
  dashboardChangeRequested?: boolean;
  routeChangeRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  emailSmsSendingRequested?: boolean;
  buyerOutreachExecutionRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  executionControlRequested?: boolean;
  redesignRequested?: boolean;
  autonomousBuyerOutreachRequested?: boolean;
  autonomousNegotiationRequested?: boolean;
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

export type R61BuyerReadyDispositionUiSafetyFlags = {
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

export type R61BuyerReadyDispositionUiImplementationBoundary = {
  candidateSurface: "dashboard_buyer_ready_disposition_priority_intelligence";
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx";
  noUiImplementationNow: true;
  noDashboardChangesNow: true;
  noNewRoutes: true;
  noPolling: true;
  noPersistence: true;
  noProviderControls: true;
  noEmailSmsControls: true;
  noBuyerOutreachControls: true;
  noExecutionControls: true;
  noAutomationAgent: true;
  noApprovalBehaviorChanges: true;
  noRedesign: true;
  noAutonomousBuyerOutreachOrNegotiation: true;
  noHiddenExecutionAffordances: true;
  useExistingReadOnlyDashboardSignalsOnlyLater: true;
  futureImplementationRequiresExplicitAuthorization: true;
};

export type R61BuyerReadyDispositionUiScopeAuditResult = R61BuyerReadyDispositionUiSafetyFlags & {
  phase: "R61B";
  surface: "buyer_ready_disposition_priority_intelligence_ui";
  scopeStatus: R61BuyerReadyDispositionUiScopeStatus;
  allowedFutureUiSections: R61BuyerReadyDispositionAllowedUiSection[];
  buyerReadyPriorityVisibilityConcepts: R61BuyerReadyDispositionVisibilityConcept[];
  buyerReadyVisibilityWording: string[];
  nearBuyerReadyVisibilityWording: string[];
  packageCompletenessVisibilityWording: string[];
  buyerFitReviewVisibilityWording: string[];
  buyerDemandAlignmentVisibilityWording: string[];
  dispositionBottleneckVisibilityWording: string[];
  blockedDispositionVisibilityWording: string[];
  governanceStopVisibilityWording: string[];
  safeOperatorGuidanceWording: string[];
  forbiddenControlsButtonsActions: R61BuyerReadyDispositionForbiddenUiControl[];
  dangerousLanguagePatterns: string[];
  accessibilityExpectations: string[];
  noActionExecutionBoundaries: string[];
  invariantAssertions: string[];
  implementationBoundaries: R61BuyerReadyDispositionUiImplementationBoundary;
  rejectionReasons: string[];
  safetyFlags: R61BuyerReadyDispositionUiSafetyFlags;
  warningCodes: string[];
  operatorReviewRequired: boolean;
  auditNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

export type R61BuyerReadyDispositionUiInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R61BuyerReadyDispositionUiSafetyFlags = {
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

const allowedFutureUiSections: R61BuyerReadyDispositionAllowedUiSection[] = [
  "governance_stop_signals",
  "buyer_ready_disposition_priority",
  "near_buyer_ready_review",
  "ready_to_package_deal",
  "incomplete_buyer_package",
  "buyer_fit_review_needed",
  "buyer_demand_alignment_review",
  "disposition_bottleneck",
  "blocked_buyer_disposition",
  "missing_buyer_package_data",
  "high_probability_buyer_review",
  "manual_disposition_review_guidance",
  "operator_package_prep_guidance",
];

const buyerReadyPriorityVisibilityConcepts: R61BuyerReadyDispositionVisibilityConcept[] = [
  {
    order: 1,
    section: "governance_stop_signals",
    intent: "Show governance stop states before any buyer-ready, fit, package, or urgency guidance.",
    revenuePriorityReason: "Governance stops protect buyer disposition work from unsafe outreach and package-release drift.",
    safeCopyRequired: "Governance stop signals must be resolved first.",
  },
  {
    order: 2,
    section: "buyer_ready_disposition_priority",
    intent: "Show deals that may deserve manual disposition review before lower-value backlog.",
    revenuePriorityReason: "Buyer-ready disposition priority can move revenue-producing deals faster when reviewed manually.",
    safeCopyRequired: "Buyer-ready label is advisory only. Buyer-ready does not mean send.",
  },
  {
    order: 3,
    section: "near_buyer_ready_review",
    intent: "Show deals close to buyer package preparation with remaining manual review gaps.",
    revenuePriorityReason: "Near-buyer-ready opportunities may unlock revenue once package gaps are reviewed.",
    safeCopyRequired: "Near-buyer-ready review is manual only and does not authorize buyer contact.",
  },
  {
    order: 4,
    section: "ready_to_package_deal",
    intent: "Show deals that may be prepared for package review by an operator.",
    revenuePriorityReason: "Package-prep focus can reduce disposition delay without sending anything.",
    safeCopyRequired: "Package-prep priority. Review buyer package before taking action.",
  },
  {
    order: 5,
    section: "incomplete_buyer_package",
    intent: "Show incomplete package materials that block manual disposition review.",
    revenuePriorityReason: "Missing package data can hide revenue leakage and slow buyer disposition.",
    safeCopyRequired: "Incomplete buyer package requires manual verification.",
  },
  {
    order: 6,
    section: "missing_buyer_package_data",
    intent: "Show missing assignment, title, photos, repair, ARV, rent, or strategy data.",
    revenuePriorityReason: "Critical package gaps lower confidence and block buyer-facing preparation.",
    safeCopyRequired: "Missing package data must be completed manually; do not invent property facts.",
  },
  {
    order: 7,
    section: "buyer_fit_review_needed",
    intent: "Show deals that need human buyer-fit review.",
    revenuePriorityReason: "Buyer-fit review can help operators focus on deals that align with known demand.",
    safeCopyRequired: "Buyer-fit review needed.",
  },
  {
    order: 8,
    section: "buyer_demand_alignment_review",
    intent: "Show demand alignment review labels for strategy, area, price, property type, ARV, rent, and repair context.",
    revenuePriorityReason: "Demand alignment can improve disposition focus before package preparation.",
    safeCopyRequired: "Buyer demand alignment review is advisory only.",
  },
  {
    order: 9,
    section: "high_probability_buyer_review",
    intent: "Show high-probability buyer review labels without contact affordances.",
    revenuePriorityReason: "High-probability buyer review can focus operator attention on likely manual disposition value.",
    safeCopyRequired: "High-probability buyer review is not a contact instruction.",
  },
  {
    order: 10,
    section: "disposition_bottleneck",
    intent: "Show package, fit, data, or process bottlenecks that delay buyer disposition review.",
    revenuePriorityReason: "Disposition bottlenecks can stall revenue after acquisition work is complete or nearly complete.",
    safeCopyRequired: "Disposition bottleneck requires manual review.",
  },
  {
    order: 11,
    section: "blocked_buyer_disposition",
    intent: "Show blocked disposition states that require human review before any next step.",
    revenuePriorityReason: "Blocked buyer disposition prevents revenue movement and can reveal governance or package issues.",
    safeCopyRequired: "Blocked buyer disposition is review-only and cannot approve outreach.",
  },
  {
    order: 12,
    section: "manual_disposition_review_guidance",
    intent: "Show concise manual disposition review wording.",
    revenuePriorityReason: "Safe guidance helps operators prepare deals without changing system behavior.",
    safeCopyRequired: "Manual disposition review recommended.",
  },
  {
    order: 13,
    section: "operator_package_prep_guidance",
    intent: "Show final package-prep guidance without buttons, links, or execution affordances.",
    revenuePriorityReason: "Operator package-prep guidance can improve throughput while keeping humans in control.",
    safeCopyRequired: "Review buyer package before taking action.",
  },
];

const buyerReadyVisibilityWording = [
  "Buyer-ready disposition priority.",
  "Buyer-ready label is advisory only.",
  "Buyer-ready does not mean send.",
  "Manual disposition review recommended.",
];

const nearBuyerReadyVisibilityWording = [
  "Near-buyer-ready review.",
  "Remaining package or fit gaps need human review.",
  "Near-buyer-ready does not mean buyer-ready-to-contact, send-ready, campaign-ready, or automation-ready.",
];

const packageCompletenessVisibilityWording = [
  "Ready-to-package deal.",
  "Incomplete buyer package.",
  "Package-prep priority.",
  "Missing assignment/title/photos/repair/ARV/rent/strategy data.",
  "Review buyer package before taking action.",
];

const buyerFitReviewVisibilityWording = [
  "Buyer-fit review needed.",
  "High-probability buyer review.",
  "Manual buyer match review only.",
  "Buyer-fit labels do not authorize buyer contact, negotiation, matching execution, or sending.",
];

const buyerDemandAlignmentVisibilityWording = [
  "Buyer demand alignment review.",
  "Review strategy, market area, price band, property type, repair, ARV, and rent context.",
  "Demand alignment is advisory and cannot launch buyer outreach.",
];

const dispositionBottleneckVisibilityWording = [
  "Disposition bottleneck.",
  "Package, fit, data, or review gap is slowing buyer disposition preparation.",
  "Bottleneck labels cannot assign work, mutate workflow state, queue execution, or activate providers.",
];

const blockedDispositionVisibilityWording = [
  "Blocked buyer disposition.",
  "Human review required before package preparation or buyer-facing action outside the app.",
  "Blocked disposition cannot become approve-and-send, release automation, or provider activation.",
];

const governanceStopVisibilityWording = [
  "Governance stop signals must be resolved first.",
  "Governance stop signals outrank buyer-readiness, buyer-fit, demand alignment, package completeness, and urgency.",
  "Governance stop visibility cannot override consent, compliance, review, or do-not-contact boundaries.",
];

const safeOperatorGuidanceWording = [
  "Manual disposition review recommended",
  "Buyer-ready label is advisory only",
  "Review buyer package before taking action",
  "Buyer-fit review needed",
  "Package-prep priority",
  "Governance stop signals must be resolved first",
  "Buyer-ready does not mean send",
];

const forbiddenControlsButtonsActions: R61BuyerReadyDispositionForbiddenUiControl[] = [
  "send to buyers",
  "blast buyers",
  "auto email buyers",
  "auto SMS buyers",
  "launch buyer campaign",
  "activate buyer outreach",
  "queue buyer execution",
  "match and send automatically",
  "approve and send",
  "execute disposition workflow",
  "release buyer automation",
  "autonomous buyer negotiation",
  "provider activation",
  "hidden execution affordances",
];

const dangerousLanguagePatterns = [
  "send to buyers",
  "blast buyers",
  "auto email buyers",
  "auto SMS buyers",
  "launch buyer campaign",
  "activate buyer outreach",
  "queue buyer execution",
  "match and send automatically",
  "approve and send",
  "execute disposition workflow",
  "release buyer automation",
  "autonomous buyer negotiation",
  "provider activation",
  "buyer-ready-to-contact",
  "send-ready",
  "campaign-ready",
  "contact buyers now",
  "share package",
  "release package",
];

const accessibilityExpectations = [
  "Use semantic headings for the future buyer-ready disposition priority region and each section.",
  "Use readable labels for buyer-ready, near-buyer-ready, blocked, missing package data, fit, demand alignment, bottleneck, status, and guidance text.",
  "Status meaning must be text-based and never depend on color alone.",
  "Do not rely on motion, focus movement, auto-refresh, polling, or live-update noise.",
  "Use concise wording and screen-reader-friendly summaries for buyer disposition priority groups.",
  "Keep governance stop states visually and textually distinct from advisory buyer-ready guidance.",
];

const noActionExecutionBoundaries = [
  "No buttons, links, toggles, menus, forms, or controls may trigger buyer outreach, seller outreach, email, SMS, campaigns, provider activation, approval execution, package release, persistence, polling, route changes, or workflow mutation.",
  "Future UI may display only already-available read-only dashboard signals and explicitly authorized derived labels.",
  "Buyer-ready, near-buyer-ready, package-prep, buyer-fit, demand alignment, bottleneck, blocked disposition, and manual review wording must remain labels or guidance only.",
  "Approval, review, buyer-ready, ready-to-package, buyer-fit, and high-probability language must never imply permission to send, share, blast, contact, negotiate, queue, launch campaigns, or activate providers.",
  "No hidden execution affordances, background work, server actions, provider imports, automation-agent imports, autonomous buyer outreach, autonomous negotiation, campaign launch, or package-release controls are allowed.",
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
  "Governance stop signals must appear before buyer-ready visibility.",
  "Buyer-ready labels must remain advisory only.",
  "Buyer-ready does not mean send.",
  "No hidden execution affordances are allowed.",
];

const implementationBoundaries: R61BuyerReadyDispositionUiImplementationBoundary = {
  candidateSurface: "dashboard_buyer_ready_disposition_priority_intelligence",
  futureLikelyFile: "app/(dashboard)/dashboard/page.tsx",
  noUiImplementationNow: true,
  noDashboardChangesNow: true,
  noNewRoutes: true,
  noPolling: true,
  noPersistence: true,
  noProviderControls: true,
  noEmailSmsControls: true,
  noBuyerOutreachControls: true,
  noExecutionControls: true,
  noAutomationAgent: true,
  noApprovalBehaviorChanges: true,
  noRedesign: true,
  noAutonomousBuyerOutreachOrNegotiation: true,
  noHiddenExecutionAffordances: true,
  useExistingReadOnlyDashboardSignalsOnlyLater: true,
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

function addWarning(warningCodes: string[], warningCode: R61BuyerReadyDispositionUiWarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];
  for (const value of values ?? []) addUnique(notes, value);

  return notes;
}

function hasForbiddenRequest(input: R61BuyerReadyDispositionUiScopeAuditInput) {
  return (
    input.uiImplementationRequested === true ||
    input.dashboardChangeRequested === true ||
    input.routeChangeRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.emailSmsSendingRequested === true ||
    input.buyerOutreachExecutionRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.executionControlRequested === true ||
    input.redesignRequested === true ||
    input.autonomousBuyerOutreachRequested === true ||
    input.autonomousNegotiationRequested === true ||
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

export function assertR61BuyerReadyDispositionUiScopeInvariants(
  result: Pick<
    R61BuyerReadyDispositionUiScopeAuditResult,
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
): R61BuyerReadyDispositionUiInvariantCheck {
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

export function summarizeR61BuyerReadyDispositionUiScopeAudit(
  result: R61BuyerReadyDispositionUiScopeAuditResult,
) {
  const invariantCheck = assertR61BuyerReadyDispositionUiScopeInvariants(result);

  return boundSummary(
    `R61B ${result.surface} status is ${result.scopeStatus}. ` +
      `${result.allowedFutureUiSections.length} future UI sections and ${result.buyerReadyPriorityVisibilityConcepts.length} visibility concepts are scoped. ` +
      `${result.forbiddenControlsButtonsActions.length} controls, buttons, or action semantics are forbidden. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This audit cannot authorize UI implementation, dashboard changes, redesign, routes, providers, Twilio, automation-agent usage, Prisma changes, email, SMS, buyer outreach, persistence, polling, execution controls, approval execution, autonomous buyer outreach, autonomous negotiation, hidden execution affordances, package release, or runtime activation.",
  );
}

export function createR61BuyerReadyDispositionUiScopeAudit(
  input: R61BuyerReadyDispositionUiScopeAuditInput = {},
): R61BuyerReadyDispositionUiScopeAuditResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const auditNotes = collectNotes(input.extraAuditNotes);

  addWarning(warningCodes, "r61b_buyer_ready_disposition_ui_scope_audit_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r61aScopeReviewed !== true) addWarning(warningCodes, "r61a_scope_review_required");
  if (input.uiSurfaceReviewed !== true) addWarning(warningCodes, "ui_surface_review_required");
  if (input.visibilityConceptsReviewed !== true) addWarning(warningCodes, "visibility_concept_review_required");
  if (input.buyerReadyVisibilityReviewed !== true) {
    addWarning(warningCodes, "buyer_ready_visibility_review_required");
  }
  if (input.packageCompletenessVisibilityReviewed !== true) {
    addWarning(warningCodes, "package_completeness_visibility_review_required");
  }
  if (input.buyerFitVisibilityReviewed !== true) addWarning(warningCodes, "buyer_fit_visibility_review_required");
  if (input.demandAlignmentVisibilityReviewed !== true) {
    addWarning(warningCodes, "demand_alignment_visibility_review_required");
  }
  if (input.wordingReviewed !== true) addWarning(warningCodes, "wording_review_required");
  if (input.governanceBoundaryReviewed !== true) addWarning(warningCodes, "governance_boundary_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.dangerousPatternsReviewed !== true) addWarning(warningCodes, "dangerous_patterns_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.uiImplementationRequested === true) addWarning(warningCodes, "ui_implementation_rejected");
  if (input.dashboardChangeRequested === true) addWarning(warningCodes, "dashboard_change_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.emailSmsSendingRequested === true) addWarning(warningCodes, "email_sms_sending_rejected");
  if (input.buyerOutreachExecutionRequested === true) addWarning(warningCodes, "buyer_outreach_execution_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.executionControlRequested === true) addWarning(warningCodes, "execution_control_rejected");
  if (input.redesignRequested === true) addWarning(warningCodes, "redesign_rejected");
  if (input.autonomousBuyerOutreachRequested === true) {
    addWarning(warningCodes, "autonomous_buyer_outreach_rejected");
  }
  if (input.autonomousNegotiationRequested === true) addWarning(warningCodes, "autonomous_negotiation_rejected");
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
    input.r61aScopeReviewed !== true ||
    input.uiSurfaceReviewed !== true ||
    input.visibilityConceptsReviewed !== true ||
    input.buyerReadyVisibilityReviewed !== true ||
    input.packageCompletenessVisibilityReviewed !== true ||
    input.buyerFitVisibilityReviewed !== true ||
    input.demandAlignmentVisibilityReviewed !== true ||
    input.wordingReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    operatorReviewRequired;
  const scopeStatus: R61BuyerReadyDispositionUiScopeStatus = hasForbiddenRequest(input)
    ? "ui_scope_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "ui_scope_ready_for_later_implementation";
  const result: R61BuyerReadyDispositionUiScopeAuditResult = {
    phase: "R61B",
    surface: "buyer_ready_disposition_priority_intelligence_ui",
    scopeStatus,
    allowedFutureUiSections,
    buyerReadyPriorityVisibilityConcepts,
    buyerReadyVisibilityWording,
    nearBuyerReadyVisibilityWording,
    packageCompletenessVisibilityWording,
    buyerFitReviewVisibilityWording,
    buyerDemandAlignmentVisibilityWording,
    dispositionBottleneckVisibilityWording,
    blockedDispositionVisibilityWording,
    governanceStopVisibilityWording,
    safeOperatorGuidanceWording,
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
    nextSuggestedPhase: "R61C - Buyer-Ready Disposition Priority Intelligence Read-Only UI Implementation Scope Contract",
    summary: "R61B buyer-ready disposition priority UI scope audit only.",
    ...safetyFlags,
  };

  return { ...result, summary: summarizeR61BuyerReadyDispositionUiScopeAudit(result) };
}
