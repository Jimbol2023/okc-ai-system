/**
 * Deterministic advisory-only County Governance Institutional Durability Exhaustion Intelligence Layer.
 *
 * Planning metadata only. This module evaluates supplied institutional durability
 * exhaustion signals and never activates runtime providers, county-source operations,
 * scraping, OCR, parsing, ingestion, normalization, database writes, or automation.
 */

export type CountyGovernanceInstitutionalDurabilityLevelS22 =
  | "unknown"
  | "temporary"
  | "stable"
  | "structural"
  | "institutional";

export type CountyGovernanceDurabilitySustainabilityLevelS22 =
  | "unproven"
  | "weak"
  | "partial"
  | "sustainable"
  | "self_sustaining";

export type CountyGovernanceRiskLevelS22 = "none" | "low" | "moderate" | "high" | "critical";

export type CountyGovernanceFailClosedDurabilityLevelS22 =
  | "absent"
  | "inconsistent"
  | "partial"
  | "stable"
  | "durable"
  | "institutional";

export type CountyGovernanceExplainabilityDurabilityLevelS22 =
  | "opaque"
  | "partial"
  | "adequate"
  | "strong"
  | "institutional";

export type CountyGovernanceInstitutionalCoherenceLevelS22 =
  | "collapsed"
  | "weak"
  | "partial"
  | "stable"
  | "strong"
  | "institutional";

export type CountyGovernanceRecoveryInfrastructureLoadLevelS22 =
  | "none"
  | "low"
  | "moderate"
  | "high"
  | "overloaded";

export type CountyGovernanceExhaustionReversibilityLevelS22 =
  | "unknown"
  | "recoverable"
  | "partially_recoverable"
  | "difficult"
  | "irreversible";

export type CountyGovernanceLongHorizonResilienceLevelS22 =
  | "unproven"
  | "degrading"
  | "stable"
  | "durable"
  | "self_sustaining";

export type CountyGovernanceDurabilityExhaustionClassification =
  | "self_sustaining_institutional_durability"
  | "structural_durability"
  | "sustainable_durability"
  | "temporary_durability"
  | "cosmetic_institutional_durability"
  | "resilience_exhaustion"
  | "governance_fatigue_saturation"
  | "compounded_exhaustion_debt"
  | "survivability_induced_fragility"
  | "resilience_as_risk_vector"
  | "fail_closed_durability_decay"
  | "explainability_exhaustion"
  | "institutional_coherence_decay"
  | "recovery_infrastructure_overload"
  | "irreversible_exhaustion"
  | "future_exhaustion_collapse_exposure"
  | "durability_exhaustion_unverified"
  | "fail_closed_exhaustion_required";

export type CountyGovernanceDurabilityExhaustionWarningCode =
  | "S22_DURABILITY_EXHAUSTION_UNVERIFIED"
  | "S22_FAIL_CLOSED_EXHAUSTION_REQUIRED"
  | "S22_FAIL_CLOSED_DURABILITY_DECAY"
  | "S22_FUTURE_EXHAUSTION_COLLAPSE_EXPOSURE"
  | "S22_IRREVERSIBLE_EXHAUSTION"
  | "S22_RECOVERY_INFRASTRUCTURE_OVERLOAD"
  | "S22_INSTITUTIONAL_COHERENCE_DECAY"
  | "S22_EXPLAINABILITY_EXHAUSTION"
  | "S22_COMPOUNDED_EXHAUSTION_DEBT"
  | "S22_GOVERNANCE_FATIGUE_SATURATION"
  | "S22_RESILIENCE_EXHAUSTION"
  | "S22_SURVIVABILITY_INDUCED_FRAGILITY"
  | "S22_RESILIENCE_AS_RISK_VECTOR"
  | "S22_COSMETIC_INSTITUTIONAL_DURABILITY"
  | "S22_TEMPORARY_DURABILITY_ONLY"
  | "S22_CHRONIC_RECOVERY_BURDEN"
  | "S22_LONG_HORIZON_RESILIENCE_DEGRADING"
  | "S22_INSTITUTIONAL_DURABILITY_NOT_PROVEN";

