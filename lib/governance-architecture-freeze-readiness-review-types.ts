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
import type { GovernanceFinalStabilityConsolidationResult } from "./governance-final-stability-consolidation-review-types";
import type { GovernanceInstitutionalMemoryContinuityResult } from "./governance-institutional-memory-continuity-review-types";
import type { GovernanceLongHorizonInstitutionalResilienceResult } from "./governance-long-horizon-institutional-resilience-review-types";
import type { GovernanceMultiBusinessTenantIsolationResult } from "./governance-multi-business-tenant-isolation-review-types";
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

export type GovernanceArchitectureFreezeReadinessClassification =
  | "not_ready_to_freeze"
  | "partially_freeze_ready"
  | "freeze_ready"
  | "institutionally_freeze_ready";

export type GovernanceArchitectureFreezeReadinessArea =
  | "governance_readiness"
  | "auditability"
  | "explainability"
  | "traceability"
  | "survivability"
  | "semantic_stability"
  | "doctrine_durability"
  | "observability_durability"
  | "reviewability_integrity"
  | "institutional_memory_continuity"
  | "lifecycle_continuity"
  | "semantic_version_survivability"
  | "multi_business_isolation"
  | "long_horizon_resilience"
  | "final_stability_consolidation"
  | "stable_reusable_contracts"
  | "shared_utility_extraction"
  | "governance_scaling"
  | "operational_deployment"
  | "enterprise_integration"
  | "orchestration_isolation";

export type GovernanceArchitectureFreezeReadinessFindingType =
  | "unresolved_architecture_fragility"
  | "unstable_contract"
  | "premature_freeze_risk"
  | "hidden_orchestration_contamination"
  | "hidden_execution_pathway_risk"
  | "subsystem_inconsistency"
  | "reusable_utility_instability"
  | "semantic_instability"
  | "traceability_weakness"
  | "explainability_weakness"
  | "auditability_weakness"
  | "survivability_weakness"
  | "future_scaling_risk"
  | "institutional_durability_gap";

export interface GovernanceArchitectureFreezeReadinessContext {
  candidateContractAreas?: string[];
  candidateUtilityAreas?: string[];
  freezeAssumptions?: string[];
  deploymentAssumptions?: string[];
  enterpriseIntegrationAssumptions?: string[];
  freezeLimitations?: string[];
}

export interface GovernanceArchitectureFreezeReadinessInput {
  freezeContext?: GovernanceArchitectureFreezeReadinessContext;
  finalStabilityConsolidationResult?: GovernanceFinalStabilityConsolidationResult;
  longHorizonInstitutionalResilienceResult?: GovernanceLongHorizonInstitutionalResilienceResult;
  multiBusinessTenantIsolationResult?: GovernanceMultiBusinessTenantIsolationResult;
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

export interface GovernanceArchitectureFreezeReadinessAreaAssessment {
  area: GovernanceArchitectureFreezeReadinessArea;
  score: number;
  classification: GovernanceArchitectureFreezeReadinessClassification;
  description: string;
  freezeReadySignals: string[];
  freezeRiskSignals: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceArchitectureFreezeReadinessFinding {
  id: string;
  findingType: GovernanceArchitectureFreezeReadinessFindingType;
  area: GovernanceArchitectureFreezeReadinessArea;
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

export interface GovernanceArchitectureFreezeReadinessResult {
  architectureFreezeReadinessScore: number;
  freezeReadinessClassification: GovernanceArchitectureFreezeReadinessClassification;
  areaAssessments: GovernanceArchitectureFreezeReadinessAreaAssessment[];
  findings: GovernanceArchitectureFreezeReadinessFinding[];
  freezeReadyAreas: string[];
  notFreezeReadyAreas: string[];
  stableContractCandidates: string[];
  unstableContractAreas: string[];
  reusableUtilityExtractionCandidates: string[];
  governanceScalingFindings: string[];
  operationalDeploymentReadinessFindings: string[];
  enterpriseIntegrationFindings: string[];
  institutionalDurabilityFindings: string[];
  humanReviewNotes: string[];
  finalRecommendations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    freezeReadinessRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
