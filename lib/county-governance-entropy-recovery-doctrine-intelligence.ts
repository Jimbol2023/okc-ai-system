/**
 * Deterministic advisory-only County Governance Entropy Recovery Doctrine Intelligence Layer.
 *
 * Planning metadata only. This module evaluates supplied entropy recovery doctrine
 * signals and never activates runtime providers, county-source operations, scraping,
 * OCR, parsing, ingestion, normalization, database writes, or automation.
 */

export type EntropyRecoveryFeasibilityLevel =
  | "unknown"
  | "nonviable"
  | "partial"
  | "recoverable"
  | "strong"
  | "institutional";

export type RecoverySustainabilityLevel =
  | "unknown"
  | "unsustainable"
  | "strained"
  | "sustainable"
  | "self_sustaining";

export type EntropyReversibilityLevel = "unknown" | "irreversible" | "difficult" | "partial" | "reversible";
export type RecoveryStabilityLevel = "unknown" | "unstable" | "fragile" | "stable" | "durable";
export type RecoveryDoctrineCoherenceLevel = "fragmented" | "partial" | "coherent" | "strong" | "institutional";
export type RecoverySequencingStabilityLevel = "unknown" | "unstable" | "fragile" | "stable" | "durable";
export type RecoveryRiskLevel = "none" | "low" | "moderate" | "high" | "critical";

export type FailClosedRecoveryIntegrityLevel =
  | "absent"
  | "inconsistent"
  | "partial"
  | "stable"
  | "durable"
  | "institutional";

export type RecoveryExplainabilityLevel = "opaque" | "partial" | "adequate" | "strong" | "institutional";

export type LongHorizonRecoverySurvivabilityLevel =
  | "unproven"
  | "declining"
  | "recovering"
  | "resilient"
  | "durable"
  | "institutional";

export type CountyGovernanceEntropyRecoveryDoctrineClassification =
  | "institutional_recovery_doctrine"
  | "sustainable_entropy_recovery"
  | "partially_recoverable_entropy"
  | "unstable_recovery_doctrine"
  | "recovery_doctrine_fragmentation"
  | "recovery_amplified_entropy"
  | "stabilization_driven_instability"
  | "recovery_trapped_governance"
  | "probabilistically_nonviable_recovery"
  | "irreversible_recovery_collapse"
  | "fail_closed_recovery_degradation"
  | "recovery_doctrine_unverified";

export type CountyGovernanceEntropyRecoveryReversibilityClassification =
  | "reversible"
  | "partially_reversible"
  | "difficult_to_reverse"
  | "irreversible"
  | "reversibility_unverified";

export type CountyGovernanceEntropyRecoveryStabilityClassification =
  | "stable_recovery"
  | "conditional_recovery"
  | "fragile_recovery"
  | "unstable_recovery"
  | "collapse_reinforcing_recovery";

export type CountyGovernanceEntropyRecoveryDoctrineWarningCode =
  | "S24_RECOVERY_DOCTRINE_UNVERIFIED"
  | "S24_RECOVERY_COST_UNSUSTAINABLE"
  | "S24_RECOVERY_AMPLIFIES_ENTROPY"
  | "S24_RECOVERY_TRAP_DETECTED"
  | "S24_PROBABILISTIC_RECOVERY_NONVIABLE"
  | "S24_IRREVERSIBLE_RECOVERY_COLLAPSE"
  | "S24_FAIL_CLOSED_RECOVERY_DEGRADATION"
  | "S24_RECOVERY_EXPLAINABILITY_DEGRADATION"
  | "S24_RECOVERY_DOCTRINE_FRAGMENTATION"
  | "S24_RECOVERY_SEQUENCING_INSTABILITY"
  | "S24_STABILIZATION_DRIVEN_INSTABILITY"
  | "S24_RECOVERY_DEPENDENCY_UNSUSTAINABLE"
  | "S24_RECOVERY_CONTRADICTION_PRESSURE"
  | "S24_LONG_HORIZON_RECOVERY_SURVIVABILITY_WEAK"
  | "S24_INSTITUTIONAL_RECOVERY_DOCTRINE_NOT_PROVEN";

