export type MaintenanceReadinessLevel =
  | "unknown"
  | "blocked"
  | "limited"
  | "conditional"
  | "ready"
  | "durable"
  | "institutional";

export type MaintenanceSafetyLevel =
  | "unknown"
  | "unsafe"
  | "risky"
  | "guarded"
  | "safe"
  | "institutional";

export type MaintenanceSustainabilityLevel =
  | "unknown"
  | "unsustainable"
  | "strained"
  | "conditional"
  | "sustainable"
  | "durable"
  | "institutional";

export type MaintenanceRiskLevel = "none" | "low" | "moderate" | "high" | "critical";

export type MaintenanceExplainabilityLevel =
  | "opaque"
  | "partial"
  | "adequate"
  | "strong"
  | "institutional";

export type FailClosedMaintenanceIntegrityLevel =
  | "absent"
  | "inconsistent"
  | "partial"
  | "stable"
  | "durable"
  | "institutional";

export type OperationalMaintenanceSustainabilityLevel =
  | "unknown"
  | "unsustainable"
  | "strained"
  | "viable"
  | "durable"
  | "institutional";

export type OversightRequirementLevel =
  | "none"
  | "low"
  | "moderate"
  | "elevated"
  | "intensive";

export type CountyGovernanceEntropyDoctrineMaintenanceReadinessClassification =
  | "durable_maintenance_ready"
  | "conditional_maintenance_ready"
  | "superficial_maintenance_ready"
  | "maintenance_blocked"
  | "maintenance_unsafe"
  | "maintenance_continuation_required"
  | "maintenance_entropy_burden"
  | "maintenance_explainability_weakness"
  | "fail_closed_maintenance_degradation"
  | "recursive_dependency_conflict"
  | "collapse_sensitive_maintenance_rejection"
  | "bounded_reevaluation_required"
  | "maintenance_survivability_weakness"
  | "unresolved_doctrine_conflict"
  | "operationally_unsustainable_maintenance"
  | "maintenance_readiness_unverified";

export type CountyGovernanceEntropyDoctrineMaintenanceReadinessReadinessClassification =
  | "ready"
  | "conditionally_ready"
  | "not_ready"
  | "blocked"
  | "readiness_unverified";

export type CountyGovernanceEntropyDoctrineMaintenanceSafetyClassification =
  | "safe"
  | "guarded"
  | "unsafe"
  | "collapse_sensitive"
  | "safety_unverified";

export type CountyGovernanceEntropyDoctrineMaintenanceReadinessWarningCode =
  | "S28_MAINTENANCE_READINESS_UNVERIFIED"
  | "S28_MAINTENANCE_BLOCKED"
  | "S28_MAINTENANCE_UNSAFE"
  | "S28_SUPERFICIAL_MAINTENANCE_READY"
  | "S28_MAINTENANCE_CONTINUATION_REQUIRED"
  | "S28_BOUNDED_REEVALUATION_REQUIRED"
  | "S28_MAINTENANCE_ENTROPY_BURDEN"
  | "S28_MAINTENANCE_EXPLAINABILITY_WEAK"
  | "S28_FAIL_CLOSED_MAINTENANCE_DEGRADATION"
  | "S28_RECURSIVE_DEPENDENCY_CONFLICT"
  | "S28_COLLAPSE_SENSITIVE_MAINTENANCE_REJECTION"
  | "S28_MAINTENANCE_SURVIVABILITY_WEAKNESS"
  | "S28_UNRESOLVED_DOCTRINE_CONFLICT"
  | "S28_OPERATIONALLY_UNSUSTAINABLE_MAINTENANCE"
  | "S28_OVERSIGHT_REQUIRED";

