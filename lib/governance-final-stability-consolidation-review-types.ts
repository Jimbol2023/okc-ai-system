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

export type GovernanceFinalStabilityClassification =
  | "unstable"
  | "partially_stable"
  | "stable"
  | "institutionally_stable";

export type GovernanceFinalStabilityArea =
  | "governance_readiness"
  | "auditability"
  | "traceability"
  | "explainability"
  | "survivability"
  | "continuity"
  | "semantic_stability"
  | "doctrine_durability"
  | "observability_durability"
  | "reviewability_integrity"
  | "semantic_version_survivability"
  | "isolation_durability"
  | "resilience_durability"
  | "institutional_memory_continuity"
  | "audit_history_survivability"
  | "orchestration_safety"
  | "reconstruction_survivability";

export type GovernanceFinalStabilityFindingType =
  | "hidden_governance_fragility"
  | "subsystem_inconsistency"
  | "reconstruction_instability"
  | "governance_stack_fragmentation"
  | "semantic_survivability_weakness"
  | "orchestration_contamination_risk"
  | "explainability_continuity_weakness"
  | "traceability_continuity_weakness"
  | "auditability_degradation_risk"
  | "institutional_durability_weakness"
  | "long_horizon_survivability_gap"
  | "reviewability_inconsistency"
  | "isolation_instability"
  | "resilience_weakness";

export interface GovernanceFinalStabilityConsolidationInput {
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

export interface GovernanceFinalStabilityAreaAssessment {
  area: GovernanceFinalStabilityArea;
  score: number;
  classification: GovernanceFinalStabilityClassification;
  description: string;
  stabilitySignals: string[];
  fragilitySignals: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceFinalStabilityFinding {
  id: string;
  findingType: GovernanceFinalStabilityFindingType;
  area: GovernanceFinalStabilityArea;
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

export interface GovernanceFinalStabilityConsolidationResult {
  finalGovernanceStabilityScore: number;
  governanceStabilityClassification: GovernanceFinalStabilityClassification;
  areaAssessments: GovernanceFinalStabilityAreaAssessment[];
  findings: GovernanceFinalStabilityFinding[];
  stableGovernanceAreas: string[];
  fragileGovernanceAreas: string[];
  consolidatedAuditabilityFindings: string[];
  consolidatedExplainabilityFindings: string[];
  consolidatedTraceabilityFindings: string[];
  consolidatedSurvivabilityFindings: string[];
  consolidatedContinuityFindings: string[];
  consolidatedSemanticFindings: string[];
  consolidatedResilienceFindings: string[];
  institutionalDurabilityFindings: string[];
  reconstructionSurvivabilityFindings: string[];
  humanReviewNotes: string[];
  finalStabilizationRecommendations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    finalStabilityRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
