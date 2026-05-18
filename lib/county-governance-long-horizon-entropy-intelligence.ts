/**
 * Deterministic advisory-only County Governance Long-Horizon Entropy Intelligence Layer.
 *
 * Planning metadata only. This module evaluates supplied governance entropy signals
 * and never activates runtime providers, county-source operations, scraping, OCR,
 * parsing, ingestion, normalization, database writes, or automation.
 */

export type GovernanceEntropyClassification =
  | "stable_order"
  | "temporary_order"
  | "entropy_accumulating"
  | "entropy_accelerating"
  | "entropy_saturated"
  | "irreversible_entropy";

export type GovernanceStabilityClassification =
  | "stable"
  | "conditionally_stable"
  | "fragile"
  | "probabilistically_unstable"
  | "structurally_unstable"
  | "entropy_collapse_exposed";

export type GovernanceSustainabilityClassification =
  | "sustainable"
  | "maintenance_heavy"
  | "declining_efficiency"
  | "unsustainable"
  | "irrecoverable";

export type GovernanceEntropyWarningCode =
  | "ENTROPY_ACCUMULATION_DETECTED"
  | "COHERENCE_EROSION_DETECTED"
  | "STABILIZATION_COST_ESCALATING"
  | "RESILIENCE_EFFICIENCY_DECAY"
  | "SURVIVABILITY_OVERHEAD_EXCESSIVE"
  | "FAIL_CLOSED_DECAY_DETECTED"
  | "EXPLAINABILITY_ENTROPY_DETECTED"
  | "PROBABILISTIC_INSTABILITY_DETECTED"
  | "ENTROPY_SATURATION_DETECTED"
  | "IRREVERSIBLE_ENTROPY_DETECTED"
  | "LONG_HORIZON_SUSTAINABILITY_FAILURE"
  | "CHRONIC_COMPLEXITY_PRESSURE"
  | "CONTRADICTION_RECURRENCE_ACCELERATION";

export interface CountyGovernanceLongHorizonEntropyInput {
  governanceComplexityScore: number;
  governanceDriftScore: number;
  contradictionRecurrenceScore: number;
  survivabilityMaintenanceLoadScore: number;
  resilienceEfficiencyScore: number;
  institutionalDurabilityScore: number;
  stabilizationCostScore: number;
  explainabilityIntegrityScore: number;
  failClosedIntegrityScore: number;
  governanceRecoveryPressureScore: number;
  governanceCoherenceScore: number;
  governanceSaturationPressureScore: number;
}

export interface CountyGovernanceEntropyExplainability {
  summary: string;
  entropyAccumulationDrivers: string[];
  coherenceErosionDrivers: string[];
  stabilizationEscalationContributors: string[];
  resilienceDegradationContributors: string[];
  saturationReasoning: string[];
  instabilityReasoning: string[];
  irreversibleEntropyReasoning: string[];
  sustainabilityReasoning: string[];
  warningDerivation: string[];
  deterministicRulesApplied: string[];
}

export interface CountyGovernanceLongHorizonEntropyResult {
  entropyClassification: GovernanceEntropyClassification;
  governanceStabilityClassification: GovernanceStabilityClassification;
  sustainabilityClassification: GovernanceSustainabilityClassification;

  entropyAccumulationScore: number;
  coherenceErosionScore: number;
  stabilizationCostEscalationScore: number;
  resilienceEfficiencyDecayScore: number;
  entropySaturationScore: number;
  irreversibleEntropyScore: number;
  probabilisticInstabilityScore: number;

  entropyWarnings: GovernanceEntropyWarningCode[];

  explainability: CountyGovernanceEntropyExplainability;

  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const CountyGovernanceEntropyFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

const clampScore = (score: number): number => {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
};

const inverseScore = (score: number): number => 100 - score;

const average = (scores: readonly number[]): number =>
  Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);

