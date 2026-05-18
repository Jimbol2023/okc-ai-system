/**
 * Deterministic advisory-only County Governance Recovery Integrity Intelligence Layer.
 *
 * Planning metadata only. This module evaluates supplied governance recovery
 * integrity signals and never activates runtime providers, county-source
 * operations, scraping, OCR, parsing, ingestion, normalization, database writes,
 * or automation.
 */

export type CountyGovernanceRecoveryStatusS20 =
  | "not_started"
  | "partial"
  | "operational"
  | "stabilized"
  | "durable"
  | "institutional";

export type CountyGovernanceRecoveryDurabilityLevelS20 =
  | "unknown"
  | "temporary"
  | "brittle"
  | "stable"
  | "durable"
  | "institutional";

export type CountyGovernanceRecoveryIntegrityLevelS20 =
  | "unknown"
  | "weak"
  | "partial"
  | "credible"
  | "strong"
  | "institutional";

export type CountyGovernanceDebtLevelS20 = "none" | "low" | "moderate" | "high" | "critical";

export type CountyGovernancePostRecoveryStabilityLevelS20 =
  | "unknown"
  | "unstable"
  | "fragile"
  | "stable"
  | "durable"
  | "stress_tested";

export type CountyGovernanceExplainabilityPersistenceLevelS20 =
  | "opaque"
  | "partial"
  | "adequate"
  | "strong"
  | "institutional";

export type CountyGovernanceFailClosedRecoveryDisciplineS20 =
  | "absent"
  | "inconsistent"
  | "partial"
  | "stable"
  | "durable"
  | "institutional";

export type CountyGovernanceContradictionPersistenceLevelS20 =
  | "none"
  | "rare"
  | "periodic"
  | "frequent"
  | "persistent";

export type CountyGovernanceDriftAmplificationLevelS20 = "none" | "low" | "moderate" | "high" | "critical";

export type CountyGovernanceDegradationCycleResistanceS20 =
  | "unknown"
  | "weak"
  | "partial"
  | "stable"
  | "strong"
  | "institutional";

export type CountyGovernanceRecoveryReversibilityS20 =
  | "unknown"
  | "reversible"
  | "partially_reversible"
  | "difficult"
  | "irreversible";

export type CountyGovernanceSurvivabilityPersistenceLevelS20 =
  | "unproven"
  | "temporary"
  | "recovering"
  | "resilient"
  | "durable"
  | "institutional";

export type CountyGovernanceCollapseRiskLevelS20 = "none" | "low" | "moderate" | "high" | "critical";
export type CountyGovernanceUnresolvedFailureSuppressionS20 = "none" | "low" | "moderate" | "high" | "critical";

export type CountyGovernanceRecoveryClassification =
  | "institutional_recovery_integrity"
  | "durable_integrity_preserving_recovery"
  | "resilient_recovery"
  | "operational_recovery"
  | "temporary_recovery"
  | "cosmetic_recovery"
  | "brittle_recovery"
  | "unstable_recovery"
  | "recovery_without_integrity"
  | "governance_debt_accumulation"
  | "recovery_induced_instability"
  | "recovery_induced_drift_amplification"
  | "irreversible_governance_degradation"
  | "post_recovery_collapse_risk"
  | "recovery_integrity_unverified"
  | "fail_closed_recovery_required";

