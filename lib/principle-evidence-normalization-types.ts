import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
  FullSystemGovernanceAuditResult,
} from "./full-system-governance-audit-types";
import type {
  GovernanceEvidenceTraceGap,
  GovernanceEvidenceTraceLink,
  GovernanceEvidenceTraceStrength,
  GovernanceEvidenceTraceabilityResult,
} from "./governance-evidence-traceability-types";
import type {
  ReputationGovernanceDoctrinePrinciple,
  ReputationGovernanceDoctrinePrincipleType,
  ReputationGovernanceDoctrineResult,
} from "./reputation/reputation-governance-doctrine-types";

export type PrincipleEvidenceNormalizationClassification =
  | "fragmented"
  | "partially_normalized"
  | "normalized"
  | "institutionally_consistent";

export type PrincipleEvidenceNormalizedPrinciple =
  | ReputationGovernanceDoctrinePrincipleType
  | "system_governance_safety"
  | "not_supplied";

export type PrincipleEvidenceNormalizationGapType =
  | "inconsistent_principle_label"
  | "weak_principle_evidence_mapping"
  | "unsupported_evidence_relationship"
  | "scoring_driver_inconsistency"
  | "unclear_recommendation_mapping"
  | "weak_limitation_linkage"
  | "duplicated_governance_semantics"
  | "audit_category_drift"
  | "traceability_inconsistency"
  | "governance_semantic_drift_risk";

export interface PrincipleEvidenceNormalizationInput {
  doctrineResult?: ReputationGovernanceDoctrineResult;
  doctrinePrinciples?: ReputationGovernanceDoctrinePrinciple[];
  auditResult?: FullSystemGovernanceAuditResult;
  auditFindings?: FullSystemGovernanceAuditFinding[];
  recommendations?: FullSystemGovernanceAuditRecommendation[];
  traceabilityResult?: GovernanceEvidenceTraceabilityResult;
  traceLinks?: GovernanceEvidenceTraceLink[];
  traceGaps?: GovernanceEvidenceTraceGap[];
  evaluatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface PrincipleEvidenceNormalizedMapping {
  mappingId: string;
  principleType: PrincipleEvidenceNormalizedPrinciple;
  principleLabel: string;
  auditCategories: FullSystemGovernanceAuditCategory[];
  evidenceIds: string[];
  evidenceSummaries: string[];
  scoringDrivers: string[];
  reasoningChains: string[];
  limitations: string[];
  recommendationIds: string[];
  traceIds: string[];
  confidenceImpact: number;
  riskImpact: number;
  mappingStrength: GovernanceEvidenceTraceStrength;
  humanReviewRequired: boolean;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface PrincipleEvidenceNormalizationGap {
  id: string;
  gapType: PrincipleEvidenceNormalizationGapType;
  principleType?: PrincipleEvidenceNormalizedPrinciple;
  auditCategory?: FullSystemGovernanceAuditCategory;
  mappingId?: string;
  description: string;
  evidence: string[];
  recommendedHumanReview: string;
  confidenceScore: number;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface PrincipleEvidenceNormalizationResult {
  normalizationScore: number;
  normalizationClassification: PrincipleEvidenceNormalizationClassification;
  mappings: PrincipleEvidenceNormalizedMapping[];
  gaps: PrincipleEvidenceNormalizationGap[];
  principleMappingStrength: string[];
  evidenceMappingStrength: string[];
  scoringDriverConsistency: string[];
  recommendationLinkageConsistency: string[];
  limitationLinkageConsistency: string[];
  reasoningChainConsistency: string[];
  weakMappings: string[];
  missingMappings: string[];
  inconsistentMappings: string[];
  governanceSemanticDriftRisks: string[];
  humanReviewNotes: string[];
  futureUpgradeRecommendations: string[];
  explainability: {
    summary: string[];
    normalizationRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
