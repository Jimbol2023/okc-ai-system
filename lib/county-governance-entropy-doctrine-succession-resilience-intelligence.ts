export type SuccessionResilienceLevel =
  | "unknown"
  | "broken"
  | "fragile"
  | "conditional"
  | "stable"
  | "durable"
  | "institutional";

export type SuccessionSustainabilityLevel =
  | "unknown"
  | "unsustainable"
  | "strained"
  | "conditional"
  | "sustainable"
  | "durable"
  | "institutional";

export type SuccessionSafetyLevel = "unknown" | "unsafe" | "risky" | "guarded" | "safe" | "institutional";
export type SuccessionDurabilityLevel = "unknown" | "fragile" | "temporary" | "stable" | "durable" | "institutional";
export type SuccessionRiskLevel = "none" | "low" | "moderate" | "high" | "critical";

export type TransitionSurvivabilityLevel =
  | "unknown"
  | "weak"
  | "partial"
  | "conditional"
  | "strong"
  | "institutional";

export type HandoffDurabilityLevel =
  | "unknown"
  | "weak"
  | "partial"
  | "conditional"
  | "strong"
  | "institutional";

export type KnowledgeTransferSurvivabilityLevel =
  | "unknown"
  | "weak"
  | "partial"
  | "conditional"
  | "strong"
  | "institutional";

export type SuccessionExplainabilityLevel = "opaque" | "partial" | "adequate" | "strong" | "institutional";

export type FailClosedSuccessionIntegrityLevel =
  | "absent"
  | "inconsistent"
  | "partial"
  | "stable"
  | "durable"
  | "institutional";

export type SuccessionDoctrineCompatibilityLevel =
  | "unknown"
  | "poor"
  | "strained"
  | "conditional"
  | "compatible"
  | "durable";

export type OperationalSuccessionSustainabilityLevel =
  | "unknown"
  | "unsustainable"
  | "strained"
  | "viable"
  | "durable"
  | "institutional";

export type CountyGovernanceEntropyDoctrineSuccessionResilienceClassification =
  | "durable_succession_resilience"
  | "conditional_succession_resilience"
  | "superficial_succession_resilience"
  | "succession_unsustainable"
  | "succession_blocked"
  | "succession_unsafe"
  | "succession_continuation_required"
  | "succession_entropy_burden"
  | "succession_explainability_weakness"
  | "fail_closed_succession_degradation"
  | "recursive_succession_dependency_conflict"
  | "collapse_sensitive_succession_rejection"
  | "bounded_succession_reevaluation_required"
  | "succession_survivability_weakness"
  | "unresolved_succession_doctrine_conflict"
  | "operationally_unsustainable_succession"
  | "succession_resilience_unverified";

export type CountyGovernanceEntropyDoctrineSuccessionReadinessClassification =
  | "ready"
  | "conditionally_ready"
  | "not_ready"
  | "blocked"
  | "readiness_unverified";

export type CountyGovernanceEntropyDoctrineSuccessionSafetyClassification =
  | "safe"
  | "guarded"
  | "unsafe"
  | "collapse_sensitive"
  | "safety_unverified";

export type CountyGovernanceEntropyDoctrineSuccessionResilienceWarningCode =
  | "S32_SUCCESSION_RESILIENCE_UNVERIFIED"
  | "S32_SUCCESSION_BLOCKED"
  | "S32_SUCCESSION_UNSAFE"
  | "S32_SUPERFICIAL_SUCCESSION_RESILIENCE"
  | "S32_SUCCESSION_CONTINUATION_REQUIRED"
  | "S32_BOUNDED_SUCCESSION_REEVALUATION_REQUIRED"
  | "S32_SUCCESSION_ENTROPY_BURDEN"
  | "S32_SUCCESSION_EXPLAINABILITY_WEAK"
  | "S32_FAIL_CLOSED_SUCCESSION_DEGRADATION"
  | "S32_RECURSIVE_SUCCESSION_DEPENDENCY_CONFLICT"
  | "S32_COLLAPSE_SENSITIVE_SUCCESSION_REJECTION"
  | "S32_SUCCESSION_SURVIVABILITY_WEAKNESS"
  | "S32_UNRESOLVED_SUCCESSION_DOCTRINE_CONFLICT"
  | "S32_OPERATIONALLY_UNSUSTAINABLE_SUCCESSION"
  | "S32_SUCCESSION_INSTABILITY_DETECTED"
  | "S32_SUCCESSION_DEPENDENCY_CONCENTRATION"
  | "S32_TRANSITION_SURVIVABILITY_WEAK"
  | "S32_HANDOFF_DURABILITY_WEAK"
  | "S32_KNOWLEDGE_TRANSFER_SURVIVABILITY_WEAK"
  | "S32_MEMORY_COMPATIBILITY_WEAK";

