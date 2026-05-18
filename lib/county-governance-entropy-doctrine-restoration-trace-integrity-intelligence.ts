export type RestorationTraceIntegrityLevel =
  | "unknown"
  | "broken"
  | "weak"
  | "partial"
  | "adequate"
  | "strong"
  | "institutional";

export type RestorationTraceRiskLevel = "none" | "low" | "moderate" | "high" | "critical";

export type OperationalTraceSustainabilityLevel =
  | "unknown"
  | "unsustainable"
  | "strained"
  | "viable"
  | "durable"
  | "institutional";

export type CountyGovernanceEntropyDoctrineRestorationTraceIntegrityClassification =
  | "durable_restoration_trace_integrity"
  | "conditional_restoration_trace_integrity"
  | "partial_restoration_trace_integrity"
  | "restoration_trace_integrity_blocked"
  | "restoration_trace_integrity_unsafe"
  | "restoration_trace_continuation_required"
  | "bounded_trace_reevaluation_required"
  | "restoration_trace_explainability_weakness"
  | "missing_trace_evidence"
  | "incomplete_evidence_chain"
  | "warning_traceability_failure"
  | "classification_traceability_failure"
  | "doctrine_transition_audit_gap"
  | "non_regression_trace_gap"
  | "decision_lineage_break"
  | "fail_closed_trace_degradation"
  | "unresolved_trace_conflict"
  | "trace_collapse_sensitive_rejection"
  | "operationally_unsustainable_trace_integrity"
  | "restoration_trace_integrity_unverified";

export type RestorationTraceReadinessClassification =
  | "ready"
  | "conditionally_ready"
  | "not_ready"
  | "blocked"
  | "readiness_unverified";

export type RestorationTraceSafetyClassification =
  | "safe"
  | "guarded"
  | "unsafe"
  | "collapse_sensitive"
  | "safety_unverified";

export type CountyGovernanceEntropyDoctrineRestorationTraceIntegrityWarningCode =
  | "S35_RESTORATION_TRACE_INTEGRITY_UNVERIFIED"
  | "S35_RESTORATION_TRACE_BLOCKED"
  | "S35_RESTORATION_TRACE_UNSAFE"
  | "S35_MISSING_TRACE_EVIDENCE"
  | "S35_INCOMPLETE_EVIDENCE_CHAIN"
  | "S35_WARNING_TRACEABILITY_FAILURE"
  | "S35_CLASSIFICATION_TRACEABILITY_FAILURE"
  | "S35_DOCTRINE_TRANSITION_AUDIT_GAP"
  | "S35_NON_REGRESSION_TRACE_GAP"
  | "S35_SURVIVABILITY_CONTINUITY_TRACE_INCONSISTENCY"
  | "S35_DECISION_LINEAGE_BREAK"
  | "S35_FAIL_CLOSED_TRACE_DEGRADATION"
  | "S35_UNRESOLVED_TRACE_CONFLICT"
  | "S35_TRACE_COLLAPSE_SENSITIVE_REJECTION"
  | "S35_BOUNDED_TRACE_REEVALUATION_REQUIRED"
  | "S35_RESTORATION_TRACE_CONTINUATION_REQUIRED"
  | "S35_OPERATIONALLY_UNSUSTAINABLE_TRACE_INTEGRITY";

export interface CountyGovernanceEntropyDoctrineRestorationTraceIntegrityInput {
  restorationTraceIntegrityLevel?: RestorationTraceIntegrityLevel | null;
  warningTraceabilityLevel?: RestorationTraceIntegrityLevel | null;
  classificationTraceabilityLevel?: RestorationTraceIntegrityLevel | null;
  evidenceChainCompletenessLevel?: RestorationTraceIntegrityLevel | null;
  doctrineTransitionAuditabilityLevel?: RestorationTraceIntegrityLevel | null;
  nonRegressionTraceConfidenceLevel?: RestorationTraceIntegrityLevel | null;
  survivabilityContinuityTraceConsistencyLevel?: RestorationTraceIntegrityLevel | null;
  failClosedTracePreservationLevel?: RestorationTraceIntegrityLevel | null;
  decisionLineageClarityLevel?: RestorationTraceIntegrityLevel | null;
  traceConflictLevel?: RestorationTraceRiskLevel | null;
  traceCollapseExposureLevel?: RestorationTraceRiskLevel | null;
  operationalTraceSustainabilityLevel?: OperationalTraceSustainabilityLevel | null;
  missingTraceEvidenceCount?: number | null;
  unresolvedTraceConflictCount?: number | null;
  untraceableWarningCount?: number | null;
  untraceableClassificationCount?: number | null;
  transitionGapCount?: number | null;
  nonRegressionGapCount?: number | null;
  lineageBreakCount?: number | null;
  traceRegressionEventCount?: number | null;
}

