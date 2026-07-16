export type StewardshipContinuityLevel =
  | "unknown"
  | "broken"
  | "fragile"
  | "conditional"
  | "stable"
  | "durable"
  | "institutional";

export type StewardshipSustainabilityLevel =
  | "unknown"
  | "unsustainable"
  | "strained"
  | "conditional"
  | "sustainable"
  | "durable"
  | "institutional";

export type StewardshipSafetyLevel =
  | "unknown"
  | "unsafe"
  | "risky"
  | "guarded"
  | "safe"
  | "institutional";

export type StewardshipDurabilityLevel =
  | "unknown"
  | "fragile"
  | "temporary"
  | "stable"
  | "durable"
  | "institutional";

export type StewardshipRiskLevel = "none" | "low" | "moderate" | "high" | "critical";

export type TransferabilityLevel =
  | "unknown"
  | "weak"
  | "partial"
  | "conditional"
  | "strong"
  | "institutional";

export type StewardshipExplainabilityLevel =
  | "opaque"
  | "partial"
  | "adequate"
  | "strong"
  | "institutional";

export type FailClosedStewardshipIntegrityLevel =
  | "absent"
  | "inconsistent"
  | "partial"
  | "stable"
  | "durable"
  | "institutional";

export type DoctrineCompatibilityLevel =
  | "unknown"
  | "poor"
  | "strained"
  | "conditional"
  | "compatible"
  | "durable";

export type OperationalStewardshipSustainabilityLevel =
  | "unknown"
  | "unsustainable"
  | "strained"
  | "viable"
  | "durable"
  | "institutional";

export type CountyGovernanceEntropyDoctrineStewardshipContinuityClassification =
  | "durable_stewardship_continuity"
  | "conditional_stewardship_continuity"
  | "superficial_stewardship_continuity"
  | "stewardship_unsustainable"
  | "stewardship_blocked"
  | "stewardship_unsafe"
  | "stewardship_continuation_required"
  | "stewardship_entropy_burden"
  | "stewardship_explainability_weakness"
  | "fail_closed_stewardship_degradation"
  | "recursive_stewardship_dependency_conflict"
  | "collapse_sensitive_stewardship_rejection"
  | "bounded_stewardship_reevaluation_required"
  | "stewardship_survivability_weakness"
  | "unresolved_stewardship_doctrine_conflict"
  | "operationally_unsustainable_stewardship"
  | "stewardship_continuity_unverified";

export type CountyGovernanceEntropyDoctrineStewardshipReadinessClassification =
  | "ready"
  | "conditionally_ready"
  | "not_ready"
  | "blocked"
  | "readiness_unverified";

export type CountyGovernanceEntropyDoctrineStewardshipSafetyClassification =
  | "safe"
  | "guarded"
  | "unsafe"
  | "collapse_sensitive"
  | "safety_unverified";

export type CountyGovernanceEntropyDoctrineStewardshipContinuityWarningCode =
  | "S30_STEWARDSHIP_CONTINUITY_UNVERIFIED"
  | "S30_STEWARDSHIP_BLOCKED"
  | "S30_STEWARDSHIP_UNSAFE"
  | "S30_SUPERFICIAL_STEWARDSHIP_CONTINUITY"
  | "S30_STEWARDSHIP_CONTINUATION_REQUIRED"
  | "S30_BOUNDED_STEWARDSHIP_REEVALUATION_REQUIRED"
  | "S30_STEWARDSHIP_ENTROPY_BURDEN"
  | "S30_STEWARDSHIP_EXPLAINABILITY_WEAK"
  | "S30_FAIL_CLOSED_STEWARDSHIP_DEGRADATION"
  | "S30_RECURSIVE_STEWARDSHIP_DEPENDENCY_CONFLICT"
  | "S30_COLLAPSE_SENSITIVE_STEWARDSHIP_REJECTION"
  | "S30_STEWARDSHIP_SURVIVABILITY_WEAKNESS"
  | "S30_UNRESOLVED_STEWARDSHIP_DOCTRINE_CONFLICT"
  | "S30_OPERATIONALLY_UNSUSTAINABLE_STEWARDSHIP"
  | "S30_STEWARDSHIP_DEPENDENCY_CONCENTRATION"
  | "S30_STEWARDSHIP_TRANSFERABILITY_WEAK"
  | "S30_OVERSIGHT_COMPATIBILITY_WEAK";

