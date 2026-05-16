import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
  FullSystemGovernanceAuditResult,
} from "./full-system-governance-audit-types";
import type { GovernanceDoctrineDurabilityResult } from "./governance-doctrine-durability-review-types";
import type { GovernanceEvidenceTraceabilityResult } from "./governance-evidence-traceability-types";
import type { GovernanceObservabilityDurabilityResult } from "./governance-observability-durability-review-types";
import type { GovernancePrincipleRegistryReviewResult } from "./governance-principle-registry-review-types";
import type { GovernanceReadinessResult } from "./governance-readiness-types";
import type { GovernanceReviewabilityIntegrityResult } from "./governance-reviewability-integrity-review-types";
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

export type GovernanceVersioningReadinessClassification =
  | "version_fragile"
  | "partially_version_ready"
  | "version_ready"
  | "institutionally_versionable";

export type GovernanceVersioningReadinessArea =
  | "governance_semantics"
  | "doctrine_structures"
  | "audit_classifications"
  | "traceability_contracts"
  | "observability_contracts"
  | "normalization_contracts"
  | "registry_readiness"
  | "taxonomy_semantics"
  | "survivability_semantics"
  | "reviewability_semantics"
  | "evidence_semantics"
  | "recommendation_semantics"
  | "limitation_semantics"
  | "scoring_semantics"
  | "governance_metadata"
  | "governance_lifecycle_tracking"
  | "backward_compatibility_review"
  | "governance_migration_review";

export type GovernanceVersioningReadinessFindingType =
  | "unstable_semantics"
  | "unstable_classifications"
  | "incompatible_governance_structure"
  | "taxonomy_instability"
  | "version_fragile_semantics"
  | "traceability_contract_instability"
  | "audit_contract_instability"
  | "normalization_instability"
  | "observability_instability"
  | "doctrine_evolution_risk"
  | "backward_compatibility_risk"
  | "governance_migration_risk"
  | "semantic_version_drift_risk"
  | "future_registry_incompatibility_risk";

export interface GovernanceVersioningReadinessInput {
  reviewabilityIntegrityResult?: GovernanceReviewabilityIntegrityResult;
  observabilityDurabilityResult?: GovernanceObservabilityDurabilityResult;
  survivabilityExpansionResult?: GovernanceSurvivabilityExpansionResult;
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

export interface GovernanceVersioningReadinessAreaAssessment {
  area: GovernanceVersioningReadinessArea;
  score: number;
  classification: GovernanceVersioningReadinessClassification;
  description: string;
  versionReadySignals: string[];
  versionFragileSignals: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceVersioningReadinessFinding {
  id: string;
  findingType: GovernanceVersioningReadinessFindingType;
  area: GovernanceVersioningReadinessArea;
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

export interface GovernanceVersioningReadinessResult {
  versioningReadinessScore: number;
  versioningReadinessClassification: GovernanceVersioningReadinessClassification;
  areaAssessments: GovernanceVersioningReadinessAreaAssessment[];
  findings: GovernanceVersioningReadinessFinding[];
  stableVersionReadyAreas: string[];
  unstableVersionFragileAreas: string[];
  semanticVersioningFindings: string[];
  taxonomyVersioningFindings: string[];
  doctrineVersioningFindings: string[];
  auditContractFindings: string[];
  traceabilityContractFindings: string[];
  observabilityContractFindings: string[];
  compatibilityFindings: string[];
  migrationRiskFindings: string[];
  institutionalEvolutionFindings: string[];
  registryReadinessImplications: string[];
  humanReviewNotes: string[];
  futureStabilizationRecommendations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    versioningReadinessRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
