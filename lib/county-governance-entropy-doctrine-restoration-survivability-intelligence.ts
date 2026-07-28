export type RestorationSurvivabilityLevel =
  | "unknown"
  | "broken"
  | "fragile"
  | "conditional"
  | "resilient"
  | "durable"
  | "institutional";

export type RestorationSurvivabilitySustainabilityLevel =
  | "unknown"
  | "unsustainable"
  | "strained"
  | "conditional"
  | "sustainable"
  | "durable"
  | "institutional";

export type RestorationSurvivabilitySafetyLevel =
  | "unknown"
  | "unsafe"
  | "risky"
  | "guarded"
  | "safe"
  | "institutional";

export type LongHorizonRestorationViabilityLevel =
  | "unknown"
  | "degrading"
  | "fragile"
  | "conditional"
  | "durable"
  | "institutional";

export type RepeatedCycleSurvivabilityLevel =
  | "unknown"
  | "weak"
  | "partial"
  | "conditional"
  | "strong"
  | "institutional";

export type RestorationSurvivabilityRiskLevel = "none" | "low" | "moderate" | "high" | "critical";

export type RestorationSurvivabilityExplainabilityLevel =
  | "opaque"
  | "partial"
  | "adequate"
  | "strong"
  | "institutional";

export type FailClosedSurvivabilityIntegrityLevel =
  | "absent"
  | "inconsistent"
  | "partial"
  | "stable"
  | "durable"
  | "institutional";

export type RestorationSurvivabilityCompatibilityLevel =
  | "unknown"
  | "poor"
  | "strained"
  | "conditional"
  | "compatible"
  | "durable";

export type OperationalSurvivabilitySustainabilityLevel =
  | "unknown"
  | "unsustainable"
  | "strained"
  | "viable"
  | "durable"
  | "institutional";

export type CountyGovernanceEntropyDoctrineRestorationSurvivabilityClassification =
  | "durable_restoration_survivability"
  | "conditional_restoration_survivability"
  | "fragile_restoration_survivability"
  | "restoration_survivability_exhaustion"
  | "restoration_survivability_blocked"
  | "restoration_survivability_unsafe"
  | "restoration_survivability_continuation_required"
  | "restoration_survivability_entropy_burden"
  | "restoration_survivability_explainability_weakness"
  | "fail_closed_survivability_degradation"
  | "recursive_survivability_dependency_conflict"
  | "collapse_sensitive_survivability_rejection"
  | "bounded_survivability_reevaluation_required"
  | "restoration_cycle_fragility_accumulation"
  | "unresolved_survivability_doctrine_conflict"
  | "operationally_unsustainable_survivability"
  | "restoration_survivability_unverified";

export type RestorationSurvivabilityReadinessClassification =
  | "ready"
  | "conditionally_ready"
  | "not_ready"
  | "blocked"
  | "readiness_unverified";

export type RestorationSurvivabilitySafetyClassification =
  | "safe"
  | "guarded"
  | "unsafe"
  | "collapse_sensitive"
  | "safety_unverified";

export type CountyGovernanceEntropyDoctrineRestorationSurvivabilityWarningCode =
  | "S34_RESTORATION_SURVIVABILITY_UNVERIFIED"
  | "S34_RESTORATION_SURVIVABILITY_BLOCKED"
  | "S34_RESTORATION_SURVIVABILITY_UNSAFE"
  | "S34_RESTORATION_SURVIVABILITY_CONTINUATION_REQUIRED"
  | "S34_BOUNDED_SURVIVABILITY_REEVALUATION_REQUIRED"
  | "S34_RESTORATION_SURVIVABILITY_ENTROPY_BURDEN"
  | "S34_RESTORATION_SURVIVABILITY_EXPLAINABILITY_WEAK"
  | "S34_FAIL_CLOSED_SURVIVABILITY_DEGRADATION"
  | "S34_RECURSIVE_SURVIVABILITY_DEPENDENCY_CONFLICT"
  | "S34_COLLAPSE_SENSITIVE_SURVIVABILITY_REJECTION"
  | "S34_RESTORATION_CYCLE_FRAGILITY_ACCUMULATION"
  | "S34_UNRESOLVED_SURVIVABILITY_DOCTRINE_CONFLICT"
  | "S34_OPERATIONALLY_UNSUSTAINABLE_SURVIVABILITY"
  | "S34_RESTORATION_SURVIVABILITY_EXHAUSTION"
  | "S34_SURVIVABILITY_DEPENDENCY_CONCENTRATION"
  | "S34_LONG_HORIZON_VIABILITY_WEAK"
  | "S34_REPEATED_CYCLE_SURVIVABILITY_WEAK"
  | "S34_RESTORATION_COMPATIBILITY_WEAK";