export interface CountyGovernanceInstitutionalDurabilityExhaustionInput {
  institutionalDurabilityLevel?: CountyGovernanceInstitutionalDurabilityLevelS22 | null;
  durabilitySustainabilityLevel?: CountyGovernanceDurabilitySustainabilityLevelS22 | null;
  resilienceExhaustionLevel?: CountyGovernanceRiskLevelS22 | null;
  governanceFatigueSaturationLevel?: CountyGovernanceRiskLevelS22 | null;
  exhaustionDebtLevel?: CountyGovernanceRiskLevelS22 | null;
  chronicRecoveryBurdenLevel?: CountyGovernanceRiskLevelS22 | null;
  survivabilityInducedFragilityLevel?: CountyGovernanceRiskLevelS22 | null;
  failClosedDurabilityLevel?: CountyGovernanceFailClosedDurabilityLevelS22 | null;
  explainabilityDurabilityLevel?: CountyGovernanceExplainabilityDurabilityLevelS22 | null;
  institutionalCoherenceLevel?: CountyGovernanceInstitutionalCoherenceLevelS22 | null;
  recoveryInfrastructureLoadLevel?: CountyGovernanceRecoveryInfrastructureLoadLevelS22 | null;
  futureExhaustionCollapseExposure?: CountyGovernanceRiskLevelS22 | null;
  exhaustionReversibilityLevel?: CountyGovernanceExhaustionReversibilityLevelS22 | null;
  resilienceRiskVectorLevel?: CountyGovernanceRiskLevelS22 | null;
  longHorizonResilienceLevel?: CountyGovernanceLongHorizonResilienceLevelS22 | null;
  resilienceCycleCount?: number | null;
  recoveryMaintenanceCycleCount?: number | null;
  chronicStressCycleCount?: number | null;
  governanceDebtAccumulationCount?: number | null;
  failClosedDecayEventCount?: number | null;
  explainabilityDegradationCount?: number | null;
  coherenceDecayEventCount?: number | null;
}

export interface CountyGovernanceDurabilityExhaustionExplainability {
  summary: string;
  durabilityDrivers: string[];
  exhaustionFactors: string[];
  debtFactors: string[];
  coherenceFactors: string[];
  failClosedFactors: string[];
  resilienceRiskFactors: string[];
  deterministicRulesApplied: string[];
}

export interface CountyGovernanceInstitutionalDurabilityExhaustionResult {
  durabilityExhaustionClassification: CountyGovernanceDurabilityExhaustionClassification;
  durabilitySustainabilityScore: number;
  exhaustionRiskScore: number;
  fatigueSaturationScore: number;
  exhaustionDebtScore: number;
  institutionalCoherenceScore: number;
  failClosedDurabilityScore: number;
  longHorizonResilienceScore: number;
  sustainableDurabilityDetected: boolean;
  structuralDurabilityDetected: boolean;
  cosmeticInstitutionalDurabilityDetected: boolean;
  resilienceExhaustionDetected: boolean;
  survivabilityInducedFragilityDetected: boolean;
  resilienceAsRiskVectorDetected: boolean;
  compoundedExhaustionDebtDetected: boolean;
  failClosedDurabilityDecayDetected: boolean;
  explainabilityExhaustionDetected: boolean;
  institutionalCoherenceDecayDetected: boolean;
  recoveryInfrastructureOverloaded: boolean;
  irreversibleExhaustionDetected: boolean;
  recoverableExhaustionDetected: boolean;
  futureExhaustionCollapseExposureDetected: boolean;
  warningCodes: CountyGovernanceDurabilityExhaustionWarningCode[];
  explainability: CountyGovernanceDurabilityExhaustionExplainability;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const CountyGovernanceDurabilityExhaustionFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

const durabilityScore: Record<CountyGovernanceInstitutionalDurabilityLevelS22, number> = {
  unknown: 0,
  temporary: 28,
  stable: 68,
  structural: 86,
  institutional: 96,
};

const sustainabilityScore: Record<CountyGovernanceDurabilitySustainabilityLevelS22, number> = {
  unproven: 0,
  weak: 24,
  partial: 52,
  sustainable: 82,
  self_sustaining: 96,
};

const riskScore: Record<CountyGovernanceRiskLevelS22, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const failClosedScore: Record<CountyGovernanceFailClosedDurabilityLevelS22, number> = {
  absent: 0,
  inconsistent: 25,
  partial: 55,
  stable: 72,
  durable: 86,
  institutional: 96,
};

const explainabilityScore: Record<CountyGovernanceExplainabilityDurabilityLevelS22, number> = {
  opaque: 0,
  partial: 38,
  adequate: 65,
  strong: 84,
  institutional: 96,
};

const coherenceScore: Record<CountyGovernanceInstitutionalCoherenceLevelS22, number> = {
  collapsed: 0,
  weak: 20,
  partial: 45,
  stable: 68,
  strong: 86,
  institutional: 96,
};

const infrastructureLoadRiskScore: Record<CountyGovernanceRecoveryInfrastructureLoadLevelS22, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  overloaded: 100,
};

