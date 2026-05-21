export type R54ObservabilityExpansionPlanStatus =
  | "observability_expansion_blocked"
  | "operator_review_required"
  | "observability_expansion_plan_ready";

export type R54CandidateSurface =
  | "lead_detail_observability"
  | "approval_queue_observability"
  | "revenue_operations_summary_contract";

export type R54WarningCode =
  | "r54a_observability_expansion_plan_contract_only"
  | "input_missing"
  | "candidate_review_required"
  | "safety_review_required"
  | "accessibility_review_required"
  | "operator_review_required"
  | "ui_expansion_rejected"
  | "route_change_rejected"
  | "runtime_activation_rejected"
  | "provider_activation_rejected"
  | "live_sending_rejected"
  | "automation_agent_rejected"
  | "polling_rejected"
  | "persistence_rejected"
  | "advisory_to_permission_rejected"
  | "read_only_required"
  | "advisory_only_required"
  | "simulation_only_required"
  | "live_execution_allowed_must_be_false"
  | "provider_activation_allowed_must_be_false"
  | "provider_called_must_be_false"
  | "sent_must_be_false"
  | "persistence_not_allowed_now"
  | "polling_not_allowed"
  | "runtime_activation_not_allowed";

export type R54ReadOnlyObservabilityExpansionPlanInput = {
  candidateSurfacesReviewed?: boolean;
  safetyBoundariesReviewed?: boolean;
  accessibilityExpectationsReviewed?: boolean;
  operatorReviewCompleted?: boolean;
  uiExpansionRequested?: boolean;
  routeChangeRequested?: boolean;
  runtimeActivationRequested?: boolean;
  providerActivationRequested?: boolean;
  liveSendingRequested?: boolean;
  automationAgentRequested?: boolean;
  pollingRequested?: boolean;
  persistenceRequested?: boolean;
  advisoryConvertedToPermission?: boolean;
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
  extraPlanningNotes?: string[];
};

export type R54SurfaceScore = {
  blastRadius: number;
  executionProximityRisk: number;
  permissionConfusionRisk: number;
  manualRevenueUsefulness: number;
  accessibilitySimplicity: number;
  dependencySafety: number;
  implementationSimplicity: number;
  governanceClarity: number;
  inMemoryDataSufficiency: number;
  noActionControlSafety: number;
};

export type R54CandidateRanking = {
  surface: R54CandidateSurface;
  rank: number;
  totalScore: number;
  score: R54SurfaceScore;
  reasons: string[];
  allowedPatterns: string[];
  blockedPatterns: string[];
};

export type R54SafetyFlags = {
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
};

export type R54ReadOnlyObservabilityExpansionPlanResult = R54SafetyFlags & {
  planStatus: R54ObservabilityExpansionPlanStatus;
  recommendedSurface: R54CandidateSurface;
  candidateRankings: R54CandidateRanking[];
  reasons: string[];
  blockedPatterns: string[];
  allowedPatterns: string[];
  safetyFlags: R54SafetyFlags;
  accessibilityExpectations: string[];
  nextSuggestedPhase: string;
  operatorReviewRequired: boolean;
  warningCodes: string[];
  operatorNotes: string[];
  summary: string;
};

export type R54ObservabilityExpansionPlanInvariantCheck = {
  passed: boolean;
  warningCodes: string[];
};

const maxListItems = 40;
const maxTextLength = 180;
const maxSummaryLength = 900;

