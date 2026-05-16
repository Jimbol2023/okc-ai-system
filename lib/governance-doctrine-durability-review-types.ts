import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
  FullSystemGovernanceAuditResult,
} from "./full-system-governance-audit-types";
import type { GovernanceEvidenceTraceabilityResult } from "./governance-evidence-traceability-types";
import type { GovernancePrincipleRegistryReviewResult } from "./governance-principle-registry-review-types";
import type { GovernanceReadinessResult } from "./governance-readiness-types";
import type { GovernanceSemanticStabilityResult } from "./governance-semantic-stability-review-types";
import type { PrincipleEvidenceNormalizationResult } from "./principle-evidence-normalization-types";
import type { ReputationEvidenceQualityResult } from "./reputation/reputation-evidence-quality-types";
import type { ReputationGovernanceAlignmentResult } from "./reputation/reputation-governance-alignment-types";
import type { ReputationGovernanceAssuranceResult } from "./reputation/reputation-governance-assurance-types";
import type { ReputationGovernanceContinuityResult } from "./reputation/reputation-governance-continuity-types";
import type {
  ReputationGovernanceDoctrinePrinciple,
  ReputationGovernanceDoctrineResult,
} from "./reputation/reputation-governance-doctrine-types";
import type { ReputationGovernanceLineageResult } from "./reputation/reputation-governance-lineage-types";
import type { ReputationGovernanceMemoryResult } from "./reputation/reputation-governance-memory-types";
import type { ReputationGovernanceResilienceResult } from "./reputation/reputation-governance-resilience-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

export type GovernanceDoctrineDurabilityClassification =
  | "fragile"
  | "conditionally_durable"
  | "durable"
  | "institutionally_durable";

export type GovernanceDoctrineDurabilityArea =
  | "governance_principles"
  | "doctrine_classifications"
  | "audit_semantics"
  | "scoring_semantics"
  | "evidence_semantics"
  | "traceability_semantics"
  | "recommendation_semantics"
  | "limitation_semantics"
  | "readiness_semantics"
  | "assurance_semantics"
  | "continuity_semantics"
  | "resilience_semantics"
  | "normalization_semantics"
  | "registry_readiness_semantics"
  | "future_module_expansion"
  | "future_orchestration_growth"
  | "multi_industry_scalability"
  | "explainability_expansion";

export type GovernanceDoctrineDurabilityFindingType =
  | "brittle_doctrine_assumption"
  | "governance_rigidity_risk"
  | "semantic_durability_weakness"
  | "taxonomy_expansion_risk"
  | "future_scaling_incompatibility"
  | "governance_fragmentation_risk"
  | "classification_instability_risk"
  | "doctrine_coupling_risk"
  | "traceability_durability_risk"
  | "semantic_versioning_risk"
  | "explainability_durability_risk"
  | "institutional_survivability_risk";

export interface GovernanceDoctrineDurabilityInput {
  semanticStabilityResult?: GovernanceSemanticStabilityResult;
  registryReviewResult?: GovernancePrincipleRegistryReviewResult;
  normalizationResult?: PrincipleEvidenceNormalizationResult;
  traceabilityResult?: GovernanceEvidenceTraceabilityResult;
  auditResult?: FullSystemGovernanceAuditResult;
  auditFindings?: FullSystemGovernanceAuditFinding[];
  recommendations?: FullSystemGovernanceAuditRecommendation[];
  readinessResult?: GovernanceReadinessResult;
  assuranceResult?: ReputationGovernanceAssuranceResult;
  alignmentResult?: ReputationGovernanceAlignmentResult;
  doctrineResult?: ReputationGovernanceDoctrineResult;
  doctrinePrinciples?: ReputationGovernanceDoctrinePrinciple[];
  memoryResult?: ReputationGovernanceMemoryResult;
  lineageResult?: ReputationGovernanceLineageResult;
  resilienceResult?: ReputationGovernanceResilienceResult;
  continuityResult?: ReputationGovernanceContinuityResult;
  evidenceQualityResult?: ReputationEvidenceQualityResult;
  evaluatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface GovernanceDoctrineDurabilityAreaAssessment {
  area: GovernanceDoctrineDurabilityArea;
  score: number;
  classification: GovernanceDoctrineDurabilityClassification;
  description: string;
  evidence: string[];
  limitations: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceDoctrineDurabilityFinding {
  id: string;
  findingType: GovernanceDoctrineDurabilityFindingType;
  area: GovernanceDoctrineDurabilityArea;
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

export interface GovernanceDoctrineDurabilityResult {
  doctrineDurabilityScore: number;
  doctrineDurabilityClassification: GovernanceDoctrineDurabilityClassification;
  areaAssessments: GovernanceDoctrineDurabilityAreaAssessment[];
  findings: GovernanceDoctrineDurabilityFinding[];
  durableDoctrineAreas: string[];
  fragileDoctrineAreas: string[];
  futureScalingRisks: string[];
  futureGovernanceExpansionRisks: string[];
  semanticDurabilityFindings: string[];
  traceabilityDurabilityFindings: string[];
  auditDurabilityFindings: string[];
  explainabilityDurabilityFindings: string[];
  institutionalSurvivabilityFindings: string[];
  governanceContinuityImplications: string[];
  humanReviewNotes: string[];
  futureStabilizationRecommendations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    doctrineDurabilityRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
