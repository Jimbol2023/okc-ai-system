export type FinalityReadinessLevel =
  | "unknown"
  | "blocked"
  | "temporary"
  | "conditional"
  | "durable"
  | "institutional";

export type FinalityDurabilityLevel =
  | "unknown"
  | "fragile"
  | "temporary"
  | "stable"
  | "durable"
  | "institutional";

export type FinalitySafetyLevel =
  | "unknown"
  | "unsafe"
  | "risky"
  | "guarded"
  | "safe"
  | "institutional";

export type FinalityRiskLevel = "none" | "low" | "moderate" | "high" | "critical";

export type MaintenanceOnlyReadinessLevel =
  | "unready"
  | "limited"
  | "conditional"
  | "ready"
  | "institutional";

export type FailClosedFinalityIntegrityLevel =
  | "absent"
  | "inconsistent"
  | "partial"
  | "stable"
  | "durable"
  | "institutional";

export type FinalityExplainabilityLevel =
  | "opaque"
  | "partial"
  | "adequate"
  | "strong"
  | "institutional";

export type CountyGovernanceEntropyDoctrineFinalityClassification =
  | "durable_doctrine_finality"
  | "conditional_doctrine_finality"
  | "temporary_doctrine_finality"
  | "maintenance_only_ready"
  | "bounded_continuation_required"
  | "superficial_finality"
  | "finality_blocked"
  | "finality_unsafe"
  | "finality_impossible"
  | "irreversible_finality_failure"
  | "fail_closed_finality_block"
  | "doctrine_finality_unverified";

export type CountyGovernanceEntropyDoctrineFinalityReadinessClassification =
  | "ready_for_maintenance_only"
  | "conditionally_ready"
  | "not_ready"
  | "blocked_by_unresolved_risk"
  | "readiness_unverified";

export type CountyGovernanceEntropyDoctrineClosureClassification =
  | "closure_safe_advisory_only"
  | "closure_requires_bounds"
  | "closure_risky"
  | "closure_rejected"
  | "closure_unverified";

export type CountyGovernanceEntropyDoctrineFinalityWarningCode =
  | "S27_DOCTRINE_FINALITY_UNVERIFIED"
  | "S27_FINALITY_BLOCKED"
  | "S27_FINALITY_UNSAFE"
  | "S27_SUPERFICIAL_FINALITY_DETECTED"
  | "S27_BOUNDED_CONTINUATION_REQUIRED"
  | "S27_MAINTENANCE_ONLY_NOT_READY"
  | "S27_CLOSURE_RISK_HIGH"
  | "S27_FAIL_CLOSED_FINALITY_BLOCK"
  | "S27_IRREVERSIBLE_FINALITY_FAILURE"
  | "S27_RECURSIVE_DEPENDENCY_FINALITY_CONFLICT"
  | "S27_UNRESOLVED_ENTROPY_FINALITY_CONFLICT"
  | "S27_RECOVERY_RISK_FINALITY_CONFLICT"
  | "S27_CONTINUITY_RISK_FINALITY_CONFLICT"
  | "S27_SURVIVABILITY_RISK_FINALITY_CONFLICT"
  | "S27_COLLAPSE_SENSITIVE_FINALITY_REJECTED"
  | "S27_FINALITY_EXPLAINABILITY_WEAK"
  | "S27_DOCTRINE_CLOSURE_RISK";

