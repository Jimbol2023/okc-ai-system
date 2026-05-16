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

export type GovernanceTraceabilitySurvivabilityClassification =
  | "collapsed"
  | "partially_traceable"
  | "traceable"
  | "institutionally_traceable";

export type GovernanceTraceabilitySurvivabilityArea =
  | "evidence_linkage"
  | "recommendation_linkage"
  | "principle_linkage"
  | "reasoning_linkage"
  | "lineage_linkage"
  | "audit_linkage"
  | "explainability_linkage"
  | "survivability_linkage"
  | "semantic_linkage"
  | "doctrine_linkage"
  | "observability_linkage"
  | "reviewability_linkage"
  | "institutional_memory_linkage"
  | "lifecycle_continuity_linkage";

export type GovernanceTraceabilitySurvivabilityFindingType =
  | "traceability_collapse_risk"
  | "weak_evidence_chain"
  | "weak_recommendation_linkage"
  | "weak_principle_linkage"
  | "weak_reasoning_linkage"
  | "weak_lineage_linkage"
  | "audit_linkage_fragmentation"
  | "explainability_linkage_gap"
  | "semantic_linkage_instability"
  | "doctrine_linkage_weakness"
  | "observability_linkage_gap"
  | "reviewability_linkage_degradation"
  | "future_traceability_survivability_risk"
  | "long_horizon_reconstruction_risk";

export interface GovernanceTraceabilitySurvivabilityInput {
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

export interface GovernanceTraceabilitySurvivabilityAreaAssessment {
  area: GovernanceTraceabilitySurvivabilityArea;
  score: number;
  classification: GovernanceTraceabilitySurvivabilityClassification;
  description: string;
  traceableSignals: string[];
  fragileSignals: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceTraceabilitySurvivabilityFinding {
  id: string;
  findingType: GovernanceTraceabilitySurvivabilityFindingType;
  area: GovernanceTraceabilitySurvivabilityArea;
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

export interface GovernanceTraceabilitySurvivabilityResult {
  traceabilitySurvivabilityScore: number;
  traceabilitySurvivabilityClassification: GovernanceTraceabilitySurvivabilityClassification;
  areaAssessments: GovernanceTraceabilitySurvivabilityAreaAssessment[];
  findings: GovernanceTraceabilitySurvivabilityFinding[];
  durableTraceabilityAreas: string[];
  fragileTraceabilityAreas: string[];
  evidenceLinkageFindings: string[];
  recommendationLinkageFindings: string[];
  principleLinkageFindings: string[];
  reasoningLinkageFindings: string[];
  lineageLinkageFindings: string[];
  auditLinkageFindings: string[];
  explainabilityLinkageFindings: string[];
  reconstructionSurvivabilityFindings: string[];
  humanReviewNotes: string[];
  futureStabilizationRecommendations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    traceabilitySurvivabilityRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
