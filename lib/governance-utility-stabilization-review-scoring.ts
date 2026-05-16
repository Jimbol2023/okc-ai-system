import { clampGovernanceScore, scoreThresholdClassification } from "./governance-utils/scoring";
import type {
  GovernanceUtilityStabilizationAreaAssessment,
  GovernanceUtilityStabilizationClassification,
  GovernanceUtilityStabilizationFinding,
} from "./governance-utility-stabilization-review-types";

export function governanceUtilityStabilizationClassificationFromScore(
  score: number,
): GovernanceUtilityStabilizationClassification {
  return scoreThresholdClassification<GovernanceUtilityStabilizationClassification>(
    score,
    [
      { minimumScore: 85, classification: "institutionally_stable" },
      { minimumScore: 70, classification: "stable" },
      { minimumScore: 45, classification: "needs_review" },
    ],
    "unstable",
  );
}

export function calculateGovernanceUtilityStabilizationFindingConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampGovernanceScore(
    (params.baseConfidence ?? 58) +
      Math.min(24, params.evidenceCount * 5) +
      Math.min(16, params.factorCount * 3),
  );
}

export function calculateGovernanceUtilityStabilizationAreaScore(params: {
  baseScore: number;
  stabilitySignalCount: number;
  riskSignalCount: number;
  findingCount: number;
  explainabilityCount: number;
}): number {
  return clampGovernanceScore(
    params.baseScore +
      Math.min(18, params.stabilitySignalCount * 2) +
      Math.min(12, params.explainabilityCount * 2) -
      Math.min(36, params.riskSignalCount * 5) -
      Math.min(24, params.findingCount * 6),
  );
}

export function calculateOverallGovernanceUtilityStabilizationScore(params: {
  areaAssessments: GovernanceUtilityStabilizationAreaAssessment[];
  findings: GovernanceUtilityStabilizationFinding[];
}): number {
  const areaAverage =
    params.areaAssessments.length === 0
      ? 0
      : params.areaAssessments.reduce((total, assessment) => total + assessment.score, 0) /
        params.areaAssessments.length;
  const stableAreaBonus =
    params.areaAssessments.filter(
      (assessment) =>
        assessment.classification === "stable" ||
        assessment.classification === "institutionally_stable",
    ).length * 2;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;

  return clampGovernanceScore(areaAverage + stableAreaBonus - elevatedPenalty - criticalPenalty);
}
