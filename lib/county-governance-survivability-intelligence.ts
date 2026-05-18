/**
 * Deterministic advisory-only County Governance Survivability Intelligence Layer.
 *
 * Planning metadata only. This module evaluates supplied governance survivability
 * signals and never activates runtime providers, county-source operations,
 * scraping, OCR, parsing, ingestion, normalization, database writes, or automation.
 */

export type CountyGovernanceMaturityLevelS19 = "immature" | "developing" | "stable" | "advanced" | "institutional";
export type CountyGovernanceConvergenceLevelS19 = "fragmented" | "partial" | "aligned" | "strong" | "institutional";
export type CountyGovernanceContinuityLevelS19 = "fragile" | "unstable" | "recoverable" | "stable" | "durable";
export type CountyGovernanceDriftLevelS19 = "none" | "low" | "moderate" | "high" | "critical";
export type CountyGovernanceEscalationPressureLevelS19 = "none" | "low" | "moderate" | "high" | "extreme";
export type CountyGovernanceContradictionFrequencyS19 = "none" | "rare" | "periodic" | "frequent" | "persistent";
export type CountyGovernanceExplainabilityLevelS19 = "opaque" | "partial" | "adequate" | "strong" | "institutional";
export type CountyGovernanceRecoveryCapabilityLevelS19 = "none" | "minimal" | "partial" | "strong" | "institutional";
export type CountyGovernanceFailClosedDisciplineLevelS19 =
  | "absent"
  | "inconsistent"
  | "partial"
  | "stable"
  | "institutional";
export type CountyGovernanceSuppressionDependencyLevelS19 = "none" | "low" | "moderate" | "high" | "critical";
export type CountyGovernanceDegradationBehaviorS19 =
  | "unknown"
  | "graceful"
  | "unstable"
  | "volatile"
  | "catastrophic";
export type CountyGovernanceInstitutionalIntegrityLevelS19 = "weak" | "partial" | "stable" | "strong" | "institutional";

export type CountyGovernanceSurvivabilityClassification =
  | "temporary_endurance"
  | "graceful_degradation"
  | "resilient_governance"
  | "survivable_governance"
  | "adaptive_but_unsafe"
  | "survivability_without_integrity"
  | "brittle_governance"
  | "catastrophic_collapse_risk"
  | "non_recoverable_governance";

export type CountyGovernanceSurvivabilityWarningCode =
  | "S19_SUPPRESSION_DEPENDENCY_HIGH"
  | "S19_FAIL_CLOSED_DISCIPLINE_WEAK"
  | "S19_CATASTROPHIC_DEGRADATION_PATTERN"
  | "S19_RECOVERY_CAPABILITY_ABSENT"
  | "S19_SURVIVABILITY_WITHOUT_INTEGRITY"
  | "S19_EXPLAINABILITY_COLLAPSE"
  | "S19_ESCALATION_SURVIVABILITY_WEAK"
  | "S19_DRIFT_SURVIVABILITY_UNSTABLE"
  | "S19_CONTRADICTION_SURVIVABILITY_WEAK"
  | "S19_INSTITUTIONAL_SURVIVABILITY_UNVERIFIED"
  | "S19_TEMPORARY_ENDURANCE_ONLY"
  | "S19_BRITTLE_GOVERNANCE_PATTERN"
  | "S19_NON_RECOVERABLE_COLLAPSE_RISK"
  | "S19_ADAPTIVE_BUT_UNSAFE_PATTERN"
  | "S19_GRACEFUL_DEGRADATION_DETECTED"
  | "S19_RESILIENCE_PERSISTENCE_WEAK"
  | "S19_CONVERGENCE_SURVIVABILITY_UNSTABLE"
  | "S19_GOVERNANCE_COHERENCE_COLLAPSE";

export interface CountyGovernanceSurvivabilityInput {
  governanceMaturityLevel: CountyGovernanceMaturityLevelS19;
  convergenceLevel: CountyGovernanceConvergenceLevelS19;
  continuityLevel: CountyGovernanceContinuityLevelS19;
  driftLevel: CountyGovernanceDriftLevelS19;
  escalationPressureLevel: CountyGovernanceEscalationPressureLevelS19;
  contradictionFrequency: CountyGovernanceContradictionFrequencyS19;
  explainabilityLevel: CountyGovernanceExplainabilityLevelS19;
  recoveryCapabilityLevel: CountyGovernanceRecoveryCapabilityLevelS19;
  failClosedDisciplineLevel: CountyGovernanceFailClosedDisciplineLevelS19;
  suppressionDependencyLevel: CountyGovernanceSuppressionDependencyLevelS19;
  degradationBehavior: CountyGovernanceDegradationBehaviorS19;
  institutionalIntegrityLevel: CountyGovernanceInstitutionalIntegrityLevelS19;
}

