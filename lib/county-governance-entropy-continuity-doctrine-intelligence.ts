/**
 * Deterministic advisory-only County Governance Entropy Continuity Doctrine Intelligence Layer.
 *
 * Planning metadata only. This module evaluates supplied entropy continuity doctrine
 * signals and never activates runtime providers, county-source operations, scraping,
 * OCR, parsing, ingestion, normalization, database writes, or automation.
 */

export type ContinuityDurabilityLevel =
  | "unknown"
  | "broken"
  | "temporary"
  | "stable"
  | "durable"
  | "institutional";

export type ContinuitySustainabilityLevel =
  | "unknown"
  | "unsustainable"
  | "strained"
  | "sustainable"
  | "self_sustaining";

export type ContinuityRiskLevel = "none" | "low" | "moderate" | "high" | "critical";

export type ContinuitySequencingCoherenceLevel =
  | "unknown"
  | "fragmented"
  | "fragile"
  | "stable"
  | "durable"
  | "institutional";

export type ContinuityExplainabilityLevel = "opaque" | "partial" | "adequate" | "strong" | "institutional";

export type FailClosedContinuityIntegrityLevel =
  | "absent"
  | "inconsistent"
  | "partial"
  | "stable"
  | "durable"
  | "institutional";

export type LongHorizonContinuitySurvivabilityLevel =
  | "unproven"
  | "declining"
  | "recovering"
  | "resilient"
  | "durable"
  | "institutional";

export type OperationalContinuityViabilityLevel =
  | "unknown"
  | "nonviable"
  | "degraded"
  | "viable"
  | "strong"
  | "institutional";

export type ContinuityDoctrineResilienceLimitLevel =
  | "unknown"
  | "exceeded"
  | "strained"
  | "stable"
  | "durable"
  | "institutional";

export type CountyGovernanceEntropyContinuityDoctrineClassification =
  | "institutional_continuity_doctrine"
  | "sustainable_entropy_continuity"
  | "temporary_continuity_doctrine"
  | "recovery_dependent_continuity"
  | "entropy_burdened_continuity"
  | "continuity_doctrine_fragmentation"
  | "continuity_amplification_instability"
  | "continuity_sequencing_instability"
  | "recursive_continuity_dependency"
  | "probabilistically_unstable_continuity"
  | "operationally_nonviable_continuity"
  | "fail_closed_continuity_degradation"
  | "continuity_doctrine_unverified";

export type CountyGovernanceEntropyContinuityDurabilityClassification =
  | "durable_continuity"
  | "stable_continuity"
  | "temporary_continuity"
  | "fragile_continuity"
  | "collapse_sensitive_continuity"
  | "durability_unverified";

export type CountyGovernanceEntropyContinuityViabilityClassification =
  | "operationally_viable"
  | "conditionally_viable"
  | "degraded_viability"
  | "operationally_nonviable"
  | "viability_unverified";

export type CountyGovernanceEntropyContinuityDoctrineWarningCode =
  | "S25_CONTINUITY_DOCTRINE_UNVERIFIED"
  | "S25_CONTINUITY_UNSUSTAINABLE"
  | "S25_CONTINUITY_AMPLIFIES_ENTROPY"
  | "S25_RECURSIVE_CONTINUITY_DEPENDENCY"
  | "S25_PROBABILISTIC_CONTINUITY_INSTABILITY"
  | "S25_OPERATIONALLY_NONVIABLE_CONTINUITY"
  | "S25_FAIL_CLOSED_CONTINUITY_DEGRADATION"
  | "S25_CONTINUITY_EXPLAINABILITY_DEGRADATION"
  | "S25_CONTINUITY_DOCTRINE_FRAGMENTATION"
  | "S25_CONTINUITY_SEQUENCING_INSTABILITY"
  | "S25_RECOVERY_DEPENDENT_CONTINUITY"
  | "S25_ENTROPY_BURDENED_CONTINUITY"
  | "S25_CONTINUITY_COLLAPSE_EXPOSURE"
  | "S25_LONG_HORIZON_CONTINUITY_SURVIVABILITY_WEAK"
  | "S25_INSTITUTIONAL_CONTINUITY_DOCTRINE_NOT_PROVEN";

