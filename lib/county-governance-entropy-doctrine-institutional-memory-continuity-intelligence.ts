export type InstitutionalMemoryContinuityLevel =
  | "unknown"
  | "broken"
  | "fragile"
  | "conditional"
  | "stable"
  | "durable"
  | "institutional";

export type MemorySustainabilityLevel =
  | "unknown"
  | "unsustainable"
  | "strained"
  | "conditional"
  | "sustainable"
  | "durable"
  | "institutional";

export type MemorySafetyLevel = "unknown" | "unsafe" | "risky" | "guarded" | "safe" | "institutional";

export type MemoryDurabilityLevel = "unknown" | "fragile" | "temporary" | "stable" | "durable" | "institutional";

export type MemoryRiskLevel = "none" | "low" | "moderate" | "high" | "critical";

export type KnowledgeTransferDurabilityLevel =
  | "unknown"
  | "weak"
  | "partial"
  | "conditional"
  | "strong"
  | "institutional";

export type ContextPreservationLevel =
  | "unknown"
  | "weak"
  | "partial"
  | "conditional"
  | "strong"
  | "institutional";

export type MemoryExplainabilityLevel = "opaque" | "partial" | "adequate" | "strong" | "institutional";

export type FailClosedMemoryIntegrityLevel =
  | "absent"
  | "inconsistent"
  | "partial"
  | "stable"
  | "durable"
  | "institutional";

export type MemoryDoctrineCompatibilityLevel =
  | "unknown"
  | "poor"
  | "strained"
  | "conditional"
  | "compatible"
  | "durable";

export type OperationalMemorySustainabilityLevel =
  | "unknown"
  | "unsustainable"
  | "strained"
  | "viable"
  | "durable"
  | "institutional";

export type CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityClassification =
  | "durable_institutional_memory_continuity"
  | "conditional_institutional_memory_continuity"
  | "superficial_institutional_memory_continuity"
  | "institutional_memory_unsustainable"
  | "institutional_memory_blocked"
  | "institutional_memory_unsafe"
  | "institutional_memory_continuation_required"
  | "institutional_memory_entropy_burden"
  | "institutional_memory_explainability_weakness"
  | "fail_closed_memory_degradation"
  | "recursive_memory_dependency_conflict"
  | "collapse_sensitive_memory_rejection"
  | "bounded_memory_reevaluation_required"
  | "institutional_memory_survivability_weakness"
  | "unresolved_memory_doctrine_conflict"
  | "operationally_unsustainable_memory"
  | "institutional_memory_continuity_unverified";

export type CountyGovernanceEntropyDoctrineInstitutionalMemoryReadinessClassification =
  | "ready"
  | "conditionally_ready"
  | "not_ready"
  | "blocked"
  | "readiness_unverified";

export type CountyGovernanceEntropyDoctrineInstitutionalMemorySafetyClassification =
  | "safe"
  | "guarded"
  | "unsafe"
  | "collapse_sensitive"
  | "safety_unverified";

export type CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityWarningCode =
  | "S31_INSTITUTIONAL_MEMORY_CONTINUITY_UNVERIFIED"
  | "S31_INSTITUTIONAL_MEMORY_BLOCKED"
  | "S31_INSTITUTIONAL_MEMORY_UNSAFE"
  | "S31_SUPERFICIAL_INSTITUTIONAL_MEMORY_CONTINUITY"
  | "S31_MEMORY_CONTINUATION_REQUIRED"
  | "S31_BOUNDED_MEMORY_REEVALUATION_REQUIRED"
  | "S31_INSTITUTIONAL_MEMORY_ENTROPY_BURDEN"
  | "S31_MEMORY_EXPLAINABILITY_WEAK"
  | "S31_FAIL_CLOSED_MEMORY_DEGRADATION"
  | "S31_RECURSIVE_MEMORY_DEPENDENCY_CONFLICT"
  | "S31_COLLAPSE_SENSITIVE_MEMORY_REJECTION"
  | "S31_MEMORY_SURVIVABILITY_WEAKNESS"
  | "S31_UNRESOLVED_MEMORY_DOCTRINE_CONFLICT"
  | "S31_OPERATIONALLY_UNSUSTAINABLE_MEMORY"
  | "S31_MEMORY_DECAY_DETECTED"
  | "S31_MEMORY_DEPENDENCY_CONCENTRATION"
  | "S31_KNOWLEDGE_TRANSFER_WEAK"
  | "S31_CONTEXT_PRESERVATION_WEAK"
  | "S31_STEWARDSHIP_COMPATIBILITY_WEAK";

