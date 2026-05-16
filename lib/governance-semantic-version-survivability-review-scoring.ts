import type {
  GovernanceSemanticVersionSurvivabilityAreaAssessment,
  GovernanceSemanticVersionSurvivabilityClassification,
  GovernanceSemanticVersionSurvivabilityFinding,
} from "./governance-semantic-version-survivability-review-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function semanticVersionSurvivabilityClassificationFromScore(
  score: number,
): GovernanceSemanticVersionSurvivabilityClassification {
  if (score >= 85) return "institutionally_version_survivable";
  if (score >= 70) return "semantically_survivable";
  if (score >= 45) return "partially_survivable";
  return "version_fragile";
}

export function calculateSemanticVersionSurvivabilityFindingConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore((params.baseConfidence ?? 58) + Math.min(24, params.evidenceCount * 5) + Math.min(16, params.factorCount * 3));
}

export function calculateSemanticVersionSurvivabilityAreaScore(params: {
  baseScore: number;
  versionStableSignalCount: number;
  versionFragileSignalCount: number;
  findingCount: number;
  explainabilityCount: number;
}): number {
  return clampScore(
    params.baseScore +
      Math.min(18, params.versionStableSignalCount * 2) +
      Math.min(12, params.explainabilityCount * 2) -
      Math.min(34, params.versionFragileSignalCount * 5) -
      Math.min(24, params.findingCount * 6),
  );
}

export function calculateOverallSemanticVersionSurvivabilityScore(params: {
  areaAssessments: GovernanceSemanticVersionSurvivabilityAreaAssessment[];
  findings: GovernanceSemanticVersionSurvivabilityFinding[];
}): number {
  const areaAverage =
    params.areaAssessments.length === 0
      ? 0
      : params.areaAssessments.reduce((total, assessment) => total + assessment.score, 0) / params.areaAssessments.length;
  const durableAreaBonus =
    params.areaAssessments.filter(
      (assessment) =>
        assessment.classification === "semantically_survivable" ||
        assessment.classification === "institutionally_version_survivable",
    ).length * 2;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;

  return clampScore(areaAverage + durableAreaBonus - elevatedPenalty - criticalPenalty);
}
