import type {
  ReputationGovernanceMemoryInput,
  ReputationGovernanceMemoryPattern,
  ReputationGovernanceMemorySnapshot,
  ReputationInstitutionalMemoryStatus,
} from "./reputation-governance-memory-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function institutionalMemoryStatusFromScore(score: number): ReputationInstitutionalMemoryStatus {
  if (score >= 85) return "durable";
  if (score >= 68) return "reliable";
  if (score >= 42) return "developing";
  return "thin";
}

export function calculateMemoryPatternConfidence(params: {
  occurrenceCount: number;
  evidenceCount: number;
  affectedGovernanceDomainCount: number;
  affectedBusinessUnitCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore(
    (params.baseConfidence ?? 52) +
      Math.min(20, params.occurrenceCount * 6) +
      Math.min(18, params.evidenceCount * 3) +
      Math.min(10, params.affectedGovernanceDomainCount * 2) +
      Math.min(8, params.affectedBusinessUnitCount * 2) +
      Math.min(10, params.factorCount * 2),
  );
}

export function calculateGovernanceMemoryConfidenceScore(params: {
  input: ReputationGovernanceMemoryInput;
  snapshots: ReputationGovernanceMemorySnapshot[];
  recurringPatterns: ReputationGovernanceMemoryPattern[];
  continuityLearningIndicators: string[];
  resilienceLearningIndicators: string[];
}): number {
  const historicalDepth = Math.min(24, params.snapshots.length * 8);
  const previousDepth = Math.min(18, (params.input.previousResilienceResults?.length ?? 0) * 6);
  const averageSnapshotScore =
    params.snapshots.length === 0
      ? 0
      : params.snapshots.reduce((total, snapshot) => {
          const scores = [
            snapshot.lineageIntegrityScore,
            snapshot.governanceContinuityScore,
            snapshot.governanceResilienceScore,
          ].filter((score): score is number => typeof score === "number");
          const average = scores.length === 0 ? 0 : scores.reduce((scoreTotal, score) => scoreTotal + score, 0) / scores.length;
          return total + average;
        }, 0) / params.snapshots.length;
  const averagePatternConfidence =
    params.recurringPatterns.length === 0
      ? 0
      : params.recurringPatterns.reduce((total, pattern) => total + pattern.confidenceScore, 0) /
        params.recurringPatterns.length;
  const evidenceQualityScore = params.input.evidenceQualityResult?.evidenceQualityScore ?? 46;
  const patternBonus = Math.min(18, params.recurringPatterns.length * 4);
  const learningBonus = Math.min(
    16,
    (params.continuityLearningIndicators.length + params.resilienceLearningIndicators.length) * 3,
  );
  const evidenceLimitationPenalty = Math.min(
    18,
    params.snapshots.reduce((total, snapshot) => total + snapshot.evidenceLimitations.length, 0) * 2,
  );
  const contextCompleteness =
    (params.input.currentResilienceResult ? 6 : 0) +
    (params.input.continuityResult ? 5 : 0) +
    (params.input.lineageResult ? 5 : 0) +
    (params.input.evidenceQualityResult ? 4 : 0) +
    (params.input.resolutionResult ? 3 : 0) +
    (params.input.remediationResult ? 3 : 0) +
    (params.input.governanceResult ? 3 : 0) +
    (params.input.trendResult ? 2 : 0) +
    (params.input.aggregationResult ? 2 : 0);

  return clampScore(
    12 +
      historicalDepth +
      previousDepth +
      averageSnapshotScore * 0.16 +
      averagePatternConfidence * 0.14 +
      evidenceQualityScore * 0.12 +
      patternBonus +
      learningBonus +
      contextCompleteness -
      evidenceLimitationPenalty,
  );
}
