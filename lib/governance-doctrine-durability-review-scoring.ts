import type {
  GovernanceDoctrineDurabilityAreaAssessment,
  GovernanceDoctrineDurabilityClassification,
  GovernanceDoctrineDurabilityFinding,
} from "./governance-doctrine-durability-review-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function doctrineDurabilityClassificationFromScore(score: number): GovernanceDoctrineDurabilityClassification {
  if (score >= 85) return "institutionally_durable";
  if (score >= 70) return "durable";
  if (score >= 45) return "conditionally_durable";
  return "fragile";
}

export function calculateDoctrineDurabilityFindingConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore((params.baseConfidence ?? 58) + Math.min(24, params.evidenceCount * 5) + Math.min(16, params.factorCount * 3));
}

export function calculateDoctrineDurabilityAreaScore(params: {
  baseScore: number;
  evidenceCount: number;
  limitationCount: number;
  findingCount: number;
  explainabilityCount: number;
}): number {
  return clampScore(
    params.baseScore +
      Math.min(12, params.evidenceCount * 2) +
      Math.min(10, params.explainabilityCount * 2) -
      Math.min(22, params.limitationCount * 4) -
      Math.min(24, params.findingCount * 6),
  );
}

export function calculateOverallDoctrineDurabilityScore(params: {
  areaAssessments: GovernanceDoctrineDurabilityAreaAssessment[];
  findings: GovernanceDoctrineDurabilityFinding[];
}): number {
  const areaAverage =
    params.areaAssessments.length === 0
      ? 0
      : params.areaAssessments.reduce((total, assessment) => total + assessment.score, 0) /
        params.areaAssessments.length;
  const durableBonus =
    params.areaAssessments.filter(
      (assessment) => assessment.classification === "durable" || assessment.classification === "institutionally_durable",
    ).length * 2;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;

  return clampScore(areaAverage + durableBonus - elevatedPenalty - criticalPenalty);
}
