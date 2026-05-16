import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
  FullSystemGovernanceAuditResult,
} from "./full-system-governance-audit-types";
import type {
  GovernanceCompatibilityMigrationContinuityContext,
  GovernanceLifecycleContinuityResult,
} from "./governance-lifecycle-continuity-review-types";
import type { GovernanceDoctrineDurabilityResult } from "./governance-doctrine-durability-review-types";
import type { GovernanceEvidenceTraceabilityResult } from "./governance-evidence-traceability-types";
import type { GovernanceInstitutionalMemoryContinuityResult } from "./governance-institutional-memory-continuity-review-types";
import type { GovernanceObservabilityDurabilityResult } from "./governance-observability-durability-review-types";
import type { GovernanceReadinessResult } from "./governance-readiness-types";
import type { GovernanceReviewabilityIntegrityResult } from "./governance-reviewability-integrity-review-types";
import type { GovernanceSemanticStabilityResult } from "./governance-semantic-stability-review-types";
import type { GovernanceSurvivabilityExpansionResult } from "./governance-survivability-expansion-review-types";
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

export type GovernanceAuditHistorySurvivabilityClassification =
  | "fragmented"
  | "partially_survivable"
  | "survivable"
  | "institutionally_survivable";

export type GovernanceAuditHistorySurvivabilityArea =
  | "governance_findings_history"
  | "audit_classifications"
  | "evidence_history"
  | "traceability_history"
  | "semantic_history"
  | "observability_history"
  | "lineage_reconstruction"
  | "reviewability_reconstruction"
  | "doctrine_continuity"
  | "lifecycle_continuity"
  | "versioning_continuity"
  | "compatibility_continuity"
  | "migration_survivability"
  | "institutional_memory_continuity";

export type GovernanceAuditHistorySurvivabilityFindingType =
  | "audit_history_fragmentation"
  | "governance_history_gap"
  | "traceability_history_discontinuity"
  | "evidence_history_degradation"
  | "semantic_history_drift"
  | "observability_history_gap"
  | "lineage_history_weakness"
  | "reviewability_history_degradation"
  | "doctrine_history_fragmentation"
  | "versioning_history_instability"
  | "migration_history_survivability_risk"
  | "institutional_audit_reconstruction_risk"
  | "long_horizon_audit_survivability_risk";

export interface GovernanceAuditHistorySurvivabilityInput {
  institutionalMemoryContinuityResult?: GovernanceInstitutionalMemoryContinuityResult;
  lifecycleContinuityResult?: GovernanceLifecycleContinuityResult;
  versioningReadinessResult?: GovernanceVersioningReadinessResult;
  compatibilityMigrationContext?: GovernanceCompatibilityMigrationContinuityContext;
  reviewabilityIntegrityResult?: GovernanceReviewabilityIntegrityResult;
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

export interface GovernanceAuditHistorySurvivabilityAreaAssessment {
  area: GovernanceAuditHistorySurvivabilityArea;
  score: number;
  classification: GovernanceAuditHistorySurvivabilityClassification;
  description: string;
  survivabilitySignals: string[];
  fragilitySignals: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceAuditHistorySurvivabilityFinding {
  id: string;
  findingType: GovernanceAuditHistorySurvivabilityFindingType;
  area: GovernanceAuditHistorySurvivabilityArea;
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

export interface GovernanceAuditHistorySurvivabilityResult {
  auditHistorySurvivabilityScore: number;
  auditHistoryClassification: GovernanceAuditHistorySurvivabilityClassification;
  areaAssessments: GovernanceAuditHistorySurvivabilityAreaAssessment[];
  findings: GovernanceAuditHistorySurvivabilityFinding[];
  durableAuditHistoryAreas: string[];
  fragileAuditHistoryAreas: string[];
  governanceHistoryFindings: string[];
  evidenceHistoryFindings: string[];
  traceabilityHistoryFindings: string[];
  semanticHistoryFindings: string[];
  observabilityHistoryFindings: string[];
  lineageHistoryFindings: string[];
  reviewabilityHistoryFindings: string[];
  institutionalAuditabilityFindings: string[];
  reconstructionSurvivabilityFindings: string[];
  humanReviewNotes: string[];
  futureStabilizationRecommendations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    auditHistorySurvivabilityRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
