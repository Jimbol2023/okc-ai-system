export type R65ReadonlyUiScopeStatus =
  | "implementation_scope_blocked"
  | "operator_review_required"
  | "read_only_ui_implementation_scope_ready";

export type R65ReadonlyUiScopeInput = {
  r65bUiScopeAuditReviewed?: boolean;
  futureSurfaceReviewed?: boolean;
  readOnlyDisplayReviewed?: boolean;
  safeCopyReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  dangerousPatternsReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequested?: boolean;
  dashboardChangeRequested?: boolean;
  routeChangeRequested?: boolean;
  providerActivationRequested?: boolean;
  enrichmentActivationRequested?: boolean;
  skipTracingRequested?: boolean;
  scrapingRequested?: boolean;
  externalLookupRequested?: boolean;
  outreachExecutionRequested?: boolean;
  campaignLaunchRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  executionControlRequested?: boolean;
  autonomousQualificationRequested?: boolean;
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

export type R65ReadonlyUiSafetyFlags = {
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
  enrichmentActivationAllowed: false;
  skipTracingAllowed: false;
};

export type R65ReadonlyUiScopeResult = R65ReadonlyUiSafetyFlags & {
  phase: "R65C";
  surface: "lead_quality_readonly_ui_implementation_scope";
  scopeStatus: R65ReadonlyUiScopeStatus;
  allowedFutureUiSurface: {
    surface: "existing_dashboard";
    futureLikelyFile: "app/(dashboard)/dashboard/page.tsx";
    futureComponentAllowed: "components/dashboard/lead-quality-intelligence-summary.tsx";
    routeChangesAllowed: false;
    implementationAllowedNow: false;
  };
  forbiddenSurfaces: string[];
  allowedReadOnlyDisplayRules: string[];
  safeCopyRules: string[];
  noExecutionGuarantees: string[];
  accessibilityGuarantees: string[];
  invariantAssertions: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R65ReadonlyUiSafetyFlags;
  operatorReviewRequired: boolean;
  scopeNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

const safetyFlags: R65ReadonlyUiSafetyFlags = {
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
  enrichmentActivationAllowed: false,
  skipTracingAllowed: false,
};

const forbiddenSurfaces = [
  "new lead enrichment console",
  "new skip-tracing panel",
  "new provider validation console",
  "new external lookup panel",
  "new seller outreach console",
  "new buyer outreach console",
  "new campaign tab",
  "new execution queue",
  "new autonomous qualification panel",
  "new approval-to-execution workflow",
  "new route unless later explicitly authorized",
];

const allowedReadOnlyDisplayRules = [
  "Show governance stop visibility before lead quality priority.",
  "Show incomplete lead data, missing contact/address, missing seller motivation, missing timeline, missing asking price, missing property condition, missing ARV/repair estimate, duplicate lead, stale lead, low-confidence lead, inconsistent lead data, acquisition readiness, disposition readiness, seller follow-up readiness, revenue-risk, and manual data cleanup priority as read-only labels.",
  "Show human verification required before workflow action.",
  "Do not show buttons, links, execution handlers, provider activation, enrichment activation, skip tracing, scraping, external lookups, campaigns, polling, persistence, runtime activation, or autonomous routing.",
];

const safeCopyRules = [
  "Manual lead quality review recommended.",
  "Lead quality priority label is advisory only.",
  "Review lead data before taking action.",
  "Human verification required before workflow action.",
  "Manual data cleanup priority.",
  "Governance stop signals must be resolved first.",
  "Lead quality priority does not mean enrich or contact.",
];

const noExecutionGuarantees = [
  "No seller contact, buyer contact, SMS, email, calls, campaigns, outreach execution, provider activation, enrichment activation, skip tracing, scraping, external lookup activation, auto rejection, auto assignment, auto qualification, auto routing, workflow creation, workflow execution, persistence, polling, runtime activation, or approval-grants-execution.",
];

const accessibilityGuarantees = [
  "Use semantic headings.",
  "Use aria-labelledby and concise screen-reader-friendly summary text.",
  "Use readable labels and text-based status meaning.",
  "Do not rely on color alone.",
  "No motion dependency, focus movement, auto-refresh, or polling.",
  "Place governance stop visibility first in reading order.",
];

const invariantAssertions = [
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
  "enrichmentActivationAllowed:false",
  "skipTracingAllowed:false",
];

function addUnique(list: string[], value: string) {
  const trimmed = value.trim();
  if (trimmed && !list.includes(trimmed)) list.push(trimmed.length <= 180 ? trimmed : `${trimmed.slice(0, 180)}...`);
}

function hasForbiddenRequest(input: R65ReadonlyUiScopeInput) {
  return Boolean(
    input.uiImplementationRequested ||
      input.dashboardChangeRequested ||
      input.routeChangeRequested ||
      input.providerActivationRequested ||
      input.enrichmentActivationRequested ||
      input.skipTracingRequested ||
      input.scrapingRequested ||
      input.externalLookupRequested ||
      input.outreachExecutionRequested ||
      input.campaignLaunchRequested ||
      input.automationAgentRequested ||
      input.pollingRequested ||
      input.persistenceRequested ||
      input.executionControlRequested ||
      input.autonomousQualificationRequested ||
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

export function createR65LeadQualityReadonlyUiImplementationScopeContract(
  input: R65ReadonlyUiScopeInput = {},
): R65ReadonlyUiScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const scopeNotes: string[] = [];
  for (const note of input.extraScopeNotes ?? []) addUnique(scopeNotes, note);

  addUnique(warningCodes, "r65c_readonly_ui_implementation_scope_contract_only");
  if (Object.keys(input).length === 0) addUnique(warningCodes, "input_missing");
  if (input.r65bUiScopeAuditReviewed !== true) addUnique(warningCodes, "r65b_ui_scope_audit_required");
  if (input.futureSurfaceReviewed !== true) addUnique(warningCodes, "future_surface_review_required");
  if (input.readOnlyDisplayReviewed !== true) addUnique(warningCodes, "read_only_display_review_required");
  if (input.safeCopyReviewed !== true) addUnique(warningCodes, "safe_copy_review_required");
  if (input.governanceBoundaryReviewed !== true) addUnique(warningCodes, "governance_boundary_review_required");
  if (input.accessibilityReviewed !== true) addUnique(warningCodes, "accessibility_review_required");
  if (input.dangerousPatternsReviewed !== true) addUnique(warningCodes, "dangerous_patterns_review_required");
  if (input.operatorReviewCompleted !== true) addUnique(warningCodes, "operator_review_required");

  const rejectionMap: Array<[boolean | undefined, string]> = [
    [input.uiImplementationRequested, "ui_implementation_rejected"],
    [input.providerActivationRequested, "provider_activation_rejected"],
    [input.enrichmentActivationRequested, "enrichment_activation_rejected"],
    [input.skipTracingRequested, "skip_tracing_rejected"],
    [input.scrapingRequested, "scraping_rejected"],
    [input.externalLookupRequested, "external_lookup_rejected"],
    [input.outreachExecutionRequested, "outreach_execution_rejected"],
    [input.campaignLaunchRequested, "campaign_launch_rejected"],
    [input.pollingRequested, "polling_rejected"],
    [input.persistenceRequested, "persistence_rejected"],
    [input.executionControlRequested, "execution_control_rejected"],
    [input.autonomousQualificationRequested, "autonomous_qualification_rejected"],
    [input.autonomousRoutingRequested, "autonomous_routing_rejected"],
    [input.approvalGrantsExecution, "approval_grants_execution_rejected"],
  ];
  for (const [flag, code] of rejectionMap) if (flag === true) addUnique(warningCodes, code);
  if (input.readOnly === false) addUnique(warningCodes, "read_only_required");
  if (input.providerCalled === true) addUnique(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addUnique(warningCodes, "sent_must_be_false");
  if (input.uiImplementationAllowedNow === true) addUnique(warningCodes, "ui_implementation_not_allowed_now");
  for (const warningCode of warningCodes) if (warningCode.endsWith("_rejected") || warningCode.endsWith("_must_be_false") || warningCode.endsWith("_not_allowed_now")) addUnique(rejectionReasons, warningCode);

  const missingReview =
    input.r65bUiScopeAuditReviewed !== true ||
    input.futureSurfaceReviewed !== true ||
    input.readOnlyDisplayReviewed !== true ||
    input.safeCopyReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    input.operatorReviewCompleted !== true;
  const scopeStatus: R65ReadonlyUiScopeStatus = hasForbiddenRequest(input)
    ? "implementation_scope_blocked"
    : missingReview
      ? "operator_review_required"
      : "read_only_ui_implementation_scope_ready";

  const result: R65ReadonlyUiScopeResult = {
    phase: "R65C",
    surface: "lead_quality_readonly_ui_implementation_scope",
    scopeStatus,
    allowedFutureUiSurface: {
      surface: "existing_dashboard",
      futureLikelyFile: "app/(dashboard)/dashboard/page.tsx",
      futureComponentAllowed: "components/dashboard/lead-quality-intelligence-summary.tsx",
      routeChangesAllowed: false,
      implementationAllowedNow: false,
    },
    forbiddenSurfaces,
    allowedReadOnlyDisplayRules,
    safeCopyRules,
    noExecutionGuarantees,
    accessibilityGuarantees,
    invariantAssertions,
    warningCodes,
    rejectionReasons,
    safetyFlags,
    operatorReviewRequired: input.operatorReviewCompleted !== true,
    scopeNotes,
    nextSuggestedPhase: "R65D - Lead Quality Intelligence Read-Only UI Implementation",
    summary: `R65C lead quality read-only UI implementation scope status is ${scopeStatus}. Existing dashboard is the only future surface and implementation is not authorized by this contract.`,
    ...safetyFlags,
  };
  return result;
}
