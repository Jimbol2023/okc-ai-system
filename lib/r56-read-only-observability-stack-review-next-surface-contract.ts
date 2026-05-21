export type R56ReadOnlyObservabilityStackStatus =
  | "stack_review_blocked"
  | "operator_review_required"
  | "next_surface_plan_ready"
  | "do_not_expand_yet";

export type R56ReviewedSurface =
  | "dashboard_revenue_metrics"
  | "lead_detail_observability"
  | "approval_queue_observability";

export type R56NextSurfaceCandidate =
  | "closing_pipeline_observability"
  | "buyer_disposition_observability"
  | "follow_up_readiness_observability"
  | "manual_revenue_workday_summary"
  | "deal_readiness_observability"
  | "do_not_expand_yet";

export type R56WarningCode =
  | "r56a_observability_stack_review_contract_only"
  | "input_missing"
  | "r53_review_required"
  | "r54_review_required"
  | "r55_review_required"
  | "governance_drift_review_required"
  | "accessibility_review_required"
  | "operator_review_required"
  | "approval_permission_review_required"
  | "runtime_risk_review_required"
  | "ui_implementation_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "approval_grants_execution_rejected"
  | "read_only_required"
  | "advisory_only_required"
  | "simulation_only_required"
  | "live_execution_allowed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "provider_called_must_be_false"
  | "sent_must_be_false"
  | "persistence_not_allowed_now"
  | "polling_not_allowed"
  | "runtime_activation_not_allowed"
  | "ui_implementation_not_allowed_now"
  | "approval_grants_execution_must_be_false";

export type R56CandidateScore = {
  blastRadius: number;
  executionProximitySafety: number;
  permissionConfusionSafety: number;
  manualRevenueUsefulness: number;
  accessibilitySimplicity: number;
  dependencySafety: number;
  inMemoryDataAvailability: number;
  implementationSimplicity: number;
  governanceClarity: number;
  automationWordingDriftSafety: number;
};

export type R56CandidateRanking = {
  surface: R56NextSurfaceCandidate;
  rank: number;
  totalScore: number;
  score: R56CandidateScore;
  recommendation: "recommended_next" | "safe_later" | "defer" | "stop_expansion";
  reasons: string[];
  requiredBoundaries: string[];
};

export type R56SafetyFlags = {
  readOnly: true;
  advisoryOnly: true;
  simulationOnly: true;
  liveExecutionAllowed: false;
  providerActivationAllowed: false;
  providerCalled: false;
  sent: false;
  persistenceAllowedNow: false;
  pollingAllowed: false;
  runtimeActivationAllowed: false;
  uiImplementationAllowedNow: false;
  approvalGrantsExecution: false;
};

export type R56ImplementationBoundaries = {
  noUiImplementationNow: true;
  noNewSurfacesNow: true;
  noApprovalBehaviorChanges: true;
  noNewRoutes: true;
  noPolling: true;
  noPersistence: true;
  noProviderControls: true;
  noRuntimeExecution: true;
  noAutomationAgent: true;
  noBulkActions: true;
  futureWorkRequiresScopeContractFirst: true;
  futureUiRequiresSeparateAuthorization: true;
};

export type R56ReadOnlyObservabilityStackReviewInput = {
  r53DashboardReviewed?: boolean;
  r54LeadDetailReviewed?: boolean;
  r55ApprovalQueueReviewed?: boolean;
  governanceDriftReviewed?: boolean;
  accessibilityReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  approvalPermissionRiskReviewed?: boolean;
  runtimeProviderPollingPersistenceRiskReviewed?: boolean;
  uiImplementationRequested?: boolean;
  routeChangeRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  approvalGrantsExecution?: boolean;
  readOnly?: boolean;
  advisoryOnly?: boolean;
  simulationOnly?: boolean;
  liveExecutionAllowed?: boolean;
  providerActivationAllowed?: boolean;
  providerCalled?: boolean;
  sent?: boolean;
  persistenceAllowedNow?: boolean;
  pollingAllowed?: boolean;
  runtimeActivationAllowed?: boolean;
  uiImplementationAllowedNow?: boolean;
  extraReviewNotes?: string[];
};

