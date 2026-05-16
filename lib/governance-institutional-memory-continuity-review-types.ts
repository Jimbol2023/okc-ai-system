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

export type GovernanceInstitutionalMemoryContinuityClassification =
  | "fragmented"
  | "partially_reconstructable"
  | "reconstructable"
  | "institutionally_reconstructable";

export type GovernanceInstitutionalMemoryContinuityArea =
  | "governance_findings"
  | "audit_history"
  | "evidence_chains"
  | "traceability_chains"
  | "semantic_history"
  | "doctrine_history"
  | "observability_history"
  | "reviewability_history"
  | "lifecycle_continuity"
  | "versioning_readiness"
  | "compatibility_expectations"
  | "migration_survivability"
  | "institutional_lineage"
  | "human_review_notes";

export type GovernanceInstitutionalMemoryContinuityFindingType =
  | "institutional_memory_gap"
  | "governance_memory_fragmentation"
  | "audit_memory_discontinuity"
  | "semantic_memory_drift"
  | "lineage_reconstruction_weakness"
  | "traceability_memory_gap"
  | "observability_memory_gap"
  | "reviewability_memory_weakness"
  | "lifecycle_memory_gap"
  | "future_memory_survivability_risk"
  | "governance_history_reconstruction_risk";

export interface GovernanceInstitutionalMemoryContinuityInput {
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

export interface GovernanceInstitutionalMemoryContinuityAreaAssessment {
  area: GovernanceInstitutionalMemoryContinuityArea;
  score: number;
  classification: GovernanceInstitutionalMemoryContinuityClassification;
  description: string;
  reconstructableSignals: string[];
  memoryFragilitySignals: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceInstitutionalMemoryContinuityFinding {
  id: string;
  findingType: GovernanceInstitutionalMemoryContinuityFindingType;
  area: GovernanceInstitutionalMemoryContinuityArea;
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

export interface GovernanceInstitutionalMemoryContinuityResult {
  institutionalMemoryContinuityScore: number;
  memoryContinuityClassification: GovernanceInstitutionalMemoryContinuityClassification;
  areaAssessments: GovernanceInstitutionalMemoryContinuityAreaAssessment[];
  findings: GovernanceInstitutionalMemoryContinuityFinding[];
  durableMemoryAreas: string[];
  fragileMemoryAreas: string[];
  auditMemoryFindings: string[];
  semanticMemoryFindings: string[];
  traceabilityMemoryFindings: string[];
  observabilityMemoryFindings: string[];
  reviewabilityMemoryFindings: string[];
  lineageReconstructionFindings: string[];
  governanceHistoryReconstructionFindings: string[];
  humanReviewNotes: string[];
  futureStabilizationRecommendations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    institutionalMemoryContinuityRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
