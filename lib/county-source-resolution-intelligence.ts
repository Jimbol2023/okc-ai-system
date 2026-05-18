/**
 * Deterministic advisory-only County Source Resolution Intelligence Layer.
 *
 * Planning metadata only:
 * - no source connectivity
 * - no OCR, parser, ingestion, or normalization execution
 * - no database writes
 * - no provider or automation activation
 */

export type CountyResolutionSeverity = "none" | "low" | "moderate" | "high" | "critical";

export type CountyResolutionClassification =
  | "fully_resolved"
  | "resolved_with_restrictions"
  | "partially_resolved"
  | "review_outcome_inconclusive"
  | "unresolved_conflict"
  | "unresolved_deadlock"
  | "confidence_not_stabilized"
  | "resolution_rejected"
  | "planning_remains_blocked";

export type CountyResolutionWarningCode =
  | "RESOLUTION_REVIEW_INCOMPLETE"
  | "UNRESOLVED_GOVERNANCE_CONFLICT_REMAINS"
  | "ESCALATION_PATH_NOT_COMPLETED"
  | "ESCALATION_PATH_DID_NOT_RESOLVE_CONFLICT"
  | "GOVERNANCE_DEADLOCK_REMAINS"
  | "HUMAN_REVIEW_REJECTED_RESOLUTION"
  | "HUMAN_REVIEW_INCONCLUSIVE"
  | "CONFIDENCE_NOT_STABILIZED"
  | "PLANNING_RESTRICTION_REMAINS_ACTIVE"
  | "ADDITIONAL_REVIEW_REQUIRED"
  | "PLANNING_REMAINS_BLOCKED"
  | "FAIL_CLOSED_PROTECTION_ACTIVE";

export interface CountyResolutionDecision {
  decision:
    | "continue_advisory_planning"
    | "continue_with_restrictions"
    | "require_additional_review"
    | "keep_planning_blocked";
  rationale: string;
}

export interface CountyResolutionExplainability {
  summary: string;
  reviewedLayers: readonly string[];
  notes: readonly string[];
  deterministicRulesApplied: readonly string[];
}

export interface CountyResolutionRecommendation {
  recommendationType: "document" | "review" | "restrict_planning" | "block_planning" | "continue_advisory";
  description: string;
  required: boolean;
}

export interface CountySourceResolutionInput {
  countyName: string;
  sourceName: string;
  sourceType: string;
  priorEscalationSeverity: CountyResolutionSeverity;
  priorEscalationClassification: string;
  priorWarningCodes: string[];
  unresolvedGovernanceConflicts: string[];
  resolvedGovernanceConflicts: string[];
  humanReviewCompleted: boolean;
  humanReviewOutcome?: "approved" | "approved_with_restrictions" | "rejected" | "inconclusive";
  escalationPathCompleted: boolean;
  escalationPathResolvedConflict: boolean;
  governanceDeadlockPreviouslyDetected: boolean;
  governanceDeadlockResolved: boolean;
  confidenceBeforeReview: number;
  confidenceAfterReview: number;
  confidenceStabilized: boolean;
  planningRestrictionActive: boolean;
  requestedPlanningContinuation: boolean;
  explainabilityContext?: {
    reviewedLayers?: string[];
    notes?: string[];
  };
}

export interface CountySourceResolutionResult {
  resolutionClassification: CountyResolutionClassification;
  resolutionSeverity: CountyResolutionSeverity;
  conflictsResolvable: boolean;
  conflictsResolved: boolean;
  escalationResolved: boolean;
  deadlockResolved: boolean;
  planningMayContinue: boolean;
  planningRestricted: boolean;
  planningRestrictionMayDowngrade: boolean;
  warningDeEscalationAllowed: boolean;
  additionalReviewRequired: boolean;
  mandatoryHumanReviewRequired: boolean;
  resolutionDecision: CountyResolutionDecision;
  resolutionReasons: string[];
  resolutionRecommendations: CountyResolutionRecommendation[];
  warningCodes: CountyResolutionWarningCode[];
  explainability: CountyResolutionExplainability;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const CountySourceResolutionFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

const severityRank: Record<CountyResolutionSeverity, number> = {
  none: 0,
  low: 1,
  moderate: 2,
  high: 3,
  critical: 4,
};

const clampScore = (score: number): number => {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return 0;
  }