export interface CountyGovernanceEntropyDoctrineSuccessionResilienceInput {
  successionResilienceLevel?: SuccessionResilienceLevel | null;
  successionSustainabilityLevel?: SuccessionSustainabilityLevel | null;
  successionSafetyLevel?: SuccessionSafetyLevel | null;
  successionDurabilityLevel?: SuccessionDurabilityLevel | null;
  transitionSurvivabilityLevel?: TransitionSurvivabilityLevel | null;
  handoffDurabilityLevel?: HandoffDurabilityLevel | null;
  knowledgeTransferSurvivabilityLevel?: KnowledgeTransferSurvivabilityLevel | null;
  successionInstabilityLevel?: SuccessionRiskLevel | null;
  successionDependencyConcentrationLevel?: SuccessionRiskLevel | null;
  successionExplainabilityLevel?: SuccessionExplainabilityLevel | null;
  failClosedSuccessionIntegrityLevel?: FailClosedSuccessionIntegrityLevel | null;
  successionContinuationNeedLevel?: SuccessionRiskLevel | null;
  boundedSuccessionReevaluationNeedLevel?: SuccessionRiskLevel | null;
  recursiveSuccessionDependencyLevel?: SuccessionRiskLevel | null;
  collapseExposureLevel?: SuccessionRiskLevel | null;
  memoryCompatibilityLevel?: SuccessionDoctrineCompatibilityLevel | null;
  stewardshipCompatibilityLevel?: SuccessionDoctrineCompatibilityLevel | null;
  oversightCompatibilityLevel?: SuccessionDoctrineCompatibilityLevel | null;
  maintenanceCompatibilityLevel?: SuccessionDoctrineCompatibilityLevel | null;
  finalityCompatibilityLevel?: SuccessionDoctrineCompatibilityLevel | null;
  survivabilityCompatibilityLevel?: SuccessionDoctrineCompatibilityLevel | null;
  operationalSuccessionSustainabilityLevel?: OperationalSuccessionSustainabilityLevel | null;
  successionCycleCount?: number | null;
  transitionEventCount?: number | null;
  handoffEventCount?: number | null;
  knowledgeTransferEventCount?: number | null;
  unresolvedDoctrineConflictCount?: number | null;
  reevaluationEvidenceCount?: number | null;
  failClosedDegradationCount?: number | null;
  explainabilityWeaknessCount?: number | null;
  recursiveDependencyEventCount?: number | null;
  successionInstabilityEventCount?: number | null;
  dependencyConcentrationEventCount?: number | null;
}

export interface CountyGovernanceEntropyDoctrineSuccessionResilienceExplainability {
  summary: string;
  resilienceDrivers: string[];
  sustainabilityDrivers: string[];
  safetyDrivers: string[];
  durabilityDrivers: string[];
  transitionDrivers: string[];
  handoffDrivers: string[];
  knowledgeTransferDrivers: string[];
  instabilityDrivers: string[];
  dependencyDrivers: string[];
  reevaluationDrivers: string[];
  conflictDrivers: string[];
  failClosedDrivers: string[];
  warningDerivation: string[];
  deterministicRulesApplied: string[];
}

