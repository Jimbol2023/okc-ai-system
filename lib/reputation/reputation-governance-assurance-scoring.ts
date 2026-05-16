import type {
  ReputationGovernanceAssuranceFinding,
  ReputationGovernanceAssuranceInput,
  ReputationGovernanceAssuranceStatus,
} from "./reputation-governance-assurance-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

const STATUS_WEIGHT: Record<ReputationGovernanceAssuranceStatus, number> = {
  weak: 22,
  developing: 50,
  reliable: 76,
  institutionally_durable: 94,
};

export function assuranceStatusFromScore(score: number): ReputationGovernanceAssuranceStatus {
  if (score >= 85) return "institutionally_durable";
  if (score >= 68) return "reliable";
  if (score >= 42) return "developing";
  return "weak";
}

export function calculateAssuranceFindingConfidence(params: {
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

export function calculateGovernanceAssuranceScore(params: {
  input: ReputationGovernanceAssuranceInput;
  findings: ReputationGovernanceAssuranceFinding[];
  assuranceStrengths: string[];
  assuranceWeaknesses: string[];
  assuranceDriftFindings: string[];
  governanceReliabilityIndicators: string[];
}): number {
  const averageFindingStatus =
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
  const alignmentScore = params.input.alignmentResult?.governanceAlignmentScore ?? 42;
  const memoryScore = params.input.memoryResult?.memoryConfidenceScore ?? 42;
  const resilienceScore = params.input.resilienceResult?.governanceResilienceScore ?? 44;
  const continuityScore = params.input.continuityResult?.governanceContinuityScore ?? 44;
  const lineageScore = params.input.lineageResult?.lineageIntegrityScore ?? 42;
  const evidenceScore = params.input.evidenceQualityResult?.evidenceQualityScore ?? 42;
  const contextCompleteness =
    (params.input.doctrineResult ? 6 : 0) +
    (params.input.alignmentResult ? 7 : 0) +
    (params.input.memoryResult ? 5 : 0) +
    (params.input.resilienceResult ? 5 : 0) +
    (params.input.continuityResult ? 5 : 0) +
    (params.input.lineageResult ? 5 : 0) +
    (params.input.evidenceQualityResult ? 5 : 0) +
    (params.input.resolutionResult ? 3 : 0) +
    (params.input.remediationResult ? 3 : 0) +
    (params.input.governanceResult ? 3 : 0) +
    (params.input.trendResult ? 2 : 0) +
    (params.input.aggregationResult ? 2 : 0);
  const strengthBonus = Math.min(16, params.assuranceStrengths.length * 3);
  const reliabilityBonus = Math.min(16, params.governanceReliabilityIndicators.length * 3);
  const weaknessPenalty = Math.min(30, params.assuranceWeaknesses.length * 5);
  const driftPenalty = Math.min(30, params.assuranceDriftFindings.length * 5);

  return clampScore(
    averageFindingStatus * 0.22 +
      averageFindingConfidence * 0.1 +
      doctrineScore * 0.1 +
      alignmentScore * 0.14 +
      memoryScore * 0.08 +
      resilienceScore * 0.1 +
      continuityScore * 0.1 +
      lineageScore * 0.1 +
      evidenceScore * 0.1 +
      contextCompleteness +
      strengthBonus +
      reliabilityBonus -
      weaknessPenalty -
      driftPenalty,
  );
}
