/**
 * Deterministic advisory-only County Governance Maturity Intelligence Layer.
 *
 * Planning metadata only. This module evaluates supplied S11-S17 summary
 * signals and never activates runtime providers, county-source operations,
 * ingestion, parsing, normalization, database writes, or automation.
 */

export type CountyGovernanceMaturityClassification =
  | "institutional_grade_governance"
  | "durable_maturity"
  | "operationally_mature"
  | "stabilizing_maturity"
  | "developing_governance"
  | "coherent_but_immature"
  | "fragile_maturity"
  | "surface_maturity"
  | "maturity_under_stress"
  | "mature_but_not_resilient"
  | "false_maturity_suspected"
  | "governance_discipline_degradation"
  | "maturity_unverified"
  | "fail_closed_maturity_required";

export type CountyGovernanceMaturitySeverity = "low" | "moderate" | "elevated" | "high" | "critical";

export type CountyGovernanceMaturityLevel =
  | "immature"
  | "developing"
  | "stabilizing"
  | "mature"
  | "institutional";

export type CountyGovernanceMaturityStabilityLevel =
  | "unverified"
  | "fragile"
  | "stable"
  | "durable"
  | "stress_tested";

export type CountyGovernanceMaturityIntegrityLevel =
  | "weak"
  | "partial"
  | "credible"
  | "strong"
  | "institutional";

export type CountyGovernanceMaturityResilienceLevel =
  | "unproven"
  | "fragile"
  | "recovering"
  | "resilient"
  | "stress_resilient";

export type CountyGovernanceMaturityCoherenceLevel =
  | "incoherent"
  | "partial"
  | "coherent"
  | "durable"
  | "institutional";

export type CountyGovernanceMaturityWarningCode =
  | "INSUFFICIENT_MATURITY_EVIDENCE"
  | "SURFACE_MATURITY_DETECTED"
  | "FALSE_MATURITY_SUSPECTED"
  | "FRAGILE_MATURITY_DETECTED"
  | "MATURITY_UNDER_STRESS"
  | "MATURE_BUT_NOT_RESILIENT"
  | "GOVERNANCE_DISCIPLINE_DEGRADING"
  | "ESCALATION_RESOLUTION_IMBALANCE"
  | "CONVERGENCE_NOT_TRUSTWORTHY"
  | "DRIFT_RESISTANCE_WEAK"
  | "FAIL_CLOSED_DISCIPLINE_WEAK"
  | "EXPLAINABILITY_NOT_DURABLE"
  | "COHERENCE_NOT_DURABLE"
  | "SUPPRESSION_MISTAKEN_FOR_MATURITY"
  | "LOW_WARNINGS_WITH_WEAK_EVIDENCE"
  | "STABILITY_MISTAKEN_FOR_MATURITY"
  | "RESOLUTION_REVERSALS_UNDERCUT_MATURITY"
  | "INSTITUTIONAL_GRADE_NOT_PROVEN"
  | "FAIL_CLOSED_MATURITY_REQUIRED";

export interface CountyGovernanceMaturityExplainability {
  summary: string;
  reviewedSignals: readonly string[];
  reasons: readonly string[];
  deterministicRulesApplied: readonly string[];
}

export interface CountyGovernanceMaturityRecommendation {
  recommendationType:
    | "continue_monitoring"
    | "document"
    | "review"
    | "restrict_planning"
    | "maintain_fail_closed";
  description: string;
  required: boolean;
}

export interface CountyGovernanceMaturityInput {
  countyName?: string | null;
  sourceName?: string | null;
  sourceType?: string | null;

  governanceReadinessClassification?: string | null;
  decisionSupportClassification?: string | null;
  escalationClassification?: string | null;
  resolutionClassification?: string | null;
  continuityClassification?: string | null;
  driftClassification?: string | null;
  convergenceClassification?: string | null;

  governanceConfidenceScore?: number | null;
  governanceReliabilityScore?: number | null;
  explainabilityScore?: number | null;
  resilienceEvidenceScore?: number | null;
  coherenceEvidenceScore?: number | null;
  durabilityEvidenceScore?: number | null;
  failClosedDisciplineScore?: number | null;

  unresolvedWarningCount?: number | null;
  suppressedWarningCount?: number | null;
  escalationCycleCount?: number | null;
  resolutionReversalCount?: number | null;
  inconsistentDecisionCount?: number | null;
  driftEventCount?: number | null;
  convergenceEvidenceScore?: number | null;

  currentWarningCodes?: string[];
  priorWarningCodes?: string[];
  unresolvedWarningCodes?: string[];
  suppressedWarningCodes?: string[];

