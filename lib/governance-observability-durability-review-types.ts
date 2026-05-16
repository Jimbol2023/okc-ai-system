import type { FullSystemGovernanceAuditPreview } from "./full-system-governance-audit-preview";
import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
  FullSystemGovernanceAuditResult,
} from "./full-system-governance-audit-types";
import type { GovernanceDoctrineDurabilityResult } from "./governance-doctrine-durability-review-types";
import type { GovernanceEvidenceTraceabilityResult } from "./governance-evidence-traceability-types";
import type { GovernancePrincipleRegistryReviewResult } from "./governance-principle-registry-review-types";
import type { GovernanceReadinessResult } from "./governance-readiness-types";
import type { GovernanceSemanticStabilityResult } from "./governance-semantic-stability-review-types";
import type { GovernanceSurvivabilityExpansionResult } from "./governance-survivability-expansion-review-types";
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

export type GovernanceObservabilityDurabilityClassification =
  | "fragile"
  | "conditionally_observable"
  | "observable"
  | "institutionally_observable";

export type GovernanceObservabilityDurabilityArea =
  | "governance_dashboards"
  | "audit_visibility"
  | "traceability_visibility"
  | "explainability_visibility"
  | "survivability_visibility"
  | "orchestration_visibility"
  | "semantic_visibility"
  | "registry_readiness_visibility"
  | "normalization_visibility"
  | "doctrine_visibility"
  | "continuity_visibility"
  | "resilience_visibility"
  | "recommendation_visibility"
  | "limitation_visibility"
  | "evidence_visibility"
  | "future_dashboard_scaling"
  | "future_observability_growth"
  | "future_ai_agent_growth"
  | "future_multi_tenant_visibility"
  | "cross_industry_observability";

export type GovernanceObservabilityDurabilityFindingType =
  | "observability_blind_spot"
  | "governance_visibility_degradation_risk"
  | "explainability_visibility_risk"
  | "traceability_visibility_risk"
  | "dashboard_survivability_risk"
  | "audit_visibility_fragmentation_risk"
  | "semantic_visibility_risk"
  | "observability_coupling_risk"
  | "reviewability_degradation_risk"
  | "scalability_visibility_bottleneck"
  | "future_registry_observability_incompatibility"
  | "institutional_observability_risk"
  | "survivability_visibility_gap"
  | "cross_industry_observability_risk";

export interface GovernanceObservabilityDurabilityInput {
  survivabilityExpansionResult?: GovernanceSurvivabilityExpansionResult;
  doctrineDurabilityResult?: GovernanceDoctrineDurabilityResult;
  semanticStabilityResult?: GovernanceSemanticStabilityResult;
  registryReviewResult?: GovernancePrincipleRegistryReviewResult;
  normalizationResult?: PrincipleEvidenceNormalizationResult;
  traceabilityResult?: GovernanceEvidenceTraceabilityResult;
  auditResult?: FullSystemGovernanceAuditResult;
  auditPreview?: FullSystemGovernanceAuditPreview;
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

export interface GovernanceObservabilityDurabilityAreaAssessment {
  area: GovernanceObservabilityDurabilityArea;
  score: number;
  classification: GovernanceObservabilityDurabilityClassification;
  description: string;
  visibleSignals: string[];
  blindSpots: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceObservabilityDurabilityFinding {
  id: string;
  findingType: GovernanceObservabilityDurabilityFindingType;
  area: GovernanceObservabilityDurabilityArea;
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

export interface GovernanceObservabilityDurabilityResult {
  observabilityDurabilityScore: number;
  observabilityScalabilityScore: number;
  observabilityDurabilityClassification: GovernanceObservabilityDurabilityClassification;
  observabilityScalabilityClassification: GovernanceObservabilityDurabilityClassification;
  areaAssessments: GovernanceObservabilityDurabilityAreaAssessment[];
  findings: GovernanceObservabilityDurabilityFinding[];
  durableObservabilityAreas: string[];
  fragileObservabilityAreas: string[];
  governanceVisibilityFindings: string[];
  explainabilityVisibilityFindings: string[];
  traceabilityVisibilityFindings: string[];
  auditVisibilityFindings: string[];
  survivabilityVisibilityFindings: string[];
  dashboardDurabilityFindings: string[];
  institutionalReviewabilityFindings: string[];
  crossIndustryObservabilityFindings: string[];
  registryReadinessImplications: string[];
  humanReviewNotes: string[];
  futureStabilizationRecommendations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    observabilityDurabilityRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
