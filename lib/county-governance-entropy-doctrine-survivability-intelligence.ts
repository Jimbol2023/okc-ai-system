export type DoctrineSurvivabilityLevel =
  | "unknown"
  | "broken"
  | "temporary"
  | "stable"
  | "durable"
  | "institutional";

export type SurvivabilitySustainabilityLevel =
  | "unknown"
  | "unsustainable"
  | "strained"
  | "sustainable"
  | "self_sustaining";

export type SurvivabilityRiskLevel =
  | "none"
  | "low"
  | "moderate"
  | "high"
  | "critical";

export type SurvivabilitySequencingCoherenceLevel =
  | "unknown"
  | "fragmented"
  | "fragile"
  | "stable"
  | "durable"
  | "institutional";

export type SurvivabilityExplainabilityLevel =
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

export type LongHorizonDoctrineSurvivabilityLevel =
  | "unproven"
  | "declining"
  | "recovering"
  | "resilient"
  | "durable"
  | "institutional";

export type SurvivabilityOperationalViabilityLevel =
  | "unknown"
  | "nonviable"
  | "degraded"
  | "viable"
  | "strong"
  | "institutional";

export type SurvivabilityReversibilityLevel =
  | "unknown"
  | "irreversible"
  | "difficult"
  | "partial"
  | "reversible";

export type CountyGovernanceEntropyDoctrineSurvivabilityClassification =
  | "institutional_doctrine_survivability"
  | "durable_doctrine_survivability"
  | "temporary_doctrine_survivability"
  | "recursive_survivability_dependency"
  | "entropy_burdened_survivability"
  | "survivability_fragmentation"
  | "survivability_amplification_instability"
  | "survivability_sequencing_instability"
  | "probabilistically_unstable_survivability"
  | "operationally_nonviable_survivability"
  | "fail_closed_survivability_degradation"
  | "irreversible_survivability_degradation"
  | "doctrine_survivability_unverified";

export type CountyGovernanceEntropyDoctrineSurvivabilityDurabilityClassification =
  | "durable_survivability"
  | "stable_survivability"
  | "temporary_survivability"
  | "fragile_survivability"
  | "collapse_sensitive_survivability"
  | "survivability_durability_unverified";

export type CountyGovernanceEntropyDoctrineSurvivabilityViabilityClassification =
  | "operationally_viable"
  | "conditionally_viable"
  | "degraded_viability"
  | "operationally_nonviable"
  | "survivability_viability_unverified";

export type CountyGovernanceEntropyDoctrineSurvivabilityWarningCode =
  | "S26_DOCTRINE_SURVIVABILITY_UNVERIFIED"
  | "S26_SURVIVABILITY_UNSUSTAINABLE"
  | "S26_SURVIVABILITY_AMPLIFIES_ENTROPY"
  | "S26_RECURSIVE_SURVIVABILITY_DEPENDENCY"
  | "S26_PROBABILISTIC_SURVIVABILITY_INSTABILITY"
  | "S26_OPERATIONALLY_NONVIABLE_SURVIVABILITY"
  | "S26_FAIL_CLOSED_SURVIVABILITY_DEGRADATION"
  | "S26_SURVIVABILITY_EXPLAINABILITY_DEGRADATION"
  | "S26_SURVIVABILITY_FRAGMENTATION"
  | "S26_SURVIVABILITY_SEQUENCING_INSTABILITY"
  | "S26_ENTROPY_BURDENED_SURVIVABILITY"
  | "S26_SURVIVABILITY_COLLAPSE_EXPOSURE"
  | "S26_SURVIVABILITY_SATURATION"
  | "S26_IRREVERSIBLE_SURVIVABILITY_DEGRADATION"
  | "S26_DOCTRINE_RESILIENCE_EXHAUSTION"
  | "S26_LONG_HORIZON_SURVIVABILITY_WEAK"
  | "S26_INSTITUTIONAL_DOCTRINE_SURVIVABILITY_NOT_PROVEN";