const longHorizonScore: Record<CountyGovernanceLongHorizonResilienceLevelS22, number> = {
  unproven: 0,
  degrading: 20,
  stable: 70,
  durable: 88,
  self_sustaining: 96,
};

const average = (scores: readonly number[]): number =>
  Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);

const clampCount = (count: number | null | undefined): number => {
  if (typeof count !== "number" || Number.isNaN(count)) {
    return 0;
  }

  return Math.max(0, Math.floor(count));
};

const hasRequiredEvidence = (input: CountyGovernanceInstitutionalDurabilityExhaustionInput): boolean =>
  input.institutionalDurabilityLevel !== undefined &&
  input.institutionalDurabilityLevel !== null &&
  input.durabilitySustainabilityLevel !== undefined &&
  input.durabilitySustainabilityLevel !== null &&
  input.resilienceExhaustionLevel !== undefined &&
  input.resilienceExhaustionLevel !== null &&
  input.governanceFatigueSaturationLevel !== undefined &&
  input.governanceFatigueSaturationLevel !== null &&
  input.exhaustionDebtLevel !== undefined &&
  input.exhaustionDebtLevel !== null &&
  input.chronicRecoveryBurdenLevel !== undefined &&
  input.chronicRecoveryBurdenLevel !== null &&
  input.survivabilityInducedFragilityLevel !== undefined &&
  input.survivabilityInducedFragilityLevel !== null &&
  input.failClosedDurabilityLevel !== undefined &&
  input.failClosedDurabilityLevel !== null &&
  input.explainabilityDurabilityLevel !== undefined &&
  input.explainabilityDurabilityLevel !== null &&
  input.institutionalCoherenceLevel !== undefined &&
  input.institutionalCoherenceLevel !== null &&
  input.recoveryInfrastructureLoadLevel !== undefined &&
  input.recoveryInfrastructureLoadLevel !== null &&
  input.futureExhaustionCollapseExposure !== undefined &&
  input.futureExhaustionCollapseExposure !== null &&
  input.exhaustionReversibilityLevel !== undefined &&
  input.exhaustionReversibilityLevel !== null &&
  input.resilienceRiskVectorLevel !== undefined &&
  input.resilienceRiskVectorLevel !== null &&
  input.longHorizonResilienceLevel !== undefined &&
  input.longHorizonResilienceLevel !== null;

const isHighRisk = (level: CountyGovernanceRiskLevelS22 | null | undefined): boolean =>
  level === "high" || level === "critical";

const failClosedWeak = (level: CountyGovernanceFailClosedDurabilityLevelS22 | null | undefined): boolean =>
  level === "absent" || level === "inconsistent";