export type R56ReadOnlyObservabilityStackReviewResult = R56SafetyFlags & {
  stackStatus: R56ReadOnlyObservabilityStackStatus;
  reviewedSurfaces: R56ReviewedSurface[];
  governanceDriftFindings: string[];
  accessibilityConsistencyFindings: string[];
  safetyInvariantFindings: string[];
  candidateRankings: R56CandidateRanking[];
  recommendedNextSurface: R56NextSurfaceCandidate;
  recommendationReasons: string[];
  blockedPatterns: string[];
  requiredSafetyCopy: string[];
  implementationBoundaries: R56ImplementationBoundaries;
  rejectionReasons: string[];
  safetyFlags: R56SafetyFlags;
  nextSuggestedPhase: string;
  operatorReviewRequired: boolean;
  warningCodes: string[];
  reviewNotes: string[];
  summary: string;
};

export type R56ObservabilityStackInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R56SafetyFlags = {
  readOnly: true,
  advisoryOnly: true,
  simulationOnly: true,
  liveExecutionAllowed: false,
  providerActivationAllowed: false,
  providerCalled: false,
  sent: false,
  persistenceAllowedNow: false,
  pollingAllowed: false,
  runtimeActivationAllowed: false,
  uiImplementationAllowedNow: false,
  approvalGrantsExecution: false,
};

const reviewedSurfaces: R56ReviewedSurface[] = [
  "dashboard_revenue_metrics",
  "lead_detail_observability",
  "approval_queue_observability",
];

const governanceDriftFindings = [
  "R53 dashboard metrics remain read-only and in-memory derived.",
  "R54 lead detail observability remains advisory and point-of-work scoped.",
  "R55 approval queue observability remains elevated-risk but locked by review-only wording.",
  "No reviewed surface should convert observability into permission, execution readiness, or provider readiness.",
];

const accessibilityConsistencyFindings = [
  "Use semantic headings for every observability region.",
  "Use readable labels and text-based status meaning.",
  "Do not rely on color alone for blocked, review-required, or do-not-proceed states.",
  "Avoid motion, focus movement, polling, auto-refresh dependency, and clutter.",
  "Keep future surfaces concise enough for keyboard and screen-reader review.",
];

const safetyInvariantFindings = [
  "Read-only, advisory-only, and simulation-only invariants remain required.",
  "Provider calls, sending, persistence, polling, runtime activation, and UI implementation remain blocked in R56A.",
  "Approval does not grant execution and must remain explicitly separated from send or provider semantics.",
];

const blockedPatterns = [
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
  "queue execution",
  "auto release",
  "bulk send",
  "sending is allowed",
  "approval grants execution",
  "provider readiness",
  "runtime readiness",
  "automation readiness",
  "persistence readiness",
  "polling readiness",
];

const requiredSafetyCopy = [
  "Observability is read-only and advisory-only.",
  "Metrics and summaries do not send messages, activate providers, or grant execution permission.",
  "Human review remains required before seller or buyer-facing action.",
  "Blocked, DNC, opt-out, missing-data, and governance-risk states are do-not-proceed signals.",
  "Future UI requires a separate scope contract and explicit authorization.",
];

