export type R66RiskAuditStatus = "risk_audit_blocked" | "operator_review_required" | "risk_permission_audit_complete";

export type R66RiskAuditInput = {
  r66aScopeReviewed?: boolean;
  approvalPermissionReviewed?: boolean;
  providerActivationReviewed?: boolean;
  runtimeActivationReviewed?: boolean;
  auditLogReviewed?: boolean;
  failClosedReviewed?: boolean;
  governanceReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  unsafePermissionFound?: boolean;
  approvalExecutionFound?: boolean;
  providerActivationFound?: boolean;
  runtimeActivationFound?: boolean;
  pollingFound?: boolean;
  persistenceFound?: boolean;
  backgroundJobFound?: boolean;
  executionQueueFound?: boolean;
  campaignFound?: boolean;
  outreachFound?: boolean;
  readOnly?: boolean;
  advisoryOnly?: boolean;
  simulationOnly?: boolean;
  providerCalled?: boolean;
  sent?: boolean;
  approvalGrantsExecution?: boolean;
  extraAuditNotes?: string[];
};

export type R66RiskAuditFlags = {
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
  executionAllowedNow: false;
};

export type R66RiskAuditResult = R66RiskAuditFlags & {
  phase: "R66B";
  surface: "controlled_execution_risk_permission_boundary_audit";
  auditStatus: R66RiskAuditStatus;
  approvalPermissionBoundaries: string[];
  providerActivationBoundaries: string[];
  runtimeActivationBoundaries: string[];
  auditRequirements: string[];
  failClosedRequirements: string[];
  warningCodes: string[];
  rejectionReasons: string[];
  safetyFlags: R66RiskAuditFlags;
  auditNotes: string[];
  nextSuggestedPhase: string;
  summary: string;
};

const safetyFlags: R66RiskAuditFlags = {
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
  executionAllowedNow: false,
};

const approvalPermissionBoundaries = [
  "Approval is a review result and cannot send, call, queue, route, run, escalate, activate providers, or start workflows.",
  "Future execution would require a separate operator confirmation after governance checks and simulation evidence.",
  "Permission must be separated by role, action, provider, runtime, audit, and final operator confirmation.",
];

const providerActivationBoundaries = [
  "Provider and Twilio activation remain blocked.",
  "No provider credentials, provider calls, provider tests, SMS, email, calls, campaigns, or outreach systems are authorized.",
  "Provider readiness can be visible only as blocked advisory status.",
];

const runtimeActivationBoundaries = [
  "Runtime activation, polling, background jobs, scheduled work, execution queues, and workflow runners remain blocked.",
  "No hidden state machine, persistence, job creation, queue creation, or autonomous routing is allowed.",
];

const auditRequirements = [
  "Any future action must have pre-action audit requirements before provider or runtime consideration.",
  "Audit visibility cannot itself execute, queue, persist, poll, or activate providers.",
];

const failClosedRequirements = [
  "Missing governance, approval separation, provider boundary, runtime boundary, audit, or operator review must fail closed.",
  "Any detected approval-to-execution drift, provider path, runtime path, polling, persistence, background job, campaign, or outreach path blocks the audit.",
];

function addUnique(list: string[], value: string) {
  const trimmed = value.trim();
  if (trimmed && !list.includes(trimmed)) list.push(trimmed.length <= 180 ? trimmed : `${trimmed.slice(0, 180)}...`);
}

export function createR66ControlledExecutionRiskPermissionBoundaryAudit(input: R66RiskAuditInput = {}): R66RiskAuditResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const auditNotes: string[] = [];
  for (const note of input.extraAuditNotes ?? []) addUnique(auditNotes, note);

  if (Object.keys(input).length === 0) addUnique(warningCodes, "input_missing");
  if (input.r66aScopeReviewed !== true) addUnique(warningCodes, "r66a_scope_review_required");
  if (input.approvalPermissionReviewed !== true) addUnique(warningCodes, "approval_permission_review_required");
  if (input.providerActivationReviewed !== true) addUnique(warningCodes, "provider_activation_review_required");
  if (input.runtimeActivationReviewed !== true) addUnique(warningCodes, "runtime_activation_review_required");
  if (input.auditLogReviewed !== true) addUnique(warningCodes, "audit_log_review_required");
  if (input.failClosedReviewed !== true) addUnique(warningCodes, "fail_closed_review_required");
  if (input.governanceReviewed !== true) addUnique(warningCodes, "governance_review_required");
  if (input.operatorReviewCompleted !== true) addUnique(warningCodes, "operator_review_required");

  const foundMap: Array<[boolean | undefined, string]> = [
    [input.unsafePermissionFound, "unsafe_permission_found"],
    [input.approvalExecutionFound, "approval_execution_found"],
    [input.providerActivationFound, "provider_activation_found"],
    [input.runtimeActivationFound, "runtime_activation_found"],
    [input.pollingFound, "polling_found"],
    [input.persistenceFound, "persistence_found"],
    [input.backgroundJobFound, "background_job_found"],
    [input.executionQueueFound, "execution_queue_found"],
    [input.campaignFound, "campaign_found"],
    [input.outreachFound, "outreach_found"],
  ];
  for (const [flag, code] of foundMap) if (flag === true) addUnique(warningCodes, code);
  if (input.providerCalled === true) addUnique(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addUnique(warningCodes, "sent_must_be_false");
  if (input.approvalGrantsExecution === true) addUnique(warningCodes, "approval_grants_execution_must_be_false");
  for (const warningCode of warningCodes) if (warningCode.includes("found") || warningCode.endsWith("_required") || warningCode.endsWith("_must_be_false")) addUnique(rejectionReasons, warningCode);

  const missingReview =
    input.r66aScopeReviewed !== true ||
    input.approvalPermissionReviewed !== true ||
    input.providerActivationReviewed !== true ||
    input.runtimeActivationReviewed !== true ||
    input.auditLogReviewed !== true ||
    input.failClosedReviewed !== true ||
    input.governanceReviewed !== true ||
    input.operatorReviewCompleted !== true;
  const blocked = foundMap.some(([flag]) => flag === true) || input.providerCalled === true || input.sent === true || input.approvalGrantsExecution === true;
  const auditStatus: R66RiskAuditStatus = blocked
    ? "risk_audit_blocked"
    : missingReview
      ? "operator_review_required"
      : "risk_permission_audit_complete";

  return {
    phase: "R66B",
    surface: "controlled_execution_risk_permission_boundary_audit",
    auditStatus,
    approvalPermissionBoundaries,
    providerActivationBoundaries,
    runtimeActivationBoundaries,
    auditRequirements,
    failClosedRequirements,
    warningCodes,
    rejectionReasons,
    safetyFlags,
    auditNotes,
    nextSuggestedPhase: "R66C - Controlled Execution Read-Only UI Scope Contract",
    summary: `R66B risk and permission audit status is ${auditStatus}. Approval remains separate from execution; providers, runtime activation, polling, persistence, campaigns, outreach, and background jobs remain blocked.`,
    ...safetyFlags,
  };
}