export interface CountyGovernanceEntropyDoctrineSurvivabilityInput {
  doctrineSurvivabilityLevel?: DoctrineSurvivabilityLevel | null;
  survivabilitySustainabilityLevel?: SurvivabilitySustainabilityLevel | null;
  survivabilityEntropyBurdenLevel?: SurvivabilityRiskLevel | null;
  survivabilityAmplificationRiskLevel?: SurvivabilityRiskLevel | null;
  recursiveSurvivabilityDependencyLevel?: SurvivabilityRiskLevel | null;
  survivabilitySequencingCoherenceLevel?: SurvivabilitySequencingCoherenceLevel | null;
  survivabilityFragmentationPressureLevel?: SurvivabilityRiskLevel | null;
  survivabilityExplainabilityLevel?: SurvivabilityExplainabilityLevel | null;
  failClosedSurvivabilityIntegrityLevel?: FailClosedSurvivabilityIntegrityLevel | null;
  survivabilityCollapseExposureLevel?: SurvivabilityRiskLevel | null;
  longHorizonDoctrineSurvivabilityLevel?: LongHorizonDoctrineSurvivabilityLevel | null;
  survivabilityOperationalViabilityLevel?: SurvivabilityOperationalViabilityLevel | null;
  doctrineResilienceExhaustionLevel?: SurvivabilityRiskLevel | null;
  survivabilitySaturationLevel?: SurvivabilityRiskLevel | null;
  survivabilityReversibilityLevel?: SurvivabilityReversibilityLevel | null;
  survivabilityCycleCount?: number | null;
  stabilizationDependencyCycleCount?: number | null;
  entropyAmplificationEventCount?: number | null;
  sequencingInstabilityEventCount?: number | null;
  fragmentationEventCount?: number | null;
  explainabilityDegradationCount?: number | null;
  failClosedDegradationCount?: number | null;
  recursiveDependencyGrowthCount?: number | null;
  saturationEventCount?: number | null;
}

export interface CountyGovernanceEntropyDoctrineSurvivabilityExplainability {
  summary: string;
  survivabilityDrivers: string[];
  sustainabilityDrivers: string[];
  entropyBurdenDrivers: string[];
  amplificationDrivers: string[];
  recursiveDependencyDrivers: string[];
  viabilityDrivers: string[];
  irreversibleDegradationDrivers: string[];
  failClosedDrivers: string[];
  warningDerivation: string[];
  deterministicRulesApplied: string[];
}

export interface CountyGovernanceEntropyDoctrineSurvivabilityResult {
  doctrineSurvivabilityClassification: CountyGovernanceEntropyDoctrineSurvivabilityClassification;
  durabilityClassification: CountyGovernanceEntropyDoctrineSurvivabilityDurabilityClassification;
  viabilityClassification: CountyGovernanceEntropyDoctrineSurvivabilityViabilityClassification;

  doctrineSurvivabilityScore: number;
  survivabilitySustainabilityScore: number;
  survivabilityEntropyBurdenScore: number;
  survivabilityAmplificationScore: number;
  recursiveDependencyScore: number;
  probabilisticInstabilityScore: number;
  operationalViabilityScore: number;
  failClosedSurvivabilityIntegrityScore: number;
  explainabilitySurvivabilityScore: number;
  irreversibleDegradationScore: number;

  survivabilityAmplificationDetected: boolean;
  recursiveSurvivabilityDependencyDetected: boolean;
  probabilisticallyUnstableSurvivabilityDetected: boolean;
  operationallyNonviableSurvivabilityDetected: boolean;
  survivabilityFragmentationDetected: boolean;
  survivabilitySequencingInstabilityDetected: boolean;
  failClosedSurvivabilityDegradationDetected: boolean;
  explainabilitySurvivabilityDegradationDetected: boolean;
  survivabilitySaturationDetected: boolean;
  irreversibleSurvivabilityDegradationDetected: boolean;
  sustainableSurvivabilityDetected: boolean;