export interface CountyGovernanceSurvivabilityExplainability {
  summary: string;
  survivabilityDrivers: string[];
  degradationFactors: string[];
  resilienceFactors: string[];
  integrityRisks: string[];
  collapseSignals: string[];
  recoverySignals: string[];
  deterministicRulesApplied: string[];
}

export interface CountyGovernanceSurvivabilityResult {
  survivabilityClassification: CountyGovernanceSurvivabilityClassification;
  survivabilityScore: number;
  resilienceScore: number;
  recoveryScore: number;
  integrityScore: number;
  degradationResistanceScore: number;
  catastrophicCollapseRisk: boolean;
  survivabilityWithoutIntegrityDetected: boolean;
  gracefulDegradationDetected: boolean;
  recoveryPossible: boolean;
  warningCodes: CountyGovernanceSurvivabilityWarningCode[];
  explainability: CountyGovernanceSurvivabilityExplainability;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const CountyGovernanceSurvivabilityFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

const maturityScore: Record<CountyGovernanceMaturityLevelS19, number> = {
  immature: 15,
  developing: 35,
  stable: 60,
  advanced: 80,
  institutional: 95,
};

const convergenceScore: Record<CountyGovernanceConvergenceLevelS19, number> = {
  fragmented: 10,
  partial: 35,
  aligned: 65,
  strong: 85,
  institutional: 95,
};

const continuityScore: Record<CountyGovernanceContinuityLevelS19, number> = {
  fragile: 15,
  unstable: 30,
  recoverable: 55,
  stable: 78,
  durable: 92,
};

const driftRiskScore: Record<CountyGovernanceDriftLevelS19, number> = {
  none: 100,
  low: 82,
  moderate: 55,
  high: 25,
  critical: 0,
};

const escalationScore: Record<CountyGovernanceEscalationPressureLevelS19, number> = {
  none: 100,
  low: 82,
  moderate: 55,
  high: 25,
  extreme: 0,
};

const contradictionScore: Record<CountyGovernanceContradictionFrequencyS19, number> = {
  none: 100,
  rare: 82,
  periodic: 55,
  frequent: 25,
  persistent: 0,
};

const explainabilityScore: Record<CountyGovernanceExplainabilityLevelS19, number> = {
  opaque: 0,
  partial: 38,
  adequate: 65,
  strong: 84,
  institutional: 95,
};

const recoveryScoreMap: Record<CountyGovernanceRecoveryCapabilityLevelS19, number> = {
  none: 0,
  minimal: 25,
  partial: 55,
  strong: 84,
  institutional: 95,
};

const failClosedScore: Record<CountyGovernanceFailClosedDisciplineLevelS19, number> = {
  absent: 0,
  inconsistent: 25,
  partial: 55,
  stable: 82,
  institutional: 95,
};

const suppressionScore: Record<CountyGovernanceSuppressionDependencyLevelS19, number> = {
  none: 100,
  low: 82,
  moderate: 55,
  high: 20,
  critical: 0,
};

const degradationScore: Record<CountyGovernanceDegradationBehaviorS19, number> = {
  unknown: 35,
  graceful: 88,
  unstable: 40,
  volatile: 15,
  catastrophic: 0,
};

const integrityScoreMap: Record<CountyGovernanceInstitutionalIntegrityLevelS19, number> = {
  weak: 10,
  partial: 38,
  stable: 68,
  strong: 86,
  institutional: 96,
};

const average = (scores: readonly number[]): number =>
  Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);

const isStableOrDurable = (continuityLevel: CountyGovernanceContinuityLevelS19): boolean =>
  continuityLevel === "stable" || continuityLevel === "durable";

const isHighSuppression = (suppressionLevel: CountyGovernanceSuppressionDependencyLevelS19): boolean =>
  suppressionLevel === "high" || suppressionLevel === "critical";

const isWeakIntegrity = (integrityLevel: CountyGovernanceInstitutionalIntegrityLevelS19): boolean =>
  integrityLevel === "weak" || integrityLevel === "partial";

const isAdvancedMaturity = (maturityLevel: CountyGovernanceMaturityLevelS19): boolean =>
  maturityLevel === "advanced" || maturityLevel === "institutional";