  return Math.min(1, Math.max(0, score));
};

const isAtLeast = (severity: CountyResolutionSeverity, minimum: CountyResolutionSeverity): boolean =>
  severityRank[severity] >= severityRank[minimum];

const getResolutionSignals = (input: CountySourceResolutionInput) => {
  const reviewOutcome = input.humanReviewOutcome;
  const reviewCompleteWithKnownOutcome = input.humanReviewCompleted && reviewOutcome !== undefined;
  const deadlockRemains = input.governanceDeadlockPreviouslyDetected && !input.governanceDeadlockResolved;
  const conflictsResolved = input.unresolvedGovernanceConflicts.length === 0;
  const escalationResolved = input.escalationPathCompleted && input.escalationPathResolvedConflict;
  const confidenceBeforeReview = clampScore(input.confidenceBeforeReview);
  const confidenceAfterReview = clampScore(input.confidenceAfterReview);
  const confidenceImprovedOrStable = confidenceAfterReview >= confidenceBeforeReview;
  const confidenceResolved = input.confidenceStabilized && confidenceImprovedOrStable;
  const explicitResolutionSignalsPresent =
    reviewCompleteWithKnownOutcome &&
    (reviewOutcome === "approved" || reviewOutcome === "approved_with_restrictions") &&
    conflictsResolved &&
    escalationResolved &&
    !deadlockRemains &&
    confidenceResolved;

  return {
    reviewOutcome,
    reviewCompleteWithKnownOutcome,
    deadlockRemains,
    conflictsResolved,
    escalationResolved,
    confidenceResolved,
    explicitResolutionSignalsPresent,
  };
};

const getClassificationAndSeverity = (
  input: CountySourceResolutionInput,
): {
  classification: CountyResolutionClassification;
  severity: CountyResolutionSeverity;
} => {
  const signals = getResolutionSignals(input);

  if (input.priorEscalationSeverity === "critical" && signals.deadlockRemains) {
    return { classification: "unresolved_deadlock", severity: "critical" };
  }

  if (input.priorEscalationSeverity === "critical" && !signals.explicitResolutionSignalsPresent) {
    return { classification: "planning_remains_blocked", severity: "critical" };
  }

  if (!signals.reviewCompleteWithKnownOutcome && isAtLeast(input.priorEscalationSeverity, "moderate")) {
    return { classification: "partially_resolved", severity: "high" };
  }

  if (signals.reviewOutcome === "rejected") {
    return { classification: "resolution_rejected", severity: "high" };
  }

  if (signals.reviewOutcome === "inconclusive" || !signals.reviewCompleteWithKnownOutcome) {
    return { classification: "review_outcome_inconclusive", severity: "high" };
  }

  if (!signals.conflictsResolved) {
    return { classification: "unresolved_conflict", severity: "high" };
  }

  if (!input.escalationPathCompleted || !input.escalationPathResolvedConflict) {
    return { classification: "partially_resolved", severity: "moderate" };
  }

  if (!signals.confidenceResolved) {
    return { classification: "confidence_not_stabilized", severity: "moderate" };
  }

  if (signals.reviewOutcome === "approved_with_restrictions") {
    return { classification: "resolved_with_restrictions", severity: "low" };
  }

  if (signals.reviewOutcome === "approved" && signals.explicitResolutionSignalsPresent) {
    return { classification: "fully_resolved", severity: "none" };
  }

  return { classification: "planning_remains_blocked", severity: "high" };
};