export type CountyGovernanceRecoveryIntegrityWarningCode =
  | "S20_RECOVERY_INTEGRITY_UNVERIFIED"
  | "S20_COSMETIC_RECOVERY_DETECTED"
  | "S20_RECOVERY_WITHOUT_INTEGRITY"
  | "S20_GOVERNANCE_DEBT_ACCUMULATING"
  | "S20_GOVERNANCE_DEBT_CRITICAL"
  | "S20_FAIL_CLOSED_RECOVERY_DISCIPLINE_WEAK"
  | "S20_RECOVERY_EXPLAINABILITY_WEAK"
  | "S20_RECOVERY_CONTRADICTIONS_PERSIST"
  | "S20_RECOVERY_DRIFT_AMPLIFICATION"
  | "S20_RECOVERY_INDUCED_INSTABILITY"
  | "S20_TEMPORARY_RECOVERY_ONLY"
  | "S20_BRITTLE_RECOVERY_PATTERN"
  | "S20_IRREVERSIBLE_DEGRADATION_RISK"
  | "S20_POST_RECOVERY_COLLAPSE_RISK"
  | "S20_UNRESOLVED_FAILURE_SUPPRESSION"
  | "S20_REPEATED_DEGRADATION_CYCLE_RISK"
  | "S20_SURVIVABILITY_DAMAGED_BY_RECOVERY"
  | "S20_INSTITUTIONAL_RECOVERY_NOT_PROVEN"
  | "S20_FAIL_CLOSED_RECOVERY_REQUIRED";

export interface CountyGovernanceRecoveryIntegrityInput {
  recoveryStatus?: CountyGovernanceRecoveryStatusS20 | null;
  recoveryDurabilityLevel?: CountyGovernanceRecoveryDurabilityLevelS20 | null;
  recoveryIntegrityLevel?: CountyGovernanceRecoveryIntegrityLevelS20 | null;
  governanceDebtLevel?: CountyGovernanceDebtLevelS20 | null;
  postRecoveryStabilityLevel?: CountyGovernancePostRecoveryStabilityLevelS20 | null;
  explainabilityPersistenceLevel?: CountyGovernanceExplainabilityPersistenceLevelS20 | null;
  failClosedRecoveryDiscipline?: CountyGovernanceFailClosedRecoveryDisciplineS20 | null;
  contradictionPersistenceLevel?: CountyGovernanceContradictionPersistenceLevelS20 | null;
  driftAmplificationLevel?: CountyGovernanceDriftAmplificationLevelS20 | null;
  degradationCycleResistance?: CountyGovernanceDegradationCycleResistanceS20 | null;
  recoveryReversibility?: CountyGovernanceRecoveryReversibilityS20 | null;
  survivabilityPersistenceLevel?: CountyGovernanceSurvivabilityPersistenceLevelS20 | null;
  collapseRiskLevel?: CountyGovernanceCollapseRiskLevelS20 | null;
  unresolvedFailureSuppression?: CountyGovernanceUnresolvedFailureSuppressionS20 | null;
  recoveryCycleCount?: number | null;
  unresolvedGovernanceFailureCount?: number | null;
  repeatedDegradationCount?: number | null;
}

export interface CountyGovernanceRecoveryIntegrityExplainability {
  summary: string;
  recoveryDrivers: string[];
  integrityFactors: string[];
  governanceDebtFactors: string[];
  degradationFactors: string[];
  instabilitySignals: string[];
  failClosedSignals: string[];
  deterministicRulesApplied: string[];
}

