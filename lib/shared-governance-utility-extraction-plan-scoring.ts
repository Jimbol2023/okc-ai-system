import type {
  SharedGovernanceUtilityAreaAssessment,
  SharedGovernanceUtilityCandidate,
  SharedGovernanceUtilityExtractionFinding,
  SharedGovernanceUtilityExtractionReadinessClassification,
} from "./shared-governance-utility-extraction-plan-types";
import { clampGovernanceScore, scoreThresholdClassification } from "./governance-utils/scoring";

export function sharedGovernanceUtilityExtractionClassificationFromScore(
  score: number,
): SharedGovernanceUtilityExtractionReadinessClassification {
  return scoreThresholdClassification<SharedGovernanceUtilityExtractionReadinessClassification>(
    score,
    [
      { minimumScore: 85, classification: "institutionally_reusable" },
      { minimumScore: 70, classification: "extractable" },
      { minimumScore: 45, classification: "partially_extractable" },
    ],
    "not_ready_for_extraction",
  );
}

export function calculateSharedGovernanceUtilityExtractionFindingConfidence(params: {
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

export function calculateSharedGovernanceUtilityAreaScore(params: {
  baseScore: number;
  extractionReadySignalCount: number;
  extractionRiskSignalCount: number;
  findingCount: number;
  explainabilityCount: number;
}): number {
  return clampGovernanceScore(
    params.baseScore +
      Math.min(18, params.extractionReadySignalCount * 2) +
      Math.min(12, params.explainabilityCount * 2) -
      Math.min(34, params.extractionRiskSignalCount * 5) -
      Math.min(24, params.findingCount * 6),
  );
}

export function calculateSharedGovernanceUtilityCandidateScore(params: {
  baseScore: number;
  supportingSignalCount: number;
  riskSignalCount: number;
}): number {
  return clampGovernanceScore(
    params.baseScore +
      Math.min(20, params.supportingSignalCount * 3) -
      Math.min(38, params.riskSignalCount * 6),
  );
}

export function calculateOverallSharedGovernanceUtilityExtractionScore(params: {
  areaAssessments: SharedGovernanceUtilityAreaAssessment[];
  utilityCandidates: SharedGovernanceUtilityCandidate[];
  findings: SharedGovernanceUtilityExtractionFinding[];
}): number {
  const areaAverage =
    params.areaAssessments.length === 0
      ? 0
      : params.areaAssessments.reduce((total, assessment) => total + assessment.score, 0) /
        params.areaAssessments.length;
  const lowRiskCandidateBonus =
    params.utilityCandidates.filter(
      (candidate) =>
        candidate.recommendedPhase === "phase_1_low_risk" &&
        (candidate.extractionReadiness === "extractable" ||
          candidate.extractionReadiness === "institutionally_reusable"),
    ).length * 2;
  const elevatedPenalty = params.findings.filter((finding) => finding.severity === "elevated").length * 5;
  const criticalPenalty = params.findings.filter((finding) => finding.severity === "critical").length * 9;

  return clampGovernanceScore(areaAverage + lowRiskCandidateBonus - elevatedPenalty - criticalPenalty);
}