export interface CountyGovernanceEntropyContinuityDoctrineInput {
  continuityDurabilityLevel?: ContinuityDurabilityLevel | null;
  continuitySustainabilityLevel?: ContinuitySustainabilityLevel | null;
  continuityRecoveryDependencyLevel?: ContinuityRiskLevel | null;
  continuityEntropyBurdenLevel?: ContinuityRiskLevel | null;
  continuityAmplificationRiskLevel?: ContinuityRiskLevel | null;
  continuitySequencingCoherenceLevel?: ContinuitySequencingCoherenceLevel | null;
  continuityFragmentationPressureLevel?: ContinuityRiskLevel | null;
  continuityExplainabilityLevel?: ContinuityExplainabilityLevel | null;
  failClosedContinuityIntegrityLevel?: FailClosedContinuityIntegrityLevel | null;
  continuityCollapseExposureLevel?: ContinuityRiskLevel | null;
  recursiveStabilizationDependencyLevel?: ContinuityRiskLevel | null;
  longHorizonContinuitySurvivabilityLevel?: LongHorizonContinuitySurvivabilityLevel | null;
  operationalContinuityViabilityLevel?: OperationalContinuityViabilityLevel | null;
  continuityDoctrineResilienceLimitLevel?: ContinuityDoctrineResilienceLimitLevel | null;
  continuityCycleCount?: number | null;
  recoveryDependencyCycleCount?: number | null;
  entropyAmplificationEventCount?: number | null;
  sequencingInstabilityEventCount?: number | null;
  doctrineFragmentationEventCount?: number | null;
  explainabilityDegradationCount?: number | null;
  failClosedDegradationCount?: number | null;
  recursiveDependencyGrowthCount?: number | null;
}

export interface CountyGovernanceEntropyContinuityDoctrineExplainability {
  summary: string;
  continuityDrivers: string[];
  sustainabilityDrivers: string[];
  entropyBurdenDrivers: string[];
  amplificationDrivers: string[];
  recursiveDependencyDrivers: string[];
  viabilityDrivers: string[];
  failClosedDrivers: string[];
  warningDerivation: string[];
  deterministicRulesApplied: string[];
}

export interface CountyGovernanceEntropyContinuityDoctrineResult {
  continuityDoctrineClassification: CountyGovernanceEntropyContinuityDoctrineClassification;
  continuityDurabilityClassification: CountyGovernanceEntropyContinuityDurabilityClassification;
  continuityViabilityClassification: CountyGovernanceEntropyContinuityViabilityClassification;

  continuityDurabilityScore: number;
  continuitySustainabilityScore: number;
  continuityEntropyBurdenScore: number;
  continuityAmplificationScore: number;
  recursiveDependencyScore: number;
  probabilisticInstabilityScore: number;
  operationalViabilityScore: number;
  failClosedContinuityIntegrityScore: number;
  explainabilityContinuityScore: number;

  continuityAmplificationDetected: boolean;
  recursiveContinuityDependencyDetected: boolean;
  probabilisticallyUnstableContinuityDetected: boolean;
  operationallyNonviableContinuityDetected: boolean;
  continuityFragmentationDetected: boolean;
  continuitySequencingInstabilityDetected: boolean;
  failClosedContinuityDegradationDetected: boolean;
  explainabilityContinuityDegradationDetected: boolean;
  sustainableContinuityDetected: boolean;