export interface CountyGovernanceRecoveryIntegrityResult {
  recoveryClassification: CountyGovernanceRecoveryClassification;
  recoveryScore: number;
  recoveryIntegrityScore: number;
  governanceDebtScore: number;
  recoveryStabilityScore: number;
  degradationResistanceScore: number;
  cosmeticRecoveryDetected: boolean;
  governanceDebtAccumulating: boolean;
  recoveryWithoutIntegrityDetected: boolean;
  recoveryInducedInstabilityDetected: boolean;
  recoveryInducedDriftAmplificationDetected: boolean;
  failClosedRecoveryDurable: boolean;
  postRecoveryCollapseRisk: boolean;
  reversibleRecovery: boolean;
  durableRecoveryDetected: boolean;
  warningCodes: CountyGovernanceRecoveryIntegrityWarningCode[];
  explainability: CountyGovernanceRecoveryIntegrityExplainability;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const CountyGovernanceRecoveryIntegrityFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

const recoveryStatusScore: Record<CountyGovernanceRecoveryStatusS20, number> = {
  not_started: 0,
  partial: 25,
  operational: 55,
  stabilized: 72,
  durable: 88,
  institutional: 96,
};

const recoveryDurabilityScore: Record<CountyGovernanceRecoveryDurabilityLevelS20, number> = {
  unknown: 0,
  temporary: 25,
  brittle: 40,
  stable: 70,
  durable: 86,
  institutional: 96,
};

const recoveryIntegrityScoreMap: Record<CountyGovernanceRecoveryIntegrityLevelS20, number> = {
  unknown: 0,
  weak: 20,
  partial: 42,
  credible: 68,
  strong: 86,
  institutional: 96,
};

const governanceDebtRiskScore: Record<CountyGovernanceDebtLevelS20, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const postRecoveryStabilityScore: Record<CountyGovernancePostRecoveryStabilityLevelS20, number> = {
  unknown: 0,
  unstable: 20,
  fragile: 40,
  stable: 70,
  durable: 86,
  stress_tested: 96,
};

const explainabilityScore: Record<CountyGovernanceExplainabilityPersistenceLevelS20, number> = {
  opaque: 0,
  partial: 38,
  adequate: 65,
  strong: 84,
  institutional: 96,
};

const failClosedScore: Record<CountyGovernanceFailClosedRecoveryDisciplineS20, number> = {
  absent: 0,
  inconsistent: 25,
  partial: 55,
  stable: 72,
  durable: 86,
  institutional: 96,
};

const contradictionRiskScore: Record<CountyGovernanceContradictionPersistenceLevelS20, number> = {
  none: 0,
  rare: 20,
  periodic: 50,
  frequent: 78,
  persistent: 100,
};

const driftAmplificationRiskScore: Record<CountyGovernanceDriftAmplificationLevelS20, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const degradationResistanceScoreMap: Record<CountyGovernanceDegradationCycleResistanceS20, number> = {
  unknown: 0,
  weak: 24,
  partial: 52,
  stable: 72,
  strong: 86,
  institutional: 96,
};

const recoveryReversibilityScore: Record<CountyGovernanceRecoveryReversibilityS20, number> = {
  unknown: 0,
  reversible: 90,
  partially_reversible: 62,
  difficult: 30,
  irreversible: 0,
};

const survivabilityPersistenceScore: Record<CountyGovernanceSurvivabilityPersistenceLevelS20, number> = {
  unproven: 0,
  temporary: 25,
  recovering: 55,
  resilient: 76,
  durable: 88,
  institutional: 96,
};

const collapseRiskScore: Record<CountyGovernanceCollapseRiskLevelS20, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const unresolvedSuppressionRiskScore: Record<CountyGovernanceUnresolvedFailureSuppressionS20, number> = {
  none: 0,
  low: 20,
  moderate: 50,
  high: 78,
  critical: 100,
};

const average = (scores: readonly number[]): number =>
  Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);

const clampCount = (count: number | null | undefined): number => {
  if (typeof count !== "number" || Number.isNaN(count)) {
    return 0;
  }

  return Math.max(0, Math.floor(count));
};

const hasRequiredEvidence = (input: CountyGovernanceRecoveryIntegrityInput): boolean =>
  input.recoveryStatus !== undefined &&
  input.recoveryStatus !== null &&
  input.recoveryDurabilityLevel !== undefined &&
  input.recoveryDurabilityLevel !== null &&
  input.recoveryIntegrityLevel !== undefined &&
  input.recoveryIntegrityLevel !== null &&
  input.governanceDebtLevel !== undefined &&
  input.governanceDebtLevel !== null &&
  input.postRecoveryStabilityLevel !== undefined &&
  input.postRecoveryStabilityLevel !== null &&
  input.explainabilityPersistenceLevel !== undefined &&
  input.explainabilityPersistenceLevel !== null &&
  input.failClosedRecoveryDiscipline !== undefined &&
  input.failClosedRecoveryDiscipline !== null &&
  input.contradictionPersistenceLevel !== undefined &&
  input.contradictionPersistenceLevel !== null &&
  input.driftAmplificationLevel !== undefined &&
  input.driftAmplificationLevel !== null &&
  input.degradationCycleResistance !== undefined &&
  input.degradationCycleResistance !== null &&
  input.recoveryReversibility !== undefined &&
  input.recoveryReversibility !== null &&
  input.survivabilityPersistenceLevel !== undefined &&
  input.survivabilityPersistenceLevel !== null &&
  input.collapseRiskLevel !== undefined &&
  input.collapseRiskLevel !== null &&
  input.unresolvedFailureSuppression !== undefined &&
  input.unresolvedFailureSuppression !== null;

