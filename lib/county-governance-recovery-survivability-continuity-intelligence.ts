/**
 * Deterministic advisory-only County Governance Recovery Survivability Continuity Intelligence Layer.
 *
 * Planning metadata only. This module evaluates supplied recovery continuity
 * signals and never activates runtime providers, county-source operations,
 * scraping, OCR, parsing, ingestion, normalization, database writes, or automation.
 */

export type CountyGovernanceRecoveryContinuityLevelS21 =
  | "unknown"
  | "broken"
  | "temporary"
  | "stable"
  | "durable"
  | "institutional";

export type CountyGovernancePostRecoverySurvivabilityLevelS21 =
  | "unproven"
  | "temporary"
  | "recovering"
  | "resilient"
  | "durable"
  | "institutional";

export type CountyGovernanceRecoveryFatigueLevelS21 = "none" | "low" | "moderate" | "high" | "critical";

export type CountyGovernanceRepeatedCycleResistanceLevelS21 =
  | "unknown"
  | "weak"
  | "partial"
  | "stable"
  | "strong"
  | "institutional";

export type CountyGovernanceCompoundedFragilityLevelS21 = "none" | "low" | "moderate" | "high" | "critical";
export type CountyGovernanceCompoundedResilienceLevelS21 = "none" | "low" | "moderate" | "strong" | "institutional";
export type CountyGovernanceRepeatedCycleDebtLevelS21 = "none" | "low" | "moderate" | "high" | "critical";
export type CountyGovernanceContinuityExplainabilityLevelS21 =
  | "opaque"
  | "partial"
  | "adequate"
  | "strong"
  | "institutional";

export type CountyGovernanceFailClosedContinuityPreservationS21 =
  | "absent"
  | "inconsistent"
  | "partial"
  | "stable"
  | "durable"
  | "institutional";

export type CountyGovernancePostRecoveryDriftContinuityLevelS21 = "none" | "low" | "moderate" | "high" | "critical";
export type CountyGovernancePostRecoveryContradictionContinuityLevelS21 =
  | "none"
  | "rare"
  | "periodic"
  | "frequent"
  | "persistent";
export type CountyGovernanceFutureCollapseExposureLevelS21 = "none" | "low" | "moderate" | "high" | "critical";
export type CountyGovernanceInstitutionalContinuityCoherenceS21 =
  | "weak"
  | "partial"
  | "stable"
  | "strong"
  | "institutional";
export type CountyGovernanceLongHorizonContinuityLevelS21 =
  | "unproven"
  | "temporary"
  | "stable"
  | "durable"
  | "institutional";

export type CountyGovernanceRecoveryContinuityClassification =
  | "institutional_recovery_continuity"
  | "durable_recovery_continuity"
  | "resilient_recovery_continuity"
  | "stable_recovery_continuity"
  | "temporary_recovery_continuity"
  | "cosmetic_recovery_continuity"
  | "brittle_recovery_continuity"
  | "exhausted_recovery_continuity"
  | "continuity_without_survivability"
  | "survivability_without_continuity"
  | "compounded_fragility"
  | "recovery_fatigue_accumulation"
  | "repeated_cycle_governance_debt"
  | "future_collapse_exposure"
  | "recovery_continuity_unverified"
  | "fail_closed_recovery_continuity_required";

export type CountyGovernanceRecoveryContinuityWarningCode =
  | "S21_RECOVERY_CONTINUITY_UNVERIFIED"
  | "S21_FAIL_CLOSED_CONTINUITY_WEAK"
  | "S21_FUTURE_COLLAPSE_EXPOSURE"
  | "S21_REPEATED_CYCLE_GOVERNANCE_DEBT"
  | "S21_RECOVERY_FATIGUE_ACCUMULATION"
  | "S21_COMPOUNDED_FRAGILITY"
  | "S21_CONTINUITY_WITHOUT_SURVIVABILITY"
  | "S21_SURVIVABILITY_WITHOUT_CONTINUITY"
  | "S21_EXHAUSTED_RECOVERY_CONTINUITY"
  | "S21_COSMETIC_RECOVERY_CONTINUITY"
  | "S21_BRITTLE_RECOVERY_CONTINUITY"
  | "S21_TEMPORARY_RECOVERY_CONTINUITY"
  | "S21_CONTINUITY_EXPLAINABILITY_WEAK"
  | "S21_DRIFT_CONTINUITY_UNSTABLE"
  | "S21_CONTRADICTION_CONTINUITY_UNSTABLE"
  | "S21_ESCALATION_PRESSURE_RECURRENCE"
  | "S21_REPEATED_RECOVERY_CYCLE_RISK"
  | "S21_INSTITUTIONAL_CONTINUITY_NOT_PROVEN"
  | "S21_FAIL_CLOSED_RECOVERY_CONTINUITY_REQUIRED";