export interface CountyGovernanceEntropyDoctrineFinalityInput {
  finalityReadinessLevel?: FinalityReadinessLevel | null;
  finalityDurabilityLevel?: FinalityDurabilityLevel | null;
  finalitySafetyLevel?: FinalitySafetyLevel | null;
  closureRiskLevel?: FinalityRiskLevel | null;
  maintenanceOnlyReadinessLevel?: MaintenanceOnlyReadinessLevel | null;
  unresolvedEntropyLevel?: FinalityRiskLevel | null;
  recoveryDoctrineRiskLevel?: FinalityRiskLevel | null;
  continuityDoctrineRiskLevel?: FinalityRiskLevel | null;
  survivabilityDoctrineRiskLevel?: FinalityRiskLevel | null;
  recursiveDependencyLevel?: FinalityRiskLevel | null;
  failClosedFinalityIntegrityLevel?: FailClosedFinalityIntegrityLevel | null;
  finalityExplainabilityLevel?: FinalityExplainabilityLevel | null;
  irreversibleDegradationLevel?: FinalityRiskLevel | null;
  collapseSensitivityLevel?: FinalityRiskLevel | null;
  boundedContinuationNeedLevel?: FinalityRiskLevel | null;
  unresolvedRiskCount?: number | null;
  finalityReviewCycleCount?: number | null;
  closureAttemptCount?: number | null;
  maintenanceReadinessEvidenceCount?: number | null;
  failClosedDegradationCount?: number | null;
  explainabilityWeaknessCount?: number | null;
}

export interface CountyGovernanceEntropyDoctrineFinalityExplainability {
  summary: string;
  finalityDrivers: string[];
  readinessDrivers: string[];
  closureRiskDrivers: string[];
  maintenanceOnlyDrivers: string[];
  boundedContinuationDrivers: string[];
  finalityBlockDrivers: string[];
  irreversibleFailureDrivers: string[];
  failClosedDrivers: string[];
  warningDerivation: string[];
  deterministicRulesApplied: string[];
}

export interface CountyGovernanceEntropyDoctrineFinalityResult {
  finalityClassification: CountyGovernanceEntropyDoctrineFinalityClassification;
  readinessClassification: CountyGovernanceEntropyDoctrineFinalityReadinessClassification;
  closureClassification: CountyGovernanceEntropyDoctrineClosureClassification;

  finalityReadinessScore: number;
  finalityDurabilityScore: number;
  finalitySafetyScore: number;
  closureRiskScore: number;
  maintenanceOnlyReadinessScore: number;
  boundedContinuationNeedScore: number;
  irreversibleFinalityFailureScore: number;
  failClosedFinalityIntegrityScore: number;
  finalityExplainabilityScore: number;

  finalityBlocked: boolean;
  finalityUnsafe: boolean;
  durableFinalityDetected: boolean;
  maintenanceOnlyReady: boolean;
  boundedContinuationRequired: boolean;
  irreversibleFinalityFailureDetected: boolean;
  failClosedFinalityBlockDetected: boolean;
  superficialFinalityDetected: boolean;
  recursiveDependencyFinalityConflictDetected: boolean;
  unresolvedEntropyFinalityConflictDetected: boolean;
  collapseSensitiveFinalityRejected: boolean;

