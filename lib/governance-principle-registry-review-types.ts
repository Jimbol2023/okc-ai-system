import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
  FullSystemGovernanceAuditResult,
} from "./full-system-governance-audit-types";
import type { GovernanceEvidenceTraceabilityResult } from "./governance-evidence-traceability-types";
import type {
  PrincipleEvidenceNormalizedMapping,
  PrincipleEvidenceNormalizationResult,
} from "./principle-evidence-normalization-types";
import type {
  ReputationGovernanceDoctrinePrinciple,
  ReputationGovernanceDoctrinePrincipleType,
  ReputationGovernanceDoctrineResult,
} from "./reputation/reputation-governance-doctrine-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

export type GovernancePrincipleRegistryReadinessClassification =
  | "unstable"
  | "developing"
  | "registry_candidate"
  | "institutionally_registry_ready";

export type GovernancePrincipleRegistryReviewFindingType =
  | "inconsistent_principle_naming"
  | "duplicated_principle_semantics"
  | "weak_doctrine_consistency"
  | "semantic_overlap"
  | "conflicting_principle_meaning"
  | "fragmented_governance_terminology"
  | "unstable_governance_taxonomy"
  | "principle_evidence_inconsistency"
  | "principle_score_inconsistency"
  | "principle_drift_risk"
  | "governance_doctrine_fragmentation_risk";

export type GovernancePrincipleRegistryReadinessAreaType =
  | "principle_ids"
  | "doctrine_categories"
  | "governance_metadata"
  | "registry_driven_normalization"
  | "reusable_governance_taxonomy"
  | "evidence_taxonomy"
  | "audit_taxonomy"
  | "semantic_versioning"
  | "institutional_governance_vocabulary"
  | "deterministic_registry_reasoning";

export type GovernancePrincipleRegistryRecommendationClassification =
  | "Immediate"
  | "Future Upgrade"
  | "Optional Optimization";

export interface GovernancePrincipleRegistryReviewInput {
  doctrineResult?: ReputationGovernanceDoctrineResult;
  doctrinePrinciples?: ReputationGovernanceDoctrinePrinciple[];
  normalizationResult?: PrincipleEvidenceNormalizationResult;
  normalizedMappings?: PrincipleEvidenceNormalizedMapping[];
  traceabilityResult?: GovernanceEvidenceTraceabilityResult;
  auditResult?: FullSystemGovernanceAuditResult;
  auditFindings?: FullSystemGovernanceAuditFinding[];
  recommendations?: FullSystemGovernanceAuditRecommendation[];
  evaluatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface GovernancePrincipleRegistryReadinessArea {
  id: string;
  areaType: GovernancePrincipleRegistryReadinessAreaType;
  score: number;
  status: GovernancePrincipleRegistryReadinessClassification;
  description: string;
  evidence: string[];
  limitations: string[];
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernancePrincipleRegistryReviewFinding {
  id: string;
  findingType: GovernancePrincipleRegistryReviewFindingType;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedPrinciples: ReputationGovernanceDoctrinePrincipleType[];
  affectedAuditCategories: FullSystemGovernanceAuditCategory[];
  recommendedHumanReview: string;
  confidenceScore: number;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernancePrincipleRegistryReviewRecommendation {
  id: string;
  classification: GovernancePrincipleRegistryRecommendationClassification;
  recommendation: string;
  rationale: string;
}

export interface GovernancePrincipleRegistryReviewResult {
  registryReadinessScore: number;
  registryReadinessClassification: GovernancePrincipleRegistryReadinessClassification;
  readinessAreas: GovernancePrincipleRegistryReadinessArea[];
  findings: GovernancePrincipleRegistryReviewFinding[];
  semanticStabilityFindings: string[];
  doctrineConsistencyFindings: string[];
  governanceVocabularyFindings: string[];
  taxonomyStabilityFindings: string[];
  semanticDriftRisks: string[];
  overlapConflictFindings: string[];
  futureRegistryRecommendations: string[];
  humanReviewRecommendations: string[];
  futureExtractionRecommendations: string[];
  classifiedRecommendations: GovernancePrincipleRegistryReviewRecommendation[];
  architectureReviewFindings: string[];
  reviewLimitations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    registryReviewRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
