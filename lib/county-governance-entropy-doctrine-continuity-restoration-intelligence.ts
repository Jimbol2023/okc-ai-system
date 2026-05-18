export type ContinuityRestorationClassification =
  | "durable_continuity_restoration"
  | "conditional_continuity_restoration"
  | "superficial_continuity_restoration"
  | "continuity_restoration_unsustainable"
  | "continuity_restoration_blocked"
  | "continuity_restoration_unsafe"
  | "continuity_restoration_continuation_required"
  | "continuity_restoration_entropy_burden"
  | "continuity_restoration_explainability_weakness"
  | "fail_closed_restoration_degradation"
  | "recursive_restoration_dependency_conflict"
  | "collapse_sensitive_restoration_rejection"
  | "bounded_restoration_reevaluation_required"
  | "continuity_restoration_survivability_weakness"
  | "unresolved_restoration_doctrine_conflict"
  | "operationally_unsustainable_restoration"
  | "continuity_restoration_unverified";

export type RestorationResilienceLevel = "unverified" | "weak" | "conditional" | "resilient" | "durable";
export type RestorationDependencyLevel = "none" | "low" | "moderate" | "high" | "critical";
export type RestorationCollapseRiskLevel = "none" | "low" | "moderate" | "high" | "critical";
export type RestorationExplainabilityLevel = "opaque" | "partial" | "adequate" | "strong";
export type RestorationContinuationStatus = "not_required" | "bounded_reevaluation" | "continuation_required";
export type RestorationSafetyStatus = "safe" | "guarded" | "unsafe" | "blocked" | "collapse_sensitive";
export type RestorationSustainabilityStatus = "sustainable" | "conditional" | "unsustainable" | "unverified";

export type ContinuityRestorationWarningCode =
  | "S33_RESTORATION_EXPLAINABILITY_WEAKNESS"
  | "S33_RESTORATION_DEPENDENCY_CONCENTRATION"
  | "S33_RECURSIVE_RESTORATION_DEPENDENCY"
  | "S33_RESTORATION_COLLAPSE_EXPOSURE"
  | "S33_FAIL_CLOSED_RESTORATION_DEGRADATION"
  | "S33_OPERATIONAL_RESTORATION_UNSUSTAINABLE"
  | "S33_UNRESOLVED_RESTORATION_CONFLICT"
  | "S33_RESTORATION_CONTINUATION_REQUIRED"
  | "S33_RESTORATION_UNVERIFIED"
  | "S33_BOUNDED_REEVALUATION_REQUIRED"
  | "S33_RESTORATION_SURVIVABILITY_WEAKNESS"
  | "S33_COLLAPSE_SENSITIVE_RESTORATION_REJECTION"
  | "S33_RESTORATION_BLOCKED"
  | "S33_RESTORATION_UNSAFE"
  | "S33_RESTORATION_ENTROPY_BURDEN"
  | "S33_SUPERFICIAL_RESTORATION";

export interface CountyGovernanceEntropyDoctrineContinuityRestorationIntelligenceInput {
  restorationContinuityScore?: number | null;
  restorationDurabilityScore?: number | null;
  restorationSustainabilityScore?: number | null;
  restorationExplainabilityScore?: number | null;
  restorationDependencyConcentrationScore?: number | null;
  restorationCollapseExposureScore?: number | null;
  restorationConflictPressureScore?: number | null;
  restorationSurvivabilityScore?: number | null;
  stewardshipContinuityScore?: number | null;
  institutionalMemoryContinuityScore?: number | null;
  successionResilienceScore?: number | null;
  repeatedDisruptionExposureScore?: number | null;
  boundedReevaluationRequired?: boolean | null;
  unresolvedDoctrineConflictPresent?: boolean | null;
  restorationDependencyRecursive?: boolean | null;
  restorationIntegrityDegrading?: boolean | null;
  operationalRestorationSustainable?: boolean | null;
  continuationModeRequired?: boolean | null;
  restorationConditionsStable?: boolean | null;
  restorationEvidenceVerified?: boolean | null;
}

export interface ContinuityRestorationExplainability {
  summary: string;
  restorationDrivers: string[];
  sustainabilityDrivers: string[];
  safetyDrivers: string[];
  survivabilityDrivers: string[];
  dependencyDrivers: string[];
  conflictDrivers: string[];
  reevaluationDrivers: string[];
  failClosedDrivers: string[];
  warningDerivation: string[];
  deterministicRulesApplied: string[];
}