export interface CountyGovernanceEntropyDoctrineMaintenanceReadinessInput {
  maintenanceReadinessLevel?: MaintenanceReadinessLevel | null;
  maintenanceSafetyLevel?: MaintenanceSafetyLevel | null;
  maintenanceSustainabilityLevel?: MaintenanceSustainabilityLevel | null;
  maintenanceEntropyBurdenLevel?: MaintenanceRiskLevel | null;
  maintenanceExplainabilityLevel?: MaintenanceExplainabilityLevel | null;
  failClosedMaintenanceIntegrityLevel?: FailClosedMaintenanceIntegrityLevel | null;
  maintenanceContinuationNeedLevel?: MaintenanceRiskLevel | null;
  boundedReevaluationNeedLevel?: MaintenanceRiskLevel | null;
  survivabilityConflictLevel?: MaintenanceRiskLevel | null;
  finalityConflictLevel?: MaintenanceRiskLevel | null;
  recursiveDependencyLevel?: MaintenanceRiskLevel | null;
  collapseExposureLevel?: MaintenanceRiskLevel | null;
  operationalSustainabilityLevel?: OperationalMaintenanceSustainabilityLevel | null;
  oversightRequirementLevel?: OversightRequirementLevel | null;
  unresolvedDoctrineConflictCount?: number | null;
  maintenanceCycleCount?: number | null;
  reevaluationEvidenceCount?: number | null;
  failClosedDegradationCount?: number | null;
  explainabilityWeaknessCount?: number | null;
  recursiveDependencyEventCount?: number | null;
}

export interface CountyGovernanceEntropyDoctrineMaintenanceReadinessExplainability {
  summary: string;
  readinessDrivers: string[];
  safetyDrivers: string[];
  sustainabilityDrivers: string[];
  entropyBurdenDrivers: string[];
  reevaluationDrivers: string[];
  continuationDrivers: string[];
  conflictDrivers: string[];
  failClosedDrivers: string[];
  warningDerivation: string[];
  deterministicRulesApplied: string[];
}

export interface CountyGovernanceEntropyDoctrineMaintenanceReadinessResult {
  maintenanceReadinessClassification: CountyGovernanceEntropyDoctrineMaintenanceReadinessClassification;
  readinessClassification: CountyGovernanceEntropyDoctrineMaintenanceReadinessReadinessClassification;
  maintenanceSafetyClassification: CountyGovernanceEntropyDoctrineMaintenanceSafetyClassification;
  readinessScore: number;
  safetyScore: number;
  sustainabilityScore: number;
  entropyBurdenScore: number;
  explainabilityScore: number;
  failClosedIntegrityScore: number;
  continuationNeedScore: number;
  boundedReevaluationNeedScore: number;
  collapseExposureScore: number;
  maintenanceBlocked: boolean;
  maintenanceUnsafe: boolean;
  maintenanceContinuationRequired: boolean;
  boundedReevaluationRequired: boolean;
  collapseSensitiveRejection: boolean;
  failClosedMaintenanceDegradation: boolean;
  superficialMaintenanceReadiness: boolean;
  recursiveDependencyConflict: boolean;
  maintenanceSurvivabilityWeakness: boolean;
  unresolvedDoctrineConflict: boolean;
  warningCodes: CountyGovernanceEntropyDoctrineMaintenanceReadinessWarningCode[];
  explainability: CountyGovernanceEntropyDoctrineMaintenanceReadinessExplainability;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const readinessScores: Record<MaintenanceReadinessLevel, number> = {
  unknown: 0,
  blocked: 5,
  limited: 35,
  conditional: 60,
  ready: 78,
  durable: 88,
  institutional: 96,
};

const safetyScores: Record<MaintenanceSafetyLevel, number> = {
  unknown: 0,
  unsafe: 5,
  risky: 35,
  guarded: 60,
  safe: 85,
  institutional: 96,
};

const sustainabilityScores: Record<MaintenanceSustainabilityLevel, number> = {
  unknown: 0,
  unsustainable: 5,
  strained: 35,
  conditional: 60,
  sustainable: 78,
  durable: 88,
  institutional: 96,
};

const riskScores: Record<MaintenanceRiskLevel, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const explainabilityScores: Record<MaintenanceExplainabilityLevel, number> = {
  opaque: 0,
  partial: 38,
  adequate: 65,
  strong: 84,
  institutional: 96,
};

const failClosedScores: Record<FailClosedMaintenanceIntegrityLevel, number> = {
  absent: 0,
  inconsistent: 25,
  partial: 55,
  stable: 72,
  durable: 86,
  institutional: 96,
};

const operationalSustainabilityScores: Record<OperationalMaintenanceSustainabilityLevel, number> = {
  unknown: 0,
  unsustainable: 5,
  strained: 45,
  viable: 72,
  durable: 88,
  institutional: 96,
};

const oversightScores: Record<OversightRequirementLevel, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  elevated: 78,
  intensive: 100,
};

