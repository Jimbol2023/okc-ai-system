import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
  FullSystemGovernanceAuditResult,
} from "./full-system-governance-audit-types";
import type { GovernanceDoctrineDurabilityResult } from "./governance-doctrine-durability-review-types";
import type { GovernanceEvidenceTraceabilityResult } from "./governance-evidence-traceability-types";
import type { GovernanceObservabilityDurabilityResult } from "./governance-observability-durability-review-types";
import type { GovernanceReadinessResult } from "./governance-readiness-types";
import type { GovernanceSemanticStabilityResult } from "./governance-semantic-stability-review-types";
import type { GovernanceSurvivabilityExpansionResult } from "./governance-survivability-expansion-review-types";
import type { PrincipleEvidenceNormalizationResult } from "./principle-evidence-normalization-types";
import type { ReputationEvidenceQualityResult } from "./reputation/reputation-evidence-quality-types";
import type { ReputationGovernanceAlignmentResult } from "./reputation/reputation-governance-alignment-types";
import type { ReputationGovernanceAssuranceResult } from "./reputation/reputation-governance-assurance-types";
import type { ReputationGovernanceContinuityResult } from "./reputation/reputation-governance-continuity-types";
import type { ReputationGovernanceDoctrineResult } from "./reputation/reputation-governance-doctrine-types";
import type { ReputationGovernanceLineageResult } from "./reputation/reputation-governance-lineage-types";
import type { ReputationGovernanceMemoryResult } from "./reputation/reputation-governance-memory-types";
import type { ReputationGovernanceResilienceResult } from "./reputation/reputation-governance-resilience-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

export type GovernanceReviewabilityIntegrityClassification =
  | "weak"
  | "partially_reviewable"
  | "reviewable"
  | "institutionally_reviewable";

export type GovernanceReviewabilityIntegrityArea =
  | "governance_findings"
  | "audit_findings"
  | "traceability_findings"
  | "explainability_findings"
  | "survivability_findings"
  | "readiness_findings"
  | "assurance_findings"
  | "doctrine_findings"
  | "semantic_stability_findings"
  | "observability_findings"
  | "recommendation_findings"
  | "limitation_findings"
  | "evidence_findings"
  | "human_review_notes";

export type GovernanceReviewabilityIntegrityFindingType =
  | "reviewability_gap"
  | "unclear_finding_structure"
  | "weak_evidence_reconstruction"
  | "weak_reasoning_reconstruction"
  | "weak_limitation_visibility"
  | "weak_human_review_linkage"
  | "audit_defensibility_risk"
  | "explainability_fragmentation"
  | "traceability_fragmentation"
  | "institutional_trust_risk"
  | "future_reviewability_degradation"
  | "governance_opacity_risk";

export interface GovernanceReviewabilityIntegrityInput {
  observabilityDurabilityResult?: GovernanceObservabilityDurabilityResult;
  survivabilityExpansionResult?: GovernanceSurvivabilityExpansionResult;
  doctrineDurabilityResult?: GovernanceDoctrineDurabilityResult;
  semanticStabilityResult?: GovernanceSemanticStabilityResult;
  normalizationResult?: PrincipleEvidenceNormalizationResult;
  traceabilityResult?: GovernanceEvidenceTraceabilityResult;
  auditResult?: FullSystemGovernanceAuditResult;
  auditFindings?: FullSystemGovernanceAuditFinding[];
  recommendations?: FullSystemGovernanceAuditRecommendation[];
  readinessResult?: GovernanceReadinessResult;
  assuranceResult?: ReputationGovernanceAssuranceResult;
  alignmentResult?: ReputationGovernanceAlignmentResult;
  doctrineResult?: ReputationGovernanceDoctrineResult;
  memoryResult?: ReputationGovernanceMemoryResult;
  lineageResult?: ReputationGovernanceLineageResult;
  resilienceResult?: ReputationGovernanceResilienceResult;
  continuityResult?: ReputationGovernanceContinuityResult;
  evidenceQualityResult?: ReputationEvidenceQualityResult;
  evaluatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface GovernanceReviewabilityAreaAssessment {
  area: GovernanceReviewabilityIntegrityArea;
  score: number;
  classification: GovernanceReviewabilityIntegrityClassification;
  description: string;
  reviewableSignals: string[];
  weakSignals: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceReviewabilityIntegrityFinding {
  id: string;
  findingType: GovernanceReviewabilityIntegrityFindingType;
  area: GovernanceReviewabilityIntegrityArea;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedAuditCategories: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
  confidenceScore: number;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceReviewabilityIntegrityResult {
  reviewabilityIntegrityScore: number;
  reviewabilityClassification: GovernanceReviewabilityIntegrityClassification;
  areaAssessments: GovernanceReviewabilityAreaAssessment[];
  findings: GovernanceReviewabilityIntegrityFinding[];
  reviewableAreas: string[];
  weakReviewabilityAreas: string[];
  reconstructionRisks: string[];
  auditDefensibilityFindings: string[];
  evidenceReviewabilityFindings: string[];
  reasoningReviewabilityFindings: string[];
  limitationReviewabilityFindings: string[];
  recommendationReviewabilityFindings: string[];
  humanReviewFindings: string[];
  institutionalTrustFindings: string[];
  humanReviewNotes: string[];
  futureStabilizationRecommendations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    reviewabilityIntegrityRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