export interface CountyGovernanceEntropyDoctrineContinuityRestorationIntelligenceResult {
  restorationClassification: ContinuityRestorationClassification;
  restorationResilienceLevel: RestorationResilienceLevel;
  restorationDependencyLevel: RestorationDependencyLevel;
  restorationCollapseRiskLevel: RestorationCollapseRiskLevel;
  restorationExplainabilityLevel: RestorationExplainabilityLevel;
  restorationContinuationStatus: RestorationContinuationStatus;
  restorationSafetyStatus: RestorationSafetyStatus;
  restorationSustainabilityStatus: RestorationSustainabilityStatus;
  restorationWarnings: ContinuityRestorationWarningCode[];
  explainability: ContinuityRestorationExplainability;
  boundedReevaluationRequired: boolean;
  continuationRequired: boolean;
  restorationBlocked: boolean;
  restorationUnsafe: boolean;
  restorationUnverified: boolean;
  restorationEntropyBurdenDetected: boolean;
  failClosedRestorationIntegrityWeakness: boolean;
  recursiveRestorationDependencyConflict: boolean;
  operationalRestorationUnsustainable: boolean;
  collapseSensitiveRestorationRejected: boolean;
  ingestionBlocked: true;
  automationBlocked: true;
  executionBlocked: true;
  planningOnly: true;
  failClosed: true;
}

const warningOrder: ContinuityRestorationWarningCode[] = [
  "S33_RESTORATION_UNVERIFIED",
  "S33_RESTORATION_BLOCKED",
  "S33_RESTORATION_UNSAFE",
  "S33_SUPERFICIAL_RESTORATION",
  "S33_RESTORATION_CONTINUATION_REQUIRED",
  "S33_BOUNDED_REEVALUATION_REQUIRED",
  "S33_RESTORATION_ENTROPY_BURDEN",
  "S33_RESTORATION_EXPLAINABILITY_WEAKNESS",
  "S33_FAIL_CLOSED_RESTORATION_DEGRADATION",
  "S33_RECURSIVE_RESTORATION_DEPENDENCY",
  "S33_COLLAPSE_SENSITIVE_RESTORATION_REJECTION",
  "S33_RESTORATION_SURVIVABILITY_WEAKNESS",
  "S33_UNRESOLVED_RESTORATION_CONFLICT",
  "S33_OPERATIONAL_RESTORATION_UNSUSTAINABLE",
  "S33_RESTORATION_DEPENDENCY_CONCENTRATION",
  "S33_RESTORATION_COLLAPSE_EXPOSURE",
];

function clampScore(score: number | null | undefined): number {
  if (!Number.isFinite(score ?? Number.NaN)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(score as number)));
}

function hasAnyInput(input: CountyGovernanceEntropyDoctrineContinuityRestorationIntelligenceInput): boolean {
  return Object.values(input).some((value) => value !== undefined && value !== null);
}

function levelFromPositiveScore(score: number): RestorationDependencyLevel {
  if (score >= 90) {
    return "critical";
  }

  if (score >= 75) {
    return "high";
  }

  if (score >= 50) {
    return "moderate";
  }

  if (score >= 25) {
    return "low";
  }

  return "none";
}

function explainabilityLevel(score: number): RestorationExplainabilityLevel {
  if (score >= 80) {
    return "strong";
  }

  if (score >= 60) {
    return "adequate";
  }

  if (score >= 35) {
    return "partial";
  }

  return "opaque";
}

function resilienceLevel(score: number): RestorationResilienceLevel {
  if (score >= 85) {
    return "durable";
  }

  if (score >= 70) {
    return "resilient";
  }

  if (score >= 50) {
    return "conditional";
  }

  if (score > 0) {
    return "weak";
  }

  return "unverified";
}