const getWarningCodes = (
  input: CountySourceResolutionInput,
  classification: CountyResolutionClassification,
  severity: CountyResolutionSeverity,
): CountyResolutionWarningCode[] => {
  const signals = getResolutionSignals(input);
  const warningCodes: CountyResolutionWarningCode[] = [];

  if (!signals.reviewCompleteWithKnownOutcome) {
    warningCodes.push("RESOLUTION_REVIEW_INCOMPLETE");
  }

  if (!signals.conflictsResolved) {
    warningCodes.push("UNRESOLVED_GOVERNANCE_CONFLICT_REMAINS");
  }

  if (!input.escalationPathCompleted) {
    warningCodes.push("ESCALATION_PATH_NOT_COMPLETED");
  }

  if (!input.escalationPathResolvedConflict) {
    warningCodes.push("ESCALATION_PATH_DID_NOT_RESOLVE_CONFLICT");
  }

  if (signals.deadlockRemains) {
    warningCodes.push("GOVERNANCE_DEADLOCK_REMAINS");
  }

  if (signals.reviewOutcome === "rejected") {
    warningCodes.push("HUMAN_REVIEW_REJECTED_RESOLUTION");
  }

  if (signals.reviewOutcome === "inconclusive" || (!signals.reviewCompleteWithKnownOutcome && input.humanReviewCompleted)) {
    warningCodes.push("HUMAN_REVIEW_INCONCLUSIVE");
  }

  if (!signals.confidenceResolved) {
    warningCodes.push("CONFIDENCE_NOT_STABILIZED");
  }

  if (input.planningRestrictionActive || classification === "resolved_with_restrictions") {
    warningCodes.push("PLANNING_RESTRICTION_REMAINS_ACTIVE");
  }

  if (classification !== "fully_resolved" && classification !== "resolved_with_restrictions") {
    warningCodes.push("ADDITIONAL_REVIEW_REQUIRED");
  }

  if (severity === "critical" || classification === "planning_remains_blocked" || classification === "unresolved_deadlock") {
    warningCodes.push("PLANNING_REMAINS_BLOCKED");
  }

  warningCodes.push("FAIL_CLOSED_PROTECTION_ACTIVE");

  return warningCodes;
};

const getReasons = (
  input: CountySourceResolutionInput,
  classification: CountyResolutionClassification,
): string[] => {
  const signals = getResolutionSignals(input);
  const reasons: string[] = [];

  if (classification === "fully_resolved") {
    reasons.push("Resolution review approved the source planning package with conflicts resolved.");
  }

  if (classification === "resolved_with_restrictions") {
    reasons.push("Resolution review approved advisory planning with restrictions preserved.");
  }

  if (!signals.reviewCompleteWithKnownOutcome) {
    reasons.push("Resolution review is incomplete or lacks a known outcome.");
  }

  if (!signals.conflictsResolved) {
    reasons.push("Unresolved governance conflicts remain after resolution review.");
  }

  if (!signals.escalationResolved) {
    reasons.push("Escalation path did not complete or did not resolve the conflict.");
  }

  if (signals.deadlockRemains) {
    reasons.push("Previously detected governance deadlock remains unresolved.");
  }

  if (input.humanReviewOutcome === "rejected") {
    reasons.push("Human review rejected the proposed resolution.");
  }

  if (input.humanReviewOutcome === "inconclusive") {
    reasons.push("Human review outcome was inconclusive and requires another review cycle.");
  }

  if (!signals.confidenceResolved) {
    reasons.push("Confidence did not stabilize after resolution review.");
  }

  return reasons;
};

const getRecommendations = (
  classification: CountyResolutionClassification,
  planningMayContinue: boolean,
): CountyResolutionRecommendation[] => {
  if (classification === "fully_resolved") {
    return [
      {
        recommendationType: "continue_advisory",
        description: "Continue advisory-only planning with fail-closed execution controls preserved.",
        required: false,
      },
    ];
  }

  const recommendations: CountyResolutionRecommendation[] = [
    {
      recommendationType: "document",
      description: "Document the resolution outcome and retain fail-closed governance notes.",
      required: true,
    },
  ];

  if (planningMayContinue) {
    recommendations.push({
      recommendationType: "restrict_planning",
      description: "Continue only restricted advisory planning until governance review fully clears the source.",
      required: true,
    });
  } else {
    recommendations.push({
      recommendationType: "block_planning",
      description: "Keep planning blocked until the remaining governance blocker is resolved.",
      required: true,
    });
  }

  recommendations.push({
    recommendationType: "review",
    description: "Route unresolved resolution signals for additional human governance review.",
    required: classification !== "resolved_with_restrictions",
  });

  return recommendations;
};