const getSignals = (input: CountyGovernanceInstitutionalDurabilityExhaustionInput = {}) => {
  const resilienceCycleCount = clampCount(input.resilienceCycleCount);
  const recoveryMaintenanceCycleCount = clampCount(input.recoveryMaintenanceCycleCount);
  const chronicStressCycleCount = clampCount(input.chronicStressCycleCount);
  const governanceDebtAccumulationCount = clampCount(input.governanceDebtAccumulationCount);
  const failClosedDecayEventCount = clampCount(input.failClosedDecayEventCount);
  const explainabilityDegradationCount = clampCount(input.explainabilityDegradationCount);
  const coherenceDecayEventCount = clampCount(input.coherenceDecayEventCount);
  const evidenceMissing = !hasRequiredEvidence(input);
  const durabilitySustainabilityScore = evidenceMissing
    ? 0
    : average([
        durabilityScore[input.institutionalDurabilityLevel as CountyGovernanceInstitutionalDurabilityLevelS22],
        sustainabilityScore[input.durabilitySustainabilityLevel as CountyGovernanceDurabilitySustainabilityLevelS22],
        longHorizonScore[input.longHorizonResilienceLevel as CountyGovernanceLongHorizonResilienceLevelS22],
        failClosedScore[input.failClosedDurabilityLevel as CountyGovernanceFailClosedDurabilityLevelS22],
      ]);
  const exhaustionRiskScore = evidenceMissing
    ? 0
    : average([
        riskScore[input.resilienceExhaustionLevel as CountyGovernanceRiskLevelS22],
        riskScore[input.chronicRecoveryBurdenLevel as CountyGovernanceRiskLevelS22],
        riskScore[input.futureExhaustionCollapseExposure as CountyGovernanceRiskLevelS22],
        infrastructureLoadRiskScore[
          input.recoveryInfrastructureLoadLevel as CountyGovernanceRecoveryInfrastructureLoadLevelS22
        ],
      ]);
  const fatigueSaturationScore = evidenceMissing
    ? 0
    : Math.min(
        100,
        average([
          riskScore[input.governanceFatigueSaturationLevel as CountyGovernanceRiskLevelS22],
          resilienceCycleCount >= 3 ? Math.min(100, 25 + resilienceCycleCount * 10) : 0,
          recoveryMaintenanceCycleCount >= 3 ? Math.min(100, 25 + recoveryMaintenanceCycleCount * 10) : 0,
          chronicStressCycleCount >= 2 ? Math.min(100, 25 + chronicStressCycleCount * 14) : 0,
        ]),
      );
  const exhaustionDebtScore = evidenceMissing
    ? 0
    : Math.min(
        100,
        average([
          riskScore[input.exhaustionDebtLevel as CountyGovernanceRiskLevelS22],
          governanceDebtAccumulationCount > 0 ? Math.min(100, 25 + governanceDebtAccumulationCount * 15) : 0,
          riskScore[input.chronicRecoveryBurdenLevel as CountyGovernanceRiskLevelS22],
          recoveryMaintenanceCycleCount >= 3 ? Math.min(100, 25 + recoveryMaintenanceCycleCount * 10) : 0,
        ]),
      );
  const institutionalCoherenceScore = evidenceMissing
    ? 0
    : average([
        coherenceScore[input.institutionalCoherenceLevel as CountyGovernanceInstitutionalCoherenceLevelS22],
        explainabilityScore[input.explainabilityDurabilityLevel as CountyGovernanceExplainabilityDurabilityLevelS22],
        longHorizonScore[input.longHorizonResilienceLevel as CountyGovernanceLongHorizonResilienceLevelS22],
        Math.max(0, 100 - coherenceDecayEventCount * 18),
      ]);
  const failClosedDurabilityScore = evidenceMissing
    ? 0
    : average([
        failClosedScore[input.failClosedDurabilityLevel as CountyGovernanceFailClosedDurabilityLevelS22],
        Math.max(0, 100 - failClosedDecayEventCount * 22),
      ]);
  const longHorizonResilienceScore = evidenceMissing
    ? 0
    : average([
        longHorizonScore[input.longHorizonResilienceLevel as CountyGovernanceLongHorizonResilienceLevelS22],
        sustainabilityScore[input.durabilitySustainabilityLevel as CountyGovernanceDurabilitySustainabilityLevelS22],
        100 - riskScore[input.resilienceRiskVectorLevel as CountyGovernanceRiskLevelS22],
      ]);
  const sustainableDurabilityDetected =
    durabilitySustainabilityScore >= 78 &&
    exhaustionRiskScore < 45 &&
    exhaustionDebtScore < 45 &&
    failClosedDurabilityScore >= 72;
  const structuralDurabilityDetected =
    input.institutionalDurabilityLevel === "structural" || input.institutionalDurabilityLevel === "institutional";
  const cosmeticInstitutionalDurabilityDetected =
    input.institutionalDurabilityLevel === "institutional" &&
    (input.durabilitySustainabilityLevel === "weak" ||
      input.durabilitySustainabilityLevel === "partial" ||
      input.longHorizonResilienceLevel === "degrading" ||
      input.explainabilityDurabilityLevel === "opaque" ||
      input.explainabilityDurabilityLevel === "partial" ||
      input.institutionalCoherenceLevel === "weak" ||
      input.institutionalCoherenceLevel === "partial");
  const recoveryInfrastructureOverloaded = input.recoveryInfrastructureLoadLevel === "overloaded";
  const resilienceExhaustionDetected =
    isHighRisk(input.resilienceExhaustionLevel) ||
    resilienceCycleCount >= 4 ||
    isHighRisk(input.chronicRecoveryBurdenLevel) ||
    input.longHorizonResilienceLevel === "degrading" ||
    isHighRisk(input.governanceFatigueSaturationLevel) ||
    recoveryInfrastructureOverloaded;
  const survivabilityInducedFragilityDetected =
    isHighRisk(input.survivabilityInducedFragilityLevel) ||
    isHighRisk(input.resilienceRiskVectorLevel) ||
    (isHighRisk(input.chronicRecoveryBurdenLevel) && recoveryMaintenanceCycleCount >= 3) ||
    (input.institutionalDurabilityLevel === "institutional" &&
      (input.durabilitySustainabilityLevel === "weak" || input.durabilitySustainabilityLevel === "partial")) ||
    (resilienceCycleCount >= 4 && input.longHorizonResilienceLevel === "degrading");
  const resilienceAsRiskVectorDetected = isHighRisk(input.resilienceRiskVectorLevel) || survivabilityInducedFragilityDetected;
  const compoundedExhaustionDebtDetected =
    isHighRisk(input.exhaustionDebtLevel) ||
    exhaustionDebtScore >= 60 ||
    governanceDebtAccumulationCount >= 3 ||
    (isHighRisk(input.chronicRecoveryBurdenLevel) && recoveryMaintenanceCycleCount >= 3);
  const failClosedDurabilityDecayDetected =
    failClosedWeak(input.failClosedDurabilityLevel) ||
    failClosedDecayEventCount > 0 ||
    failClosedDurabilityScore < 55;
  const explainabilityExhaustionDetected =
    input.explainabilityDurabilityLevel === "opaque" ||
    input.explainabilityDurabilityLevel === "partial" ||
    explainabilityDegradationCount >= 2;
  const institutionalCoherenceDecayDetected =
    input.institutionalCoherenceLevel === "collapsed" ||
    input.institutionalCoherenceLevel === "weak" ||
    coherenceDecayEventCount >= 2;
  const futureExhaustionCollapseExposureDetected = isHighRisk(input.futureExhaustionCollapseExposure);
  const irreversibleExhaustionDetected =
    input.exhaustionReversibilityLevel === "irreversible" ||
    (input.futureExhaustionCollapseExposure === "critical" && isHighRisk(input.exhaustionDebtLevel)) ||
    (input.institutionalCoherenceLevel === "collapsed" && isHighRisk(input.chronicRecoveryBurdenLevel)) ||
    (failClosedDecayEventCount >= 2 && isHighRisk(input.resilienceExhaustionLevel)) ||
    (input.longHorizonResilienceLevel === "degrading" && recoveryInfrastructureOverloaded);
  const recoverableExhaustionDetected =
    (input.exhaustionReversibilityLevel === "recoverable" ||
      input.exhaustionReversibilityLevel === "partially_recoverable") &&
    !irreversibleExhaustionDetected &&
    (resilienceExhaustionDetected || isHighRisk(input.governanceFatigueSaturationLevel));
  const failClosedExhaustionRequired =
    input.failClosedDurabilityLevel === "absent" ||
    (input.failClosedDurabilityLevel === "inconsistent" &&
      (resilienceExhaustionDetected || futureExhaustionCollapseExposureDetected || compoundedExhaustionDebtDetected)) ||
    (failClosedDecayEventCount >= 2 && futureExhaustionCollapseExposureDetected);

  return {
    resilienceCycleCount,
    recoveryMaintenanceCycleCount,
    chronicStressCycleCount,
    governanceDebtAccumulationCount,
    failClosedDecayEventCount,
    explainabilityDegradationCount,
    coherenceDecayEventCount,
    evidenceMissing,
    durabilitySustainabilityScore,
    exhaustionRiskScore,
    fatigueSaturationScore,
    exhaustionDebtScore,
    institutionalCoherenceScore,
    failClosedDurabilityScore,
    longHorizonResilienceScore,
    sustainableDurabilityDetected,
    structuralDurabilityDetected,
    cosmeticInstitutionalDurabilityDetected,
    resilienceExhaustionDetected,
    survivabilityInducedFragilityDetected,
    resilienceAsRiskVectorDetected,
    compoundedExhaustionDebtDetected,
    failClosedDurabilityDecayDetected,
    explainabilityExhaustionDetected,
    institutionalCoherenceDecayDetected,
    recoveryInfrastructureOverloaded,
    irreversibleExhaustionDetected,
    recoverableExhaustionDetected,
    futureExhaustionCollapseExposureDetected,
    failClosedExhaustionRequired,
  };
};