const getSignals = (input: CountyGovernanceLongHorizonEntropyInput) => {
  const governanceComplexityScore = clampScore(input.governanceComplexityScore);
  const governanceDriftScore = clampScore(input.governanceDriftScore);
  const contradictionRecurrenceScore = clampScore(input.contradictionRecurrenceScore);
  const survivabilityMaintenanceLoadScore = clampScore(input.survivabilityMaintenanceLoadScore);
  const resilienceEfficiencyScore = clampScore(input.resilienceEfficiencyScore);
  const institutionalDurabilityScore = clampScore(input.institutionalDurabilityScore);
  const stabilizationCostScore = clampScore(input.stabilizationCostScore);
  const explainabilityIntegrityScore = clampScore(input.explainabilityIntegrityScore);
  const failClosedIntegrityScore = clampScore(input.failClosedIntegrityScore);
  const governanceRecoveryPressureScore = clampScore(input.governanceRecoveryPressureScore);
  const governanceCoherenceScore = clampScore(input.governanceCoherenceScore);
  const governanceSaturationPressureScore = clampScore(input.governanceSaturationPressureScore);
  const resilienceEfficiencyDecayScore = inverseScore(resilienceEfficiencyScore);
  const coherenceErosionScore = average([
    inverseScore(governanceCoherenceScore),
    inverseScore(explainabilityIntegrityScore),
    contradictionRecurrenceScore,
  ]);
  const entropyAccumulationScore = average([
    governanceDriftScore,
    contradictionRecurrenceScore,
    survivabilityMaintenanceLoadScore,
    governanceRecoveryPressureScore,
    governanceComplexityScore,
  ]);
  const stabilizationCostEscalationScore = average([
    entropyAccumulationScore,
    resilienceEfficiencyDecayScore,
    survivabilityMaintenanceLoadScore,
    stabilizationCostScore,
  ]);
  const entropySaturationScore = average([
    entropyAccumulationScore,
    stabilizationCostEscalationScore,
    resilienceEfficiencyDecayScore,
    governanceSaturationPressureScore,
  ]);
  const irreversibleEntropyScore = average([
    entropySaturationScore,
    inverseScore(failClosedIntegrityScore),
    inverseScore(explainabilityIntegrityScore),
    resilienceEfficiencyDecayScore,
    inverseScore(institutionalDurabilityScore),
  ]);
  const probabilisticInstabilityScore = average([
    entropyAccumulationScore,
    contradictionRecurrenceScore,
    governanceDriftScore,
    stabilizationCostEscalationScore,
    coherenceErosionScore,
    inverseScore(failClosedIntegrityScore),
  ]);
  const entropySaturated =
    entropyAccumulationScore >= 75 &&
    stabilizationCostEscalationScore >= 75 &&
    resilienceEfficiencyDecayScore >= 70 &&
    entropySaturationScore >= 75;
  const irreversibleEntropy =
    entropySaturated &&
    entropySaturationScore >= 85 &&
    failClosedIntegrityScore <= 35 &&
    explainabilityIntegrityScore <= 40 &&
    resilienceEfficiencyScore <= 30;
  const probabilisticInstabilityDetected = probabilisticInstabilityScore >= 70;
  const sustainabilityFailure =
    irreversibleEntropy ||
    entropySaturationScore >= 82 ||
    (stabilizationCostEscalationScore >= 78 && resilienceEfficiencyDecayScore >= 70) ||
    (survivabilityMaintenanceLoadScore >= 80 && institutionalDurabilityScore <= 50);

  return {
    governanceComplexityScore,
    governanceDriftScore,
    contradictionRecurrenceScore,
    survivabilityMaintenanceLoadScore,
    resilienceEfficiencyScore,
    institutionalDurabilityScore,
    stabilizationCostScore,
    explainabilityIntegrityScore,
    failClosedIntegrityScore,
    governanceRecoveryPressureScore,
    governanceCoherenceScore,
    governanceSaturationPressureScore,
    entropyAccumulationScore,
    coherenceErosionScore,
    stabilizationCostEscalationScore,
    resilienceEfficiencyDecayScore,
    entropySaturationScore,
    irreversibleEntropyScore,
    probabilisticInstabilityScore,
    entropySaturated,
    irreversibleEntropy,
    probabilisticInstabilityDetected,
    sustainabilityFailure,
  };
};

const getEntropyClassification = (
  input: CountyGovernanceLongHorizonEntropyInput,
): GovernanceEntropyClassification => {
  const signals = getSignals(input);

  if (signals.irreversibleEntropy) {
    return "irreversible_entropy";
  }

  if (signals.entropySaturated) {
    return "entropy_saturated";
  }

  if (signals.entropyAccumulationScore >= 70 || signals.stabilizationCostEscalationScore >= 72) {
    return "entropy_accelerating";
  }

  if (signals.entropyAccumulationScore >= 45 || signals.coherenceErosionScore >= 50) {
    return "entropy_accumulating";
  }

  if (signals.survivabilityMaintenanceLoadScore >= 35 || signals.governanceRecoveryPressureScore >= 35) {
    return "temporary_order";
  }

  return "stable_order";
};