const implementationBoundaries: R56ImplementationBoundaries = {
  noUiImplementationNow: true,
  noNewSurfacesNow: true,
  noApprovalBehaviorChanges: true,
  noNewRoutes: true,
  noPolling: true,
  noPersistence: true,
  noProviderControls: true,
  noRuntimeExecution: true,
  noAutomationAgent: true,
  noBulkActions: true,
  futureWorkRequiresScopeContractFirst: true,
  futureUiRequiresSeparateAuthorization: true,
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

function addWarning(warningCodes: string[], warningCode: R56WarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function totalScore(score: R56CandidateScore) {
  return Object.values(score).reduce((sum, value) => sum + value, 0);
}

const candidateRankingsWithoutRank: Array<Omit<R56CandidateRanking, "rank" | "totalScore">> = [
  {
    surface: "manual_revenue_workday_summary",
    score: {
      blastRadius: 10,
      executionProximitySafety: 10,
      permissionConfusionSafety: 10,
      manualRevenueUsefulness: 9,
      accessibilitySimplicity: 9,
      dependencySafety: 10,
      inMemoryDataAvailability: 9,
      implementationSimplicity: 9,
      governanceClarity: 10,
      automationWordingDriftSafety: 10,
    },
    recommendation: "recommended_next",
    reasons: [
      "Keeps the next observability layer far from approval controls and provider semantics.",
      "Summarizes manual workday progress without creating action controls.",
      "Can reuse existing in-memory lead and review summaries without new routes or persistence.",
      "Has strong accessibility fit because it can be concise, ordered, and text-first.",
    ],
    requiredBoundaries: [
      "Scope contract first.",
      "No UI implementation during R56A.",
      "No polling, persistence, send controls, provider language, or approval-as-permission wording.",
    ],
  },
  {
    surface: "follow_up_readiness_observability",
    score: {
      blastRadius: 8,
      executionProximitySafety: 7,
      permissionConfusionSafety: 7,
      manualRevenueUsefulness: 10,
      accessibilitySimplicity: 8,
      dependencySafety: 8,
      inMemoryDataAvailability: 8,
      implementationSimplicity: 8,
      governanceClarity: 8,
      automationWordingDriftSafety: 7,
    },
    recommendation: "safe_later",
    reasons: [
      "Highly useful for manual revenue operations.",
      "Needs careful wording because follow-up surfaces can drift toward automation or send semantics.",
      "Should follow a broader manual workday summary so the manual-only doctrine remains visible.",
    ],
    requiredBoundaries: [
      "Manual follow-up wording only.",
      "No auto-follow-up language.",
      "No provider, send, or schedule execution controls.",
    ],
  },
  {
    surface: "buyer_disposition_observability",
    score: {
      blastRadius: 8,
      executionProximitySafety: 8,
      permissionConfusionSafety: 8,
      manualRevenueUsefulness: 9,
      accessibilitySimplicity: 8,
      dependencySafety: 7,
      inMemoryDataAvailability: 7,
      implementationSimplicity: 7,
      governanceClarity: 8,
      automationWordingDriftSafety: 8,
    },
    recommendation: "safe_later",
    reasons: [
      "Useful for disposition readiness and buyer package completeness.",
      "May require more careful data boundaries around buyer-facing action.",
      "Should remain advisory until package and buyer readiness wording is locked.",
    ],
    requiredBoundaries: [
      "No buyer sharing controls.",
      "No provider-ready or buyer-send wording.",
      "Use package completeness as advisory visibility only.",
    ],
  },
  {
    surface: "deal_readiness_observability",
    score: {
      blastRadius: 7,
      executionProximitySafety: 7,
      permissionConfusionSafety: 7,
      manualRevenueUsefulness: 9,
      accessibilitySimplicity: 8,
      dependencySafety: 7,
      inMemoryDataAvailability: 7,
      implementationSimplicity: 7,
      governanceClarity: 8,
      automationWordingDriftSafety: 7,
    },
    recommendation: "safe_later",
    reasons: [
      "Useful for revenue prioritization.",
      "Close to deal movement semantics, so it needs a dedicated scope contract before UI.",
      "Must not imply contract, close, or execution readiness.",
    ],
    requiredBoundaries: [
      "No deal movement controls.",
      "No close-ready permission wording.",
      "No persistence-backed progress claims.",
    ],
  },
  {
    surface: "closing_pipeline_observability",
    score: {
      blastRadius: 6,
      executionProximitySafety: 6,
      permissionConfusionSafety: 7,
      manualRevenueUsefulness: 8,
      accessibilitySimplicity: 7,
      dependencySafety: 6,
      inMemoryDataAvailability: 6,
      implementationSimplicity: 6,
      governanceClarity: 7,
      automationWordingDriftSafety: 7,
    },
    recommendation: "defer",
    reasons: [
      "Potentially valuable but nearer to transaction operations.",
      "Likely needs stronger workflow definitions and data contracts first.",
      "Should wait until manual summary and deal readiness scopes are mature.",
    ],
    requiredBoundaries: [
      "No closing action controls.",
      "No legal or transaction readiness claims.",
      "No persistence-backed milestones until persistence governance is active.",
    ],
  },
  {
    surface: "do_not_expand_yet",
    score: {
      blastRadius: 10,
      executionProximitySafety: 10,
      permissionConfusionSafety: 10,
      manualRevenueUsefulness: 3,
      accessibilitySimplicity: 10,
      dependencySafety: 10,
      inMemoryDataAvailability: 10,
      implementationSimplicity: 10,
      governanceClarity: 10,
      automationWordingDriftSafety: 10,
    },
    recommendation: "stop_expansion",
    reasons: [
      "Always safest if any governance drift or safety invariant problem is found.",
      "Preserves lockdown until another scope contract is justified.",
      "Lower operational value than a manual workday summary when the stack review passes.",
    ],
    requiredBoundaries: ["Use when any reviewed surface fails safety or accessibility checks."],
  },
];

const candidateRankings = candidateRankingsWithoutRank
  .map((candidate) => ({
    ...candidate,
    totalScore: totalScore(candidate.score),
  }))
  .sort((left, right) => right.totalScore - left.totalScore)
  .map((candidate, index) => ({
    ...candidate,
    rank: index + 1,
  }));

function hasForbiddenRequest(input: R56ReadOnlyObservabilityStackReviewInput) {
  return (
    input.uiImplementationRequested === true ||
    input.routeChangeRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.approvalGrantsExecution === true ||
    input.readOnly === false ||
    input.advisoryOnly === false ||
    input.simulationOnly === false ||
    input.liveExecutionAllowed === true ||
    input.providerActivationAllowed === true ||
    input.providerCalled === true ||
    input.sent === true ||
    input.persistenceAllowedNow === true ||
    input.pollingAllowed === true ||
    input.runtimeActivationAllowed === true ||
    input.uiImplementationAllowedNow === true
  );
}

export function assertR56ReadOnlyObservabilityStackReviewInvariants(
  result: Pick<
    R56ReadOnlyObservabilityStackReviewResult,
    | "readOnly"
    | "advisoryOnly"
    | "simulationOnly"
    | "liveExecutionAllowed"
    | "providerActivationAllowed"
    | "providerCalled"
    | "sent"
    | "persistenceAllowedNow"
    | "pollingAllowed"
    | "runtimeActivationAllowed"
    | "uiImplementationAllowedNow"
    | "approvalGrantsExecution"
  >,
): R56ObservabilityStackInvariantCheck {
  const warningCodes: string[] = [];

  if (result.readOnly !== true) warningCodes.push("read_only_required");
  if (result.advisoryOnly !== true) warningCodes.push("advisory_only_required");
  if (result.simulationOnly !== true) warningCodes.push("simulation_only_required");
  if (result.liveExecutionAllowed !== false) warningCodes.push("live_execution_allowed_must_be_false");
  if (result.providerActivationAllowed !== false) warningCodes.push("provider_activation_allowed_must_be_false");
  if (result.providerCalled !== false) warningCodes.push("provider_called_must_be_false");
  if (result.sent !== false) warningCodes.push("sent_must_be_false");
  if (result.persistenceAllowedNow !== false) warningCodes.push("persistence_not_allowed_now");
  if (result.pollingAllowed !== false) warningCodes.push("polling_not_allowed");
  if (result.runtimeActivationAllowed !== false) warningCodes.push("runtime_activation_not_allowed");
  if (result.uiImplementationAllowedNow !== false) warningCodes.push("ui_implementation_not_allowed_now");
  if (result.approvalGrantsExecution !== false) warningCodes.push("approval_grants_execution_must_be_false");

  return {
    passed: warningCodes.length === 0,
    warningCodes,
  };
}

export function summarizeR56ReadOnlyObservabilityStackReview(
  result: R56ReadOnlyObservabilityStackReviewResult,
) {
  const invariantCheck = assertR56ReadOnlyObservabilityStackReviewInvariants(result);

  return boundSummary(
    `R56A observability stack review status is ${result.stackStatus}. ` +
      `${result.reviewedSurfaces.length} surfaces were reviewed. ` +
      `Recommended next surface is ${result.recommendedNextSurface}. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract is planning-only and cannot authorize UI implementation, routes, polling, persistence, providers, sending, automation, approval execution, or runtime activation.",
  );
}

export function createR56ReadOnlyObservabilityStackReviewNextSurfaceContract(
  input: R56ReadOnlyObservabilityStackReviewInput = {},
): R56ReadOnlyObservabilityStackReviewResult {
  const warningCodes: string[] = [];
  const rejectionReasons: string[] = [];
  const reviewNotes = collectNotes(input.extraReviewNotes);

  addWarning(warningCodes, "r56a_observability_stack_review_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.r53DashboardReviewed !== true) addWarning(warningCodes, "r53_review_required");
  if (input.r54LeadDetailReviewed !== true) addWarning(warningCodes, "r54_review_required");
  if (input.r55ApprovalQueueReviewed !== true) addWarning(warningCodes, "r55_review_required");
  if (input.governanceDriftReviewed !== true) addWarning(warningCodes, "governance_drift_review_required");
  if (input.accessibilityReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.approvalPermissionRiskReviewed !== true) addWarning(warningCodes, "approval_permission_review_required");
  if (input.runtimeProviderPollingPersistenceRiskReviewed !== true) addWarning(warningCodes, "runtime_risk_review_required");
  if (input.uiImplementationRequested === true) addWarning(warningCodes, "ui_implementation_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.approvalGrantsExecution === true) addWarning(warningCodes, "approval_grants_execution_rejected");
  if (input.readOnly === false) addWarning(warningCodes, "read_only_required");
  if (input.advisoryOnly === false) addWarning(warningCodes, "advisory_only_required");
  if (input.simulationOnly === false) addWarning(warningCodes, "simulation_only_required");
  if (input.liveExecutionAllowed === true) addWarning(warningCodes, "live_execution_allowed_must_be_false");
  if (input.providerActivationAllowed === true) addWarning(warningCodes, "provider_activation_allowed_must_be_false");
  if (input.providerCalled === true) addWarning(warningCodes, "provider_called_must_be_false");
  if (input.sent === true) addWarning(warningCodes, "sent_must_be_false");
  if (input.persistenceAllowedNow === true) addWarning(warningCodes, "persistence_not_allowed_now");
  if (input.pollingAllowed === true) addWarning(warningCodes, "polling_not_allowed");
  if (input.runtimeActivationAllowed === true) addWarning(warningCodes, "runtime_activation_not_allowed");
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
    input.r53DashboardReviewed !== true ||
    input.r54LeadDetailReviewed !== true ||
    input.r55ApprovalQueueReviewed !== true ||
    input.governanceDriftReviewed !== true ||
    input.accessibilityReviewed !== true ||
    input.approvalPermissionRiskReviewed !== true ||
    input.runtimeProviderPollingPersistenceRiskReviewed !== true ||
    operatorReviewRequired;
  const forbiddenRequest = hasForbiddenRequest(input);
  const recommendedNextSurface: R56NextSurfaceCandidate = forbiddenRequest ? "do_not_expand_yet" : "manual_revenue_workday_summary";
  const stackStatus: R56ReadOnlyObservabilityStackStatus = forbiddenRequest
    ? "stack_review_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : recommendedNextSurface === "do_not_expand_yet"
        ? "do_not_expand_yet"
        : "next_surface_plan_ready";
  const recommendationReasons =
    candidateRankings.find((candidate) => candidate.surface === recommendedNextSurface)?.reasons ?? [];
  const nextSuggestedPhase =
    recommendedNextSurface === "manual_revenue_workday_summary"
      ? "R56B - Manual Revenue Workday Summary Read-Only Observability Scope Contract, without UI implementation or runtime activation."
      : "Pause observability expansion until governance drift, safety, and accessibility reviews are complete.";
  const result: R56ReadOnlyObservabilityStackReviewResult = {
    stackStatus,
    reviewedSurfaces,
    governanceDriftFindings,
    accessibilityConsistencyFindings,
    safetyInvariantFindings,
    candidateRankings,
    recommendedNextSurface,
    recommendationReasons,
    blockedPatterns,
    requiredSafetyCopy,
    implementationBoundaries,
    rejectionReasons,
    safetyFlags,
    nextSuggestedPhase,
    operatorReviewRequired,
    warningCodes,
    reviewNotes,
    summary: "R56A read-only observability stack review and next-surface planning contract only.",
    ...safetyFlags,
  };

  return {
    ...result,
    summary: summarizeR56ReadOnlyObservabilityStackReview(result),
  };
}