const isOperationalRecovery = (status: CountyGovernanceRecoveryStatusS20 | null | undefined): boolean =>
  status === "operational" || status === "stabilized" || status === "durable" || status === "institutional";

const isStableRecovery = (status: CountyGovernanceRecoveryStatusS20 | null | undefined): boolean =>
  status === "stabilized" || status === "durable" || status === "institutional";

const isWeakIntegrity = (level: CountyGovernanceRecoveryIntegrityLevelS20 | null | undefined): boolean =>
  level === "weak" || level === "partial";

const isWeakExplainability = (
  level: CountyGovernanceExplainabilityPersistenceLevelS20 | null | undefined,
): boolean => level === "opaque" || level === "partial";

const isWeakFailClosed = (
  level: CountyGovernanceFailClosedRecoveryDisciplineS20 | null | undefined,
): boolean => level === "absent" || level === "inconsistent";

const isHighSuppression = (level: CountyGovernanceUnresolvedFailureSuppressionS20 | null | undefined): boolean =>
  level === "high" || level === "critical";

const getSignals = (input: CountyGovernanceRecoveryIntegrityInput = {}) => {
  const recoveryCycleCount = clampCount(input.recoveryCycleCount);
  const unresolvedGovernanceFailureCount = clampCount(input.unresolvedGovernanceFailureCount);
  const repeatedDegradationCount = clampCount(input.repeatedDegradationCount);
  const evidenceMissing = !hasRequiredEvidence(input);
  const recoveryScore = evidenceMissing
    ? 0
    : average([
        recoveryStatusScore[input.recoveryStatus as CountyGovernanceRecoveryStatusS20],
        recoveryDurabilityScore[input.recoveryDurabilityLevel as CountyGovernanceRecoveryDurabilityLevelS20],
        postRecoveryStabilityScore[input.postRecoveryStabilityLevel as CountyGovernancePostRecoveryStabilityLevelS20],
        survivabilityPersistenceScore[
          input.survivabilityPersistenceLevel as CountyGovernanceSurvivabilityPersistenceLevelS20
        ],
      ]);
  const recoveryIntegrityScore = evidenceMissing
    ? 0
    : average([
        recoveryIntegrityScoreMap[input.recoveryIntegrityLevel as CountyGovernanceRecoveryIntegrityLevelS20],
        explainabilityScore[
          input.explainabilityPersistenceLevel as CountyGovernanceExplainabilityPersistenceLevelS20
        ],
        failClosedScore[input.failClosedRecoveryDiscipline as CountyGovernanceFailClosedRecoveryDisciplineS20],
        100 -
          unresolvedSuppressionRiskScore[
            input.unresolvedFailureSuppression as CountyGovernanceUnresolvedFailureSuppressionS20
          ],
      ]);
  const governanceDebtScore = evidenceMissing
    ? 0
    : Math.min(
        100,
        Math.round(
          average([
            governanceDebtRiskScore[input.governanceDebtLevel as CountyGovernanceDebtLevelS20],
            unresolvedGovernanceFailureCount > 0 ? Math.min(100, 35 + unresolvedGovernanceFailureCount * 15) : 0,
            repeatedDegradationCount > 0 ? Math.min(100, 30 + repeatedDegradationCount * 15) : 0,
            recoveryCycleCount >= 3 ? Math.min(100, 25 + recoveryCycleCount * 10) : 0,
            isWeakFailClosed(input.failClosedRecoveryDiscipline) ? 80 : 0,
            isHighSuppression(input.unresolvedFailureSuppression) ? 90 : 0,
          ]),
        ),
      );
  const recoveryStabilityScore = evidenceMissing
    ? 0
    : average([
        postRecoveryStabilityScore[input.postRecoveryStabilityLevel as CountyGovernancePostRecoveryStabilityLevelS20],
        100 - contradictionRiskScore[input.contradictionPersistenceLevel as CountyGovernanceContradictionPersistenceLevelS20],
        100 - driftAmplificationRiskScore[input.driftAmplificationLevel as CountyGovernanceDriftAmplificationLevelS20],
        survivabilityPersistenceScore[
          input.survivabilityPersistenceLevel as CountyGovernanceSurvivabilityPersistenceLevelS20
        ],
      ]);
  const degradationResistanceScore = evidenceMissing
    ? 0
    : average([
        degradationResistanceScoreMap[
          input.degradationCycleResistance as CountyGovernanceDegradationCycleResistanceS20
        ],
        recoveryReversibilityScore[input.recoveryReversibility as CountyGovernanceRecoveryReversibilityS20],
        100 - collapseRiskScore[input.collapseRiskLevel as CountyGovernanceCollapseRiskLevelS20],
        repeatedDegradationCount === 0 ? 100 : Math.max(0, 100 - repeatedDegradationCount * 18),
      ]);
  const failClosedRecoveryDurable =
    input.failClosedRecoveryDiscipline === "durable" || input.failClosedRecoveryDiscipline === "institutional";
  const postRecoveryCollapseRisk =
    input.collapseRiskLevel === "high" ||
    input.collapseRiskLevel === "critical" ||
    (input.driftAmplificationLevel === "critical" && input.contradictionPersistenceLevel === "persistent") ||
    (isWeakFailClosed(input.failClosedRecoveryDiscipline) && input.recoveryReversibility === "irreversible");
  const reversibleRecovery =
    input.recoveryReversibility === "reversible" || input.recoveryReversibility === "partially_reversible";
  const durableRecoveryDetected =
    recoveryScore >= 84 &&
    recoveryIntegrityScore >= 82 &&
    recoveryStabilityScore >= 82 &&
    degradationResistanceScore >= 80 &&
    governanceDebtScore < 35 &&
    failClosedRecoveryDurable;
  const cosmeticRecoveryDetected =
    isOperationalRecovery(input.recoveryStatus) &&
    (isWeakIntegrity(input.recoveryIntegrityLevel) ||
      isWeakExplainability(input.explainabilityPersistenceLevel) ||
      unresolvedGovernanceFailureCount > 0 ||
      isHighSuppression(input.unresolvedFailureSuppression));
  const governanceDebtAccumulating =
    input.governanceDebtLevel === "high" ||
    input.governanceDebtLevel === "critical" ||
    recoveryCycleCount >= 3 ||
    repeatedDegradationCount >= 2 ||
    unresolvedGovernanceFailureCount > 0 ||
    isWeakFailClosed(input.failClosedRecoveryDiscipline) ||
    isHighSuppression(input.unresolvedFailureSuppression);
  const recoveryWithoutIntegrityDetected =
    isStableRecovery(input.recoveryStatus) &&
    (isWeakIntegrity(input.recoveryIntegrityLevel) ||
      input.explainabilityPersistenceLevel === "opaque" ||
      isWeakFailClosed(input.failClosedRecoveryDiscipline) ||
      isHighSuppression(input.unresolvedFailureSuppression));
  const recoveryInducedDriftAmplificationDetected =
    input.driftAmplificationLevel === "high" ||
    input.driftAmplificationLevel === "critical" ||
    (input.driftAmplificationLevel === "moderate" && recoveryCycleCount >= 3);
  const recoveryInducedInstabilityDetected =
    input.postRecoveryStabilityLevel === "unstable" ||
    input.contradictionPersistenceLevel === "frequent" ||
    input.contradictionPersistenceLevel === "persistent" ||
    (input.postRecoveryStabilityLevel === "fragile" && repeatedDegradationCount > 0);
  const irreversibleGovernanceDegradation =
    input.recoveryReversibility === "irreversible" ||
    (input.degradationCycleResistance === "weak" && repeatedDegradationCount >= 3);
  const failClosedRecoveryRequired =
    input.failClosedRecoveryDiscipline === "absent" ||
    (input.failClosedRecoveryDiscipline === "inconsistent" &&
      (isOperationalRecovery(input.recoveryStatus) || postRecoveryCollapseRisk || governanceDebtAccumulating));
  const brittleRecovery =
    input.recoveryDurabilityLevel === "brittle" ||
    input.postRecoveryStabilityLevel === "fragile" ||
    input.degradationCycleResistance === "weak";
  const temporaryRecovery =
    input.recoveryStatus === "partial" ||
    input.recoveryDurabilityLevel === "temporary" ||
    input.survivabilityPersistenceLevel === "temporary";

  return {
    recoveryCycleCount,
    unresolvedGovernanceFailureCount,
    repeatedDegradationCount,
    evidenceMissing,
    recoveryScore,
    recoveryIntegrityScore,
    governanceDebtScore,
    recoveryStabilityScore,
    degradationResistanceScore,
    failClosedRecoveryDurable,
    postRecoveryCollapseRisk,
    reversibleRecovery,
    durableRecoveryDetected,
    cosmeticRecoveryDetected,
    governanceDebtAccumulating,
    recoveryWithoutIntegrityDetected,
    recoveryInducedDriftAmplificationDetected,
    recoveryInducedInstabilityDetected,
    irreversibleGovernanceDegradation,
    failClosedRecoveryRequired,
    brittleRecovery,
    temporaryRecovery,
  };
};

