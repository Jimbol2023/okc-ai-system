export type OversightSustainabilityLevel =
  | "unknown"
  | "unsustainable"
  | "strained"
  | "conditional"
  | "sustainable"
  | "durable"
  | "institutional";

export type OversightSafetyLevel =
  | "unknown"
  | "unsafe"
  | "risky"
  | "guarded"
  | "safe"
  | "institutional";

export type OversightDurabilityLevel =
  | "unknown"
  | "fragile"
  | "temporary"
  | "stable"
  | "durable"
  | "institutional";

export type OversightBurdenLevel = "none" | "low" | "moderate" | "high" | "critical";

export type OversightFatigueLevel = "none" | "low" | "moderate" | "high" | "critical";

export type OversightRiskLevel = "none" | "low" | "moderate" | "high" | "critical";

export type OversightExplainabilityLevel =
  | "opaque"
  | "partial"
  | "adequate"
  | "strong"
  | "institutional";

export type FailClosedOversightIntegrityLevel =
  | "absent"
  | "inconsistent"
  | "partial"
  | "stable"
  | "durable"
  | "institutional";

export type StewardshipCapacityLevel =
  | "unknown"
  | "weak"
  | "strained"
  | "conditional"
  | "strong"
  | "institutional";

export type DoctrineCompatibilityLevel =
  | "unknown"
  | "poor"
  | "strained"
  | "conditional"
  | "compatible"
  | "durable";

export type OperationalOversightSustainabilityLevel =
  | "unknown"
  | "unsustainable"
  | "strained"
  | "viable"
  | "durable"
  | "institutional";

export type ResourcePressureLevel = "none" | "low" | "moderate" | "high" | "critical";

export type CountyGovernanceEntropyDoctrineOversightSustainabilityClassification =
  | "durable_oversight_sustainability"
  | "conditional_oversight_sustainability"
  | "superficial_oversight_sustainability"
  | "oversight_unsustainable"
  | "oversight_blocked"
  | "oversight_unsafe"
  | "oversight_continuation_required"
  | "oversight_entropy_burden"
  | "oversight_explainability_weakness"
  | "fail_closed_oversight_degradation"
  | "recursive_oversight_dependency_conflict"
  | "collapse_sensitive_oversight_rejection"
  | "bounded_oversight_reevaluation_required"
  | "oversight_survivability_weakness"
  | "unresolved_oversight_doctrine_conflict"
  | "operationally_unsustainable_oversight"
  | "oversight_sustainability_unverified";

export type CountyGovernanceEntropyDoctrineOversightReadinessClassification =
  | "ready"
  | "conditionally_ready"
  | "not_ready"
  | "blocked"
  | "readiness_unverified";

export type CountyGovernanceEntropyDoctrineOversightSafetyClassification =
  | "safe"
  | "guarded"
  | "unsafe"
  | "collapse_sensitive"
  | "safety_unverified";

export type CountyGovernanceEntropyDoctrineOversightSustainabilityWarningCode =
  | "S29_OVERSIGHT_SUSTAINABILITY_UNVERIFIED"
  | "S29_OVERSIGHT_BLOCKED"
  | "S29_OVERSIGHT_UNSAFE"
  | "S29_SUPERFICIAL_OVERSIGHT_SUSTAINABILITY"
  | "S29_OVERSIGHT_CONTINUATION_REQUIRED"
  | "S29_BOUNDED_OVERSIGHT_REEVALUATION_REQUIRED"
  | "S29_OVERSIGHT_ENTROPY_BURDEN"
  | "S29_OVERSIGHT_FATIGUE_ACCUMULATION"
  | "S29_OVERSIGHT_EXPLAINABILITY_WEAK"
  | "S29_FAIL_CLOSED_OVERSIGHT_DEGRADATION"
  | "S29_RECURSIVE_OVERSIGHT_DEPENDENCY_CONFLICT"
  | "S29_COLLAPSE_SENSITIVE_OVERSIGHT_REJECTION"
  | "S29_OVERSIGHT_SURVIVABILITY_WEAKNESS"
  | "S29_UNRESOLVED_OVERSIGHT_DOCTRINE_CONFLICT"
  | "S29_OPERATIONALLY_UNSUSTAINABLE_OVERSIGHT"
  | "S29_OVERSIGHT_RESOURCE_PRESSURE"
  | "S29_STEWARDSHIP_CAPACITY_WEAK";

