import type {
  FullSystemGovernanceAuditCategory,
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
  FullSystemGovernanceAuditResult,
} from "./full-system-governance-audit-types";
import type { ReputationGovernanceDoctrinePrincipleType } from "./reputation/reputation-governance-doctrine-types";

export type GovernanceEvidenceTraceStrength =
  | "weak"
  | "moderate"
  | "strong"
  | "institutionally_traceable";

export type GovernanceTraceEvidenceType =
  | "audit_finding"
  | "category_score"
  | "scoring_driver"
  | "risk"
  | "limitation"
  | "recommendation"
  | "governance_principle"
  | "human_review";

export type GovernanceEvidenceTraceGapType =
  | "missing_evidence_link"
  | "weak_source_attribution"
  | "unsupported_scoring_driver"
  | "unclear_reasoning_chain"
  | "missing_limitation_linkage"
  | "weak_recommendation_linkage"
  | "weak_principle_evidence_connection"
  | "inconsistent_audit_category_mapping";

export interface GovernanceEvidenceTraceLink {
  traceId: string;
  evidenceId: string;
  evidenceType: GovernanceTraceEvidenceType;
  evidenceSource: string;
  sourceModule: string;
  auditCategory: FullSystemGovernanceAuditCategory;
  governancePrinciple: ReputationGovernanceDoctrinePrincipleType | "system_governance_safety" | "not_supplied";
  scoringDriver: string;
  evidenceSummary: string;
  reasoningLink: string;
  limitation: string;
  confidenceImpact: number;
  riskImpact: number;
  recommendationId: string;
  humanReviewRequired: boolean;
  traceStrength: GovernanceEvidenceTraceStrength;
}

export interface GovernanceEvidenceTraceabilityInput {
  auditResult?: FullSystemGovernanceAuditResult;
  auditFindings?: FullSystemGovernanceAuditFinding[];
  recommendations?: FullSystemGovernanceAuditRecommendation[];
  traceLinks?: GovernanceEvidenceTraceLink[];
  evaluatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface GovernanceEvidenceTraceGap {
  id: string;
  gapType: GovernanceEvidenceTraceGapType;
  auditCategory?: FullSystemGovernanceAuditCategory;
  evidenceId?: string;
  description: string;
  evidence: string[];
  recommendedHumanReview: string;
  confidenceScore: number;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceEvidenceTraceabilityResult {
  traceabilityScore: number;
  traceabilityClassification: GovernanceEvidenceTraceStrength;
  traces: GovernanceEvidenceTraceLink[];
  gaps: GovernanceEvidenceTraceGap[];
  traceStrengths: string[];
  traceWeaknesses: string[];
  missingLinks: string[];
  evidenceGaps: string[];
  limitationGaps: string[];
  recommendationLinkageGaps: string[];
  humanReviewNotes: string[];
  futureUpgradeRecommendations: string[];
  explainability: {
    summary: string[];
    traceabilityRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
