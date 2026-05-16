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

export type GovernanceLongHorizonInstitutionalResilienceClassification =
  | "brittle"
  | "conditionally_resilient"
  | "resilient"
  | "institutionally_resilient";

export type GovernanceLongHorizonInstitutionalResilienceArea =
  | "governance_resilience"
  | "audit_resilience"
  | "traceability_resilience"
  | "explainability_resilience"
  | "survivability_resilience"
  | "semantic_resilience"
  | "doctrine_resilience"
  | "observability_resilience"
  | "reviewability_resilience"
  | "institutional_memory_resilience"
  | "lifecycle_resilience"
  | "reconstruction_resilience"
  | "compatibility_resilience"
  | "migration_survivability_resilience";

export type GovernanceLongHorizonInstitutionalResilienceFindingType =
  | "governance_brittleness"
  | "survivability_collapse_risk"
  | "resilience_degradation_risk"
  | "audit_resilience_weakness"
  | "explainability_resilience_weakness"
  | "traceability_resilience_weakness"
  | "semantic_resilience_instability"
  | "doctrine_resilience_weakness"
  | "institutional_continuity_risk"
  | "reconstruction_survivability_weakness"
  | "long_horizon_resilience_fragility"
  | "orchestration_resilience_risk"
  | "institutional_survivability_degradation";

export interface GovernanceLongHorizonInstitutionalResilienceContext {
  horizonLabel?: string;
  horizonYears?: number;
  futureAiAgentScope?: string[];
  futureOrchestrationScenarios?: string[];
  futureEnterpriseExpansionScenarios?: string[];
  operationalStressScenarios?: string[];
  continuityDisruptionScenarios?: string[];
  longHorizonAssumptions?: string[];
  resilienceLimitations?: string[];
}

export interface GovernanceLongHorizonInstitutionalResilienceInput {
  resilienceContext?: GovernanceLongHorizonInstitutionalResilienceContext;
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

export interface GovernanceLongHorizonInstitutionalResilienceAreaAssessment {
  area: GovernanceLongHorizonInstitutionalResilienceArea;
  score: number;
  classification: GovernanceLongHorizonInstitutionalResilienceClassification;
  description: string;
  resilienceSignals: string[];
  fragilitySignals: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceLongHorizonInstitutionalResilienceFinding {
  id: string;
  findingType: GovernanceLongHorizonInstitutionalResilienceFindingType;
  area: GovernanceLongHorizonInstitutionalResilienceArea;
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

export interface GovernanceLongHorizonInstitutionalResilienceResult {
  institutionalResilienceScore: number;
  resilienceClassification: GovernanceLongHorizonInstitutionalResilienceClassification;
  areaAssessments: GovernanceLongHorizonInstitutionalResilienceAreaAssessment[];
  findings: GovernanceLongHorizonInstitutionalResilienceFinding[];
  resilientGovernanceAreas: string[];
  fragileGovernanceAreas: string[];
  governanceResilienceFindings: string[];
  auditResilienceFindings: string[];
  traceabilityResilienceFindings: string[];
  explainabilityResilienceFindings: string[];
  semanticResilienceFindings: string[];
  doctrineResilienceFindings: string[];
  observabilityResilienceFindings: string[];
  reconstructionResilienceFindings: string[];
  institutionalContinuityFindings: string[];
  longHorizonSurvivabilityFindings: string[];
  humanReviewNotes: string[];
  futureStabilizationRecommendations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    institutionalResilienceRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