export interface CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityInput {
  institutionalMemoryContinuityLevel?: InstitutionalMemoryContinuityLevel | null;
  memorySustainabilityLevel?: MemorySustainabilityLevel | null;
  memorySafetyLevel?: MemorySafetyLevel | null;
  memoryDurabilityLevel?: MemoryDurabilityLevel | null;
  knowledgeTransferDurabilityLevel?: KnowledgeTransferDurabilityLevel | null;
  contextPreservationLevel?: ContextPreservationLevel | null;
  memoryDecayLevel?: MemoryRiskLevel | null;
  memoryDependencyConcentrationLevel?: MemoryRiskLevel | null;
  memoryExplainabilityLevel?: MemoryExplainabilityLevel | null;
  failClosedMemoryIntegrityLevel?: FailClosedMemoryIntegrityLevel | null;
  memoryContinuationNeedLevel?: MemoryRiskLevel | null;
  boundedMemoryReevaluationNeedLevel?: MemoryRiskLevel | null;
  recursiveMemoryDependencyLevel?: MemoryRiskLevel | null;
  collapseExposureLevel?: MemoryRiskLevel | null;
  stewardshipCompatibilityLevel?: MemoryDoctrineCompatibilityLevel | null;
  oversightCompatibilityLevel?: MemoryDoctrineCompatibilityLevel | null;
  maintenanceCompatibilityLevel?: MemoryDoctrineCompatibilityLevel | null;
  finalityCompatibilityLevel?: MemoryDoctrineCompatibilityLevel | null;
  survivabilityCompatibilityLevel?: MemoryDoctrineCompatibilityLevel | null;
  operationalMemorySustainabilityLevel?: OperationalMemorySustainabilityLevel | null;
  memoryCycleCount?: number | null;
  knowledgeTransferEventCount?: number | null;
  contextHandoffEventCount?: number | null;
  unresolvedDoctrineConflictCount?: number | null;
  reevaluationEvidenceCount?: number | null;
  failClosedDegradationCount?: number | null;
  explainabilityWeaknessCount?: number | null;
  recursiveDependencyEventCount?: number | null;
  memoryDecayEventCount?: number | null;
  dependencyConcentrationEventCount?: number | null;
}

export interface CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityExplainability {
  summary: string;
  continuityDrivers: string[];
  sustainabilityDrivers: string[];
  safetyDrivers: string[];
  durabilityDrivers: string[];
  knowledgeTransferDrivers: string[];
  contextPreservationDrivers: string[];
  memoryDecayDrivers: string[];
  dependencyDrivers: string[];
  reevaluationDrivers: string[];
  conflictDrivers: string[];
  failClosedDrivers: string[];
  warningDerivation: string[];
  deterministicRulesApplied: string[];
}