export interface CountyGovernanceRecoverySurvivabilityContinuityInput {
  recoveryContinuityLevel?: CountyGovernanceRecoveryContinuityLevelS21 | null;
  postRecoverySurvivabilityLevel?: CountyGovernancePostRecoverySurvivabilityLevelS21 | null;
  recoveryFatigueLevel?: CountyGovernanceRecoveryFatigueLevelS21 | null;
  repeatedCycleResistanceLevel?: CountyGovernanceRepeatedCycleResistanceLevelS21 | null;
  compoundedFragilityLevel?: CountyGovernanceCompoundedFragilityLevelS21 | null;
  compoundedResilienceLevel?: CountyGovernanceCompoundedResilienceLevelS21 | null;
  repeatedCycleGovernanceDebtLevel?: CountyGovernanceRepeatedCycleDebtLevelS21 | null;
  continuityExplainabilityLevel?: CountyGovernanceContinuityExplainabilityLevelS21 | null;
  failClosedContinuityPreservation?: CountyGovernanceFailClosedContinuityPreservationS21 | null;
  postRecoveryDriftContinuityLevel?: CountyGovernancePostRecoveryDriftContinuityLevelS21 | null;
  postRecoveryContradictionContinuityLevel?: CountyGovernancePostRecoveryContradictionContinuityLevelS21 | null;
  futureCollapseExposureLevel?: CountyGovernanceFutureCollapseExposureLevelS21 | null;
  institutionalContinuityCoherence?: CountyGovernanceInstitutionalContinuityCoherenceS21 | null;
  longHorizonContinuityLevel?: CountyGovernanceLongHorizonContinuityLevelS21 | null;
  recoveryCycleCount?: number | null;
  repeatedRecoveryCount?: number | null;
  stressCycleCount?: number | null;
  driftRecurrenceCount?: number | null;
  contradictionRecurrenceCount?: number | null;
  escalationPressureRecurrenceCount?: number | null;
}

export interface CountyGovernanceRecoveryContinuityExplainability {
  summary: string;
  continuityDrivers: string[];
  survivabilityFactors: string[];
  fatigueFactors: string[];
  fragilityFactors: string[];
  debtFactors: string[];
  failClosedFactors: string[];
  deterministicRulesApplied: string[];
}