function classifyRestoration(params: {
  hasEvidence: boolean;
  continuityScore: number;
  durabilityScore: number;
  sustainabilityScore: number;
  explainabilityScore: number;
  dependencyScore: number;
  collapseScore: number;
  conflictPressureScore: number;
  survivabilityScore: number;
  stewardshipScore: number;
  memoryScore: number;
  successionScore: number;
  disruptionScore: number;
  boundedReevaluationRequired: boolean;
  continuationRequired: boolean;
  restorationBlocked: boolean;
  restorationUnsafe: boolean;
  restorationEntropyBurdenDetected: boolean;
  failClosedRestorationIntegrityWeakness: boolean;
  recursiveRestorationDependencyConflict: boolean;
  operationalRestorationUnsustainable: boolean;
  collapseSensitiveRestorationRejected: boolean;
  unresolvedDoctrineConflictPresent: boolean;
  restorationEvidenceVerified: boolean;
}): ContinuityRestorationClassification {
  if (!params.hasEvidence || !params.restorationEvidenceVerified) {
    return "continuity_restoration_unverified";
  }

  if (params.collapseSensitiveRestorationRejected) {
    return "collapse_sensitive_restoration_rejection";
  }

  if (params.restorationUnsafe) {
    return "continuity_restoration_unsafe";
  }

  if (params.restorationBlocked) {
    return "continuity_restoration_blocked";
  }

  if (params.recursiveRestorationDependencyConflict) {
    return "recursive_restoration_dependency_conflict";
  }

  if (params.failClosedRestorationIntegrityWeakness) {
    return "fail_closed_restoration_degradation";
  }

  if (params.unresolvedDoctrineConflictPresent || params.conflictPressureScore >= 75) {
    return "unresolved_restoration_doctrine_conflict";
  }

  if (params.operationalRestorationUnsustainable) {
    return "operationally_unsustainable_restoration";
  }

  if (params.boundedReevaluationRequired) {
    return "bounded_restoration_reevaluation_required";
  }

  if (params.continuationRequired) {
    return "continuity_restoration_continuation_required";
  }

  if (params.restorationEntropyBurdenDetected) {
    return "continuity_restoration_entropy_burden";
  }

  if (params.survivabilityScore < 60 || params.stewardshipScore < 60 || params.memoryScore < 60 || params.successionScore < 60) {
    return "continuity_restoration_survivability_weakness";
  }

  if (params.explainabilityScore < 60) {
    return "continuity_restoration_explainability_weakness";
  }

  if (
    params.continuityScore >= 75 &&
    (params.explainabilityScore < 75 ||
      params.durabilityScore < 75 ||
      params.sustainabilityScore < 75 ||
      params.survivabilityScore < 75)
  ) {
    return "superficial_continuity_restoration";
  }

  if (
    params.continuityScore >= 70 &&
    params.durabilityScore >= 65 &&
    params.sustainabilityScore >= 65 &&
    params.survivabilityScore >= 65 &&
    params.explainabilityScore >= 60
  ) {
    return "conditional_continuity_restoration";
  }

  if (
    params.continuityScore >= 85 &&
    params.durabilityScore >= 85 &&
    params.sustainabilityScore >= 85 &&
    params.explainabilityScore >= 80 &&
    params.survivabilityScore >= 85 &&
    params.stewardshipScore >= 80 &&
    params.memoryScore >= 80 &&
    params.successionScore >= 80 &&
    params.dependencyScore <= 25 &&
    params.collapseScore <= 25 &&
    params.conflictPressureScore <= 25 &&
    params.disruptionScore <= 25
  ) {
    return "durable_continuity_restoration";
  }

  return "continuity_restoration_unsustainable";
}

