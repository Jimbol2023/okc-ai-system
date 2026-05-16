import type {
  ReputationEvidenceQualityFinding,
  ReputationEvidenceQualityFindingType,
  ReputationEvidenceQualityInput,
  ReputationEvidenceReliabilityLevel,
} from "./reputation-evidence-quality-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

const FINDING_SCORE_IMPACT: Record<ReputationEvidenceQualityFindingType, number> = {
  evidence_supports_stabilization: 10,
  evidence_incomplete: -10,
  evidence_outdated: -12,
  evidence_missing: -18,
  evidence_inconsistent: -20,
  remediation_without_supporting_evidence: -22,
  recurring_issue_without_resolution_evidence: -24,
  evidence_contradicts_stabilization: -30,
};

export function reliabilityLevelFromScore(score: number): ReputationEvidenceReliabilityLevel {
  if (score >= 85) return "highly_reliable";
  if (score >= 70) return "strong";
  if (score >= 50) return "moderate";
  if (score >= 30) return "partial";
  return "weak";
}

export function calculateEvidenceFindingConfidence(params: {
  supportingEvidenceCount: number;
  missingEvidenceCount: number;
  contradictionCount: number;
  factorCount: number;
  affectedBusinessUnitCount: number;
  affectedGovernanceDomainCount: number;
  baseConfidence?: number;
}): number {
  return clampScore(
    (params.baseConfidence ?? 58) +
      Math.min(18, params.supportingEvidenceCount * 4) +
      Math.min(16, (params.missingEvidenceCount + params.contradictionCount) * 4) +
      Math.min(10, params.factorCount * 2) +
      Math.min(8, params.affectedBusinessUnitCount * 2) +
      Math.min(8, params.affectedGovernanceDomainCount * 2),
  );
}

export function calculateEvidenceQualityScore(params: {
  input: ReputationEvidenceQualityInput;
  findings: ReputationEvidenceQualityFinding[];
}): number {
  const contextCompleteness =
    (params.input.resolutionResult ? 7 : 0) +
    (params.input.remediationResult ? 6 : 0) +
    (params.input.governanceResult ? 4 : 0) +
    (params.input.earlyWarningResult ? 4 : 0) +
    (params.input.trendResult ? 4 : 0) +
    (params.input.aggregationResult ? 4 : 0) +
    ((params.input.signals?.length ?? 0) > 0 ? 4 : 0);
  const findingImpact = params.findings.reduce(
    (total, finding) => total + FINDING_SCORE_IMPACT[finding.findingType],
    0,
  );
  const averageConfidence =
    params.findings.length === 0
      ? 0
      : params.findings.reduce((total, finding) => total + finding.confidenceScore, 0) / params.findings.length;
  const stabilizationSupportBonus =
    params.findings.filter((finding) => finding.findingType === "evidence_supports_stabilization").length * 6;
  const contradictionPenalty =
    params.findings.filter((finding) => finding.contradictions.length > 0).length * 5;
  const missingEvidencePenalty =
    params.findings.filter((finding) => finding.missingEvidence.length > 0).length * 4;

  return clampScore(
    58 +
      contextCompleteness +
      findingImpact +
      averageConfidence * 0.05 +
      stabilizationSupportBonus -
      contradictionPenalty -
      missingEvidencePenalty,
  );
}
