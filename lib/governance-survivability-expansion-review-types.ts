import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
  FullSystemGovernanceAuditResult,
} from "./full-system-governance-audit-types";
import type { GovernanceDoctrineDurabilityResult } from "./governance-doctrine-durability-review-types";
import type { GovernanceEvidenceTraceabilityResult } from "./governance-evidence-traceability-types";
import type { GovernancePrincipleRegistryReviewResult } from "./governance-principle-registry-review-types";
import type { GovernanceReadinessResult } from "./governance-readiness-types";
import type { GovernanceSemanticStabilityResult } from "./governance-semantic-stability-review-types";
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

export type GovernanceSurvivabilityExpansionClassification =
  | "fragile"
  | "conditionally_scalable"
  | "scalable"
  | "institutionally_scalable";

export type GovernanceSurvivabilityExpansionArea =
  | "governance_principles"
  | "doctrine_structures"
  | "audit_semantics"
  | "evidence_semantics"
  | "scoring_semantics"
  | "traceability_semantics"
  | "recommendation_semantics"
  | "limitation_semantics"
  | "observability_semantics"
  | "registry_readiness_semantics"
  | "normalization_semantics"
  | "orchestration_review_semantics"
  | "continuity_semantics"
  | "resilience_semantics"
  | "future_ai_agents"
  | "future_business_verticals"
  | "future_governance_layers"
  | "future_enterprise_scaling"
  | "future_multi_tenant_growth"
  | "multi_business_reuse";

export type GovernanceSurvivabilityExpansionFindingType =
  | "survivability_bottleneck"
  | "governance_fragmentation_risk"
  | "orchestration_survivability_risk"
  | "semantic_scaling_risk"
  | "doctrine_scaling_risk"
  | "audit_scaling_risk"
  | "traceability_scaling_risk"
  | "explainability_scaling_risk"
  | "taxonomy_survivability_risk"
  | "future_registry_incompatibility"
  | "observability_survivability_risk"
  | "governance_reviewability_degradation_risk"
  | "institutional_continuity_risk"
  | "cross_industry_survivability_risk";

export interface GovernanceSurvivabilityExpansionInput {
  doctrineDurabilityResult?: GovernanceDoctrineDurabilityResult;
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
  memoryResult?: ReputationGovernanceMemoryResult;
  lineageResult?: ReputationGovernanceLineageResult;
  resilienceResult?: ReputationGovernanceResilienceResult;
  continuityResult?: ReputationGovernanceContinuityResult;
  evidenceQualityResult?: ReputationEvidenceQualityResult;
  evaluatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface GovernanceSurvivabilityExpansionAreaAssessment {
  area: GovernanceSurvivabilityExpansionArea;
  score: number;
  classification: GovernanceSurvivabilityExpansionClassification;
  description: string;
  evidence: string[];
  limitations: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceSurvivabilityExpansionFinding {
  id: string;
  findingType: GovernanceSurvivabilityExpansionFindingType;
  area: GovernanceSurvivabilityExpansionArea;
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

export interface GovernanceSurvivabilityExpansionResult {
  survivabilityScore: number;
  expansionDurabilityScore: number;
  survivabilityClassification: GovernanceSurvivabilityExpansionClassification;
  expansionClassification: GovernanceSurvivabilityExpansionClassification;
  areaAssessments: GovernanceSurvivabilityExpansionAreaAssessment[];
  findings: GovernanceSurvivabilityExpansionFinding[];
  durableArchitectureAreas: string[];
  fragileExpansionAreas: string[];
  governanceScalabilityFindings: string[];
  orchestrationSurvivabilityFindings: string[];
  semanticSurvivabilityFindings: string[];
  traceabilitySurvivabilityFindings: string[];
  observabilitySurvivabilityFindings: string[];
  institutionalContinuityFindings: string[];
  crossIndustrySurvivabilityFindings: string[];
  registryReadinessImplications: string[];
  humanReviewNotes: string[];
  futureStabilizationRecommendations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    survivabilityRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