const isRecoveryPossible = (recoveryLevel: CountyGovernanceRecoveryCapabilityLevelS19): boolean =>
  recoveryLevel === "partial" || recoveryLevel === "strong" || recoveryLevel === "institutional";

const getSignals = (input: CountyGovernanceSurvivabilityInput) => {
  const resilienceScore = average([
    maturityScore[input.governanceMaturityLevel],
    convergenceScore[input.convergenceLevel],
    continuityScore[input.continuityLevel],
    driftRiskScore[input.driftLevel],
    escalationScore[input.escalationPressureLevel],
    contradictionScore[input.contradictionFrequency],
  ]);
  const recoveryScore = average([
    recoveryScoreMap[input.recoveryCapabilityLevel],
    degradationScore[input.degradationBehavior],
    continuityScore[input.continuityLevel],
    escalationScore[input.escalationPressureLevel],
  ]);
  const integrityScore = average([
    integrityScoreMap[input.institutionalIntegrityLevel],
    explainabilityScore[input.explainabilityLevel],
    failClosedScore[input.failClosedDisciplineLevel],
    suppressionScore[input.suppressionDependencyLevel],
    contradictionScore[input.contradictionFrequency],
  ]);
  const degradationResistanceScore = average([
    degradationScore[input.degradationBehavior],
    driftRiskScore[input.driftLevel],
    recoveryScoreMap[input.recoveryCapabilityLevel],
    failClosedScore[input.failClosedDisciplineLevel],
  ]);
  const survivabilityScore = average([
    resilienceScore,
    recoveryScore,
    integrityScore,
    degradationResistanceScore,
  ]);
  const governanceCoherenceCollapsing =
    input.convergenceLevel === "fragmented" &&
    (input.contradictionFrequency === "frequent" || input.contradictionFrequency === "persistent");
  const catastrophicCollapseRisk =
    input.degradationBehavior === "catastrophic" ||
    (input.driftLevel === "critical" &&
      input.contradictionFrequency === "persistent" &&
      input.recoveryCapabilityLevel === "none") ||
    (input.failClosedDisciplineLevel === "absent" && input.escalationPressureLevel === "extreme") ||
    (input.institutionalIntegrityLevel === "weak" && governanceCoherenceCollapsing);
  const recoveryPossible = isRecoveryPossible(input.recoveryCapabilityLevel) && input.degradationBehavior !== "catastrophic";
  const survivabilityWithoutIntegrityDetected =
    (isHighSuppression(input.suppressionDependencyLevel) &&
      isStableOrDurable(input.continuityLevel) &&
      isWeakIntegrity(input.institutionalIntegrityLevel)) ||
    (input.explainabilityLevel === "opaque" && isAdvancedMaturity(input.governanceMaturityLevel));
  const gracefulDegradationDetected =
    input.degradationBehavior === "graceful" &&
    recoveryPossible &&
    input.driftLevel !== "critical" &&
    input.failClosedDisciplineLevel !== "absent";
  const nonRecoverableGovernance =
    !catastrophicCollapseRisk &&
    input.recoveryCapabilityLevel === "none" &&
    (input.continuityLevel === "fragile" ||
      input.continuityLevel === "unstable" ||
      input.degradationBehavior === "volatile" ||
      input.driftLevel === "high" ||
      input.escalationPressureLevel === "high");
  const adaptiveButUnsafe =
    recoveryPossible &&
    (input.failClosedDisciplineLevel === "absent" ||
      input.failClosedDisciplineLevel === "inconsistent" ||
      isHighSuppression(input.suppressionDependencyLevel)) &&
    (input.governanceMaturityLevel === "advanced" ||
      input.governanceMaturityLevel === "institutional" ||
      input.recoveryCapabilityLevel === "strong" ||
      input.recoveryCapabilityLevel === "institutional");
  const brittleGovernance =
    !catastrophicCollapseRisk &&
    !nonRecoverableGovernance &&
    (input.continuityLevel === "fragile" ||
      input.degradationBehavior === "volatile" ||
      input.driftLevel === "high" ||
      input.escalationPressureLevel === "high" ||
      input.contradictionFrequency === "frequent");
  const temporaryEndurance =
    !catastrophicCollapseRisk &&
    input.continuityLevel === "recoverable" &&
    (input.recoveryCapabilityLevel === "minimal" ||
      input.recoveryCapabilityLevel === "partial" ||
      input.contradictionFrequency === "periodic" ||
      input.driftLevel === "moderate");
  const resilientGovernance =
    resilienceScore >= 78 &&
    recoveryScore >= 75 &&
    degradationResistanceScore >= 75 &&
    integrityScore >= 68 &&
    !catastrophicCollapseRisk &&
    !survivabilityWithoutIntegrityDetected;
  const survivableGovernance =
    survivabilityScore >= 84 &&
    resilienceScore >= 82 &&
    recoveryScore >= 82 &&
    integrityScore >= 82 &&
    degradationResistanceScore >= 80 &&
    input.failClosedDisciplineLevel === "institutional" &&
    input.institutionalIntegrityLevel === "institutional" &&
    input.explainabilityLevel === "institutional" &&
    !catastrophicCollapseRisk &&
    !survivabilityWithoutIntegrityDetected;

  return {
    resilienceScore,
    recoveryScore,
    integrityScore,
    degradationResistanceScore,
    survivabilityScore,
    governanceCoherenceCollapsing,
    catastrophicCollapseRisk,
    recoveryPossible,
    survivabilityWithoutIntegrityDetected,
    gracefulDegradationDetected,
    nonRecoverableGovernance,
    adaptiveButUnsafe,
    brittleGovernance,
    temporaryEndurance,
    resilientGovernance,
    survivableGovernance,
  };
};