  warningCodes: CountyGovernanceEntropyContinuityDoctrineWarningCode[];
  explainability: CountyGovernanceEntropyContinuityDoctrineExplainability;

  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const CountyGovernanceEntropyContinuityDoctrineFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

const durabilityScore: Record<ContinuityDurabilityLevel, number> = {
  unknown: 0,
  broken: 8,
  temporary: 30,
  stable: 70,
  durable: 88,
  institutional: 96,
};

const sustainabilityScore: Record<ContinuitySustainabilityLevel, number> = {
  unknown: 0,
  unsustainable: 10,
  strained: 45,
  sustainable: 78,
  self_sustaining: 96,
};

const riskScore: Record<ContinuityRiskLevel, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const sequencingScore: Record<ContinuitySequencingCoherenceLevel, number> = {
  unknown: 0,
  fragmented: 10,
  fragile: 42,
  stable: 72,
  durable: 88,
  institutional: 96,
};

const explainabilityScore: Record<ContinuityExplainabilityLevel, number> = {
  opaque: 0,
  partial: 38,
  adequate: 65,
  strong: 84,
  institutional: 96,
};

const failClosedScore: Record<FailClosedContinuityIntegrityLevel, number> = {
  absent: 0,
  inconsistent: 25,
  partial: 55,
  stable: 72,
  durable: 86,
  institutional: 96,
};

const survivabilityScore: Record<LongHorizonContinuitySurvivabilityLevel, number> = {
  unproven: 0,
  declining: 20,
  recovering: 55,
  resilient: 76,
  durable: 88,
  institutional: 96,
};

const viabilityScore: Record<OperationalContinuityViabilityLevel, number> = {
  unknown: 0,
  nonviable: 5,
  degraded: 35,
  viable: 70,
  strong: 86,
  institutional: 96,
};

const resilienceLimitScore: Record<ContinuityDoctrineResilienceLimitLevel, number> = {
  unknown: 0,
  exceeded: 5,
  strained: 45,
  stable: 72,
  durable: 88,
  institutional: 96,
};

const average = (scores: readonly number[]): number =>
  Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);

const clampCount = (count: number | null | undefined): number => {
  if (typeof count !== "number" || Number.isNaN(count)) {
    return 0;
  }

  return Math.max(0, Math.floor(count));
};

const countPressure = (count: number, multiplier: number): number => Math.min(100, count * multiplier);

const inverseRisk = (score: number): number => 100 - score;

const isHighRisk = (level: ContinuityRiskLevel | null | undefined): boolean => level === "high" || level === "critical";

const isWeakFailClosed = (level: FailClosedContinuityIntegrityLevel | null | undefined): boolean =>
  level === "absent" || level === "inconsistent";

const hasRequiredEvidence = (input: CountyGovernanceEntropyContinuityDoctrineInput): boolean =>
  input.continuityDurabilityLevel !== undefined &&
  input.continuityDurabilityLevel !== null &&
  input.continuitySustainabilityLevel !== undefined &&
  input.continuitySustainabilityLevel !== null &&
  input.continuityRecoveryDependencyLevel !== undefined &&
  input.continuityRecoveryDependencyLevel !== null &&
  input.continuityEntropyBurdenLevel !== undefined &&
  input.continuityEntropyBurdenLevel !== null &&
  input.continuityAmplificationRiskLevel !== undefined &&
  input.continuityAmplificationRiskLevel !== null &&
  input.continuitySequencingCoherenceLevel !== undefined &&
  input.continuitySequencingCoherenceLevel !== null &&
  input.continuityFragmentationPressureLevel !== undefined &&
  input.continuityFragmentationPressureLevel !== null &&
  input.continuityExplainabilityLevel !== undefined &&
  input.continuityExplainabilityLevel !== null &&
  input.failClosedContinuityIntegrityLevel !== undefined &&
  input.failClosedContinuityIntegrityLevel !== null &&
  input.continuityCollapseExposureLevel !== undefined &&
  input.continuityCollapseExposureLevel !== null &&
  input.recursiveStabilizationDependencyLevel !== undefined &&
  input.recursiveStabilizationDependencyLevel !== null &&
  input.longHorizonContinuitySurvivabilityLevel !== undefined &&
  input.longHorizonContinuitySurvivabilityLevel !== null &&
  input.operationalContinuityViabilityLevel !== undefined &&
  input.operationalContinuityViabilityLevel !== null &&
  input.continuityDoctrineResilienceLimitLevel !== undefined &&
  input.continuityDoctrineResilienceLimitLevel !== null;

