import type {
  GovernanceReadinessClassification,
  GovernanceReadinessConfidenceScores,
  GovernanceReadinessFinding,
  GovernanceReadinessInput,
} from "./governance-readiness-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

const CLASSIFICATION_WEIGHT: Record<GovernanceReadinessClassification, number> = {
  not_ready: 20,
  developing: 50,
  operationally_ready: 76,
  institutionally_ready: 94,
};

export function readinessClassificationFromScore(score: number): GovernanceReadinessClassification {
  if (score >= 85) return "institutionally_ready";
  if (score >= 68) return "operationally_ready";
  if (score >= 42) return "developing";
  return "not_ready";
}

export function calculateReadinessFindingConfidence(params: {
  supportingEvidenceCount: number;
  limitingEvidenceCount: number;
  affectedGovernanceDomainCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore(
    (params.baseConfidence ?? 54) +
      Math.min(24, params.supportingEvidenceCount * 4) +
      Math.min(18, params.limitingEvidenceCount * 4) +
      Math.min(10, params.affectedGovernanceDomainCount * 2) +
      Math.min(10, params.factorCount * 2),
  );
}

export function calculateReadinessConfidenceScores(input: GovernanceReadinessInput): GovernanceReadinessConfidenceScores {
  const reviewabilitySupport =
    (input.continuityResult?.reviewabilityAssessment ? 12 : 0) +
    Math.min(28, (input.lineageResult?.governanceDependencyChains.length ?? 0) * 5) +
    Math.min(20, (input.alignmentResult?.findings.filter((finding) => finding.alignmentType === "reviewability_alignment").length ?? 0) * 10) +
    Math.min(20, (input.assuranceResult?.findings.filter((finding) => finding.assuranceType === "reviewability_assurance").length ?? 0) * 10);
  const reviewabilityPenalty =
    Math.min(24, (input.lineageResult?.weakLineageAreas.length ?? 0) * 4) +
    (!input.continuityResult || !input.lineageResult ? 16 : 0);
  const explainabilitySupport =
    [
      input.assuranceResult?.explainability.majorDrivers.length,
      input.alignmentResult?.explainability.majorDrivers.length,
      input.doctrineResult?.explainability.majorDrivers.length,
      input.memoryResult?.explainability.majorDrivers.length,
      input.resilienceResult?.explainability.majorDrivers.length,
      input.continuityResult?.explainability.majorDrivers.length,
      input.lineageResult?.explainability.majorDrivers.length,
      input.evidenceQualityResult?.explainability.majorDrivers.length,
    ].filter((count): count is number => typeof count === "number" && count > 0).length * 10;
  const explainabilityPenalty = !input.assuranceResult || !input.alignmentResult || !input.doctrineResult ? 12 : 0;

  return {
    assuranceReadinessScore: input.assuranceResult?.governanceAssuranceScore ?? 36,
    alignmentReadinessScore: input.alignmentResult?.governanceAlignmentScore ?? 36,
    doctrineReadinessScore: input.doctrineResult?.doctrineConfidenceScore ?? 36,
    memoryReadinessScore: input.memoryResult?.memoryConfidenceScore ?? 34,
    continuityReadinessScore: input.continuityResult?.governanceContinuityScore ?? 34,
    resilienceReadinessScore: input.resilienceResult?.governanceResilienceScore ?? 34,
    evidenceReadinessScore: input.evidenceQualityResult?.evidenceQualityScore ?? 34,
    lineageReadinessScore: input.lineageResult?.lineageIntegrityScore ?? 34,
    reviewabilityReadinessScore: clampScore(42 + reviewabilitySupport - reviewabilityPenalty),
    explainabilityReadinessScore: clampScore(38 + explainabilitySupport - explainabilityPenalty),
  };
}

export function calculateOverallReadinessScore(params: {
  confidenceScores: GovernanceReadinessConfidenceScores;
  findings: GovernanceReadinessFinding[];
  strengths: string[];
  weaknesses: string[];
  driftSignals: string[];
  governancePreparednessIndicators: string[];
}): number {
  const scores = params.confidenceScores;
  const weightedReadiness =
    scores.assuranceReadinessScore * 0.16 +
    scores.alignmentReadinessScore * 0.13 +
    scores.doctrineReadinessScore * 0.1 +
    scores.memoryReadinessScore * 0.08 +
    scores.continuityReadinessScore * 0.1 +
    scores.resilienceReadinessScore * 0.1 +
    scores.evidenceReadinessScore * 0.12 +
    scores.lineageReadinessScore * 0.1 +
    scores.reviewabilityReadinessScore * 0.07 +
    scores.explainabilityReadinessScore * 0.04;
  const averageFindingReadiness =
    params.findings.length === 0
      ? 0
      : params.findings.reduce((total, finding) => total + CLASSIFICATION_WEIGHT[finding.classification], 0) /
        params.findings.length;
  const strengthBonus = Math.min(16, params.strengths.length * 2);
  const preparednessBonus = Math.min(16, params.governancePreparednessIndicators.length * 3);
  const weaknessPenalty = Math.min(28, params.weaknesses.length * 4);
  const driftPenalty = Math.min(30, params.driftSignals.length * 5);

  return clampScore(
    weightedReadiness * 0.72 +
      averageFindingReadiness * 0.18 +
      strengthBonus +
      preparednessBonus -
      weaknessPenalty -
      driftPenalty,
  );
}