export interface CountyGovernanceEntropyDoctrineSuccessionResilienceResult {
  successionResilienceClassification: CountyGovernanceEntropyDoctrineSuccessionResilienceClassification;
  successionReadinessClassification: CountyGovernanceEntropyDoctrineSuccessionReadinessClassification;
  successionSafetyClassification: CountyGovernanceEntropyDoctrineSuccessionSafetyClassification;
  resilienceScore: number;
  sustainabilityScore: number;
  safetyScore: number;
  durabilityScore: number;
  transitionSurvivabilityScore: number;
  handoffDurabilityScore: number;
  knowledgeTransferSurvivabilityScore: number;
  successionInstabilityScore: number;
  dependencyConcentrationScore: number;
  explainabilityScore: number;
  failClosedIntegrityScore: number;
  continuationNeedScore: number;
  boundedReevaluationNeedScore: number;
  collapseExposureScore: number;
  operationalSustainabilityScore: number;
  successionBlocked: boolean;
  successionUnsafe: boolean;
  successionContinuationRequired: boolean;
  boundedSuccessionReevaluationRequired: boolean;
  collapseSensitiveSuccessionRejection: boolean;
  failClosedSuccessionDegradation: boolean;
  superficialSuccessionResilience: boolean;
  recursiveSuccessionDependencyConflict: boolean;
  successionSurvivabilityWeakness: boolean;
  unresolvedSuccessionDoctrineConflict: boolean;
  operationallyUnsustainableSuccession: boolean;
  warningCodes: CountyGovernanceEntropyDoctrineSuccessionResilienceWarningCode[];
  explainability: CountyGovernanceEntropyDoctrineSuccessionResilienceExplainability;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const resilienceScores: Record<SuccessionResilienceLevel, number> = {
  unknown: 0,
  broken: 5,
  fragile: 25,
  conditional: 60,
  stable: 72,
  durable: 88,
  institutional: 96,
};

const sustainabilityScores: Record<SuccessionSustainabilityLevel, number> = {
  unknown: 0,
  unsustainable: 5,
  strained: 35,
  conditional: 60,
  sustainable: 78,
  durable: 88,
  institutional: 96,
};

const safetyScores: Record<SuccessionSafetyLevel, number> = {
  unknown: 0,
  unsafe: 5,
  risky: 35,
  guarded: 60,
  safe: 85,
  institutional: 96,
};

const durabilityScores: Record<SuccessionDurabilityLevel, number> = {
  unknown: 0,
  fragile: 15,
  temporary: 35,
  stable: 65,
  durable: 85,
  institutional: 96,
};

const riskScores: Record<SuccessionRiskLevel, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const transitionScores: Record<TransitionSurvivabilityLevel, number> = {
  unknown: 0,
  weak: 15,
  partial: 40,
  conditional: 60,
  strong: 84,
  institutional: 96,
};

const handoffScores: Record<HandoffDurabilityLevel, number> = {
  unknown: 0,
  weak: 15,
  partial: 40,
  conditional: 60,
  strong: 84,
  institutional: 96,
};

const knowledgeTransferScores: Record<KnowledgeTransferSurvivabilityLevel, number> = {
  unknown: 0,
  weak: 15,
  partial: 40,
  conditional: 60,
  strong: 84,
  institutional: 96,
};

const explainabilityScores: Record<SuccessionExplainabilityLevel, number> = {
  opaque: 0,
  partial: 38,
  adequate: 65,
  strong: 84,
  institutional: 96,
};

const failClosedScores: Record<FailClosedSuccessionIntegrityLevel, number> = {
  absent: 0,
  inconsistent: 25,
  partial: 55,
  stable: 72,
  durable: 86,
  institutional: 96,
};

const compatibilityScores: Record<SuccessionDoctrineCompatibilityLevel, number> = {
  unknown: 0,
  poor: 10,
  strained: 40,
  conditional: 60,
  compatible: 82,
  durable: 96,
};

const operationalSustainabilityScores: Record<OperationalSuccessionSustainabilityLevel, number> = {
  unknown: 0,
  unsustainable: 5,
  strained: 45,
  viable: 72,
  durable: 88,
  institutional: 96,
};

const warningOrder: CountyGovernanceEntropyDoctrineSuccessionResilienceWarningCode[] = [
  "S32_SUCCESSION_RESILIENCE_UNVERIFIED",
  "S32_SUCCESSION_BLOCKED",
  "S32_SUCCESSION_UNSAFE",
  "S32_SUPERFICIAL_SUCCESSION_RESILIENCE",
  "S32_SUCCESSION_CONTINUATION_REQUIRED",
  "S32_BOUNDED_SUCCESSION_REEVALUATION_REQUIRED",
  "S32_SUCCESSION_ENTROPY_BURDEN",
  "S32_SUCCESSION_EXPLAINABILITY_WEAK",
  "S32_FAIL_CLOSED_SUCCESSION_DEGRADATION",
  "S32_RECURSIVE_SUCCESSION_DEPENDENCY_CONFLICT",
  "S32_COLLAPSE_SENSITIVE_SUCCESSION_REJECTION",
  "S32_SUCCESSION_SURVIVABILITY_WEAKNESS",
  "S32_UNRESOLVED_SUCCESSION_DOCTRINE_CONFLICT",
  "S32_OPERATIONALLY_UNSUSTAINABLE_SUCCESSION",
  "S32_SUCCESSION_INSTABILITY_DETECTED",
  "S32_SUCCESSION_DEPENDENCY_CONCENTRATION",
  "S32_TRANSITION_SURVIVABILITY_WEAK",
  "S32_HANDOFF_DURABILITY_WEAK",
  "S32_KNOWLEDGE_TRANSFER_SURVIVABILITY_WEAK",
  "S32_MEMORY_COMPATIBILITY_WEAK",
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

function hasAnyInput(input: CountyGovernanceEntropyDoctrineSuccessionResilienceInput): boolean {
  return Object.values(input).some((value) => value !== undefined && value !== null);
}

function isHighRisk(level: SuccessionRiskLevel | null | undefined): boolean {
  return level === "high" || level === "critical";
}

function isWeakFailClosed(level: FailClosedSuccessionIntegrityLevel | null | undefined): boolean {
  return level === "absent" || level === "inconsistent" || level === "partial";
}

function isPoorCompatibility(level: SuccessionDoctrineCompatibilityLevel | null | undefined): boolean {
  return level === "poor" || level === "unknown";
}

function getReadinessClassification(params: {
  hasEvidence: boolean;
  successionBlocked: boolean;
  resilienceScore: number;
  sustainabilityScore: number;
  safetyScore: number;
}): CountyGovernanceEntropyDoctrineSuccessionReadinessClassification {
  if (!params.hasEvidence) {
    return "readiness_unverified";
  }

  if (params.successionBlocked) {
    return "blocked";
  }

  if (params.resilienceScore >= 88 && params.sustainabilityScore >= 78 && params.safetyScore >= 85) {
    return "ready";
  }

  if (params.resilienceScore >= 60 && params.sustainabilityScore >= 60 && params.safetyScore >= 60) {
    return "conditionally_ready";
  }

  return "not_ready";
}

function getSafetyClassification(params: {
  hasEvidence: boolean;
  successionUnsafe: boolean;
  collapseSensitiveSuccessionRejection: boolean;
  safetyScore: number;
}): CountyGovernanceEntropyDoctrineSuccessionSafetyClassification {
  if (!params.hasEvidence) {
    return "safety_unverified";
  }

  if (params.collapseSensitiveSuccessionRejection) {
    return "collapse_sensitive";
  }

  if (params.successionUnsafe || params.safetyScore < 35) {
    return "unsafe";
  }

  if (params.safetyScore >= 85) {
    return "safe";
  }

  return "guarded";
}

function classifySuccession(params: {
  hasEvidence: boolean;
  resilienceScore: number;
  sustainabilityScore: number;
  safetyScore: number;
  durabilityScore: number;
  transitionSurvivabilityScore: number;
  handoffDurabilityScore: number;
  knowledgeTransferSurvivabilityScore: number;
  successionInstabilityScore: number;
  dependencyConcentrationScore: number;
  explainabilityScore: number;
  failClosedIntegrityScore: number;
  continuationNeedScore: number;
  boundedReevaluationNeedScore: number;
  collapseExposureScore: number;
  operationalSustainabilityScore: number;
  successionBlocked: boolean;
  successionUnsafe: boolean;
  successionContinuationRequired: boolean;
  boundedSuccessionReevaluationRequired: boolean;
  collapseSensitiveSuccessionRejection: boolean;
  failClosedSuccessionDegradation: boolean;
  superficialSuccessionResilience: boolean;
  recursiveSuccessionDependencyConflict: boolean;
  successionSurvivabilityWeakness: boolean;
  unresolvedSuccessionDoctrineConflict: boolean;
  operationallyUnsustainableSuccession: boolean;
}): CountyGovernanceEntropyDoctrineSuccessionResilienceClassification {
  if (!params.hasEvidence) {
    return "succession_resilience_unverified";
  }

  if (params.collapseSensitiveSuccessionRejection) {
    return "collapse_sensitive_succession_rejection";
  }

  if (params.successionUnsafe) {
    return "succession_unsafe";
  }

  if (params.successionBlocked) {
    return "succession_blocked";
  }

  if (params.operationallyUnsustainableSuccession) {
    return "operationally_unsustainable_succession";
  }

  if (params.failClosedSuccessionDegradation) {
    return "fail_closed_succession_degradation";
  }

  if (params.recursiveSuccessionDependencyConflict) {
    return "recursive_succession_dependency_conflict";
  }

  if (params.unresolvedSuccessionDoctrineConflict) {
    return "unresolved_succession_doctrine_conflict";
  }

  if (params.successionSurvivabilityWeakness) {
    return "succession_survivability_weakness";
  }

  if (params.successionContinuationRequired) {
    return "succession_continuation_required";
  }

  if (params.boundedSuccessionReevaluationRequired) {
    return "bounded_succession_reevaluation_required";
  }

  if (params.explainabilityScore < 65) {
    return "succession_explainability_weakness";
  }

  if (params.successionInstabilityScore >= 50 || params.dependencyConcentrationScore >= 50) {
    return "succession_entropy_burden";
  }

  if (params.superficialSuccessionResilience) {
    return "superficial_succession_resilience";
  }

  if (
    params.resilienceScore >= 88 &&
    params.sustainabilityScore >= 78 &&
    params.safetyScore >= 85 &&
    params.durabilityScore >= 85 &&
    params.transitionSurvivabilityScore >= 84 &&
    params.handoffDurabilityScore >= 84 &&
    params.knowledgeTransferSurvivabilityScore >= 84 &&
    params.explainabilityScore >= 84 &&
    params.failClosedIntegrityScore >= 86 &&
    params.successionInstabilityScore <= 20 &&
    params.dependencyConcentrationScore <= 20 &&
    params.continuationNeedScore <= 20 &&
    params.boundedReevaluationNeedScore <= 20 &&
    params.collapseExposureScore <= 20 &&
    params.operationalSustainabilityScore >= 72
  ) {
    return "durable_succession_resilience";
  }

  if (
    params.resilienceScore >= 60 &&
    params.sustainabilityScore >= 60 &&
    params.safetyScore >= 60 &&
    params.durabilityScore >= 60 &&
    params.failClosedIntegrityScore >= 72
  ) {
    return "conditional_succession_resilience";
  }

  return "succession_unsustainable";
}

function buildWarnings(params: {
  hasEvidence: boolean;
  successionBlocked: boolean;
  successionUnsafe: boolean;
  successionContinuationRequired: boolean;
  boundedSuccessionReevaluationRequired: boolean;
  collapseSensitiveSuccessionRejection: boolean;
  failClosedSuccessionDegradation: boolean;
  superficialSuccessionResilience: boolean;
  recursiveSuccessionDependencyConflict: boolean;
  successionSurvivabilityWeakness: boolean;
  unresolvedSuccessionDoctrineConflict: boolean;
  operationallyUnsustainableSuccession: boolean;
  successionInstabilityScore: number;
  dependencyConcentrationScore: number;
  transitionSurvivabilityScore: number;
  handoffDurabilityScore: number;
  knowledgeTransferSurvivabilityScore: number;
  explainabilityScore: number;
  memoryCompatibilityScore: number;
}): CountyGovernanceEntropyDoctrineSuccessionResilienceWarningCode[] {
  const warnings = new Set<CountyGovernanceEntropyDoctrineSuccessionResilienceWarningCode>();

  if (!params.hasEvidence) {
    warnings.add("S32_SUCCESSION_RESILIENCE_UNVERIFIED");
  }

  if (params.successionBlocked) {
    warnings.add("S32_SUCCESSION_BLOCKED");
  }

  if (params.successionUnsafe) {
    warnings.add("S32_SUCCESSION_UNSAFE");
  }

  if (params.superficialSuccessionResilience) {
    warnings.add("S32_SUPERFICIAL_SUCCESSION_RESILIENCE");
  }

  if (params.successionContinuationRequired) {
    warnings.add("S32_SUCCESSION_CONTINUATION_REQUIRED");
  }

  if (params.boundedSuccessionReevaluationRequired) {
    warnings.add("S32_BOUNDED_SUCCESSION_REEVALUATION_REQUIRED");
  }

  if (params.successionInstabilityScore >= 50 || params.dependencyConcentrationScore >= 50) {
    warnings.add("S32_SUCCESSION_ENTROPY_BURDEN");
  }

  if (params.explainabilityScore < 65 && params.hasEvidence) {
    warnings.add("S32_SUCCESSION_EXPLAINABILITY_WEAK");
  }

  if (params.failClosedSuccessionDegradation) {
    warnings.add("S32_FAIL_CLOSED_SUCCESSION_DEGRADATION");
  }

  if (params.recursiveSuccessionDependencyConflict) {
    warnings.add("S32_RECURSIVE_SUCCESSION_DEPENDENCY_CONFLICT");
  }

  if (params.collapseSensitiveSuccessionRejection) {
    warnings.add("S32_COLLAPSE_SENSITIVE_SUCCESSION_REJECTION");
  }

  if (params.successionSurvivabilityWeakness) {
    warnings.add("S32_SUCCESSION_SURVIVABILITY_WEAKNESS");
  }

  if (params.unresolvedSuccessionDoctrineConflict) {
    warnings.add("S32_UNRESOLVED_SUCCESSION_DOCTRINE_CONFLICT");
  }

  if (params.operationallyUnsustainableSuccession) {
    warnings.add("S32_OPERATIONALLY_UNSUSTAINABLE_SUCCESSION");
  }

  if (params.successionInstabilityScore >= 50) {
    warnings.add("S32_SUCCESSION_INSTABILITY_DETECTED");
  }

  if (params.dependencyConcentrationScore >= 50) {
    warnings.add("S32_SUCCESSION_DEPENDENCY_CONCENTRATION");
  }

  if (params.transitionSurvivabilityScore < 65 && params.hasEvidence) {
    warnings.add("S32_TRANSITION_SURVIVABILITY_WEAK");
  }

  if (params.handoffDurabilityScore < 65 && params.hasEvidence) {
    warnings.add("S32_HANDOFF_DURABILITY_WEAK");
  }

  if (params.knowledgeTransferSurvivabilityScore < 65 && params.hasEvidence) {
    warnings.add("S32_KNOWLEDGE_TRANSFER_SURVIVABILITY_WEAK");
  }

  if (params.memoryCompatibilityScore < 60 && params.hasEvidence) {
    warnings.add("S32_MEMORY_COMPATIBILITY_WEAK");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function buildExplainability(params: {
  hasEvidence: boolean;
  classification: CountyGovernanceEntropyDoctrineSuccessionResilienceClassification;
  warningCodes: CountyGovernanceEntropyDoctrineSuccessionResilienceWarningCode[];
  resilienceScore: number;
  sustainabilityScore: number;
  safetyScore: number;
  durabilityScore: number;
  transitionSurvivabilityScore: number;
  handoffDurabilityScore: number;
  knowledgeTransferSurvivabilityScore: number;
  successionInstabilityScore: number;
  dependencyConcentrationScore: number;
  failClosedIntegrityScore: number;
  boundedReevaluationNeedScore: number;
  continuationNeedScore: number;
  reevaluationEvidenceCount: number;
}): CountyGovernanceEntropyDoctrineSuccessionResilienceExplainability {
  return {
    summary: params.hasEvidence
      ? `S32 classified succession resilience as ${params.classification}.`
      : "S32 classified succession resilience as unverified because no caller-supplied evidence was provided.",
    resilienceDrivers: [`succession resilience score: ${params.resilienceScore}`],
    sustainabilityDrivers: [`succession sustainability score: ${params.sustainabilityScore}`],
    safetyDrivers: [`succession safety score: ${params.safetyScore}`],
    durabilityDrivers: [`succession durability score: ${params.durabilityScore}`],
    transitionDrivers: [`transition survivability score: ${params.transitionSurvivabilityScore}`],
    handoffDrivers: [`handoff durability score: ${params.handoffDurabilityScore}`],
    knowledgeTransferDrivers: [`knowledge transfer survivability score: ${params.knowledgeTransferSurvivabilityScore}`],
    instabilityDrivers: [`succession instability score: ${params.successionInstabilityScore}`],
    dependencyDrivers: [`succession dependency concentration score: ${params.dependencyConcentrationScore}`],
    reevaluationDrivers: [
      `bounded succession reevaluation need score: ${params.boundedReevaluationNeedScore}`,
      `reevaluation evidence count: ${params.reevaluationEvidenceCount}`,
    ],
    conflictDrivers: [
      `succession continuation need score: ${params.continuationNeedScore}`,
      `succession instability pressure score: ${params.successionInstabilityScore}`,
    ],
    failClosedDrivers: [`fail-closed succession integrity score: ${params.failClosedIntegrityScore}`],
    warningDerivation: params.warningCodes.map((warning) => `${warning} derived from deterministic S32 thresholds.`),
    deterministicRulesApplied: [
      "Pure caller-input-only succession resilience modeling.",
      "Fixed ordinal maps and bounded 0-100 scores.",
      "Stable warning-code ordering.",
      "Explicit succession precedence ordering.",
      "No runtime, provider, database, network, clock, filesystem, or environment dependency.",
    ],
  };
}

export function evaluateCountyGovernanceEntropyDoctrineSuccessionResilience(
  input: CountyGovernanceEntropyDoctrineSuccessionResilienceInput = {},
): CountyGovernanceEntropyDoctrineSuccessionResilienceResult {
  const hasEvidence = hasAnyInput(input);

  const transitionEventCount = clampCount(input.transitionEventCount);
  const handoffEventCount = clampCount(input.handoffEventCount);
  const knowledgeTransferEventCount = clampCount(input.knowledgeTransferEventCount);
  const unresolvedDoctrineConflictCount = clampCount(input.unresolvedDoctrineConflictCount);
  const reevaluationEvidenceCount = clampCount(input.reevaluationEvidenceCount);
  const failClosedDegradationCount = clampCount(input.failClosedDegradationCount);
  const explainabilityWeaknessCount = clampCount(input.explainabilityWeaknessCount);
  const recursiveDependencyEventCount = clampCount(input.recursiveDependencyEventCount);
  const successionInstabilityEventCount = clampCount(input.successionInstabilityEventCount);
  const dependencyConcentrationEventCount = clampCount(input.dependencyConcentrationEventCount);

  const resilienceScore = resilienceScores[input.successionResilienceLevel ?? "unknown"];
  const sustainabilityScore = sustainabilityScores[input.successionSustainabilityLevel ?? "unknown"];
  const safetyScore = safetyScores[input.successionSafetyLevel ?? "unknown"];
  const durabilityScore = durabilityScores[input.successionDurabilityLevel ?? "unknown"];
  const transitionSurvivabilityScore = Math.max(
    transitionScores[input.transitionSurvivabilityLevel ?? "unknown"],
    transitionEventCount > 0 ? 40 : 0,
  );
  const handoffDurabilityScore = Math.max(
    handoffScores[input.handoffDurabilityLevel ?? "unknown"],
    handoffEventCount > 0 ? 40 : 0,
  );
  const knowledgeTransferSurvivabilityScore = Math.max(
    knowledgeTransferScores[input.knowledgeTransferSurvivabilityLevel ?? "unknown"],
    knowledgeTransferEventCount > 0 ? 40 : 0,
  );
  const successionInstabilityScore = Math.max(
    riskScores[input.successionInstabilityLevel ?? "none"],
    successionInstabilityEventCount > 0 ? 50 : 0,
  );
  const dependencyConcentrationScore = Math.max(
    riskScores[input.successionDependencyConcentrationLevel ?? "none"],
    dependencyConcentrationEventCount > 0 ? 50 : 0,
  );
  const explainabilityScore = explainabilityScores[input.successionExplainabilityLevel ?? "opaque"];
  const failClosedIntegrityScore = failClosedScores[input.failClosedSuccessionIntegrityLevel ?? "absent"];
  const continuationNeedScore = riskScores[input.successionContinuationNeedLevel ?? "none"];
  const boundedReevaluationNeedScore = Math.max(
    riskScores[input.boundedSuccessionReevaluationNeedLevel ?? "none"],
    reevaluationEvidenceCount < 1 && hasEvidence ? 50 : 0,
  );
  const collapseExposureScore = riskScores[input.collapseExposureLevel ?? "none"];
  const memoryCompatibilityScore = compatibilityScores[input.memoryCompatibilityLevel ?? "unknown"];
  const stewardshipCompatibilityScore = compatibilityScores[input.stewardshipCompatibilityLevel ?? "unknown"];
  const oversightCompatibilityScore = compatibilityScores[input.oversightCompatibilityLevel ?? "unknown"];
  const maintenanceCompatibilityScore = compatibilityScores[input.maintenanceCompatibilityLevel ?? "unknown"];
  const finalityCompatibilityScore = compatibilityScores[input.finalityCompatibilityLevel ?? "unknown"];
  const survivabilityCompatibilityScore = compatibilityScores[input.survivabilityCompatibilityLevel ?? "unknown"];
  const operationalSustainabilityScore =
    operationalSustainabilityScores[input.operationalSuccessionSustainabilityLevel ?? "unknown"];

  const failClosedSuccessionDegradation =
    isWeakFailClosed(input.failClosedSuccessionIntegrityLevel) || failClosedDegradationCount > 0;

  const recursiveSuccessionDependencyConflict =
    isHighRisk(input.recursiveSuccessionDependencyLevel) || recursiveDependencyEventCount > 0;

  const successionSurvivabilityWeakness =
    isPoorCompatibility(input.survivabilityCompatibilityLevel) ||
    (survivabilityCompatibilityScore <= 40 && continuationNeedScore >= 50);

  const unresolvedSuccessionDoctrineConflict =
    unresolvedDoctrineConflictCount > 0 ||
    memoryCompatibilityScore <= 10 ||
    stewardshipCompatibilityScore <= 10 ||
    oversightCompatibilityScore <= 10 ||
    maintenanceCompatibilityScore <= 10 ||
    finalityCompatibilityScore <= 10 ||
    survivabilityCompatibilityScore <= 10;

  const operationallyUnsustainableSuccession =
    input.operationalSuccessionSustainabilityLevel === "unsustainable" || operationalSustainabilityScore <= 5;

  const collapseSensitiveSuccessionRejection =
    isHighRisk(input.collapseExposureLevel) ||
    (collapseExposureScore >= 50 &&
      (successionInstabilityScore >= 78 ||
        dependencyConcentrationScore >= 78 ||
        handoffDurabilityScore < 65 ||
        knowledgeTransferSurvivabilityScore < 65 ||
        memoryCompatibilityScore < 60 ||
        failClosedSuccessionDegradation ||
        recursiveSuccessionDependencyConflict ||
        unresolvedSuccessionDoctrineConflict));

  const successionUnsafe =
    input.successionSafetyLevel === "unsafe" ||
    safetyScore <= 5 ||
    collapseExposureScore >= 100 ||
    (collapseExposureScore >= 78 && (successionInstabilityScore >= 78 || dependencyConcentrationScore >= 78));

  const successionBlocked =
    failClosedSuccessionDegradation ||
    recursiveSuccessionDependencyConflict ||
    operationallyUnsustainableSuccession ||
    unresolvedSuccessionDoctrineConflict ||
    (memoryCompatibilityScore <= 10 && stewardshipCompatibilityScore <= 10) ||
    (resilienceScore < 35 && continuationNeedScore >= 78);

  const boundedSuccessionReevaluationRequired =
    !successionUnsafe &&
    !collapseSensitiveSuccessionRejection &&
    !successionBlocked &&
    (boundedReevaluationNeedScore >= 50 ||
      successionInstabilityScore >= 50 ||
      dependencyConcentrationScore >= 50 ||
      input.transitionSurvivabilityLevel === "conditional" ||
      input.transitionSurvivabilityLevel === "partial" ||
      input.handoffDurabilityLevel === "conditional" ||
      input.handoffDurabilityLevel === "partial" ||
      input.knowledgeTransferSurvivabilityLevel === "conditional" ||
      input.knowledgeTransferSurvivabilityLevel === "partial" ||
      memoryCompatibilityScore < 96 ||
      stewardshipCompatibilityScore < 96 ||
      oversightCompatibilityScore < 96 ||
      maintenanceCompatibilityScore < 96 ||
      finalityCompatibilityScore < 96 ||
      survivabilityCompatibilityScore < 96);

  const successionContinuationRequired =
    !successionUnsafe &&
    !collapseSensitiveSuccessionRejection &&
    !successionBlocked &&
    (continuationNeedScore >= 50 ||
      memoryCompatibilityScore < 60 ||
      stewardshipCompatibilityScore < 60 ||
      oversightCompatibilityScore < 60 ||
      maintenanceCompatibilityScore < 60 ||
      finalityCompatibilityScore < 60 ||
      survivabilityCompatibilityScore < 60);

  const superficialSuccessionResilience =
    resilienceScore >= 72 &&
    (explainabilityScore < 65 ||
      failClosedIntegrityScore < 72 ||
      handoffDurabilityScore < 65 ||
      knowledgeTransferSurvivabilityScore < 65 ||
      reevaluationEvidenceCount < 1 ||
      explainabilityWeaknessCount > 0);

  const warningCodes = buildWarnings({
    hasEvidence,
    successionBlocked,
    successionUnsafe,
    successionContinuationRequired,
    boundedSuccessionReevaluationRequired,
    collapseSensitiveSuccessionRejection,
    failClosedSuccessionDegradation,
    superficialSuccessionResilience,
    recursiveSuccessionDependencyConflict,
    successionSurvivabilityWeakness,
    unresolvedSuccessionDoctrineConflict,
    operationallyUnsustainableSuccession,
    successionInstabilityScore,
    dependencyConcentrationScore,
    transitionSurvivabilityScore,
    handoffDurabilityScore,
    knowledgeTransferSurvivabilityScore,
    explainabilityScore,
    memoryCompatibilityScore,
  });

  const successionResilienceClassification = classifySuccession({
    hasEvidence,
    resilienceScore,
    sustainabilityScore,
    safetyScore,
    durabilityScore,
    transitionSurvivabilityScore,
    handoffDurabilityScore,
    knowledgeTransferSurvivabilityScore,
    successionInstabilityScore,
    dependencyConcentrationScore,
    explainabilityScore,
    failClosedIntegrityScore,
    continuationNeedScore,
    boundedReevaluationNeedScore,
    collapseExposureScore,
    operationalSustainabilityScore,
    successionBlocked,
    successionUnsafe,
    successionContinuationRequired,
    boundedSuccessionReevaluationRequired,
    collapseSensitiveSuccessionRejection,
    failClosedSuccessionDegradation,
    superficialSuccessionResilience,
    recursiveSuccessionDependencyConflict,
    successionSurvivabilityWeakness,
    unresolvedSuccessionDoctrineConflict,
    operationallyUnsustainableSuccession,
  });

  return {
    successionResilienceClassification,
    successionReadinessClassification: getReadinessClassification({
      hasEvidence,
      successionBlocked,
      resilienceScore,
      sustainabilityScore,
      safetyScore,
    }),
    successionSafetyClassification: getSafetyClassification({
      hasEvidence,
      successionUnsafe,
      collapseSensitiveSuccessionRejection,
      safetyScore,
    }),
    resilienceScore: clampScore(resilienceScore),
    sustainabilityScore: clampScore(sustainabilityScore),
    safetyScore: clampScore(safetyScore),
    durabilityScore: clampScore(durabilityScore),
    transitionSurvivabilityScore: clampScore(transitionSurvivabilityScore),
    handoffDurabilityScore: clampScore(handoffDurabilityScore),
    knowledgeTransferSurvivabilityScore: clampScore(knowledgeTransferSurvivabilityScore),
    successionInstabilityScore: clampScore(successionInstabilityScore),
    dependencyConcentrationScore: clampScore(dependencyConcentrationScore),
    explainabilityScore: clampScore(explainabilityScore),
    failClosedIntegrityScore: clampScore(failClosedIntegrityScore),
    continuationNeedScore: clampScore(continuationNeedScore),
    boundedReevaluationNeedScore: clampScore(boundedReevaluationNeedScore),
    collapseExposureScore: clampScore(collapseExposureScore),
    operationalSustainabilityScore: clampScore(operationalSustainabilityScore),
    successionBlocked,
    successionUnsafe,
    successionContinuationRequired,
    boundedSuccessionReevaluationRequired,
    collapseSensitiveSuccessionRejection,
    failClosedSuccessionDegradation,
    superficialSuccessionResilience,
    recursiveSuccessionDependencyConflict,
    successionSurvivabilityWeakness,
    unresolvedSuccessionDoctrineConflict,
    operationallyUnsustainableSuccession,
    warningCodes,
    explainability: buildExplainability({
      hasEvidence,
      classification: successionResilienceClassification,
      warningCodes,
      resilienceScore,
      sustainabilityScore,
      safetyScore,
      durabilityScore,
      transitionSurvivabilityScore,
      handoffDurabilityScore,
      knowledgeTransferSurvivabilityScore,
      successionInstabilityScore,
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
