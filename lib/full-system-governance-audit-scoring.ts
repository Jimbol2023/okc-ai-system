import type {
  FullSystemGovernanceAuditCategoryScores,
  FullSystemGovernanceAuditClassification,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditInput,
} from "./full-system-governance-audit-types";

const clampScore = (score: number): number => Math.max(0, Math.min(100, Math.round(score)));

export function auditClassificationFromScore(score: number): FullSystemGovernanceAuditClassification {
  if (score >= 85) return "institutionally_strong";
  if (score >= 68) return "stable";
  if (score >= 42) return "needs_attention";
  return "critical_risk";
}

const scoreFromStatus = (status: string | undefined, strong: string[], stable: string[], developing: string[]): number => {
  if (!status) return 38;
  if (strong.includes(status)) return 90;
  if (stable.includes(status)) return 74;
  if (developing.includes(status)) return 52;
  return 28;
};

const missingContextPenalty = (input: FullSystemGovernanceAuditInput): number =>
  [
    input.readinessResult,
    input.assuranceResult,
    input.alignmentResult,
    input.doctrineResult,
    input.memoryResult,
    input.resilienceResult,
    input.continuityResult,
    input.lineageResult,
    input.evidenceQualityResult,
  ].filter(Boolean).length >= 7
    ? 0
    : 12;

export function calculateAuditCategoryScores(input: FullSystemGovernanceAuditInput): FullSystemGovernanceAuditCategoryScores {
  const inventory = input.inventory;
  const executionSurfaceCount =
    (inventory?.automationModules?.length ?? 0) +
    (inventory?.messagingModules?.length ?? 0) +
    (inventory?.orchestrationModules?.length ?? 0);
  const contextPenalty = missingContextPenalty(input);
  const warningPenalty = Math.min(16, (inventory?.knownWarnings?.length ?? 0) * 4);
  const limitationPenalty = Math.min(16, (inventory?.knownLimitations?.length ?? 0) * 3);
  const readinessScore = input.readinessResult?.overallReadinessScore ?? 42;
  const assuranceScore = input.assuranceResult?.governanceAssuranceScore ?? 42;
  const alignmentScore = input.alignmentResult?.governanceAlignmentScore ?? 42;
  const doctrineScore = input.doctrineResult?.doctrineConfidenceScore ?? 42;
  const memoryScore = input.memoryResult?.memoryConfidenceScore ?? 42;
  const resilienceScore = input.resilienceResult?.governanceResilienceScore ?? 42;
  const continuityScore = input.continuityResult?.governanceContinuityScore ?? 42;
  const lineageScore = input.lineageResult?.lineageIntegrityScore ?? 42;
  const evidenceScore = input.evidenceQualityResult?.evidenceQualityScore ?? 42;

  return {
    architecture_integrity: clampScore(72 + Math.min(10, (inventory?.governanceModules?.length ?? 0)) - contextPenalty - warningPenalty),
    dependency_integrity: clampScore(68 + Math.min(12, (inventory?.adapterModules?.length ?? 0) * 2) - contextPenalty - limitationPenalty),
    orchestration_purity: clampScore(88 - Math.min(34, executionSurfaceCount * 7) - warningPenalty),
    governance_safety: clampScore((assuranceScore + alignmentScore + readinessScore) / 3 - Math.min(18, executionSurfaceCount * 4)),
    explainability_integrity: clampScore((readinessScore + assuranceScore + alignmentScore + doctrineScore) / 4 - contextPenalty),
    deterministic_scoring_integrity: clampScore(82 - warningPenalty - Math.min(10, (inventory?.knownLimitations?.length ?? 0) * 2)),
    traceability_integrity: clampScore((lineageScore + evidenceScore + assuranceScore) / 3 - contextPenalty),
    resilience_consistency: clampScore((resilienceScore + continuityScore + readinessScore) / 3 - limitationPenalty),
    doctrine_consistency: clampScore((doctrineScore + alignmentScore + assuranceScore) / 3 - Math.min(18, input.doctrineResult?.driftFindings.length ?? 0)),
    utility_duplication: clampScore(52 - Math.min(16, (inventory?.governanceModules?.length ?? 0) * 2)),
    type_duplication: clampScore(66 - contextPenalty - Math.min(10, (inventory?.knownLimitations?.length ?? 0) * 2)),
    scalability_risks: clampScore(72 + Math.min(10, (inventory?.adapterModules?.length ?? 0) * 2) - contextPenalty),
    enterprise_durability: clampScore((memoryScore + doctrineScore + assuranceScore + readinessScore) / 4 - limitationPenalty),
    long_horizon_maintainability: clampScore((memoryScore + resilienceScore + continuityScore + lineageScore) / 4 - warningPenalty),
    hidden_execution_pathways: clampScore(86 - Math.min(40, executionSurfaceCount * 8) - warningPenalty),
    future_technical_debt: clampScore(58 - Math.min(18, (inventory?.knownWarnings?.length ?? 0) * 3) - Math.min(18, (inventory?.knownLimitations?.length ?? 0) * 3)),
    reusable_infrastructure_opportunities: clampScore(58 + Math.min(18, (inventory?.governanceModules?.length ?? 0) * 2)),
    adapter_consistency: clampScore(70 + Math.min(12, (inventory?.adapterModules?.length ?? 0) * 3) - contextPenalty),
    anti_fragility_opportunities: clampScore(
      scoreFromStatus(input.resilienceResult?.resilienceStatus, ["anti_fragile"], ["resilient"], ["pressured"]) * 0.5 +
        scoreFromStatus(input.continuityResult?.continuityStatus, ["anti_fragile"], ["resilient"], ["stable"]) * 0.5,
    ),
    institutional_continuity_risks: clampScore((continuityScore + memoryScore + readinessScore) / 3 - contextPenalty),
  };
}

export function calculateOverallAuditScore(categoryScores: FullSystemGovernanceAuditCategoryScores): number {
  const scores = Object.values(categoryScores);
  return clampScore(scores.reduce((total, score) => total + score, 0) / scores.length);
}

export function findingClassification(score: number): FullSystemGovernanceAuditClassification {
  return auditClassificationFromScore(score);
}

export function findingRequiresHumanReview(finding: FullSystemGovernanceAuditFinding): boolean {
  return finding.classification === "critical_risk" || finding.classification === "needs_attention";
}