const getClassification = (
  input: CountyGovernanceRecoveryIntegrityInput,
): CountyGovernanceRecoveryClassification => {
  const signals = getSignals(input);

  if (signals.failClosedRecoveryRequired) {
    return "fail_closed_recovery_required";
  }

  if (signals.postRecoveryCollapseRisk) {
    return "post_recovery_collapse_risk";
  }

  if (signals.irreversibleGovernanceDegradation) {
    return "irreversible_governance_degradation";
  }

  if (signals.recoveryWithoutIntegrityDetected) {
    return "recovery_without_integrity";
  }

  if (signals.governanceDebtAccumulating) {
    return "governance_debt_accumulation";
  }

  if (signals.recoveryInducedDriftAmplificationDetected) {
    return "recovery_induced_drift_amplification";
  }

  if (signals.recoveryInducedInstabilityDetected) {
    return "recovery_induced_instability";
  }

  if (signals.cosmeticRecoveryDetected) {
    return "cosmetic_recovery";
  }

  if (signals.brittleRecovery) {
    return "brittle_recovery";
  }

  if (signals.temporaryRecovery) {
    return "temporary_recovery";
  }

  if (signals.evidenceMissing) {
    return "recovery_integrity_unverified";
  }

  if (
    input.recoveryStatus === "institutional" &&
    input.recoveryIntegrityLevel === "institutional" &&
    input.explainabilityPersistenceLevel === "institutional" &&
    input.failClosedRecoveryDiscipline === "institutional" &&
    input.survivabilityPersistenceLevel === "institutional" &&
    signals.durableRecoveryDetected
  ) {
    return "institutional_recovery_integrity";
  }

  if (signals.durableRecoveryDetected) {
    return "durable_integrity_preserving_recovery";
  }

  if (
    signals.recoveryScore >= 72 &&
    signals.recoveryIntegrityScore >= 70 &&
    signals.recoveryStabilityScore >= 70 &&
    signals.degradationResistanceScore >= 68
  ) {
    return "resilient_recovery";
  }

  if (isOperationalRecovery(input.recoveryStatus)) {
    return "operational_recovery";
  }

  return "recovery_integrity_unverified";
};

