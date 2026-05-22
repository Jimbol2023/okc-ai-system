export type R66ReadonlyUiScopeStatus =
  | "ui_scope_blocked"
  | "operator_review_required"
  | "read_only_ui_scope_ready";

export type R66ReadonlyUiScopeInput = {
  r66bAuditReviewed?: boolean;
  futureSurfaceReviewed?: boolean;
  readOnlyDisplayReviewed?: boolean;
  safeCopyReviewed?: boolean;
  governanceBoundaryReviewed?: boolean;
  accessibilityReviewed?: boolean;
  dangerousPatternsReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiImplementationRequested?: boolean;
  executionControlRequested?: boolean;
  providerControlRequested?: boolean;
  approvalToSendRequested?: boolean;
  runtimeActivationRequested?: boolean;
  pollingRequested?: boolean;
  campaignControlRequested?: boolean;
  executionQueueRequested?: boolean;
  approvalGrantsExecution?: boolean;
  providerCalled?: boolean;
  sent?: boolean;
  uiImplementationAllowedNow?: boolean;
};

export type R66ReadonlyUiFlags = {
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
};

export type R66ReadonlyUiScopeResult = R66ReadonlyUiFlags & {
  phase: "R66C";
  surface: "controlled_execution_readonly_ui_scope";
  scopeStatus: R66ReadonlyUiScopeStatus;
  allowedFutureUiSurface: {
    surface: "existing_dashboard";
    futureLikelyFile: "app/(dashboard)/dashboard/page.tsx";
    futureComponentAllowed: "components/dashboard/controlled-execution-readiness-summary.tsx";
    implementationAllowedNow: false;
  };
  allowedReadOnlyDisplayRules: string[];
  forbiddenControls: string[];
  safeCopyRules: string[];
  accessibilityGuarantees: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R66ReadonlyUiFlags;
  nextSuggestedPhase: string;
  summary: string;
};

const safetyFlags: R66ReadonlyUiFlags = {
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
};

const allowedReadOnlyDisplayRules = [
  "Show governance stop dominance before execution eligibility.",
  "Show execution eligibility review, approval separation, provider blocked, runtime blocked, simulation-first, audit-before-action, manual operator confirmation required, blocked action explanation, and execution readiness advisory-only as read-only labels.",
  "Do not show buttons, links, execution handlers, provider controls, approval-to-send controls, runtime activation, polling, campaign controls, or execution queue controls.",
];

const forbiddenControls = [
  "send controls",
  "provider controls",
  "approval-to-send controls",
  "runtime activation controls",
  "polling controls",
  "campaign controls",
  "execution queue controls",
  "workflow execution controls",
  "automation controls",
];

const safeCopyRules = [
  "Controlled execution readiness is advisory only.",
  "Execution remains blocked.",
  "Approval does not grant execution.",
  "Provider activation remains blocked.",
  "Runtime activation remains blocked.",
  "Governance stop signals must be resolved first.",
];

const accessibilityGuarantees = [
  "Use semantic headings and readable labels.",
  "Use aria-labelledby and concise screen-reader-friendly summaries.",
  "Use text-based status meaning and no color-only meaning.",
  "No motion dependency, focus movement, auto-refresh, or polling.",
];

function addUnique(list: string[], value: string) {
  if (value && !list.includes(value)) list.push(value);
}

export function createR66ControlledExecutionReadonlyUiScopeContract(input: R66ReadonlyUiScopeInput = {}): R66ReadonlyUiScopeResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  if (Object.keys(input).length === 0) addUnique(warningCodes, "input_missing");
  if (input.r66bAuditReviewed !== true) addUnique(warningCodes, "r66b_audit_required");
  if (input.futureSurfaceReviewed !== true) addUnique(warningCodes, "future_surface_review_required");
  if (input.readOnlyDisplayReviewed !== true) addUnique(warningCodes, "read_only_display_review_required");
  if (input.safeCopyReviewed !== true) addUnique(warningCodes, "safe_copy_review_required");
  if (input.governanceBoundaryReviewed !== true) addUnique(warningCodes, "governance_boundary_review_required");
  if (input.accessibilityReviewed !== true) addUnique(warningCodes, "accessibility_review_required");
  if (input.dangerousPatternsReviewed !== true) addUnique(warningCodes, "dangerous_patterns_review_required");
  if (input.operatorReviewCompleted !== true) addUnique(warningCodes, "operator_review_required");
  const rejectMap: Array<[boolean | undefined, string]> = [
    [input.uiImplementationRequested, "ui_implementation_rejected"],
    [input.executionControlRequested, "execution_control_rejected"],
    [input.providerControlRequested, "provider_control_rejected"],
    [input.approvalToSendRequested, "approval_to_send_rejected"],
    [input.runtimeActivationRequested, "runtime_activation_rejected"],
    [input.pollingRequested, "polling_rejected"],
    [input.campaignControlRequested, "campaign_control_rejected"],
    [input.executionQueueRequested, "execution_queue_rejected"],
    [input.approvalGrantsExecution, "approval_grants_execution_rejected"],
  ];
  for (const [flag, code] of rejectMap) if (flag === true) addUnique(warningCodes, code);
  if (input.providerCalled === true) addUnique(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addUnique(warningCodes, "sent_must_be_false");
  if (input.uiImplementationAllowedNow === true) addUnique(warningCodes, "ui_implementation_not_allowed_now");
  for (const code of warningCodes) if (code.endsWith("_rejected") || code.endsWith("_must_be_false") || code.endsWith("_not_allowed_now")) addUnique(rejectionReasons, code);
  const missing =
    input.r66bAuditReviewed !== true ||
    input.futureSurfaceReviewed !== true ||
    input.readOnlyDisplayReviewed !== true ||
    input.safeCopyReviewed !== true ||
    input.governanceBoundaryReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.dangerousPatternsReviewed !== true ||
    input.operatorReviewCompleted !== true;
  const blocked = rejectionReasons.length > 0;
  const scopeStatus: R66ReadonlyUiScopeStatus = blocked ? "ui_scope_blocked" : missing ? "operator_review_required" : "read_only_ui_scope_ready";
  return {
    phase: "R66C",
    surface: "controlled_execution_readonly_ui_scope",
    scopeStatus,
    allowedFutureUiSurface: {
      surface: "existing_dashboard",
      futureLikelyFile: "app/(dashboard)/dashboard/page.tsx",
      futureComponentAllowed: "components/dashboard/controlled-execution-readiness-summary.tsx",
      implementationAllowedNow: false,
    },
    allowedReadOnlyDisplayRules,
    forbiddenControls,
    safeCopyRules,
    accessibilityGuarantees,
    warningCodes,
    rejectionReasons,
    safetyFlags,
    nextSuggestedPhase: "R66D - Controlled Execution Read-Only UI Implementation",
    summary: `R66C controlled execution read-only UI scope status is ${scopeStatus}. Future visibility is existing-dashboard only and cannot authorize execution controls.`,
    ...safetyFlags,
  };
}