const getClassification = (
  input: CountyGovernanceInstitutionalDurabilityExhaustionInput,
): CountyGovernanceDurabilityExhaustionClassification => {
  const signals = getSignals(input);

  if (signals.failClosedExhaustionRequired) {
    return "fail_closed_exhaustion_required";
  }

  if (signals.futureExhaustionCollapseExposureDetected) {
    return "future_exhaustion_collapse_exposure";
  }

  if (signals.irreversibleExhaustionDetected) {
    return "irreversible_exhaustion";
  }

  if (signals.recoveryInfrastructureOverloaded) {
    return "recovery_infrastructure_overload";
  }

  if (signals.institutionalCoherenceDecayDetected) {
    return "institutional_coherence_decay";
  }

  if (signals.failClosedDurabilityDecayDetected) {
    return "fail_closed_durability_decay";
  }

  if (signals.explainabilityExhaustionDetected) {
    return "explainability_exhaustion";
  }

  if (signals.compoundedExhaustionDebtDetected) {
    return "compounded_exhaustion_debt";
  }

  if (isHighRisk(input.governanceFatigueSaturationLevel)) {
    return "governance_fatigue_saturation";
  }

  if (signals.resilienceExhaustionDetected) {
    return "resilience_exhaustion";
  }

  if (signals.survivabilityInducedFragilityDetected) {
    return "survivability_induced_fragility";
  }

  if (signals.resilienceAsRiskVectorDetected) {
    return "resilience_as_risk_vector";
  }

  if (signals.cosmeticInstitutionalDurabilityDetected) {
    return "cosmetic_institutional_durability";
  }

  if (input.institutionalDurabilityLevel === "temporary" || input.durabilitySustainabilityLevel === "unproven") {
    return "temporary_durability";
  }

  if (signals.evidenceMissing) {
    return "durability_exhaustion_unverified";
  }

  if (
    input.institutionalDurabilityLevel === "institutional" &&
    input.durabilitySustainabilityLevel === "self_sustaining" &&
    input.longHorizonResilienceLevel === "self_sustaining" &&
    input.failClosedDurabilityLevel === "institutional" &&
    input.explainabilityDurabilityLevel === "institutional" &&
    input.institutionalCoherenceLevel === "institutional" &&
    signals.durabilitySustainabilityScore >= 92 &&
    signals.exhaustionRiskScore < 25 &&
    signals.exhaustionDebtScore < 25
  ) {
    return "self_sustaining_institutional_durability";
  }

  if (
    signals.structuralDurabilityDetected &&
    signals.sustainableDurabilityDetected &&
    signals.institutionalCoherenceScore >= 82
  ) {
    return "structural_durability";
  }

  if (signals.sustainableDurabilityDetected) {
    return "sustainable_durability";
  }

  return "durability_exhaustion_unverified";
};