export interface CountyGovernanceRecoverySurvivabilityContinuityResult {
  recoveryContinuityClassification: CountyGovernanceRecoveryContinuityClassification;
  recoveryContinuityScore: number;
  survivabilityContinuityScore: number;
  fatigueResistanceScore: number;
  compoundedResilienceScore: number;
  repeatedCycleDebtScore: number;
  longHorizonContinuityScore: number;
  recoveryFatigueDetected: boolean;
  compoundedFragilityDetected: boolean;
  compoundedResilienceDetected: boolean;
  continuityWithoutSurvivabilityDetected: boolean;
  survivabilityWithoutContinuityDetected: boolean;
  cosmeticRecoveryContinuityDetected: boolean;
  exhaustedRecoveryContinuityDetected: boolean;
  failClosedContinuityPreserved: boolean;
  futureCollapseExposureDetected: boolean;
  institutionalContinuityDetected: boolean;
  warningCodes: CountyGovernanceRecoveryContinuityWarningCode[];
  explainability: CountyGovernanceRecoveryContinuityExplainability;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const CountyGovernanceRecoveryContinuityFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

const recoveryContinuityScoreMap: Record<CountyGovernanceRecoveryContinuityLevelS21, number> = {
  unknown: 0,
  broken: 10,
  temporary: 30,
  stable: 70,
  durable: 86,
  institutional: 96,
};

const survivabilityScoreMap: Record<CountyGovernancePostRecoverySurvivabilityLevelS21, number> = {
  unproven: 0,
  temporary: 25,
  recovering: 55,
  resilient: 76,
  durable: 88,
  institutional: 96,
};

const fatigueRiskScore: Record<CountyGovernanceRecoveryFatigueLevelS21, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const cycleResistanceScore: Record<CountyGovernanceRepeatedCycleResistanceLevelS21, number> = {
  unknown: 0,
  weak: 24,
  partial: 52,
  stable: 72,
  strong: 86,
  institutional: 96,
};

const fragilityRiskScore: Record<CountyGovernanceCompoundedFragilityLevelS21, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const compoundedResilienceScoreMap: Record<CountyGovernanceCompoundedResilienceLevelS21, number> = {
  none: 0,
  low: 25,
  moderate: 55,
  strong: 84,
  institutional: 96,
};

const debtRiskScore: Record<CountyGovernanceRepeatedCycleDebtLevelS21, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const explainabilityScore: Record<CountyGovernanceContinuityExplainabilityLevelS21, number> = {
  opaque: 0,
  partial: 38,
  adequate: 65,
  strong: 84,
  institutional: 96,
};

const failClosedScore: Record<CountyGovernanceFailClosedContinuityPreservationS21, number> = {
  absent: 0,
  inconsistent: 25,
  partial: 55,
  stable: 72,
  durable: 86,
  institutional: 96,
};

const driftRiskScore: Record<CountyGovernancePostRecoveryDriftContinuityLevelS21, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const contradictionRiskScore: Record<CountyGovernancePostRecoveryContradictionContinuityLevelS21, number> = {
  none: 0,
  rare: 20,
  periodic: 50,
  frequent: 78,
  persistent: 100,
};

const collapseExposureRiskScore: Record<CountyGovernanceFutureCollapseExposureLevelS21, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const institutionalCoherenceScore: Record<CountyGovernanceInstitutionalContinuityCoherenceS21, number> = {
  weak: 10,
  partial: 38,
  stable: 68,
  strong: 86,
  institutional: 96,
};

const longHorizonScore: Record<CountyGovernanceLongHorizonContinuityLevelS21, number> = {
  unproven: 0,
  temporary: 25,
  stable: 70,
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

const hasRequiredEvidence = (input: CountyGovernanceRecoverySurvivabilityContinuityInput): boolean =>
  input.recoveryContinuityLevel !== undefined &&
  input.recoveryContinuityLevel !== null &&
  input.postRecoverySurvivabilityLevel !== undefined &&
  input.postRecoverySurvivabilityLevel !== null &&
  input.recoveryFatigueLevel !== undefined &&
  input.recoveryFatigueLevel !== null &&
  input.repeatedCycleResistanceLevel !== undefined &&
  input.repeatedCycleResistanceLevel !== null &&
  input.compoundedFragilityLevel !== undefined &&
  input.compoundedFragilityLevel !== null &&
  input.compoundedResilienceLevel !== undefined &&
  input.compoundedResilienceLevel !== null &&
  input.repeatedCycleGovernanceDebtLevel !== undefined &&
  input.repeatedCycleGovernanceDebtLevel !== null &&
  input.continuityExplainabilityLevel !== undefined &&
  input.continuityExplainabilityLevel !== null &&
  input.failClosedContinuityPreservation !== undefined &&
  input.failClosedContinuityPreservation !== null &&
  input.postRecoveryDriftContinuityLevel !== undefined &&
  input.postRecoveryDriftContinuityLevel !== null &&
  input.postRecoveryContradictionContinuityLevel !== undefined &&
  input.postRecoveryContradictionContinuityLevel !== null &&
  input.futureCollapseExposureLevel !== undefined &&
  input.futureCollapseExposureLevel !== null &&
  input.institutionalContinuityCoherence !== undefined &&
  input.institutionalContinuityCoherence !== null &&
  input.longHorizonContinuityLevel !== undefined &&
  input.longHorizonContinuityLevel !== null;

const continuityAppearsStable = (level: CountyGovernanceRecoveryContinuityLevelS21 | null | undefined): boolean =>
  level === "stable" || level === "durable" || level === "institutional";

const survivabilityAppearsStrong = (
  level: CountyGovernancePostRecoverySurvivabilityLevelS21 | null | undefined,
): boolean => level === "resilient" || level === "durable" || level === "institutional";

const survivabilityWeak = (level: CountyGovernancePostRecoverySurvivabilityLevelS21 | null | undefined): boolean =>
  level === "unproven" || level === "temporary" || level === "recovering";

const continuityWeak = (level: CountyGovernanceRecoveryContinuityLevelS21 | null | undefined): boolean =>
  level === "unknown" || level === "broken" || level === "temporary";

const failClosedWeak = (level: CountyGovernanceFailClosedContinuityPreservationS21 | null | undefined): boolean =>
  level === "absent" || level === "inconsistent";

const getSignals = (input: CountyGovernanceRecoverySurvivabilityContinuityInput = {}) => {
  const recoveryCycleCount = clampCount(input.recoveryCycleCount);
  const repeatedRecoveryCount = clampCount(input.repeatedRecoveryCount);
  const stressCycleCount = clampCount(input.stressCycleCount);
  const driftRecurrenceCount = clampCount(input.driftRecurrenceCount);
  const contradictionRecurrenceCount = clampCount(input.contradictionRecurrenceCount);
  const escalationPressureRecurrenceCount = clampCount(input.escalationPressureRecurrenceCount);
  const evidenceMissing = !hasRequiredEvidence(input);
  const recoveryContinuityScore = evidenceMissing
    ? 0
    : average([
        recoveryContinuityScoreMap[input.recoveryContinuityLevel as CountyGovernanceRecoveryContinuityLevelS21],
        longHorizonScore[input.longHorizonContinuityLevel as CountyGovernanceLongHorizonContinuityLevelS21],
        institutionalCoherenceScore[
          input.institutionalContinuityCoherence as CountyGovernanceInstitutionalContinuityCoherenceS21
        ],
        failClosedScore[input.failClosedContinuityPreservation as CountyGovernanceFailClosedContinuityPreservationS21],
      ]);
  const survivabilityContinuityScore = evidenceMissing
    ? 0
    : average([
        survivabilityScoreMap[
          input.postRecoverySurvivabilityLevel as CountyGovernancePostRecoverySurvivabilityLevelS21
        ],
        100 - driftRiskScore[input.postRecoveryDriftContinuityLevel as CountyGovernancePostRecoveryDriftContinuityLevelS21],
        100 -
          contradictionRiskScore[
            input.postRecoveryContradictionContinuityLevel as CountyGovernancePostRecoveryContradictionContinuityLevelS21
          ],
        100 - collapseExposureRiskScore[input.futureCollapseExposureLevel as CountyGovernanceFutureCollapseExposureLevelS21],
      ]);
  const fatigueResistanceScore = evidenceMissing
    ? 0
    : average([
        100 - fatigueRiskScore[input.recoveryFatigueLevel as CountyGovernanceRecoveryFatigueLevelS21],
        cycleResistanceScore[input.repeatedCycleResistanceLevel as CountyGovernanceRepeatedCycleResistanceLevelS21],
        Math.max(0, 100 - stressCycleCount * 18),
        Math.max(0, 100 - repeatedRecoveryCount * 14),
      ]);
  const compoundedResilienceScore = evidenceMissing
    ? 0
    : average([
        compoundedResilienceScoreMap[
          input.compoundedResilienceLevel as CountyGovernanceCompoundedResilienceLevelS21
        ],
        longHorizonScore[input.longHorizonContinuityLevel as CountyGovernanceLongHorizonContinuityLevelS21],
        cycleResistanceScore[input.repeatedCycleResistanceLevel as CountyGovernanceRepeatedCycleResistanceLevelS21],
        100 - fragilityRiskScore[input.compoundedFragilityLevel as CountyGovernanceCompoundedFragilityLevelS21],
      ]);
  const repeatedCycleDebtScore = evidenceMissing
    ? 0
    : Math.min(
        100,
        average([
          debtRiskScore[input.repeatedCycleGovernanceDebtLevel as CountyGovernanceRepeatedCycleDebtLevelS21],
          recoveryCycleCount >= 3 ? Math.min(100, 25 + recoveryCycleCount * 10) : 0,
          repeatedRecoveryCount >= 3 ? Math.min(100, 25 + repeatedRecoveryCount * 12) : 0,
          driftRecurrenceCount > 0 ? Math.min(100, 20 + driftRecurrenceCount * 15) : 0,
          contradictionRecurrenceCount > 0 ? Math.min(100, 20 + contradictionRecurrenceCount * 15) : 0,
          escalationPressureRecurrenceCount > 0 ? Math.min(100, 20 + escalationPressureRecurrenceCount * 15) : 0,
        ]),
      );
  const longHorizonContinuityScore = evidenceMissing
    ? 0
    : average([
        longHorizonScore[input.longHorizonContinuityLevel as CountyGovernanceLongHorizonContinuityLevelS21],
        explainabilityScore[input.continuityExplainabilityLevel as CountyGovernanceContinuityExplainabilityLevelS21],
        institutionalCoherenceScore[
          input.institutionalContinuityCoherence as CountyGovernanceInstitutionalContinuityCoherenceS21
        ],
        survivabilityScoreMap[
          input.postRecoverySurvivabilityLevel as CountyGovernancePostRecoverySurvivabilityLevelS21
        ],
      ]);
  const failClosedContinuityPreserved =
    input.failClosedContinuityPreservation === "durable" ||
    input.failClosedContinuityPreservation === "institutional";
  const recoveryFatigueDetected =
    input.recoveryFatigueLevel === "high" ||
    input.recoveryFatigueLevel === "critical" ||
    repeatedRecoveryCount >= 3 ||
    stressCycleCount >= 3 ||
    (survivabilityWeak(input.postRecoverySurvivabilityLevel) && repeatedRecoveryCount >= 2) ||
    escalationPressureRecurrenceCount >= 3;
  const compoundedFragilityDetected =
    input.compoundedFragilityLevel === "high" ||
    input.compoundedFragilityLevel === "critical" ||
    ((repeatedRecoveryCount >= 2 || recoveryCycleCount >= 3) &&
      (driftRecurrenceCount > 0 || contradictionRecurrenceCount > 0)) ||
    (continuityAppearsStable(input.recoveryContinuityLevel) && input.repeatedCycleResistanceLevel === "weak") ||
    ((input.repeatedCycleGovernanceDebtLevel === "moderate" ||
      input.repeatedCycleGovernanceDebtLevel === "high" ||
      input.repeatedCycleGovernanceDebtLevel === "critical") &&
      (input.longHorizonContinuityLevel === "temporary" || input.longHorizonContinuityLevel === "unproven"));
  const compoundedResilienceDetected =
    input.compoundedResilienceLevel === "strong" ||
    input.compoundedResilienceLevel === "institutional";
  const futureCollapseExposureDetected =
    input.futureCollapseExposureLevel === "high" || input.futureCollapseExposureLevel === "critical";
  const continuityWithoutSurvivabilityDetected =
    continuityAppearsStable(input.recoveryContinuityLevel) &&
    (survivabilityWeak(input.postRecoverySurvivabilityLevel) ||
      input.futureCollapseExposureLevel === "moderate" ||
      futureCollapseExposureDetected ||
      input.postRecoveryDriftContinuityLevel === "high" ||
      input.postRecoveryDriftContinuityLevel === "critical" ||
      input.postRecoveryContradictionContinuityLevel === "frequent" ||
      input.postRecoveryContradictionContinuityLevel === "persistent");
  const survivabilityWithoutContinuityDetected =
    survivabilityAppearsStrong(input.postRecoverySurvivabilityLevel) && continuityWeak(input.recoveryContinuityLevel);
  const cosmeticRecoveryContinuityDetected =
    continuityAppearsStable(input.recoveryContinuityLevel) &&
    (input.continuityExplainabilityLevel === "opaque" ||
      input.continuityExplainabilityLevel === "partial" ||
      input.institutionalContinuityCoherence === "weak" ||
      input.institutionalContinuityCoherence === "partial");
  const exhaustedRecoveryContinuityDetected =
    recoveryFatigueDetected &&
    (input.recoveryFatigueLevel === "critical" ||
      stressCycleCount >= 4 ||
      repeatedRecoveryCount >= 4 ||
      (input.repeatedCycleResistanceLevel === "weak" && repeatedRecoveryCount >= 3));
  const repeatedCycleGovernanceDebtDetected =
    input.repeatedCycleGovernanceDebtLevel === "high" ||
    input.repeatedCycleGovernanceDebtLevel === "critical" ||
    repeatedCycleDebtScore >= 55;
  const brittleRecoveryContinuityDetected =
    input.recoveryContinuityLevel === "broken" ||
    input.repeatedCycleResistanceLevel === "weak" ||
    input.longHorizonContinuityLevel === "unproven" ||
    input.postRecoveryDriftContinuityLevel === "high" ||
    input.postRecoveryContradictionContinuityLevel === "frequent";
  const temporaryRecoveryContinuityDetected =
    input.recoveryContinuityLevel === "temporary" ||
    input.postRecoverySurvivabilityLevel === "temporary" ||
    input.longHorizonContinuityLevel === "temporary";
  const institutionalContinuityDetected =
    input.recoveryContinuityLevel === "institutional" &&
    input.postRecoverySurvivabilityLevel === "institutional" &&
    input.compoundedResilienceLevel === "institutional" &&
    input.continuityExplainabilityLevel === "institutional" &&
    input.failClosedContinuityPreservation === "institutional" &&
    input.institutionalContinuityCoherence === "institutional" &&
    input.longHorizonContinuityLevel === "institutional" &&
    !recoveryFatigueDetected &&
    !compoundedFragilityDetected &&
    repeatedCycleDebtScore < 25 &&
    !futureCollapseExposureDetected;
  const failClosedRequired =
    failClosedWeak(input.failClosedContinuityPreservation) ||
    (input.failClosedContinuityPreservation === "partial" &&
      (futureCollapseExposureDetected || repeatedCycleGovernanceDebtDetected || recoveryFatigueDetected));

  return {
    recoveryCycleCount,
    repeatedRecoveryCount,
    stressCycleCount,
    driftRecurrenceCount,
    contradictionRecurrenceCount,
    escalationPressureRecurrenceCount,
    evidenceMissing,
    recoveryContinuityScore,
    survivabilityContinuityScore,
    fatigueResistanceScore,
    compoundedResilienceScore,
    repeatedCycleDebtScore,
    longHorizonContinuityScore,
    recoveryFatigueDetected,
    compoundedFragilityDetected,
    compoundedResilienceDetected,
    continuityWithoutSurvivabilityDetected,
    survivabilityWithoutContinuityDetected,
    cosmeticRecoveryContinuityDetected,
    exhaustedRecoveryContinuityDetected,
    failClosedContinuityPreserved,
    futureCollapseExposureDetected,
    institutionalContinuityDetected,
    repeatedCycleGovernanceDebtDetected,
    brittleRecoveryContinuityDetected,
    temporaryRecoveryContinuityDetected,
    failClosedRequired,
  };
};

const getClassification = (
  input: CountyGovernanceRecoverySurvivabilityContinuityInput,
): CountyGovernanceRecoveryContinuityClassification => {
  const signals = getSignals(input);

  if (signals.failClosedRequired) {
    return "fail_closed_recovery_continuity_required";
  }

  if (signals.futureCollapseExposureDetected) {
    return "future_collapse_exposure";
  }

  if (signals.repeatedCycleGovernanceDebtDetected) {
    return "repeated_cycle_governance_debt";
  }

  if (signals.recoveryFatigueDetected) {
    return "recovery_fatigue_accumulation";
  }

  if (signals.compoundedFragilityDetected) {
    return "compounded_fragility";
  }

  if (signals.continuityWithoutSurvivabilityDetected) {
    return "continuity_without_survivability";
  }

  if (signals.survivabilityWithoutContinuityDetected) {
    return "survivability_without_continuity";
  }

  if (signals.exhaustedRecoveryContinuityDetected) {
    return "exhausted_recovery_continuity";
  }

  if (signals.cosmeticRecoveryContinuityDetected) {
    return "cosmetic_recovery_continuity";
  }

  if (signals.brittleRecoveryContinuityDetected) {
    return "brittle_recovery_continuity";
  }

  if (signals.temporaryRecoveryContinuityDetected) {
    return "temporary_recovery_continuity";
  }

  if (signals.evidenceMissing) {
    return "recovery_continuity_unverified";
  }

  if (signals.institutionalContinuityDetected) {
    return "institutional_recovery_continuity";
  }

  if (
    signals.recoveryContinuityScore >= 84 &&
    signals.survivabilityContinuityScore >= 84 &&
    signals.fatigueResistanceScore >= 80 &&
    signals.compoundedResilienceScore >= 80 &&
    signals.longHorizonContinuityScore >= 84 &&
    signals.repeatedCycleDebtScore < 35
  ) {
    return "durable_recovery_continuity";
  }

  if (
    signals.recoveryContinuityScore >= 74 &&
    signals.survivabilityContinuityScore >= 72 &&
    signals.fatigueResistanceScore >= 68 &&
    signals.compoundedResilienceScore >= 68
  ) {
    return "resilient_recovery_continuity";
  }

  if (signals.recoveryContinuityScore >= 62 && signals.survivabilityContinuityScore >= 60) {
    return "stable_recovery_continuity";
  }

  return "recovery_continuity_unverified";
};

const getWarningCodes = (
  input: CountyGovernanceRecoverySurvivabilityContinuityInput,
): CountyGovernanceRecoveryContinuityWarningCode[] => {
  const signals = getSignals(input);
  const warningCodes: CountyGovernanceRecoveryContinuityWarningCode[] = [];

  if (signals.evidenceMissing) {
    warningCodes.push("S21_RECOVERY_CONTINUITY_UNVERIFIED");
  }

  if (failClosedWeak(input.failClosedContinuityPreservation)) {
    warningCodes.push("S21_FAIL_CLOSED_CONTINUITY_WEAK");
  }

  if (signals.futureCollapseExposureDetected) {
    warningCodes.push("S21_FUTURE_COLLAPSE_EXPOSURE");
  }

  if (signals.repeatedCycleGovernanceDebtDetected) {
    warningCodes.push("S21_REPEATED_CYCLE_GOVERNANCE_DEBT");
  }

  if (signals.recoveryFatigueDetected) {
    warningCodes.push("S21_RECOVERY_FATIGUE_ACCUMULATION");
  }

  if (signals.compoundedFragilityDetected) {
    warningCodes.push("S21_COMPOUNDED_FRAGILITY");
  }

  if (signals.continuityWithoutSurvivabilityDetected) {
    warningCodes.push("S21_CONTINUITY_WITHOUT_SURVIVABILITY");
  }

  if (signals.survivabilityWithoutContinuityDetected) {
    warningCodes.push("S21_SURVIVABILITY_WITHOUT_CONTINUITY");
  }

  if (signals.exhaustedRecoveryContinuityDetected) {
    warningCodes.push("S21_EXHAUSTED_RECOVERY_CONTINUITY");
  }

  if (signals.cosmeticRecoveryContinuityDetected) {
    warningCodes.push("S21_COSMETIC_RECOVERY_CONTINUITY");
  }

  if (signals.brittleRecoveryContinuityDetected) {
    warningCodes.push("S21_BRITTLE_RECOVERY_CONTINUITY");
  }

  if (signals.temporaryRecoveryContinuityDetected) {
    warningCodes.push("S21_TEMPORARY_RECOVERY_CONTINUITY");
  }

  if (input.continuityExplainabilityLevel === "opaque" || input.continuityExplainabilityLevel === "partial") {
    warningCodes.push("S21_CONTINUITY_EXPLAINABILITY_WEAK");
  }

  if (input.postRecoveryDriftContinuityLevel === "high" || input.postRecoveryDriftContinuityLevel === "critical") {
    warningCodes.push("S21_DRIFT_CONTINUITY_UNSTABLE");
  }

  if (
    input.postRecoveryContradictionContinuityLevel === "frequent" ||
    input.postRecoveryContradictionContinuityLevel === "persistent"
  ) {
    warningCodes.push("S21_CONTRADICTION_CONTINUITY_UNSTABLE");
  }

  if (signals.escalationPressureRecurrenceCount >= 2) {
    warningCodes.push("S21_ESCALATION_PRESSURE_RECURRENCE");
  }

  if (signals.repeatedRecoveryCount >= 2 || signals.recoveryCycleCount >= 3) {
    warningCodes.push("S21_REPEATED_RECOVERY_CYCLE_RISK");
  }

  if (!signals.institutionalContinuityDetected) {
    warningCodes.push("S21_INSTITUTIONAL_CONTINUITY_NOT_PROVEN");
  }

  if (signals.failClosedRequired) {
    warningCodes.push("S21_FAIL_CLOSED_RECOVERY_CONTINUITY_REQUIRED");
  }

  return warningCodes;
};

export function evaluateCountyGovernanceRecoverySurvivabilityContinuity(
  input: CountyGovernanceRecoverySurvivabilityContinuityInput = {},
): CountyGovernanceRecoverySurvivabilityContinuityResult {
  const signals = getSignals(input);
  const classification = getClassification(input);

  return {
    recoveryContinuityClassification: classification,
    recoveryContinuityScore: signals.recoveryContinuityScore,
    survivabilityContinuityScore: signals.survivabilityContinuityScore,
    fatigueResistanceScore: signals.fatigueResistanceScore,
    compoundedResilienceScore: signals.compoundedResilienceScore,
    repeatedCycleDebtScore: signals.repeatedCycleDebtScore,
    longHorizonContinuityScore: signals.longHorizonContinuityScore,
    recoveryFatigueDetected: signals.recoveryFatigueDetected,
    compoundedFragilityDetected: signals.compoundedFragilityDetected,
    compoundedResilienceDetected: signals.compoundedResilienceDetected,
    continuityWithoutSurvivabilityDetected: signals.continuityWithoutSurvivabilityDetected,
    survivabilityWithoutContinuityDetected: signals.survivabilityWithoutContinuityDetected,
    cosmeticRecoveryContinuityDetected: signals.cosmeticRecoveryContinuityDetected,
    exhaustedRecoveryContinuityDetected: signals.exhaustedRecoveryContinuityDetected,
    failClosedContinuityPreserved: signals.failClosedContinuityPreserved,
    futureCollapseExposureDetected: signals.futureCollapseExposureDetected,
    institutionalContinuityDetected: signals.institutionalContinuityDetected,
    warningCodes: getWarningCodes(input),
    explainability: {
      summary: `County governance recovery survivability continuity evaluated as ${classification} with deterministic advisory-only rules.`,
      continuityDrivers: [
        `recovery continuity: ${input.recoveryContinuityLevel ?? "missing"}`,
        `long-horizon continuity: ${input.longHorizonContinuityLevel ?? "missing"}`,
        `recovery continuity score: ${signals.recoveryContinuityScore}`,
      ],
      survivabilityFactors: [
        `post-recovery survivability: ${input.postRecoverySurvivabilityLevel ?? "missing"}`,
        `future collapse exposure: ${input.futureCollapseExposureLevel ?? "missing"}`,
        `survivability continuity score: ${signals.survivabilityContinuityScore}`,
      ],
      fatigueFactors: [
        `recovery fatigue: ${input.recoveryFatigueLevel ?? "missing"}`,
        `repeated recovery count: ${signals.repeatedRecoveryCount}`,
        `stress cycle count: ${signals.stressCycleCount}`,
      ],
      fragilityFactors: [
        `compounded fragility: ${input.compoundedFragilityLevel ?? "missing"}`,
        `drift recurrence count: ${signals.driftRecurrenceCount}`,
        `contradiction recurrence count: ${signals.contradictionRecurrenceCount}`,
      ],
      debtFactors: [
        `repeated-cycle governance debt: ${input.repeatedCycleGovernanceDebtLevel ?? "missing"}`,
        `recovery cycle count: ${signals.recoveryCycleCount}`,
        `repeated-cycle debt score: ${signals.repeatedCycleDebtScore}`,
      ],
      failClosedFactors: [
        `fail-closed continuity preservation: ${input.failClosedContinuityPreservation ?? "missing"}`,
        signals.failClosedContinuityPreserved
          ? "fail-closed continuity preserved"
          : "fail-closed continuity not proven durable",
        signals.failClosedRequired
          ? "fail-closed recovery continuity required"
          : "baseline fail-closed controls preserved",
      ],
      deterministicRulesApplied: [
        "strict string union inputs only",
        "counts clamped to non-negative integers",
        "scores use fixed ordinal mappings and bounded averages",
        "missing evidence defaults to recovery continuity unverified",
        "fail-closed weakness, collapse exposure, repeated-cycle debt, fatigue, and fragility override continuity scores",
        "continuity and survivability are evaluated independently",
        "institutional continuity requires survivability, explainability, coherence, fatigue resistance, and fail-closed preservation",
        "all results preserve advisory-only fail-closed execution blocking",
      ],
    },
    ingestionBlocked: CountyGovernanceRecoveryContinuityFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountyGovernanceRecoveryContinuityFailClosedDefaults.automationBlocked,
    executionBlocked: CountyGovernanceRecoveryContinuityFailClosedDefaults.executionBlocked,
    planningOnly: CountyGovernanceRecoveryContinuityFailClosedDefaults.planningOnly,
    failClosed: CountyGovernanceRecoveryContinuityFailClosedDefaults.failClosed,
  };
}
