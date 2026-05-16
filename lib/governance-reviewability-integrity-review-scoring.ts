import type {
  GovernanceReviewabilityAreaAssessment,
  GovernanceReviewabilityIntegrityClassification,
  GovernanceReviewabilityIntegrityFinding,
} from "./governance-reviewability-integrity-review-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function reviewabilityIntegrityClassificationFromScore(
  score: number,
): GovernanceReviewabilityIntegrityClassification {
  if (score >= 85) return "institutionally_reviewable";
  if (score >= 70) return "reviewable";
  if (score >= 45) return "partially_reviewable";
  return "weak";
}

export function calculateReviewabilityFindingConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore((params.baseConfidence ?? 58) + Math.min(24, params.evidenceCount * 5) + Math.min(16, params.factorCount * 3));
}

export function calculateReviewabilityAreaScore(params: {
  baseScore: number;
  reviewableSignalCount: number;
  weakSignalCount: number;
  findingCount: number;
  explainabilityCount: number;
}): number {
  return clampScore(
    params.baseScore +
      Math.min(16, params.reviewableSignalCount * 2) +
      Math.min(12, params.explainabilityCount * 2) -
      Math.min(28, params.weakSignalCount * 5) -
      Math.min(24, params.findingCount * 6),
  );
}

export function calculateOverallReviewabilityIntegrityScore(params: {
  areaAssessments: GovernanceReviewabilityAreaAssessment[];
  findings: GovernanceReviewabilityIntegrityFinding[];
}): number {
  const areaAverage =
    params.areaAssessments.length === 0
      ? 0
      : params.areaAssessments.reduce((total, assessment) => total + assessment.score, 0) /
        params.areaAssessments.length;
  const strongAreaBonus =
    params.areaAssessments.filter(
      (assessment) => assessment.classification === "reviewable" || assessment.classification === "institutionally_reviewable",
    ).length * 2;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;

  return clampScore(areaAverage + strongAreaBonus - elevatedPenalty - criticalPenalty);
}