export interface CountyGovernanceEntropyDoctrineRestorationSurvivabilityInput {
  restorationSurvivabilityLevel?: RestorationSurvivabilityLevel | null;
  survivabilitySustainabilityLevel?: RestorationSurvivabilitySustainabilityLevel | null;
  survivabilitySafetyLevel?: RestorationSurvivabilitySafetyLevel | null;
  longHorizonViabilityLevel?: LongHorizonRestorationViabilityLevel | null;
  repeatedCycleSurvivabilityLevel?: RepeatedCycleSurvivabilityLevel | null;
  cycleFragilityAccumulationLevel?: RestorationSurvivabilityRiskLevel | null;
  restorationExhaustionPressureLevel?: RestorationSurvivabilityRiskLevel | null;
  survivabilityDependencyConcentrationLevel?: RestorationSurvivabilityRiskLevel | null;
  survivabilityExplainabilityLevel?: RestorationSurvivabilityExplainabilityLevel | null;
  failClosedSurvivabilityIntegrityLevel?: FailClosedSurvivabilityIntegrityLevel | null;
  survivabilityContinuationNeedLevel?: RestorationSurvivabilityRiskLevel | null;
  boundedSurvivabilityReevaluationNeedLevel?: RestorationSurvivabilityRiskLevel | null;
  recursiveSurvivabilityDependencyLevel?: RestorationSurvivabilityRiskLevel | null;
  collapseExposureLevel?: RestorationSurvivabilityRiskLevel | null;
  oversightCompatibilityLevel?: RestorationSurvivabilityCompatibilityLevel | null;
  stewardshipCompatibilityLevel?: RestorationSurvivabilityCompatibilityLevel | null;
  memoryCompatibilityLevel?: RestorationSurvivabilityCompatibilityLevel | null;
  successionCompatibilityLevel?: RestorationSurvivabilityCompatibilityLevel | null;
  restorationCompatibilityLevel?: RestorationSurvivabilityCompatibilityLevel | null;
  operationalSurvivabilitySustainabilityLevel?: OperationalSurvivabilitySustainabilityLevel | null;
  restorationCycleCount?: number | null;
  repeatedDisruptionCount?: number | null;
  fragilityAccumulationEventCount?: number | null;
  exhaustionEventCount?: number | null;
  unresolvedDoctrineConflictCount?: number | null;
  reevaluationEvidenceCount?: number | null;
  failClosedDegradationCount?: number | null;
  explainabilityWeaknessCount?: number | null;
  recursiveDependencyEventCount?: number | null;
  dependencyConcentrationEventCount?: number | null;
}

export interface RestorationSurvivabilityExplainability {
  summary: string;
  survivabilityDrivers: string[];
  sustainabilityDrivers: string[];
  safetyDrivers: string[];
  longHorizonDrivers: string[];
  repeatedCycleDrivers: string[];
  fragilityDrivers: string[];
  exhaustionDrivers: string[];
  dependencyDrivers: string[];
  reevaluationDrivers: string[];
  conflictDrivers: string[];
  failClosedDrivers: string[];
  warningDerivation: string[];
  deterministicRulesApplied: string[];
}