const getSignals = (input: CountyGovernanceEntropyContinuityDoctrineInput = {}) => {
  const continuityCycleCount = clampCount(input.continuityCycleCount);
  const recoveryDependencyCycleCount = clampCount(input.recoveryDependencyCycleCount);
  const entropyAmplificationEventCount = clampCount(input.entropyAmplificationEventCount);
  const sequencingInstabilityEventCount = clampCount(input.sequencingInstabilityEventCount);
  const doctrineFragmentationEventCount = clampCount(input.doctrineFragmentationEventCount);
  const explainabilityDegradationCount = clampCount(input.explainabilityDegradationCount);
  const failClosedDegradationCount = clampCount(input.failClosedDegradationCount);
  const recursiveDependencyGrowthCount = clampCount(input.recursiveDependencyGrowthCount);
  const evidenceMissing = !hasRequiredEvidence(input);
  const continuityDurabilityScore = evidenceMissing
    ? 0
    : average([
        durabilityScore[input.continuityDurabilityLevel as ContinuityDurabilityLevel],
        sequencingScore[input.continuitySequencingCoherenceLevel as ContinuitySequencingCoherenceLevel],
        survivabilityScore[
          input.longHorizonContinuitySurvivabilityLevel as LongHorizonContinuitySurvivabilityLevel
        ],
        failClosedScore[input.failClosedContinuityIntegrityLevel as FailClosedContinuityIntegrityLevel],
      ]);
  const continuitySustainabilityScore = evidenceMissing
    ? 0
    : average([
        sustainabilityScore[input.continuitySustainabilityLevel as ContinuitySustainabilityLevel],
        viabilityScore[input.operationalContinuityViabilityLevel as OperationalContinuityViabilityLevel],
        inverseRisk(riskScore[input.continuityRecoveryDependencyLevel as ContinuityRiskLevel]),
        inverseRisk(countPressure(continuityCycleCount, 10)),
      ]);
  const continuityEntropyBurdenScore = evidenceMissing
    ? 0
    : average([
        riskScore[input.continuityEntropyBurdenLevel as ContinuityRiskLevel],
        riskScore[input.continuityRecoveryDependencyLevel as ContinuityRiskLevel],
        riskScore[input.recursiveStabilizationDependencyLevel as ContinuityRiskLevel],
        riskScore[input.continuityCollapseExposureLevel as ContinuityRiskLevel],
      ]);
  const continuityAmplificationScore = evidenceMissing
    ? 0
    : average([
        riskScore[input.continuityAmplificationRiskLevel as ContinuityRiskLevel],
        countPressure(entropyAmplificationEventCount, 22),
        riskScore[input.continuityEntropyBurdenLevel as ContinuityRiskLevel],
        riskScore[input.continuityRecoveryDependencyLevel as ContinuityRiskLevel],
      ]);
  const recursiveDependencyScore = evidenceMissing
    ? 0
    : average([
        riskScore[input.recursiveStabilizationDependencyLevel as ContinuityRiskLevel],
        countPressure(recoveryDependencyCycleCount, 15),
        countPressure(recursiveDependencyGrowthCount, 20),
        countPressure(continuityCycleCount, 10),
      ]);
  const probabilisticInstabilityScore = evidenceMissing
    ? 0
    : average([
        continuityEntropyBurdenScore,
        continuityAmplificationScore,
        riskScore[input.continuityFragmentationPressureLevel as ContinuityRiskLevel],
        countPressure(sequencingInstabilityEventCount, 22),
        riskScore[input.continuityCollapseExposureLevel as ContinuityRiskLevel],
      ]);
  const operationalViabilityScore = evidenceMissing
    ? 0
    : average([
        viabilityScore[input.operationalContinuityViabilityLevel as OperationalContinuityViabilityLevel],
        sustainabilityScore[input.continuitySustainabilityLevel as ContinuitySustainabilityLevel],
        survivabilityScore[
          input.longHorizonContinuitySurvivabilityLevel as LongHorizonContinuitySurvivabilityLevel
        ],
        inverseRisk(riskScore[input.continuityCollapseExposureLevel as ContinuityRiskLevel]),
      ]);
  const failClosedContinuityIntegrityScore = evidenceMissing
    ? 0
    : average([
        failClosedScore[input.failClosedContinuityIntegrityLevel as FailClosedContinuityIntegrityLevel],
        inverseRisk(countPressure(failClosedDegradationCount, 22)),
      ]);
  const explainabilityContinuityScore = evidenceMissing
    ? 0
    : average([
        explainabilityScore[input.continuityExplainabilityLevel as ContinuityExplainabilityLevel],
        inverseRisk(countPressure(explainabilityDegradationCount, 22)),
      ]);
  const continuityAmplificationDetected =
    isHighRisk(input.continuityAmplificationRiskLevel) ||
    entropyAmplificationEventCount > 0 ||
    isHighRisk(input.continuityEntropyBurdenLevel) ||
    (isHighRisk(input.continuityRecoveryDependencyLevel) && input.continuityAmplificationRiskLevel !== "none") ||
    (isHighRisk(input.recursiveStabilizationDependencyLevel) &&
      input.longHorizonContinuitySurvivabilityLevel === "declining");
  const recursiveContinuityDependencyDetected =
    isHighRisk(input.recursiveStabilizationDependencyLevel) ||
    isHighRisk(input.continuityRecoveryDependencyLevel) ||
    recoveryDependencyCycleCount >= 3 ||
    recursiveDependencyGrowthCount > 0 ||
    (continuityCycleCount >= 4 &&
      (input.continuitySustainabilityLevel === "strained" ||
        input.continuitySustainabilityLevel === "unsustainable"));
  const probabilisticallyUnstableContinuityDetected =
    probabilisticInstabilityScore >= 75 ||
    isHighRisk(input.continuityCollapseExposureLevel) ||
    sequencingInstabilityEventCount > 0 ||
    isHighRisk(input.continuityFragmentationPressureLevel) ||
    input.longHorizonContinuitySurvivabilityLevel === "unproven" ||
    input.longHorizonContinuitySurvivabilityLevel === "declining" ||
    isWeakFailClosed(input.failClosedContinuityIntegrityLevel);
  const operationallyNonviableContinuityDetected =
    input.operationalContinuityViabilityLevel === "nonviable" ||
    input.continuitySustainabilityLevel === "unsustainable" ||
    input.continuityCollapseExposureLevel === "critical" ||
    input.continuityDoctrineResilienceLimitLevel === "exceeded" ||
    (probabilisticallyUnstableContinuityDetected && failClosedContinuityIntegrityScore < 55) ||
    (continuityCycleCount >= 5 &&
      (input.longHorizonContinuitySurvivabilityLevel === "unproven" ||
        input.longHorizonContinuitySurvivabilityLevel === "declining"));
  const failClosedContinuityDegradationDetected =
    isWeakFailClosed(input.failClosedContinuityIntegrityLevel) || failClosedDegradationCount > 0;
  const continuityFragmentationDetected =
    input.continuitySequencingCoherenceLevel === "fragmented" ||
    isHighRisk(input.continuityFragmentationPressureLevel) ||
    doctrineFragmentationEventCount > 0;
  const continuitySequencingInstabilityDetected =
    input.continuitySequencingCoherenceLevel === "fragmented" ||
    input.continuitySequencingCoherenceLevel === "fragile" ||
    sequencingInstabilityEventCount > 0;
  const explainabilityContinuityDegradationDetected =
    input.continuityExplainabilityLevel === "opaque" ||
    input.continuityExplainabilityLevel === "partial" ||
    explainabilityDegradationCount > 0;
  const sustainableContinuityDetected =
    continuityDurabilityScore >= 75 &&
    continuitySustainabilityScore >= 72 &&
    operationalViabilityScore >= 70 &&
    failClosedContinuityIntegrityScore >= 72 &&
    explainabilityContinuityScore >= 70 &&
    continuityEntropyBurdenScore < 45 &&
    continuityAmplificationScore < 45 &&
    recursiveDependencyScore < 45 &&
    probabilisticInstabilityScore < 60;

  return {
    continuityCycleCount,
    recoveryDependencyCycleCount,
    entropyAmplificationEventCount,
    sequencingInstabilityEventCount,
    doctrineFragmentationEventCount,
    explainabilityDegradationCount,
    failClosedDegradationCount,
    recursiveDependencyGrowthCount,
    evidenceMissing,
    continuityDurabilityScore,
    continuitySustainabilityScore,
    continuityEntropyBurdenScore,
    continuityAmplificationScore,
    recursiveDependencyScore,
    probabilisticInstabilityScore,
    operationalViabilityScore,
    failClosedContinuityIntegrityScore,
    explainabilityContinuityScore,
    continuityAmplificationDetected,
    recursiveContinuityDependencyDetected,
    probabilisticallyUnstableContinuityDetected,
    operationallyNonviableContinuityDetected,
    failClosedContinuityDegradationDetected,
    continuityFragmentationDetected,
    continuitySequencingInstabilityDetected,
    explainabilityContinuityDegradationDetected,
    sustainableContinuityDetected,
  };
};