const getStabilityClassification = (
  input: CountyGovernanceLongHorizonEntropyInput,
): GovernanceStabilityClassification => {
  const signals = getSignals(input);

  if (signals.irreversibleEntropy || signals.entropySaturationScore >= 88) {
    return "entropy_collapse_exposed";
  }

  if (signals.entropySaturated || signals.failClosedIntegrityScore <= 35 || signals.institutionalDurabilityScore <= 35) {
    return "structurally_unstable";
  }

  if (signals.probabilisticInstabilityDetected) {
    return "probabilistically_unstable";
  }

  if (signals.entropyAccumulationScore >= 50 || signals.coherenceErosionScore >= 50) {
    return "fragile";
  }

  if (signals.stabilizationCostEscalationScore >= 35 || signals.survivabilityMaintenanceLoadScore >= 35) {
    return "conditionally_stable";
  }

  return "stable";
};

const getSustainabilityClassification = (
  input: CountyGovernanceLongHorizonEntropyInput,
): GovernanceSustainabilityClassification => {
  const signals = getSignals(input);

  if (signals.irreversibleEntropy) {
    return "irrecoverable";
  }

  if (signals.sustainabilityFailure) {
    return "unsustainable";
  }

  if (signals.resilienceEfficiencyDecayScore >= 60 || signals.stabilizationCostEscalationScore >= 65) {
    return "declining_efficiency";
  }

  if (signals.survivabilityMaintenanceLoadScore >= 45 || signals.governanceRecoveryPressureScore >= 45) {
    return "maintenance_heavy";
  }

  return "sustainable";
};

const getWarningCodes = (input: CountyGovernanceLongHorizonEntropyInput): GovernanceEntropyWarningCode[] => {
  const signals = getSignals(input);
  const warningCodes: GovernanceEntropyWarningCode[] = [];

  if (signals.entropyAccumulationScore >= 45) {
    warningCodes.push("ENTROPY_ACCUMULATION_DETECTED");
  }

  if (signals.coherenceErosionScore >= 45) {
    warningCodes.push("COHERENCE_EROSION_DETECTED");
  }

  if (signals.stabilizationCostEscalationScore >= 55) {
    warningCodes.push("STABILIZATION_COST_ESCALATING");
  }

  if (signals.resilienceEfficiencyDecayScore >= 45) {
    warningCodes.push("RESILIENCE_EFFICIENCY_DECAY");
  }

  if (signals.survivabilityMaintenanceLoadScore >= 70) {
    warningCodes.push("SURVIVABILITY_OVERHEAD_EXCESSIVE");
  }

  if (signals.failClosedIntegrityScore <= 55) {
    warningCodes.push("FAIL_CLOSED_DECAY_DETECTED");
  }

  if (signals.explainabilityIntegrityScore <= 55) {
    warningCodes.push("EXPLAINABILITY_ENTROPY_DETECTED");
  }

  if (signals.probabilisticInstabilityDetected) {
    warningCodes.push("PROBABILISTIC_INSTABILITY_DETECTED");
  }

  if (signals.entropySaturated) {
    warningCodes.push("ENTROPY_SATURATION_DETECTED");
  }

  if (signals.irreversibleEntropy) {
    warningCodes.push("IRREVERSIBLE_ENTROPY_DETECTED");
  }

  if (signals.sustainabilityFailure) {
    warningCodes.push("LONG_HORIZON_SUSTAINABILITY_FAILURE");
  }

  if (signals.governanceComplexityScore >= 70) {
    warningCodes.push("CHRONIC_COMPLEXITY_PRESSURE");
  }

  if (signals.contradictionRecurrenceScore >= 65) {
    warningCodes.push("CONTRADICTION_RECURRENCE_ACCELERATION");
  }

  return warningCodes;
};