export interface RestorationTraceIntegrityExplainability {
  summary: string;
  traceIntegrityDrivers: string[];
  traceabilityDrivers: string[];
  evidenceChainDrivers: string[];
  transitionAuditDrivers: string[];
  nonRegressionDrivers: string[];
  survivabilityContinuityDrivers: string[];
  failClosedDrivers: string[];
  lineageDrivers: string[];
  conflictDrivers: string[];
  reevaluationDrivers: string[];
  warningDerivation: string[];
  deterministicRulesApplied: string[];
}

export interface CountyGovernanceEntropyDoctrineRestorationTraceIntegrityResult {
  restorationTraceIntegrityClassification: CountyGovernanceEntropyDoctrineRestorationTraceIntegrityClassification;
  traceReadinessClassification: RestorationTraceReadinessClassification;
  traceSafetyClassification: RestorationTraceSafetyClassification;
  traceIntegrityScore: number;
  warningTraceabilityScore: number;
  classificationTraceabilityScore: number;
  evidenceChainScore: number;
  transitionAuditabilityScore: number;
  nonRegressionTraceScore: number;
  survivabilityContinuityTraceScore: number;
  failClosedTraceScore: number;
  decisionLineageScore: number;
  traceConflictScore: number;
  traceCollapseExposureScore: number;
  operationalTraceSustainabilityScore: number;
  traceIntegrityBlocked: boolean;
  traceIntegrityUnsafe: boolean;
  traceContinuationRequired: boolean;
  boundedTraceReevaluationRequired: boolean;
  traceCollapseSensitiveRejection: boolean;
  failClosedTraceDegradation: boolean;
  missingTraceEvidenceDetected: boolean;
  unresolvedTraceConflictDetected: boolean;
  warningTraceabilityWeakness: boolean;
  classificationTraceabilityWeakness: boolean;
  evidenceChainIncomplete: boolean;
  decisionLineageBreakDetected: boolean;
  nonRegressionTraceGapDetected: boolean;
  operationalTraceUnsustainable: boolean;
  restorationTraceIntegrityUnverified: boolean;
  warningCodes: CountyGovernanceEntropyDoctrineRestorationTraceIntegrityWarningCode[];
  explainability: RestorationTraceIntegrityExplainability;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const traceLevelScores: Record<RestorationTraceIntegrityLevel, number> = {
  unknown: 0,
  broken: 5,
  weak: 25,
  partial: 45,
  adequate: 65,
  strong: 84,
  institutional: 96,
};

const riskScores: Record<RestorationTraceRiskLevel, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const sustainabilityScores: Record<OperationalTraceSustainabilityLevel, number> = {
  unknown: 0,
  unsustainable: 5,
  strained: 45,
  viable: 72,
  durable: 88,
  institutional: 96,
};

const warningOrder: CountyGovernanceEntropyDoctrineRestorationTraceIntegrityWarningCode[] = [
  "S35_RESTORATION_TRACE_INTEGRITY_UNVERIFIED",
  "S35_RESTORATION_TRACE_BLOCKED",
  "S35_RESTORATION_TRACE_UNSAFE",
  "S35_MISSING_TRACE_EVIDENCE",
  "S35_INCOMPLETE_EVIDENCE_CHAIN",
  "S35_WARNING_TRACEABILITY_FAILURE",
  "S35_CLASSIFICATION_TRACEABILITY_FAILURE",
  "S35_DOCTRINE_TRANSITION_AUDIT_GAP",
  "S35_NON_REGRESSION_TRACE_GAP",
  "S35_SURVIVABILITY_CONTINUITY_TRACE_INCONSISTENCY",
  "S35_DECISION_LINEAGE_BREAK",
  "S35_FAIL_CLOSED_TRACE_DEGRADATION",
  "S35_UNRESOLVED_TRACE_CONFLICT",
  "S35_TRACE_COLLAPSE_SENSITIVE_REJECTION",
  "S35_BOUNDED_TRACE_REEVALUATION_REQUIRED",
  "S35_RESTORATION_TRACE_CONTINUATION_REQUIRED",
  "S35_OPERATIONALLY_UNSUSTAINABLE_TRACE_INTEGRITY",
];

function clampScore(score: number): number {
  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

function clampCount(count: number | null | undefined): number {
  if (!Number.isFinite(count ?? Number.NaN)) {
    return 0;
  }

  return Math.max(0, Math.floor(count as number));
}

function hasAnyInput(input: CountyGovernanceEntropyDoctrineRestorationTraceIntegrityInput): boolean {
  return Object.values(input).some((value) => value !== undefined && value !== null);
}

function isWeakTraceLevel(level: RestorationTraceIntegrityLevel | null | undefined): boolean {
  return level === "unknown" || level === "broken" || level === "weak";
}

function isPoorTraceLevel(level: RestorationTraceIntegrityLevel | null | undefined): boolean {
  return level === "unknown" || level === "broken";
}

function isHighRisk(level: RestorationTraceRiskLevel | null | undefined): boolean {
  return level === "high" || level === "critical";
}

function getReadinessClassification(params: {
  hasEvidence: boolean;
  blocked: boolean;
  traceIntegrityScore: number;
  warningTraceabilityScore: number;
  classificationTraceabilityScore: number;
  evidenceChainScore: number;
}): RestorationTraceReadinessClassification {
  if (!params.hasEvidence) {
    return "readiness_unverified";
  }

  if (params.blocked) {
    return "blocked";
  }

  if (
    params.traceIntegrityScore >= 84 &&
    params.warningTraceabilityScore >= 84 &&
    params.classificationTraceabilityScore >= 84 &&
    params.evidenceChainScore >= 84
  ) {
    return "ready";
  }

  if (
    params.traceIntegrityScore >= 65 &&
    params.warningTraceabilityScore >= 65 &&
    params.classificationTraceabilityScore >= 65 &&
    params.evidenceChainScore >= 65
  ) {
    return "conditionally_ready";
  }

  return "not_ready";
}

function getSafetyClassification(params: {
  hasEvidence: boolean;
  unsafe: boolean;
  collapseSensitive: boolean;
  traceCollapseExposureScore: number;
  traceConflictScore: number;
}): RestorationTraceSafetyClassification {
  if (!params.hasEvidence) {
    return "safety_unverified";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive";
  }

  if (params.unsafe || params.traceCollapseExposureScore >= 78 || params.traceConflictScore >= 78) {
    return "unsafe";
  }

  if (params.traceCollapseExposureScore <= 20 && params.traceConflictScore <= 20) {
    return "safe";
  }

  return "guarded";
}

function classifyTraceIntegrity(params: {
  hasEvidence: boolean;
  traceIntegrityScore: number;
  warningTraceabilityScore: number;
  classificationTraceabilityScore: number;
  evidenceChainScore: number;
  transitionAuditabilityScore: number;
  nonRegressionTraceScore: number;
  survivabilityContinuityTraceScore: number;
  failClosedTraceScore: number;
  decisionLineageScore: number;
  traceConflictScore: number;
  traceCollapseExposureScore: number;
  operationalTraceSustainabilityScore: number;
  unverified: boolean;
  blocked: boolean;
  unsafe: boolean;
  continuationRequired: boolean;
  boundedReevaluationRequired: boolean;
  collapseSensitive: boolean;
  failClosedDegradation: boolean;
  missingEvidence: boolean;
  unresolvedConflict: boolean;
  warningTraceabilityFailure: boolean;
  classificationTraceabilityFailure: boolean;
  evidenceChainIncomplete: boolean;
  transitionAuditGap: boolean;
  nonRegressionGap: boolean;
  decisionLineageBreak: boolean;
  operationallyUnsustainable: boolean;
  explainabilityWeakness: boolean;
}): CountyGovernanceEntropyDoctrineRestorationTraceIntegrityClassification {
  if (!params.hasEvidence || params.unverified) {
    return "restoration_trace_integrity_unverified";
  }

  if (params.collapseSensitive) {
    return "trace_collapse_sensitive_rejection";
  }

  if (params.unsafe) {
    return "restoration_trace_integrity_unsafe";
  }

  if (params.blocked) {
    return "restoration_trace_integrity_blocked";
  }

  if (params.failClosedDegradation) {
    return "fail_closed_trace_degradation";
  }

  if (params.decisionLineageBreak) {
    return "decision_lineage_break";
  }

  if (params.unresolvedConflict) {
    return "unresolved_trace_conflict";
  }

  if (params.warningTraceabilityFailure) {
    return "warning_traceability_failure";
  }

  if (params.classificationTraceabilityFailure) {
    return "classification_traceability_failure";
  }

  if (params.evidenceChainIncomplete) {
    return "incomplete_evidence_chain";
  }

  if (params.transitionAuditGap) {
    return "doctrine_transition_audit_gap";
  }

  if (params.nonRegressionGap) {
    return "non_regression_trace_gap";
  }

  if (params.missingEvidence) {
    return "missing_trace_evidence";
  }

  if (params.operationallyUnsustainable) {
    return "operationally_unsustainable_trace_integrity";
  }

  if (params.boundedReevaluationRequired) {
    return "bounded_trace_reevaluation_required";
  }

  if (params.continuationRequired) {
    return "restoration_trace_continuation_required";
  }

  if (params.explainabilityWeakness) {
    return "restoration_trace_explainability_weakness";
  }

  if (
    params.traceIntegrityScore >= 84 &&
    params.warningTraceabilityScore >= 84 &&
    params.classificationTraceabilityScore >= 84 &&
    params.evidenceChainScore >= 84 &&
    params.transitionAuditabilityScore >= 84 &&
    params.nonRegressionTraceScore >= 84 &&
    params.survivabilityContinuityTraceScore >= 84 &&
    params.failClosedTraceScore >= 84 &&
    params.decisionLineageScore >= 84 &&
    params.traceConflictScore <= 20 &&
    params.traceCollapseExposureScore <= 20 &&
    params.operationalTraceSustainabilityScore >= 72
  ) {
    return "durable_restoration_trace_integrity";
  }

  if (
    params.traceIntegrityScore >= 65 &&
    params.warningTraceabilityScore >= 65 &&
    params.classificationTraceabilityScore >= 65 &&
    params.evidenceChainScore >= 65 &&
    params.transitionAuditabilityScore >= 65 &&
    params.nonRegressionTraceScore >= 65 &&
    params.failClosedTraceScore >= 65 &&
    params.decisionLineageScore >= 65
  ) {
    return "conditional_restoration_trace_integrity";
  }

  return "partial_restoration_trace_integrity";
}

function buildWarnings(params: {
  unverified: boolean;
  blocked: boolean;
  unsafe: boolean;
  missingEvidence: boolean;
  evidenceChainIncomplete: boolean;
  warningTraceabilityFailure: boolean;
  classificationTraceabilityFailure: boolean;
  transitionAuditGap: boolean;
  nonRegressionGap: boolean;
  survivabilityContinuityInconsistency: boolean;
  decisionLineageBreak: boolean;
  failClosedDegradation: boolean;
  unresolvedConflict: boolean;
  collapseSensitive: boolean;
  boundedReevaluationRequired: boolean;
  continuationRequired: boolean;
  operationallyUnsustainable: boolean;
}): CountyGovernanceEntropyDoctrineRestorationTraceIntegrityWarningCode[] {
  const warnings = new Set<CountyGovernanceEntropyDoctrineRestorationTraceIntegrityWarningCode>();

  if (params.unverified) {
    warnings.add("S35_RESTORATION_TRACE_INTEGRITY_UNVERIFIED");
  }

  if (params.blocked) {
    warnings.add("S35_RESTORATION_TRACE_BLOCKED");
  }

  if (params.unsafe) {
    warnings.add("S35_RESTORATION_TRACE_UNSAFE");
  }

  if (params.missingEvidence) {
    warnings.add("S35_MISSING_TRACE_EVIDENCE");
  }

  if (params.evidenceChainIncomplete) {
    warnings.add("S35_INCOMPLETE_EVIDENCE_CHAIN");
  }

  if (params.warningTraceabilityFailure) {
    warnings.add("S35_WARNING_TRACEABILITY_FAILURE");
  }

  if (params.classificationTraceabilityFailure) {
    warnings.add("S35_CLASSIFICATION_TRACEABILITY_FAILURE");
  }

  if (params.transitionAuditGap) {
    warnings.add("S35_DOCTRINE_TRANSITION_AUDIT_GAP");
  }

  if (params.nonRegressionGap) {
    warnings.add("S35_NON_REGRESSION_TRACE_GAP");
  }

  if (params.survivabilityContinuityInconsistency) {
    warnings.add("S35_SURVIVABILITY_CONTINUITY_TRACE_INCONSISTENCY");
  }

  if (params.decisionLineageBreak) {
    warnings.add("S35_DECISION_LINEAGE_BREAK");
  }

  if (params.failClosedDegradation) {
    warnings.add("S35_FAIL_CLOSED_TRACE_DEGRADATION");
  }

  if (params.unresolvedConflict) {
    warnings.add("S35_UNRESOLVED_TRACE_CONFLICT");
  }

  if (params.collapseSensitive) {
    warnings.add("S35_TRACE_COLLAPSE_SENSITIVE_REJECTION");
  }

  if (params.boundedReevaluationRequired) {
    warnings.add("S35_BOUNDED_TRACE_REEVALUATION_REQUIRED");
  }

  if (params.continuationRequired) {
    warnings.add("S35_RESTORATION_TRACE_CONTINUATION_REQUIRED");
  }

  if (params.operationallyUnsustainable) {
    warnings.add("S35_OPERATIONALLY_UNSUSTAINABLE_TRACE_INTEGRITY");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function buildExplainability(params: {
  hasEvidence: boolean;
  classification: CountyGovernanceEntropyDoctrineRestorationTraceIntegrityClassification;
  warningCodes: CountyGovernanceEntropyDoctrineRestorationTraceIntegrityWarningCode[];
  traceIntegrityScore: number;
  warningTraceabilityScore: number;
  classificationTraceabilityScore: number;
  evidenceChainScore: number;
  transitionAuditabilityScore: number;
  nonRegressionTraceScore: number;
  survivabilityContinuityTraceScore: number;
  failClosedTraceScore: number;
  decisionLineageScore: number;
  traceConflictScore: number;
  traceCollapseExposureScore: number;
  operationalTraceSustainabilityScore: number;
  missingTraceEvidenceCount: number;
  transitionGapCount: number;
  nonRegressionGapCount: number;
}): RestorationTraceIntegrityExplainability {
  return {
    summary: params.hasEvidence
      ? `S35 classified restoration trace integrity as ${params.classification}.`
      : "S35 classified restoration trace integrity as unverified because no caller-supplied trace evidence was provided.",
    traceIntegrityDrivers: [`restoration trace integrity score: ${params.traceIntegrityScore}`],
    traceabilityDrivers: [
      `warning traceability score: ${params.warningTraceabilityScore}`,
      `classification traceability score: ${params.classificationTraceabilityScore}`,
    ],
    evidenceChainDrivers: [
      `evidence-chain completeness score: ${params.evidenceChainScore}`,
      `missing trace evidence count: ${params.missingTraceEvidenceCount}`,
    ],
    transitionAuditDrivers: [
      `doctrine transition auditability score: ${params.transitionAuditabilityScore}`,
      `transition gap count: ${params.transitionGapCount}`,
    ],
    nonRegressionDrivers: [
      `non-regression trace score: ${params.nonRegressionTraceScore}`,
      `non-regression gap count: ${params.nonRegressionGapCount}`,
    ],
    survivabilityContinuityDrivers: [
      `survivability-to-continuity trace score: ${params.survivabilityContinuityTraceScore}`,
    ],
    failClosedDrivers: [`fail-closed trace preservation score: ${params.failClosedTraceScore}`],
    lineageDrivers: [`decision lineage score: ${params.decisionLineageScore}`],
    conflictDrivers: [
      `trace conflict score: ${params.traceConflictScore}`,
      `trace collapse exposure score: ${params.traceCollapseExposureScore}`,
    ],
    reevaluationDrivers: [`operational trace sustainability score: ${params.operationalTraceSustainabilityScore}`],
    warningDerivation: params.warningCodes.map((warning) => `${warning} derived from deterministic S35 thresholds.`),
    deterministicRulesApplied: [
      "Pure caller-input-only restoration trace integrity modeling.",
      "Fixed ordinal maps and bounded 0-100 scores.",
      "Clamped non-negative count inputs.",
      "Stable warning-code ordering.",
      "Explicit restoration trace integrity precedence ordering.",
      "No runtime, provider, database, network, clock, filesystem, or environment dependency.",
    ],
  };
}

export function evaluateCountyGovernanceEntropyDoctrineRestorationTraceIntegrity(
  input: CountyGovernanceEntropyDoctrineRestorationTraceIntegrityInput = {},
): CountyGovernanceEntropyDoctrineRestorationTraceIntegrityResult {
  const hasEvidence = hasAnyInput(input);

  const missingTraceEvidenceCount = clampCount(input.missingTraceEvidenceCount);
  const unresolvedTraceConflictCount = clampCount(input.unresolvedTraceConflictCount);
  const untraceableWarningCount = clampCount(input.untraceableWarningCount);
  const untraceableClassificationCount = clampCount(input.untraceableClassificationCount);
  const transitionGapCount = clampCount(input.transitionGapCount);
  const nonRegressionGapCount = clampCount(input.nonRegressionGapCount);
  const lineageBreakCount = clampCount(input.lineageBreakCount);
  const traceRegressionEventCount = clampCount(input.traceRegressionEventCount);

  const traceIntegrityScore = traceLevelScores[input.restorationTraceIntegrityLevel ?? "unknown"];
  const warningTraceabilityScore = traceLevelScores[input.warningTraceabilityLevel ?? "unknown"];
  const classificationTraceabilityScore = traceLevelScores[input.classificationTraceabilityLevel ?? "unknown"];
  const evidenceChainScore = traceLevelScores[input.evidenceChainCompletenessLevel ?? "unknown"];
  const transitionAuditabilityScore = traceLevelScores[input.doctrineTransitionAuditabilityLevel ?? "unknown"];
  const nonRegressionTraceScore = traceLevelScores[input.nonRegressionTraceConfidenceLevel ?? "unknown"];
  const survivabilityContinuityTraceScore =
    traceLevelScores[input.survivabilityContinuityTraceConsistencyLevel ?? "unknown"];
  const failClosedTraceScore = traceLevelScores[input.failClosedTracePreservationLevel ?? "unknown"];
  const decisionLineageScore = traceLevelScores[input.decisionLineageClarityLevel ?? "unknown"];
  const traceConflictScore = Math.max(
    riskScores[input.traceConflictLevel ?? "none"],
    unresolvedTraceConflictCount > 0 ? 50 : 0,
  );
  const traceCollapseExposureScore = Math.max(
    riskScores[input.traceCollapseExposureLevel ?? "none"],
    traceRegressionEventCount > 0 ? 50 : 0,
  );
  const operationalTraceSustainabilityScore =
    sustainabilityScores[input.operationalTraceSustainabilityLevel ?? "unknown"];

  const restorationTraceIntegrityUnverified =
    !hasEvidence ||
    isPoorTraceLevel(input.restorationTraceIntegrityLevel) ||
    isPoorTraceLevel(input.warningTraceabilityLevel) ||
    isPoorTraceLevel(input.classificationTraceabilityLevel) ||
    isPoorTraceLevel(input.evidenceChainCompletenessLevel);
  const missingTraceEvidenceDetected = missingTraceEvidenceCount > 0;
  const evidenceChainIncomplete =
    isWeakTraceLevel(input.evidenceChainCompletenessLevel) || evidenceChainScore < 65 || missingTraceEvidenceCount > 0;
  const warningTraceabilityWeakness =
    isWeakTraceLevel(input.warningTraceabilityLevel) || warningTraceabilityScore < 65 || untraceableWarningCount > 0;
  const classificationTraceabilityWeakness =
    isWeakTraceLevel(input.classificationTraceabilityLevel) ||
    classificationTraceabilityScore < 65 ||
    untraceableClassificationCount > 0;
  const doctrineTransitionAuditGap =
    isWeakTraceLevel(input.doctrineTransitionAuditabilityLevel) || transitionAuditabilityScore < 65 || transitionGapCount > 0;
  const nonRegressionTraceGapDetected =
    isWeakTraceLevel(input.nonRegressionTraceConfidenceLevel) ||
    nonRegressionTraceScore < 65 ||
    nonRegressionGapCount > 0 ||
    traceRegressionEventCount > 0;
  const survivabilityContinuityInconsistency =
    isWeakTraceLevel(input.survivabilityContinuityTraceConsistencyLevel) || survivabilityContinuityTraceScore < 65;
  const decisionLineageBreakDetected =
    isWeakTraceLevel(input.decisionLineageClarityLevel) || decisionLineageScore < 65 || lineageBreakCount > 0;
  const failClosedTraceDegradation =
    isWeakTraceLevel(input.failClosedTracePreservationLevel) || failClosedTraceScore < 65;
  const unresolvedTraceConflictDetected =
    isHighRisk(input.traceConflictLevel) || traceConflictScore >= 50 || unresolvedTraceConflictCount > 0;
  const operationalTraceUnsustainable =
    input.operationalTraceSustainabilityLevel === "unsustainable" || operationalTraceSustainabilityScore <= 5;
  const traceIntegrityUnsafe =
    input.restorationTraceIntegrityLevel === "weak" ||
    traceIntegrityScore <= 5 ||
    input.traceCollapseExposureLevel === "critical" ||
    traceCollapseExposureScore >= 100 ||
    (traceCollapseExposureScore >= 78 && (traceConflictScore >= 78 || failClosedTraceDegradation));
  const traceCollapseSensitiveRejection =
    isHighRisk(input.traceCollapseExposureLevel) ||
    (traceCollapseExposureScore >= 50 &&
      (unresolvedTraceConflictDetected ||
        failClosedTraceDegradation ||
        decisionLineageBreakDetected ||
        nonRegressionTraceGapDetected));
  const traceIntegrityBlocked =
    !traceIntegrityUnsafe &&
    !traceCollapseSensitiveRejection &&
    input.operationalTraceSustainabilityLevel === "unknown";
  const boundedTraceReevaluationRequired =
    !traceIntegrityBlocked &&
    !traceIntegrityUnsafe &&
    !traceCollapseSensitiveRejection &&
    (traceIntegrityScore < 84 ||
      transitionAuditabilityScore < 84 ||
      nonRegressionTraceScore < 84 ||
      survivabilityContinuityTraceScore < 84 ||
      traceConflictScore >= 20 ||
      traceCollapseExposureScore >= 20);
  const traceContinuationRequired =
    !traceIntegrityBlocked &&
    !traceIntegrityUnsafe &&
    !traceCollapseSensitiveRejection &&
    (traceIntegrityScore < 65 ||
      warningTraceabilityScore < 84 ||
      classificationTraceabilityScore < 84 ||
      evidenceChainScore < 84 ||
      operationalTraceSustainabilityScore < 72);
  const restorationTraceExplainabilityWeakness =
    !traceIntegrityBlocked &&
    !traceIntegrityUnsafe &&
    !traceCollapseSensitiveRejection &&
    (survivabilityContinuityTraceScore < 84 || decisionLineageScore < 84 || transitionAuditabilityScore < 84);

  const warningCodes = buildWarnings({
    unverified: restorationTraceIntegrityUnverified,
    blocked: traceIntegrityBlocked,
    unsafe: traceIntegrityUnsafe,
    missingEvidence: missingTraceEvidenceDetected,
    evidenceChainIncomplete,
    warningTraceabilityFailure: warningTraceabilityWeakness,
    classificationTraceabilityFailure: classificationTraceabilityWeakness,
    transitionAuditGap: doctrineTransitionAuditGap,
    nonRegressionGap: nonRegressionTraceGapDetected,
    survivabilityContinuityInconsistency,
    decisionLineageBreak: decisionLineageBreakDetected,
    failClosedDegradation: failClosedTraceDegradation,
    unresolvedConflict: unresolvedTraceConflictDetected,
    collapseSensitive: traceCollapseSensitiveRejection,
    boundedReevaluationRequired: boundedTraceReevaluationRequired,
    continuationRequired: traceContinuationRequired,
    operationallyUnsustainable: operationalTraceUnsustainable,
  });

  const restorationTraceIntegrityClassification = classifyTraceIntegrity({
    hasEvidence,
    traceIntegrityScore,
    warningTraceabilityScore,
    classificationTraceabilityScore,
    evidenceChainScore,
    transitionAuditabilityScore,
    nonRegressionTraceScore,
    survivabilityContinuityTraceScore,
    failClosedTraceScore,
    decisionLineageScore,
    traceConflictScore,
    traceCollapseExposureScore,
    operationalTraceSustainabilityScore,
    unverified: restorationTraceIntegrityUnverified,
    blocked: traceIntegrityBlocked,
    unsafe: traceIntegrityUnsafe,
    continuationRequired: traceContinuationRequired,
    boundedReevaluationRequired: boundedTraceReevaluationRequired,
    collapseSensitive: traceCollapseSensitiveRejection,
    failClosedDegradation: failClosedTraceDegradation,
    missingEvidence: missingTraceEvidenceDetected,
    unresolvedConflict: unresolvedTraceConflictDetected,
    warningTraceabilityFailure: warningTraceabilityWeakness,
    classificationTraceabilityFailure: classificationTraceabilityWeakness,
    evidenceChainIncomplete,
    transitionAuditGap: doctrineTransitionAuditGap,
    nonRegressionGap: nonRegressionTraceGapDetected,
    decisionLineageBreak: decisionLineageBreakDetected,
    operationallyUnsustainable: operationalTraceUnsustainable,
    explainabilityWeakness: restorationTraceExplainabilityWeakness,
  });

  return {
    restorationTraceIntegrityClassification,
    traceReadinessClassification: getReadinessClassification({
      hasEvidence,
      blocked: traceIntegrityBlocked,
      traceIntegrityScore,
      warningTraceabilityScore,
      classificationTraceabilityScore,
      evidenceChainScore,
    }),
    traceSafetyClassification: getSafetyClassification({
      hasEvidence,
      unsafe: traceIntegrityUnsafe,
      collapseSensitive: traceCollapseSensitiveRejection,
      traceCollapseExposureScore,
      traceConflictScore,
    }),
    traceIntegrityScore: clampScore(traceIntegrityScore),
    warningTraceabilityScore: clampScore(warningTraceabilityScore),
    classificationTraceabilityScore: clampScore(classificationTraceabilityScore),
    evidenceChainScore: clampScore(evidenceChainScore),
    transitionAuditabilityScore: clampScore(transitionAuditabilityScore),
    nonRegressionTraceScore: clampScore(nonRegressionTraceScore),
    survivabilityContinuityTraceScore: clampScore(survivabilityContinuityTraceScore),
    failClosedTraceScore: clampScore(failClosedTraceScore),
    decisionLineageScore: clampScore(decisionLineageScore),
    traceConflictScore: clampScore(traceConflictScore),
    traceCollapseExposureScore: clampScore(traceCollapseExposureScore),
    operationalTraceSustainabilityScore: clampScore(operationalTraceSustainabilityScore),
    traceIntegrityBlocked,
    traceIntegrityUnsafe,
    traceContinuationRequired,
    boundedTraceReevaluationRequired,
    traceCollapseSensitiveRejection,
    failClosedTraceDegradation,
    missingTraceEvidenceDetected,
    unresolvedTraceConflictDetected,
    warningTraceabilityWeakness,
    classificationTraceabilityWeakness,
    evidenceChainIncomplete,
    decisionLineageBreakDetected,
    nonRegressionTraceGapDetected,
    operationalTraceUnsustainable,
    restorationTraceIntegrityUnverified,
    warningCodes,
    explainability: buildExplainability({
      hasEvidence,
      classification: restorationTraceIntegrityClassification,
      warningCodes,
      traceIntegrityScore,
      warningTraceabilityScore,
      classificationTraceabilityScore,
      evidenceChainScore,
      transitionAuditabilityScore,
      nonRegressionTraceScore,
      survivabilityContinuityTraceScore,
      failClosedTraceScore,
      decisionLineageScore,
      traceConflictScore,
      traceCollapseExposureScore,
      operationalTraceSustainabilityScore,
      missingTraceEvidenceCount,
      transitionGapCount,
      nonRegressionGapCount,
    }),
    ingestionBlocked: true,
    automationBlocked: true,
    executionBlocked: true,
    planningOnly: true,
    failClosed: true,
  };
}