  warningCodes: CountyGovernanceEntropyDoctrineFinalityWarningCode[];
  explainability: CountyGovernanceEntropyDoctrineFinalityExplainability;

  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const finalityReadinessScores: Record<FinalityReadinessLevel, number> = {
  unknown: 0,
  blocked: 5,
  temporary: 35,
  conditional: 60,
  durable: 85,
  institutional: 96,
};

const finalityDurabilityScores: Record<FinalityDurabilityLevel, number> = {
  unknown: 0,
  fragile: 15,
  temporary: 35,
  stable: 65,
  durable: 85,
  institutional: 96,
};

const finalitySafetyScores: Record<FinalitySafetyLevel, number> = {
  unknown: 0,
  unsafe: 5,
  risky: 35,
  guarded: 60,
  safe: 85,
  institutional: 96,
};

const riskScores: Record<FinalityRiskLevel, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const maintenanceOnlyReadinessScores: Record<MaintenanceOnlyReadinessLevel, number> = {
  unready: 0,
  limited: 35,
  conditional: 60,
  ready: 85,
  institutional: 96,
};

const failClosedFinalityIntegrityScores: Record<FailClosedFinalityIntegrityLevel, number> = {
  absent: 0,
  inconsistent: 25,
  partial: 55,
  stable: 72,
  durable: 86,
  institutional: 96,
};

const finalityExplainabilityScores: Record<FinalityExplainabilityLevel, number> = {
  opaque: 0,
  partial: 38,
  adequate: 65,
  strong: 84,
  institutional: 96,
};

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

function hasAnyInput(input: CountyGovernanceEntropyDoctrineFinalityInput): boolean {
  return Object.values(input).some((value) => value !== undefined && value !== null);
}

function isHighRisk(level: FinalityRiskLevel | null | undefined): boolean {
  return level === "high" || level === "critical";
}

function isModerateOrHigherRisk(level: FinalityRiskLevel | null | undefined): boolean {
  return level === "moderate" || level === "high" || level === "critical";
}

function isWeakFailClosed(level: FailClosedFinalityIntegrityLevel | null | undefined): boolean {
  return level === "absent" || level === "inconsistent" || level === "partial";
}

function isWeakExplainability(level: FinalityExplainabilityLevel | null | undefined): boolean {
  return level === "opaque" || level === "partial";
}

function getReadinessClassification(params: {
  hasEvidence: boolean;
  finalityBlocked: boolean;
  maintenanceOnlyReady: boolean;
  readinessScore: number;
  safetyScore: number;
}): CountyGovernanceEntropyDoctrineFinalityReadinessClassification {
  if (!params.hasEvidence) {
    return "readiness_unverified";
  }

  if (params.finalityBlocked) {
    return "blocked_by_unresolved_risk";
  }

  if (params.maintenanceOnlyReady) {
    return "ready_for_maintenance_only";
  }

  if (params.readinessScore >= 60 && params.safetyScore >= 60) {
    return "conditionally_ready";
  }

  return "not_ready";
}

function getClosureClassification(params: {
  hasEvidence: boolean;
  irreversibleFinalityFailureDetected: boolean;
  failClosedFinalityBlockDetected: boolean;
  finalityUnsafe: boolean;
  closureRiskScore: number;
  boundedContinuationRequired: boolean;
  maintenanceOnlyReady: boolean;
}): CountyGovernanceEntropyDoctrineClosureClassification {
  if (!params.hasEvidence) {
    return "closure_unverified";
  }

  if (
    params.irreversibleFinalityFailureDetected ||
    params.failClosedFinalityBlockDetected ||
    params.finalityUnsafe ||
    params.closureRiskScore >= 100
  ) {
    return "closure_rejected";
  }

  if (params.closureRiskScore >= 78) {
    return "closure_risky";
  }

  if (params.boundedContinuationRequired) {
    return "closure_requires_bounds";
  }

  if (params.maintenanceOnlyReady) {
    return "closure_safe_advisory_only";
  }

  return "closure_requires_bounds";
}

function getFinalityClassification(params: {
  hasEvidence: boolean;
  finalityReadinessScore: number;
  finalityDurabilityScore: number;
  finalitySafetyScore: number;
  closureRiskScore: number;
  maintenanceOnlyReadinessScore: number;
  failClosedFinalityIntegrityScore: number;
  finalityExplainabilityScore: number;
  finalityBlocked: boolean;
  finalityUnsafe: boolean;
  durableFinalityDetected: boolean;
  maintenanceOnlyReady: boolean;
  boundedContinuationRequired: boolean;
  irreversibleFinalityFailureDetected: boolean;
  failClosedFinalityBlockDetected: boolean;
  superficialFinalityDetected: boolean;
  unresolvedEntropyFinalityConflictDetected: boolean;
  collapseSensitiveFinalityRejected: boolean;
}): CountyGovernanceEntropyDoctrineFinalityClassification {
  if (params.irreversibleFinalityFailureDetected) {
    return "irreversible_finality_failure";
  }

  if (params.failClosedFinalityBlockDetected) {
    return "fail_closed_finality_block";
  }

  if (
    params.hasEvidence &&
    params.closureRiskScore >= 100 &&
    (params.unresolvedEntropyFinalityConflictDetected || params.collapseSensitiveFinalityRejected)
  ) {
    return "finality_impossible";
  }

  if (params.finalityUnsafe) {
    return "finality_unsafe";
  }

  if (params.finalityBlocked) {
    return "finality_blocked";
  }

  if (params.boundedContinuationRequired) {
    return "bounded_continuation_required";
  }

  if (params.superficialFinalityDetected) {
    return "superficial_finality";
  }

  if (
    params.hasEvidence &&
    (params.finalityReadinessScore < 60 || params.finalityDurabilityScore < 60 || params.maintenanceOnlyReadinessScore < 60)
  ) {
    return "temporary_doctrine_finality";
  }

  if (
    params.hasEvidence &&
    params.finalityReadinessScore >= 60 &&
    params.finalityDurabilityScore >= 65 &&
    params.finalitySafetyScore >= 60
  ) {
    if (params.maintenanceOnlyReady && !params.durableFinalityDetected) {
      return "maintenance_only_ready";
    }

    if (params.durableFinalityDetected) {
      return "durable_doctrine_finality";
    }

    return "conditional_doctrine_finality";
  }

  return "doctrine_finality_unverified";
}

function getWarnings(params: {
  hasEvidence: boolean;
  finalityBlocked: boolean;
  finalityUnsafe: boolean;
  boundedContinuationRequired: boolean;
  maintenanceOnlyReady: boolean;
  irreversibleFinalityFailureDetected: boolean;
  failClosedFinalityBlockDetected: boolean;
  superficialFinalityDetected: boolean;
  recursiveDependencyFinalityConflictDetected: boolean;
  unresolvedEntropyFinalityConflictDetected: boolean;
  collapseSensitiveFinalityRejected: boolean;
  recoveryRiskScore: number;
  continuityRiskScore: number;
  survivabilityRiskScore: number;
  closureRiskScore: number;
  finalityExplainabilityScore: number;
}): CountyGovernanceEntropyDoctrineFinalityWarningCode[] {
  const warnings = new Set<CountyGovernanceEntropyDoctrineFinalityWarningCode>();

  if (!params.hasEvidence) {
    warnings.add("S27_DOCTRINE_FINALITY_UNVERIFIED");
  }

  if (params.finalityBlocked) {
    warnings.add("S27_FINALITY_BLOCKED");
  }

  if (params.finalityUnsafe) {
    warnings.add("S27_FINALITY_UNSAFE");
  }

  if (params.superficialFinalityDetected) {
    warnings.add("S27_SUPERFICIAL_FINALITY_DETECTED");
  }

  if (params.boundedContinuationRequired) {
    warnings.add("S27_BOUNDED_CONTINUATION_REQUIRED");
  }

  if (!params.maintenanceOnlyReady && params.hasEvidence) {
    warnings.add("S27_MAINTENANCE_ONLY_NOT_READY");
  }

  if (params.closureRiskScore >= 78) {
    warnings.add("S27_CLOSURE_RISK_HIGH");
  }

  if (params.failClosedFinalityBlockDetected) {
    warnings.add("S27_FAIL_CLOSED_FINALITY_BLOCK");
  }

  if (params.irreversibleFinalityFailureDetected) {
    warnings.add("S27_IRREVERSIBLE_FINALITY_FAILURE");
  }

  if (params.recursiveDependencyFinalityConflictDetected) {
    warnings.add("S27_RECURSIVE_DEPENDENCY_FINALITY_CONFLICT");
  }

  if (params.unresolvedEntropyFinalityConflictDetected) {
    warnings.add("S27_UNRESOLVED_ENTROPY_FINALITY_CONFLICT");
  }

  if (params.recoveryRiskScore >= 78) {
    warnings.add("S27_RECOVERY_RISK_FINALITY_CONFLICT");
  }

  if (params.continuityRiskScore >= 78) {
    warnings.add("S27_CONTINUITY_RISK_FINALITY_CONFLICT");
  }

  if (params.survivabilityRiskScore >= 78) {
    warnings.add("S27_SURVIVABILITY_RISK_FINALITY_CONFLICT");
  }

  if (params.collapseSensitiveFinalityRejected) {
    warnings.add("S27_COLLAPSE_SENSITIVE_FINALITY_REJECTED");
  }

  if (params.finalityExplainabilityScore < 65 && params.hasEvidence) {
    warnings.add("S27_FINALITY_EXPLAINABILITY_WEAK");
  }

  if (params.closureRiskScore >= 50) {
    warnings.add("S27_DOCTRINE_CLOSURE_RISK");
  }

  return Array.from(warnings);
}

function buildExplainability(params: {
  hasEvidence: boolean;
  classification: CountyGovernanceEntropyDoctrineFinalityClassification;
  warnings: CountyGovernanceEntropyDoctrineFinalityWarningCode[];
  finalityReadinessScore: number;
  finalityDurabilityScore: number;
  finalitySafetyScore: number;
  closureRiskScore: number;
  maintenanceOnlyReadinessScore: number;
  boundedContinuationNeedScore: number;
  irreversibleFinalityFailureScore: number;
  failClosedFinalityIntegrityScore: number;
  finalityExplainabilityScore: number;
}): CountyGovernanceEntropyDoctrineFinalityExplainability {
  return {
    summary: params.hasEvidence
      ? `S27 classified entropy doctrine finality as ${params.classification}.`
      : "S27 classified entropy doctrine finality as unverified because no caller-supplied evidence was provided.",
    finalityDrivers: [
      `finality readiness score: ${params.finalityReadinessScore}`,
      `finality durability score: ${params.finalityDurabilityScore}`,
      `finality safety score: ${params.finalitySafetyScore}`,
    ],
    readinessDrivers: [
      `maintenance-only readiness score: ${params.maintenanceOnlyReadinessScore}`,
      `finality explainability score: ${params.finalityExplainabilityScore}`,
    ],
    closureRiskDrivers: [`closure risk score: ${params.closureRiskScore}`],
    maintenanceOnlyDrivers: [`maintenance-only readiness score: ${params.maintenanceOnlyReadinessScore}`],
    boundedContinuationDrivers: [`bounded continuation need score: ${params.boundedContinuationNeedScore}`],
    finalityBlockDrivers: [
      `closure risk score: ${params.closureRiskScore}`,
      `bounded continuation need score: ${params.boundedContinuationNeedScore}`,
    ],
    irreversibleFailureDrivers: [`irreversible finality failure score: ${params.irreversibleFinalityFailureScore}`],
    failClosedDrivers: [`fail-closed finality integrity score: ${params.failClosedFinalityIntegrityScore}`],
    warningDerivation: params.warnings.map((warning) => `${warning} derived from deterministic S27 thresholds.`),
    deterministicRulesApplied: [
      "Pure caller-input-only finality modeling.",
      "Fixed ordinal maps and bounded 0-100 scores.",
      "Explicit finality precedence ordering.",
      "No runtime, provider, database, network, clock, filesystem, or environment dependency.",
    ],
  };
}

export function evaluateCountyGovernanceEntropyDoctrineFinality(
  input: CountyGovernanceEntropyDoctrineFinalityInput = {},
): CountyGovernanceEntropyDoctrineFinalityResult {
  const hasEvidence = hasAnyInput(input);

  const unresolvedRiskCount = clampCount(input.unresolvedRiskCount);
  const finalityReviewCycleCount = clampCount(input.finalityReviewCycleCount);
  const closureAttemptCount = clampCount(input.closureAttemptCount);
  const maintenanceReadinessEvidenceCount = clampCount(input.maintenanceReadinessEvidenceCount);
  const failClosedDegradationCount = clampCount(input.failClosedDegradationCount);
  const explainabilityWeaknessCount = clampCount(input.explainabilityWeaknessCount);

  const finalityReadinessScore = finalityReadinessScores[input.finalityReadinessLevel ?? "unknown"];
  const finalityDurabilityScore = finalityDurabilityScores[input.finalityDurabilityLevel ?? "unknown"];
  const finalitySafetyScore = finalitySafetyScores[input.finalitySafetyLevel ?? "unknown"];
  const closureRiskScore = riskScores[input.closureRiskLevel ?? "none"];
  const maintenanceOnlyReadinessScore = maintenanceOnlyReadinessScores[input.maintenanceOnlyReadinessLevel ?? "unready"];
  const unresolvedEntropyScore = riskScores[input.unresolvedEntropyLevel ?? "none"];
  const recoveryRiskScore = riskScores[input.recoveryDoctrineRiskLevel ?? "none"];
  const continuityRiskScore = riskScores[input.continuityDoctrineRiskLevel ?? "none"];
  const survivabilityRiskScore = riskScores[input.survivabilityDoctrineRiskLevel ?? "none"];
  const recursiveDependencyScore = riskScores[input.recursiveDependencyLevel ?? "none"];
  const failClosedFinalityIntegrityScore =
    failClosedFinalityIntegrityScores[input.failClosedFinalityIntegrityLevel ?? "absent"];
  const finalityExplainabilityScore = finalityExplainabilityScores[input.finalityExplainabilityLevel ?? "opaque"];
  const irreversibleDegradationScore = riskScores[input.irreversibleDegradationLevel ?? "none"];
  const collapseSensitivityScore = riskScores[input.collapseSensitivityLevel ?? "none"];
  const boundedContinuationNeedScore = Math.max(
    riskScores[input.boundedContinuationNeedLevel ?? "none"],
    average([
      unresolvedEntropyScore,
      recoveryRiskScore,
      continuityRiskScore,
      survivabilityRiskScore,
      recursiveDependencyScore,
    ]),
  );

  const unresolvedEntropyFinalityConflictDetected =
    isHighRisk(input.unresolvedEntropyLevel) || unresolvedRiskCount >= 3;

  const recursiveDependencyFinalityConflictDetected =
    isHighRisk(input.recursiveDependencyLevel) || (recursiveDependencyScore >= 50 && closureAttemptCount >= 2);

  const collapseSensitiveFinalityRejected =
    isHighRisk(input.collapseSensitivityLevel) || (collapseSensitivityScore >= 50 && closureRiskScore >= 78);

  const failClosedFinalityBlockDetected =
    isWeakFailClosed(input.failClosedFinalityIntegrityLevel) || failClosedDegradationCount > 0;

  const irreversibleFinalityFailureScore = Math.max(
    irreversibleDegradationScore,
    average([collapseSensitivityScore, closureRiskScore, unresolvedEntropyScore, 100 - failClosedFinalityIntegrityScore]),
  );

  const irreversibleFinalityFailureDetected =
    isHighRisk(input.irreversibleDegradationLevel) ||
    (collapseSensitivityScore >= 78 && closureRiskScore >= 78) ||
    (failClosedDegradationCount > 0 && unresolvedEntropyScore >= 78);

  const finalityUnsafe =
    input.finalitySafetyLevel === "unsafe" ||
    closureRiskScore >= 100 ||
    recoveryRiskScore >= 100 ||
    continuityRiskScore >= 100 ||
    survivabilityRiskScore >= 100 ||
    collapseSensitiveFinalityRejected;

  const finalityBlocked =
    input.finalityReadinessLevel === "blocked" ||
    unresolvedEntropyFinalityConflictDetected ||
    recursiveDependencyFinalityConflictDetected ||
    closureRiskScore >= 78 ||
    recoveryRiskScore >= 78 ||
    continuityRiskScore >= 78 ||
    survivabilityRiskScore >= 78;

  const maintenanceOnlyReady =
    maintenanceOnlyReadinessScore >= 85 &&
    maintenanceReadinessEvidenceCount >= 1 &&
    finalityExplainabilityScore >= 84 &&
    failClosedFinalityIntegrityScore >= 86 &&
    closureRiskScore <= 20 &&
    boundedContinuationNeedScore <= 20 &&
    !finalityBlocked &&
    !finalityUnsafe &&
    !irreversibleFinalityFailureDetected &&
    !failClosedFinalityBlockDetected;

  const boundedContinuationRequired =
    !irreversibleFinalityFailureDetected &&
    !failClosedFinalityBlockDetected &&
    !finalityUnsafe &&
    (isModerateOrHigherRisk(input.boundedContinuationNeedLevel) ||
      boundedContinuationNeedScore >= 50 ||
      finalityReviewCycleCount < 1 ||
      (maintenanceOnlyReadinessScore >= 60 && !maintenanceOnlyReady));

  const superficialFinalityDetected =
    finalityReadinessScore >= 85 &&
    finalityDurabilityScore >= 85 &&
    (finalitySafetyScore < 85 ||
      finalityExplainabilityScore < 65 ||
      boundedContinuationNeedScore >= 50 ||
      closureRiskScore >= 50 ||
      explainabilityWeaknessCount > 0);

  const durableFinalityDetected =
    finalityReadinessScore >= 85 &&
    finalityDurabilityScore >= 85 &&
    finalitySafetyScore >= 85 &&
    maintenanceOnlyReady &&
    finalityReviewCycleCount >= 1 &&
    closureAttemptCount <= 1 &&
    !boundedContinuationRequired &&
    !superficialFinalityDetected;

  const classification = getFinalityClassification({
    hasEvidence,
    finalityReadinessScore,
    finalityDurabilityScore,
    finalitySafetyScore,
    closureRiskScore,
    maintenanceOnlyReadinessScore,
    failClosedFinalityIntegrityScore,
    finalityExplainabilityScore,
    finalityBlocked,
    finalityUnsafe,
    durableFinalityDetected,
    maintenanceOnlyReady,
    boundedContinuationRequired,
    irreversibleFinalityFailureDetected,
    failClosedFinalityBlockDetected,
    superficialFinalityDetected,
    unresolvedEntropyFinalityConflictDetected,
    collapseSensitiveFinalityRejected,
  });

  const warnings = getWarnings({
    hasEvidence,
    finalityBlocked,
    finalityUnsafe,
    boundedContinuationRequired,
    maintenanceOnlyReady,
    irreversibleFinalityFailureDetected,
    failClosedFinalityBlockDetected,
    superficialFinalityDetected,
    recursiveDependencyFinalityConflictDetected,
    unresolvedEntropyFinalityConflictDetected,
    collapseSensitiveFinalityRejected,
    recoveryRiskScore,
    continuityRiskScore,
    survivabilityRiskScore,
    closureRiskScore,
    finalityExplainabilityScore,
  });

  return {
    finalityClassification: classification,
    readinessClassification: getReadinessClassification({
      hasEvidence,
      finalityBlocked,
      maintenanceOnlyReady,
      readinessScore: finalityReadinessScore,
      safetyScore: finalitySafetyScore,
    }),
    closureClassification: getClosureClassification({
      hasEvidence,
      irreversibleFinalityFailureDetected,
      failClosedFinalityBlockDetected,
      finalityUnsafe,
      closureRiskScore,
      boundedContinuationRequired,
      maintenanceOnlyReady,
    }),
    finalityReadinessScore: clampScore(finalityReadinessScore),
    finalityDurabilityScore: clampScore(finalityDurabilityScore),
    finalitySafetyScore: clampScore(finalitySafetyScore),
    closureRiskScore: clampScore(closureRiskScore),
    maintenanceOnlyReadinessScore: clampScore(maintenanceOnlyReadinessScore),
    boundedContinuationNeedScore: clampScore(boundedContinuationNeedScore),
    irreversibleFinalityFailureScore: clampScore(irreversibleFinalityFailureScore),
    failClosedFinalityIntegrityScore: clampScore(failClosedFinalityIntegrityScore),
    finalityExplainabilityScore: clampScore(finalityExplainabilityScore),
    finalityBlocked,
    finalityUnsafe,
    durableFinalityDetected,
    maintenanceOnlyReady,
    boundedContinuationRequired,
    irreversibleFinalityFailureDetected,
    failClosedFinalityBlockDetected,
    superficialFinalityDetected,
    recursiveDependencyFinalityConflictDetected,
    unresolvedEntropyFinalityConflictDetected,
    collapseSensitiveFinalityRejected,
    warningCodes: warnings,
    explainability: buildExplainability({
      hasEvidence,
      classification,
      warnings,
      finalityReadinessScore,
      finalityDurabilityScore,
      finalitySafetyScore,
      closureRiskScore,
      maintenanceOnlyReadinessScore,
      boundedContinuationNeedScore,
      irreversibleFinalityFailureScore,
      failClosedFinalityIntegrityScore,
      finalityExplainabilityScore,
    }),
    ingestionBlocked: true,
    automationBlocked: true,
    executionBlocked: true,
    planningOnly: true,
    failClosed: true,
  };
}
