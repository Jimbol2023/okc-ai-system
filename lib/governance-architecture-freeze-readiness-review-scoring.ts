import type {
  GovernanceArchitectureFreezeReadinessAreaAssessment,
  GovernanceArchitectureFreezeReadinessClassification,
  GovernanceArchitectureFreezeReadinessFinding,
} from "./governance-architecture-freeze-readiness-review-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function architectureFreezeReadinessClassificationFromScore(
  score: number,
): GovernanceArchitectureFreezeReadinessClassification {
  if (score >= 85) return "institutionally_freeze_ready";
  if (score >= 70) return "freeze_ready";
  if (score >= 45) return "partially_freeze_ready";
  return "not_ready_to_freeze";
}

export function calculateArchitectureFreezeReadinessFindingConfidence(params: {
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

export function calculateArchitectureFreezeReadinessAreaScore(params: {
  baseScore: number;
  freezeReadySignalCount: number;
  freezeRiskSignalCount: number;
  findingCount: number;
  explainabilityCount: number;
}): number {
  return clampScore(
    params.baseScore +
      Math.min(18, params.freezeReadySignalCount * 2) +
      Math.min(12, params.explainabilityCount * 2) -
      Math.min(34, params.freezeRiskSignalCount * 5) -
      Math.min(24, params.findingCount * 6),
  );
}

export function calculateOverallArchitectureFreezeReadinessScore(params: {
  areaAssessments: GovernanceArchitectureFreezeReadinessAreaAssessment[];
  findings: GovernanceArchitectureFreezeReadinessFinding[];
}): number {
  const areaAverage =
    params.areaAssessments.length === 0
      ? 0
      : params.areaAssessments.reduce((total, assessment) => total + assessment.score, 0) /
        params.areaAssessments.length;
  const freezeReadyAreaBonus =
    params.areaAssessments.filter(
      (assessment) =>
        assessment.classification === "freeze_ready" ||
        assessment.classification === "institutionally_freeze_ready",
    ).length * 2;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;

  return clampScore(areaAverage + freezeReadyAreaBonus - elevatedPenalty - criticalPenalty);
}