const getWarningCodes = (
  input: CountyGovernanceRecoveryIntegrityInput,
): CountyGovernanceRecoveryIntegrityWarningCode[] => {
  const signals = getSignals(input);
  const warningCodes: CountyGovernanceRecoveryIntegrityWarningCode[] = [];

  if (signals.evidenceMissing) {
    warningCodes.push("S20_RECOVERY_INTEGRITY_UNVERIFIED");
  }

  if (signals.cosmeticRecoveryDetected) {
    warningCodes.push("S20_COSMETIC_RECOVERY_DETECTED");
  }

  if (signals.recoveryWithoutIntegrityDetected) {
    warningCodes.push("S20_RECOVERY_WITHOUT_INTEGRITY");
  }

  if (signals.governanceDebtAccumulating) {
    warningCodes.push("S20_GOVERNANCE_DEBT_ACCUMULATING");
  }

  if (input.governanceDebtLevel === "critical") {
    warningCodes.push("S20_GOVERNANCE_DEBT_CRITICAL");
  }

  if (isWeakFailClosed(input.failClosedRecoveryDiscipline)) {
    warningCodes.push("S20_FAIL_CLOSED_RECOVERY_DISCIPLINE_WEAK");
  }

  if (isWeakExplainability(input.explainabilityPersistenceLevel)) {
    warningCodes.push("S20_RECOVERY_EXPLAINABILITY_WEAK");
  }

  if (input.contradictionPersistenceLevel === "frequent" || input.contradictionPersistenceLevel === "persistent") {
    warningCodes.push("S20_RECOVERY_CONTRADICTIONS_PERSIST");
  }

  if (signals.recoveryInducedDriftAmplificationDetected) {
    warningCodes.push("S20_RECOVERY_DRIFT_AMPLIFICATION");
  }

  if (signals.recoveryInducedInstabilityDetected) {
    warningCodes.push("S20_RECOVERY_INDUCED_INSTABILITY");
  }

  if (signals.temporaryRecovery) {
    warningCodes.push("S20_TEMPORARY_RECOVERY_ONLY");
  }

  if (signals.brittleRecovery) {
    warningCodes.push("S20_BRITTLE_RECOVERY_PATTERN");
  }

  if (signals.irreversibleGovernanceDegradation) {
    warningCodes.push("S20_IRREVERSIBLE_DEGRADATION_RISK");
  }

  if (signals.postRecoveryCollapseRisk) {
    warningCodes.push("S20_POST_RECOVERY_COLLAPSE_RISK");
  }

  if (isHighSuppression(input.unresolvedFailureSuppression)) {
    warningCodes.push("S20_UNRESOLVED_FAILURE_SUPPRESSION");
  }

  if (signals.repeatedDegradationCount >= 2) {
    warningCodes.push("S20_REPEATED_DEGRADATION_CYCLE_RISK");
  }

  if (
    input.survivabilityPersistenceLevel === "unproven" ||
    input.survivabilityPersistenceLevel === "temporary" ||
    (input.survivabilityPersistenceLevel === "recovering" && signals.recoveryInducedInstabilityDetected)
  ) {
    warningCodes.push("S20_SURVIVABILITY_DAMAGED_BY_RECOVERY");
  }

  if (getClassification(input) !== "institutional_recovery_integrity") {
    warningCodes.push("S20_INSTITUTIONAL_RECOVERY_NOT_PROVEN");
  }

  if (signals.failClosedRecoveryRequired) {
    warningCodes.push("S20_FAIL_CLOSED_RECOVERY_REQUIRED");
  }

  return warningCodes;
};