const getWarningCodes = (
  input: CountyGovernanceInstitutionalDurabilityExhaustionInput,
): CountyGovernanceDurabilityExhaustionWarningCode[] => {
  const signals = getSignals(input);
  const warningCodes: CountyGovernanceDurabilityExhaustionWarningCode[] = [];

  if (signals.evidenceMissing) {
    warningCodes.push("S22_DURABILITY_EXHAUSTION_UNVERIFIED");
  }

  if (signals.failClosedExhaustionRequired) {
    warningCodes.push("S22_FAIL_CLOSED_EXHAUSTION_REQUIRED");
  }

  if (signals.failClosedDurabilityDecayDetected) {
    warningCodes.push("S22_FAIL_CLOSED_DURABILITY_DECAY");
  }

  if (signals.futureExhaustionCollapseExposureDetected) {
    warningCodes.push("S22_FUTURE_EXHAUSTION_COLLAPSE_EXPOSURE");
  }

  if (signals.irreversibleExhaustionDetected) {
    warningCodes.push("S22_IRREVERSIBLE_EXHAUSTION");
  }

  if (signals.recoveryInfrastructureOverloaded) {
    warningCodes.push("S22_RECOVERY_INFRASTRUCTURE_OVERLOAD");
  }

  if (signals.institutionalCoherenceDecayDetected) {
    warningCodes.push("S22_INSTITUTIONAL_COHERENCE_DECAY");
  }

  if (signals.explainabilityExhaustionDetected) {
    warningCodes.push("S22_EXPLAINABILITY_EXHAUSTION");
  }

  if (signals.compoundedExhaustionDebtDetected) {
    warningCodes.push("S22_COMPOUNDED_EXHAUSTION_DEBT");
  }

  if (isHighRisk(input.governanceFatigueSaturationLevel)) {
    warningCodes.push("S22_GOVERNANCE_FATIGUE_SATURATION");
  }

  if (signals.resilienceExhaustionDetected) {
    warningCodes.push("S22_RESILIENCE_EXHAUSTION");
  }

  if (signals.survivabilityInducedFragilityDetected) {
    warningCodes.push("S22_SURVIVABILITY_INDUCED_FRAGILITY");
  }

  if (signals.resilienceAsRiskVectorDetected) {
    warningCodes.push("S22_RESILIENCE_AS_RISK_VECTOR");
  }

  if (signals.cosmeticInstitutionalDurabilityDetected) {
    warningCodes.push("S22_COSMETIC_INSTITUTIONAL_DURABILITY");
  }

  if (input.institutionalDurabilityLevel === "temporary" || input.durabilitySustainabilityLevel === "unproven") {
    warningCodes.push("S22_TEMPORARY_DURABILITY_ONLY");
  }

  if (isHighRisk(input.chronicRecoveryBurdenLevel)) {
    warningCodes.push("S22_CHRONIC_RECOVERY_BURDEN");
  }

  if (input.longHorizonResilienceLevel === "degrading") {
    warningCodes.push("S22_LONG_HORIZON_RESILIENCE_DEGRADING");
  }

  if (getClassification(input) !== "self_sustaining_institutional_durability") {
    warningCodes.push("S22_INSTITUTIONAL_DURABILITY_NOT_PROVEN");
  }

  return warningCodes;
};