const getDoctrineClassification = (
  input: CountyGovernanceEntropyContinuityDoctrineInput,
): CountyGovernanceEntropyContinuityDoctrineClassification => {
  const signals = getSignals(input);

  if (signals.operationallyNonviableContinuityDetected) {
    return "operationally_nonviable_continuity";
  }

  if (signals.failClosedContinuityDegradationDetected) {
    return "fail_closed_continuity_degradation";
  }

  if (signals.probabilisticallyUnstableContinuityDetected) {
    return "probabilistically_unstable_continuity";
  }

  if (signals.recursiveContinuityDependencyDetected) {
    return "recursive_continuity_dependency";
  }

  if (signals.continuityAmplificationDetected) {
    return "continuity_amplification_instability";
  }

  if (signals.continuitySequencingInstabilityDetected) {
    return "continuity_sequencing_instability";
  }

  if (signals.continuityFragmentationDetected) {
    return "continuity_doctrine_fragmentation";
  }

  if (signals.continuityEntropyBurdenScore >= 50) {
    return "entropy_burdened_continuity";
  }

  if (
    input.continuityRecoveryDependencyLevel === "moderate" ||
    input.continuityRecoveryDependencyLevel === "high" ||
    input.continuityRecoveryDependencyLevel === "critical"
  ) {
    return "recovery_dependent_continuity";
  }

  if (input.continuityDurabilityLevel === "temporary" || input.continuitySustainabilityLevel === "strained") {
    return "temporary_continuity_doctrine";
  }

  if (signals.sustainableContinuityDetected) {
    if (
      input.continuityDurabilityLevel === "institutional" &&
      input.continuitySustainabilityLevel === "self_sustaining" &&
      input.continuitySequencingCoherenceLevel === "institutional" &&
      input.continuityExplainabilityLevel === "institutional" &&
      input.failClosedContinuityIntegrityLevel === "institutional" &&
      input.longHorizonContinuitySurvivabilityLevel === "institutional" &&
      input.operationalContinuityViabilityLevel === "institutional" &&
      input.continuityDoctrineResilienceLimitLevel === "institutional"
    ) {
      return "institutional_continuity_doctrine";
    }

    return "sustainable_entropy_continuity";
  }

  if (signals.evidenceMissing) {
    return "continuity_doctrine_unverified";
  }

  return "continuity_doctrine_unverified";
};

