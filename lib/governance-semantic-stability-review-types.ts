import type {
  FullSystemGovernanceAuditFinding,
  FullSystemGovernanceAuditRecommendation,
  FullSystemGovernanceAuditResult,
} from "./full-system-governance-audit-types";
import type { GovernanceEvidenceTraceabilityResult } from "./governance-evidence-traceability-types";
import type { GovernancePrincipleRegistryReviewResult } from "./governance-principle-registry-review-types";
import type { GovernanceReadinessResult } from "./governance-readiness-types";
import type { PrincipleEvidenceNormalizationResult } from "./principle-evidence-normalization-types";
import type { ReputationEvidenceQualityResult } from "./reputation/reputation-evidence-quality-types";
import type { ReputationGovernanceAlignmentResult } from "./reputation/reputation-governance-alignment-types";
import type { ReputationGovernanceAssuranceResult } from "./reputation/reputation-governance-assurance-types";
import type { ReputationGovernanceContinuityResult } from "./reputation/reputation-governance-continuity-types";
import type {
  ReputationGovernanceDoctrinePrinciple,
  ReputationGovernanceDoctrineResult,
} from "./reputation/reputation-governance-doctrine-types";
import type { ReputationGovernanceResilienceResult } from "./reputation/reputation-governance-resilience-types";
import type { ReputationSeverity } from "./reputation/reputation-types";

export type GovernanceSemanticStabilityClassification =
  | "unstable"
  | "mostly_stable"
  | "stable"
  | "institutionally_stable";

export type GovernanceSemanticStabilityDomain =
  | "governance_terminology"
  | "audit_categories"
  | "evidence_categories"
  | "scoring_drivers"
  | "doctrine_principles"
  | "recommendation_language"
  | "limitation_language"
  | "traceability_language"
  | "readiness_classifications"
  | "assurance_classifications"
  | "resilience_classifications"
  | "registry_readiness_classifications"
  | "normalization_classifications";

export type GovernanceSemanticStabilityFindingType =
  | "semantic_drift"
  | "terminology_inconsistency"
  | "duplicated_meaning"
  | "conflicting_meaning"
  | "classification_mismatch"
  | "scoring_semantic_instability"
  | "weak_evidence_term_alignment"
  | "weak_principle_term_alignment"
  | "recommendation_ambiguity"
  | "limitation_ambiguity"
  | "traceability_terminology_gap"
  | "doctrine_vocabulary_instability"
  | "future_registry_instability_risk";

export interface GovernanceSemanticStabilityInput {
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
  doctrinePrinciples?: ReputationGovernanceDoctrinePrinciple[];
  resilienceResult?: ReputationGovernanceResilienceResult;
  continuityResult?: ReputationGovernanceContinuityResult;
  evidenceQualityResult?: ReputationEvidenceQualityResult;
  evaluatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface GovernanceSemanticTermObservation {
  term: string;
  normalizedTerm: string;
  domain: GovernanceSemanticStabilityDomain;
  sourceModule: string;
  evidence: string;
}

export interface GovernanceSemanticStabilityFinding {
  id: string;
  findingType: GovernanceSemanticStabilityFindingType;
  domain: GovernanceSemanticStabilityDomain;
  severity: ReputationSeverity;
  description: string;
  evidence: string[];
  affectedTerms: string[];
  recommendedHumanReview: string;
  confidenceScore: number;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceSemanticDomainAssessment {
  domain: GovernanceSemanticStabilityDomain;
  score: number;
  classification: GovernanceSemanticStabilityClassification;
  stableTerms: string[];
  unstableTerms: string[];
  limitations: string[];
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceSemanticStabilityResult {
  semanticStabilityScore: number;
  semanticStabilityClassification: GovernanceSemanticStabilityClassification;
  domainAssessments: GovernanceSemanticDomainAssessment[];
  findings: GovernanceSemanticStabilityFinding[];
  stableTerms: string[];
  unstableTerms: string[];
  duplicatedTerms: string[];
  conflictingTerms: string[];
  driftRisks: string[];
  scoringSemanticFindings: string[];
  evidenceSemanticFindings: string[];
  doctrineSemanticFindings: string[];
  recommendationSemanticFindings: string[];
  limitationSemanticFindings: string[];
  traceabilitySemanticFindings: string[];
  registryReadinessImplications: string[];
  humanReviewNotes: string[];
  futureStabilizationRecommendations: string[];
  humanReviewRequired: boolean;
  explainability: {
    summary: string[];
    semanticStabilityRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