export function evaluateCountyGovernanceInstitutionalDurabilityExhaustion(
  input: CountyGovernanceInstitutionalDurabilityExhaustionInput = {},
): CountyGovernanceInstitutionalDurabilityExhaustionResult {
  const signals = getSignals(input);
  const classification = getClassification(input);

  return {
    durabilityExhaustionClassification: classification,
    durabilitySustainabilityScore: signals.durabilitySustainabilityScore,
    exhaustionRiskScore: signals.exhaustionRiskScore,
    fatigueSaturationScore: signals.fatigueSaturationScore,
    exhaustionDebtScore: signals.exhaustionDebtScore,
    institutionalCoherenceScore: signals.institutionalCoherenceScore,
    failClosedDurabilityScore: signals.failClosedDurabilityScore,
    longHorizonResilienceScore: signals.longHorizonResilienceScore,
    sustainableDurabilityDetected: signals.sustainableDurabilityDetected,
    structuralDurabilityDetected: signals.structuralDurabilityDetected,
    cosmeticInstitutionalDurabilityDetected: signals.cosmeticInstitutionalDurabilityDetected,
    resilienceExhaustionDetected: signals.resilienceExhaustionDetected,
    survivabilityInducedFragilityDetected: signals.survivabilityInducedFragilityDetected,
    resilienceAsRiskVectorDetected: signals.resilienceAsRiskVectorDetected,
    compoundedExhaustionDebtDetected: signals.compoundedExhaustionDebtDetected,
    failClosedDurabilityDecayDetected: signals.failClosedDurabilityDecayDetected,
    explainabilityExhaustionDetected: signals.explainabilityExhaustionDetected,
    institutionalCoherenceDecayDetected: signals.institutionalCoherenceDecayDetected,
    recoveryInfrastructureOverloaded: signals.recoveryInfrastructureOverloaded,
    irreversibleExhaustionDetected: signals.irreversibleExhaustionDetected,
    recoverableExhaustionDetected: signals.recoverableExhaustionDetected,
    futureExhaustionCollapseExposureDetected: signals.futureExhaustionCollapseExposureDetected,
    warningCodes: getWarningCodes(input),
    explainability: {
      summary: `County governance institutional durability exhaustion evaluated as ${classification} with deterministic advisory-only rules.`,
      durabilityDrivers: [
        `institutional durability: ${input.institutionalDurabilityLevel ?? "missing"}`,
        `durability sustainability: ${input.durabilitySustainabilityLevel ?? "missing"}`,
        `durability sustainability score: ${signals.durabilitySustainabilityScore}`,
      ],
      exhaustionFactors: [
        `resilience exhaustion: ${input.resilienceExhaustionLevel ?? "missing"}`,
        `chronic recovery burden: ${input.chronicRecoveryBurdenLevel ?? "missing"}`,
        `exhaustion risk score: ${signals.exhaustionRiskScore}`,
      ],
      debtFactors: [
        `exhaustion debt: ${input.exhaustionDebtLevel ?? "missing"}`,
        `governance debt accumulation count: ${signals.governanceDebtAccumulationCount}`,
        `exhaustion debt score: ${signals.exhaustionDebtScore}`,
      ],
      coherenceFactors: [
        `institutional coherence: ${input.institutionalCoherenceLevel ?? "missing"}`,
        `coherence decay events: ${signals.coherenceDecayEventCount}`,
        `institutional coherence score: ${signals.institutionalCoherenceScore}`,
      ],
      failClosedFactors: [
        `fail-closed durability: ${input.failClosedDurabilityLevel ?? "missing"}`,
        `fail-closed decay events: ${signals.failClosedDecayEventCount}`,
        `fail-closed durability score: ${signals.failClosedDurabilityScore}`,
      ],
      resilienceRiskFactors: [
        `survivability-induced fragility: ${input.survivabilityInducedFragilityLevel ?? "missing"}`,
        `resilience risk vector: ${input.resilienceRiskVectorLevel ?? "missing"}`,
        `long-horizon resilience: ${input.longHorizonResilienceLevel ?? "missing"}`,
      ],
      deterministicRulesApplied: [
        "strict string union inputs only",
        "counts clamped to non-negative integers",
        "scores use fixed ordinal mappings and bounded averages",
        "missing evidence defaults to durability exhaustion unverified",
        "fail-closed exhaustion, collapse exposure, irreversible exhaustion, overload, decay, and debt override durability scores",
        "institutional appearance cannot bypass sustainability, coherence, explainability, or exhaustion checks",
        "resilience can be classified as either protective capacity or future risk amplification",
        "all results preserve advisory-only fail-closed execution blocking",
      ],
    },
    ingestionBlocked: CountyGovernanceDurabilityExhaustionFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountyGovernanceDurabilityExhaustionFailClosedDefaults.automationBlocked,
    executionBlocked: CountyGovernanceDurabilityExhaustionFailClosedDefaults.executionBlocked,
    planningOnly: CountyGovernanceDurabilityExhaustionFailClosedDefaults.planningOnly,
    failClosed: CountyGovernanceDurabilityExhaustionFailClosedDefaults.failClosed,
  };
}