  monitoringWindowComplete?: boolean | null;
  stressSignalsPresent?: boolean | null;
  failClosedElevatedCurrently?: boolean | null;

  explainabilityContext?: {
    reviewedSignals?: string[];
    notes?: string[];
  };
}

export interface CountyGovernanceMaturityResult {
  maturityClassification: CountyGovernanceMaturityClassification;
  maturitySeverity: CountyGovernanceMaturitySeverity;

  maturityLevel: CountyGovernanceMaturityLevel;
  stabilityLevel: CountyGovernanceMaturityStabilityLevel;
  integrityLevel: CountyGovernanceMaturityIntegrityLevel;
  resilienceLevel: CountyGovernanceMaturityResilienceLevel;
  coherenceLevel: CountyGovernanceMaturityCoherenceLevel;

  survivabilityMaturityLevel: "unproven" | "developing" | "stable" | "durable" | "institutional";
  governanceDisciplineDurability: "weak" | "partial" | "stable" | "durable" | "institutional";
  explainabilityIntegrityLevel: "weak" | "partial" | "credible" | "strong" | "institutional";

  governanceMaturityScore: number;
  operationalMaturityScore: number;
  durableMaturityScore: number;
  maturityIntegrityScore: number;
  resilienceScore: number;
  coherenceScore: number;

  maturityContradictionSummary: {
    contradictionCount: number;
    severeContradictionCount: number;
    unresolvedContradictionsPresent: boolean;
  };

  surfaceMaturityDetected: boolean;
  falseMaturitySuspected: boolean;
  fragileMaturityDetected: boolean;
  maturityUnderStress: boolean;
  institutionalReadinessDetected: boolean;
  matureButNotResilientDetected: boolean;

  escalationResolutionHealthy: boolean;
  convergenceTrustworthy: boolean;
  driftResistanceStrong: boolean;
  failClosedDisciplineDurable: boolean;
  explainabilityDurable: boolean;

  planningMayContinue: boolean;
  monitoringRequired: boolean;
  humanReviewRecommended: boolean;
  failClosedShouldRemainElevated: boolean;

  warningCodes: CountyGovernanceMaturityWarningCode[];
  maturityReasons: string[];
  recommendations: CountyGovernanceMaturityRecommendation[];

