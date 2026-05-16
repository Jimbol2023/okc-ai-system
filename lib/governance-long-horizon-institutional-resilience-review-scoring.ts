import type {
  GovernanceLongHorizonInstitutionalResilienceAreaAssessment,
  GovernanceLongHorizonInstitutionalResilienceClassification,
  GovernanceLongHorizonInstitutionalResilienceFinding,
} from "./governance-long-horizon-institutional-resilience-review-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function longHorizonInstitutionalResilienceClassificationFromScore(
  score: number,
): GovernanceLongHorizonInstitutionalResilienceClassification {
  if (score >= 85) return "institutionally_resilient";
  if (score >= 70) return "resilient";
  if (score >= 45) return "conditionally_resilient";
  return "brittle";
}

export function calculateLongHorizonInstitutionalResilienceFindingConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore(
    (params.baseConfidence ?? 58) +
      Math.min(24, params.evidenceCount * 5) +
      Math.min(16, params.factorCount * 3),
  );
}

export function calculateLongHorizonInstitutionalResilienceAreaScore(params: {
  baseScore: number;
  resilienceSignalCount: number;
  fragilitySignalCount: number;
  findingCount: number;
  explainabilityCount: number;
}): number {
  return clampScore(
    params.baseScore +
      Math.min(18, params.resilienceSignalCount * 2) +
      Math.min(12, params.explainabilityCount * 2) -
      Math.min(34, params.fragilitySignalCount * 5) -
      Math.min(24, params.findingCount * 6),
  );
}

export function calculateOverallLongHorizonInstitutionalResilienceScore(params: {
  areaAssessments: GovernanceLongHorizonInstitutionalResilienceAreaAssessment[];
  findings: GovernanceLongHorizonInstitutionalResilienceFinding[];
}): number {
  const areaAverage =
    params.areaAssessments.length === 0
      ? 0
      : params.areaAssessments.reduce((total, assessment) => total + assessment.score, 0) /
        params.areaAssessments.length;
  const resilientAreaBonus =
    params.areaAssessments.filter(
      (assessment) =>
        assessment.classification === "resilient" ||
        assessment.classification === "institutionally_resilient",
    ).length * 2;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;

  return clampScore(areaAverage + resilientAreaBonus - elevatedPenalty - criticalPenalty);
}
