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
import type { GovernanceSemanticVersionSurvivabilityResult } from "./governance-semantic-version-survivability-review-types";
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

export type GovernanceMultiBusinessTenantIsolationClassification =
  | "contaminated"
  | "partially_isolated"
  | "isolated"
  | "institutionally_isolated";

export type GovernanceMultiBusinessTenantIsolationArea =
  | "business_isolation"
  | "tenant_isolation"
  | "governance_isolation"
  | "audit_isolation"
  | "traceability_isolation"
  | "explainability_isolation"
  | "survivability_isolation"
  | "semantic_isolation"
  | "doctrine_isolation"
  | "observability_isolation"
  | "reviewability_isolation"
  | "orchestration_review_isolation"
  | "institutional_memory_isolation"
  | "lifecycle_continuity_isolation";

export type GovernanceMultiBusinessTenantIsolationFindingType =
  | "tenant_contamination_risk"
  | "governance_leakage_risk"
  | "traceability_crossover_risk"
  | "explainability_crossover_risk"
  | "semantic_contamination_risk"
  | "audit_contamination_risk"
  | "survivability_fragmentation_risk"
  | "lineage_crossover_risk"
  | "observability_leakage_risk"
  | "reviewability_contamination_risk"
  | "orchestration_boundary_weakness"
  | "weak_governance_boundary"
  | "cross_business_reconstruction_risk"
  | "future_tenant_survivability_risk";

export interface GovernanceMultiBusinessTenantIsolationContext {
  businessLineId?: string;
  tenantId?: string;
  businessUnitScope?: string[];
  tenantScope?: string[];
  isolationBoundaryId?: string;
  dataPartitionStrategy?: string;
  auditIsolationScope?: string;
  traceabilityIsolationScope?: string;
  explainabilityIsolationScope?: string;
  observabilityIsolationScope?: string;
  orchestrationIsolationScope?: string;
  reconstructionScope?: string;
  sharedInfrastructureNotes?: string[];
  boundaryLimitations?: string[];
}

export interface GovernanceMultiBusinessTenantIsolationInput {
  isolationContext?: GovernanceMultiBusinessTenantIsolationContext;
  semanticVersionSurvivabilityResult?: GovernanceSemanticVersionSurvivabilityResult;
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

export interface GovernanceMultiBusinessTenantIsolationAreaAssessment {
  area: GovernanceMultiBusinessTenantIsolationArea;
  score: number;
  classification: GovernanceMultiBusinessTenantIsolationClassification;
  description: string;
  isolationStrengthSignals: string[];
  isolationRiskSignals: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceMultiBusinessTenantIsolationFinding {
  id: string;
  findingType: GovernanceMultiBusinessTenantIsolationFindingType;
  area: GovernanceMultiBusinessTenantIsolationArea;
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

export interface GovernanceMultiBusinessTenantIsolationResult {
  isolationSurvivabilityScore: number;
  isolationClassification: GovernanceMultiBusinessTenantIsolationClassification;
  areaAssessments: GovernanceMultiBusinessTenantIsolationAreaAssessment[];
  findings: GovernanceMultiBusinessTenantIsolationFinding[];
  durableIsolationAreas: string[];
  fragileIsolationAreas: string[];
  tenantBoundaryFindings: string[];
  governanceBoundaryFindings: string[];
  auditIsolationFindings: string[];
  traceabilityIsolationFindings: string[];
  explainabilityIsolationFindings: string[];
  semanticIsolationFindings: string[];
  observabilityIsolationFindings: string[];
  institutionalBoundaryFindings: string[];
  reconstructionIsolationFindings: string[];
  humanReviewNotes: string[];
  futureStabilizationRecommendations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    isolationRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
