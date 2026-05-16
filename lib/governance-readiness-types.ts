import type { EnterpriseReputationAggregationResult } from "./reputation/reputation-aggregation-types";
import type { ReputationEvidenceQualityResult } from "./reputation/reputation-evidence-quality-types";
import type { ReputationGovernanceAlignmentResult } from "./reputation/reputation-governance-alignment-types";
import type { ReputationGovernanceAssuranceResult } from "./reputation/reputation-governance-assurance-types";
import type { ReputationGovernanceContinuityResult } from "./reputation/reputation-governance-continuity-types";
import type { ReputationGovernanceDoctrineResult } from "./reputation/reputation-governance-doctrine-types";
import type { ReputationGovernanceLineageResult } from "./reputation/reputation-governance-lineage-types";
import type { ReputationGovernanceMemoryResult } from "./reputation/reputation-governance-memory-types";
import type {
  ReputationArchitectureImprovementItem,
  ReputationGovernanceResilienceResult,
} from "./reputation/reputation-governance-resilience-types";
import type { ReputationGovernanceResult } from "./reputation/reputation-governance-types";
import type { ReputationRemediationPlanningResult } from "./reputation/reputation-remediation-types";
import type { ReputationResolutionTrackingResult } from "./reputation/reputation-resolution-types";
import type { ReputationTrendResult } from "./reputation/reputation-trend-types";

export interface GovernanceReadinessInput {
  assuranceResult?: ReputationGovernanceAssuranceResult;
  alignmentResult?: ReputationGovernanceAlignmentResult;
  doctrineResult?: ReputationGovernanceDoctrineResult;
  memoryResult?: ReputationGovernanceMemoryResult;
  resilienceResult?: ReputationGovernanceResilienceResult;
  continuityResult?: ReputationGovernanceContinuityResult;
  lineageResult?: ReputationGovernanceLineageResult;
  evidenceQualityResult?: ReputationEvidenceQualityResult;
  resolutionResult?: ReputationResolutionTrackingResult;
  remediationResult?: ReputationRemediationPlanningResult;
  governanceResult?: ReputationGovernanceResult;
  trendResult?: ReputationTrendResult;
  aggregationResult?: EnterpriseReputationAggregationResult;
  evaluatedAt: string;
  metadata?: Record<string, unknown>;
}

export type GovernanceReadinessClassification =
  | "not_ready"
  | "developing"
  | "operationally_ready"
  | "institutionally_ready";

export type GovernanceReadinessArea =
  | "assurance_readiness"
  | "alignment_readiness"
  | "doctrine_readiness"
  | "memory_readiness"
  | "continuity_readiness"
  | "resilience_readiness"
  | "evidence_readiness"
  | "lineage_readiness"
  | "reviewability_readiness"
  | "explainability_readiness";

export interface GovernanceReadinessConfidenceScores {
  assuranceReadinessScore: number;
  alignmentReadinessScore: number;
  doctrineReadinessScore: number;
  memoryReadinessScore: number;
  continuityReadinessScore: number;
  resilienceReadinessScore: number;
  evidenceReadinessScore: number;
  lineageReadinessScore: number;
  reviewabilityReadinessScore: number;
  explainabilityReadinessScore: number;
}

export interface GovernanceReadinessFinding {
  id: string;
  readinessArea: GovernanceReadinessArea;
  classification: GovernanceReadinessClassification;
  description: string;
  supportingEvidence: string[];
  limitingEvidence: string[];
  affectedGovernanceDomains: string[];
  confidenceScore: number;
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface GovernanceReadinessResult {
  overallReadinessScore: number;
  readinessClassification: GovernanceReadinessClassification;
  confidenceScores: GovernanceReadinessConfidenceScores;
  findings: GovernanceReadinessFinding[];
  strengths: string[];
  weaknesses: string[];
  supportingEvidence: string[];
  limitations: string[];
  readinessDrivers: string[];
  governancePreparednessIndicators: string[];
  driftSignals: string[];
  recommendations: string[];
  humanReviewRequired: boolean;
  architectureImprovementReview: ReputationArchitectureImprovementItem[];
  explainability: {
    summary: string[];
    readinessRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
