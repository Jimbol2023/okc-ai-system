import type {
  ReputationGovernanceAlignmentFinding,
  ReputationGovernanceAlignmentInput,
  ReputationGovernanceAlignmentStatus,
} from "./reputation-governance-alignment-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

const STATUS_WEIGHT: Record<ReputationGovernanceAlignmentStatus, number> = {
  misaligned: 22,
  partially_aligned: 48,
  aligned: 74,
  strongly_aligned: 92,
};

export function alignmentStatusFromScore(score: number): ReputationGovernanceAlignmentStatus {
  if (score >= 85) return "strongly_aligned";
  if (score >= 68) return "aligned";
  if (score >= 42) return "partially_aligned";
  return "misaligned";
}

export function calculateAlignmentFindingConfidence(params: {
  supportingEvidenceCount: number;
  conflictingEvidenceCount: number;
  affectedGovernanceDomainCount: number;
  factorCount: number;
  baseConfidence?: number;
}): number {
  return clampScore(
    (params.baseConfidence ?? 54) +
      Math.min(24, params.supportingEvidenceCount * 4) +
      Math.min(18, params.conflictingEvidenceCount * 4) +
      Math.min(10, params.affectedGovernanceDomainCount * 2) +
      Math.min(10, params.factorCount * 2),
  );
}

export function calculateGovernanceAlignmentScore(params: {
  input: ReputationGovernanceAlignmentInput;
  findings: ReputationGovernanceAlignmentFinding[];
  alignmentStrengths: string[];
  alignmentGaps: string[];
  alignmentDriftFindings: string[];
  doctrinePracticeGaps: string[];
}): number {
  const averageFindingAlignment =
    params.findings.length === 0
      ? 0
      : params.findings.reduce((total, finding) => total + STATUS_WEIGHT[finding.status], 0) /
        params.findings.length;
  const averageFindingConfidence =
    params.findings.length === 0
      ? 0
      : params.findings.reduce((total, finding) => total + finding.confidenceScore, 0) /
        params.findings.length;
  const doctrineScore = params.input.doctrineResult?.doctrineConfidenceScore ?? 42;
  const memoryScore = params.input.memoryResult?.memoryConfidenceScore ?? 42;
  const resilienceScore = params.input.resilienceResult?.governanceResilienceScore ?? 44;
  const continuityScore = params.input.continuityResult?.governanceContinuityScore ?? 44;
  const lineageScore = params.input.lineageResult?.lineageIntegrityScore ?? 42;
  const evidenceScore = params.input.evidenceQualityResult?.evidenceQualityScore ?? 42;
  const contextCompleteness =
    (params.input.doctrineResult ? 7 : 0) +
    (params.input.memoryResult ? 5 : 0) +
    (params.input.resilienceResult ? 5 : 0) +
    (params.input.continuityResult ? 5 : 0) +
    (params.input.lineageResult ? 5 : 0) +
    (params.input.evidenceQualityResult ? 4 : 0) +
    (params.input.resolutionResult ? 3 : 0) +
    (params.input.remediationResult ? 3 : 0) +
    (params.input.governanceResult ? 3 : 0) +
    (params.input.trendResult ? 2 : 0) +
    (params.input.aggregationResult ? 2 : 0);
  const strengthBonus = Math.min(16, params.alignmentStrengths.length * 3);
  const gapPenalty = Math.min(24, params.alignmentGaps.length * 4);
  const driftPenalty = Math.min(28, params.alignmentDriftFindings.length * 6);
  const practiceGapPenalty = Math.min(26, params.doctrinePracticeGaps.length * 6);

  return clampScore(
    averageFindingAlignment * 0.24 +
      averageFindingConfidence * 0.12 +
      doctrineScore * 0.12 +
      memoryScore * 0.08 +
      resilienceScore * 0.1 +
      continuityScore * 0.1 +
      lineageScore * 0.1 +
      evidenceScore * 0.1 +
      contextCompleteness +
      strengthBonus -
      gapPenalty -
      driftPenalty -
      practiceGapPenalty,
  );
}