const getDurabilityClassification = (
  input: CountyGovernanceEntropyContinuityDoctrineInput,
): CountyGovernanceEntropyContinuityDurabilityClassification => {
  const signals = getSignals(input);

  if (signals.evidenceMissing) {
    return "durability_unverified";
  }

  if (isHighRisk(input.continuityCollapseExposureLevel)) {
    return "collapse_sensitive_continuity";
  }

  if (input.continuityDurabilityLevel === "broken" || input.continuitySequencingCoherenceLevel === "fragile") {
    return "fragile_continuity";
  }

  if (input.continuityDurabilityLevel === "temporary") {
    return "temporary_continuity";
  }

  if (signals.continuityDurabilityScore >= 82) {
    return "durable_continuity";
  }

  if (signals.continuityDurabilityScore >= 60) {
    return "stable_continuity";
  }

  return "durability_unverified";
};

const getViabilityClassification = (
  input: CountyGovernanceEntropyContinuityDoctrineInput,
): CountyGovernanceEntropyContinuityViabilityClassification => {
  const signals = getSignals(input);

  if (signals.evidenceMissing) {
    return "viability_unverified";
  }

  if (signals.operationallyNonviableContinuityDetected) {
    return "operationally_nonviable";
  }

  if (input.operationalContinuityViabilityLevel === "degraded" || signals.operationalViabilityScore < 55) {
    return "degraded_viability";
  }

  if (signals.operationalViabilityScore >= 78) {
    return "operationally_viable";
  }

  return "conditionally_viable";
};