export function evaluateCountyGovernanceLongHorizonEntropy(
  input: CountyGovernanceLongHorizonEntropyInput,
): CountyGovernanceLongHorizonEntropyResult {
  const signals = getSignals(input);
  const entropyClassification = getEntropyClassification(input);
  const governanceStabilityClassification = getStabilityClassification(input);
  const sustainabilityClassification = getSustainabilityClassification(input);
  const entropyWarnings = getWarningCodes(input);

  return {
    entropyClassification,
    governanceStabilityClassification,
    sustainabilityClassification,
    entropyAccumulationScore: signals.entropyAccumulationScore,
    coherenceErosionScore: signals.coherenceErosionScore,
    stabilizationCostEscalationScore: signals.stabilizationCostEscalationScore,
    resilienceEfficiencyDecayScore: signals.resilienceEfficiencyDecayScore,
    entropySaturationScore: signals.entropySaturationScore,
    irreversibleEntropyScore: signals.irreversibleEntropyScore,
    probabilisticInstabilityScore: signals.probabilisticInstabilityScore,
    entropyWarnings,
    explainability: {
      summary: `County governance long-horizon entropy evaluated as ${entropyClassification} with deterministic advisory-only rules.`,
      entropyAccumulationDrivers: [
        `governance drift: ${signals.governanceDriftScore}`,
        `contradiction recurrence: ${signals.contradictionRecurrenceScore}`,
        `survivability maintenance load: ${signals.survivabilityMaintenanceLoadScore}`,
        `governance recovery pressure: ${signals.governanceRecoveryPressureScore}`,
        `governance complexity: ${signals.governanceComplexityScore}`,
      ],
      coherenceErosionDrivers: [
        `governance coherence erosion pressure: ${100 - signals.governanceCoherenceScore}`,
        `explainability erosion pressure: ${100 - signals.explainabilityIntegrityScore}`,
        `contradiction recurrence: ${signals.contradictionRecurrenceScore}`,
      ],
      stabilizationEscalationContributors: [
        `entropy accumulation: ${signals.entropyAccumulationScore}`,
        `resilience efficiency decay: ${signals.resilienceEfficiencyDecayScore}`,
        `survivability maintenance load: ${signals.survivabilityMaintenanceLoadScore}`,
        `stabilization cost: ${signals.stabilizationCostScore}`,
      ],
      resilienceDegradationContributors: [
        `resilience efficiency: ${signals.resilienceEfficiencyScore}`,
        `resilience efficiency decay: ${signals.resilienceEfficiencyDecayScore}`,
        `stabilization cost escalation: ${signals.stabilizationCostEscalationScore}`,
      ],
      saturationReasoning: [
        signals.entropySaturated
          ? "entropy accumulation, stabilization escalation, and resilience decay jointly exceeded saturation thresholds"
          : "entropy saturation thresholds were not jointly exceeded",
        `entropy saturation score: ${signals.entropySaturationScore}`,
      ],
      instabilityReasoning: [
        signals.probabilisticInstabilityDetected
          ? "deterministic instability score exceeded probabilistic instability threshold"
          : "deterministic instability score remained below probabilistic instability threshold",
        `probabilistic instability score: ${signals.probabilisticInstabilityScore}`,
      ],
      irreversibleEntropyReasoning: [
        signals.irreversibleEntropy
          ? "irreversible entropy triggered from extreme saturation with degraded fail-closed, explainability, and resilience efficiency"
          : "irreversible entropy trigger conditions were not all present",
        `irreversible entropy score: ${signals.irreversibleEntropyScore}`,
      ],
      sustainabilityReasoning: [
        `sustainability classification: ${sustainabilityClassification}`,
        signals.sustainabilityFailure
          ? "long-horizon sustainability failure detected"
          : "long-horizon sustainability failure not detected",
      ],
      warningDerivation: entropyWarnings.map((warningCode) => `${warningCode} derived from deterministic entropy thresholds`),
      deterministicRulesApplied: [
        "pure synchronous function",
        "all numeric inputs clamped between 0 and 100",
        "NaN and non-number inputs normalize to 0",
        "scores use fixed bounded averages",
        "probabilistic instability is a deterministic score and uses no randomness",
        "entropy saturation overrides superficial resilience appearance",
        "irreversible entropy overrides recoverable classifications",
        "all results preserve advisory-only fail-closed execution blocking",
      ],
    },
    ingestionBlocked: CountyGovernanceEntropyFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountyGovernanceEntropyFailClosedDefaults.automationBlocked,
    executionBlocked: CountyGovernanceEntropyFailClosedDefaults.executionBlocked,
    planningOnly: CountyGovernanceEntropyFailClosedDefaults.planningOnly,
    failClosed: CountyGovernanceEntropyFailClosedDefaults.failClosed,
  };
}