export function evaluateCountyGovernanceRecoveryIntegrity(
  input: CountyGovernanceRecoveryIntegrityInput = {},
): CountyGovernanceRecoveryIntegrityResult {
  const signals = getSignals(input);
  const classification = getClassification(input);

  return {
    recoveryClassification: classification,
    recoveryScore: signals.recoveryScore,
    recoveryIntegrityScore: signals.recoveryIntegrityScore,
    governanceDebtScore: signals.governanceDebtScore,
    recoveryStabilityScore: signals.recoveryStabilityScore,
    degradationResistanceScore: signals.degradationResistanceScore,
    cosmeticRecoveryDetected: signals.cosmeticRecoveryDetected,
    governanceDebtAccumulating: signals.governanceDebtAccumulating,
    recoveryWithoutIntegrityDetected: signals.recoveryWithoutIntegrityDetected,
    recoveryInducedInstabilityDetected: signals.recoveryInducedInstabilityDetected,
    recoveryInducedDriftAmplificationDetected: signals.recoveryInducedDriftAmplificationDetected,
    failClosedRecoveryDurable: signals.failClosedRecoveryDurable,
    postRecoveryCollapseRisk: signals.postRecoveryCollapseRisk,
    reversibleRecovery: signals.reversibleRecovery,
    durableRecoveryDetected: signals.durableRecoveryDetected,
    warningCodes: getWarningCodes(input),
    explainability: {
      summary: `County governance recovery integrity evaluated as ${classification} with deterministic advisory-only rules.`,
      recoveryDrivers: [
        `recovery status: ${input.recoveryStatus ?? "missing"}`,
        `recovery durability: ${input.recoveryDurabilityLevel ?? "missing"}`,
        `recovery score: ${signals.recoveryScore}`,
      ],
      integrityFactors: [
        `recovery integrity: ${input.recoveryIntegrityLevel ?? "missing"}`,
        `explainability persistence: ${input.explainabilityPersistenceLevel ?? "missing"}`,
        `recovery integrity score: ${signals.recoveryIntegrityScore}`,
      ],
      governanceDebtFactors: [
        `governance debt: ${input.governanceDebtLevel ?? "missing"}`,
        `recovery cycles: ${signals.recoveryCycleCount}`,
        `unresolved governance failures: ${signals.unresolvedGovernanceFailureCount}`,
        `governance debt score: ${signals.governanceDebtScore}`,
      ],
      degradationFactors: [
        `degradation cycle resistance: ${input.degradationCycleResistance ?? "missing"}`,
        `recovery reversibility: ${input.recoveryReversibility ?? "missing"}`,
        `repeated degradation count: ${signals.repeatedDegradationCount}`,
      ],
      instabilitySignals: [
        signals.recoveryInducedInstabilityDetected
          ? "recovery-induced instability detected"
          : "recovery-induced instability not detected",
        signals.recoveryInducedDriftAmplificationDetected
          ? "recovery-induced drift amplification detected"
          : "recovery-induced drift amplification not detected",
        signals.postRecoveryCollapseRisk ? "post-recovery collapse risk detected" : "post-recovery collapse risk not detected",
      ],
      failClosedSignals: [
        `fail-closed recovery discipline: ${input.failClosedRecoveryDiscipline ?? "missing"}`,
        signals.failClosedRecoveryDurable ? "fail-closed recovery discipline durable" : "fail-closed recovery discipline not durable",
        signals.failClosedRecoveryRequired ? "fail-closed recovery required" : "baseline fail-closed controls preserved",
      ],
      deterministicRulesApplied: [
        "strict string union inputs only",
        "counts clamped to non-negative integers",
        "scores use fixed ordinal mappings and bounded averages",
        "missing evidence defaults to recovery integrity unverified",
        "fail-closed recovery requirement overrides lower-risk classifications",
        "collapse risk, irreversible degradation, weak integrity, and governance debt block durable recovery",
        "cosmetic recovery cannot qualify as durable or institutional recovery",
        "all results preserve advisory-only fail-closed execution blocking",
      ],
    },
    ingestionBlocked: CountyGovernanceRecoveryIntegrityFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountyGovernanceRecoveryIntegrityFailClosedDefaults.automationBlocked,
    executionBlocked: CountyGovernanceRecoveryIntegrityFailClosedDefaults.executionBlocked,
    planningOnly: CountyGovernanceRecoveryIntegrityFailClosedDefaults.planningOnly,
    failClosed: CountyGovernanceRecoveryIntegrityFailClosedDefaults.failClosed,
  };
}