  warningCodes: CountyGovernanceEntropyDoctrineSurvivabilityWarningCode[];
  explainability: CountyGovernanceEntropyDoctrineSurvivabilityExplainability;

  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const doctrineSurvivabilityScores: Record<DoctrineSurvivabilityLevel, number> = {
  unknown: 0,
  broken: 8,
  temporary: 30,
  stable: 70,
  durable: 88,
  institutional: 96,
};

const sustainabilityScores: Record<SurvivabilitySustainabilityLevel, number> = {
  unknown: 0,
  unsustainable: 10,
  strained: 45,
  sustainable: 78,
  self_sustaining: 96,
};

const riskScores: Record<SurvivabilityRiskLevel, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const sequencingScores: Record<SurvivabilitySequencingCoherenceLevel, number> = {
  unknown: 0,
  fragmented: 10,
  fragile: 42,
  stable: 72,
  durable: 88,
  institutional: 96,
};

const explainabilityScores: Record<SurvivabilityExplainabilityLevel, number> = {
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

const longHorizonScores: Record<LongHorizonDoctrineSurvivabilityLevel, number> = {
  unproven: 0,
  declining: 20,
  recovering: 55,
  resilient: 76,
  durable: 88,
  institutional: 96,
};

const viabilityScores: Record<SurvivabilityOperationalViabilityLevel, number> = {
  unknown: 0,
  nonviable: 5,
  degraded: 35,
  viable: 70,
  strong: 86,
  institutional: 96,
};

const reversibilityRiskScores: Record<SurvivabilityReversibilityLevel, number> = {
  unknown: 0,
  irreversible: 100,
  difficult: 70,
  partial: 40,
  reversible: 5,
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

function hasAnyInput(input: CountyGovernanceEntropyDoctrineSurvivabilityInput): boolean {
  return Object.values(input).some((value) => value !== undefined && value !== null);
}

function isHighRisk(level: SurvivabilityRiskLevel | null | undefined): boolean {
  return level === "high" || level === "critical";
}

function isWeakFailClosed(level: FailClosedSurvivabilityIntegrityLevel | null | undefined): boolean {
  return level === "absent" || level === "inconsistent" || level === "partial";
}

function isWeakExplainability(level: SurvivabilityExplainabilityLevel | null | undefined): boolean {
  return level === "opaque" || level === "partial";
}

function isWeakLongHorizon(level: LongHorizonDoctrineSurvivabilityLevel | null | undefined): boolean {
  return level === "unproven" || level === "declining";
}

function getDurabilityClassification(params: {
  hasEvidence: boolean;
  doctrineScore: number;
  collapseScore: number;
  sustainabilityScore: number;
  longHorizonScore: number;
}): CountyGovernanceEntropyDoctrineSurvivabilityDurabilityClassification {
  if (!params.hasEvidence) {
    return "survivability_durability_unverified";
  }

  if (params.collapseScore >= 78 || params.longHorizonScore <= 20) {
    return "collapse_sensitive_survivability";
  }

  if (params.doctrineScore < 35 || params.sustainabilityScore < 35) {
    return "fragile_survivability";
  }

  if (params.doctrineScore < 70 || params.sustainabilityScore < 65) {
    return "temporary_survivability";
  }

  if (params.doctrineScore >= 88 && params.sustainabilityScore >= 78 && params.longHorizonScore >= 76) {
    return "durable_survivability";
  }

  return "stable_survivability";
}

function getViabilityClassification(params: {
  hasEvidence: boolean;
  viabilityScore: number;
  probabilisticInstabilityScore: number;
}): CountyGovernanceEntropyDoctrineSurvivabilityViabilityClassification {
  if (!params.hasEvidence) {
    return "survivability_viability_unverified";
  }

  if (params.viabilityScore <= 10 || params.probabilisticInstabilityScore >= 85) {
    return "operationally_nonviable";
  }

  if (params.viabilityScore < 45 || params.probabilisticInstabilityScore >= 70) {
    return "degraded_viability";
  }

  if (params.viabilityScore < 75 || params.probabilisticInstabilityScore >= 50) {
    return "conditionally_viable";
  }

  return "operationally_viable";
}

function getWarningCodes(params: {
  hasEvidence: boolean;
  classification: CountyGovernanceEntropyDoctrineSurvivabilityClassification;
  sustainableSurvivabilityDetected: boolean;
  survivabilityAmplificationDetected: boolean;
  recursiveSurvivabilityDependencyDetected: boolean;
  probabilisticallyUnstableSurvivabilityDetected: boolean;
  operationallyNonviableSurvivabilityDetected: boolean;
  survivabilityFragmentationDetected: boolean;
  survivabilitySequencingInstabilityDetected: boolean;
  failClosedSurvivabilityDegradationDetected: boolean;
  explainabilitySurvivabilityDegradationDetected: boolean;
  survivabilitySaturationDetected: boolean;
  irreversibleSurvivabilityDegradationDetected: boolean;
  entropyBurdenScore: number;
  collapseExposureScore: number;
  doctrineResilienceExhaustionScore: number;
  longHorizonScore: number;
  sustainabilityScore: number;
}): CountyGovernanceEntropyDoctrineSurvivabilityWarningCode[] {
  const warnings = new Set<CountyGovernanceEntropyDoctrineSurvivabilityWarningCode>();

  if (!params.hasEvidence) {
    warnings.add("S26_DOCTRINE_SURVIVABILITY_UNVERIFIED");
  }

  if (params.sustainabilityScore <= 45 && params.hasEvidence) {
    warnings.add("S26_SURVIVABILITY_UNSUSTAINABLE");
  }

  if (params.survivabilityAmplificationDetected) {
    warnings.add("S26_SURVIVABILITY_AMPLIFIES_ENTROPY");
  }

  if (params.recursiveSurvivabilityDependencyDetected) {
    warnings.add("S26_RECURSIVE_SURVIVABILITY_DEPENDENCY");
  }

  if (params.probabilisticallyUnstableSurvivabilityDetected) {
    warnings.add("S26_PROBABILISTIC_SURVIVABILITY_INSTABILITY");
  }

  if (params.operationallyNonviableSurvivabilityDetected) {
    warnings.add("S26_OPERATIONALLY_NONVIABLE_SURVIVABILITY");
  }

  if (params.failClosedSurvivabilityDegradationDetected) {
    warnings.add("S26_FAIL_CLOSED_SURVIVABILITY_DEGRADATION");
  }

  if (params.explainabilitySurvivabilityDegradationDetected) {
    warnings.add("S26_SURVIVABILITY_EXPLAINABILITY_DEGRADATION");
  }

  if (params.survivabilityFragmentationDetected) {
    warnings.add("S26_SURVIVABILITY_FRAGMENTATION");
  }

  if (params.survivabilitySequencingInstabilityDetected) {
    warnings.add("S26_SURVIVABILITY_SEQUENCING_INSTABILITY");
  }

  if (params.entropyBurdenScore >= 78) {
    warnings.add("S26_ENTROPY_BURDENED_SURVIVABILITY");
  }

  if (params.collapseExposureScore >= 78) {
    warnings.add("S26_SURVIVABILITY_COLLAPSE_EXPOSURE");
  }

  if (params.survivabilitySaturationDetected) {
    warnings.add("S26_SURVIVABILITY_SATURATION");
  }

  if (params.irreversibleSurvivabilityDegradationDetected) {
    warnings.add("S26_IRREVERSIBLE_SURVIVABILITY_DEGRADATION");
  }

  if (params.doctrineResilienceExhaustionScore >= 78) {
    warnings.add("S26_DOCTRINE_RESILIENCE_EXHAUSTION");
  }

  if (params.longHorizonScore <= 20 && params.hasEvidence) {
    warnings.add("S26_LONG_HORIZON_SURVIVABILITY_WEAK");
  }

  if (params.classification !== "institutional_doctrine_survivability") {
    warnings.add("S26_INSTITUTIONAL_DOCTRINE_SURVIVABILITY_NOT_PROVEN");
  }

  if (params.sustainableSurvivabilityDetected) {
    warnings.delete("S26_SURVIVABILITY_UNSUSTAINABLE");
  }

  return Array.from(warnings);
}

function getDoctrineSurvivabilityClassification(params: {
  hasEvidence: boolean;
  doctrineScore: number;
  sustainabilityScore: number;
  entropyBurdenScore: number;
  amplificationScore: number;
  recursiveDependencyScore: number;
  sequencingScore: number;
  fragmentationScore: number;
  collapseExposureScore: number;
  longHorizonScore: number;
  viabilityScore: number;
  failClosedScore: number;
  explainabilityScore: number;
  doctrineResilienceExhaustionScore: number;
  survivabilitySaturationScore: number;
  irreversibleDegradationScore: number;
  survivabilityAmplificationDetected: boolean;
  recursiveSurvivabilityDependencyDetected: boolean;
  probabilisticallyUnstableSurvivabilityDetected: boolean;
  operationallyNonviableSurvivabilityDetected: boolean;
  survivabilityFragmentationDetected: boolean;
  survivabilitySequencingInstabilityDetected: boolean;
  failClosedSurvivabilityDegradationDetected: boolean;
  irreversibleSurvivabilityDegradationDetected: boolean;
}): CountyGovernanceEntropyDoctrineSurvivabilityClassification {
  if (params.irreversibleSurvivabilityDegradationDetected) {
    return "irreversible_survivability_degradation";
  }

  if (params.operationallyNonviableSurvivabilityDetected) {
    return "operationally_nonviable_survivability";
  }

  if (params.failClosedSurvivabilityDegradationDetected) {
    return "fail_closed_survivability_degradation";
  }

  if (params.probabilisticallyUnstableSurvivabilityDetected) {
    return "probabilistically_unstable_survivability";
  }

  if (params.recursiveSurvivabilityDependencyDetected) {
    return "recursive_survivability_dependency";
  }

  if (params.survivabilityAmplificationDetected) {
    return "survivability_amplification_instability";
  }

  if (params.survivabilitySequencingInstabilityDetected) {
    return "survivability_sequencing_instability";
  }

  if (params.survivabilityFragmentationDetected) {
    return "survivability_fragmentation";
  }

  if (params.entropyBurdenScore >= 78) {
    return "entropy_burdened_survivability";
  }

  if (params.hasEvidence && (params.doctrineScore < 70 || params.sustainabilityScore < 65)) {
    return "temporary_doctrine_survivability";
  }

  if (
    params.hasEvidence &&
    params.doctrineScore >= 96 &&
    params.sustainabilityScore >= 96 &&
    params.sequencingScore >= 96 &&
    params.longHorizonScore >= 96 &&
    params.viabilityScore >= 96 &&
    params.failClosedScore >= 96 &&
    params.explainabilityScore >= 96 &&
    params.entropyBurdenScore <= 20 &&
    params.amplificationScore <= 20 &&
    params.recursiveDependencyScore <= 20 &&
    params.fragmentationScore <= 20 &&
    params.collapseExposureScore <= 20 &&
    params.doctrineResilienceExhaustionScore <= 20 &&
    params.survivabilitySaturationScore <= 20 &&
    params.irreversibleDegradationScore <= 20
  ) {
    return "institutional_doctrine_survivability";
  }

  if (
    params.hasEvidence &&
    params.doctrineScore >= 88 &&
    params.sustainabilityScore >= 78 &&
    params.sequencingScore >= 88 &&
    params.longHorizonScore >= 76 &&
    params.viabilityScore >= 70 &&
    params.failClosedScore >= 72 &&
    params.explainabilityScore >= 65
  ) {
    return "durable_doctrine_survivability";
  }

  return "doctrine_survivability_unverified";
}

function buildExplainability(params: {
  classification: CountyGovernanceEntropyDoctrineSurvivabilityClassification;
  warnings: CountyGovernanceEntropyDoctrineSurvivabilityWarningCode[];
  hasEvidence: boolean;
  doctrineScore: number;
  sustainabilityScore: number;
  entropyBurdenScore: number;
  amplificationScore: number;
  recursiveDependencyScore: number;
  probabilisticInstabilityScore: number;
  viabilityScore: number;
  irreversibleDegradationScore: number;
  failClosedScore: number;
}): CountyGovernanceEntropyDoctrineSurvivabilityExplainability {
  return {
    summary: params.hasEvidence
      ? `S26 classified doctrine survivability as ${params.classification}.`
      : "S26 classified doctrine survivability as unverified because no caller-supplied evidence was provided.",
    survivabilityDrivers: [
      `Doctrine survivability score: ${params.doctrineScore}.`,
      `Operational viability score: ${params.viabilityScore}.`,
    ],
    sustainabilityDrivers: [`Survivability sustainability score: ${params.sustainabilityScore}.`],
    entropyBurdenDrivers: [`Survivability entropy burden score: ${params.entropyBurdenScore}.`],
    amplificationDrivers: [`Survivability amplification score: ${params.amplificationScore}.`],
    recursiveDependencyDrivers: [`Recursive survivability dependency score: ${params.recursiveDependencyScore}.`],
    viabilityDrivers: [
      `Probabilistic instability score: ${params.probabilisticInstabilityScore}.`,
      `Irreversible degradation score: ${params.irreversibleDegradationScore}.`,
    ],
    irreversibleDegradationDrivers: [`Irreversible degradation score: ${params.irreversibleDegradationScore}.`],
    failClosedDrivers: [`Fail-closed survivability integrity score: ${params.failClosedScore}.`],
    warningDerivation: params.warnings.map((warning) => `${warning} derived from deterministic S26 thresholds.`),
    deterministicRulesApplied: [
      "Pure caller-input-only scoring.",
      "Fixed ordinal maps and bounded 0-100 scores.",
      "Explicit fail-closed precedence ordering.",
      "No runtime, provider, database, network, clock, or filesystem dependency.",
    ],
  };
}

export function evaluateCountyGovernanceEntropyDoctrineSurvivability(
  input: CountyGovernanceEntropyDoctrineSurvivabilityInput = {},
): CountyGovernanceEntropyDoctrineSurvivabilityResult {
  const hasEvidence = hasAnyInput(input);

  const survivabilityCycleCount = clampCount(input.survivabilityCycleCount);
  const stabilizationDependencyCycleCount = clampCount(input.stabilizationDependencyCycleCount);
  const entropyAmplificationEventCount = clampCount(input.entropyAmplificationEventCount);
  const sequencingInstabilityEventCount = clampCount(input.sequencingInstabilityEventCount);
  const fragmentationEventCount = clampCount(input.fragmentationEventCount);
  const explainabilityDegradationCount = clampCount(input.explainabilityDegradationCount);
  const failClosedDegradationCount = clampCount(input.failClosedDegradationCount);
  const recursiveDependencyGrowthCount = clampCount(input.recursiveDependencyGrowthCount);
  const saturationEventCount = clampCount(input.saturationEventCount);

  const doctrineScore = doctrineSurvivabilityScores[input.doctrineSurvivabilityLevel ?? "unknown"];
  const sustainabilityScore = sustainabilityScores[input.survivabilitySustainabilityLevel ?? "unknown"];
  const entropyBurdenScore = riskScores[input.survivabilityEntropyBurdenLevel ?? "none"];
  const amplificationScore = riskScores[input.survivabilityAmplificationRiskLevel ?? "none"];
  const recursiveDependencyScore = riskScores[input.recursiveSurvivabilityDependencyLevel ?? "none"];
  const sequencingScore = sequencingScores[input.survivabilitySequencingCoherenceLevel ?? "unknown"];
  const fragmentationScore = riskScores[input.survivabilityFragmentationPressureLevel ?? "none"];
  const explainabilityScore = explainabilityScores[input.survivabilityExplainabilityLevel ?? "opaque"];
  const failClosedScore = failClosedScores[input.failClosedSurvivabilityIntegrityLevel ?? "absent"];
  const collapseExposureScore = riskScores[input.survivabilityCollapseExposureLevel ?? "none"];
  const longHorizonScore = longHorizonScores[input.longHorizonDoctrineSurvivabilityLevel ?? "unproven"];
  const viabilityScore = viabilityScores[input.survivabilityOperationalViabilityLevel ?? "unknown"];
  const doctrineResilienceExhaustionScore = riskScores[input.doctrineResilienceExhaustionLevel ?? "none"];
  const survivabilitySaturationScore = riskScores[input.survivabilitySaturationLevel ?? "none"];
  const irreversibleDegradationScore = Math.max(
    reversibilityRiskScores[input.survivabilityReversibilityLevel ?? "unknown"],
    average([
      survivabilitySaturationScore,
      collapseExposureScore,
      doctrineResilienceExhaustionScore,
      100 - longHorizonScore,
    ]),
  );

  const survivabilityAmplificationDetected =
    isHighRisk(input.survivabilityAmplificationRiskLevel) ||
    entropyAmplificationEventCount > 0 ||
    entropyBurdenScore >= 78 ||
    (recursiveDependencyScore >= 78 && isWeakLongHorizon(input.longHorizonDoctrineSurvivabilityLevel));

  const recursiveSurvivabilityDependencyDetected =
    isHighRisk(input.recursiveSurvivabilityDependencyLevel) ||
    stabilizationDependencyCycleCount >= 3 ||
    recursiveDependencyGrowthCount > 0 ||
    (survivabilityCycleCount >= 4 && sustainabilityScore <= 45);

  const survivabilityFragmentationDetected =
    isHighRisk(input.survivabilityFragmentationPressureLevel) ||
    fragmentationEventCount > 0 ||
    input.survivabilitySequencingCoherenceLevel === "fragmented";

  const survivabilitySequencingInstabilityDetected =
    input.survivabilitySequencingCoherenceLevel === "fragmented" ||
    input.survivabilitySequencingCoherenceLevel === "fragile" ||
    sequencingInstabilityEventCount > 0;

  const failClosedSurvivabilityDegradationDetected =
    isWeakFailClosed(input.failClosedSurvivabilityIntegrityLevel) || failClosedDegradationCount > 0;

  const explainabilitySurvivabilityDegradationDetected =
    isWeakExplainability(input.survivabilityExplainabilityLevel) || explainabilityDegradationCount > 0;

  const survivabilitySaturationDetected =
    isHighRisk(input.survivabilitySaturationLevel) ||
    saturationEventCount > 0 ||
    average([entropyBurdenScore, amplificationScore, recursiveDependencyScore, doctrineResilienceExhaustionScore]) >= 78;

  const probabilisticInstabilityScore = average([
    entropyBurdenScore,
    amplificationScore,
    recursiveDependencyScore,
    fragmentationScore,
    collapseExposureScore,
    survivabilitySaturationScore,
    100 - sequencingScore,
    100 - longHorizonScore,
  ]);

  const probabilisticallyUnstableSurvivabilityDetected =
    probabilisticInstabilityScore >= 75 ||
    collapseExposureScore >= 78 ||
    survivabilitySaturationDetected ||
    survivabilitySequencingInstabilityDetected ||
    (isWeakLongHorizon(input.longHorizonDoctrineSurvivabilityLevel) && entropyBurdenScore >= 50);

  const operationallyNonviableSurvivabilityDetected =
    input.survivabilityOperationalViabilityLevel === "nonviable" ||
    input.survivabilitySustainabilityLevel === "unsustainable" ||
    input.survivabilityCollapseExposureLevel === "critical" ||
    input.doctrineResilienceExhaustionLevel === "critical" ||
    (probabilisticallyUnstableSurvivabilityDetected && failClosedScore < 55) ||
    (survivabilityCycleCount >= 5 && isWeakLongHorizon(input.longHorizonDoctrineSurvivabilityLevel));

  const irreversibleSurvivabilityDegradationDetected =
    input.survivabilityReversibilityLevel === "irreversible" ||
    (survivabilitySaturationScore >= 78 && collapseExposureScore >= 78) ||
    (failClosedDegradationCount > 0 && entropyBurdenScore >= 78) ||
    (doctrineResilienceExhaustionScore >= 78 && input.longHorizonDoctrineSurvivabilityLevel === "declining") ||
    (saturationEventCount > 0 && operationallyNonviableSurvivabilityDetected);

  const sustainableSurvivabilityDetected =
    sustainabilityScore >= 78 &&
    longHorizonScore >= 76 &&
    doctrineScore >= 88 &&
    viabilityScore >= 70 &&
    entropyBurdenScore <= 50 &&
    amplificationScore <= 50 &&
    recursiveDependencyScore <= 50 &&
    !survivabilitySaturationDetected &&
    !operationallyNonviableSurvivabilityDetected;

  const classification = getDoctrineSurvivabilityClassification({
    hasEvidence,
    doctrineScore,
    sustainabilityScore,
    entropyBurdenScore,
    amplificationScore,
    recursiveDependencyScore,
    sequencingScore,
    fragmentationScore,
    collapseExposureScore,
    longHorizonScore,
    viabilityScore,
    failClosedScore,
    explainabilityScore,
    doctrineResilienceExhaustionScore,
    survivabilitySaturationScore,
    irreversibleDegradationScore,
    survivabilityAmplificationDetected,
    recursiveSurvivabilityDependencyDetected,
    probabilisticallyUnstableSurvivabilityDetected,
    operationallyNonviableSurvivabilityDetected,
    survivabilityFragmentationDetected,
    survivabilitySequencingInstabilityDetected,
    failClosedSurvivabilityDegradationDetected,
    irreversibleSurvivabilityDegradationDetected,
  });

  const warnings = getWarningCodes({
    hasEvidence,
    classification,
    sustainableSurvivabilityDetected,
    survivabilityAmplificationDetected,
    recursiveSurvivabilityDependencyDetected,
    probabilisticallyUnstableSurvivabilityDetected,
    operationallyNonviableSurvivabilityDetected,
    survivabilityFragmentationDetected,
    survivabilitySequencingInstabilityDetected,
    failClosedSurvivabilityDegradationDetected,
    explainabilitySurvivabilityDegradationDetected,
    survivabilitySaturationDetected,
    irreversibleSurvivabilityDegradationDetected,
    entropyBurdenScore,
    collapseExposureScore,
    doctrineResilienceExhaustionScore,
    longHorizonScore,
    sustainabilityScore,
  });

  return {
    doctrineSurvivabilityClassification: classification,
    durabilityClassification: getDurabilityClassification({
      hasEvidence,
      doctrineScore,
      collapseScore: collapseExposureScore,
      sustainabilityScore,
      longHorizonScore,
    }),
    viabilityClassification: getViabilityClassification({
      hasEvidence,
      viabilityScore,
      probabilisticInstabilityScore,
    }),
    doctrineSurvivabilityScore: clampScore(doctrineScore),
    survivabilitySustainabilityScore: clampScore(sustainabilityScore),
    survivabilityEntropyBurdenScore: clampScore(entropyBurdenScore),
    survivabilityAmplificationScore: clampScore(amplificationScore),
    recursiveDependencyScore: clampScore(recursiveDependencyScore),
    probabilisticInstabilityScore: clampScore(probabilisticInstabilityScore),
    operationalViabilityScore: clampScore(viabilityScore),
    failClosedSurvivabilityIntegrityScore: clampScore(failClosedScore),
    explainabilitySurvivabilityScore: clampScore(explainabilityScore),
    irreversibleDegradationScore: clampScore(irreversibleDegradationScore),
    survivabilityAmplificationDetected,
    recursiveSurvivabilityDependencyDetected,
    probabilisticallyUnstableSurvivabilityDetected,
    operationallyNonviableSurvivabilityDetected,
    survivabilityFragmentationDetected,
    survivabilitySequencingInstabilityDetected,
    failClosedSurvivabilityDegradationDetected,
    explainabilitySurvivabilityDegradationDetected,
    survivabilitySaturationDetected,
    irreversibleSurvivabilityDegradationDetected,
    sustainableSurvivabilityDetected,
    warningCodes: warnings,
    explainability: buildExplainability({
      classification,
      warnings,
      hasEvidence,
      doctrineScore,
      sustainabilityScore,
      entropyBurdenScore,
      amplificationScore,
      recursiveDependencyScore,
      probabilisticInstabilityScore,
      viabilityScore,
      irreversibleDegradationScore,
      failClosedScore,
    }),
    ingestionBlocked: true,
    automationBlocked: true,
    executionBlocked: true,
    planningOnly: true,
    failClosed: true,
  };
}