function buildWarnings(params: {
  hasEvidence: boolean;
  restorationUnverified: boolean;
  restorationBlocked: boolean;
  restorationUnsafe: boolean;
  superficialRestoration: boolean;
  continuationRequired: boolean;
  boundedReevaluationRequired: boolean;
  restorationEntropyBurdenDetected: boolean;
  explainabilityScore: number;
  failClosedRestorationIntegrityWeakness: boolean;
  recursiveRestorationDependencyConflict: boolean;
  collapseSensitiveRestorationRejected: boolean;
  survivabilityWeak: boolean;
  unresolvedDoctrineConflictPresent: boolean;
  operationalRestorationUnsustainable: boolean;
  dependencyScore: number;
  collapseScore: number;
}): ContinuityRestorationWarningCode[] {
  const warnings = new Set<ContinuityRestorationWarningCode>();

  if (params.restorationUnverified || !params.hasEvidence) {
    warnings.add("S33_RESTORATION_UNVERIFIED");
  }

  if (params.restorationBlocked) {
    warnings.add("S33_RESTORATION_BLOCKED");
  }

  if (params.restorationUnsafe) {
    warnings.add("S33_RESTORATION_UNSAFE");
  }

  if (params.superficialRestoration) {
    warnings.add("S33_SUPERFICIAL_RESTORATION");
  }

  if (params.continuationRequired) {
    warnings.add("S33_RESTORATION_CONTINUATION_REQUIRED");
  }

  if (params.boundedReevaluationRequired) {
    warnings.add("S33_BOUNDED_REEVALUATION_REQUIRED");
  }

  if (params.restorationEntropyBurdenDetected) {
    warnings.add("S33_RESTORATION_ENTROPY_BURDEN");
  }

  if (params.explainabilityScore < 60 && params.hasEvidence) {
    warnings.add("S33_RESTORATION_EXPLAINABILITY_WEAKNESS");
  }

  if (params.failClosedRestorationIntegrityWeakness) {
    warnings.add("S33_FAIL_CLOSED_RESTORATION_DEGRADATION");
  }

  if (params.recursiveRestorationDependencyConflict) {
    warnings.add("S33_RECURSIVE_RESTORATION_DEPENDENCY");
  }

  if (params.collapseSensitiveRestorationRejected) {
    warnings.add("S33_COLLAPSE_SENSITIVE_RESTORATION_REJECTION");
  }

  if (params.survivabilityWeak) {
    warnings.add("S33_RESTORATION_SURVIVABILITY_WEAKNESS");
  }

  if (params.unresolvedDoctrineConflictPresent) {
    warnings.add("S33_UNRESOLVED_RESTORATION_CONFLICT");
  }

  if (params.operationalRestorationUnsustainable) {
    warnings.add("S33_OPERATIONAL_RESTORATION_UNSUSTAINABLE");
  }

  if (params.dependencyScore >= 50) {
    warnings.add("S33_RESTORATION_DEPENDENCY_CONCENTRATION");
  }

  if (params.collapseScore >= 50) {
    warnings.add("S33_RESTORATION_COLLAPSE_EXPOSURE");
  }

  return warningOrder.filter((warning) => warnings.has(warning));
}

function buildExplainability(params: {
  hasEvidence: boolean;
  classification: ContinuityRestorationClassification;
  warningCodes: ContinuityRestorationWarningCode[];
  continuityScore: number;
  durabilityScore: number;
  sustainabilityScore: number;
  explainabilityScore: number;
  dependencyScore: number;
  collapseScore: number;
  conflictPressureScore: number;
  survivabilityScore: number;
  stewardshipScore: number;
  memoryScore: number;
  successionScore: number;
  disruptionScore: number;
  boundedReevaluationRequired: boolean;
  continuationRequired: boolean;
  failClosedRestorationIntegrityWeakness: boolean;
}): ContinuityRestorationExplainability {
  return {
    summary: params.hasEvidence
      ? `S33 classified continuity restoration as ${params.classification}.`
      : "S33 classified continuity restoration as unverified because no caller-supplied restoration evidence was provided.",
    restorationDrivers: [
      `restoration continuity score: ${params.continuityScore}`,
      `restoration durability score: ${params.durabilityScore}`,
    ],
    sustainabilityDrivers: [`restoration sustainability score: ${params.sustainabilityScore}`],
    safetyDrivers: [
      `restoration collapse exposure score: ${params.collapseScore}`,
      `repeated disruption exposure score: ${params.disruptionScore}`,
    ],
    survivabilityDrivers: [
      `restoration survivability score: ${params.survivabilityScore}`,
      `stewardship continuity score: ${params.stewardshipScore}`,
      `institutional memory continuity score: ${params.memoryScore}`,
      `succession resilience score: ${params.successionScore}`,
    ],
    dependencyDrivers: [`restoration dependency concentration score: ${params.dependencyScore}`],
    conflictDrivers: [`restoration conflict pressure score: ${params.conflictPressureScore}`],
    reevaluationDrivers: [
      `bounded restoration reevaluation required: ${params.boundedReevaluationRequired}`,
      `continuation required: ${params.continuationRequired}`,
    ],
    failClosedDrivers: [`fail-closed restoration integrity weakness: ${params.failClosedRestorationIntegrityWeakness}`],
    warningDerivation: params.warningCodes.map((warning) => `${warning} derived from deterministic S33 thresholds.`),
    deterministicRulesApplied: [
      "Pure caller-input-only continuity restoration modeling.",
      "Bounded 0-100 score normalization.",
      "Stable warning-code ordering.",
      "Explicit restoration severity precedence ordering.",
      "No runtime, provider, database, network, clock, filesystem, or environment dependency.",
    ],
  };
}