export interface CountyGovernanceEntropyDoctrineRestorationSurvivabilityResult {
  restorationSurvivabilityClassification: CountyGovernanceEntropyDoctrineRestorationSurvivabilityClassification;
  survivabilityReadinessClassification: RestorationSurvivabilityReadinessClassification;
  survivabilitySafetyClassification: RestorationSurvivabilitySafetyClassification;
  survivabilityScore: number;
  sustainabilityScore: number;
  safetyScore: number;
  longHorizonViabilityScore: number;
  repeatedCycleSurvivabilityScore: number;
  cycleFragilityScore: number;
  exhaustionPressureScore: number;
  dependencyConcentrationScore: number;
  explainabilityScore: number;
  failClosedIntegrityScore: number;
  continuationNeedScore: number;
  boundedReevaluationNeedScore: number;
  collapseExposureScore: number;
  operationalSustainabilityScore: number;
  restorationSurvivabilityBlocked: boolean;
  restorationSurvivabilityUnsafe: boolean;
  survivabilityContinuationRequired: boolean;
  boundedSurvivabilityReevaluationRequired: boolean;
  collapseSensitiveSurvivabilityRejection: boolean;
  failClosedSurvivabilityDegradation: boolean;
  recursiveSurvivabilityDependencyConflict: boolean;
  restorationCycleFragilityAccumulation: boolean;
  unresolvedSurvivabilityDoctrineConflict: boolean;
  restorationSurvivabilityExhaustion: boolean;
  operationallyUnsustainableSurvivability: boolean;
  warningCodes: CountyGovernanceEntropyDoctrineRestorationSurvivabilityWarningCode[];
  explainability: RestorationSurvivabilityExplainability;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const survivabilityScores: Record<RestorationSurvivabilityLevel, number> = {
  unknown: 0,
  broken: 5,
  fragile: 25,
  conditional: 60,
  resilient: 74,
  durable: 88,
  institutional: 96,
};

const sustainabilityScores: Record<RestorationSurvivabilitySustainabilityLevel, number> = {
  unknown: 0,
  unsustainable: 5,
  strained: 35,
  conditional: 60,
  sustainable: 78,
  durable: 88,
  institutional: 96,
};

const safetyScores: Record<RestorationSurvivabilitySafetyLevel, number> = {
  unknown: 0,
  unsafe: 5,
  risky: 35,
  guarded: 60,
  safe: 85,
  institutional: 96,
};

const longHorizonScores: Record<LongHorizonRestorationViabilityLevel, number> = {
  unknown: 0,
  degrading: 15,
  fragile: 35,
  conditional: 60,
  durable: 85,
  institutional: 96,
};

const repeatedCycleScores: Record<RepeatedCycleSurvivabilityLevel, number> = {
  unknown: 0,
  weak: 15,
  partial: 40,
  conditional: 60,
  strong: 84,
  institutional: 96,
};

const riskScores: Record<RestorationSurvivabilityRiskLevel, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const explainabilityScores: Record<RestorationSurvivabilityExplainabilityLevel, number> = {
  opaque: 0,
  partial: 38,
  adequate: 65,
  strong: 84,
  institutional: 96,
};

const failClosedScores: Record<FailClosedSurvivabilityIntegrityLevel, number> = {
  absent: 0,
  inconsistent: 25,
  partial: 55,
  stable: 72,
  durable: 86,
  institutional: 96,
};

const compatibilityScores: Record<RestorationSurvivabilityCompatibilityLevel, number> = {
  unknown: 0,
  poor: 10,
  strained: 40,
  conditional: 60,
  compatible: 82,
  durable: 96,
};

const operationalSustainabilityScores: Record<OperationalSurvivabilitySustainabilityLevel, number> = {
  unknown: 0,
  unsustainable: 5,
  strained: 45,
  viable: 72,
  durable: 88,
  institutional: 96,
};

const warningOrder: CountyGovernanceEntropyDoctrineRestorationSurvivabilityWarningCode[] = [
  "S34_RESTORATION_SURVIVABILITY_UNVERIFIED",
  "S34_RESTORATION_SURVIVABILITY_BLOCKED",
  "S34_RESTORATION_SURVIVABILITY_UNSAFE",
  "S34_RESTORATION_SURVIVABILITY_CONTINUATION_REQUIRED",
  "S34_BOUNDED_SURVIVABILITY_REEVALUATION_REQUIRED",
  "S34_RESTORATION_SURVIVABILITY_ENTROPY_BURDEN",
  "S34_RESTORATION_SURVIVABILITY_EXPLAINABILITY_WEAK",
  "S34_FAIL_CLOSED_SURVIVABILITY_DEGRADATION",
  "S34_RECURSIVE_SURVIVABILITY_DEPENDENCY_CONFLICT",
  "S34_COLLAPSE_SENSITIVE_SURVIVABILITY_REJECTION",
  "S34_RESTORATION_CYCLE_FRAGILITY_ACCUMULATION",
  "S34_UNRESOLVED_SURVIVABILITY_DOCTRINE_CONFLICT",
  "S34_OPERATIONALLY_UNSUSTAINABLE_SURVIVABILITY",
  "S34_RESTORATION_SURVIVABILITY_EXHAUSTION",
  "S34_SURVIVABILITY_DEPENDENCY_CONCENTRATION",
  "S34_LONG_HORIZON_VIABILITY_WEAK",
  "S34_REPEATED_CYCLE_SURVIVABILITY_WEAK",
  "S34_RESTORATION_COMPATIBILITY_WEAK",
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

function hasAnyInput(input: CountyGovernanceEntropyDoctrineRestorationSurvivabilityInput): boolean {
  return Object.values(input).some((value) => value !== undefined && value !== null);
}

function isHighRisk(level: RestorationSurvivabilityRiskLevel | null | undefined): boolean {
  return level === "high" || level === "critical";
}

function isWeakFailClosed(level: FailClosedSurvivabilityIntegrityLevel | null | undefined): boolean {
  return level === "absent" || level === "inconsistent" || level === "partial";
}

function getReadinessClassification(params: {
  hasEvidence: boolean;
  blocked: boolean;
  survivabilityScore: number;
  sustainabilityScore: number;
  safetyScore: number;
}): RestorationSurvivabilityReadinessClassification {
  if (!params.hasEvidence) {
    return "readiness_unverified";
  }

  if (params.blocked) {
    return "blocked";
  }

  if (params.survivabilityScore >= 88 && params.sustainabilityScore >= 78 && params.safetyScore >= 85) {
    return "ready";
  }

  if (params.survivabilityScore >= 60 && params.sustainabilityScore >= 60 && params.safetyScore >= 60) {
    return "conditionally_ready";
  }

  return "not_ready";
}

function getSafetyClassification(params: {
  hasEvidence: boolean;
  unsafe: boolean;
  collapseSensitive: boolean;
  safetyScore: number;
}): RestorationSurvivabilitySafetyClassification {
  if (!params.hasEvidence) {
    return "safety_unverified";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive";
  }

  if (params.unsafe || params.safetyScore < 35) {
    return "unsafe";
  }

  if (params.safetyScore >= 85) {
    return "safe";
  }

  return "guarded";
}

function classifySurvivability(params: {
  hasEvidence: boolean;
  survivabilityScore: number;
  sustainabilityScore: number;
  safetyScore: number;
  longHorizonViabilityScore: number;
  repeatedCycleSurvivabilityScore: number;
  cycleFragilityScore: number;
  exhaustionPressureScore: number;
  dependencyConcentrationScore: number;
  explainabilityScore: number;
  failClosedIntegrityScore: number;
  continuationNeedScore: number;
  boundedReevaluationNeedScore: number;
  collapseExposureScore: number;
  restorationCompatibilityScore: number;
  operationalSustainabilityScore: number;
  blocked: boolean;
  unsafe: boolean;
  continuationRequired: boolean;
  boundedReevaluationRequired: boolean;
  collapseSensitive: boolean;
  failClosedDegradation: boolean;
  recursiveDependencyConflict: boolean;
  cycleFragilityAccumulation: boolean;
  unresolvedConflict: boolean;
  exhaustion: boolean;
  operationallyUnsustainable: boolean;
}): CountyGovernanceEntropyDoctrineRestorationSurvivabilityClassification {
  if (!params.hasEvidence) {
    return "restoration_survivability_unverified";
  }

  if (params.collapseSensitive) {
    return "collapse_sensitive_survivability_rejection";
  }

  if (params.unsafe) {
    return "restoration_survivability_unsafe";
  }

  if (params.blocked) {
    return "restoration_survivability_blocked";
  }

  if (params.operationallyUnsustainable) {
    return "operationally_unsustainable_survivability";
  }

  if (params.failClosedDegradation) {
    return "fail_closed_survivability_degradation";
  }

  if (params.recursiveDependencyConflict) {
    return "recursive_survivability_dependency_conflict";
  }

  if (params.unresolvedConflict) {
    return "unresolved_survivability_doctrine_conflict";
  }

  if (params.exhaustion) {
    return "restoration_survivability_exhaustion";
  }

  if (params.cycleFragilityAccumulation) {
    return "restoration_cycle_fragility_accumulation";
  }

  if (params.continuationRequired) {
    return "restoration_survivability_continuation_required";
  }

  if (params.boundedReevaluationRequired) {
    return "bounded_survivability_reevaluation_required";
  }

  if (params.explainabilityScore < 65) {
    return "restoration_survivability_explainability_weakness";
  }

  if (params.dependencyConcentrationScore >= 50 || params.cycleFragilityScore >= 50 || params.exhaustionPressureScore >= 50) {
    return "restoration_survivability_entropy_burden";
  }

  if (
    params.survivabilityScore >= 85 &&
    params.longHorizonViabilityScore >= 85 &&
    params.repeatedCycleSurvivabilityScore >= 84 &&
    params.sustainabilityScore >= 78 &&
    params.safetyScore >= 85 &&
    params.explainabilityScore >= 84 &&
    params.failClosedIntegrityScore >= 86 &&
    params.cycleFragilityScore <= 20 &&
    params.exhaustionPressureScore <= 20 &&
    params.dependencyConcentrationScore <= 20 &&
    params.collapseExposureScore <= 20 &&
    params.restorationCompatibilityScore >= 82 &&
    params.operationalSustainabilityScore >= 72
  ) {
    return "durable_restoration_survivability";
  }

  if (
    params.survivabilityScore >= 60 &&
    params.sustainabilityScore >= 60 &&
    params.safetyScore >= 60 &&
    params.longHorizonViabilityScore >= 60 &&
    params.repeatedCycleSurvivabilityScore >= 60 &&
    params.failClosedIntegrityScore >= 72
  ) {
    return "conditional_restoration_survivability";
  }

  return "fragile_restoration_survivability";
}

function buildWarnings(params: {
  hasEvidence: boolean;
  blocked: boolean;
  unsafe: boolean;
  continuationRequired: boolean;
  boundedReevaluationRequired: boolean;
  entropyBurden: boolean;
  explainabilityScore: number;
  failClosedDegradation: boolean;
  recursiveDependencyConflict: boolean;
  collapseSensitive: boolean;
  cycleFragilityAccumulation: boolean;
  unresolvedConflict: boolean;
  operationallyUnsustainable: boolean;
  exhaustion: boolean;
  dependencyConcentrationScore: number;
  longHorizonViabilityScore: number;
  repeatedCycleSurvivabilityScore: number;
  restorationCompatibilityScore: number;
}): CountyGovernanceEntropyDoctrineRestorationSurvivabilityWarningCode[] {
  const warnings = new Set<CountyGovernanceEntropyDoctrineRestorationSurvivabilityWarningCode>();

  if (!params.hasEvidence) {
    warnings.add("S34_RESTORATION_SURVIVABILITY_UNVERIFIED");
  }

  if (params.blocked) {
    warnings.add("S34_RESTORATION_SURVIVABILITY_BLOCKED");
  }

  if (params.unsafe) {
    warnings.add("S34_RESTORATION_SURVIVABILITY_UNSAFE");
  }

  if (params.continuationRequired) {
    warnings.add("S34_RESTORATION_SURVIVABILITY_CONTINUATION_REQUIRED");
  }

  if (params.boundedReevaluationRequired) {
    warnings.add("S34_BOUNDED_SURVIVABILITY_REEVALUATION_REQUIRED");
  }

  if (params.entropyBurden) {
    warnings.add("S34_RESTORATION_SURVIVABILITY_ENTROPY_BURDEN");
  }

  if (params.explainabilityScore < 65 && params.hasEvidence) {
    warnings.add("S34_RESTORATION_SURVIVABILITY_EXPLAINABILITY_WEAK");
  }

  if (params.failClosedDegradation) {
    warnings.add("S34_FAIL_CLOSED_SURVIVABILITY_DEGRADATION");
  }

  if (params.recursiveDependencyConflict) {
    warnings.add("S34_RECURSIVE_SURVIVABILITY_DEPENDENCY_CONFLICT");
  }

  if (params.collapseSensitive) {
    warnings.add("S34_COLLAPSE_SENSITIVE_SURVIVABILITY_REJECTION");
  }

  if (params.cycleFragilityAccumulation) {
    warnings.add("S34_RESTORATION_CYCLE_FRAGILITY_ACCUMULATION");
  }

  if (params.unresolvedConflict) {
    warnings.add("S34_UNRESOLVED_SURVIVABILITY_DOCTRINE_CONFLICT");
  }

  if (params.operationallyUnsustainable) {
    warnings.add("S34_OPERATIONALLY_UNSUSTAINABLE_SURVIVABILITY");
  }

  if (params.exhaustion) {
    warnings.add("S34_RESTORATION_SURVIVABILITY_EXHAUSTION");
  }

  if (params.dependencyConcentrationScore >= 50) {
    warnings.add("S34_SURVIVABILITY_DEPENDENCY_CONCENTRATION");
  }

  if (params.longHorizonViabilityScore < 60 && params.hasEvidence) {
    warnings.add("S34_LONG_HORIZON_VIABILITY_WEAK");
  }

  if (params.repeatedCycleSurvivabilityScore < 60 && params.hasEvidence) {
    warnings.add("S34_REPEATED_CYCLE_SURVIVABILITY_WEAK");
  }

  if (params.restorationCompatibilityScore < 60 && params.hasEvidence) {
    warnings.add("S34_RESTORATION_COMPATIBILITY_WEAK");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function buildExplainability(params: {
  hasEvidence: boolean;
  classification: CountyGovernanceEntropyDoctrineRestorationSurvivabilityClassification;
  warningCodes: CountyGovernanceEntropyDoctrineRestorationSurvivabilityWarningCode[];
  survivabilityScore: number;
  sustainabilityScore: number;
  safetyScore: number;
  longHorizonViabilityScore: number;
  repeatedCycleSurvivabilityScore: number;
  cycleFragilityScore: number;
  exhaustionPressureScore: number;
  dependencyConcentrationScore: number;
  failClosedIntegrityScore: number;
  boundedReevaluationNeedScore: number;
  continuationNeedScore: number;
  reevaluationEvidenceCount: number;
}): RestorationSurvivabilityExplainability {
  return {
    summary: params.hasEvidence
      ? `S34 classified restoration survivability as ${params.classification}.`
      : "S34 classified restoration survivability as unverified because no caller-supplied evidence was provided.",
    survivabilityDrivers: [`restoration survivability score: ${params.survivabilityScore}`],
    sustainabilityDrivers: [`survivability sustainability score: ${params.sustainabilityScore}`],
    safetyDrivers: [`survivability safety score: ${params.safetyScore}`],
    longHorizonDrivers: [`long-horizon restoration viability score: ${params.longHorizonViabilityScore}`],
    repeatedCycleDrivers: [`repeated-cycle survivability score: ${params.repeatedCycleSurvivabilityScore}`],
    fragilityDrivers: [`cycle fragility accumulation score: ${params.cycleFragilityScore}`],
    exhaustionDrivers: [`restoration exhaustion pressure score: ${params.exhaustionPressureScore}`],
    dependencyDrivers: [`survivability dependency concentration score: ${params.dependencyConcentrationScore}`],
    reevaluationDrivers: [
      `bounded survivability reevaluation need score: ${params.boundedReevaluationNeedScore}`,
      `reevaluation evidence count: ${params.reevaluationEvidenceCount}`,
    ],
    conflictDrivers: [`survivability continuation need score: ${params.continuationNeedScore}`],
    failClosedDrivers: [`fail-closed survivability integrity score: ${params.failClosedIntegrityScore}`],
    warningDerivation: params.warningCodes.map((warning) => `${warning} derived from deterministic S34 thresholds.`),
    deterministicRulesApplied: [
      "Pure caller-input-only restoration survivability modeling.",
      "Fixed ordinal maps and bounded 0-100 scores.",
      "Stable warning-code ordering.",
      "Explicit restoration survivability precedence ordering.",
      "No runtime, provider, database, network, clock, filesystem, or environment dependency.",
    ],
  };
}

export function evaluateCountyGovernanceEntropyDoctrineRestorationSurvivability(
  input: CountyGovernanceEntropyDoctrineRestorationSurvivabilityInput = {},
): CountyGovernanceEntropyDoctrineRestorationSurvivabilityResult {
  const hasEvidence = hasAnyInput(input);

  const restorationCycleCount = clampCount(input.restorationCycleCount);
  const repeatedDisruptionCount = clampCount(input.repeatedDisruptionCount);
  const fragilityAccumulationEventCount = clampCount(input.fragilityAccumulationEventCount);
  const exhaustionEventCount = clampCount(input.exhaustionEventCount);
  const unresolvedDoctrineConflictCount = clampCount(input.unresolvedDoctrineConflictCount);
  const reevaluationEvidenceCount = clampCount(input.reevaluationEvidenceCount);
  const failClosedDegradationCount = clampCount(input.failClosedDegradationCount);
  const explainabilityWeaknessCount = clampCount(input.explainabilityWeaknessCount);
  const recursiveDependencyEventCount = clampCount(input.recursiveDependencyEventCount);
  const dependencyConcentrationEventCount = clampCount(input.dependencyConcentrationEventCount);

  const survivabilityScore = survivabilityScores[input.restorationSurvivabilityLevel ?? "unknown"];
  const sustainabilityScore = sustainabilityScores[input.survivabilitySustainabilityLevel ?? "unknown"];
  const safetyScore = safetyScores[input.survivabilitySafetyLevel ?? "unknown"];
  const longHorizonViabilityScore = longHorizonScores[input.longHorizonViabilityLevel ?? "unknown"];
  const repeatedCycleSurvivabilityScore = Math.max(
    repeatedCycleScores[input.repeatedCycleSurvivabilityLevel ?? "unknown"],
    restorationCycleCount > 0 ? 40 : 0,
  );
  const cycleFragilityScore = Math.max(
    riskScores[input.cycleFragilityAccumulationLevel ?? "none"],
    fragilityAccumulationEventCount > 0 || repeatedDisruptionCount >= 3 ? 50 : 0,
  );
  const exhaustionPressureScore = Math.max(
    riskScores[input.restorationExhaustionPressureLevel ?? "none"],
    exhaustionEventCount > 0 ? 50 : 0,
  );
  const dependencyConcentrationScore = Math.max(
    riskScores[input.survivabilityDependencyConcentrationLevel ?? "none"],
    dependencyConcentrationEventCount > 0 ? 50 : 0,
  );
  const explainabilityScore = Math.max(
    explainabilityScores[input.survivabilityExplainabilityLevel ?? "opaque"],
    explainabilityWeaknessCount > 0 ? 38 : 0,
  );
  const failClosedIntegrityScore = failClosedScores[input.failClosedSurvivabilityIntegrityLevel ?? "absent"];
  const continuationNeedScore = riskScores[input.survivabilityContinuationNeedLevel ?? "none"];
  const boundedReevaluationNeedScore = Math.max(
    riskScores[input.boundedSurvivabilityReevaluationNeedLevel ?? "none"],
    reevaluationEvidenceCount < 1 && hasEvidence ? 50 : 0,
  );
  const recursiveDependencyScore = riskScores[input.recursiveSurvivabilityDependencyLevel ?? "none"];
  const collapseExposureScore = riskScores[input.collapseExposureLevel ?? "none"];
  const oversightCompatibilityScore = compatibilityScores[input.oversightCompatibilityLevel ?? "unknown"];
  const stewardshipCompatibilityScore = compatibilityScores[input.stewardshipCompatibilityLevel ?? "unknown"];
  const memoryCompatibilityScore = compatibilityScores[input.memoryCompatibilityLevel ?? "unknown"];
  const successionCompatibilityScore = compatibilityScores[input.successionCompatibilityLevel ?? "unknown"];
  const restorationCompatibilityScore = compatibilityScores[input.restorationCompatibilityLevel ?? "unknown"];
  const operationalSustainabilityScore =
    operationalSustainabilityScores[input.operationalSurvivabilitySustainabilityLevel ?? "unknown"];

  const failClosedSurvivabilityDegradation =
    isWeakFailClosed(input.failClosedSurvivabilityIntegrityLevel) || failClosedDegradationCount > 0;
  const recursiveSurvivabilityDependencyConflict =
    isHighRisk(input.recursiveSurvivabilityDependencyLevel) ||
    recursiveDependencyEventCount > 0 ||
    recursiveDependencyScore >= 78;
  const restorationCycleFragilityAccumulation = cycleFragilityScore >= 78 || repeatedDisruptionCount >= 3;
  const restorationSurvivabilityExhaustion = exhaustionPressureScore >= 78 || exhaustionEventCount > 0;
  const unresolvedSurvivabilityDoctrineConflict =
    unresolvedDoctrineConflictCount > 0 ||
    oversightCompatibilityScore <= 10 ||
    stewardshipCompatibilityScore <= 10 ||
    memoryCompatibilityScore <= 10 ||
    successionCompatibilityScore <= 10 ||
    restorationCompatibilityScore <= 10;
  const operationallyUnsustainableSurvivability =
    input.operationalSurvivabilitySustainabilityLevel === "unsustainable" || operationalSustainabilityScore <= 5;
  const collapseSensitiveSurvivabilityRejection =
    isHighRisk(input.collapseExposureLevel) ||
    (collapseExposureScore >= 50 &&
      (cycleFragilityScore >= 78 ||
        exhaustionPressureScore >= 78 ||
        recursiveSurvivabilityDependencyConflict ||
        failClosedSurvivabilityDegradation ||
        unresolvedSurvivabilityDoctrineConflict ||
        longHorizonViabilityScore < 60));
  const restorationSurvivabilityUnsafe =
    input.survivabilitySafetyLevel === "unsafe" ||
    safetyScore <= 5 ||
    collapseExposureScore >= 100 ||
    (collapseExposureScore >= 78 && (cycleFragilityScore >= 78 || exhaustionPressureScore >= 78));
  const restorationSurvivabilityBlocked =
    failClosedSurvivabilityDegradation ||
    recursiveSurvivabilityDependencyConflict ||
    operationallyUnsustainableSurvivability ||
    unresolvedSurvivabilityDoctrineConflict ||
    restorationCompatibilityScore <= 10;
  const boundedSurvivabilityReevaluationRequired =
    !restorationSurvivabilityBlocked &&
    !restorationSurvivabilityUnsafe &&
    !collapseSensitiveSurvivabilityRejection &&
    (boundedReevaluationNeedScore >= 50 ||
      repeatedCycleSurvivabilityScore < 84 ||
      cycleFragilityScore >= 50 ||
      exhaustionPressureScore >= 50 ||
      longHorizonViabilityScore < 85 ||
      oversightCompatibilityScore < 96 ||
      stewardshipCompatibilityScore < 96 ||
      memoryCompatibilityScore < 96 ||
      successionCompatibilityScore < 96 ||
      restorationCompatibilityScore < 96);
  const survivabilityContinuationRequired =
    !restorationSurvivabilityBlocked &&
    !restorationSurvivabilityUnsafe &&
    !collapseSensitiveSurvivabilityRejection &&
    (continuationNeedScore >= 50 ||
      survivabilityScore < 74 ||
      sustainabilityScore < 60 ||
      restorationCycleFragilityAccumulation ||
      restorationSurvivabilityExhaustion);
  const entropyBurden =
    dependencyConcentrationScore >= 50 ||
    cycleFragilityScore >= 50 ||
    exhaustionPressureScore >= 50 ||
    repeatedDisruptionCount >= 3;

  const warningCodes = buildWarnings({
    hasEvidence,
    blocked: restorationSurvivabilityBlocked,
    unsafe: restorationSurvivabilityUnsafe,
    continuationRequired: survivabilityContinuationRequired,
    boundedReevaluationRequired: boundedSurvivabilityReevaluationRequired,
    entropyBurden,
    explainabilityScore,
    failClosedDegradation: failClosedSurvivabilityDegradation,
    recursiveDependencyConflict: recursiveSurvivabilityDependencyConflict,
    collapseSensitive: collapseSensitiveSurvivabilityRejection,
    cycleFragilityAccumulation: restorationCycleFragilityAccumulation,
    unresolvedConflict: unresolvedSurvivabilityDoctrineConflict,
    operationallyUnsustainable: operationallyUnsustainableSurvivability,
    exhaustion: restorationSurvivabilityExhaustion,
    dependencyConcentrationScore,
    longHorizonViabilityScore,
    repeatedCycleSurvivabilityScore,
    restorationCompatibilityScore,
  });

  const restorationSurvivabilityClassification = classifySurvivability({
    hasEvidence,
    survivabilityScore,
    sustainabilityScore,
    safetyScore,
    longHorizonViabilityScore,
    repeatedCycleSurvivabilityScore,
    cycleFragilityScore,
    exhaustionPressureScore,
    dependencyConcentrationScore,
    explainabilityScore,
    failClosedIntegrityScore,
    continuationNeedScore,
    boundedReevaluationNeedScore,
    collapseExposureScore,
    restorationCompatibilityScore,
    operationalSustainabilityScore,
    blocked: restorationSurvivabilityBlocked,
    unsafe: restorationSurvivabilityUnsafe,
    continuationRequired: survivabilityContinuationRequired,
    boundedReevaluationRequired: boundedSurvivabilityReevaluationRequired,
    collapseSensitive: collapseSensitiveSurvivabilityRejection,
    failClosedDegradation: failClosedSurvivabilityDegradation,
    recursiveDependencyConflict: recursiveSurvivabilityDependencyConflict,
    cycleFragilityAccumulation: restorationCycleFragilityAccumulation,
    unresolvedConflict: unresolvedSurvivabilityDoctrineConflict,
    exhaustion: restorationSurvivabilityExhaustion,
    operationallyUnsustainable: operationallyUnsustainableSurvivability,
  });

  return {
    restorationSurvivabilityClassification,
    survivabilityReadinessClassification: getReadinessClassification({
      hasEvidence,
      blocked: restorationSurvivabilityBlocked,
      survivabilityScore,
      sustainabilityScore,
      safetyScore,
    }),
    survivabilitySafetyClassification: getSafetyClassification({
      hasEvidence,
      unsafe: restorationSurvivabilityUnsafe,
      collapseSensitive: collapseSensitiveSurvivabilityRejection,
      safetyScore,
    }),
    survivabilityScore: clampScore(survivabilityScore),
    sustainabilityScore: clampScore(sustainabilityScore),
    safetyScore: clampScore(safetyScore),
    longHorizonViabilityScore: clampScore(longHorizonViabilityScore),
    repeatedCycleSurvivabilityScore: clampScore(repeatedCycleSurvivabilityScore),
    cycleFragilityScore: clampScore(cycleFragilityScore),
    exhaustionPressureScore: clampScore(exhaustionPressureScore),
    dependencyConcentrationScore: clampScore(dependencyConcentrationScore),
    explainabilityScore: clampScore(explainabilityScore),
    failClosedIntegrityScore: clampScore(failClosedIntegrityScore),
    continuationNeedScore: clampScore(continuationNeedScore),
    boundedReevaluationNeedScore: clampScore(boundedReevaluationNeedScore),
    collapseExposureScore: clampScore(collapseExposureScore),
    operationalSustainabilityScore: clampScore(operationalSustainabilityScore),
    restorationSurvivabilityBlocked,
    restorationSurvivabilityUnsafe,
    survivabilityContinuationRequired,
    boundedSurvivabilityReevaluationRequired,
    collapseSensitiveSurvivabilityRejection,
    failClosedSurvivabilityDegradation,
    recursiveSurvivabilityDependencyConflict,
    restorationCycleFragilityAccumulation,
    unresolvedSurvivabilityDoctrineConflict,
    restorationSurvivabilityExhaustion,
    operationallyUnsustainableSurvivability,
    warningCodes,
    explainability: buildExplainability({
      hasEvidence,
      classification: restorationSurvivabilityClassification,
      warningCodes,
      survivabilityScore,
      sustainabilityScore,
      safetyScore,
      longHorizonViabilityScore,
      repeatedCycleSurvivabilityScore,
      cycleFragilityScore,
      exhaustionPressureScore,
      dependencyConcentrationScore,
      failClosedIntegrityScore,
      boundedReevaluationNeedScore,
      continuationNeedScore,
      reevaluationEvidenceCount,
    }),
    ingestionBlocked: true,
    automationBlocked: true,
    executionBlocked: true,
    planningOnly: true,
    failClosed: true,
  };
}
