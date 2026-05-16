import type {
  ReputationGovernanceDoctrineDriftFinding,
  ReputationGovernanceDoctrineInput,
  ReputationGovernanceDoctrinePrinciple,
  ReputationGovernanceDoctrineStatus,
} from "./reputation-governance-doctrine-types";
import type { ReputationSeverity } from "./reputation-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

const SEVERITY_WEIGHT: Record<ReputationSeverity, number> = {
  low: 4,
  moderate: 9,
  elevated: 16,
  critical: 24,
};

export function doctrineStatusFromScore(score: number): ReputationGovernanceDoctrineStatus {
  if (score >= 85) return "durable";
  if (score >= 68) return "reliable";
  if (score >= 42) return "forming";
  return "thin";
}

export function calculateDoctrinePrincipleConfidence(params: {
  supportingEvidenceCount: number;
  recurringPatternCount: number;
  affectedGovernanceDomainCount: number;
  limitationCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore(
    (params.baseConfidence ?? 50) +
      Math.min(22, params.supportingEvidenceCount * 4) +
      Math.min(20, params.recurringPatternCount * 5) +
      Math.min(10, params.affectedGovernanceDomainCount * 2) +
      Math.min(10, params.factorCount * 2) -
      Math.min(22, params.limitationCount * 5),
  );
}

export function calculateDoctrineDriftConfidence(params: {
  evidenceCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore((params.baseConfidence ?? 58) + Math.min(22, params.evidenceCount * 5) + Math.min(14, params.factorCount * 3));
}

export function calculateDoctrineConfidenceScore(params: {
  input: ReputationGovernanceDoctrineInput;
  principles: ReputationGovernanceDoctrinePrinciple[];
  driftFindings: ReputationGovernanceDoctrineDriftFinding[];
  durablePatterns: string[];
  governancePhilosophyIndicators: string[];
}): number {
  const averagePrincipleConfidence =
    params.principles.length === 0
      ? 0
      : params.principles.reduce((total, principle) => total + principle.confidenceScore, 0) /
        params.principles.length;
  const memoryScore = params.input.memoryResult?.memoryConfidenceScore ?? 42;
  const resilienceScore = params.input.resilienceResult?.governanceResilienceScore ?? 44;
  const continuityScore = params.input.continuityResult?.governanceContinuityScore ?? 44;
  const lineageScore = params.input.lineageResult?.lineageIntegrityScore ?? 42;
  const evidenceScore = params.input.evidenceQualityResult?.evidenceQualityScore ?? 42;
  const contextCompleteness =
    (params.input.memoryResult ? 7 : 0) +
    (params.input.resilienceResult ? 6 : 0) +
    (params.input.continuityResult ? 5 : 0) +
    (params.input.lineageResult ? 5 : 0) +
    (params.input.evidenceQualityResult ? 4 : 0) +
    (params.input.resolutionResult ? 3 : 0) +
    (params.input.remediationResult ? 3 : 0) +
    (params.input.governanceResult ? 3 : 0) +
    (params.input.trendResult ? 2 : 0) +
    (params.input.aggregationResult ? 2 : 0);
  const durablePatternBonus = Math.min(16, params.durablePatterns.length * 4);
  const philosophyBonus = Math.min(14, params.governancePhilosophyIndicators.length * 3);
  const principleCoverageBonus = Math.min(14, params.principles.length * 2);
  const driftPenalty = params.driftFindings.reduce(
    (total, finding) => total + SEVERITY_WEIGHT[finding.severity],
    0,
  );
  const limitationPenalty = Math.min(
    22,
    params.principles.reduce((total, principle) => total + principle.limitations.length, 0) * 2,
  );

  return clampScore(
    averagePrincipleConfidence * 0.22 +
      memoryScore * 0.16 +
      resilienceScore * 0.14 +
      continuityScore * 0.12 +
      lineageScore * 0.12 +
      evidenceScore * 0.12 +
      contextCompleteness +
      durablePatternBonus +
      philosophyBonus +
      principleCoverageBonus -
      driftPenalty -
      limitationPenalty,
  );
}