export function evaluateCountyGovernanceEntropyDoctrineContinuityRestorationIntelligence(
  input: CountyGovernanceEntropyDoctrineContinuityRestorationIntelligenceInput,
): CountyGovernanceEntropyDoctrineContinuityRestorationIntelligenceResult {
  const safeInput = input ?? {};
  const hasEvidence = hasAnyInput(safeInput);

  const continuityScore = clampScore(safeInput.restorationContinuityScore);
  const durabilityScore = clampScore(safeInput.restorationDurabilityScore);
  const sustainabilityScore = clampScore(safeInput.restorationSustainabilityScore);
  const restorationExplainabilityScore = clampScore(safeInput.restorationExplainabilityScore);
  const dependencyScore = clampScore(safeInput.restorationDependencyConcentrationScore);
  const collapseScore = clampScore(safeInput.restorationCollapseExposureScore);
  const conflictPressureScore = clampScore(safeInput.restorationConflictPressureScore);
  const survivabilityScore = clampScore(safeInput.restorationSurvivabilityScore);
  const stewardshipScore = clampScore(safeInput.stewardshipContinuityScore);
  const memoryScore = clampScore(safeInput.institutionalMemoryContinuityScore);
  const successionScore = clampScore(safeInput.successionResilienceScore);
  const disruptionScore = clampScore(safeInput.repeatedDisruptionExposureScore);

  const restorationUnverified = !hasEvidence || safeInput.restorationEvidenceVerified !== true;
  const failClosedRestorationIntegrityWeakness = safeInput.restorationIntegrityDegrading === true;
  const recursiveRestorationDependencyConflict =
    safeInput.restorationDependencyRecursive === true || dependencyScore >= 90;
  const operationalRestorationUnsustainable = safeInput.operationalRestorationSustainable === false;
  const unresolvedDoctrineConflictPresent =
    safeInput.unresolvedDoctrineConflictPresent === true || conflictPressureScore >= 75;
  const survivabilityWeak =
    survivabilityScore < 60 || stewardshipScore < 60 || memoryScore < 60 || successionScore < 60;
  const restorationEntropyBurdenDetected = dependencyScore >= 50 || disruptionScore >= 50 || conflictPressureScore >= 50;
  const collapseSensitiveRestorationRejected =
    collapseScore >= 75 ||
    (collapseScore >= 50 &&
      (dependencyScore >= 75 ||
        disruptionScore >= 75 ||
        failClosedRestorationIntegrityWeakness ||
        recursiveRestorationDependencyConflict ||
        unresolvedDoctrineConflictPresent ||
        survivabilityWeak));
  const restorationUnsafe =
    collapseScore >= 90 ||
    continuityScore < 25 ||
    safeInput.restorationConditionsStable === false ||
    (collapseScore >= 75 && restorationEntropyBurdenDetected);
  const restorationBlocked =
    failClosedRestorationIntegrityWeakness ||
    recursiveRestorationDependencyConflict ||
    operationalRestorationUnsustainable ||
    unresolvedDoctrineConflictPresent ||
    (continuityScore < 40 && dependencyScore >= 75);
  const boundedReevaluationRequired =
    safeInput.boundedReevaluationRequired === true ||
    (!restorationBlocked &&
      !restorationUnsafe &&
      !collapseSensitiveRestorationRejected &&
      (sustainabilityScore < 75 ||
        durabilityScore < 75 ||
        dependencyScore >= 50 ||
        disruptionScore >= 50 ||
        safeInput.restorationEvidenceVerified !== true));
  const continuationRequired =
    safeInput.continuationModeRequired === true ||
    (!restorationBlocked &&
      !restorationUnsafe &&
      !collapseSensitiveRestorationRejected &&
      (conflictPressureScore >= 50 || survivabilityWeak));
  const superficialRestoration =
    continuityScore >= 75 &&
    (durabilityScore < 75 ||
      sustainabilityScore < 75 ||
      restorationExplainabilityScore < 75 ||
      survivabilityScore < 75 ||
      safeInput.restorationEvidenceVerified !== true);

  const restorationWarnings = buildWarnings({
    hasEvidence,
    restorationUnverified,
    restorationBlocked,
    restorationUnsafe,
    superficialRestoration,
    continuationRequired,
    boundedReevaluationRequired,
    restorationEntropyBurdenDetected,
    explainabilityScore: restorationExplainabilityScore,
    failClosedRestorationIntegrityWeakness,
    recursiveRestorationDependencyConflict,
    collapseSensitiveRestorationRejected,
    survivabilityWeak,
    unresolvedDoctrineConflictPresent,
    operationalRestorationUnsustainable,
    dependencyScore,
    collapseScore,
  });

  const restorationClassification = classifyRestoration({
    hasEvidence,
    continuityScore,
    durabilityScore,
    sustainabilityScore,
    explainabilityScore: restorationExplainabilityScore,
    dependencyScore,
    collapseScore,
    conflictPressureScore,
    survivabilityScore,
    stewardshipScore,
    memoryScore,
    successionScore,
    disruptionScore,
    boundedReevaluationRequired,
    continuationRequired,
    restorationBlocked,
    restorationUnsafe,
    restorationEntropyBurdenDetected,
    failClosedRestorationIntegrityWeakness,
    recursiveRestorationDependencyConflict,
    operationalRestorationUnsustainable,
    collapseSensitiveRestorationRejected,
    unresolvedDoctrineConflictPresent,
    restorationEvidenceVerified: safeInput.restorationEvidenceVerified === true,
  });

  const restorationSafetyStatus: RestorationSafetyStatus = collapseSensitiveRestorationRejected
    ? "collapse_sensitive"
    : restorationBlocked
      ? "blocked"
      : restorationUnsafe
        ? "unsafe"
        : collapseScore >= 50 || dependencyScore >= 50
          ? "guarded"
          : "safe";

  const restorationSustainabilityStatus: RestorationSustainabilityStatus = !hasEvidence
    ? "unverified"
    : operationalRestorationUnsustainable || sustainabilityScore < 50
      ? "unsustainable"
      : sustainabilityScore < 85 || boundedReevaluationRequired
        ? "conditional"
        : "sustainable";

  return {
    restorationClassification,
    restorationResilienceLevel: resilienceLevel(continuityScore),
    restorationDependencyLevel: levelFromPositiveScore(dependencyScore),
    restorationCollapseRiskLevel: levelFromPositiveScore(collapseScore),
    restorationExplainabilityLevel: explainabilityLevel(restorationExplainabilityScore),
    restorationContinuationStatus: continuationRequired
      ? "continuation_required"
      : boundedReevaluationRequired
        ? "bounded_reevaluation"
        : "not_required",
    restorationSafetyStatus,
    restorationSustainabilityStatus,
    restorationWarnings,
    explainability: buildExplainability({
      hasEvidence,
      classification: restorationClassification,
      warningCodes: restorationWarnings,
      continuityScore,
      durabilityScore,
      sustainabilityScore,
      explainabilityScore: restorationExplainabilityScore,
      dependencyScore,
      collapseScore,
      conflictPressureScore,
      survivabilityScore,
      stewardshipScore,
      memoryScore,
      successionScore,
      disruptionScore,
      boundedReevaluationRequired,
      continuationRequired,
      failClosedRestorationIntegrityWeakness,
    }),
    boundedReevaluationRequired,
    continuationRequired,
    restorationBlocked,
    restorationUnsafe,
    restorationUnverified,
    restorationEntropyBurdenDetected,
    failClosedRestorationIntegrityWeakness,
    recursiveRestorationDependencyConflict,
    operationalRestorationUnsustainable,
    collapseSensitiveRestorationRejected,
    ingestionBlocked: true,
    automationBlocked: true,
    executionBlocked: true,
    planningOnly: true,
    failClosed: true,
  };
}