  explainability: CountyGovernanceMaturityExplainability & {
    maturityEvidence: {
      governanceSignals: string[];
      resilienceSignals: string[];
      durabilitySignals: string[];
      contradictionSignals: string[];
      failClosedSignals: string[];
    };
  };

  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const CountyGovernanceMaturityFailClosedDefaults = {
  ingestionBlocked: true,
  automationBlocked: true,
  executionBlocked: true,
  planningOnly: true,
  failClosed: true,
} as const;

const clampScore = (score: number | null | undefined): number => {
  if (typeof score !== "number" || Number.isNaN(score)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
};

const clampCount = (count: number | null | undefined): number => {
  if (typeof count !== "number" || Number.isNaN(count)) {
    return 0;
  }

  return Math.max(0, Math.floor(count));
};

const hasIdentity = (input: CountyGovernanceMaturityInput): boolean =>
  Boolean(input.countyName?.trim() && input.sourceName?.trim() && input.sourceType?.trim());

const hasPhaseClassifications = (input: CountyGovernanceMaturityInput): boolean =>
  Boolean(
    input.governanceReadinessClassification?.trim() &&
      input.decisionSupportClassification?.trim() &&
      input.escalationClassification?.trim() &&
      input.resolutionClassification?.trim() &&
      input.continuityClassification?.trim() &&
      input.driftClassification?.trim() &&
      input.convergenceClassification?.trim(),
  );

const normalizeWarnings = (warnings: readonly string[] | undefined): string[] =>
  Array.from(
    new Set(
      (warnings ?? [])
        .map((warning) => warning.trim().toUpperCase())
        .filter((warning) => warning.length > 0),
    ),
  );

const includesAny = (value: string | null | undefined, tokens: readonly string[]): boolean => {
  const normalized = value?.trim().toLowerCase() ?? "";

  return tokens.some((token) => normalized.includes(token));
};

const levelFromScore = <T extends string>(
  score: number,
  levels: readonly [number, T, number, T, number, T, number, T, T],
): T => {
  if (score >= levels[0]) {
    return levels[1];
  }

  if (score >= levels[2]) {
    return levels[3];
  }

  if (score >= levels[4]) {
    return levels[5];
  }

  if (score >= levels[6]) {
    return levels[7];
  }

  return levels[8];
};

const average = (scores: readonly number[]): number =>
  Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);

const getSignals = (input: CountyGovernanceMaturityInput = {}) => {
  const governanceConfidenceScore = clampScore(input.governanceConfidenceScore);
  const governanceReliabilityScore = clampScore(input.governanceReliabilityScore);
  const explainabilityScore = clampScore(input.explainabilityScore);
  const resilienceEvidenceScore = clampScore(input.resilienceEvidenceScore);
  const coherenceEvidenceScore = clampScore(input.coherenceEvidenceScore);
  const durabilityEvidenceScore = clampScore(input.durabilityEvidenceScore);
  const failClosedDisciplineScore = clampScore(input.failClosedDisciplineScore);
  const convergenceEvidenceScore = clampScore(input.convergenceEvidenceScore);
  const unresolvedWarningCodes = normalizeWarnings(input.unresolvedWarningCodes);
  const suppressedWarningCodes = normalizeWarnings(input.suppressedWarningCodes);
  const currentWarningCodes = normalizeWarnings(input.currentWarningCodes);
  const priorWarningCodes = normalizeWarnings(input.priorWarningCodes);
  const unresolvedWarningCount = Math.max(clampCount(input.unresolvedWarningCount), unresolvedWarningCodes.length);
  const suppressedWarningCount = Math.max(clampCount(input.suppressedWarningCount), suppressedWarningCodes.length);
  const escalationCycleCount = clampCount(input.escalationCycleCount);
  const resolutionReversalCount = clampCount(input.resolutionReversalCount);
  const inconsistentDecisionCount = clampCount(input.inconsistentDecisionCount);
  const driftEventCount = clampCount(input.driftEventCount);
  const insufficientEvidence =
    !hasIdentity(input) || !hasPhaseClassifications(input) || input.monitoringWindowComplete !== true;
  const readinessPositive = includesAny(input.governanceReadinessClassification, [
    "ready",
    "mature",
    "stable",
    "durable",
  ]);
  const decisionPositive = includesAny(input.decisionSupportClassification, [
    "consistent",
    "supported",
    "stable",
    "approved",
  ]);
  const escalationPressure = includesAny(input.escalationClassification, [
    "required",
    "critical",
    "deadlock",
    "instability",
    "unresolved",
  ]);
  const resolutionPositive = includesAny(input.resolutionClassification, [
    "fully_resolved",
    "resolved_with_restrictions",
    "resolved",
  ]);
  const continuityDurable = includesAny(input.continuityClassification, ["durable", "stable"]);
  const continuityFragile = includesAny(input.continuityClassification, [
    "fragile",
    "churn",
    "unverified",
    "fail_closed",
  ]);
  const driftWeak = !includesAny(input.driftClassification, ["no_drift_detected", "minor_monitoring_drift"]);
  const convergencePositive = includesAny(input.convergenceClassification, [
    "durable_convergence",
    "governance_coherence_maturing",
    "stable_convergence",
  ]);
  const convergenceWeak =
    !convergencePositive ||
    includesAny(input.convergenceClassification, [
      "unverified",
      "fragile",
      "temporary",
      "suppression",
      "unresolved",
      "masked",
      "fail_closed",
    ]);
  const escalationResolutionHealthy =
    !escalationPressure &&
    resolutionPositive &&
    escalationCycleCount <= 1 &&
    resolutionReversalCount === 0 &&
    inconsistentDecisionCount === 0;
  const convergenceTrustworthy =
    convergencePositive &&
    convergenceEvidenceScore >= 80 &&
    unresolvedWarningCount === 0 &&
    suppressedWarningCount === 0 &&
    !convergenceWeak;
  const driftResistanceStrong = !driftWeak && driftEventCount === 0 && resilienceEvidenceScore >= 80;
  const failClosedDisciplineDurable =
    failClosedDisciplineScore >= 80 && (input.failClosedElevatedCurrently === true || failClosedDisciplineScore >= 90);
  const explainabilityDurable = explainabilityScore >= 80;
  const coherenceDurable = coherenceEvidenceScore >= 80 && inconsistentDecisionCount === 0;
  const operationalMaturityScore = average([
    governanceConfidenceScore,
    governanceReliabilityScore,
    readinessPositive ? 100 : 45,
    decisionPositive ? 100 : 45,
    escalationResolutionHealthy ? 100 : 35,
  ]);
  const durableMaturityScore = average([
    durabilityEvidenceScore,
    continuityDurable && !continuityFragile ? 100 : 45,
    driftResistanceStrong ? 100 : 35,
    resolutionReversalCount === 0 ? 100 : 25,
  ]);
  const maturityIntegrityScore = average([
    convergenceEvidenceScore,
    convergenceTrustworthy ? 100 : 35,
    unresolvedWarningCount === 0 ? 100 : 25,
    suppressedWarningCount === 0 ? 100 : 20,
    coherenceDurable ? 100 : 45,
  ]);
  const resilienceScore = average([
    resilienceEvidenceScore,
    driftResistanceStrong ? 100 : 35,
    input.stressSignalsPresent === true ? 70 : 100,
    failClosedDisciplineDurable ? 100 : 35,
  ]);
  const coherenceScore = average([
    coherenceEvidenceScore,
    coherenceDurable ? 100 : 35,
    decisionPositive ? 100 : 45,
    convergencePositive ? 100 : 45,
  ]);
  const governanceMaturityScore = average([
    operationalMaturityScore,
    durableMaturityScore,
    maturityIntegrityScore,
    resilienceScore,
    coherenceScore,
    failClosedDisciplineScore,
    explainabilityScore,
  ]);
  const highSurfaceScores =
    governanceConfidenceScore >= 80 &&
    governanceReliabilityScore >= 80 &&
    (coherenceEvidenceScore >= 80 || convergenceEvidenceScore >= 80);
  const lowWarningPattern =
    currentWarningCodes.length === 0 || currentWarningCodes.length < Math.max(priorWarningCodes.length, 1);
  const suppressionMistakenForMaturity = suppressedWarningCount > 0 && (unresolvedWarningCount > 0 || durabilityEvidenceScore < 80);
  const lowWarningsWithWeakEvidence =
    lowWarningPattern && (durabilityEvidenceScore < 65 || explainabilityScore < 65 || resilienceEvidenceScore < 65);
  const stabilityMistakenForMaturity =
    continuityDurable && (operationalMaturityScore < 75 || durableMaturityScore < 75 || resilienceScore < 75);
  const matureButNotResilientDetected =
    operationalMaturityScore >= 80 && coherenceScore >= 80 && resilienceScore < 70;
  const maturityUnderStress =
    input.stressSignalsPresent === true &&
    (resilienceScore < 80 || driftWeak || escalationCycleCount > 1 || resolutionReversalCount > 0);
  const governanceDisciplineDegrading =
    failClosedDisciplineScore < 60 ||
    inconsistentDecisionCount > 0 ||
    (input.failClosedElevatedCurrently === true && failClosedDisciplineScore < 80);
  const surfaceMaturityDetected =
    highSurfaceScores &&
    (lowWarningsWithWeakEvidence ||
      stabilityMistakenForMaturity ||
      !explainabilityDurable ||
      !driftResistanceStrong ||
      !convergenceTrustworthy);
  const falseMaturitySuspected =
    highSurfaceScores &&
    (suppressionMistakenForMaturity ||
      unresolvedWarningCount > 0 ||
      resolutionReversalCount > 0 ||
      (convergencePositive && (driftWeak || resilienceScore < 70)) ||
      (coherenceEvidenceScore >= 80 && inconsistentDecisionCount > 0));
  const fragileMaturityDetected =
    governanceMaturityScore >= 60 &&
    (durableMaturityScore < 70 ||
      maturityIntegrityScore < 70 ||
      continuityFragile ||
      escalationCycleCount >= 2 ||
      driftEventCount > 0);
  const failClosedMaturityRequired =
    failClosedDisciplineScore < 45 ||
    suppressionMistakenForMaturity ||
    (input.failClosedElevatedCurrently === true && (falseMaturitySuspected || governanceDisciplineDegrading));
  const contradictionSignals = [
    surfaceMaturityDetected,
    falseMaturitySuspected,
    matureButNotResilientDetected,
    maturityUnderStress,
    governanceDisciplineDegrading,
    !escalationResolutionHealthy,
    !convergenceTrustworthy,
    !driftResistanceStrong,
    !failClosedDisciplineDurable,
    !explainabilityDurable,
    !coherenceDurable,
    suppressionMistakenForMaturity,
    lowWarningsWithWeakEvidence,
    stabilityMistakenForMaturity,
    resolutionReversalCount > 0,
  ];
  const severeContradictionSignals = [
    falseMaturitySuspected,
    governanceDisciplineDegrading,
    suppressionMistakenForMaturity,
    resolutionReversalCount > 0,
    failClosedMaturityRequired,
    unresolvedWarningCount > 0,
  ];
  const contradictionCount = contradictionSignals.filter(Boolean).length;
  const severeContradictionCount = severeContradictionSignals.filter(Boolean).length;
  const institutionalReadinessDetected =
    governanceMaturityScore >= 90 &&
    operationalMaturityScore >= 88 &&
    durableMaturityScore >= 88 &&
    maturityIntegrityScore >= 88 &&
    resilienceScore >= 88 &&
    coherenceScore >= 88 &&
    failClosedDisciplineScore >= 90 &&
    explainabilityScore >= 90 &&
    contradictionCount === 0 &&
    input.stressSignalsPresent === true;

  return {
    governanceConfidenceScore,
    governanceReliabilityScore,
    explainabilityScore,
    resilienceEvidenceScore,
    coherenceEvidenceScore,
    durabilityEvidenceScore,
    failClosedDisciplineScore,
    convergenceEvidenceScore,
    unresolvedWarningCount,
    suppressedWarningCount,
    escalationCycleCount,
    resolutionReversalCount,
    inconsistentDecisionCount,
    driftEventCount,
    currentWarningCodes,
    priorWarningCodes,
    unresolvedWarningCodes,
    suppressedWarningCodes,
    insufficientEvidence,
    readinessPositive,
    decisionPositive,
    escalationPressure,
    resolutionPositive,
    continuityDurable,
    continuityFragile,
    driftWeak,
    convergencePositive,
    convergenceWeak,
    escalationResolutionHealthy,
    convergenceTrustworthy,
    driftResistanceStrong,
    failClosedDisciplineDurable,
    explainabilityDurable,
    coherenceDurable,
    operationalMaturityScore,
    durableMaturityScore,
    maturityIntegrityScore,
    resilienceScore,
    coherenceScore,
    governanceMaturityScore,
    highSurfaceScores,
    suppressionMistakenForMaturity,
    lowWarningsWithWeakEvidence,
    stabilityMistakenForMaturity,
    matureButNotResilientDetected,
    maturityUnderStress,
    governanceDisciplineDegrading,
    surfaceMaturityDetected,
    falseMaturitySuspected,
    fragileMaturityDetected,
    failClosedMaturityRequired,
    contradictionCount,
    severeContradictionCount,
    institutionalReadinessDetected,
  };
};

const getClassificationAndSeverity = (
  input: CountyGovernanceMaturityInput,
): {
  classification: CountyGovernanceMaturityClassification;
  severity: CountyGovernanceMaturitySeverity;
} => {
  const signals = getSignals(input);

  if (signals.failClosedMaturityRequired) {
    return { classification: "fail_closed_maturity_required", severity: "critical" };
  }

  if (signals.falseMaturitySuspected) {
    return { classification: "false_maturity_suspected", severity: "critical" };
  }

  if (signals.governanceDisciplineDegrading) {
    return { classification: "governance_discipline_degradation", severity: "high" };
  }

  if (signals.maturityUnderStress) {
    return { classification: "maturity_under_stress", severity: "high" };
  }

  if (signals.matureButNotResilientDetected) {
    return { classification: "mature_but_not_resilient", severity: "elevated" };
  }

  if (signals.surfaceMaturityDetected) {
    return { classification: "surface_maturity", severity: "elevated" };
  }

  if (signals.fragileMaturityDetected) {
    return { classification: "fragile_maturity", severity: "elevated" };
  }

  if (signals.insufficientEvidence) {
    return { classification: "maturity_unverified", severity: "elevated" };
  }

  if (signals.institutionalReadinessDetected) {
    return { classification: "institutional_grade_governance", severity: "low" };
  }

  if (
    signals.governanceMaturityScore >= 85 &&
    signals.durableMaturityScore >= 82 &&
    signals.maturityIntegrityScore >= 82 &&
    signals.resilienceScore >= 80
  ) {
    return { classification: "durable_maturity", severity: "low" };
  }

  if (signals.operationalMaturityScore >= 80 && signals.coherenceScore >= 78) {
    return { classification: "operationally_mature", severity: "moderate" };
  }

  if (signals.coherenceScore >= 75 && signals.operationalMaturityScore < 70) {
    return { classification: "coherent_but_immature", severity: "moderate" };
  }

  if (signals.governanceMaturityScore >= 65) {
    return { classification: "stabilizing_maturity", severity: "moderate" };
  }

  return { classification: "developing_governance", severity: "moderate" };
};

const getWarningCodes = (input: CountyGovernanceMaturityInput): CountyGovernanceMaturityWarningCode[] => {
  const signals = getSignals(input);
  const warningCodes: CountyGovernanceMaturityWarningCode[] = [];

  if (signals.insufficientEvidence) {
    warningCodes.push("INSUFFICIENT_MATURITY_EVIDENCE");
  }

  if (signals.surfaceMaturityDetected) {
    warningCodes.push("SURFACE_MATURITY_DETECTED");
  }

  if (signals.falseMaturitySuspected) {
    warningCodes.push("FALSE_MATURITY_SUSPECTED");
  }

  if (signals.fragileMaturityDetected) {
    warningCodes.push("FRAGILE_MATURITY_DETECTED");
  }

  if (signals.maturityUnderStress) {
    warningCodes.push("MATURITY_UNDER_STRESS");
  }

  if (signals.matureButNotResilientDetected) {
    warningCodes.push("MATURE_BUT_NOT_RESILIENT");
  }

  if (signals.governanceDisciplineDegrading) {
    warningCodes.push("GOVERNANCE_DISCIPLINE_DEGRADING");
  }

  if (!signals.escalationResolutionHealthy) {
    warningCodes.push("ESCALATION_RESOLUTION_IMBALANCE");
  }

  if (!signals.convergenceTrustworthy) {
    warningCodes.push("CONVERGENCE_NOT_TRUSTWORTHY");
  }

  if (!signals.driftResistanceStrong) {
    warningCodes.push("DRIFT_RESISTANCE_WEAK");
  }

  if (!signals.failClosedDisciplineDurable) {
    warningCodes.push("FAIL_CLOSED_DISCIPLINE_WEAK");
  }

  if (!signals.explainabilityDurable) {
    warningCodes.push("EXPLAINABILITY_NOT_DURABLE");
  }

  if (!signals.coherenceDurable) {
    warningCodes.push("COHERENCE_NOT_DURABLE");
  }

  if (signals.suppressionMistakenForMaturity) {
    warningCodes.push("SUPPRESSION_MISTAKEN_FOR_MATURITY");
  }

  if (signals.lowWarningsWithWeakEvidence) {
    warningCodes.push("LOW_WARNINGS_WITH_WEAK_EVIDENCE");
  }

  if (signals.stabilityMistakenForMaturity) {
    warningCodes.push("STABILITY_MISTAKEN_FOR_MATURITY");
  }

  if (signals.resolutionReversalCount > 0) {
    warningCodes.push("RESOLUTION_REVERSALS_UNDERCUT_MATURITY");
  }

  if (!signals.institutionalReadinessDetected) {
    warningCodes.push("INSTITUTIONAL_GRADE_NOT_PROVEN");
  }

  if (signals.failClosedMaturityRequired) {
    warningCodes.push("FAIL_CLOSED_MATURITY_REQUIRED");
  }

  return warningCodes;
};

const getReasons = (
  classification: CountyGovernanceMaturityClassification,
  input: CountyGovernanceMaturityInput,
): string[] => {
  const signals = getSignals(input);
  const reasons: string[] = [];

  if (classification === "institutional_grade_governance") {
    reasons.push("Governance maturity is stress-tested, durable, coherent, explainable, and fail-closed disciplined.");
  }

  if (classification === "maturity_unverified") {
    reasons.push("Governance maturity cannot be verified because identity, S11-S17 classifications, or monitoring evidence is incomplete.");
  }

  if (signals.surfaceMaturityDetected) {
    reasons.push("High surface maturity signals are not supported by enough durability, resilience, convergence, or explainability evidence.");
  }

  if (signals.falseMaturitySuspected) {
    reasons.push("Positive maturity indicators conflict with suppression, unresolved warnings, drift weakness, reversals, or inconsistent decisions.");
  }

  if (signals.fragileMaturityDetected) {
    reasons.push("Maturity signals are present but durability, integrity, continuity, drift, or escalation evidence remains fragile.");
  }

  if (signals.maturityUnderStress) {
    reasons.push("Stress signals are present and governance resilience is not strong enough to prove durable maturity under pressure.");
  }

  if (signals.matureButNotResilientDetected) {
    reasons.push("Operational maturity and coherence are stronger than the supplied resilience evidence.");
  }

  if (signals.governanceDisciplineDegrading) {
    reasons.push("Governance discipline is degrading through weak fail-closed evidence or inconsistent decisions.");
  }

  if (!signals.escalationResolutionHealthy) {
    reasons.push("Escalation and resolution patterns are not healthy enough to prove mature governance.");
  }

  if (!signals.convergenceTrustworthy) {
    reasons.push("Convergence quality is not trustworthy enough to support durable maturity.");
  }

  if (!signals.driftResistanceStrong) {
    reasons.push("Drift resistance is weak or unproven.");
  }

  if (!signals.failClosedDisciplineDurable) {
    reasons.push("Fail-closed discipline is not durable enough to support maturity escalation.");
  }

  return reasons;
};

const getRecommendations = (
  classification: CountyGovernanceMaturityClassification,
): CountyGovernanceMaturityRecommendation[] => {
  if (classification === "institutional_grade_governance" || classification === "durable_maturity") {
    return [
      {
        recommendationType: "continue_monitoring",
        description: "Continue advisory-only monitoring with fail-closed execution controls preserved.",
        required: false,
      },
    ];
  }

  const recommendations: CountyGovernanceMaturityRecommendation[] = [
    {
      recommendationType: "document",
      description: "Document maturity evidence, contradictions, warning handling, and fail-closed rationale.",
      required: true,
    },
    {
      recommendationType: "continue_monitoring",
      description: "Keep governance maturity monitoring active before any future activation decision.",
      required: true,
    },
  ];

  if (
    classification === "surface_maturity" ||
    classification === "maturity_under_stress" ||
    classification === "mature_but_not_resilient" ||
    classification === "false_maturity_suspected" ||
    classification === "governance_discipline_degradation" ||
    classification === "fail_closed_maturity_required"
  ) {
    recommendations.push({
      recommendationType: "review",
      description: "Route maturity contradictions for human governance review.",
      required: true,
    });
  }

  if (
    classification !== "operationally_mature" &&
    classification !== "stabilizing_maturity" &&
    classification !== "developing_governance" &&
    classification !== "coherent_but_immature"
  ) {
    recommendations.push({
      recommendationType: "restrict_planning",
      description: "Restrict advisory planning while maturity remains fragile, false, stressed, or unverified.",
      required: true,
    });
  }

  if (classification === "fail_closed_maturity_required") {
    recommendations.push({
      recommendationType: "maintain_fail_closed",
      description: "Maintain elevated fail-closed controls until maturity contradictions are resolved.",
      required: true,
    });
  }

  return recommendations;
};

export function evaluateCountyGovernanceMaturity(
  input: CountyGovernanceMaturityInput = {},
): CountyGovernanceMaturityResult {
  const { classification, severity } = getClassificationAndSeverity(input);
  const signals = getSignals(input);
  const warningCodes = getWarningCodes(input);
  const failClosedShouldRemainElevated =
    classification === "fail_closed_maturity_required" ||
    classification === "false_maturity_suspected" ||
    classification === "governance_discipline_degradation" ||
    input.failClosedElevatedCurrently === true;
  const planningMayContinue =
    classification === "institutional_grade_governance" ||
    classification === "durable_maturity" ||
    classification === "operationally_mature" ||
    classification === "stabilizing_maturity" ||
    classification === "developing_governance" ||
    classification === "coherent_but_immature";

  return {
    maturityClassification: classification,
    maturitySeverity: severity,
    maturityLevel: levelFromScore<CountyGovernanceMaturityLevel>(signals.governanceMaturityScore, [
      90,
      "institutional",
      80,
      "mature",
      65,
      "stabilizing",
      45,
      "developing",
      "immature",
    ]),
    stabilityLevel: signals.insufficientEvidence
      ? "unverified"
      : signals.maturityUnderStress && signals.resilienceScore >= 88
        ? "stress_tested"
        : levelFromScore<CountyGovernanceMaturityStabilityLevel>(signals.durableMaturityScore, [
            88,
            "durable",
            75,
            "stable",
            50,
            "fragile",
            1,
            "fragile",
            "unverified",
          ]),
    integrityLevel: levelFromScore<CountyGovernanceMaturityIntegrityLevel>(signals.maturityIntegrityScore, [
      90,
      "institutional",
      82,
      "strong",
      70,
      "credible",
      45,
      "partial",
      "weak",
    ]),
    resilienceLevel:
      signals.maturityUnderStress && signals.resilienceScore >= 88
        ? "stress_resilient"
        : levelFromScore<CountyGovernanceMaturityResilienceLevel>(signals.resilienceScore, [
            82,
            "resilient",
            68,
            "recovering",
            45,
            "fragile",
            1,
            "fragile",
            "unproven",
          ]),
    coherenceLevel: levelFromScore<CountyGovernanceMaturityCoherenceLevel>(signals.coherenceScore, [
      90,
      "institutional",
      82,
      "durable",
      70,
      "coherent",
      45,
      "partial",
      "incoherent",
    ]),
    survivabilityMaturityLevel: levelFromScore<CountyGovernanceMaturityResult["survivabilityMaturityLevel"]>(
      signals.durableMaturityScore,
      [90, "institutional", 82, "durable", 70, "stable", 45, "developing", "unproven"],
    ),
    governanceDisciplineDurability: levelFromScore<
      CountyGovernanceMaturityResult["governanceDisciplineDurability"]
    >(signals.failClosedDisciplineScore, [90, "institutional", 82, "durable", 70, "stable", 45, "partial", "weak"]),
    explainabilityIntegrityLevel: levelFromScore<CountyGovernanceMaturityResult["explainabilityIntegrityLevel"]>(
      signals.explainabilityScore,
      [90, "institutional", 82, "strong", 70, "credible", 45, "partial", "weak"],
    ),
    governanceMaturityScore: signals.governanceMaturityScore,
    operationalMaturityScore: signals.operationalMaturityScore,
    durableMaturityScore: signals.durableMaturityScore,
    maturityIntegrityScore: signals.maturityIntegrityScore,
    resilienceScore: signals.resilienceScore,
    coherenceScore: signals.coherenceScore,
    maturityContradictionSummary: {
      contradictionCount: signals.contradictionCount,
      severeContradictionCount: signals.severeContradictionCount,
      unresolvedContradictionsPresent: signals.contradictionCount > 0,
    },
    surfaceMaturityDetected: signals.surfaceMaturityDetected,
    falseMaturitySuspected: signals.falseMaturitySuspected,
    fragileMaturityDetected: signals.fragileMaturityDetected,
    maturityUnderStress: signals.maturityUnderStress,
    institutionalReadinessDetected: signals.institutionalReadinessDetected,
    matureButNotResilientDetected: signals.matureButNotResilientDetected,
    escalationResolutionHealthy: signals.escalationResolutionHealthy,
    convergenceTrustworthy: signals.convergenceTrustworthy,
    driftResistanceStrong: signals.driftResistanceStrong,
    failClosedDisciplineDurable: signals.failClosedDisciplineDurable,
    explainabilityDurable: signals.explainabilityDurable,
    planningMayContinue,
    monitoringRequired: classification !== "institutional_grade_governance",
    humanReviewRecommended:
      severity === "high" ||
      severity === "critical" ||
      classification === "surface_maturity" ||
      classification === "maturity_under_stress" ||
      classification === "mature_but_not_resilient",
    failClosedShouldRemainElevated,
    warningCodes,
    maturityReasons: getReasons(classification, input),
    recommendations: getRecommendations(classification),
    explainability: {
      summary: `${input.countyName ?? "Unknown county"} ${input.sourceName ?? "unknown source"} governance maturity evaluated with deterministic advisory-only rules.`,
      reviewedSignals: input.explainabilityContext?.reviewedSignals ?? [],
      reasons: input.explainabilityContext?.notes ?? [],
      deterministicRulesApplied: [
        "scores clamped between 0 and 100",
        "counts clamped to non-negative integers",
        "warning codes normalized with stable de-duplication",
        "maturity is gated by durability, resilience, convergence trust, and fail-closed discipline",
        "surface stability and warning reduction cannot prove maturity by themselves",
        "suppressed warnings do not count as resolved maturity evidence",
        "drift weakness, resolution reversals, and discipline degradation prevent institutional maturity",
        "all results preserve advisory-only fail-closed execution blocking",
      ],
      maturityEvidence: {
        governanceSignals: [
          signals.readinessPositive ? "governance readiness supportive" : "governance readiness weak or unverified",
          signals.decisionPositive ? "decision support coherent" : "decision support not proven coherent",
          signals.escalationResolutionHealthy
            ? "escalation and resolution pattern healthy"
            : "escalation and resolution imbalance present",
        ],
        resilienceSignals: [
          signals.driftResistanceStrong ? "drift resistance strong" : "drift resistance weak",
          signals.maturityUnderStress ? "maturity under stress" : "no stress maturity pressure detected",
          signals.matureButNotResilientDetected
            ? "mature but not resilient"
            : "resilience aligned with maturity posture",
        ],
        durabilitySignals: [
          signals.continuityDurable && !signals.continuityFragile
            ? "continuity supports durability"
            : "continuity durability not proven",
          signals.durableMaturityScore >= 80 ? "durability score supports maturity" : "durability score limits maturity",
          signals.resolutionReversalCount > 0 ? "resolution reversals detected" : "no resolution reversals detected",
        ],
        contradictionSignals: [
          signals.surfaceMaturityDetected ? "surface maturity detected" : "no surface maturity contradiction detected",
          signals.falseMaturitySuspected ? "false maturity suspected" : "no false maturity contradiction detected",
          signals.suppressionMistakenForMaturity
            ? "suppression mistaken for maturity"
            : "suppression not counted as maturity evidence",
        ],
        failClosedSignals: [
          signals.failClosedDisciplineDurable ? "fail-closed discipline durable" : "fail-closed discipline weak",
          failClosedShouldRemainElevated
            ? "fail-closed should remain elevated"
            : "baseline fail-closed controls remain preserved",
        ],
      },
    },
    ingestionBlocked: CountyGovernanceMaturityFailClosedDefaults.ingestionBlocked,
    automationBlocked: CountyGovernanceMaturityFailClosedDefaults.automationBlocked,
    executionBlocked: CountyGovernanceMaturityFailClosedDefaults.executionBlocked,
    planningOnly: CountyGovernanceMaturityFailClosedDefaults.planningOnly,
    failClosed: CountyGovernanceMaturityFailClosedDefaults.failClosed,
  };
}