const safetyFlags: R54SafetyFlags = {
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

function addWarning(warningCodes: string[], warningCode: R54WarningCode) {
  addUnique(warningCodes, warningCode);
}

function collectNotes(values: string[] | undefined) {
  const notes: string[] = [];

  for (const value of values ?? []) {
    addUnique(notes, value);
  }

  return notes;
}

function totalScore(score: R54SurfaceScore) {
  return Object.values(score).reduce((sum, value) => sum + value, 0);
}

const commonBlockedPatterns = [
  "send controls",
  "approval-as-send language",
  "automation controls",
  "provider controls",
  "runtime activation language",
  "polling or auto-refresh dependency",
  "persistence or progress writes",
  "bulk action controls",
  "override governance controls",
];

const commonAllowedPatterns = [
  "read-only metric cards",
  "manual-only reminders",
  "blocked-state visibility",
  "human-review-required text",
  "non-color-only status labels",
  "in-memory input summaries",
  "no-action explanatory copy",
];

const candidateRankingsWithoutRank: Array<Omit<R54CandidateRanking, "rank" | "totalScore">> = [
  {
    surface: "lead_detail_observability",
    score: {
      blastRadius: 9,
      executionProximityRisk: 8,
      permissionConfusionRisk: 8,
      manualRevenueUsefulness: 10,
      accessibilitySimplicity: 8,
      dependencySafety: 9,
      implementationSimplicity: 9,
      governanceClarity: 9,
      inMemoryDataSufficiency: 9,
      noActionControlSafety: 9,
    },
    reasons: [
      "Narrow point-of-work surface with one lead in context.",
      "Can use already-loaded lead detail data without new routes or persistence.",
      "Supports manual seller call prep, missing-data visibility, DNC/opt-out clarity, and buyer package readiness.",
      "Lower permission-confusion risk than approval queue metrics because it does not sit beside approval controls.",
    ],
    allowedPatterns: [
      "read-only lead-specific observability",
      "missing-data summary",
      "manual follow-up context",
      "DNC/opt-out blocked visibility",
      "buyer package readiness reminder",
    ],
    blockedPatterns: commonBlockedPatterns,
  },
  {
    surface: "revenue_operations_summary_contract",
    score: {
      blastRadius: 10,
      executionProximityRisk: 10,
      permissionConfusionRisk: 9,
      manualRevenueUsefulness: 7,
      accessibilitySimplicity: 9,
      dependencySafety: 10,
      implementationSimplicity: 8,
      governanceClarity: 10,
      inMemoryDataSufficiency: 8,
      noActionControlSafety: 10,
    },
    reasons: [
      "Safest if the next step must remain contract-only.",
      "Maintains maximum distance from UI controls and runtime workflows.",
      "Useful for validating future dashboard and lead-detail visibility before implementation.",
      "Less immediate operator value than lead detail because it does not improve point-of-work visibility by itself.",
    ],
    allowedPatterns: [
      "pure summary contract",
      "candidate readiness classification",
      "implementation guardrails",
      "accessibility review checklist",
    ],
    blockedPatterns: commonBlockedPatterns,
  },
  {
    surface: "approval_queue_observability",
    score: {
      blastRadius: 7,
      executionProximityRisk: 6,
      permissionConfusionRisk: 5,
      manualRevenueUsefulness: 8,
      accessibilitySimplicity: 7,
      dependencySafety: 8,
      implementationSimplicity: 8,
      governanceClarity: 7,
      inMemoryDataSufficiency: 8,
      noActionControlSafety: 6,
    },
    reasons: [
      "Operationally useful for review bottlenecks, but closer to approval controls.",
      "Higher risk that metrics near approval cards could be mistaken for permission or execution readiness.",
      "Should wait until lead-detail observability proves the read-only pattern remains unmistakable.",
    ],
    allowedPatterns: [
      "read-only review bottleneck counts",
      "approval-does-not-send reminders",
      "manual-review-required labels",
    ],
    blockedPatterns: [...commonBlockedPatterns, "bulk approval metrics", "approve-and-send wording"],
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

const recommendedSurface = candidateRankings[0].surface;

const allowedPatterns = commonAllowedPatterns;

const blockedPatterns = [
  ...commonBlockedPatterns,
  "sending is allowed",
  "approval means send",
  "automation is ready",
  "runtime activation is ready",
  "provider activation is allowed",
  "persistence is allowed",
  "polling is allowed",
];

const accessibilityExpectations = [
  "Use semantic headings and readable labels.",
  "Use text labels, counts, and helper copy so status does not rely on color alone.",
  "Keep keyboard order predictable and avoid focus movement.",
  "Avoid motion and auto-refresh dependencies.",
  "Keep the first slice low clutter and point-of-work specific.",
  "Use screen-reader-friendly summaries that clarify metrics are advisory.",
];

function hasForbiddenRequest(input: R54ReadOnlyObservabilityExpansionPlanInput) {
  return (
    input.uiExpansionRequested === true ||
    input.routeChangeRequested === true ||
    input.runtimeActivationRequested === true ||
    input.providerActivationRequested === true ||
    input.liveSendingRequested === true ||
    input.automationAgentRequested === true ||
    input.pollingRequested === true ||
    input.persistenceRequested === true ||
    input.advisoryConvertedToPermission === true ||
    input.readOnly === false ||
    input.advisoryOnly === false ||
    input.simulationOnly === false ||
    input.liveExecutionAllowed === true ||
    input.providerActivationAllowed === true ||
    input.providerCalled === true ||
    input.sent === true ||
    input.persistenceAllowedNow === true ||
    input.pollingAllowed === true ||
    input.runtimeActivationAllowed === true
  );
}

export function assertR54ReadOnlyObservabilityExpansionPlanInvariants(
  result: Pick<
    R54ReadOnlyObservabilityExpansionPlanResult,
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
  >,
): R54ObservabilityExpansionPlanInvariantCheck {
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

  return {
    passed: warningCodes.length === 0,
    warningCodes,
  };
}

export function summarizeR54ReadOnlyObservabilityExpansionPlan(
  result: R54ReadOnlyObservabilityExpansionPlanResult,
) {
  const invariantCheck = assertR54ReadOnlyObservabilityExpansionPlanInvariants(result);

  return boundSummary(
    `R54A observability expansion plan status is ${result.planStatus}. ` +
      `Recommended next surface is ${result.recommendedSurface}. ` +
      `Top score is ${result.candidateRankings[0].totalScore}. ` +
      `Operator review required: ${result.operatorReviewRequired}. ` +
      `Invariants ${invariantCheck.passed ? "passed" : "failed"}. ` +
      "This contract is planning-only and cannot authorize UI expansion, routes, polling, persistence, providers, sending, automation, or runtime activation.",
  );
}

export function createR54ReadOnlyObservabilityExpansionPlanContract(
  input: R54ReadOnlyObservabilityExpansionPlanInput = {},
): R54ReadOnlyObservabilityExpansionPlanResult {
  const warningCodes: string[] = [];
  const operatorNotes = collectNotes(input.extraPlanningNotes);

  addWarning(warningCodes, "r54a_observability_expansion_plan_contract_only");

  if (Object.keys(input).length === 0) addWarning(warningCodes, "input_missing");
  if (input.candidateSurfacesReviewed !== true) addWarning(warningCodes, "candidate_review_required");
  if (input.safetyBoundariesReviewed !== true) addWarning(warningCodes, "safety_review_required");
  if (input.accessibilityExpectationsReviewed !== true) addWarning(warningCodes, "accessibility_review_required");
  if (input.operatorReviewCompleted !== true) addWarning(warningCodes, "operator_review_required");
  if (input.uiExpansionRequested === true) addWarning(warningCodes, "ui_expansion_rejected");
  if (input.routeChangeRequested === true) addWarning(warningCodes, "route_change_rejected");
  if (input.runtimeActivationRequested === true) addWarning(warningCodes, "runtime_activation_rejected");
  if (input.providerActivationRequested === true) addWarning(warningCodes, "provider_activation_rejected");
  if (input.liveSendingRequested === true) addWarning(warningCodes, "live_sending_rejected");
  if (input.automationAgentRequested === true) addWarning(warningCodes, "automation_agent_rejected");
  if (input.pollingRequested === true) addWarning(warningCodes, "polling_rejected");
  if (input.persistenceRequested === true) addWarning(warningCodes, "persistence_rejected");
  if (input.advisoryConvertedToPermission === true) addWarning(warningCodes, "advisory_to_permission_rejected");
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

  const operatorReviewRequired = input.operatorReviewCompleted !== true;
  const missingRequiredReview =
    input.candidateSurfacesReviewed !== true ||
    input.safetyBoundariesReviewed !== true ||
    input.accessibilityExpectationsReviewed !== true ||
    operatorReviewRequired;
  const planStatus: R54ObservabilityExpansionPlanStatus = hasForbiddenRequest(input)
    ? "observability_expansion_blocked"
    : missingRequiredReview
      ? "operator_review_required"
      : "observability_expansion_plan_ready";
  const reasons = candidateRankings.find((candidate) => candidate.surface === recommendedSurface)?.reasons ?? [];
  const result: R54ReadOnlyObservabilityExpansionPlanResult = {
    planStatus,
    recommendedSurface,
    candidateRankings,
    reasons,
    blockedPatterns,
    allowedPatterns,
    safetyFlags,
    accessibilityExpectations,
    nextSuggestedPhase:
      "R54B — Lead Detail Read-Only Observability Scope Contract, without UI implementation or runtime activation.",
    operatorReviewRequired,
    warningCodes,
    operatorNotes,
    summary: "R54A read-only observability expansion plan contract only.",
    ...safetyFlags,
  };

  return {
    ...result,
    summary: summarizeR54ReadOnlyObservabilityExpansionPlan(result),
  };
}