export interface CountyGovernanceEntropyDoctrineStewardshipContinuityInput {
  stewardshipContinuityLevel?: StewardshipContinuityLevel | null;
  stewardshipSustainabilityLevel?: StewardshipSustainabilityLevel | null;
  stewardshipSafetyLevel?: StewardshipSafetyLevel | null;
  stewardshipDurabilityLevel?: StewardshipDurabilityLevel | null;
  stewardshipBurdenLevel?: StewardshipRiskLevel | null;
  dependencyConcentrationLevel?: StewardshipRiskLevel | null;
  transferabilityLevel?: TransferabilityLevel | null;
  stewardshipExplainabilityLevel?: StewardshipExplainabilityLevel | null;
  failClosedStewardshipIntegrityLevel?: FailClosedStewardshipIntegrityLevel | null;
  stewardshipContinuationNeedLevel?: StewardshipRiskLevel | null;
  boundedStewardshipReevaluationNeedLevel?: StewardshipRiskLevel | null;
  recursiveStewardshipDependencyLevel?: StewardshipRiskLevel | null;
  collapseExposureLevel?: StewardshipRiskLevel | null;
  oversightCompatibilityLevel?: DoctrineCompatibilityLevel | null;
  maintenanceCompatibilityLevel?: DoctrineCompatibilityLevel | null;
  finalityCompatibilityLevel?: DoctrineCompatibilityLevel | null;
  survivabilityCompatibilityLevel?: DoctrineCompatibilityLevel | null;
  operationalStewardshipSustainabilityLevel?: OperationalStewardshipSustainabilityLevel | null;
  stewardshipCycleCount?: number | null;
  transferEventCount?: number | null;
  unresolvedDoctrineConflictCount?: number | null;
  reevaluationEvidenceCount?: number | null;
  failClosedDegradationCount?: number | null;
  explainabilityWeaknessCount?: number | null;
  recursiveDependencyEventCount?: number | null;
  dependencyConcentrationEventCount?: number | null;
}

export interface CountyGovernanceEntropyDoctrineStewardshipContinuityExplainability {
  summary: string;
  continuityDrivers: string[];
  sustainabilityDrivers: string[];
  safetyDrivers: string[];
  durabilityDrivers: string[];
  dependencyDrivers: string[];
  transferabilityDrivers: string[];
  reevaluationDrivers: string[];
  conflictDrivers: string[];
  failClosedDrivers: string[];
  warningDerivation: string[];
  deterministicRulesApplied: string[];
}

