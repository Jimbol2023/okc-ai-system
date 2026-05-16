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

export type GovernanceExplainabilityContinuityClassification =
  | "opaque"
  | "partially_explainable"
  | "explainable"
  | "institutionally_explainable";

export type GovernanceExplainabilityContinuityArea =
  | "governance_findings"
  | "audit_findings"
  | "reasoning_structures"
  | "evidence_visibility"
  | "scoring_visibility"
  | "limitation_visibility"
  | "traceability_explainability"
  | "survivability_explainability"
  | "semantic_explainability"
  | "doctrine_explainability"
  | "observability_explainability"
  | "reviewability_explainability"
  | "institutional_memory_continuity"
  | "lineage_continuity";

export type GovernanceExplainabilityContinuityFindingType =
  | "explainability_drift"
  | "reasoning_fragmentation"
  | "evidence_visibility_gap"
  | "scoring_explainability_degradation"
  | "limitation_visibility_degradation"
  | "traceability_explainability_gap"
  | "semantic_explainability_instability"
  | "audit_explainability_fragmentation"
  | "observability_explainability_gap"
  | "institutional_explainability_survivability_risk"
  | "governance_opacity_risk"
  | "reviewability_degradation_risk"
  | "long_horizon_explainability_continuity_risk";

export interface GovernanceExplainabilityContinuityInput {
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

export interface GovernanceExplainabilityContinuityAreaAssessment {
  area: GovernanceExplainabilityContinuityArea;
  score: number;
  classification: GovernanceExplainabilityContinuityClassification;
  description: string;
  explainabilitySignals: string[];
  opacitySignals: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceExplainabilityContinuityFinding {
  id: string;
  findingType: GovernanceExplainabilityContinuityFindingType;
  area: GovernanceExplainabilityContinuityArea;
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

export interface GovernanceExplainabilityContinuityResult {
  explainabilityContinuityScore: number;
  explainabilityContinuityClassification: GovernanceExplainabilityContinuityClassification;
  areaAssessments: GovernanceExplainabilityContinuityAreaAssessment[];
  findings: GovernanceExplainabilityContinuityFinding[];
  durableExplainabilityAreas: string[];
  fragileExplainabilityAreas: string[];
  reasoningContinuityFindings: string[];
  evidenceVisibilityFindings: string[];
  scoringExplainabilityFindings: string[];
  limitationVisibilityFindings: string[];
  traceabilityExplainabilityFindings: string[];
  semanticExplainabilityFindings: string[];
  auditExplainabilityFindings: string[];
  institutionalExplainabilityFindings: string[];
  reconstructionContinuityFindings: string[];
  humanReviewNotes: string[];
  futureStabilizationRecommendations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    explainabilityContinuityRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