export interface CountyGovernanceEntropyDoctrineOversightSustainabilityInput {
  oversightSustainabilityLevel?: OversightSustainabilityLevel | null;
  oversightSafetyLevel?: OversightSafetyLevel | null;
  oversightDurabilityLevel?: OversightDurabilityLevel | null;
  oversightBurdenLevel?: OversightBurdenLevel | null;
  oversightFatigueLevel?: OversightFatigueLevel | null;
  oversightExplainabilityLevel?: OversightExplainabilityLevel | null;
  failClosedOversightIntegrityLevel?: FailClosedOversightIntegrityLevel | null;
  oversightContinuationNeedLevel?: OversightRiskLevel | null;
  boundedOversightReevaluationNeedLevel?: OversightRiskLevel | null;
  stewardshipCapacityLevel?: StewardshipCapacityLevel | null;
  recursiveOversightDependencyLevel?: OversightRiskLevel | null;
  collapseExposureLevel?: OversightRiskLevel | null;
  maintenanceCompatibilityLevel?: DoctrineCompatibilityLevel | null;
  finalityCompatibilityLevel?: DoctrineCompatibilityLevel | null;
  survivabilityCompatibilityLevel?: DoctrineCompatibilityLevel | null;
  operationalOversightSustainabilityLevel?: OperationalOversightSustainabilityLevel | null;
  resourcePressureLevel?: ResourcePressureLevel | null;
  oversightCycleCount?: number | null;
  oversightFatigueEventCount?: number | null;
  unresolvedDoctrineConflictCount?: number | null;
  reevaluationEvidenceCount?: number | null;
  failClosedDegradationCount?: number | null;
  explainabilityWeaknessCount?: number | null;
  recursiveDependencyEventCount?: number | null;
  resourceEscalationEventCount?: number | null;
}

export interface CountyGovernanceEntropyDoctrineOversightSustainabilityExplainability {
  summary: string;
  sustainabilityDrivers: string[];
  safetyDrivers: string[];
  durabilityDrivers: string[];
  burdenDrivers: string[];
  fatigueDrivers: string[];
  stewardshipDrivers: string[];
  reevaluationDrivers: string[];
  conflictDrivers: string[];
  failClosedDrivers: string[];
  warningDerivation: string[];
  deterministicRulesApplied: string[];
}