export interface CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityResult {
  institutionalMemoryContinuityClassification: CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityClassification;
  memoryReadinessClassification: CountyGovernanceEntropyDoctrineInstitutionalMemoryReadinessClassification;
  memorySafetyClassification: CountyGovernanceEntropyDoctrineInstitutionalMemorySafetyClassification;
  continuityScore: number;
  sustainabilityScore: number;
  safetyScore: number;
  durabilityScore: number;
  knowledgeTransferScore: number;
  contextPreservationScore: number;
  memoryDecayScore: number;
  dependencyConcentrationScore: number;
  explainabilityScore: number;
  failClosedIntegrityScore: number;
  continuationNeedScore: number;
  boundedReevaluationNeedScore: number;
  collapseExposureScore: number;
  operationalSustainabilityScore: number;
  institutionalMemoryBlocked: boolean;
  institutionalMemoryUnsafe: boolean;
  memoryContinuationRequired: boolean;
  boundedMemoryReevaluationRequired: boolean;
  collapseSensitiveMemoryRejection: boolean;
  failClosedMemoryDegradation: boolean;
  superficialInstitutionalMemoryContinuity: boolean;
  recursiveMemoryDependencyConflict: boolean;
  institutionalMemorySurvivabilityWeakness: boolean;
  unresolvedMemoryDoctrineConflict: boolean;
  operationallyUnsustainableMemory: boolean;
  warningCodes: CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityWarningCode[];
  explainability: CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityExplainability;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const continuityScores: Record<InstitutionalMemoryContinuityLevel, number> = {
  unknown: 0,
  broken: 5,
  fragile: 25,
  conditional: 60,
  stable: 72,
  durable: 88,
  institutional: 96,
};

const sustainabilityScores: Record<MemorySustainabilityLevel, number> = {
  unknown: 0,
  unsustainable: 5,
  strained: 35,
  conditional: 60,
  sustainable: 78,
  durable: 88,
  institutional: 96,
};

const safetyScores: Record<MemorySafetyLevel, number> = {
  unknown: 0,
  unsafe: 5,
  risky: 35,
  guarded: 60,
  safe: 85,
  institutional: 96,
};

const durabilityScores: Record<MemoryDurabilityLevel, number> = {
  unknown: 0,
  fragile: 15,
  temporary: 35,
  stable: 65,
  durable: 85,
  institutional: 96,
};

const riskScores: Record<MemoryRiskLevel, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const knowledgeTransferScores: Record<KnowledgeTransferDurabilityLevel, number> = {
  unknown: 0,
  weak: 15,
  partial: 40,
  conditional: 60,
  strong: 84,
  institutional: 96,
};

const contextPreservationScores: Record<ContextPreservationLevel, number> = {
  unknown: 0,
  weak: 15,
  partial: 40,
  conditional: 60,
  strong: 84,
  institutional: 96,
};

const explainabilityScores: Record<MemoryExplainabilityLevel, number> = {
  opaque: 0,
  partial: 38,
  adequate: 65,
  strong: 84,
  institutional: 96,
};

const failClosedScores: Record<FailClosedMemoryIntegrityLevel, number> = {
  absent: 0,
  inconsistent: 25,
  partial: 55,
  stable: 72,
  durable: 86,
  institutional: 96,
};

const compatibilityScores: Record<MemoryDoctrineCompatibilityLevel, number> = {
  unknown: 0,
  poor: 10,
  strained: 40,
  conditional: 60,
  compatible: 82,
  durable: 96,
};

const operationalSustainabilityScores: Record<OperationalMemorySustainabilityLevel, number> = {
  unknown: 0,
  unsustainable: 5,
  strained: 45,
  viable: 72,
  durable: 88,
  institutional: 96,
};

const warningOrder: CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityWarningCode[] = [
  "S31_INSTITUTIONAL_MEMORY_CONTINUITY_UNVERIFIED",
  "S31_INSTITUTIONAL_MEMORY_BLOCKED",
  "S31_INSTITUTIONAL_MEMORY_UNSAFE",
  "S31_SUPERFICIAL_INSTITUTIONAL_MEMORY_CONTINUITY",
  "S31_MEMORY_CONTINUATION_REQUIRED",
  "S31_BOUNDED_MEMORY_REEVALUATION_REQUIRED",
  "S31_INSTITUTIONAL_MEMORY_ENTROPY_BURDEN",
  "S31_MEMORY_EXPLAINABILITY_WEAK",
  "S31_FAIL_CLOSED_MEMORY_DEGRADATION",
  "S31_RECURSIVE_MEMORY_DEPENDENCY_CONFLICT",
  "S31_COLLAPSE_SENSITIVE_MEMORY_REJECTION",
  "S31_MEMORY_SURVIVABILITY_WEAKNESS",
  "S31_UNRESOLVED_MEMORY_DOCTRINE_CONFLICT",
  "S31_OPERATIONALLY_UNSUSTAINABLE_MEMORY",
  "S31_MEMORY_DECAY_DETECTED",
  "S31_MEMORY_DEPENDENCY_CONCENTRATION",
  "S31_KNOWLEDGE_TRANSFER_WEAK",
  "S31_CONTEXT_PRESERVATION_WEAK",
  "S31_STEWARDSHIP_COMPATIBILITY_WEAK",
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

function hasAnyInput(input: CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityInput): boolean {
  return Object.values(input).some((value) => value !== undefined && value !== null);
}

function isHighRisk(level: MemoryRiskLevel | null | undefined): boolean {
  return level === "high" || level === "critical";
}

function isWeakFailClosed(level: FailClosedMemoryIntegrityLevel | null | undefined): boolean {
  return level === "absent" || level === "inconsistent" || level === "partial";
}

function isPoorCompatibility(level: MemoryDoctrineCompatibilityLevel | null | undefined): boolean {
  return level === "poor" || level === "unknown";
}

function getReadinessClassification(params: {
  hasEvidence: boolean;
  institutionalMemoryBlocked: boolean;
  continuityScore: number;
  sustainabilityScore: number;
  safetyScore: number;
}): CountyGovernanceEntropyDoctrineInstitutionalMemoryReadinessClassification {
  if (!params.hasEvidence) {
    return "readiness_unverified";
  }

  if (params.institutionalMemoryBlocked) {
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
  institutionalMemoryUnsafe: boolean;
  collapseSensitiveMemoryRejection: boolean;
  safetyScore: number;
}): CountyGovernanceEntropyDoctrineInstitutionalMemorySafetyClassification {
  if (!params.hasEvidence) {
    return "safety_unverified";
  }

  if (params.collapseSensitiveMemoryRejection) {
    return "collapse_sensitive";
  }

  if (params.institutionalMemoryUnsafe || params.safetyScore < 35) {
    return "unsafe";
  }

  if (params.safetyScore >= 85) {
    return "safe";
  }

  return "guarded";
}

function classifyMemory(params: {
  hasEvidence: boolean;
  continuityScore: number;
  sustainabilityScore: number;
  safetyScore: number;
  durabilityScore: number;
  knowledgeTransferScore: number;
  contextPreservationScore: number;
  memoryDecayScore: number;
  dependencyConcentrationScore: number;
  explainabilityScore: number;
  failClosedIntegrityScore: number;
  continuationNeedScore: number;
  boundedReevaluationNeedScore: number;
  collapseExposureScore: number;
  operationalSustainabilityScore: number;
  institutionalMemoryBlocked: boolean;
  institutionalMemoryUnsafe: boolean;
  memoryContinuationRequired: boolean;
  boundedMemoryReevaluationRequired: boolean;
  collapseSensitiveMemoryRejection: boolean;
  failClosedMemoryDegradation: boolean;
  superficialInstitutionalMemoryContinuity: boolean;
  recursiveMemoryDependencyConflict: boolean;
  institutionalMemorySurvivabilityWeakness: boolean;
  unresolvedMemoryDoctrineConflict: boolean;
  operationallyUnsustainableMemory: boolean;
}): CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityClassification {
  if (!params.hasEvidence) {
    return "institutional_memory_continuity_unverified";
  }

  if (params.collapseSensitiveMemoryRejection) {
    return "collapse_sensitive_memory_rejection";
  }

  if (params.institutionalMemoryUnsafe) {
    return "institutional_memory_unsafe";
  }

  if (params.institutionalMemoryBlocked) {
    return "institutional_memory_blocked";
  }

  if (params.operationallyUnsustainableMemory) {
    return "operationally_unsustainable_memory";
  }

  if (params.failClosedMemoryDegradation) {
    return "fail_closed_memory_degradation";
  }

  if (params.recursiveMemoryDependencyConflict) {
    return "recursive_memory_dependency_conflict";
  }

  if (params.unresolvedMemoryDoctrineConflict) {
    return "unresolved_memory_doctrine_conflict";
  }

  if (params.institutionalMemorySurvivabilityWeakness) {
    return "institutional_memory_survivability_weakness";
  }

  if (params.memoryContinuationRequired) {
    return "institutional_memory_continuation_required";
  }

  if (params.boundedMemoryReevaluationRequired) {
    return "bounded_memory_reevaluation_required";
  }

  if (params.explainabilityScore < 65) {
    return "institutional_memory_explainability_weakness";
  }

  if (params.memoryDecayScore >= 50 || params.dependencyConcentrationScore >= 50) {
    return "institutional_memory_entropy_burden";
  }

  if (params.superficialInstitutionalMemoryContinuity) {
    return "superficial_institutional_memory_continuity";
  }

  if (
    params.continuityScore >= 88 &&
    params.sustainabilityScore >= 78 &&
    params.safetyScore >= 85 &&
    params.durabilityScore >= 85 &&
    params.knowledgeTransferScore >= 84 &&
    params.contextPreservationScore >= 84 &&
    params.explainabilityScore >= 84 &&
    params.failClosedIntegrityScore >= 86 &&
    params.memoryDecayScore <= 20 &&
    params.dependencyConcentrationScore <= 20 &&
    params.continuationNeedScore <= 20 &&
    params.boundedReevaluationNeedScore <= 20 &&
    params.collapseExposureScore <= 20 &&
    params.operationalSustainabilityScore >= 72
  ) {
    return "durable_institutional_memory_continuity";
  }

  if (
    params.continuityScore >= 60 &&
    params.sustainabilityScore >= 60 &&
    params.safetyScore >= 60 &&
    params.durabilityScore >= 60 &&
    params.failClosedIntegrityScore >= 72
  ) {
    return "conditional_institutional_memory_continuity";
  }

  return "institutional_memory_unsustainable";
}

function buildWarnings(params: {
  hasEvidence: boolean;
  institutionalMemoryBlocked: boolean;
  institutionalMemoryUnsafe: boolean;
  memoryContinuationRequired: boolean;
  boundedMemoryReevaluationRequired: boolean;
  collapseSensitiveMemoryRejection: boolean;
  failClosedMemoryDegradation: boolean;
  superficialInstitutionalMemoryContinuity: boolean;
  recursiveMemoryDependencyConflict: boolean;
  institutionalMemorySurvivabilityWeakness: boolean;
  unresolvedMemoryDoctrineConflict: boolean;
  operationallyUnsustainableMemory: boolean;
  memoryDecayScore: number;
  dependencyConcentrationScore: number;
  knowledgeTransferScore: number;
  contextPreservationScore: number;
  explainabilityScore: number;
  stewardshipCompatibilityScore: number;
}): CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityWarningCode[] {
  const warnings = new Set<CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityWarningCode>();

  if (!params.hasEvidence) {
    warnings.add("S31_INSTITUTIONAL_MEMORY_CONTINUITY_UNVERIFIED");
  }

  if (params.institutionalMemoryBlocked) {
    warnings.add("S31_INSTITUTIONAL_MEMORY_BLOCKED");
  }

  if (params.institutionalMemoryUnsafe) {
    warnings.add("S31_INSTITUTIONAL_MEMORY_UNSAFE");
  }

  if (params.superficialInstitutionalMemoryContinuity) {
    warnings.add("S31_SUPERFICIAL_INSTITUTIONAL_MEMORY_CONTINUITY");
  }

  if (params.memoryContinuationRequired) {
    warnings.add("S31_MEMORY_CONTINUATION_REQUIRED");
  }

  if (params.boundedMemoryReevaluationRequired) {
    warnings.add("S31_BOUNDED_MEMORY_REEVALUATION_REQUIRED");
  }

  if (params.memoryDecayScore >= 50 || params.dependencyConcentrationScore >= 50) {
    warnings.add("S31_INSTITUTIONAL_MEMORY_ENTROPY_BURDEN");
  }

  if (params.explainabilityScore < 65 && params.hasEvidence) {
    warnings.add("S31_MEMORY_EXPLAINABILITY_WEAK");
  }

  if (params.failClosedMemoryDegradation) {
    warnings.add("S31_FAIL_CLOSED_MEMORY_DEGRADATION");
  }

  if (params.recursiveMemoryDependencyConflict) {
    warnings.add("S31_RECURSIVE_MEMORY_DEPENDENCY_CONFLICT");
  }

  if (params.collapseSensitiveMemoryRejection) {
    warnings.add("S31_COLLAPSE_SENSITIVE_MEMORY_REJECTION");
  }

  if (params.institutionalMemorySurvivabilityWeakness) {
    warnings.add("S31_MEMORY_SURVIVABILITY_WEAKNESS");
  }

  if (params.unresolvedMemoryDoctrineConflict) {
    warnings.add("S31_UNRESOLVED_MEMORY_DOCTRINE_CONFLICT");
  }

  if (params.operationallyUnsustainableMemory) {
    warnings.add("S31_OPERATIONALLY_UNSUSTAINABLE_MEMORY");
  }

  if (params.memoryDecayScore >= 50) {
    warnings.add("S31_MEMORY_DECAY_DETECTED");
  }

  if (params.dependencyConcentrationScore >= 50) {
    warnings.add("S31_MEMORY_DEPENDENCY_CONCENTRATION");
  }

  if (params.knowledgeTransferScore < 65 && params.hasEvidence) {
    warnings.add("S31_KNOWLEDGE_TRANSFER_WEAK");
  }

  if (params.contextPreservationScore < 65 && params.hasEvidence) {
    warnings.add("S31_CONTEXT_PRESERVATION_WEAK");
  }

  if (params.stewardshipCompatibilityScore < 60 && params.hasEvidence) {
    warnings.add("S31_STEWARDSHIP_COMPATIBILITY_WEAK");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function buildExplainability(params: {
  hasEvidence: boolean;
  classification: CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityClassification;
  warningCodes: CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityWarningCode[];
  continuityScore: number;
  sustainabilityScore: number;
  safetyScore: number;
  durabilityScore: number;
  knowledgeTransferScore: number;
  contextPreservationScore: number;
  memoryDecayScore: number;
  dependencyConcentrationScore: number;
  failClosedIntegrityScore: number;
  boundedReevaluationNeedScore: number;
  continuationNeedScore: number;
  reevaluationEvidenceCount: number;
}): CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityExplainability {
  return {
    summary: params.hasEvidence
      ? `S31 classified institutional memory continuity as ${params.classification}.`
      : "S31 classified institutional memory continuity as unverified because no caller-supplied evidence was provided.",
    continuityDrivers: [`institutional memory continuity score: ${params.continuityScore}`],
    sustainabilityDrivers: [`memory sustainability score: ${params.sustainabilityScore}`],
    safetyDrivers: [`memory safety score: ${params.safetyScore}`],
    durabilityDrivers: [`memory durability score: ${params.durabilityScore}`],
    knowledgeTransferDrivers: [`knowledge transfer durability score: ${params.knowledgeTransferScore}`],
    contextPreservationDrivers: [`context preservation score: ${params.contextPreservationScore}`],
    memoryDecayDrivers: [`memory decay score: ${params.memoryDecayScore}`],
    dependencyDrivers: [`memory dependency concentration score: ${params.dependencyConcentrationScore}`],
    reevaluationDrivers: [
      `bounded memory reevaluation need score: ${params.boundedReevaluationNeedScore}`,
      `reevaluation evidence count: ${params.reevaluationEvidenceCount}`,
    ],
    conflictDrivers: [
      `memory continuation need score: ${params.continuationNeedScore}`,
      `memory decay pressure score: ${params.memoryDecayScore}`,
    ],
    failClosedDrivers: [`fail-closed memory integrity score: ${params.failClosedIntegrityScore}`],
    warningDerivation: params.warningCodes.map((warning) => `${warning} derived from deterministic S31 thresholds.`),
    deterministicRulesApplied: [
      "Pure caller-input-only institutional memory continuity modeling.",
      "Fixed ordinal maps and bounded 0-100 scores.",
      "Stable warning-code ordering.",
      "Explicit institutional memory precedence ordering.",
      "No runtime, provider, database, network, clock, filesystem, or environment dependency.",
    ],
  };
}

export function evaluateCountyGovernanceEntropyDoctrineInstitutionalMemoryContinuity(
  input: CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityInput = {},
): CountyGovernanceEntropyDoctrineInstitutionalMemoryContinuityResult {
  const hasEvidence = hasAnyInput(input);

  const knowledgeTransferEventCount = clampCount(input.knowledgeTransferEventCount);
  const contextHandoffEventCount = clampCount(input.contextHandoffEventCount);
  const unresolvedDoctrineConflictCount = clampCount(input.unresolvedDoctrineConflictCount);
  const reevaluationEvidenceCount = clampCount(input.reevaluationEvidenceCount);
  const failClosedDegradationCount = clampCount(input.failClosedDegradationCount);
  const explainabilityWeaknessCount = clampCount(input.explainabilityWeaknessCount);
  const recursiveDependencyEventCount = clampCount(input.recursiveDependencyEventCount);
  const memoryDecayEventCount = clampCount(input.memoryDecayEventCount);
  const dependencyConcentrationEventCount = clampCount(input.dependencyConcentrationEventCount);

  const continuityScore = continuityScores[input.institutionalMemoryContinuityLevel ?? "unknown"];
  const sustainabilityScore = sustainabilityScores[input.memorySustainabilityLevel ?? "unknown"];
  const safetyScore = safetyScores[input.memorySafetyLevel ?? "unknown"];
  const durabilityScore = durabilityScores[input.memoryDurabilityLevel ?? "unknown"];
  const knowledgeTransferScore = Math.max(
    knowledgeTransferScores[input.knowledgeTransferDurabilityLevel ?? "unknown"],
    knowledgeTransferEventCount > 0 ? 40 : 0,
  );
  const contextPreservationScore = Math.max(
    contextPreservationScores[input.contextPreservationLevel ?? "unknown"],
    contextHandoffEventCount > 0 ? 40 : 0,
  );
  const memoryDecayScore = Math.max(riskScores[input.memoryDecayLevel ?? "none"], memoryDecayEventCount > 0 ? 50 : 0);
  const dependencyConcentrationScore = Math.max(
    riskScores[input.memoryDependencyConcentrationLevel ?? "none"],
    dependencyConcentrationEventCount > 0 ? 50 : 0,
  );
  const explainabilityScore = explainabilityScores[input.memoryExplainabilityLevel ?? "opaque"];
  const failClosedIntegrityScore = failClosedScores[input.failClosedMemoryIntegrityLevel ?? "absent"];
  const continuationNeedScore = riskScores[input.memoryContinuationNeedLevel ?? "none"];
  const boundedReevaluationNeedScore = Math.max(
    riskScores[input.boundedMemoryReevaluationNeedLevel ?? "none"],
    reevaluationEvidenceCount < 1 && hasEvidence ? 50 : 0,
  );
  const recursiveDependencyScore = riskScores[input.recursiveMemoryDependencyLevel ?? "none"];
  const collapseExposureScore = riskScores[input.collapseExposureLevel ?? "none"];
  const stewardshipCompatibilityScore = compatibilityScores[input.stewardshipCompatibilityLevel ?? "unknown"];
  const oversightCompatibilityScore = compatibilityScores[input.oversightCompatibilityLevel ?? "unknown"];
  const maintenanceCompatibilityScore = compatibilityScores[input.maintenanceCompatibilityLevel ?? "unknown"];
  const finalityCompatibilityScore = compatibilityScores[input.finalityCompatibilityLevel ?? "unknown"];
  const survivabilityCompatibilityScore = compatibilityScores[input.survivabilityCompatibilityLevel ?? "unknown"];
  const operationalSustainabilityScore =
    operationalSustainabilityScores[input.operationalMemorySustainabilityLevel ?? "unknown"];

  const failClosedMemoryDegradation =
    isWeakFailClosed(input.failClosedMemoryIntegrityLevel) || failClosedDegradationCount > 0;

  const recursiveMemoryDependencyConflict =
    isHighRisk(input.recursiveMemoryDependencyLevel) || recursiveDependencyEventCount > 0;

  const institutionalMemorySurvivabilityWeakness =
    isPoorCompatibility(input.survivabilityCompatibilityLevel) ||
    (survivabilityCompatibilityScore <= 40 && continuationNeedScore >= 50);

  const unresolvedMemoryDoctrineConflict =
    unresolvedDoctrineConflictCount > 0 ||
    stewardshipCompatibilityScore <= 10 ||
    oversightCompatibilityScore <= 10 ||
    maintenanceCompatibilityScore <= 10 ||
    finalityCompatibilityScore <= 10 ||
    survivabilityCompatibilityScore <= 10;

  const operationallyUnsustainableMemory =
    input.operationalMemorySustainabilityLevel === "unsustainable" || operationalSustainabilityScore <= 5;

  const collapseSensitiveMemoryRejection =
    isHighRisk(input.collapseExposureLevel) ||
    (collapseExposureScore >= 50 &&
      (memoryDecayScore >= 78 ||
        dependencyConcentrationScore >= 78 ||
        knowledgeTransferScore < 65 ||
        contextPreservationScore < 65 ||
        failClosedMemoryDegradation ||
        recursiveMemoryDependencyConflict ||
        unresolvedMemoryDoctrineConflict));

  const institutionalMemoryUnsafe =
    input.memorySafetyLevel === "unsafe" ||
    safetyScore <= 5 ||
    collapseExposureScore >= 100 ||
    (collapseExposureScore >= 78 && (memoryDecayScore >= 78 || dependencyConcentrationScore >= 78));

  const institutionalMemoryBlocked =
    failClosedMemoryDegradation ||
    recursiveMemoryDependencyConflict ||
    operationallyUnsustainableMemory ||
    unresolvedMemoryDoctrineConflict ||
    (stewardshipCompatibilityScore <= 10 && oversightCompatibilityScore <= 10) ||
    (continuityScore < 35 && continuationNeedScore >= 78);

  const boundedMemoryReevaluationRequired =
    !institutionalMemoryUnsafe &&
    !collapseSensitiveMemoryRejection &&
    !institutionalMemoryBlocked &&
    (boundedReevaluationNeedScore >= 50 ||
      memoryDecayScore >= 50 ||
      dependencyConcentrationScore >= 50 ||
      input.knowledgeTransferDurabilityLevel === "conditional" ||
      input.knowledgeTransferDurabilityLevel === "partial" ||
      input.contextPreservationLevel === "conditional" ||
      input.contextPreservationLevel === "partial" ||
      stewardshipCompatibilityScore < 96 ||
      oversightCompatibilityScore < 96 ||
      maintenanceCompatibilityScore < 96 ||
      finalityCompatibilityScore < 96 ||
      survivabilityCompatibilityScore < 96);

  const memoryContinuationRequired =
    !institutionalMemoryUnsafe &&
    !collapseSensitiveMemoryRejection &&
    !institutionalMemoryBlocked &&
    (continuationNeedScore >= 50 ||
      stewardshipCompatibilityScore < 60 ||
      oversightCompatibilityScore < 60 ||
      maintenanceCompatibilityScore < 60 ||
      finalityCompatibilityScore < 60 ||
      survivabilityCompatibilityScore < 60);

  const superficialInstitutionalMemoryContinuity =
    continuityScore >= 72 &&
    (explainabilityScore < 65 ||
      failClosedIntegrityScore < 72 ||
      knowledgeTransferScore < 65 ||
      contextPreservationScore < 65 ||
      reevaluationEvidenceCount < 1 ||
      explainabilityWeaknessCount > 0);

  const warningCodes = buildWarnings({
    hasEvidence,
    institutionalMemoryBlocked,
    institutionalMemoryUnsafe,
    memoryContinuationRequired,
    boundedMemoryReevaluationRequired,
    collapseSensitiveMemoryRejection,
    failClosedMemoryDegradation,
    superficialInstitutionalMemoryContinuity,
    recursiveMemoryDependencyConflict,
    institutionalMemorySurvivabilityWeakness,
    unresolvedMemoryDoctrineConflict,
    operationallyUnsustainableMemory,
    memoryDecayScore,
    dependencyConcentrationScore,
    knowledgeTransferScore,
    contextPreservationScore,
    explainabilityScore,
    stewardshipCompatibilityScore,
  });

  const institutionalMemoryContinuityClassification = classifyMemory({
    hasEvidence,
    continuityScore,
    sustainabilityScore,
    safetyScore,
    durabilityScore,
    knowledgeTransferScore,
    contextPreservationScore,
    memoryDecayScore,
    dependencyConcentrationScore,
    explainabilityScore,
    failClosedIntegrityScore,
    continuationNeedScore,
    boundedReevaluationNeedScore,
    collapseExposureScore,
    operationalSustainabilityScore,
    institutionalMemoryBlocked,
    institutionalMemoryUnsafe,
    memoryContinuationRequired,
    boundedMemoryReevaluationRequired,
    collapseSensitiveMemoryRejection,
    failClosedMemoryDegradation,
    superficialInstitutionalMemoryContinuity,
    recursiveMemoryDependencyConflict,
    institutionalMemorySurvivabilityWeakness,
    unresolvedMemoryDoctrineConflict,
    operationallyUnsustainableMemory,
  });

  return {
    institutionalMemoryContinuityClassification,
    memoryReadinessClassification: getReadinessClassification({
      hasEvidence,
      institutionalMemoryBlocked,
      continuityScore,
      sustainabilityScore,
      safetyScore,
    }),
    memorySafetyClassification: getSafetyClassification({
      hasEvidence,
      institutionalMemoryUnsafe,
      collapseSensitiveMemoryRejection,
      safetyScore,
    }),
    continuityScore: clampScore(continuityScore),
    sustainabilityScore: clampScore(sustainabilityScore),
    safetyScore: clampScore(safetyScore),
    durabilityScore: clampScore(durabilityScore),
    knowledgeTransferScore: clampScore(knowledgeTransferScore),
    contextPreservationScore: clampScore(contextPreservationScore),
    memoryDecayScore: clampScore(memoryDecayScore),
    dependencyConcentrationScore: clampScore(dependencyConcentrationScore),
    explainabilityScore: clampScore(explainabilityScore),
    failClosedIntegrityScore: clampScore(failClosedIntegrityScore),
    continuationNeedScore: clampScore(continuationNeedScore),
    boundedReevaluationNeedScore: clampScore(boundedReevaluationNeedScore),
    collapseExposureScore: clampScore(collapseExposureScore),
    operationalSustainabilityScore: clampScore(operationalSustainabilityScore),
    institutionalMemoryBlocked,
    institutionalMemoryUnsafe,
    memoryContinuationRequired,
    boundedMemoryReevaluationRequired,
    collapseSensitiveMemoryRejection,
    failClosedMemoryDegradation,
    superficialInstitutionalMemoryContinuity,
    recursiveMemoryDependencyConflict,
    institutionalMemorySurvivabilityWeakness,
    unresolvedMemoryDoctrineConflict,
    operationallyUnsustainableMemory,
    warningCodes,
    explainability: buildExplainability({
      hasEvidence,
      classification: institutionalMemoryContinuityClassification,
      warningCodes,
      continuityScore,
      sustainabilityScore,
      safetyScore,
      durabilityScore,
      knowledgeTransferScore,
      contextPreservationScore,
      memoryDecayScore,
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