const getClassification = (
  input: CountyGovernanceSurvivabilityInput,
): CountyGovernanceSurvivabilityClassification => {
  const signals = getSignals(input);

  if (signals.catastrophicCollapseRisk) {
    return "catastrophic_collapse_risk";
  }

  if (signals.nonRecoverableGovernance) {
    return "non_recoverable_governance";
  }

  if (signals.survivabilityWithoutIntegrityDetected) {
    return "survivability_without_integrity";
  }

  if (signals.adaptiveButUnsafe) {
    return "adaptive_but_unsafe";
  }

  if (signals.brittleGovernance) {
    return "brittle_governance";
  }

  if (signals.temporaryEndurance) {
    return "temporary_endurance";
  }

  if (signals.gracefulDegradationDetected) {
    return "graceful_degradation";
  }

  if (signals.survivableGovernance) {
    return "survivable_governance";
  }

  if (signals.resilientGovernance) {
    return "resilient_governance";
  }

  return "temporary_endurance";
};

const getWarningCodes = (
  input: CountyGovernanceSurvivabilityInput,
): CountyGovernanceSurvivabilityWarningCode[] => {
  const signals = getSignals(input);
  const warningCodes: CountyGovernanceSurvivabilityWarningCode[] = [];

  if (isHighSuppression(input.suppressionDependencyLevel)) {
    warningCodes.push("S19_SUPPRESSION_DEPENDENCY_HIGH");
  }

  if (input.failClosedDisciplineLevel === "absent" || input.failClosedDisciplineLevel === "inconsistent") {
    warningCodes.push("S19_FAIL_CLOSED_DISCIPLINE_WEAK");
  }

  if (input.degradationBehavior === "catastrophic") {
    warningCodes.push("S19_CATASTROPHIC_DEGRADATION_PATTERN");
  }

  if (input.recoveryCapabilityLevel === "none") {
    warningCodes.push("S19_RECOVERY_CAPABILITY_ABSENT");
  }

  if (signals.survivabilityWithoutIntegrityDetected) {
    warningCodes.push("S19_SURVIVABILITY_WITHOUT_INTEGRITY");
  }

  if (input.explainabilityLevel === "opaque") {
    warningCodes.push("S19_EXPLAINABILITY_COLLAPSE");
  }

  if (input.escalationPressureLevel === "high" || input.escalationPressureLevel === "extreme") {
    warningCodes.push("S19_ESCALATION_SURVIVABILITY_WEAK");
  }

  if (input.driftLevel === "high" || input.driftLevel === "critical") {
    warningCodes.push("S19_DRIFT_SURVIVABILITY_UNSTABLE");
  }

  if (input.contradictionFrequency === "frequent" || input.contradictionFrequency === "persistent") {
    warningCodes.push("S19_CONTRADICTION_SURVIVABILITY_WEAK");
  }

  if (input.governanceMaturityLevel === "institutional" && getClassification(input) !== "survivable_governance") {
    warningCodes.push("S19_INSTITUTIONAL_SURVIVABILITY_UNVERIFIED");
  }

  if (getClassification(input) === "temporary_endurance") {
    warningCodes.push("S19_TEMPORARY_ENDURANCE_ONLY");
  }

  if (signals.brittleGovernance) {
    warningCodes.push("S19_BRITTLE_GOVERNANCE_PATTERN");
  }

  if (signals.catastrophicCollapseRisk || signals.nonRecoverableGovernance) {
    warningCodes.push("S19_NON_RECOVERABLE_COLLAPSE_RISK");
  }

  if (signals.adaptiveButUnsafe) {
    warningCodes.push("S19_ADAPTIVE_BUT_UNSAFE_PATTERN");
  }

  if (signals.gracefulDegradationDetected) {
    warningCodes.push("S19_GRACEFUL_DEGRADATION_DETECTED");
  }

  if (signals.resilienceScore < 65) {
    warningCodes.push("S19_RESILIENCE_PERSISTENCE_WEAK");
  }

  if (input.convergenceLevel === "fragmented" || input.convergenceLevel === "partial") {
    warningCodes.push("S19_CONVERGENCE_SURVIVABILITY_UNSTABLE");
  }

  if (signals.governanceCoherenceCollapsing) {
    warningCodes.push("S19_GOVERNANCE_COHERENCE_COLLAPSE");
  }

  return warningCodes;
};