export interface CountyGovernanceEntropyRecoveryDoctrineInput {
  entropyRecoveryFeasibilityLevel?: EntropyRecoveryFeasibilityLevel | null;
  recoverySustainabilityLevel?: RecoverySustainabilityLevel | null;
  entropyReversibilityLevel?: EntropyReversibilityLevel | null;
  recoveryStabilityLevel?: RecoveryStabilityLevel | null;
  recoveryDoctrineCoherenceLevel?: RecoveryDoctrineCoherenceLevel | null;
  recoverySequencingStabilityLevel?: RecoverySequencingStabilityLevel | null;
  stabilizationCostBurdenLevel?: RecoveryRiskLevel | null;
  recoveryAmplificationRiskLevel?: RecoveryRiskLevel | null;
  recoveryDependencyLevel?: RecoveryRiskLevel | null;
  recoveryContradictionPressureLevel?: RecoveryRiskLevel | null;
  failClosedRecoveryIntegrityLevel?: FailClosedRecoveryIntegrityLevel | null;
  recoveryExplainabilityLevel?: RecoveryExplainabilityLevel | null;
  longHorizonRecoverySurvivabilityLevel?: LongHorizonRecoverySurvivabilityLevel | null;
  recoveryCollapseExposureLevel?: RecoveryRiskLevel | null;
  recoveryCycleCount?: number | null;
  failedRecoveryAttemptCount?: number | null;
  recoveryAmplificationEventCount?: number | null;
  sequencingInstabilityEventCount?: number | null;
  doctrineFragmentationEventCount?: number | null;
  recoveryDependencyGrowthCount?: number | null;
  failClosedRecoveryDegradationCount?: number | null;
  explainabilityRecoveryDegradationCount?: number | null;
}

export interface CountyGovernanceEntropyRecoveryDoctrineExplainability {
  summary: string;
  feasibilityDrivers: string[];
  sustainabilityDrivers: string[];
  doctrineCoherenceDrivers: string[];
  amplificationDrivers: string[];
  recoveryTrapDrivers: string[];
  nonviabilityDrivers: string[];
  irreversibleCollapseDrivers: string[];
  failClosedDrivers: string[];
  warningDerivation: string[];
  deterministicRulesApplied: string[];
}

export interface CountyGovernanceEntropyRecoveryDoctrineResult {
  recoveryDoctrineClassification: CountyGovernanceEntropyRecoveryDoctrineClassification;
  recoveryReversibilityClassification: CountyGovernanceEntropyRecoveryReversibilityClassification;
  recoveryStabilityClassification: CountyGovernanceEntropyRecoveryStabilityClassification;

  recoveryFeasibilityScore: number;
  recoverySustainabilityScore: number;
  doctrineCoherenceScore: number;
  recoveryAmplificationScore: number;
  recoveryTrapScore: number;
  nonviableRecoveryScore: number;
  irreversibleCollapseScore: number;
  failClosedRecoveryIntegrityScore: number;
  explainabilityRecoveryIntegrityScore: number;

  recoveryAmplificationDetected: boolean;
  recoveryTrapDetected: boolean;
  probabilisticNonviableRecoveryDetected: boolean;
  irreversibleRecoveryCollapseDetected: boolean;
  doctrineFragmentationDetected: boolean;
  recoverySequencingInstabilityDetected: boolean;
  failClosedRecoveryDegradationDetected: boolean;
  explainabilityRecoveryDegradationDetected: boolean;
  sustainableRecoveryDetected: boolean;