const getWarningCodes = (
  input: CountyGovernanceEntropyContinuityDoctrineInput,
): CountyGovernanceEntropyContinuityDoctrineWarningCode[] => {
  const signals = getSignals(input);
  const warningCodes: CountyGovernanceEntropyContinuityDoctrineWarningCode[] = [];

  if (signals.evidenceMissing) {
    warningCodes.push("S25_CONTINUITY_DOCTRINE_UNVERIFIED");
  }

  if (input.continuitySustainabilityLevel === "unsustainable") {
    warningCodes.push("S25_CONTINUITY_UNSUSTAINABLE");
  }

  if (signals.continuityAmplificationDetected) {
    warningCodes.push("S25_CONTINUITY_AMPLIFIES_ENTROPY");
  }

  if (signals.recursiveContinuityDependencyDetected) {
    warningCodes.push("S25_RECURSIVE_CONTINUITY_DEPENDENCY");
  }

  if (signals.probabilisticallyUnstableContinuityDetected) {
    warningCodes.push("S25_PROBABILISTIC_CONTINUITY_INSTABILITY");
  }

  if (signals.operationallyNonviableContinuityDetected) {
    warningCodes.push("S25_OPERATIONALLY_NONVIABLE_CONTINUITY");
  }

  if (signals.failClosedContinuityDegradationDetected) {
    warningCodes.push("S25_FAIL_CLOSED_CONTINUITY_DEGRADATION");
  }

  if (signals.explainabilityContinuityDegradationDetected) {
    warningCodes.push("S25_CONTINUITY_EXPLAINABILITY_DEGRADATION");
  }

  if (signals.continuityFragmentationDetected) {
    warningCodes.push("S25_CONTINUITY_DOCTRINE_FRAGMENTATION");
  }

  if (signals.continuitySequencingInstabilityDetected) {
    warningCodes.push("S25_CONTINUITY_SEQUENCING_INSTABILITY");
  }

  if (
    input.continuityRecoveryDependencyLevel === "moderate" ||
    input.continuityRecoveryDependencyLevel === "high" ||
    input.continuityRecoveryDependencyLevel === "critical"
  ) {
    warningCodes.push("S25_RECOVERY_DEPENDENT_CONTINUITY");
  }

  if (signals.continuityEntropyBurdenScore >= 50) {
    warningCodes.push("S25_ENTROPY_BURDENED_CONTINUITY");
  }

  if (isHighRisk(input.continuityCollapseExposureLevel)) {
    warningCodes.push("S25_CONTINUITY_COLLAPSE_EXPOSURE");
  }

  if (
    input.longHorizonContinuitySurvivabilityLevel === "unproven" ||
    input.longHorizonContinuitySurvivabilityLevel === "declining"
  ) {
    warningCodes.push("S25_LONG_HORIZON_CONTINUITY_SURVIVABILITY_WEAK");
  }

  if (getDoctrineClassification(input) !== "institutional_continuity_doctrine") {
    warningCodes.push("S25_INSTITUTIONAL_CONTINUITY_DOCTRINE_NOT_PROVEN");
  }

  return warningCodes;
};