export interface CountyGovernanceEntropyDoctrineStewardshipContinuityResult {
  stewardshipContinuityClassification: CountyGovernanceEntropyDoctrineStewardshipContinuityClassification;
  stewardshipReadinessClassification: CountyGovernanceEntropyDoctrineStewardshipReadinessClassification;
  stewardshipSafetyClassification: CountyGovernanceEntropyDoctrineStewardshipSafetyClassification;
  continuityScore: number;
  sustainabilityScore: number;
  safetyScore: number;
  durabilityScore: number;
  burdenScore: number;
  dependencyConcentrationScore: number;
  transferabilityScore: number;
  explainabilityScore: number;
  failClosedIntegrityScore: number;
  continuationNeedScore: number;
  boundedReevaluationNeedScore: number;
  collapseExposureScore: number;
  operationalSustainabilityScore: number;
  stewardshipBlocked: boolean;
  stewardshipUnsafe: boolean;
  stewardshipContinuationRequired: boolean;
  boundedStewardshipReevaluationRequired: boolean;
  collapseSensitiveStewardshipRejection: boolean;
  failClosedStewardshipDegradation: boolean;
  superficialStewardshipContinuity: boolean;
  recursiveStewardshipDependencyConflict: boolean;
  stewardshipSurvivabilityWeakness: boolean;
  unresolvedStewardshipDoctrineConflict: boolean;
  operationallyUnsustainableStewardship: boolean;
  warningCodes: CountyGovernanceEntropyDoctrineStewardshipContinuityWarningCode[];
  explainability: CountyGovernanceEntropyDoctrineStewardshipContinuityExplainability;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const continuityScores: Record<StewardshipContinuityLevel, number> = {
  unknown: 0,
  broken: 5,
  fragile: 25,
  conditional: 60,
  stable: 72,
  durable: 88,
  institutional: 96,
};

const sustainabilityScores: Record<StewardshipSustainabilityLevel, number> = {
  unknown: 0,
  unsustainable: 5,
  strained: 35,
  conditional: 60,
  sustainable: 78,
  durable: 88,
  institutional: 96,
};

const safetyScores: Record<StewardshipSafetyLevel, number> = {
  unknown: 0,
  unsafe: 5,
  risky: 35,
  guarded: 60,
  safe: 85,
  institutional: 96,
};

const durabilityScores: Record<StewardshipDurabilityLevel, number> = {
  unknown: 0,
  fragile: 15,
  temporary: 35,
  stable: 65,
  durable: 85,
  institutional: 96,
};

const riskScores: Record<StewardshipRiskLevel, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const transferabilityScores: Record<TransferabilityLevel, number> = {
  unknown: 0,
  weak: 15,
  partial: 40,
  conditional: 60,
  strong: 84,
  institutional: 96,
};

const explainabilityScores: Record<StewardshipExplainabilityLevel, number> = {
  opaque: 0,
  partial: 38,
  adequate: 65,
  strong: 84,
  institutional: 96,
};

const failClosedScores: Record<FailClosedStewardshipIntegrityLevel, number> = {
  absent: 0,
  inconsistent: 25,
  partial: 55,
  stable: 72,
  durable: 86,
  institutional: 96,
};

const compatibilityScores: Record<DoctrineCompatibilityLevel, number> = {
  unknown: 0,
  poor: 10,
  strained: 40,
  conditional: 60,
  compatible: 82,
  durable: 96,
};

const operationalSustainabilityScores: Record<OperationalStewardshipSustainabilityLevel, number> = {
  unknown: 0,
  unsustainable: 5,
  strained: 45,
  viable: 72,
  durable: 88,
  institutional: 96,
};

const warningOrder: CountyGovernanceEntropyDoctrineStewardshipContinuityWarningCode[] = [
  "S30_STEWARDSHIP_CONTINUITY_UNVERIFIED",
  "S30_STEWARDSHIP_BLOCKED",
  "S30_STEWARDSHIP_UNSAFE",
  "S30_SUPERFICIAL_STEWARDSHIP_CONTINUITY",
  "S30_STEWARDSHIP_CONTINUATION_REQUIRED",
  "S30_BOUNDED_STEWARDSHIP_REEVALUATION_REQUIRED",
  "S30_STEWARDSHIP_ENTROPY_BURDEN",
  "S30_STEWARDSHIP_EXPLAINABILITY_WEAK",
  "S30_FAIL_CLOSED_STEWARDSHIP_DEGRADATION",
  "S30_RECURSIVE_STEWARDSHIP_DEPENDENCY_CONFLICT",
  "S30_COLLAPSE_SENSITIVE_STEWARDSHIP_REJECTION",
  "S30_STEWARDSHIP_SURVIVABILITY_WEAKNESS",
  "S30_UNRESOLVED_STEWARDSHIP_DOCTRINE_CONFLICT",
  "S30_OPERATIONALLY_UNSUSTAINABLE_STEWARDSHIP",
  "S30_STEWARDSHIP_DEPENDENCY_CONCENTRATION",
  "S30_STEWARDSHIP_TRANSFERABILITY_WEAK",
  "S30_OVERSIGHT_COMPATIBILITY_WEAK",
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

function hasAnyInput(input: CountyGovernanceEntropyDoctrineStewardshipContinuityInput): boolean {
  return Object.values(input).some((value) => value !== undefined && value !== null);
}

function isHighRisk(level: StewardshipRiskLevel | null | undefined): boolean {
  return level === "high" || level === "critical";
}

function isWeakFailClosed(level: FailClosedStewardshipIntegrityLevel | null | undefined): boolean {
  return level === "absent" || level === "inconsistent" || level === "partial";
}

function isPoorCompatibility(level: DoctrineCompatibilityLevel | null | undefined): boolean {
  return level === "poor" || level === "unknown";
}

function getReadinessClassification(params: {
  hasEvidence: boolean;
  stewardshipBlocked: boolean;
  continuityScore: number;
  sustainabilityScore: number;
  safetyScore: number;
}): CountyGovernanceEntropyDoctrineStewardshipReadinessClassification {
  if (!params.hasEvidence) {
    return "readiness_unverified";
  }

  if (params.stewardshipBlocked) {
    return "blocked";
  }

  if (params.continuityScore >= 88 && params.sustainabilityScore >= 78 && params.safetyScore >= 85) {
    return "ready";
  }

  if (params.continuityScore >= 60 && params.sustainabilityScore >= 60 && params.safetyScore >= 60) {
    return "conditionally_ready";
  }

  return "not_ready";
}

function getSafetyClassification(params: {
  hasEvidence: boolean;
  stewardshipUnsafe: boolean;
  collapseSensitiveStewardshipRejection: boolean;
  safetyScore: number;
}): CountyGovernanceEntropyDoctrineStewardshipSafetyClassification {
  if (!params.hasEvidence) {
    return "safety_unverified";
  }

  if (params.collapseSensitiveStewardshipRejection) {
    return "collapse_sensitive";
  }

  if (params.stewardshipUnsafe || params.safetyScore < 35) {
    return "unsafe";
  }

  if (params.safetyScore >= 85) {
    return "safe";
  }

  return "guarded";
}

function classifyStewardship(params: {
  hasEvidence: boolean;
  continuityScore: number;
  sustainabilityScore: number;
  safetyScore: number;
  durabilityScore: number;
  burdenScore: number;
  dependencyConcentrationScore: number;
  transferabilityScore: number;
  explainabilityScore: number;
  failClosedIntegrityScore: number;
  continuationNeedScore: number;
  boundedReevaluationNeedScore: number;
  collapseExposureScore: number;
  operationalSustainabilityScore: number;
  stewardshipBlocked: boolean;
  stewardshipUnsafe: boolean;
  stewardshipContinuationRequired: boolean;
  boundedStewardshipReevaluationRequired: boolean;
  collapseSensitiveStewardshipRejection: boolean;
  failClosedStewardshipDegradation: boolean;
  superficialStewardshipContinuity: boolean;
  recursiveStewardshipDependencyConflict: boolean;
  stewardshipSurvivabilityWeakness: boolean;
  unresolvedStewardshipDoctrineConflict: boolean;
  operationallyUnsustainableStewardship: boolean;
}): CountyGovernanceEntropyDoctrineStewardshipContinuityClassification {
  if (!params.hasEvidence) {
    return "stewardship_continuity_unverified";
  }

  if (params.collapseSensitiveStewardshipRejection) {
    return "collapse_sensitive_stewardship_rejection";
  }

  if (params.stewardshipUnsafe) {
    return "stewardship_unsafe";
  }

  if (params.stewardshipBlocked) {
    return "stewardship_blocked";
  }

  if (params.operationallyUnsustainableStewardship) {
    return "operationally_unsustainable_stewardship";
  }

  if (params.failClosedStewardshipDegradation) {
    return "fail_closed_stewardship_degradation";
  }

  if (params.recursiveStewardshipDependencyConflict) {
    return "recursive_stewardship_dependency_conflict";
  }

  if (params.unresolvedStewardshipDoctrineConflict) {
    return "unresolved_stewardship_doctrine_conflict";
  }

  if (params.stewardshipSurvivabilityWeakness) {
    return "stewardship_survivability_weakness";
  }

  if (params.stewardshipContinuationRequired) {
    return "stewardship_continuation_required";
  }

  if (params.boundedStewardshipReevaluationRequired) {
    return "bounded_stewardship_reevaluation_required";
  }

  if (params.explainabilityScore < 65) {
    return "stewardship_explainability_weakness";
  }

  if (params.burdenScore >= 50 || params.dependencyConcentrationScore >= 50) {
    return "stewardship_entropy_burden";
  }

  if (params.superficialStewardshipContinuity) {
    return "superficial_stewardship_continuity";
  }

  if (
    params.continuityScore >= 88 &&
    params.sustainabilityScore >= 78 &&
    params.safetyScore >= 85 &&
    params.durabilityScore >= 85 &&
    params.transferabilityScore >= 84 &&
    params.explainabilityScore >= 84 &&
    params.failClosedIntegrityScore >= 86 &&
    params.burdenScore <= 20 &&
    params.dependencyConcentrationScore <= 20 &&
    params.continuationNeedScore <= 20 &&
    params.boundedReevaluationNeedScore <= 20 &&
    params.collapseExposureScore <= 20 &&
    params.operationalSustainabilityScore >= 72
  ) {
    return "durable_stewardship_continuity";
  }

  if (
    params.continuityScore >= 60 &&
    params.sustainabilityScore >= 60 &&
    params.safetyScore >= 60 &&
    params.durabilityScore >= 60 &&
    params.failClosedIntegrityScore >= 72
  ) {
    return "conditional_stewardship_continuity";
  }

  return "stewardship_unsustainable";
}

function buildWarnings(params: {
  hasEvidence: boolean;
  stewardshipBlocked: boolean;
  stewardshipUnsafe: boolean;
  stewardshipContinuationRequired: boolean;
  boundedStewardshipReevaluationRequired: boolean;
  collapseSensitiveStewardshipRejection: boolean;
  failClosedStewardshipDegradation: boolean;
  superficialStewardshipContinuity: boolean;
  recursiveStewardshipDependencyConflict: boolean;
  stewardshipSurvivabilityWeakness: boolean;
  unresolvedStewardshipDoctrineConflict: boolean;
  operationallyUnsustainableStewardship: boolean;
  burdenScore: number;
  dependencyConcentrationScore: number;
  transferabilityScore: number;
  explainabilityScore: number;
  oversightCompatibilityScore: number;
}): CountyGovernanceEntropyDoctrineStewardshipContinuityWarningCode[] {
  const warnings = new Set<CountyGovernanceEntropyDoctrineStewardshipContinuityWarningCode>();

  if (!params.hasEvidence) {
    warnings.add("S30_STEWARDSHIP_CONTINUITY_UNVERIFIED");
  }

  if (params.stewardshipBlocked) {
    warnings.add("S30_STEWARDSHIP_BLOCKED");
  }

  if (params.stewardshipUnsafe) {
    warnings.add("S30_STEWARDSHIP_UNSAFE");
  }

  if (params.superficialStewardshipContinuity) {
    warnings.add("S30_SUPERFICIAL_STEWARDSHIP_CONTINUITY");
  }

  if (params.stewardshipContinuationRequired) {
    warnings.add("S30_STEWARDSHIP_CONTINUATION_REQUIRED");
  }

  if (params.boundedStewardshipReevaluationRequired) {
    warnings.add("S30_BOUNDED_STEWARDSHIP_REEVALUATION_REQUIRED");
  }

  if (params.burdenScore >= 50) {
    warnings.add("S30_STEWARDSHIP_ENTROPY_BURDEN");
  }

  if (params.explainabilityScore < 65 && params.hasEvidence) {
    warnings.add("S30_STEWARDSHIP_EXPLAINABILITY_WEAK");
  }

  if (params.failClosedStewardshipDegradation) {
    warnings.add("S30_FAIL_CLOSED_STEWARDSHIP_DEGRADATION");
  }

  if (params.recursiveStewardshipDependencyConflict) {
    warnings.add("S30_RECURSIVE_STEWARDSHIP_DEPENDENCY_CONFLICT");
  }

  if (params.collapseSensitiveStewardshipRejection) {
    warnings.add("S30_COLLAPSE_SENSITIVE_STEWARDSHIP_REJECTION");
  }

  if (params.stewardshipSurvivabilityWeakness) {
    warnings.add("S30_STEWARDSHIP_SURVIVABILITY_WEAKNESS");
  }

  if (params.unresolvedStewardshipDoctrineConflict) {
    warnings.add("S30_UNRESOLVED_STEWARDSHIP_DOCTRINE_CONFLICT");
  }

  if (params.operationallyUnsustainableStewardship) {
    warnings.add("S30_OPERATIONALLY_UNSUSTAINABLE_STEWARDSHIP");
  }

  if (params.dependencyConcentrationScore >= 50) {
    warnings.add("S30_STEWARDSHIP_DEPENDENCY_CONCENTRATION");
  }

  if (params.transferabilityScore < 65 && params.hasEvidence) {
    warnings.add("S30_STEWARDSHIP_TRANSFERABILITY_WEAK");
  }

  if (params.oversightCompatibilityScore < 60 && params.hasEvidence) {
    warnings.add("S30_OVERSIGHT_COMPATIBILITY_WEAK");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function buildExplainability(params: {
  hasEvidence: boolean;
  classification: CountyGovernanceEntropyDoctrineStewardshipContinuityClassification;
  warningCodes: CountyGovernanceEntropyDoctrineStewardshipContinuityWarningCode[];
  continuityScore: number;
  sustainabilityScore: number;
  safetyScore: number;
  durabilityScore: number;
  burdenScore: number;
  dependencyConcentrationScore: number;
  transferabilityScore: number;
  failClosedIntegrityScore: number;
  boundedReevaluationNeedScore: number;
  continuationNeedScore: number;
  reevaluationEvidenceCount: number;
}): CountyGovernanceEntropyDoctrineStewardshipContinuityExplainability {
  return {
    summary: params.hasEvidence
      ? `S30 classified stewardship continuity as ${params.classification}.`
      : "S30 classified stewardship continuity as unverified because no caller-supplied evidence was provided.",
    continuityDrivers: [`stewardship continuity score: ${params.continuityScore}`],
    sustainabilityDrivers: [`stewardship sustainability score: ${params.sustainabilityScore}`],
    safetyDrivers: [`stewardship safety score: ${params.safetyScore}`],
    durabilityDrivers: [`stewardship durability score: ${params.durabilityScore}`],
    dependencyDrivers: [`dependency concentration score: ${params.dependencyConcentrationScore}`],
    transferabilityDrivers: [`transferability score: ${params.transferabilityScore}`],
    reevaluationDrivers: [
      `bounded stewardship reevaluation need score: ${params.boundedReevaluationNeedScore}`,
      `reevaluation evidence count: ${params.reevaluationEvidenceCount}`,
    ],
    conflictDrivers: [
      `stewardship burden score: ${params.burdenScore}`,
      `stewardship continuation need score: ${params.continuationNeedScore}`,
    ],
    failClosedDrivers: [`fail-closed stewardship integrity score: ${params.failClosedIntegrityScore}`],
    warningDerivation: params.warningCodes.map((warning) => `${warning} derived from deterministic S30 thresholds.`),
    deterministicRulesApplied: [
      "Pure caller-input-only stewardship continuity modeling.",
      "Fixed ordinal maps and bounded 0-100 scores.",
      "Stable warning-code ordering.",
      "Explicit stewardship precedence ordering.",
      "No runtime, provider, database, network, clock, filesystem, or environment dependency.",
    ],
  };
}

export function evaluateCountyGovernanceEntropyDoctrineStewardshipContinuity(
  input: CountyGovernanceEntropyDoctrineStewardshipContinuityInput = {},
): CountyGovernanceEntropyDoctrineStewardshipContinuityResult {
  const hasEvidence = hasAnyInput(input);

  const transferEventCount = clampCount(input.transferEventCount);
  const unresolvedDoctrineConflictCount = clampCount(input.unresolvedDoctrineConflictCount);
  const reevaluationEvidenceCount = clampCount(input.reevaluationEvidenceCount);
  const failClosedDegradationCount = clampCount(input.failClosedDegradationCount);
  const explainabilityWeaknessCount = clampCount(input.explainabilityWeaknessCount);
  const recursiveDependencyEventCount = clampCount(input.recursiveDependencyEventCount);
  const dependencyConcentrationEventCount = clampCount(input.dependencyConcentrationEventCount);

  const continuityScore = continuityScores[input.stewardshipContinuityLevel ?? "unknown"];
  const sustainabilityScore = sustainabilityScores[input.stewardshipSustainabilityLevel ?? "unknown"];
  const safetyScore = safetyScores[input.stewardshipSafetyLevel ?? "unknown"];
  const durabilityScore = durabilityScores[input.stewardshipDurabilityLevel ?? "unknown"];
  const burdenScore = riskScores[input.stewardshipBurdenLevel ?? "none"];
  const dependencyConcentrationScore = Math.max(
    riskScores[input.dependencyConcentrationLevel ?? "none"],
    dependencyConcentrationEventCount > 0 ? 50 : 0,
  );
  const transferabilityScore = Math.max(
    transferabilityScores[input.transferabilityLevel ?? "unknown"],
    transferEventCount > 0 ? 40 : 0,
  );
  const explainabilityScore = explainabilityScores[input.stewardshipExplainabilityLevel ?? "opaque"];
  const failClosedIntegrityScore = failClosedScores[input.failClosedStewardshipIntegrityLevel ?? "absent"];
  const continuationNeedScore = riskScores[input.stewardshipContinuationNeedLevel ?? "none"];
  const boundedReevaluationNeedScore = Math.max(
    riskScores[input.boundedStewardshipReevaluationNeedLevel ?? "none"],
    reevaluationEvidenceCount < 1 && hasEvidence ? 50 : 0,
  );
  const collapseExposureScore = riskScores[input.collapseExposureLevel ?? "none"];
  const oversightCompatibilityScore = compatibilityScores[input.oversightCompatibilityLevel ?? "unknown"];
  const maintenanceCompatibilityScore = compatibilityScores[input.maintenanceCompatibilityLevel ?? "unknown"];
  const finalityCompatibilityScore = compatibilityScores[input.finalityCompatibilityLevel ?? "unknown"];
  const survivabilityCompatibilityScore = compatibilityScores[input.survivabilityCompatibilityLevel ?? "unknown"];
  const operationalSustainabilityScore =
    operationalSustainabilityScores[input.operationalStewardshipSustainabilityLevel ?? "unknown"];

  const failClosedStewardshipDegradation =
    isWeakFailClosed(input.failClosedStewardshipIntegrityLevel) || failClosedDegradationCount > 0;

  const recursiveStewardshipDependencyConflict =
    isHighRisk(input.recursiveStewardshipDependencyLevel) || recursiveDependencyEventCount > 0;

  const stewardshipSurvivabilityWeakness =
    isPoorCompatibility(input.survivabilityCompatibilityLevel) ||
    (survivabilityCompatibilityScore <= 40 && continuationNeedScore >= 50);

  const unresolvedStewardshipDoctrineConflict =
    unresolvedDoctrineConflictCount > 0 ||
    oversightCompatibilityScore <= 10 ||
    maintenanceCompatibilityScore <= 10 ||
    finalityCompatibilityScore <= 10 ||
    survivabilityCompatibilityScore <= 10;

  const operationallyUnsustainableStewardship =
    input.operationalStewardshipSustainabilityLevel === "unsustainable" || operationalSustainabilityScore <= 5;

  const collapseSensitiveStewardshipRejection =
    isHighRisk(input.collapseExposureLevel) ||
    (collapseExposureScore >= 50 &&
      (burdenScore >= 78 ||
        dependencyConcentrationScore >= 78 ||
        transferabilityScore < 65 ||
        failClosedStewardshipDegradation ||
        recursiveStewardshipDependencyConflict ||
        unresolvedStewardshipDoctrineConflict));

  const stewardshipUnsafe =
    input.stewardshipSafetyLevel === "unsafe" ||
    safetyScore <= 5 ||
    collapseExposureScore >= 100 ||
    (collapseExposureScore >= 78 && (burdenScore >= 78 || dependencyConcentrationScore >= 78));

  const stewardshipBlocked =
    (oversightCompatibilityScore <= 10 && maintenanceCompatibilityScore <= 10) ||
    (continuityScore < 35 && continuationNeedScore >= 78);

  const boundedStewardshipReevaluationRequired =
    !stewardshipUnsafe &&
    !collapseSensitiveStewardshipRejection &&
    !stewardshipBlocked &&
    (boundedReevaluationNeedScore >= 50 ||
      dependencyConcentrationScore >= 50 ||
      burdenScore >= 50 ||
      input.transferabilityLevel === "conditional" ||
      input.transferabilityLevel === "partial" ||
      oversightCompatibilityScore < 96 ||
      maintenanceCompatibilityScore < 96 ||
      finalityCompatibilityScore < 96 ||
      survivabilityCompatibilityScore < 96);

  const stewardshipContinuationRequired =
    !stewardshipUnsafe &&
    !collapseSensitiveStewardshipRejection &&
    !stewardshipBlocked &&
    !failClosedStewardshipDegradation &&
    (continuationNeedScore >= 50 ||
      oversightCompatibilityScore < 60 ||
      maintenanceCompatibilityScore < 60 ||
      finalityCompatibilityScore < 60 ||
      survivabilityCompatibilityScore < 60);

  const superficialStewardshipContinuity =
    continuityScore >= 72 &&
    (explainabilityScore < 65 ||
      failClosedIntegrityScore < 72 ||
      transferabilityScore < 65 ||
      reevaluationEvidenceCount < 1 ||
      explainabilityWeaknessCount > 0);

  const warningCodes = buildWarnings({
    hasEvidence,
    stewardshipBlocked,
    stewardshipUnsafe,
    stewardshipContinuationRequired,
    boundedStewardshipReevaluationRequired,
    collapseSensitiveStewardshipRejection,
    failClosedStewardshipDegradation,
    superficialStewardshipContinuity,
    recursiveStewardshipDependencyConflict,
    stewardshipSurvivabilityWeakness,
    unresolvedStewardshipDoctrineConflict,
    operationallyUnsustainableStewardship,
    burdenScore,
    dependencyConcentrationScore,
    transferabilityScore,
    explainabilityScore,
    oversightCompatibilityScore,
  });

  const stewardshipContinuityClassification = classifyStewardship({
    hasEvidence,
    continuityScore,
    sustainabilityScore,
    safetyScore,
    durabilityScore,
    burdenScore,
    dependencyConcentrationScore,
    transferabilityScore,
    explainabilityScore,
    failClosedIntegrityScore,
    continuationNeedScore,
    boundedReevaluationNeedScore,
    collapseExposureScore,
    operationalSustainabilityScore,
    stewardshipBlocked,
    stewardshipUnsafe,
    stewardshipContinuationRequired,
    boundedStewardshipReevaluationRequired,
    collapseSensitiveStewardshipRejection,
    failClosedStewardshipDegradation,
    superficialStewardshipContinuity,
    recursiveStewardshipDependencyConflict,
    stewardshipSurvivabilityWeakness,
    unresolvedStewardshipDoctrineConflict,
    operationallyUnsustainableStewardship,
  });

  return {
    stewardshipContinuityClassification,
    stewardshipReadinessClassification: getReadinessClassification({
      hasEvidence,
      stewardshipBlocked,
      continuityScore,
      sustainabilityScore,
      safetyScore,
    }),
    stewardshipSafetyClassification: getSafetyClassification({
      hasEvidence,
      stewardshipUnsafe,
      collapseSensitiveStewardshipRejection,
      safetyScore,
    }),
    continuityScore: clampScore(continuityScore),
    sustainabilityScore: clampScore(sustainabilityScore),
    safetyScore: clampScore(safetyScore),
    durabilityScore: clampScore(durabilityScore),
    burdenScore: clampScore(burdenScore),
    dependencyConcentrationScore: clampScore(dependencyConcentrationScore),
    transferabilityScore: clampScore(transferabilityScore),
    explainabilityScore: clampScore(explainabilityScore),
    failClosedIntegrityScore: clampScore(failClosedIntegrityScore),
    continuationNeedScore: clampScore(continuationNeedScore),
    boundedReevaluationNeedScore: clampScore(boundedReevaluationNeedScore),
    collapseExposureScore: clampScore(collapseExposureScore),
    operationalSustainabilityScore: clampScore(operationalSustainabilityScore),
    stewardshipBlocked,
    stewardshipUnsafe,
    stewardshipContinuationRequired,
    boundedStewardshipReevaluationRequired,
    collapseSensitiveStewardshipRejection,
    failClosedStewardshipDegradation,
    superficialStewardshipContinuity,
    recursiveStewardshipDependencyConflict,
    stewardshipSurvivabilityWeakness,
    unresolvedStewardshipDoctrineConflict,
    operationallyUnsustainableStewardship,
    warningCodes,
    explainability: buildExplainability({
      hasEvidence,
      classification: stewardshipContinuityClassification,
      warningCodes,
      continuityScore,
      sustainabilityScore,
      safetyScore,
      durabilityScore,
      burdenScore,
      dependencyConcentrationScore,
      transferabilityScore,
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