  warningCodes: CountyGovernanceEntropyRecoveryDoctrineWarningCode[];
  explainability: CountyGovernanceEntropyRecoveryDoctrineExplainability;

  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const CountyGovernanceEntropyRecoveryDoctrineFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

const feasibilityScore: Record<EntropyRecoveryFeasibilityLevel, number> = {
  unknown: 0,
  nonviable: 5,
  partial: 45,
  recoverable: 70,
  strong: 86,
  institutional: 96,
};

const sustainabilityScore: Record<RecoverySustainabilityLevel, number> = {
  unknown: 0,
  unsustainable: 10,
  strained: 45,
  sustainable: 78,
  self_sustaining: 96,
};

const reversibilityScore: Record<EntropyReversibilityLevel, number> = {
  unknown: 0,
  irreversible: 0,
  difficult: 30,
  partial: 58,
  reversible: 90,
};

const doctrineCoherenceScore: Record<RecoveryDoctrineCoherenceLevel, number> = {
  fragmented: 10,
  partial: 45,
  coherent: 70,
  strong: 86,
  institutional: 96,
};

const sequencingScore: Record<RecoverySequencingStabilityLevel, number> = {
  unknown: 0,
  unstable: 18,
  fragile: 42,
  stable: 72,
  durable: 90,
};

const riskScore: Record<RecoveryRiskLevel, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const failClosedScore: Record<FailClosedRecoveryIntegrityLevel, number> = {
  absent: 0,
  inconsistent: 25,
  partial: 55,
  stable: 72,
  durable: 86,
  institutional: 96,
};

const explainabilityScore: Record<RecoveryExplainabilityLevel, number> = {
  opaque: 0,
  partial: 38,
  adequate: 65,
  strong: 84,
  institutional: 96,
};

const survivabilityScore: Record<LongHorizonRecoverySurvivabilityLevel, number> = {
  unproven: 0,
  declining: 20,
  recovering: 55,
  resilient: 76,
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

const hasRequiredEvidence = (input: CountyGovernanceEntropyRecoveryDoctrineInput): boolean =>
  input.entropyRecoveryFeasibilityLevel !== undefined &&
  input.entropyRecoveryFeasibilityLevel !== null &&
  input.recoverySustainabilityLevel !== undefined &&
  input.recoverySustainabilityLevel !== null &&
  input.entropyReversibilityLevel !== undefined &&
  input.entropyReversibilityLevel !== null &&
  input.recoveryStabilityLevel !== undefined &&
  input.recoveryStabilityLevel !== null &&
  input.recoveryDoctrineCoherenceLevel !== undefined &&
  input.recoveryDoctrineCoherenceLevel !== null &&
  input.recoverySequencingStabilityLevel !== undefined &&
  input.recoverySequencingStabilityLevel !== null &&
  input.stabilizationCostBurdenLevel !== undefined &&
  input.stabilizationCostBurdenLevel !== null &&
  input.recoveryAmplificationRiskLevel !== undefined &&
  input.recoveryAmplificationRiskLevel !== null &&
  input.recoveryDependencyLevel !== undefined &&
  input.recoveryDependencyLevel !== null &&
  input.recoveryContradictionPressureLevel !== undefined &&
  input.recoveryContradictionPressureLevel !== null &&
  input.failClosedRecoveryIntegrityLevel !== undefined &&
  input.failClosedRecoveryIntegrityLevel !== null &&
  input.recoveryExplainabilityLevel !== undefined &&
  input.recoveryExplainabilityLevel !== null &&
  input.longHorizonRecoverySurvivabilityLevel !== undefined &&
  input.longHorizonRecoverySurvivabilityLevel !== null &&
  input.recoveryCollapseExposureLevel !== undefined &&
  input.recoveryCollapseExposureLevel !== null;

const isHighRisk = (level: RecoveryRiskLevel | null | undefined): boolean => level === "high" || level === "critical";

const isWeakFailClosed = (level: FailClosedRecoveryIntegrityLevel | null | undefined): boolean =>
  level === "absent" || level === "inconsistent";

const getSignals = (input: CountyGovernanceEntropyRecoveryDoctrineInput = {}) => {
  const recoveryCycleCount = clampCount(input.recoveryCycleCount);
  const failedRecoveryAttemptCount = clampCount(input.failedRecoveryAttemptCount);
  const recoveryAmplificationEventCount = clampCount(input.recoveryAmplificationEventCount);
  const sequencingInstabilityEventCount = clampCount(input.sequencingInstabilityEventCount);
  const doctrineFragmentationEventCount = clampCount(input.doctrineFragmentationEventCount);
  const recoveryDependencyGrowthCount = clampCount(input.recoveryDependencyGrowthCount);
  const failClosedRecoveryDegradationCount = clampCount(input.failClosedRecoveryDegradationCount);
  const explainabilityRecoveryDegradationCount = clampCount(input.explainabilityRecoveryDegradationCount);
  const evidenceMissing = !hasRequiredEvidence(input);
  const recoveryFeasibilityScore = evidenceMissing
    ? 0
    : average([
        feasibilityScore[input.entropyRecoveryFeasibilityLevel as EntropyRecoveryFeasibilityLevel],
        reversibilityScore[input.entropyReversibilityLevel as EntropyReversibilityLevel],
        survivabilityScore[input.longHorizonRecoverySurvivabilityLevel as LongHorizonRecoverySurvivabilityLevel],
        inverseRisk(countPressure(failedRecoveryAttemptCount, 16)),
      ]);
  const recoverySustainabilityScore = evidenceMissing
    ? 0
    : average([
        sustainabilityScore[input.recoverySustainabilityLevel as RecoverySustainabilityLevel],
        inverseRisk(riskScore[input.stabilizationCostBurdenLevel as RecoveryRiskLevel]),
        inverseRisk(riskScore[input.recoveryDependencyLevel as RecoveryRiskLevel]),
        inverseRisk(countPressure(recoveryCycleCount, 10)),
      ]);
  const doctrineCoherenceScoreValue = evidenceMissing
    ? 0
    : average([
        doctrineCoherenceScore[input.recoveryDoctrineCoherenceLevel as RecoveryDoctrineCoherenceLevel],
        sequencingScore[input.recoverySequencingStabilityLevel as RecoverySequencingStabilityLevel],
        explainabilityScore[input.recoveryExplainabilityLevel as RecoveryExplainabilityLevel],
        inverseRisk(countPressure(doctrineFragmentationEventCount, 18)),
      ]);
  const recoveryAmplificationScore = evidenceMissing
    ? 0
    : average([
        riskScore[input.recoveryAmplificationRiskLevel as RecoveryRiskLevel],
        countPressure(recoveryAmplificationEventCount, 22),
        riskScore[input.recoveryContradictionPressureLevel as RecoveryRiskLevel],
        riskScore[input.stabilizationCostBurdenLevel as RecoveryRiskLevel],
      ]);
  const recoveryTrapScore = evidenceMissing
    ? 0
    : average([
        riskScore[input.recoveryDependencyLevel as RecoveryRiskLevel],
        countPressure(recoveryCycleCount, 12),
        countPressure(failedRecoveryAttemptCount, 18),
        100 - sustainabilityScore[input.recoverySustainabilityLevel as RecoverySustainabilityLevel],
        countPressure(recoveryDependencyGrowthCount, 18),
      ]);
  const nonviableRecoveryScore = evidenceMissing
    ? 0
    : average([
        100 - feasibilityScore[input.entropyRecoveryFeasibilityLevel as EntropyRecoveryFeasibilityLevel],
        riskScore[input.recoveryCollapseExposureLevel as RecoveryRiskLevel],
        countPressure(failedRecoveryAttemptCount, 20),
        100 - survivabilityScore[input.longHorizonRecoverySurvivabilityLevel as LongHorizonRecoverySurvivabilityLevel],
        100 - reversibilityScore[input.entropyReversibilityLevel as EntropyReversibilityLevel],
      ]);
  const irreversibleCollapseScore = evidenceMissing
    ? 0
    : average([
        100 - reversibilityScore[input.entropyReversibilityLevel as EntropyReversibilityLevel],
        riskScore[input.recoveryCollapseExposureLevel as RecoveryRiskLevel],
        riskScore[input.recoveryAmplificationRiskLevel as RecoveryRiskLevel],
        100 - failClosedScore[input.failClosedRecoveryIntegrityLevel as FailClosedRecoveryIntegrityLevel],
        countPressure(failedRecoveryAttemptCount + sequencingInstabilityEventCount, 12),
      ]);
  const failClosedRecoveryIntegrityScore = evidenceMissing
    ? 0
    : average([
        failClosedScore[input.failClosedRecoveryIntegrityLevel as FailClosedRecoveryIntegrityLevel],
        inverseRisk(countPressure(failClosedRecoveryDegradationCount, 22)),
      ]);
  const explainabilityRecoveryIntegrityScore = evidenceMissing
    ? 0
    : average([
        explainabilityScore[input.recoveryExplainabilityLevel as RecoveryExplainabilityLevel],
        inverseRisk(countPressure(explainabilityRecoveryDegradationCount, 22)),
      ]);
  const recoveryAmplificationDetected =
    isHighRisk(input.recoveryAmplificationRiskLevel) ||
    recoveryAmplificationEventCount > 0 ||
    (isHighRisk(input.stabilizationCostBurdenLevel) && isHighRisk(input.recoveryContradictionPressureLevel)) ||
    (failedRecoveryAttemptCount > 0 && recoveryCycleCount >= 3) ||
    (recoveryDependencyGrowthCount > 0 &&
      (input.longHorizonRecoverySurvivabilityLevel === "unproven" ||
        input.longHorizonRecoverySurvivabilityLevel === "declining"));
  const recoveryTrapDetected =
    isHighRisk(input.recoveryDependencyLevel) ||
    recoveryCycleCount >= 4 ||
    failedRecoveryAttemptCount >= 2 ||
    input.recoverySustainabilityLevel === "strained" ||
    input.recoverySustainabilityLevel === "unsustainable" ||
    input.entropyRecoveryFeasibilityLevel === "partial" ||
    input.entropyRecoveryFeasibilityLevel === "nonviable" ||
    recoveryDependencyGrowthCount >= 2;
  const probabilisticNonviableRecoveryDetected =
    nonviableRecoveryScore >= 75 ||
    input.entropyRecoveryFeasibilityLevel === "nonviable" ||
    (isHighRisk(input.recoveryCollapseExposureLevel) && failedRecoveryAttemptCount > 0) ||
    input.longHorizonRecoverySurvivabilityLevel === "unproven" ||
    input.longHorizonRecoverySurvivabilityLevel === "declining" ||
    input.entropyReversibilityLevel === "difficult" ||
    input.entropyReversibilityLevel === "irreversible";
  const irreversibleRecoveryCollapseDetected =
    input.entropyReversibilityLevel === "irreversible" ||
    (input.recoveryCollapseExposureLevel === "critical" && isHighRisk(input.recoveryAmplificationRiskLevel)) ||
    (isWeakFailClosed(input.failClosedRecoveryIntegrityLevel) && isHighRisk(input.recoveryCollapseExposureLevel)) ||
    (failedRecoveryAttemptCount > 0 && sequencingInstabilityEventCount > 0 && isHighRisk(input.recoveryCollapseExposureLevel));
  const failClosedRecoveryDegradationDetected =
    isWeakFailClosed(input.failClosedRecoveryIntegrityLevel) || failClosedRecoveryDegradationCount > 0;
  const doctrineFragmentationDetected =
    input.recoveryDoctrineCoherenceLevel === "fragmented" ||
    doctrineFragmentationEventCount > 0 ||
    doctrineCoherenceScoreValue < 45;
  const recoverySequencingInstabilityDetected =
    input.recoverySequencingStabilityLevel === "unstable" ||
    sequencingInstabilityEventCount > 0 ||
    (input.recoverySequencingStabilityLevel === "fragile" && recoveryCycleCount >= 3);
  const explainabilityRecoveryDegradationDetected =
    input.recoveryExplainabilityLevel === "opaque" ||
    input.recoveryExplainabilityLevel === "partial" ||
    explainabilityRecoveryDegradationCount > 0;
  const sustainableRecoveryDetected =
    recoveryFeasibilityScore >= 75 &&
    recoverySustainabilityScore >= 72 &&
    doctrineCoherenceScoreValue >= 70 &&
    failClosedRecoveryIntegrityScore >= 72 &&
    explainabilityRecoveryIntegrityScore >= 70 &&
    recoveryAmplificationScore < 45 &&
    recoveryTrapScore < 45 &&
    nonviableRecoveryScore < 45 &&
    irreversibleCollapseScore < 45;
  const stabilizationDrivenInstabilityDetected =
    isHighRisk(input.stabilizationCostBurdenLevel) &&
    (recoverySequencingInstabilityDetected || isHighRisk(input.recoveryContradictionPressureLevel));
  const unstableRecoveryDoctrineDetected =
    input.recoveryStabilityLevel === "unstable" ||
    input.recoveryStabilityLevel === "fragile" ||
    input.recoverySequencingStabilityLevel === "fragile";

  return {
    recoveryCycleCount,
    failedRecoveryAttemptCount,
    recoveryAmplificationEventCount,
    sequencingInstabilityEventCount,
    doctrineFragmentationEventCount,
    recoveryDependencyGrowthCount,
    failClosedRecoveryDegradationCount,
    explainabilityRecoveryDegradationCount,
    evidenceMissing,
    recoveryFeasibilityScore,
    recoverySustainabilityScore,
    doctrineCoherenceScore: doctrineCoherenceScoreValue,
    recoveryAmplificationScore,
    recoveryTrapScore,
    nonviableRecoveryScore,
    irreversibleCollapseScore,
    failClosedRecoveryIntegrityScore,
    explainabilityRecoveryIntegrityScore,
    recoveryAmplificationDetected,
    recoveryTrapDetected,
    probabilisticNonviableRecoveryDetected,
    irreversibleRecoveryCollapseDetected,
    failClosedRecoveryDegradationDetected,
    doctrineFragmentationDetected,
    recoverySequencingInstabilityDetected,
    explainabilityRecoveryDegradationDetected,
    sustainableRecoveryDetected,
    stabilizationDrivenInstabilityDetected,
    unstableRecoveryDoctrineDetected,
  };
};

const getDoctrineClassification = (
  input: CountyGovernanceEntropyRecoveryDoctrineInput,
): CountyGovernanceEntropyRecoveryDoctrineClassification => {
  const signals = getSignals(input);

  if (signals.irreversibleRecoveryCollapseDetected) {
    return "irreversible_recovery_collapse";
  }

  if (signals.failClosedRecoveryDegradationDetected) {
    return "fail_closed_recovery_degradation";
  }

  if (signals.probabilisticNonviableRecoveryDetected) {
    return "probabilistically_nonviable_recovery";
  }

  if (signals.recoveryTrapDetected) {
    return "recovery_trapped_governance";
  }

  if (signals.recoveryAmplificationDetected) {
    return "recovery_amplified_entropy";
  }

  if (signals.stabilizationDrivenInstabilityDetected) {
    return "stabilization_driven_instability";
  }

  if (signals.doctrineFragmentationDetected) {
    return "recovery_doctrine_fragmentation";
  }

  if (signals.unstableRecoveryDoctrineDetected) {
    return "unstable_recovery_doctrine";
  }

  if (input.entropyRecoveryFeasibilityLevel === "partial" || input.entropyReversibilityLevel === "partial") {
    return "partially_recoverable_entropy";
  }

  if (signals.sustainableRecoveryDetected) {
    if (
      input.entropyRecoveryFeasibilityLevel === "institutional" &&
      input.recoverySustainabilityLevel === "self_sustaining" &&
      input.recoveryDoctrineCoherenceLevel === "institutional" &&
      input.failClosedRecoveryIntegrityLevel === "institutional" &&
      input.recoveryExplainabilityLevel === "institutional" &&
      input.longHorizonRecoverySurvivabilityLevel === "institutional"
    ) {
      return "institutional_recovery_doctrine";
    }

    return "sustainable_entropy_recovery";
  }

  if (signals.evidenceMissing) {
    return "recovery_doctrine_unverified";
  }

  return "recovery_doctrine_unverified";
};

const getReversibilityClassification = (
  input: CountyGovernanceEntropyRecoveryDoctrineInput,
): CountyGovernanceEntropyRecoveryReversibilityClassification => {
  if (input.entropyReversibilityLevel === "reversible") {
    return "reversible";
  }

  if (input.entropyReversibilityLevel === "partial") {
    return "partially_reversible";
  }

  if (input.entropyReversibilityLevel === "difficult") {
    return "difficult_to_reverse";
  }

  if (input.entropyReversibilityLevel === "irreversible") {
    return "irreversible";
  }

  return "reversibility_unverified";
};

const getStabilityClassification = (
  input: CountyGovernanceEntropyRecoveryDoctrineInput,
): CountyGovernanceEntropyRecoveryStabilityClassification => {
  const signals = getSignals(input);

  if (signals.irreversibleRecoveryCollapseDetected || signals.recoveryAmplificationScore >= 80) {
    return "collapse_reinforcing_recovery";
  }

  if (signals.recoverySequencingInstabilityDetected || input.recoveryStabilityLevel === "unstable") {
    return "unstable_recovery";
  }

  if (input.recoveryStabilityLevel === "fragile" || signals.recoveryTrapScore >= 55) {
    return "fragile_recovery";
  }

  if (signals.sustainableRecoveryDetected && input.recoveryStabilityLevel === "durable") {
    return "stable_recovery";
  }

  return "conditional_recovery";
};

const getWarningCodes = (
  input: CountyGovernanceEntropyRecoveryDoctrineInput,
): CountyGovernanceEntropyRecoveryDoctrineWarningCode[] => {
  const signals = getSignals(input);
  const warningCodes: CountyGovernanceEntropyRecoveryDoctrineWarningCode[] = [];

  if (signals.evidenceMissing) {
    warningCodes.push("S24_RECOVERY_DOCTRINE_UNVERIFIED");
  }

  if (input.recoverySustainabilityLevel === "unsustainable" || isHighRisk(input.stabilizationCostBurdenLevel)) {
    warningCodes.push("S24_RECOVERY_COST_UNSUSTAINABLE");
  }

  if (signals.recoveryAmplificationDetected) {
    warningCodes.push("S24_RECOVERY_AMPLIFIES_ENTROPY");
  }

  if (signals.recoveryTrapDetected) {
    warningCodes.push("S24_RECOVERY_TRAP_DETECTED");
  }

  if (signals.probabilisticNonviableRecoveryDetected) {
    warningCodes.push("S24_PROBABILISTIC_RECOVERY_NONVIABLE");
  }

  if (signals.irreversibleRecoveryCollapseDetected) {
    warningCodes.push("S24_IRREVERSIBLE_RECOVERY_COLLAPSE");
  }

  if (signals.failClosedRecoveryDegradationDetected) {
    warningCodes.push("S24_FAIL_CLOSED_RECOVERY_DEGRADATION");
  }

  if (signals.explainabilityRecoveryDegradationDetected) {
    warningCodes.push("S24_RECOVERY_EXPLAINABILITY_DEGRADATION");
  }

  if (signals.doctrineFragmentationDetected) {
    warningCodes.push("S24_RECOVERY_DOCTRINE_FRAGMENTATION");
  }

  if (signals.recoverySequencingInstabilityDetected) {
    warningCodes.push("S24_RECOVERY_SEQUENCING_INSTABILITY");
  }

  if (signals.stabilizationDrivenInstabilityDetected) {
    warningCodes.push("S24_STABILIZATION_DRIVEN_INSTABILITY");
  }

  if (isHighRisk(input.recoveryDependencyLevel) || signals.recoveryDependencyGrowthCount > 0) {
    warningCodes.push("S24_RECOVERY_DEPENDENCY_UNSUSTAINABLE");
  }

  if (isHighRisk(input.recoveryContradictionPressureLevel)) {
    warningCodes.push("S24_RECOVERY_CONTRADICTION_PRESSURE");
  }

  if (
    input.longHorizonRecoverySurvivabilityLevel === "unproven" ||
    input.longHorizonRecoverySurvivabilityLevel === "declining"
  ) {
    warningCodes.push("S24_LONG_HORIZON_RECOVERY_SURVIVABILITY_WEAK");
  }

  if (getDoctrineClassification(input) !== "institutional_recovery_doctrine") {
    warningCodes.push("S24_INSTITUTIONAL_RECOVERY_DOCTRINE_NOT_PROVEN");
  }

  return warningCodes;
};

export function evaluateCountyGovernanceEntropyRecoveryDoctrine(
  input: CountyGovernanceEntropyRecoveryDoctrineInput = {},
): CountyGovernanceEntropyRecoveryDoctrineResult {
  const signals = getSignals(input);
  const recoveryDoctrineClassification = getDoctrineClassification(input);
  const recoveryReversibilityClassification = getReversibilityClassification(input);
  const recoveryStabilityClassification = getStabilityClassification(input);
  const warningCodes = getWarningCodes(input);

  return {
    recoveryDoctrineClassification,
    recoveryReversibilityClassification,
    recoveryStabilityClassification,
    recoveryFeasibilityScore: signals.recoveryFeasibilityScore,
    recoverySustainabilityScore: signals.recoverySustainabilityScore,
    doctrineCoherenceScore: signals.doctrineCoherenceScore,
    recoveryAmplificationScore: signals.recoveryAmplificationScore,
    recoveryTrapScore: signals.recoveryTrapScore,
    nonviableRecoveryScore: signals.nonviableRecoveryScore,
    irreversibleCollapseScore: signals.irreversibleCollapseScore,
    failClosedRecoveryIntegrityScore: signals.failClosedRecoveryIntegrityScore,
    explainabilityRecoveryIntegrityScore: signals.explainabilityRecoveryIntegrityScore,
    recoveryAmplificationDetected: signals.recoveryAmplificationDetected,
    recoveryTrapDetected: signals.recoveryTrapDetected,
    probabilisticNonviableRecoveryDetected: signals.probabilisticNonviableRecoveryDetected,
    irreversibleRecoveryCollapseDetected: signals.irreversibleRecoveryCollapseDetected,
    doctrineFragmentationDetected: signals.doctrineFragmentationDetected,
    recoverySequencingInstabilityDetected: signals.recoverySequencingInstabilityDetected,
    failClosedRecoveryDegradationDetected: signals.failClosedRecoveryDegradationDetected,
    explainabilityRecoveryDegradationDetected: signals.explainabilityRecoveryDegradationDetected,
    sustainableRecoveryDetected: signals.sustainableRecoveryDetected,
    warningCodes,
    explainability: {
      summary: `County governance entropy recovery doctrine evaluated as ${recoveryDoctrineClassification} with deterministic advisory-only rules.`,
      feasibilityDrivers: [
        `entropy recovery feasibility: ${input.entropyRecoveryFeasibilityLevel ?? "missing"}`,
        `entropy reversibility: ${input.entropyReversibilityLevel ?? "missing"}`,
        `failed recovery attempts: ${signals.failedRecoveryAttemptCount}`,
        `recovery feasibility score: ${signals.recoveryFeasibilityScore}`,
      ],
      sustainabilityDrivers: [
        `recovery sustainability: ${input.recoverySustainabilityLevel ?? "missing"}`,
        `stabilization cost burden: ${input.stabilizationCostBurdenLevel ?? "missing"}`,
        `recovery dependency: ${input.recoveryDependencyLevel ?? "missing"}`,
        `recovery sustainability score: ${signals.recoverySustainabilityScore}`,
      ],
      doctrineCoherenceDrivers: [
        `recovery doctrine coherence: ${input.recoveryDoctrineCoherenceLevel ?? "missing"}`,
        `recovery sequencing stability: ${input.recoverySequencingStabilityLevel ?? "missing"}`,
        `doctrine fragmentation events: ${signals.doctrineFragmentationEventCount}`,
        `doctrine coherence score: ${signals.doctrineCoherenceScore}`,
      ],
      amplificationDrivers: [
        `recovery amplification risk: ${input.recoveryAmplificationRiskLevel ?? "missing"}`,
        `recovery amplification events: ${signals.recoveryAmplificationEventCount}`,
        `recovery contradiction pressure: ${input.recoveryContradictionPressureLevel ?? "missing"}`,
        `recovery amplification score: ${signals.recoveryAmplificationScore}`,
      ],
      recoveryTrapDrivers: [
        `recovery cycles: ${signals.recoveryCycleCount}`,
        `recovery dependency growth events: ${signals.recoveryDependencyGrowthCount}`,
        `recovery trap score: ${signals.recoveryTrapScore}`,
      ],
      nonviabilityDrivers: [
        `nonviable recovery score: ${signals.nonviableRecoveryScore}`,
        signals.probabilisticNonviableRecoveryDetected
          ? "probabilistic recovery nonviability detected deterministically"
          : "probabilistic recovery nonviability not detected",
      ],
      irreversibleCollapseDrivers: [
        `irreversible collapse score: ${signals.irreversibleCollapseScore}`,
        signals.irreversibleRecoveryCollapseDetected
          ? "irreversible recovery collapse detected"
          : "irreversible recovery collapse not detected",
      ],
      failClosedDrivers: [
        `fail-closed recovery integrity: ${input.failClosedRecoveryIntegrityLevel ?? "missing"}`,
        `fail-closed degradation events: ${signals.failClosedRecoveryDegradationCount}`,
        `fail-closed recovery integrity score: ${signals.failClosedRecoveryIntegrityScore}`,
      ],
      warningDerivation: warningCodes.map((warningCode) => `${warningCode} derived from deterministic recovery doctrine thresholds`),
      deterministicRulesApplied: [
        "pure synchronous function",
        "strict string union inputs",
        "counts clamped to non-negative integers",
        "scores use fixed ordinal maps and bounded averages",
        "missing evidence defaults to recovery doctrine unverified",
        "probabilistic nonviability is deterministic and uses no randomness",
        "irreversible recovery collapse and fail-closed degradation override recoverable classifications",
        "all results preserve advisory-only fail-closed execution blocking",
      ],
    },
    ingestionBlocked: CountyGovernanceEntropyRecoveryDoctrineFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountyGovernanceEntropyRecoveryDoctrineFailClosedDefaults.automationBlocked,
    executionBlocked: CountyGovernanceEntropyRecoveryDoctrineFailClosedDefaults.executionBlocked,
    planningOnly: CountyGovernanceEntropyRecoveryDoctrineFailClosedDefaults.planningOnly,
    failClosed: CountyGovernanceEntropyRecoveryDoctrineFailClosedDefaults.failClosed,
  };
}