export function evaluateCountyGovernanceEntropyContinuityDoctrine(
  input: CountyGovernanceEntropyContinuityDoctrineInput = {},
): CountyGovernanceEntropyContinuityDoctrineResult {
  const signals = getSignals(input);
  const continuityDoctrineClassification = getDoctrineClassification(input);
  const continuityDurabilityClassification = getDurabilityClassification(input);
  const continuityViabilityClassification = getViabilityClassification(input);
  const warningCodes = getWarningCodes(input);

  return {
    continuityDoctrineClassification,
    continuityDurabilityClassification,
    continuityViabilityClassification,
    continuityDurabilityScore: signals.continuityDurabilityScore,
    continuitySustainabilityScore: signals.continuitySustainabilityScore,
    continuityEntropyBurdenScore: signals.continuityEntropyBurdenScore,
    continuityAmplificationScore: signals.continuityAmplificationScore,
    recursiveDependencyScore: signals.recursiveDependencyScore,
    probabilisticInstabilityScore: signals.probabilisticInstabilityScore,
    operationalViabilityScore: signals.operationalViabilityScore,
    failClosedContinuityIntegrityScore: signals.failClosedContinuityIntegrityScore,
    explainabilityContinuityScore: signals.explainabilityContinuityScore,
    continuityAmplificationDetected: signals.continuityAmplificationDetected,
    recursiveContinuityDependencyDetected: signals.recursiveContinuityDependencyDetected,
    probabilisticallyUnstableContinuityDetected: signals.probabilisticallyUnstableContinuityDetected,
    operationallyNonviableContinuityDetected: signals.operationallyNonviableContinuityDetected,
    continuityFragmentationDetected: signals.continuityFragmentationDetected,
    continuitySequencingInstabilityDetected: signals.continuitySequencingInstabilityDetected,
    failClosedContinuityDegradationDetected: signals.failClosedContinuityDegradationDetected,
    explainabilityContinuityDegradationDetected: signals.explainabilityContinuityDegradationDetected,
    sustainableContinuityDetected: signals.sustainableContinuityDetected,
    warningCodes,
    explainability: {
      summary: `County governance entropy continuity doctrine evaluated as ${continuityDoctrineClassification} with deterministic advisory-only rules.`,
      continuityDrivers: [
        `continuity durability: ${input.continuityDurabilityLevel ?? "missing"}`,
        `sequencing coherence: ${input.continuitySequencingCoherenceLevel ?? "missing"}`,
        `continuity durability score: ${signals.continuityDurabilityScore}`,
      ],
      sustainabilityDrivers: [
        `continuity sustainability: ${input.continuitySustainabilityLevel ?? "missing"}`,
        `operational continuity viability: ${input.operationalContinuityViabilityLevel ?? "missing"}`,
        `continuity sustainability score: ${signals.continuitySustainabilityScore}`,
      ],
      entropyBurdenDrivers: [
        `continuity entropy burden: ${input.continuityEntropyBurdenLevel ?? "missing"}`,
        `continuity recovery dependency: ${input.continuityRecoveryDependencyLevel ?? "missing"}`,
        `continuity entropy burden score: ${signals.continuityEntropyBurdenScore}`,
      ],
      amplificationDrivers: [
        `continuity amplification risk: ${input.continuityAmplificationRiskLevel ?? "missing"}`,
        `entropy amplification events: ${signals.entropyAmplificationEventCount}`,
        `continuity amplification score: ${signals.continuityAmplificationScore}`,
      ],
      recursiveDependencyDrivers: [
        `recursive stabilization dependency: ${input.recursiveStabilizationDependencyLevel ?? "missing"}`,
        `recursive dependency growth events: ${signals.recursiveDependencyGrowthCount}`,
        `recursive dependency score: ${signals.recursiveDependencyScore}`,
      ],
      viabilityDrivers: [
        `long-horizon continuity survivability: ${input.longHorizonContinuitySurvivabilityLevel ?? "missing"}`,
        `continuity collapse exposure: ${input.continuityCollapseExposureLevel ?? "missing"}`,
        `operational viability score: ${signals.operationalViabilityScore}`,
      ],
      failClosedDrivers: [
        `fail-closed continuity integrity: ${input.failClosedContinuityIntegrityLevel ?? "missing"}`,
        `fail-closed degradation events: ${signals.failClosedDegradationCount}`,
        `fail-closed continuity integrity score: ${signals.failClosedContinuityIntegrityScore}`,
      ],
      warningDerivation: warningCodes.map((warningCode) => `${warningCode} derived from deterministic continuity doctrine thresholds`),
      deterministicRulesApplied: [
        "pure synchronous function",
        "strict string union inputs",
        "counts clamped to non-negative integers",
        "scores use fixed ordinal maps and bounded averages",
        "missing evidence defaults to continuity doctrine unverified",
        "probabilistic continuity instability is deterministic and uses no randomness",
        "operational nonviability and fail-closed degradation override favorable continuity classifications",
        "all results preserve advisory-only fail-closed execution blocking",
      ],
    },
    ingestionBlocked: CountyGovernanceEntropyContinuityDoctrineFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountyGovernanceEntropyContinuityDoctrineFailClosedDefaults.automationBlocked,
    executionBlocked: CountyGovernanceEntropyContinuityDoctrineFailClosedDefaults.executionBlocked,
    planningOnly: CountyGovernanceEntropyContinuityDoctrineFailClosedDefaults.planningOnly,
    failClosed: CountyGovernanceEntropyContinuityDoctrineFailClosedDefaults.failClosed,
  };
}