export function evaluateCountyGovernanceSurvivability(
  input: CountyGovernanceSurvivabilityInput,
): CountyGovernanceSurvivabilityResult {
  const signals = getSignals(input);
  const classification = getClassification(input);

  return {
    survivabilityClassification: classification,
    survivabilityScore: signals.survivabilityScore,
    resilienceScore: signals.resilienceScore,
    recoveryScore: signals.recoveryScore,
    integrityScore: signals.integrityScore,
    degradationResistanceScore: signals.degradationResistanceScore,
    catastrophicCollapseRisk: signals.catastrophicCollapseRisk,
    survivabilityWithoutIntegrityDetected: signals.survivabilityWithoutIntegrityDetected,
    gracefulDegradationDetected: signals.gracefulDegradationDetected,
    recoveryPossible: signals.recoveryPossible,
    warningCodes: getWarningCodes(input),
    explainability: {
      summary: `County governance survivability evaluated as ${classification} with deterministic advisory-only rules.`,
      survivabilityDrivers: [
        `governance maturity: ${input.governanceMaturityLevel}`,
        `continuity: ${input.continuityLevel}`,
        `convergence: ${input.convergenceLevel}`,
        `survivability score: ${signals.survivabilityScore}`,
      ],
      degradationFactors: [
        `degradation behavior: ${input.degradationBehavior}`,
        `drift level: ${input.driftLevel}`,
        `escalation pressure: ${input.escalationPressureLevel}`,
      ],
      resilienceFactors: [
        `resilience score: ${signals.resilienceScore}`,
        `contradiction frequency: ${input.contradictionFrequency}`,
        `fail-closed discipline: ${input.failClosedDisciplineLevel}`,
      ],
      integrityRisks: [
        `institutional integrity: ${input.institutionalIntegrityLevel}`,
        `suppression dependency: ${input.suppressionDependencyLevel}`,
        `explainability: ${input.explainabilityLevel}`,
      ],
      collapseSignals: [
        signals.catastrophicCollapseRisk ? "catastrophic collapse risk detected" : "no catastrophic collapse override detected",
        signals.governanceCoherenceCollapsing ? "governance coherence collapse detected" : "governance coherence collapse not detected",
      ],
      recoverySignals: [
        signals.recoveryPossible ? "recovery possible" : "recovery not proven",
        `recovery capability: ${input.recoveryCapabilityLevel}`,
        `recovery score: ${signals.recoveryScore}`,
      ],
      deterministicRulesApplied: [
        "strict string union inputs only",
        "scores use fixed ordinal mappings and bounded averages",
        "catastrophic collapse overrides lower-risk classifications",
        "non-recoverable governance overrides integrity and resilience classifications",
        "suppression-based stability prevents survivable governance",
        "high maturity, continuity, or convergence cannot bypass collapse, integrity, or fail-closed warnings",
        "all results preserve advisory-only fail-closed execution blocking",
      ],
    },
    ingestionBlocked: CountyGovernanceSurvivabilityFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountyGovernanceSurvivabilityFailClosedDefaults.automationBlocked,
    executionBlocked: CountyGovernanceSurvivabilityFailClosedDefaults.executionBlocked,
    planningOnly: CountyGovernanceSurvivabilityFailClosedDefaults.planningOnly,
    failClosed: CountyGovernanceSurvivabilityFailClosedDefaults.failClosed,
  };
}
