import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
  FullSystemGovernanceAuditResult,
} from "./full-system-governance-audit-types";
import type { GovernanceAuditHistorySurvivabilityResult } from "./governance-audit-history-survivability-review-types";
import type {
  GovernanceCompatibilityMigrationContinuityContext,
  GovernanceLifecycleContinuityResult,
} from "./governance-lifecycle-continuity-review-types";
import type { GovernanceDoctrineDurabilityResult } from "./governance-doctrine-durability-review-types";
import type { GovernanceEvidenceTraceabilityResult } from "./governance-evidence-traceability-types";
import type { GovernanceExplainabilityContinuityResult } from "./governance-explainability-continuity-review-types";
import type { GovernanceInstitutionalMemoryContinuityResult } from "./governance-institutional-memory-continuity-review-types";
import type { GovernanceObservabilityDurabilityResult } from "./governance-observability-durability-review-types";
import type { GovernancePrincipleRegistryReviewResult } from "./governance-principle-registry-review-types";
import type { GovernanceReadinessResult } from "./governance-readiness-types";
import type { GovernanceReviewabilityIntegrityResult } from "./governance-reviewability-integrity-review-types";
import type { GovernanceSemanticStabilityResult } from "./governance-semantic-stability-review-types";
import type { GovernanceSurvivabilityExpansionResult } from "./governance-survivability-expansion-review-types";
import type { GovernanceTraceabilitySurvivabilityResult } from "./governance-traceability-survivability-review-types";
import type { GovernanceVersioningReadinessResult } from "./governance-versioning-readiness-review-types";
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

export type GovernanceSemanticVersionSurvivabilityClassification =
  | "version_fragile"
  | "partially_survivable"
  | "semantically_survivable"
  | "institutionally_version_survivable";

export type GovernanceSemanticVersionSurvivabilityArea =
  | "governance_terminology"
  | "governance_classifications"
  | "audit_categories"
  | "evidence_categories"
  | "scoring_drivers"
  | "doctrine_principles"
  | "normalization_mappings"
  | "traceability_semantics"
  | "explainability_semantics"
  | "recommendation_semantics"
  | "limitation_semantics"
  | "observability_semantics"
  | "reviewability_semantics"
  | "registry_readiness_semantics"
  | "lifecycle_continuity_semantics";

export type GovernanceSemanticVersionSurvivabilityFindingType =
  | "semantic_version_fragility"
  | "backward_compatibility_risk"
  | "taxonomy_version_instability"
  | "classification_version_mismatch"
  | "normalization_version_drift"
  | "traceability_semantic_incompatibility"
  | "explainability_semantic_incompatibility"
  | "audit_semantic_incompatibility"
  | "doctrine_semantic_incompatibility"
  | "recommendation_semantic_drift"
  | "limitation_semantic_drift"
  | "scoring_semantic_drift"
  | "future_registry_version_risk"
  | "semantic_migration_survivability_risk"
  | "long_horizon_semantic_reconstruction_risk";

export interface GovernanceSemanticVersionSurvivabilityInput {
  traceabilitySurvivabilityResult?: GovernanceTraceabilitySurvivabilityResult;
  explainabilityContinuityResult?: GovernanceExplainabilityContinuityResult;
  auditHistorySurvivabilityResult?: GovernanceAuditHistorySurvivabilityResult;
  institutionalMemoryContinuityResult?: GovernanceInstitutionalMemoryContinuityResult;
  lifecycleContinuityResult?: GovernanceLifecycleContinuityResult;
  versioningReadinessResult?: GovernanceVersioningReadinessResult;
  compatibilityMigrationContext?: GovernanceCompatibilityMigrationContinuityContext;
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

export interface GovernanceSemanticVersionSurvivabilityAreaAssessment {
  area: GovernanceSemanticVersionSurvivabilityArea;
  score: number;
  classification: GovernanceSemanticVersionSurvivabilityClassification;
  description: string;
  versionStableSignals: string[];
  versionFragileSignals: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceSemanticVersionSurvivabilityFinding {
  id: string;
  findingType: GovernanceSemanticVersionSurvivabilityFindingType;
  area: GovernanceSemanticVersionSurvivabilityArea;
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

export interface GovernanceSemanticVersionSurvivabilityResult {
  semanticVersionSurvivabilityScore: number;
  semanticVersionSurvivabilityClassification: GovernanceSemanticVersionSurvivabilityClassification;
  areaAssessments: GovernanceSemanticVersionSurvivabilityAreaAssessment[];
  findings: GovernanceSemanticVersionSurvivabilityFinding[];
  versionStableSemanticAreas: string[];
  versionFragileSemanticAreas: string[];
  backwardCompatibilityFindings: string[];
  taxonomyVersionFindings: string[];
  classificationVersionFindings: string[];
  normalizationVersionFindings: string[];
  traceabilitySemanticFindings: string[];
  explainabilitySemanticFindings: string[];
  auditSemanticFindings: string[];
  doctrineSemanticFindings: string[];
  reconstructionSurvivabilityFindings: string[];
  humanReviewNotes: string[];
  futureStabilizationRecommendations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    semanticVersionSurvivabilityRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