const warningOrder: CountyGovernanceEntropyDoctrineMaintenanceReadinessWarningCode[] = [
  "S28_MAINTENANCE_READINESS_UNVERIFIED",
  "S28_MAINTENANCE_BLOCKED",
  "S28_MAINTENANCE_UNSAFE",
  "S28_SUPERFICIAL_MAINTENANCE_READY",
  "S28_MAINTENANCE_CONTINUATION_REQUIRED",
  "S28_BOUNDED_REEVALUATION_REQUIRED",
  "S28_MAINTENANCE_ENTROPY_BURDEN",
  "S28_MAINTENANCE_EXPLAINABILITY_WEAK",
  "S28_FAIL_CLOSED_MAINTENANCE_DEGRADATION",
  "S28_RECURSIVE_DEPENDENCY_CONFLICT",
  "S28_COLLAPSE_SENSITIVE_MAINTENANCE_REJECTION",
  "S28_MAINTENANCE_SURVIVABILITY_WEAKNESS",
  "S28_UNRESOLVED_DOCTRINE_CONFLICT",
  "S28_OPERATIONALLY_UNSUSTAINABLE_MAINTENANCE",
  "S28_OVERSIGHT_REQUIRED",
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

function average(scores: number[]): number {
  if (scores.length === 0) {
    return 0;
  }

  return clampScore(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function hasAnyInput(input: CountyGovernanceEntropyDoctrineMaintenanceReadinessInput): boolean {
  return Object.values(input).some((value) => value !== undefined && value !== null);
}

function isHighRisk(level: MaintenanceRiskLevel | null | undefined): boolean {
  return level === "high" || level === "critical";
}

function isModerateOrHigherRisk(level: MaintenanceRiskLevel | null | undefined): boolean {
  return level === "moderate" || level === "high" || level === "critical";
}

function isWeakFailClosed(level: FailClosedMaintenanceIntegrityLevel | null | undefined): boolean {
  return level === "absent" || level === "inconsistent" || level === "partial";
}

function isWeakExplainability(level: MaintenanceExplainabilityLevel | null | undefined): boolean {
  return level === "opaque" || level === "partial";
}

function getReadinessClassification(params: {
  hasEvidence: boolean;
  maintenanceBlocked: boolean;
  readinessScore: number;
  safetyScore: number;
}): CountyGovernanceEntropyDoctrineMaintenanceReadinessReadinessClassification {
  if (!params.hasEvidence) {
    return "readiness_unverified";
  }

  if (params.maintenanceBlocked) {
    return "blocked";
  }

  if (params.readinessScore >= 78 && params.safetyScore >= 85) {
    return "ready";
  }

  if (params.readinessScore >= 60 && params.safetyScore >= 60) {
    return "conditionally_ready";
  }

  return "not_ready";
}

function getSafetyClassification(params: {
  hasEvidence: boolean;
  maintenanceUnsafe: boolean;
  collapseSensitiveRejection: boolean;
  safetyScore: number;
}): CountyGovernanceEntropyDoctrineMaintenanceSafetyClassification {
  if (!params.hasEvidence) {
    return "safety_unverified";
  }

  if (params.collapseSensitiveRejection) {
    return "collapse_sensitive";
  }

  if (params.maintenanceUnsafe || params.safetyScore < 35) {
    return "unsafe";
  }

  if (params.safetyScore >= 85) {
    return "safe";
  }

  return "guarded";
}

function getMaintenanceReadinessClassification(params: {
  hasEvidence: boolean;
  readinessScore: number;
  safetyScore: number;
  sustainabilityScore: number;
  entropyBurdenScore: number;
  explainabilityScore: number;
  failClosedIntegrityScore: number;
  continuationNeedScore: number;
  boundedReevaluationNeedScore: number;
  collapseExposureScore: number;
  operationalSustainabilityScore: number;
  maintenanceBlocked: boolean;
  maintenanceUnsafe: boolean;
  maintenanceContinuationRequired: boolean;
  boundedReevaluationRequired: boolean;
  collapseSensitiveRejection: boolean;
  failClosedMaintenanceDegradation: boolean;
  superficialMaintenanceReadiness: boolean;
  recursiveDependencyConflict: boolean;
  maintenanceSurvivabilityWeakness: boolean;
  unresolvedDoctrineConflict: boolean;
}): CountyGovernanceEntropyDoctrineMaintenanceReadinessClassification {
  if (!params.hasEvidence) {
    return "maintenance_readiness_unverified";
  }

  if (params.collapseSensitiveRejection) {
    return "collapse_sensitive_maintenance_rejection";
  }

  if (params.maintenanceUnsafe) {
    return "maintenance_unsafe";
  }

  if (params.maintenanceBlocked) {
    return "maintenance_blocked";
  }

  if (params.operationalSustainabilityScore <= 5) {
    return "operationally_unsustainable_maintenance";
  }

  if (params.failClosedMaintenanceDegradation) {
    return "fail_closed_maintenance_degradation";
  }

  if (params.recursiveDependencyConflict) {
    return "recursive_dependency_conflict";
  }

  if (params.unresolvedDoctrineConflict) {
    return "unresolved_doctrine_conflict";
  }

  if (params.maintenanceSurvivabilityWeakness) {
    return "maintenance_survivability_weakness";
  }

  if (params.maintenanceContinuationRequired) {
    return "maintenance_continuation_required";
  }

  if (params.boundedReevaluationRequired) {
    return "bounded_reevaluation_required";
  }

  if (params.explainabilityScore < 65) {
    return "maintenance_explainability_weakness";
  }

  if (params.entropyBurdenScore >= 50) {
    return "maintenance_entropy_burden";
  }

  if (params.superficialMaintenanceReadiness) {
    return "superficial_maintenance_ready";
  }

  if (
    params.readinessScore >= 60 &&
    params.safetyScore >= 60 &&
    params.sustainabilityScore >= 60 &&
    params.failClosedIntegrityScore >= 72
  ) {
    if (
      params.readinessScore >= 88 &&
      params.safetyScore >= 85 &&
      params.sustainabilityScore >= 78 &&
      params.explainabilityScore >= 84 &&
      params.failClosedIntegrityScore >= 86 &&
      params.continuationNeedScore <= 20 &&
      params.boundedReevaluationNeedScore <= 20 &&
      params.collapseExposureScore <= 20
    ) {
      return "durable_maintenance_ready";
    }

    return "conditional_maintenance_ready";
  }

  return "maintenance_readiness_unverified";
}

function buildWarnings(params: {
  hasEvidence: boolean;
  maintenanceBlocked: boolean;
  maintenanceUnsafe: boolean;
  maintenanceContinuationRequired: boolean;
  boundedReevaluationRequired: boolean;
  collapseSensitiveRejection: boolean;
  failClosedMaintenanceDegradation: boolean;
  superficialMaintenanceReadiness: boolean;
  recursiveDependencyConflict: boolean;
  maintenanceSurvivabilityWeakness: boolean;
  unresolvedDoctrineConflict: boolean;
  entropyBurdenScore: number;
  explainabilityScore: number;
  operationalSustainabilityScore: number;
  oversightScore: number;
}): CountyGovernanceEntropyDoctrineMaintenanceReadinessWarningCode[] {
  const warnings = new Set<CountyGovernanceEntropyDoctrineMaintenanceReadinessWarningCode>();

  if (!params.hasEvidence) {
    warnings.add("S28_MAINTENANCE_READINESS_UNVERIFIED");
  }

  if (params.maintenanceBlocked) {
    warnings.add("S28_MAINTENANCE_BLOCKED");
  }

  if (params.maintenanceUnsafe) {
    warnings.add("S28_MAINTENANCE_UNSAFE");
  }

  if (params.superficialMaintenanceReadiness) {
    warnings.add("S28_SUPERFICIAL_MAINTENANCE_READY");
  }

  if (params.maintenanceContinuationRequired) {
    warnings.add("S28_MAINTENANCE_CONTINUATION_REQUIRED");
  }

  if (params.boundedReevaluationRequired) {
    warnings.add("S28_BOUNDED_REEVALUATION_REQUIRED");
  }

  if (params.entropyBurdenScore >= 50) {
    warnings.add("S28_MAINTENANCE_ENTROPY_BURDEN");
  }

  if (params.explainabilityScore < 65 && params.hasEvidence) {
    warnings.add("S28_MAINTENANCE_EXPLAINABILITY_WEAK");
  }

  if (params.failClosedMaintenanceDegradation) {
    warnings.add("S28_FAIL_CLOSED_MAINTENANCE_DEGRADATION");
  }

  if (params.recursiveDependencyConflict) {
    warnings.add("S28_RECURSIVE_DEPENDENCY_CONFLICT");
  }

  if (params.collapseSensitiveRejection) {
    warnings.add("S28_COLLAPSE_SENSITIVE_MAINTENANCE_REJECTION");
  }

  if (params.maintenanceSurvivabilityWeakness) {
    warnings.add("S28_MAINTENANCE_SURVIVABILITY_WEAKNESS");
  }

  if (params.unresolvedDoctrineConflict) {
    warnings.add("S28_UNRESOLVED_DOCTRINE_CONFLICT");
  }

  if (params.operationalSustainabilityScore <= 5) {
    warnings.add("S28_OPERATIONALLY_UNSUSTAINABLE_MAINTENANCE");
  }

  if (params.oversightScore >= 50) {
    warnings.add("S28_OVERSIGHT_REQUIRED");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function buildExplainability(params: {
  hasEvidence: boolean;
  classification: CountyGovernanceEntropyDoctrineMaintenanceReadinessClassification;
  warningCodes: CountyGovernanceEntropyDoctrineMaintenanceReadinessWarningCode[];
  readinessScore: number;
  safetyScore: number;
  sustainabilityScore: number;
  entropyBurdenScore: number;
  explainabilityScore: number;
  failClosedIntegrityScore: number;
  continuationNeedScore: number;
  boundedReevaluationNeedScore: number;
  collapseExposureScore: number;
  oversightScore: number;
  reevaluationEvidenceCount: number;
}): CountyGovernanceEntropyDoctrineMaintenanceReadinessExplainability {
  return {
    summary: params.hasEvidence
      ? `S28 classified maintenance readiness as ${params.classification}.`
      : "S28 classified maintenance readiness as unverified because no caller-supplied evidence was provided.",
    readinessDrivers: [
      `maintenance readiness score: ${params.readinessScore}`,
      `reevaluation evidence count: ${params.reevaluationEvidenceCount}`,
    ],
    safetyDrivers: [
      `maintenance safety score: ${params.safetyScore}`,
      `collapse exposure score: ${params.collapseExposureScore}`,
    ],
    sustainabilityDrivers: [`maintenance sustainability score: ${params.sustainabilityScore}`],
    entropyBurdenDrivers: [`maintenance entropy burden score: ${params.entropyBurdenScore}`],
    reevaluationDrivers: [`bounded reevaluation need score: ${params.boundedReevaluationNeedScore}`],
    continuationDrivers: [`maintenance continuation need score: ${params.continuationNeedScore}`],
    conflictDrivers: [`oversight requirement score: ${params.oversightScore}`],
    failClosedDrivers: [`fail-closed maintenance integrity score: ${params.failClosedIntegrityScore}`],
    warningDerivation: params.warningCodes.map((warning) => `${warning} derived from deterministic S28 thresholds.`),
    deterministicRulesApplied: [
      "Pure caller-input-only maintenance readiness modeling.",
      "Fixed ordinal maps and bounded 0-100 scores.",
      "Stable warning-code ordering.",
      "Explicit maintenance precedence ordering.",
      "No runtime, provider, database, network, clock, filesystem, or environment dependency.",
    ],
  };
}

export function evaluateCountyGovernanceEntropyDoctrineMaintenanceReadiness(
  input: CountyGovernanceEntropyDoctrineMaintenanceReadinessInput = {},
): CountyGovernanceEntropyDoctrineMaintenanceReadinessResult {
  const hasEvidence = hasAnyInput(input);

  const unresolvedDoctrineConflictCount = clampCount(input.unresolvedDoctrineConflictCount);
  const maintenanceCycleCount = clampCount(input.maintenanceCycleCount);
  const reevaluationEvidenceCount = clampCount(input.reevaluationEvidenceCount);
  const failClosedDegradationCount = clampCount(input.failClosedDegradationCount);
  const explainabilityWeaknessCount = clampCount(input.explainabilityWeaknessCount);
  const recursiveDependencyEventCount = clampCount(input.recursiveDependencyEventCount);

  const readinessScore = readinessScores[input.maintenanceReadinessLevel ?? "unknown"];
  const safetyScore = safetyScores[input.maintenanceSafetyLevel ?? "unknown"];
  const sustainabilityScore = sustainabilityScores[input.maintenanceSustainabilityLevel ?? "unknown"];
  const entropyBurdenScore = riskScores[input.maintenanceEntropyBurdenLevel ?? "none"];
  const explainabilityScore = explainabilityScores[input.maintenanceExplainabilityLevel ?? "opaque"];
  const failClosedIntegrityScore = failClosedScores[input.failClosedMaintenanceIntegrityLevel ?? "absent"];
  const continuationNeedScore = riskScores[input.maintenanceContinuationNeedLevel ?? "none"];
  const boundedReevaluationNeedScore = Math.max(
    riskScores[input.boundedReevaluationNeedLevel ?? "none"],
    reevaluationEvidenceCount < 1 && hasEvidence ? 50 : 0,
  );
  const survivabilityConflictScore = riskScores[input.survivabilityConflictLevel ?? "none"];
  const finalityConflictScore = riskScores[input.finalityConflictLevel ?? "none"];
  const recursiveDependencyScore = riskScores[input.recursiveDependencyLevel ?? "none"];
  const collapseExposureScore = riskScores[input.collapseExposureLevel ?? "none"];
  const operationalSustainabilityScore =
    operationalSustainabilityScores[input.operationalSustainabilityLevel ?? "unknown"];
  const oversightScore = oversightScores[input.oversightRequirementLevel ?? "none"];

  const failClosedMaintenanceDegradation =
    isWeakFailClosed(input.failClosedMaintenanceIntegrityLevel) || failClosedDegradationCount > 0;

  const recursiveDependencyConflict =
    isHighRisk(input.recursiveDependencyLevel) || recursiveDependencyEventCount > 0;

  const unresolvedDoctrineConflict =
    unresolvedDoctrineConflictCount > 0 ||
    isHighRisk(input.finalityConflictLevel) ||
    isHighRisk(input.survivabilityConflictLevel);

  const maintenanceSurvivabilityWeakness =
    survivabilityConflictScore >= 78 || (survivabilityConflictScore >= 50 && continuationNeedScore >= 50);

  const collapseSensitiveRejection =
    isHighRisk(input.collapseExposureLevel) ||
    (collapseExposureScore >= 50 &&
      (entropyBurdenScore >= 78 || failClosedMaintenanceDegradation || unresolvedDoctrineConflict));

  const maintenanceUnsafe =
    input.maintenanceSafetyLevel === "unsafe" ||
    safetyScore <= 5 ||
    collapseExposureScore >= 100 ||
    (collapseExposureScore >= 78 && entropyBurdenScore >= 78);

  const maintenanceBlocked =
    input.maintenanceReadinessLevel === "blocked" ||
    (finalityConflictScore >= 78 && survivabilityConflictScore >= 78) ||
    (readinessScore < 35 && continuationNeedScore >= 78);

  const boundedReevaluationRequired =
    !maintenanceUnsafe &&
    !collapseSensitiveRejection &&
    !maintenanceBlocked &&
    (boundedReevaluationNeedScore >= 50 ||
      oversightScore >= 50 ||
      entropyBurdenScore >= 50 ||
      input.maintenanceSustainabilityLevel === "conditional" ||
      input.maintenanceSustainabilityLevel === "strained");

  const maintenanceContinuationRequired =
    !maintenanceUnsafe &&
    !collapseSensitiveRejection &&
    !maintenanceBlocked &&
    !failClosedMaintenanceDegradation &&
    (continuationNeedScore >= 50 ||
      finalityConflictScore >= 50 ||
      survivabilityConflictScore >= 50 ||
      maintenanceCycleCount < 1);

  const superficialMaintenanceReadiness =
    readinessScore >= 78 &&
    (explainabilityScore < 65 ||
      failClosedIntegrityScore < 72 ||
      reevaluationEvidenceCount < 1 ||
      explainabilityWeaknessCount > 0);

  const warningCodes = buildWarnings({
    hasEvidence,
    maintenanceBlocked,
    maintenanceUnsafe,
    maintenanceContinuationRequired,
    boundedReevaluationRequired,
    collapseSensitiveRejection,
    failClosedMaintenanceDegradation,
    superficialMaintenanceReadiness,
    recursiveDependencyConflict,
    maintenanceSurvivabilityWeakness,
    unresolvedDoctrineConflict,
    entropyBurdenScore,
    explainabilityScore,
    operationalSustainabilityScore,
    oversightScore,
  });

  const maintenanceReadinessClassification = getMaintenanceReadinessClassification({
    hasEvidence,
    readinessScore,
    safetyScore,
    sustainabilityScore,
    entropyBurdenScore,
    explainabilityScore,
    failClosedIntegrityScore,
    continuationNeedScore,
    boundedReevaluationNeedScore,
    collapseExposureScore,
    operationalSustainabilityScore,
    maintenanceBlocked,
    maintenanceUnsafe,
    maintenanceContinuationRequired,
    boundedReevaluationRequired,
    collapseSensitiveRejection,
    failClosedMaintenanceDegradation,
    superficialMaintenanceReadiness,
    recursiveDependencyConflict,
    maintenanceSurvivabilityWeakness,
    unresolvedDoctrineConflict,
  });

  return {
    maintenanceReadinessClassification,
    readinessClassification: getReadinessClassification({
      hasEvidence,
      maintenanceBlocked,
      readinessScore,
      safetyScore,
    }),
    maintenanceSafetyClassification: getSafetyClassification({
      hasEvidence,
      maintenanceUnsafe,
      collapseSensitiveRejection,
      safetyScore,
    }),
    readinessScore: clampScore(readinessScore),
    safetyScore: clampScore(safetyScore),
    sustainabilityScore: clampScore(sustainabilityScore),
    entropyBurdenScore: clampScore(entropyBurdenScore),
    explainabilityScore: clampScore(explainabilityScore),
    failClosedIntegrityScore: clampScore(failClosedIntegrityScore),
    continuationNeedScore: clampScore(continuationNeedScore),
    boundedReevaluationNeedScore: clampScore(boundedReevaluationNeedScore),
    collapseExposureScore: clampScore(collapseExposureScore),
    maintenanceBlocked,
    maintenanceUnsafe,
    maintenanceContinuationRequired,
    boundedReevaluationRequired,
    collapseSensitiveRejection,
    failClosedMaintenanceDegradation,
    superficialMaintenanceReadiness,
    recursiveDependencyConflict,
    maintenanceSurvivabilityWeakness,
    unresolvedDoctrineConflict,
    warningCodes,
    explainability: buildExplainability({
      hasEvidence,
      classification: maintenanceReadinessClassification,
      warningCodes,
      readinessScore,
      safetyScore,
      sustainabilityScore,
      entropyBurdenScore,
      explainabilityScore,
      failClosedIntegrityScore,
      continuationNeedScore,
      boundedReevaluationNeedScore,
      collapseExposureScore,
      oversightScore,
      reevaluationEvidenceCount,
    }),
    ingestionBlocked: true,
    automationBlocked: true,
    executionBlocked: true,
    planningOnly: true,
    failClosed: true,
  };
}
