import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
  FullSystemGovernanceAuditResult,
} from "./full-system-governance-audit-types";
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

export type GovernanceLifecycleContinuityClassification =
  | "discontinuous"
  | "partially_continuous"
  | "continuous"
  | "institutionally_continuous";

export type GovernanceLifecycleContinuityArea =
  | "governance_findings"
  | "audit_findings"
  | "evidence_chains"
  | "traceability_chains"
  | "doctrine_structures"
  | "semantic_structures"
  | "classification_structures"
  | "observability_outputs"
  | "reviewability_outputs"
  | "versioning_readiness"
  | "compatibility_expectations"
  | "migration_survivability"
  | "institutional_memory"
  | "lineage_continuity";

export type GovernanceLifecycleContinuityFindingType =
  | "lifecycle_continuity_gap"
  | "audit_continuity_risk"
  | "semantic_continuity_drift"
  | "traceability_discontinuity"
  | "observability_fragmentation"
  | "reviewability_degradation"
  | "doctrine_continuity_weakness"
  | "versioning_continuity_risk"
  | "compatibility_continuity_risk"
  | "migration_continuity_risk"
  | "institutional_memory_fragmentation"
  | "governance_history_reconstruction_risk";

export interface GovernanceCompatibilityMigrationContinuityContext {
  compatibilityScore?: number;
  migrationSurvivabilityScore?: number;
  compatibilityClassification?: string;
  migrationClassification?: string;
  compatibilityFindings?: string[];
  migrationFindings?: string[];
  humanReviewNotes?: string[];
  futureStabilizationRecommendations?: string[];
}

export interface GovernanceLifecycleContinuityInput {
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

export interface GovernanceLifecycleContinuityAreaAssessment {
  area: GovernanceLifecycleContinuityArea;
  score: number;
  classification: GovernanceLifecycleContinuityClassification;
  description: string;
  continuitySignals: string[];
  fragilitySignals: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceLifecycleContinuityFinding {
  id: string;
  findingType: GovernanceLifecycleContinuityFindingType;
  area: GovernanceLifecycleContinuityArea;
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

export interface GovernanceLifecycleContinuityResult {
  lifecycleContinuityScore: number;
  lifecycleContinuityClassification: GovernanceLifecycleContinuityClassification;
  areaAssessments: GovernanceLifecycleContinuityAreaAssessment[];
  findings: GovernanceLifecycleContinuityFinding[];
  durableContinuityAreas: string[];
  fragileContinuityAreas: string[];
  auditContinuityFindings: string[];
  semanticContinuityFindings: string[];
  traceabilityContinuityFindings: string[];
  observabilityContinuityFindings: string[];
  reviewabilityContinuityFindings: string[];
  doctrineContinuityFindings: string[];
  versioningContinuityFindings: string[];
  migrationContinuityFindings: string[];
  institutionalMemoryFindings: string[];
  humanReviewNotes: string[];
  futureStabilizationRecommendations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    lifecycleContinuityRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