export function evaluateCountySourceResolutionIntelligence(
  input: CountySourceResolutionInput,
): CountySourceResolutionResult {
  const { classification, severity } = getClassificationAndSeverity(input);
  const signals = getResolutionSignals(input);
  const warningDeEscalationAllowed =
    signals.reviewCompleteWithKnownOutcome &&
    signals.conflictsResolved &&
    signals.confidenceResolved &&
    signals.escalationResolved &&
    !signals.deadlockRemains;
  const planningMayContinue =
    input.requestedPlanningContinuation &&
    classification !== "unresolved_deadlock" &&
    classification !== "planning_remains_blocked" &&
    severity !== "critical" &&
    classification !== "resolution_rejected" &&
    classification !== "review_outcome_inconclusive";
  const planningRestricted =
    classification === "resolved_with_restrictions" ||
    input.planningRestrictionActive ||
    (planningMayContinue && severity !== "none");
  const additionalReviewRequired = classification !== "fully_resolved" && classification !== "resolved_with_restrictions";
  const decision: CountyResolutionDecision["decision"] =
    classification === "fully_resolved"
      ? "continue_advisory_planning"
      : planningMayContinue
        ? "continue_with_restrictions"
        : classification === "resolution_rejected" ||
            classification === "unresolved_deadlock" ||
            classification === "planning_remains_blocked" ||
            severity === "critical"
          ? "keep_planning_blocked"
          : "require_additional_review";

  return {
    resolutionClassification: classification,
    resolutionSeverity: severity,
    conflictsResolvable: signals.reviewCompleteWithKnownOutcome && !signals.deadlockRemains,
    conflictsResolved: signals.conflictsResolved,
    escalationResolved: signals.escalationResolved,
    deadlockResolved: !signals.deadlockRemains,
    planningMayContinue,
    planningRestricted,
    planningRestrictionMayDowngrade: warningDeEscalationAllowed && classification !== "resolved_with_restrictions",
    warningDeEscalationAllowed,
    additionalReviewRequired,
    mandatoryHumanReviewRequired: additionalReviewRequired || severity === "critical",
    resolutionDecision: {
      decision,
      rationale:
        classification === "fully_resolved"
          ? "Resolution signals support continued advisory-only planning."
          : "Resolution signals require fail-closed advisory governance handling.",
    },
    resolutionReasons: getReasons(input, classification),
    resolutionRecommendations: getRecommendations(classification, planningMayContinue),
    warningCodes: getWarningCodes(input, classification, severity),
    explainability: {
      summary: `${input.countyName} ${input.sourceName} ${input.sourceType} resolution evaluated with deterministic advisory-only rules.`,
      reviewedLayers: input.explainabilityContext?.reviewedLayers ?? [],
      notes: input.explainabilityContext?.notes ?? [],
      deterministicRulesApplied: [
        "fail-closed execution controls preserved",
        "critical prior escalation cannot downgrade without explicit resolution signals",
        "deadlock and unresolved conflict signals block full de-escalation",
        "review completion, escalation resolution, and confidence stabilization control warning de-escalation",
      ],
    },
    ingestionBlocked: CountySourceResolutionFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountySourceResolutionFailClosedDefaults.automationBlocked,
    executionBlocked: CountySourceResolutionFailClosedDefaults.executionBlocked,
    planningOnly: CountySourceResolutionFailClosedDefaults.planningOnly,
    failClosed: CountySourceResolutionFailClosedDefaults.failClosed,
  };
}