export interface CountyGovernanceEntropyDoctrineOversightSustainabilityResult {
  oversightSustainabilityClassification: CountyGovernanceEntropyDoctrineOversightSustainabilityClassification;
  oversightReadinessClassification: CountyGovernanceEntropyDoctrineOversightReadinessClassification;
  oversightSafetyClassification: CountyGovernanceEntropyDoctrineOversightSafetyClassification;
  sustainabilityScore: number;
  safetyScore: number;
  durabilityScore: number;
  burdenScore: number;
  fatigueScore: number;
  explainabilityScore: number;
  failClosedIntegrityScore: number;
  continuationNeedScore: number;
  boundedReevaluationNeedScore: number;
  stewardshipCapacityScore: number;
  collapseExposureScore: number;
  operationalSustainabilityScore: number;
  resourcePressureScore: number;
  oversightBlocked: boolean;
  oversightUnsafe: boolean;
  oversightContinuationRequired: boolean;
  boundedOversightReevaluationRequired: boolean;
  collapseSensitiveOversightRejection: boolean;
  failClosedOversightDegradation: boolean;
  superficialOversightSustainability: boolean;
  recursiveOversightDependencyConflict: boolean;
  oversightSurvivabilityWeakness: boolean;
  unresolvedOversightDoctrineConflict: boolean;
  operationallyUnsustainableOversight: boolean;
  warningCodes: CountyGovernanceEntropyDoctrineOversightSustainabilityWarningCode[];
  explainability: CountyGovernanceEntropyDoctrineOversightSustainabilityExplainability;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const sustainabilityScores: Record<OversightSustainabilityLevel, number> = {
  unknown: 0,
  unsustainable: 5,
  strained: 35,
  conditional: 60,
  sustainable: 78,
  durable: 88,
  institutional: 96,
};

const safetyScores: Record<OversightSafetyLevel, number> = {
  unknown: 0,
  unsafe: 5,
  risky: 35,
  guarded: 60,
  safe: 85,
  institutional: 96,
};

const durabilityScores: Record<OversightDurabilityLevel, number> = {
  unknown: 0,
  fragile: 15,
  temporary: 35,
  stable: 65,
  durable: 85,
  institutional: 96,
};

const riskScores: Record<OversightRiskLevel, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const burdenScores: Record<OversightBurdenLevel, number> = riskScores;

const fatigueScores: Record<OversightFatigueLevel, number> = riskScores;

const resourcePressureScores: Record<ResourcePressureLevel, number> = riskScores;

const explainabilityScores: Record<OversightExplainabilityLevel, number> = {
  opaque: 0,
  partial: 38,
  adequate: 65,
  strong: 84,
  institutional: 96,
};

const failClosedScores: Record<FailClosedOversightIntegrityLevel, number> = {
  absent: 0,
  inconsistent: 25,
  partial: 55,
  stable: 72,
  durable: 86,
  institutional: 96,
};

const stewardshipScores: Record<StewardshipCapacityLevel, number> = {
  unknown: 0,
  weak: 15,
  strained: 40,
  conditional: 60,
  strong: 84,
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

const operationalSustainabilityScores: Record<OperationalOversightSustainabilityLevel, number> = {
  unknown: 0,
  unsustainable: 5,
  strained: 45,
  viable: 72,
  durable: 88,
  institutional: 96,
};

const warningOrder: CountyGovernanceEntropyDoctrineOversightSustainabilityWarningCode[] = [
  "S29_OVERSIGHT_SUSTAINABILITY_UNVERIFIED",
  "S29_OVERSIGHT_BLOCKED",
  "S29_OVERSIGHT_UNSAFE",
  "S29_SUPERFICIAL_OVERSIGHT_SUSTAINABILITY",
  "S29_OVERSIGHT_CONTINUATION_REQUIRED",
  "S29_BOUNDED_OVERSIGHT_REEVALUATION_REQUIRED",
  "S29_OVERSIGHT_ENTROPY_BURDEN",
  "S29_OVERSIGHT_FATIGUE_ACCUMULATION",
  "S29_OVERSIGHT_EXPLAINABILITY_WEAK",
  "S29_FAIL_CLOSED_OVERSIGHT_DEGRADATION",
  "S29_RECURSIVE_OVERSIGHT_DEPENDENCY_CONFLICT",
  "S29_COLLAPSE_SENSITIVE_OVERSIGHT_REJECTION",
  "S29_OVERSIGHT_SURVIVABILITY_WEAKNESS",
  "S29_UNRESOLVED_OVERSIGHT_DOCTRINE_CONFLICT",
  "S29_OPERATIONALLY_UNSUSTAINABLE_OVERSIGHT",
  "S29_OVERSIGHT_RESOURCE_PRESSURE",
  "S29_STEWARDSHIP_CAPACITY_WEAK",
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

function hasAnyInput(input: CountyGovernanceEntropyDoctrineOversightSustainabilityInput): boolean {
  return Object.values(input).some((value) => value !== undefined && value !== null);
}

function isHighRisk(level: OversightRiskLevel | null | undefined): boolean {
  return level === "high" || level === "critical";
}

function isWeakFailClosed(level: FailClosedOversightIntegrityLevel | null | undefined): boolean {
  return level === "absent" || level === "inconsistent" || level === "partial";
}

function isPoorCompatibility(level: DoctrineCompatibilityLevel | null | undefined): boolean {
  return level === "poor" || level === "unknown";
}

function getReadinessClassification(params: {
  hasEvidence: boolean;
  oversightBlocked: boolean;
  sustainabilityScore: number;
  safetyScore: number;
  durabilityScore: number;
}): CountyGovernanceEntropyDoctrineOversightReadinessClassification {
  if (!params.hasEvidence) {
    return "readiness_unverified";
  }

  if (params.oversightBlocked) {
    return "blocked";
  }

  if (params.sustainabilityScore >= 78 && params.safetyScore >= 85 && params.durabilityScore >= 85) {
    return "ready";
  }

  if (params.sustainabilityScore >= 60 && params.safetyScore >= 60) {
    return "conditionally_ready";
  }

  return "not_ready";
}

function getSafetyClassification(params: {
  hasEvidence: boolean;
  oversightUnsafe: boolean;
  collapseSensitiveOversightRejection: boolean;
  safetyScore: number;
}): CountyGovernanceEntropyDoctrineOversightSafetyClassification {
  if (!params.hasEvidence) {
    return "safety_unverified";
  }

  if (params.collapseSensitiveOversightRejection) {
    return "collapse_sensitive";
  }

  if (params.oversightUnsafe || params.safetyScore < 35) {
    return "unsafe";
  }

  if (params.safetyScore >= 85) {
    return "safe";
  }

  return "guarded";
}

function classifyOversight(params: {
  hasEvidence: boolean;
  sustainabilityScore: number;
  safetyScore: number;
  durabilityScore: number;
  burdenScore: number;
  fatigueScore: number;
  explainabilityScore: number;
  failClosedIntegrityScore: number;
  continuationNeedScore: number;
  boundedReevaluationNeedScore: number;
  stewardshipCapacityScore: number;
  collapseExposureScore: number;
  operationalSustainabilityScore: number;
  resourcePressureScore: number;
  oversightBlocked: boolean;
  oversightUnsafe: boolean;
  oversightContinuationRequired: boolean;
  boundedOversightReevaluationRequired: boolean;
  collapseSensitiveOversightRejection: boolean;
  failClosedOversightDegradation: boolean;
  superficialOversightSustainability: boolean;
  recursiveOversightDependencyConflict: boolean;
  oversightSurvivabilityWeakness: boolean;
  unresolvedOversightDoctrineConflict: boolean;
  operationallyUnsustainableOversight: boolean;
}): CountyGovernanceEntropyDoctrineOversightSustainabilityClassification {
  if (!params.hasEvidence) {
    return "oversight_sustainability_unverified";
  }

  if (params.collapseSensitiveOversightRejection) {
    return "collapse_sensitive_oversight_rejection";
  }

  if (params.oversightUnsafe) {
    return "oversight_unsafe";
  }

  if (params.oversightBlocked) {
    return "oversight_blocked";
  }

  if (params.operationallyUnsustainableOversight) {
    return "operationally_unsustainable_oversight";
  }

  if (params.failClosedOversightDegradation) {
    return "fail_closed_oversight_degradation";
  }

  if (params.recursiveOversightDependencyConflict) {
    return "recursive_oversight_dependency_conflict";
  }

  if (params.unresolvedOversightDoctrineConflict) {
    return "unresolved_oversight_doctrine_conflict";
  }

  if (params.oversightSurvivabilityWeakness) {
    return "oversight_survivability_weakness";
  }

  if (params.oversightContinuationRequired) {
    return "oversight_continuation_required";
  }

  if (params.boundedOversightReevaluationRequired) {
    return "bounded_oversight_reevaluation_required";
  }

  if (params.explainabilityScore < 65) {
    return "oversight_explainability_weakness";
  }

  if (params.burdenScore >= 50 || params.fatigueScore >= 50 || params.resourcePressureScore >= 50) {
    return "oversight_entropy_burden";
  }

  if (params.superficialOversightSustainability) {
    return "superficial_oversight_sustainability";
  }

  if (
    params.sustainabilityScore >= 88 &&
    params.safetyScore >= 85 &&
    params.durabilityScore >= 85 &&
    params.explainabilityScore >= 84 &&
    params.failClosedIntegrityScore >= 86 &&
    params.stewardshipCapacityScore >= 84 &&
    params.burdenScore <= 20 &&
    params.fatigueScore <= 20 &&
    params.resourcePressureScore <= 20 &&
    params.continuationNeedScore <= 20 &&
    params.boundedReevaluationNeedScore <= 20 &&
    params.collapseExposureScore <= 20
  ) {
    return "durable_oversight_sustainability";
  }

  if (
    params.sustainabilityScore >= 60 &&
    params.safetyScore >= 60 &&
    params.durabilityScore >= 60 &&
    params.failClosedIntegrityScore >= 72
  ) {
    return "conditional_oversight_sustainability";
  }

  return "oversight_unsustainable";
}

function buildWarnings(params: {
  hasEvidence: boolean;
  oversightBlocked: boolean;
  oversightUnsafe: boolean;
  oversightContinuationRequired: boolean;
  boundedOversightReevaluationRequired: boolean;
  collapseSensitiveOversightRejection: boolean;
  failClosedOversightDegradation: boolean;
  superficialOversightSustainability: boolean;
  recursiveOversightDependencyConflict: boolean;
  oversightSurvivabilityWeakness: boolean;
  unresolvedOversightDoctrineConflict: boolean;
  operationallyUnsustainableOversight: boolean;
  burdenScore: number;
  fatigueScore: number;
  explainabilityScore: number;
  resourcePressureScore: number;
  stewardshipCapacityScore: number;
}): CountyGovernanceEntropyDoctrineOversightSustainabilityWarningCode[] {
  const warnings = new Set<CountyGovernanceEntropyDoctrineOversightSustainabilityWarningCode>();

  if (!params.hasEvidence) {
    warnings.add("S29_OVERSIGHT_SUSTAINABILITY_UNVERIFIED");
  }

  if (params.oversightBlocked) {
    warnings.add("S29_OVERSIGHT_BLOCKED");
  }

  if (params.oversightUnsafe) {
    warnings.add("S29_OVERSIGHT_UNSAFE");
  }

  if (params.superficialOversightSustainability) {
    warnings.add("S29_SUPERFICIAL_OVERSIGHT_SUSTAINABILITY");
  }

  if (params.oversightContinuationRequired) {
    warnings.add("S29_OVERSIGHT_CONTINUATION_REQUIRED");
  }

  if (params.boundedOversightReevaluationRequired) {
    warnings.add("S29_BOUNDED_OVERSIGHT_REEVALUATION_REQUIRED");
  }

  if (params.burdenScore >= 50) {
    warnings.add("S29_OVERSIGHT_ENTROPY_BURDEN");
  }

  if (params.fatigueScore >= 50) {
    warnings.add("S29_OVERSIGHT_FATIGUE_ACCUMULATION");
  }

  if (params.explainabilityScore < 65 && params.hasEvidence) {
    warnings.add("S29_OVERSIGHT_EXPLAINABILITY_WEAK");
  }

  if (params.failClosedOversightDegradation) {
    warnings.add("S29_FAIL_CLOSED_OVERSIGHT_DEGRADATION");
  }

  if (params.recursiveOversightDependencyConflict) {
    warnings.add("S29_RECURSIVE_OVERSIGHT_DEPENDENCY_CONFLICT");
  }

  if (params.collapseSensitiveOversightRejection) {
    warnings.add("S29_COLLAPSE_SENSITIVE_OVERSIGHT_REJECTION");
  }

  if (params.oversightSurvivabilityWeakness) {
    warnings.add("S29_OVERSIGHT_SURVIVABILITY_WEAKNESS");
  }

  if (params.unresolvedOversightDoctrineConflict) {
    warnings.add("S29_UNRESOLVED_OVERSIGHT_DOCTRINE_CONFLICT");
  }

  if (params.operationallyUnsustainableOversight) {
    warnings.add("S29_OPERATIONALLY_UNSUSTAINABLE_OVERSIGHT");
  }

  if (params.resourcePressureScore >= 50) {
    warnings.add("S29_OVERSIGHT_RESOURCE_PRESSURE");
  }

  if (params.stewardshipCapacityScore < 60 && params.hasEvidence) {
    warnings.add("S29_STEWARDSHIP_CAPACITY_WEAK");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function buildExplainability(params: {
  hasEvidence: boolean;
  classification: CountyGovernanceEntropyDoctrineOversightSustainabilityClassification;
  warningCodes: CountyGovernanceEntropyDoctrineOversightSustainabilityWarningCode[];
  sustainabilityScore: number;
  safetyScore: number;
  durabilityScore: number;
  burdenScore: number;
  fatigueScore: number;
  explainabilityScore: number;
  failClosedIntegrityScore: number;
  continuationNeedScore: number;
  boundedReevaluationNeedScore: number;
  stewardshipCapacityScore: number;
  collapseExposureScore: number;
  operationalSustainabilityScore: number;
  resourcePressureScore: number;
  reevaluationEvidenceCount: number;
}): CountyGovernanceEntropyDoctrineOversightSustainabilityExplainability {
  return {
    summary: params.hasEvidence
      ? `S29 classified oversight sustainability as ${params.classification}.`
      : "S29 classified oversight sustainability as unverified because no caller-supplied evidence was provided.",
    sustainabilityDrivers: [
      `oversight sustainability score: ${params.sustainabilityScore}`,
      `operational oversight sustainability score: ${params.operationalSustainabilityScore}`,
    ],
    safetyDrivers: [
      `oversight safety score: ${params.safetyScore}`,
      `collapse exposure score: ${params.collapseExposureScore}`,
    ],
    durabilityDrivers: [`oversight durability score: ${params.durabilityScore}`],
    burdenDrivers: [
      `oversight burden score: ${params.burdenScore}`,
      `resource pressure score: ${params.resourcePressureScore}`,
    ],
    fatigueDrivers: [`oversight fatigue score: ${params.fatigueScore}`],
    stewardshipDrivers: [`stewardship capacity score: ${params.stewardshipCapacityScore}`],
    reevaluationDrivers: [
      `bounded oversight reevaluation need score: ${params.boundedReevaluationNeedScore}`,
      `reevaluation evidence count: ${params.reevaluationEvidenceCount}`,
    ],
    conflictDrivers: [`oversight continuation need score: ${params.continuationNeedScore}`],
    failClosedDrivers: [`fail-closed oversight integrity score: ${params.failClosedIntegrityScore}`],
    warningDerivation: params.warningCodes.map((warning) => `${warning} derived from deterministic S29 thresholds.`),
    deterministicRulesApplied: [
      "Pure caller-input-only oversight sustainability modeling.",
      "Fixed ordinal maps and bounded 0-100 scores.",
      "Stable warning-code ordering.",
      "Explicit oversight precedence ordering.",
      "No runtime, provider, database, network, clock, filesystem, or environment dependency.",
    ],
  };
}

export function evaluateCountyGovernanceEntropyDoctrineOversightSustainability(
  input: CountyGovernanceEntropyDoctrineOversightSustainabilityInput = {},
): CountyGovernanceEntropyDoctrineOversightSustainabilityResult {
  const hasEvidence = hasAnyInput(input);

  const oversightCycleCount = clampCount(input.oversightCycleCount);
  const oversightFatigueEventCount = clampCount(input.oversightFatigueEventCount);
  const unresolvedDoctrineConflictCount = clampCount(input.unresolvedDoctrineConflictCount);
  const reevaluationEvidenceCount = clampCount(input.reevaluationEvidenceCount);
  const failClosedDegradationCount = clampCount(input.failClosedDegradationCount);
  const explainabilityWeaknessCount = clampCount(input.explainabilityWeaknessCount);
  const recursiveDependencyEventCount = clampCount(input.recursiveDependencyEventCount);
  const resourceEscalationEventCount = clampCount(input.resourceEscalationEventCount);

  const sustainabilityScore = sustainabilityScores[input.oversightSustainabilityLevel ?? "unknown"];
  const safetyScore = safetyScores[input.oversightSafetyLevel ?? "unknown"];
  const durabilityScore = durabilityScores[input.oversightDurabilityLevel ?? "unknown"];
  const burdenScore = burdenScores[input.oversightBurdenLevel ?? "none"];
  const fatigueScore = Math.max(
    fatigueScores[input.oversightFatigueLevel ?? "none"],
    oversightFatigueEventCount > 0 ? 50 : 0,
  );
  const explainabilityScore = explainabilityScores[input.oversightExplainabilityLevel ?? "opaque"];
  const failClosedIntegrityScore = failClosedScores[input.failClosedOversightIntegrityLevel ?? "absent"];
  const continuationNeedScore = riskScores[input.oversightContinuationNeedLevel ?? "none"];
  const boundedReevaluationNeedScore = Math.max(
    riskScores[input.boundedOversightReevaluationNeedLevel ?? "none"],
    reevaluationEvidenceCount < 1 && hasEvidence ? 50 : 0,
  );
  const stewardshipCapacityScore = stewardshipScores[input.stewardshipCapacityLevel ?? "unknown"];
  const collapseExposureScore = riskScores[input.collapseExposureLevel ?? "none"];
  const maintenanceCompatibilityScore = compatibilityScores[input.maintenanceCompatibilityLevel ?? "unknown"];
  const finalityCompatibilityScore = compatibilityScores[input.finalityCompatibilityLevel ?? "unknown"];
  const survivabilityCompatibilityScore = compatibilityScores[input.survivabilityCompatibilityLevel ?? "unknown"];
  const operationalSustainabilityScore =
    operationalSustainabilityScores[input.operationalOversightSustainabilityLevel ?? "unknown"];
  const resourcePressureScore = Math.max(
    resourcePressureScores[input.resourcePressureLevel ?? "none"],
    resourceEscalationEventCount > 0 ? 50 : 0,
  );

  const failClosedOversightDegradation =
    isWeakFailClosed(input.failClosedOversightIntegrityLevel) || failClosedDegradationCount > 0;

  const recursiveOversightDependencyConflict =
    isHighRisk(input.recursiveOversightDependencyLevel) || recursiveDependencyEventCount > 0;

  const oversightSurvivabilityWeakness =
    isPoorCompatibility(input.survivabilityCompatibilityLevel) ||
    (survivabilityCompatibilityScore <= 40 && continuationNeedScore >= 50);

  const unresolvedOversightDoctrineConflict =
    unresolvedDoctrineConflictCount > 0 ||
    maintenanceCompatibilityScore <= 10 ||
    finalityCompatibilityScore <= 10 ||
    survivabilityCompatibilityScore <= 10;

  const operationallyUnsustainableOversight =
    input.operationalOversightSustainabilityLevel === "unsustainable" || operationalSustainabilityScore <= 5;

  const collapseSensitiveOversightRejection =
    isHighRisk(input.collapseExposureLevel) ||
    (collapseExposureScore >= 50 &&
      (burdenScore >= 78 ||
        fatigueScore >= 78 ||
        failClosedOversightDegradation ||
        recursiveOversightDependencyConflict ||
        unresolvedOversightDoctrineConflict));

  const oversightUnsafe =
    input.oversightSafetyLevel === "unsafe" ||
    safetyScore <= 5 ||
    collapseExposureScore >= 100 ||
    (collapseExposureScore >= 78 && (burdenScore >= 78 || fatigueScore >= 78));

  const oversightBlocked =
    (maintenanceCompatibilityScore <= 10 && finalityCompatibilityScore <= 10) ||
    (sustainabilityScore < 35 && continuationNeedScore >= 78);

  const boundedOversightReevaluationRequired =
    !oversightUnsafe &&
    !collapseSensitiveOversightRejection &&
    !oversightBlocked &&
    (boundedReevaluationNeedScore >= 50 ||
      burdenScore >= 50 ||
      fatigueScore >= 50 ||
      resourcePressureScore >= 50 ||
      input.stewardshipCapacityLevel === "conditional" ||
      input.stewardshipCapacityLevel === "strained" ||
      maintenanceCompatibilityScore < 82 ||
      finalityCompatibilityScore < 82 ||
      survivabilityCompatibilityScore < 82);

  const oversightContinuationRequired =
    !oversightUnsafe &&
    !collapseSensitiveOversightRejection &&
    !oversightBlocked &&
    !failClosedOversightDegradation &&
    (continuationNeedScore >= 50 ||
      oversightCycleCount < 1 ||
      maintenanceCompatibilityScore < 60 ||
      finalityCompatibilityScore < 60 ||
      survivabilityCompatibilityScore < 60);

  const superficialOversightSustainability =
    sustainabilityScore >= 78 &&
    (explainabilityScore < 65 ||
      failClosedIntegrityScore < 72 ||
      stewardshipCapacityScore < 60 ||
      reevaluationEvidenceCount < 1 ||
      explainabilityWeaknessCount > 0);

  const warningCodes = buildWarnings({
    hasEvidence,
    oversightBlocked,
    oversightUnsafe,
    oversightContinuationRequired,
    boundedOversightReevaluationRequired,
    collapseSensitiveOversightRejection,
    failClosedOversightDegradation,
    superficialOversightSustainability,
    recursiveOversightDependencyConflict,
    oversightSurvivabilityWeakness,
    unresolvedOversightDoctrineConflict,
    operationallyUnsustainableOversight,
    burdenScore,
    fatigueScore,
    explainabilityScore,
    resourcePressureScore,
    stewardshipCapacityScore,
  });

  const oversightSustainabilityClassification = classifyOversight({
    hasEvidence,
    sustainabilityScore,
    safetyScore,
    durabilityScore,
    burdenScore,
    fatigueScore,
    explainabilityScore,
    failClosedIntegrityScore,
    continuationNeedScore,
    boundedReevaluationNeedScore,
    stewardshipCapacityScore,
    collapseExposureScore,
    operationalSustainabilityScore,
    resourcePressureScore,
    oversightBlocked,
    oversightUnsafe,
    oversightContinuationRequired,
    boundedOversightReevaluationRequired,
    collapseSensitiveOversightRejection,
    failClosedOversightDegradation,
    superficialOversightSustainability,
    recursiveOversightDependencyConflict,
    oversightSurvivabilityWeakness,
    unresolvedOversightDoctrineConflict,
    operationallyUnsustainableOversight,
  });

  return {
    oversightSustainabilityClassification,
    oversightReadinessClassification: getReadinessClassification({
      hasEvidence,
      oversightBlocked,
      sustainabilityScore,
      safetyScore,
      durabilityScore,
    }),
    oversightSafetyClassification: getSafetyClassification({
      hasEvidence,
      oversightUnsafe,
      collapseSensitiveOversightRejection,
      safetyScore,
    }),
    sustainabilityScore: clampScore(sustainabilityScore),
    safetyScore: clampScore(safetyScore),
    durabilityScore: clampScore(durabilityScore),
    burdenScore: clampScore(burdenScore),
    fatigueScore: clampScore(fatigueScore),
    explainabilityScore: clampScore(explainabilityScore),
    failClosedIntegrityScore: clampScore(failClosedIntegrityScore),
    continuationNeedScore: clampScore(continuationNeedScore),
    boundedReevaluationNeedScore: clampScore(boundedReevaluationNeedScore),
    stewardshipCapacityScore: clampScore(stewardshipCapacityScore),
    collapseExposureScore: clampScore(collapseExposureScore),
    operationalSustainabilityScore: clampScore(operationalSustainabilityScore),
    resourcePressureScore: clampScore(resourcePressureScore),
    oversightBlocked,
    oversightUnsafe,
    oversightContinuationRequired,
    boundedOversightReevaluationRequired,
    collapseSensitiveOversightRejection,
    failClosedOversightDegradation,
    superficialOversightSustainability,
    recursiveOversightDependencyConflict,
    oversightSurvivabilityWeakness,
    unresolvedOversightDoctrineConflict,
    operationallyUnsustainableOversight,
    warningCodes,
    explainability: buildExplainability({
      hasEvidence,
      classification: oversightSustainabilityClassification,
      warningCodes,
      sustainabilityScore,
      safetyScore,
      durabilityScore,
      burdenScore,
      fatigueScore,
      explainabilityScore,
      failClosedIntegrityScore,
      continuationNeedScore,
      boundedReevaluationNeedScore,
      stewardshipCapacityScore,
      collapseExposureScore,
      operationalSustainabilityScore,
      resourcePressureScore,
      reevaluationEvidenceCount,
    }),
    ingestionBlocked: true,
    automationBlocked: true,
    executionBlocked: true,
    planningOnly: true,
    failClosed: true,
  };
}
