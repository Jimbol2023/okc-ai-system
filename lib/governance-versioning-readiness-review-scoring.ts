import type {
  GovernanceVersioningReadinessAreaAssessment,
  GovernanceVersioningReadinessClassification,
  GovernanceVersioningReadinessFinding,
} from "./governance-versioning-readiness-review-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function versioningReadinessClassificationFromScore(
  score: number,
): GovernanceVersioningReadinessClassification {
  if (score >= 85) return "institutionally_versionable";
  if (score >= 70) return "version_ready";
  if (score >= 45) return "partially_version_ready";
  return "version_fragile";
}

export function calculateVersioningFindingConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore((params.baseConfidence ?? 58) + Math.min(24, params.evidenceCount * 5) + Math.min(16, params.factorCount * 3));
}

export function calculateVersioningAreaScore(params: {
  baseScore: number;
  versionReadySignalCount: number;
  versionFragileSignalCount: number;
  findingCount: number;
  explainabilityCount: number;
}): number {
  return clampScore(
    params.baseScore +
      Math.min(16, params.versionReadySignalCount * 2) +
      Math.min(12, params.explainabilityCount * 2) -
      Math.min(30, params.versionFragileSignalCount * 5) -
      Math.min(24, params.findingCount * 6),
  );
}

export function calculateOverallVersioningReadinessScore(params: {
  areaAssessments: GovernanceVersioningReadinessAreaAssessment[];
  findings: GovernanceVersioningReadinessFinding[];
}): number {
  const areaAverage =
    params.areaAssessments.length === 0
      ? 0
      : params.areaAssessments.reduce((total, assessment) => total + assessment.score, 0) /
        params.areaAssessments.length;
  const readyAreaBonus =
    params.areaAssessments.filter(
      (assessment) => assessment.classification === "version_ready" || assessment.classification === "institutionally_versionable",
    ).length * 2;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;

  return clampScore(areaAverage + readyAreaBonus - elevatedPenalty - criticalPenalty);
}
