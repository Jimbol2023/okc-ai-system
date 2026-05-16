import type { EnterpriseReputationAggregationResult } from "./reputation-aggregation-types";
import type { ReputationEvidenceQualityResult } from "./reputation-evidence-quality-types";
import type { ReputationGovernanceAlignmentResult } from "./reputation-governance-alignment-types";
import type { ReputationGovernanceContinuityResult } from "./reputation-governance-continuity-types";
import type { ReputationGovernanceDoctrineResult } from "./reputation-governance-doctrine-types";
import type { ReputationGovernanceLineageResult } from "./reputation-governance-lineage-types";
import type { ReputationGovernanceMemoryResult } from "./reputation-governance-memory-types";
import type {
  ReputationArchitectureImprovementItem,
  ReputationGovernanceResilienceResult,
} from "./reputation-governance-resilience-types";
import type { ReputationGovernanceResult } from "./reputation-governance-types";
import type { ReputationRemediationPlanningResult } from "./reputation-remediation-types";
import type { ReputationResolutionTrackingResult } from "./reputation-resolution-types";
import type { ReputationTrendResult } from "./reputation-trend-types";

export interface ReputationGovernanceAssuranceInput {
  doctrineResult?: ReputationGovernanceDoctrineResult;
  alignmentResult?: ReputationGovernanceAlignmentResult;
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

export type ReputationGovernanceAssuranceStatus =
  | "weak"
  | "developing"
  | "reliable"
  | "institutionally_durable";

export type ReputationGovernanceAssuranceType =
  | "doctrine_assurance"
  | "evidence_assurance"
  | "continuity_assurance"
  | "resilience_assurance"
  | "lineage_assurance"
  | "reviewability_assurance"
  | "governance_reliability_assurance";

export interface ReputationGovernanceAssuranceFinding {
  id: string;
  assuranceType: ReputationGovernanceAssuranceType;
  status: ReputationGovernanceAssuranceStatus;
  description: string;
  supportingEvidence: string[];
  conflictingEvidence: string[];
  affectedGovernanceDomains: string[];
  confidenceScore: number;
  recommendedHumanReview: string;
  explainability: {
    factors: string[];
    reasoning: string[];
  };
}

export interface ReputationGovernanceAssuranceResult {
  overallAssuranceStatus: ReputationGovernanceAssuranceStatus;
  governanceAssuranceScore: number;
  findings: ReputationGovernanceAssuranceFinding[];
  assuranceStrengths: string[];
  assuranceWeaknesses: string[];
  assuranceDriftFindings: string[];
  governanceReliabilityIndicators: string[];
  recommendations: string[];
  architectureImprovementReview: ReputationArchitectureImprovementItem[];
  explainability: {
    summary: string[];
    assuranceRulesApplied: string[];
    majorDrivers: string[];
    limitations: string[];
  };
}
